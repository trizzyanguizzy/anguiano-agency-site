import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio of web applications, infrastructure tools, and open-source contributions.',
};

export default function ProjectsPage() {
  return (
    <Container className="py-20">
      <AnimatedSection>
        <h1 className="text-4xl font-bold sm:text-5xl">Projects</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground-secondary">
          A showcase of my work in platform engineering, frontend development, and building scalable
          applications that serve thousands of users.
        </p>
      </AnimatedSection>

      <div className="mt-16">
        <ProjectsGrid />
      </div>
    </Container>
  );
}
