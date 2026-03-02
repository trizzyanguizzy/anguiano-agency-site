import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/content/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      {/* Project Image */}
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-background-secondary">
        <div className="flex h-full items-center justify-center text-gray-400">
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

      {/* Project Content */}
      <div className="mt-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="mt-1 text-sm font-medium text-primary-600">{project.company}</p>
          </div>
          {project.featured && (
            <Badge variant="secondary" className="flex-shrink-0">
              Featured
            </Badge>
          )}
        </div>

        <p className="mt-3 text-gray-700 dark:text-gray-300">{project.description}</p>

        <div className="mt-4 rounded-lg bg-background-secondary p-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Impact</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{project.impact}</p>
        </div>
      </div>

      {/* Technologies */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="primary">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Link */}
      {project.link && (
        <div className="mt-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline"
          >
            View Project
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </Card>
  );
}
