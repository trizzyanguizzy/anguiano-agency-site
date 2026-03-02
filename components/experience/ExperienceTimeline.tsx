'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { experiences } from '@/content/experience';

export function ExperienceTimeline() {
  return (
    <div className="relative space-y-8">
      {/* Timeline line */}
      <div className="absolute left-0 top-8 hidden h-full w-px bg-gradient-to-b from-border-default to-transparent md:block" />

      {experiences.map((exp, index) => (
        <AnimatedSection key={`${exp.company}`} delay={0.1 * (index + 1)}>
          <div className="relative flex gap-8">
            {/* Timeline dot */}
            <div className="relative hidden md:block">
              <div className="absolute -left-2 top-6 h-4 w-4 rounded-full border-4 border-accent-orange bg-background-primary" />
            </div>

            {/* Content */}
            <Card className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{exp.title}</h3>
                  <p className="mt-1 text-lg font-medium text-accent-orange">{exp.company}</p>
                  <p className="mt-1 text-sm text-foreground-tertiary">
                    {exp.location}
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex gap-3 text-foreground-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-orange" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Badge key={tech} variant="default">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
