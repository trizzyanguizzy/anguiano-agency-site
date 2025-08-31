import btDemo1 from "../../../public/btDemo1.png";
import ciroDemo1 from "../../../public/ciroDemo1.png";
import fmsDemo1 from "../../../public/fmsDemo1.jpeg";
import csmDemo1 from "../../../public/csmDemo1.png";
import hudlDemo from "../../../public/hudlDemo.png";
import { Project, ProjectNames } from "../utils/types/projects-types";

export default class ProjectsApi {
  static getProjects(): Project[] {
    return [
      {
        name: ProjectNames.Buildertrend,
        url: "https://buildertrend.net/summaryGrid.aspx",
        img: btDemo1,
        description: "A residential construction management platform.",
        skills: ["React", ".NET", "SQL", "C#", "Microsoft Webforms"],
      },
      {
        name: ProjectNames.CiroMedSol,
        url: "https://ciro.co",
        img: ciroDemo1,
        description:
          "A self-service platform allowing traveling health professionals to own their onboarding and employment experience.",
        skills: ["React", "Styled Components", "React Query"],
      },
      {
        name: ProjectNames.FusionMedStaff,
        url: "https://www.fusionmedstaff.com/",
        img: fmsDemo1,
        description:
          "A job search application for traveling health professionals.",
        skills: ["React Native", "React", "Styled Components", "React Query"],
      },
      {
        name: ProjectNames.CiroShift,
        url: "https://shifts.ciro.co",
        img: csmDemo1,
        description:
          "An application that allows travel health professionals to schedule Pro Re Nata (PRN/per-diem) work shifts at healthcare facilities.",
        skills: [
          "React",
          "Styled Components",
          "React Hook Form",
          "Zustand",
          "React Query",
          "Redux",
          "NodeJS",
        ],
      },
      {
        name: ProjectNames.Hudl,
        url: "https://www.hudl.com/",
        img: hudlDemo,
        description:
          "A suite of performance analysis tools empowering athletes and coaches with video breakdown, data insights, and collaborative feedback workflows.",
        skills: [
"Terraform", "OpsLevel", "snowplow.io", "vite", "vitest", "Redash", "turbo", "turborepo", "pnpm", "Devin AI", "Copilot w/ GPT-5 model", "Storybook", "Chromatic", "React", "TS"
        ],
      },
    ];
  }
}
