import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SITE_CONFIG, QUICK_STATS } from '@/lib/constants';
import { projects } from '@/content/projects';

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 sm:py-32">
        {/* Subtle gradient background */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-accent-orange/5 via-transparent to-transparent" /> */}

        <Container className="relative">
          <AnimatedSection className="text-center">
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              Hi, I'm{' '}
              <span className="relative inline-block">
                {SITE_CONFIG.name}
                {/* Orange underline accent */}
                <span className="absolute bottom-2 left-0 h-1 w-full bg-accent-orange opacity-60" />
              </span>
            </h1>
            <p className="mt-8 text-xl text-foreground-secondary sm:text-2xl max-w-3xl mx-auto">
              {SITE_CONFIG.title}
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-tertiary">
              {SITE_CONFIG.tagline}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/projects">
                <Button size="lg">View Projects</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Me
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Quick Stats */}
      <section className="border-y border-border-default bg-background-secondary py-16">
        <Container>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <AnimatedSection delay={0.1} className="text-center">
              <p className="text-5xl font-bold text-accent-orange tabular-nums">
                {QUICK_STATS.yearsExperience}
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-foreground-tertiary">
                Years of Experience
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="text-center">
              <p className="text-5xl font-bold text-accent-orange tabular-nums">
                {QUICK_STATS.companies}
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-foreground-tertiary">
                Companies Worked With
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="text-center">
              <p className="text-5xl font-bold text-accent-orange tabular-nums">
                {QUICK_STATS.technologies}+
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-foreground-tertiary">
                Technologies Mastered
              </p>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <h2 className="text-center text-3xl font-bold sm:text-4xl text-foreground-primary">
              Featured Projects
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground-secondary">
              A selection of my recent work showcasing expertise in platform engineering and frontend
              development.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <AnimatedSection key={project.title} delay={0.1 * (index + 1)}>
                <Card className="group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-video w-full overflow-hidden bg-background-secondary">
                    {/* Orange overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Placeholder for project image */}
                    <div className="flex h-full items-center justify-center text-foreground-tertiary">
                      <svg
                        className="h-16 w-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-5 flex-1 px-6 pb-6">
                    <h3 className="text-xl font-semibold text-foreground-primary">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-foreground-tertiary">
                      {project.company}
                    </p>
                    <p className="mt-3 text-foreground-secondary leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 px-6 pb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="default">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="mt-12 text-center">
            <Link href="/projects">
              <Button variant="outline" size="lg">
                View All Projects
              </Button>
            </Link>
          </AnimatedSection>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border-default bg-background-secondary py-24">
        <Container>
          <AnimatedSection className="text-center">
            <h2 className="text-4xl font-bold sm:text-5xl text-foreground-primary">
              Let's Work Together
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-foreground-secondary">
              I'm always interested in hearing about new opportunities and projects. Feel free to
              reach out!
            </p>
            <div className="mt-10">
              <Link href="/contact">
                <Button size="lg">Get in Touch</Button>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </div>
  );
}
