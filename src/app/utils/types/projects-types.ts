import { StaticImageData } from "next/image";

export enum ProjectNames {
  Buildertrend = "Buildertrend",
  CiroMedSol = "ciro by Medical Solutions",
  FusionMedStaff = "Fusion Medical Staffing",
  CiroShift = "cSM by Medical Solutions",
  Hudl = "Hudl",
}

export type Project = {
  name: ProjectNames;
  url: string;
  img: StaticImageData;
  description: string;
  skills: string[];
};
