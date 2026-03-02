import { projects } from '@/content/projects';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function ProjectsGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {projects.map((project, index) => (
        <AnimatedSection key={project.title} delay={0.1 * (index + 1)}>
          <ProjectCard project={project} />
        </AnimatedSection>
      ))}
    </div>
  );
}
