import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SKILLS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills and expertise in modern web development, platform engineering, and more.',
};

const skillCategories = [
  { title: 'Languages', skills: SKILLS.languages, icon: '💻' },
  { title: 'Frontend Frameworks', skills: SKILLS.frontend, icon: '⚛️' },
  { title: 'Backend', skills: SKILLS.backend, icon: '🔧' },
  { title: 'Tools & DevOps', skills: SKILLS.tools, icon: '🛠️' },
  { title: 'Testing', skills: SKILLS.testing, icon: '✅' },
  { title: 'Cloud & Infrastructure', skills: SKILLS.cloudDevOps, icon: '☁️' },
  { title: 'Other Technologies', skills: SKILLS.other, icon: '🚀' },
];

export default function SkillsPage() {
  return (
    <Container className="py-20">
      <AnimatedSection>
        <h1 className="text-4xl font-bold sm:text-5xl">Skills & Technologies</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground-secondary">
          A comprehensive overview of my technical expertise across frontend, backend, DevOps, and
          platform engineering.
        </p>
      </AnimatedSection>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {skillCategories.map((category, index) => (
          <AnimatedSection key={category.title} delay={0.1 * (index + 1)}>
            <Card className="h-full">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="primary"
                    className="hover:scale-105 hover:shadow-md transition-all"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.8} className="mt-12">
        <Card className="bg-gradient-to-r from-accent-orange/10 to-accent-orange/5">
          <h3 className="text-xl font-semibold">Continuous Learner</h3>
          <p className="mt-3 text-foreground-secondary">
            I'm always exploring new technologies and keeping up with the latest developments in web
            development, platform engineering, and accessibility. Currently diving deeper into
            infrastructure as code, observability, and advanced React patterns.
          </p>
        </Card>
      </AnimatedSection>
    </Container>
  );
}
