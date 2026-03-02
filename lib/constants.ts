export const SITE_CONFIG = {
  name: 'Tristan Anguiano',
  title: 'Software Engineer',
  tagline: 'Building accessible, scalable web applications with modern technologies',
  email: 'anguiano.dev@gmail.com',
  domain: 'tristananguiano.com',
  url: 'https://tristananguiano.com',
  description: 'Software Engineer specializing in React, TypeScript, .NET, and accessible web applications.',
};

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/in/tristan-anguiano',
  github: undefined as string | undefined, // Optional
};

export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Skills', href: '/skills' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
] as const;

export const SKILLS = {
  languages: ['TypeScript', 'JavaScript', 'C#', 'SQL', 'Java'],
  frontend: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'Styled Components'],
  backend: ['Node.js', '.NET', 'FeathersJS'],
  tools: [
    'Terraform',
    'Turbo',
    'Turborepo',
    'pnpm',
    'Vite',
    'Vitest',
    'Storybook',
    'Chromatic',
  ],
  testing: ['Playwright', 'vitest-axe', 'React Testing Library'],
  cloudDevOps: ['OpsLevel', 'Snowplow', 'Redash', 'Sumo Logic'],
  other: ['Zod', 'Tanstack Query', 'React Aria', 'React Hook Form'],
} as const;

export const QUICK_STATS = {
  yearsExperience: '7+',
  companies: 5,
  technologies: 20,
} as const;
