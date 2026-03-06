export interface Experience {
  company: string;
  title: string;
  location: string;
  period: string;
  duration: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Medical Solutions',
    title: 'Senior Software Engineer',
    location: 'Remote',
    period: '02/2023 – 12/2024',
    duration: '1y 9m',
    achievements: [
      'Developed 100% of a Credentials feature UI, allowing travel clinicians to upload and store professional credentials in blob storage, resulting in increased clinician ownership during onboarding and employment for contract work.',
      'Developed 100% of a Profile Strength feature UI, gamifying the information submission process and providing a roadmap for clinicians, resulting in higher task completion rates, reduced recruiter stress, and an overall smoother onboarding experience.',
      'Maintained an average output of 15 story points per two-week sprint using Azure DevOps, ensuring steady feature delivery and meeting project deadlines consistently.',
      'Modernized a 2000+ line form by converting it to use React Hook Form, Yup, and Zod, transitioning from class components to functional, migrating state management and data fetching from Redux to Tanstack Query, and implementing custom hooks, improving maintainability and performance.',
      'Partnered with UX using Figma to design and build a drag-and-drop file upload component in React while refining the grid system with CSS Grid, resulting in improved usability and consistent layouts across the application.',
    ],
    technologies: ['React', 'TypeScript', 'React Hook Form', 'Yup', 'Zod', 'Tanstack Query', 'Redux', 'Azure Blob Storage', 'Azure DevOps', 'Figma', 'CSS Grid'],
  },
  {
    company: 'Fusion Medical Staffing',
    title: 'Front End Software Engineer II',
    location: 'Remote',
    period: '06/2021 – 02/2023',
    duration: '1y 8m',
    achievements: [
      "Developed and deployed 'Marketplace', a React Native mobile app, a platform for travel nurses to search for jobs, agencies to list their details and perks, resulting in 14K new users on iOS and Android on launch day.",
      "Collaborated with the Product team to develop more than 5 new features in React for the 'Marketplace' web app, resulting in over $1M in lead generation for the company.",
      'Collaborated with the UX team to refine UI designs in Figma and implemented Storybook to house over 10 custom-built React UI components, enhancing design consistency and developer accessibility.',
      'Onboarded and mentored two new developers, who successfully contributed to the React and React Native projects, enhancing overall scrum output.',
    ],
    technologies: ['React Native', 'React', 'TypeScript', 'Storybook', 'Figma', 'iOS', 'Android'],
  },
  {
    company: 'Buildertrend',
    title: 'Full Stack Software Engineer',
    location: 'Omaha, NE',
    period: '07/2019 – 06/2021',
    duration: '2y',
    achievements: [
      'Contributed to the migration of over 1M lines of legacy WebForms code, leading to improved maintainability and future-proofing of the application using TypeScript & React.',
      'Wrote and ran targeted SQL & LINQ scripts, effectively maintaining data integrity and application performance.',
      'Created and implemented 5+ RESTful API services using in-house ORM, which optimized data flow and service functionality.',
      'On the bug triage team, resolved over 100 issues in three months, reducing the application defects backlog by 30% and improving application reliability.',
      'Developed technical discovery plans and level of effort outlines, and executed them post-approval, providing stakeholders with a clear breakdown of work, business requirements, and timelines, ensuring alignment and informed decision-making.',
    ],
    technologies: ['TypeScript', 'React', 'SQL', 'LINQ', '.NET', 'RESTful APIs', 'WebForms'],
  },
  {
    company: 'Union Pacific',
    title: 'Software Engineer Intern',
    location: 'Omaha, NE',
    period: '08/2016 – 07/2019',
    duration: '2y 9m',
    achievements: [
      'Developed an AngularJS application for a DevOps initiative to streamline the production application publish process.',
      'Leveraged Atlassian Jira Rest Web API to develop an AngularJS application that assisted management in the allocation of financials and resources to projects in the IT department.',
      'Developed a mobile application feature that connected mobile devices to AEI readers to retrieve information from cars in the train yard using Handlebars.js.',
    ],
    technologies: ['AngularJS', 'JavaScript', 'Jira REST API', 'Handlebars.js'],
  },
];
