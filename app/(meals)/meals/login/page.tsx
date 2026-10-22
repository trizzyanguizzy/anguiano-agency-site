import { LoginForm } from '@/components/meals/LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-[80vh] flex-col justify-center">
      <h1 className="text-3xl font-semibold">Meals</h1>
      <p className="mt-2 text-foreground-secondary">Enter the household passcode.</p>
      <LoginForm next={next ?? '/meals'} />
      <p className="mt-6 text-sm text-foreground-tertiary">
        On iPhone, the Home Screen app keeps its own login, separate from Safari. Log in once inside each.
      </p>
    </main>
  );
}
