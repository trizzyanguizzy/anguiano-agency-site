import { useGetProjects } from "../../hooks/queries/useProjects";
import { ProjectCard } from "./components/project-card";
import { motion } from "framer-motion";

export const Projects = () => {
  const { projects } = useGetProjects();
  return (
    <section
      id="our-projects"
      aria-labelledby="projects-heading"
      className="relative t-[var(--navigation-height)] md:pt-[110px] md:pb-[140px] pt-[140px] pb-[100px]"
    >
      <div className="flex flex-col">
        <div className="w-fit mx-auto text-center px-8">
          <div className="inline-flex items-center gap-2 rounded-xl border border-glass bg-black/70 backdrop-blur px-5 py-1.5 text-2xl font-medium tracking-wide shadow-glass">
            <span className="bg-gradient-to-r from-pixie-powder via-grape to-medium-orchid bg-clip-text text-transparent">
              Projects
            </span>
          </div>
          <h2
            id="projects-heading"
            className="md:text-[5rem] text-[3.8rem] leading-[1.15] font-semibold mt-6 bg-hero-title-gradient bg-clip-text text-transparent"
          >
            What I&apos;ve Built
          </h2>
          <p className="text-pText text-2xl md:text-3xl mt-4 font-light">
            Projects that define my experience.
          </p>
        </div>
        <div className="gap-16 flex-col flex items-center mt-28 px-[2.4rem]">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="w-full"
            >
              <ProjectCard {...project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
