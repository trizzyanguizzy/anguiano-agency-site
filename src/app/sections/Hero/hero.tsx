"use client";

import React from "react";
import heroSection from "../../../../public/Group-1.png";
import Image from "next/image";
import { BackgroundGradient } from "@/app/global-components/background-gradient";
import { IconArrowRight } from "@tabler/icons-react";
import { useDownloadFile } from "@/app/hooks/useDownloadFile";
import { resumeUri } from "@/app/utils/constants";
import Link from "next/link";
import { motion } from "framer-motion";

const headingWords = ["Design.", "Develop.", "Deliver."];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 * i, ease: [0.23, 1, 0.32, 1] },
  }),
};

const float = {
  initial: { y: 0 },
  animate: {
    y: [0, -14, 0],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
};

const stats = [
  { label: "Years Experience", value: "5+" },
  { label: "Projects Shipped", value: "40+" },
  { label: "Teams Supported", value: "10+" },
];

export const Hero = () => {
  const { downloadURI } = useDownloadFile();
  return (
    <section
      className="relative md:mt-56 mt-32 text-center px-4 md:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Decorative radial / grid backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] md:w-[90vw] md:h-[90vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,60,255,0.18),rgba(36,39,46,0)_65%)]" />
        <div className="absolute -top-40 -left-32 w-96 h-96 rounded-full bg-pixie-powder/30 blur-[120px]" />
        <div className="absolute bottom-0 -right-24 w-[32rem] h-[32rem] rounded-full bg-medium-orchid/25 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)] mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_80px)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_60px)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="md:mb-40 mb-24 relative">
          <motion.h1
            id="hero-heading"
            className="font-semibold mt-2 mb-5 flex flex-wrap justify-center gap-x-4 gap-y-2 leading-[1.05] tracking-tight"
            aria-label="Design. Develop. Deliver."
          >
            {headingWords.map((w, i) => (
              <motion.span
                key={w}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={fadeUp}
                className="text-[3.6rem] md:text-[5.8rem] bg-hero-title-gradient bg-clip-text text-transparent drop-shadow-sm"
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-3xl text-pText text-2xl md:text-3xl font-light"
          >
            I am a front-end focused Full Stack Software Engineer with over 5 years of experience building performant, accessible, design‑driven products that ship real business value.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10"
          >
            <Link href="mailto:anguiano.dev@gmail.com" className="group">
              <span className="inline-flex items-center gap-2 rounded-xl bg-hero-title-gradient px-7 py-3 text-white text-xl md:text-2xl font-medium shadow-lg shadow-pink-600/20 transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95">
                {`Let's Talk`}
                <IconArrowRight
                  size={22}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
            <button
              onClick={() => downloadURI(resumeUri, "Tristan_Anguiano_Resume.pdf")}
              className="relative inline-flex items-center gap-2 rounded-xl border border-glass px-7 py-3 text-xl md:text-2xl font-medium text-pText/90 backdrop-blur bg-glass/60 shadow-glass transition-all duration-300 hover:text-white hover:border-white/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-medium-orchid/60"
              aria-label="Download Resume"
            >
              <span className="bg-gradient-to-r from-pixie-powder via-grape to-medium-orchid bg-clip-text text-transparent">Download Resume</span>
            </button>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-pText/80 text-base md:text-lg"
            aria-label="Key statistics"
          >
            {stats.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-glass bg-tertiary/30 backdrop-blur-sm shadow-glass"
              >
                <span className="text-3xl md:text-4xl font-semibold text-white leading-none">
                  {s.value}
                </span>
                <span className="text-left text-sm md:text-base font-light tracking-wide">
                  {s.label}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          variants={float}
          initial="initial"
          animate="animate"
          className="md:mx-0 mx-auto max-w-6xl"
        >
          <BackgroundGradient className="md:mx-auto rounded-2xl p-0.5 shadow-lg">
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="rounded-2xl"
            >
              <Image
                src={heroSection}
                alt="Showcase of recent project work"
                width={1125}
                height={709}
                priority
                className="rounded-2xl z-[1] p-0.5"
              />
            </motion.div>
          </BackgroundGradient>
        </motion.div>
      </div>
    </section>
  );
};
