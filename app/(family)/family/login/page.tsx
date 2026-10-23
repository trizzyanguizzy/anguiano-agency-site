import Image from 'next/image';
import { LoginForm } from '@/components/family/LoginForm';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-[80vh] flex-col justify-center">
      <Image src="/family-assets/icon-192.png" alt="" width={64} height={64} className="mb-5 rounded-2xl" priority />
      <h1 className="text-[2.25rem]">Anguiano</h1>
      <p className="mt-2 text-foreground-secondary">Enter the family passcode.</p>
      <LoginForm next={next ?? '/family'} />
      <p className="mt-6 text-sm text-foreground-tertiary">
        On iPhone, the Home Screen app keeps its own login, separate from Safari. Log in once inside each.
      </p>
    </main>
  );
}
