'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { signupSchema, toFieldErrors } from '@/lib/validations/auth';
import { Button, Card, H1, Input, Meta, Sub } from '@/components/ui';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ email, password, name, username });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }
    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { name: parsed.data.name, username: parsed.data.username } },
    });
    setSubmitting(false);

    if (error) {
      // A duplicate username makes the DB trigger's insert violate its unique constraint, which
      // rolls back the whole signup and surfaces a generic "Database error saving new user". We
      // can't tell username-taken from email-taken from the text, so show one honest message.
      const takenLike = /database error|already registered|already exists|user already/i.test(
        error.message,
      );
      setFormError(
        takenLike
          ? 'That username or email may already be in use — try a different one.'
          : 'Something went wrong creating your account. Please try again.',
      );
      return;
    }
    router.push('/onboarding');
  };

  return (
    <Card>
      <H1 className="text-[26px]">Create your account</H1>
      <Sub className="mt-1.5">Find people to build your next project with.</Sub>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-ink">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
          {fieldErrors.name && <Meta className="text-primary">{fieldErrors.name}</Meta>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-semibold text-ink">
            Username
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ada-lovelace"
            autoComplete="username"
          />
          {fieldErrors.username ? (
            <Meta className="text-primary">{fieldErrors.username}</Meta>
          ) : (
            <Meta className="text-text-meta">
              Lowercase letters, numbers, and hyphens. Becomes your profile URL.
            </Meta>
          )}
        </div>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          {fieldErrors.password ? (
            <Meta className="text-primary">{fieldErrors.password}</Meta>
          ) : (
            <Meta className="text-text-meta">At least 6 characters.</Meta>
          )}
        </div>

        {formError && <Meta className="text-primary">{formError}</Meta>}

        <Button type="submit" variant="primary" loading={submitting} className="mt-1 w-full">
          Create account
        </Button>
      </form>

      <Meta className="mt-5 text-center text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </Meta>
    </Card>
  );
}
