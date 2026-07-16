'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { loginSchema, toFieldErrors } from '@/lib/validations/auth';
import { Button, Card, H1, Input, Meta, Sub } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);

    if (error) {
      // Generic message on purpose — don't reveal whether the email exists.
      setFormError('Invalid email or password.');
      return;
    }
    router.push('/home');
  };

  return (
    <Card>
      <H1 className="text-[26px]">Welcome back</H1>
      <Sub className="mt-1.5">Log in to keep building.</Sub>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && <Meta className="text-primary">{fieldErrors.email}</Meta>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
          {fieldErrors.password && <Meta className="text-primary">{fieldErrors.password}</Meta>}
        </div>

        {formError && <Meta className="text-primary">{formError}</Meta>}

        <Button type="submit" variant="primary" loading={submitting} className="mt-1 w-full">
          Log in
        </Button>
      </form>

      <Meta className="mt-5 text-center text-text-secondary">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-primary">
          Create an account
        </Link>
      </Meta>
    </Card>
  );
}
