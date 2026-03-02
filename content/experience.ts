export interface Experience {
  company: string;
  title: string;
  location: string;
  // period: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  // {
  //   company: 'Hudl',
  //   title: 'Platform Software Engineer',
  //   location: 'Remote',
  //   period: 'December 2024 – Present',
  //   achievements: [
  //     'Improved visibility into component-driven development by integrating Storybook with Chromatic, enabling designers and engineers to preview, test, and collaborate on UI components in isolation',
  //     'Standardized accessibility in Hudl\'s frontend monorepo by integrating React Aria and vitest-axe, ensuring components meet WCAG 2.1 AA compliance out-of-the-box',
  //     'Automated Slack notifications for failed builds and deployed a Redash dashboard to visualize CI/CD health, enabling teams to identify and resolve pipeline issues 40% faster',
  //     'Increased engineering efficiency by defining microservices in OpsLevel using Terraform, providing centralized ownership, documentation, and dependency mapping across 200+ services',
  //   ],
  //   technologies: ['Terraform', 'OpsLevel', 'Storybook', 'Chromatic', 'React Aria', 'vitest-axe', 'Snowplow', 'Redash'],
  // },
  {
    company: 'Medical Solutions',
    title: 'Senior Software Engineer',
    location: 'Remote',
    // period: 'April 2024 – December 2024',
    achievements: [
      'Led development of credentials feature in internal application, enabling 5,000+ users to upload and manage compliance documents, reducing manual processing time by 60%',
      'Architected blob storage integration using Azure, reducing document retrieval times from 3 seconds to under 500ms while maintaining HIPAA compliance',
      'Mentored junior engineers on React best practices, TypeScript patterns, and testing strategies, resulting in 30% reduction in code review cycles',
      'Improved application performance by implementing code splitting and lazy loading, reducing initial bundle size by 40%',
    ],
    technologies: ['React', 'TypeScript', 'Azure Blob Storage', 'React Hook Form', 'Zod', 'Tanstack Query'],
  },
  {
    company: 'Fusion Medical Staffing',
    title: 'Front End Software Engineer II',
    location: 'Omaha, NE',
    // period: 'August 2022 – March 2024',
    achievements: [
      'Built and maintained React Native mobile app serving 14,000+ healthcare professionals, providing job search, application tracking, and document management',
      'Optimized mobile app performance by reducing JavaScript bundle size by 35% and implementing native modules for CPU-intensive operations',
      'Implemented comprehensive E2E testing suite using Playwright, increasing test coverage from 40% to 85% and reducing production bugs by 50%',
      'Collaborated with UX designers to redesign application flow, resulting in 25% increase in job applications submitted',
    ],
    technologies: ['React Native', 'TypeScript', 'Expo', 'Playwright', 'React Navigation', 'Styled Components'],
  },
  {
    company: 'Buildertrend',
    title: 'Full Stack Software Engineer',
    location: 'Omaha, NE',
    // period: 'June 2021 – August 2022',
    achievements: [
      'Developed and maintained features for construction management SaaS platform used by 10,000+ construction companies',
      'Built RESTful APIs using .NET Core and Entity Framework, serving 1M+ requests per day with 99.9% uptime',
      'Migrated legacy AngularJS components to React, improving load times by 50% and enhancing maintainability',
      'Implemented real-time notifications using SignalR, improving user engagement by 30%',
    ],
    technologies: ['React', 'TypeScript', '.NET Core', 'Entity Framework', 'SQL Server', 'SignalR'],
  },
  {
    company: 'Union Pacific',
    title: 'Software Engineer Intern',
    location: 'Omaha, NE',
    // period: 'May 2018 – August 2018',
    achievements: [
      'Developed internal web applications for railroad operations tracking, serving 500+ employees',
      'Built reporting dashboard using React and .NET, providing real-time visibility into train schedules and maintenance',
      'Collaborated with senior engineers on database optimization, reducing query execution times by 40%',
    ],
    technologies: ['React', 'C#', '.NET', 'SQL Server', 'JavaScript'],
  },
];
