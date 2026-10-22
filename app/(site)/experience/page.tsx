import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'My professional journey through platform engineering and software development.',
};

export default function ExperiencePage() {
  return (
    <Container className="py-20">
      <AnimatedSection>
        <h1 className="text-4xl font-bold sm:text-5xl">Experience</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground-secondary">
          My professional journey spanning full-stack development and building
          accessible web applications at scale.
        </p>
      </AnimatedSection>

      <div className="mt-16">
        <ExperienceTimeline />
      </div>
    </Container>
  );
}
