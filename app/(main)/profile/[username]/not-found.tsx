import Link from 'next/link';

import { Button, H2, Sub } from '@/components/ui';

export default function ProfileNotFound() {
  return (
    <div className="mx-auto max-w-[680px] py-16 text-center">
      <H2>Profile not found</H2>
      <Sub className="mt-2">We couldn&apos;t find anyone with that username.</Sub>
      <Link href="/home" className="mt-6 inline-block">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
