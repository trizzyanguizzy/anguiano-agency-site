import { ProjectNames } from "@/app/utils/types/projects-types";
import { IconExternalLink } from "@tabler/icons-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

type ProjectCardProps = {
  name: ProjectNames;
  url: string;
  img: StaticImageData;
  description: string;
  skills: string[];
  index: number;
};

export const ProjectCard = ({
  name,
  url,
  img,
  description,
  skills,
  index,
}: ProjectCardProps) => {
  const isReversed = index % 2;

  const getProjectColor = (name: string): string => {
    switch (name) {
      case ProjectNames.Buildertrend:
        return `#0276cc`;
      case ProjectNames.CiroMedSol:
        return `#e17c58`;
      case ProjectNames.FusionMedStaff:
        return `#8bd4bb`;
      default:
        return `#7a5499`;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus:outline-none"
      aria-label={`${name} project (opens in new tab)`}
    >
      <div
        className={`relative flex flex-col md:flex-row ${
          isReversed ? "md:flex-row-reverse" : ""
        } rounded-2xl overflow-hidden transition-all duration-500 bg-secondary/80 backdrop-blur-sm border border-glass hover:border-white/20 hover:bg-tertiary/70 focus-visible:ring-2 focus-visible:ring-medium-orchid/60`}
      >
        {/* glow */}
        <div
          className={`pointer-events-none absolute -z-[1] h-[22rem] w-[42rem] blur-[140px] opacity-60 ${
            isReversed ? "left-0" : "right-0"
          } bottom-0`}
          style={{
            background: `radial-gradient(circle at center, ${getProjectColor(
              name
            )}, transparent 70%)`,
          }}
        />
        <div className="md:w-1/2 p-5 md:p-14 flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 mix-blend-overlay" />
            <Image
              className="rounded-xl w-full h-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-[0.7deg]"
              alt={`${name} screenshot`}
              src={img}
              placeholder="blur"
            />
          </div>
        </div>
        <div className="md:w-1/2 p-6 md:p-14 flex flex-col gap-5 justify-center">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {name}
          </h3>
            <p className="text-xl md:text-2xl font-light text-pText/90 leading-relaxed">
              {description}
            </p>
          <ul className="flex gap-2 flex-wrap">
            {skills.map((skill, index) => (
              <li
                key={skill + index}
                className="text-sm md:text-base bg-tertiary/60 border border-glass rounded-full px-4 py-1.5 tracking-wide text-pText/90 group-hover:bg-secondary/70 transition-colors"
              >
                {skill}
              </li>
            ))}
          </ul>
          <div className="inline-flex items-center gap-2 text-pText/70 group-hover:text-white transition-colors text-base md:text-lg pt-2">
            <span>Visit project</span>
            <IconExternalLink className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[3px]" />
          </div>
        </div>
      </div>
    </a>
  );
};
