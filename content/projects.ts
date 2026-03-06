export interface Project {
  title: string;
  company: string;
  description: string;
  image: string;
  technologies: string[];
  impact: string;
  link?: string;
  featured: boolean;
}

export const projects: Project[] = [
  // {
  //   title: 'Uniform Component Library',
  //   company: 'Hudl',
  //   description: 'Built a comprehensive design system with accessible React components using React Aria. Integrated Storybook and Chromatic for component documentation and visual regression testing.',
  //   image: '/images/projects/uniform.jpg',
  //   technologies: ['React', 'TypeScript', 'React Aria', 'Storybook', 'Chromatic', 'vitest-axe'],
  //   impact: 'Standardized UI components across multiple teams, ensuring WCAG 2.1 AA compliance and reducing component development time by 50%',
  //   featured: true,
  // },
  // {
  //   title: 'CI/CD Pipeline Stability Tools',
  //   company: 'Hudl',
  //   description: 'Automated monitoring and alerting for CI/CD pipelines with Slack notifications and Redash dashboards. Provided real-time visibility into build health across 200+ microservices.',
  //   image: '/images/projects/cicd-dashboard.jpg',
  //   technologies: ['Terraform', 'Redash', 'Slack API', 'Snowplow', 'Python'],
  //   impact: 'Reduced mean time to resolution for build failures by 40%, enabling teams to identify and fix issues faster',
  //   featured: true,
  // },
  {
    title: 'Credentials Management Feature',
    company: 'Medical Solutions',
    description: 'Developed a document upload and management system for healthcare compliance documents. Integrated Azure Blob Storage for secure, HIPAA-compliant file storage.',
    image: '/images/projects/credentials.jpg',
    technologies: ['React', 'TypeScript', 'Azure Blob Storage', 'React Hook Form', 'Zod'],
    impact: 'Enabled 5,000+ users to self-manage compliance documents, reducing manual processing time by 60%',
    featured: true,
  },
  {
    title: 'Healthcare Marketplace Mobile App',
    company: 'Fusion Medical Staffing',
    description: 'Built and maintained a React Native mobile app for healthcare job search, applications, and document management, serving 14,000+ active users.',
    image: '/images/projects/marketplace-app.jpg',
    technologies: ['React Native', 'TypeScript', 'Expo', 'React Navigation', 'Styled Components'],
    impact: 'Improved user engagement by 25% through streamlined application flow and native mobile experience',
    featured: true,
  },
  // {
  //   title: 'Infrastructure as Code (IaC) Platform',
  //   company: 'Hudl',
  //   description: 'Defined and managed microservices infrastructure using Terraform and OpsLevel, providing centralized ownership, documentation, and dependency mapping.',
  //   image: '/images/projects/iac-platform.jpg',
  //   technologies: ['Terraform', 'OpsLevel', 'AWS', 'Kubernetes'],
  //   impact: 'Improved engineering efficiency by providing single source of truth for 200+ microservices',
  //   featured: false,
  // },
  {
    title: 'Real-time Notification System',
    company: 'Medical Solutions',
    description: 'Implemented real-time notifications using SignalR for shift staffing platform, delivering instant updates to users.',
    image: '/images/projects/notifications.jpg',
    technologies: ['SignalR', '.NET Core', 'React', 'TypeScript'],
    impact: 'Increased user engagement by 30% through instant notification delivery',
    featured: false,
  },
];
