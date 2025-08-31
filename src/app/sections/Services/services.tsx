import {
  IconDatabase,
  IconDeviceDesktopCode,
  IconDeviceMobileCode,
  IconStack2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Service = {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string; // tailwind color / gradient helper
  iconRing: string;
};

const services: Service[] = [
  {
    title: "Custom Web Development",
    description:
      "I build responsive, high-performance web applications using NextJS, React, and Tailwind with a focus on UX, performance budgets, and accessibility.",
    icon: <IconDeviceDesktopCode size={42} className="text-web-dev-text" />,
    accent:
      "from-pixie-powder via-grape to-medium-orchid group-hover:blur-sm opacity-25",
    iconRing: "bg-web-dev-icon",
  },
  {
    title: "Full Stack Solutions",
    description:
      "End‑to‑end delivery across front-end & back-end: .NET / SQL services, REST/GraphQL APIs, React + TypeScript front-ends, robust testing & CI integration.",
    icon: <IconDatabase size={42} className="text-full-stack-text" />,
    accent: "from-yellow-orange via-sunglow to-lemon-glacier opacity-25",
    iconRing: "bg-full-stack-icon",
  },
  {
    title: "Mobile App Development",
    description:
      "React Native apps with shared design systems, offline-first patterns, fast startup, and consistent multi-platform UX.",
    icon: <IconDeviceMobileCode size={42} className="text-mobile-dev-tezt" />,
    accent: "from-medium-orchid via-pink-500 to-red-400 opacity-25",
    iconRing: "bg-mobile-dev-icon",
  },
  {
    title: "Platform Engineering",
    description:
      "Designing scalable JS/TS platforms, component libraries, automated a11y & visual testing (Storybook, Playwright), optimized CI/CD, and telemetry dashboards (Redash, Snowplow).",
    icon: <IconStack2 size={42} className="text-ui-ux-text" />,
    accent: "from-blue-500 via-grape to-pixie-powder opacity-25",
    iconRing: "bg-ui-ux-icon",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.12 * i, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const Services = () => {
  return (
    <section
      id="our-services"
      className="relative t-[var(--navigation-height)] md:pt-[90px] md:pb-[120px] pt-[80px] pb-[90px] bg-secondary/95 backdrop-blur-sm max-w-[120rem] mx-auto overflow-hidden"
      aria-labelledby="services-heading"
    >
      <div className="relative flex flex-col">
        <div className="mx-auto text-center max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 rounded-xl border border-glass bg-black/60 backdrop-blur px-5 py-1.5 text-2xl font-medium tracking-wide shadow-glass">
            <span className="bg-gradient-to-r from-pixie-powder via-grape to-medium-orchid bg-clip-text text-transparent">
              Services
            </span>
          </div>
          <h2
            id="services-heading"
            className="md:text-[5rem] text-[3.6rem] leading-[1.15] font-semibold mt-6 bg-hero-title-gradient bg-clip-text text-transparent"
          >
            What I Can Do For You
          </h2>
          <p className="text-pText text-2xl md:text-3xl mt-4 font-light">
            Skills I bring to the table.
          </p>
        </div>
        <div className="mx-auto mt-16 h-px w-2/3 bg-gradient-to-r from-transparent via-tertiary/60 to-transparent" />
        <div className="mt-24 px-6 md:px-12 lg:px-20">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-14 xl:gap-24">
            {services.map((s, i) => (
              <motion.li
                key={s.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="group relative"
              >
                {/* gradient ring */}
                <div className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-br ${s.accent} transition-opacity duration-500 group-hover:opacity-70`} />
                {/* card */}
                <div className="relative h-full rounded-[1.7rem] border border-glass bg-glass/60 backdrop-blur-md p-8 md:p-10 flex flex-col shadow-glass overflow-hidden">
                  {/* subtle inner shine */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 60%)",
                  }} />
                  <div className="relative flex flex-col items-center text-center gap-6">
                    <div
                      className={`relative ${s.iconRing} w-28 h-28 rounded-3xl flex items-center justify-center shadow-inner shadow-black/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      aria-hidden="true"
                    >
                      {s.icon}
                      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-40 mix-blend-overlay" />
                    </div>
                    <h3 className="text-[2.6rem] md:text-[3rem] font-semibold tracking-tight text-gray-100">
                      {s.title}
                    </h3>
                    <p className="text-xl md:text-2xl font-light text-pText/90 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  {/* bottom accent bar */}
                  <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-pixie-powder/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
