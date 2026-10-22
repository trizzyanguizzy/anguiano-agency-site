import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-accent-orange">404</h1>
            <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>
            <p className="mt-4 text-lg text-foreground-secondary">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="mt-8">
              <Link href="/">
                <Button size="lg">Go Home</Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
