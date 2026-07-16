import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/signup'];
const ONBOARDING_ROUTE = '/onboarding';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session cookie if needed — must be called to keep the user logged in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);

  if (!user) {
    if (!isAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  // Authenticated from here on.
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // profileComplete gating: queried via PostgREST (not Prisma — Prisma's Node-runtime
  // query engine doesn't work inside Next.js Middleware's Edge runtime) using the
  // "users can read their own row" RLS policy on User. Onboarding completion writes
  // this same column via server-side Prisma, so there's only one source of truth.
  const { data: profile } = await supabase
    .from('User')
    .select('profileComplete')
    .eq('supabaseId', user.id)
    .single();
  const profileComplete = profile?.profileComplete === true;

  if (!profileComplete && !isOnboardingRoute) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }

  if (profileComplete && isOnboardingRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
