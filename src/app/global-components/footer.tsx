"use client";

import React from "react";
// import Routes from "../utils/routes";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { resumeUri } from "../utils/constants";
import Link from "next/link";

const SocialLinks = {
  GitHub: "https://github.com/trizzyanguizzy",
  LinkedIn: "https://linkedin.com/in/tristan-anguiano",
  X: "https://x.com/trizzyanguizzy",
};

export const Footer = () => {
  const router = useRouter();
  const { downloadURI } = useDownloadFile();

  return (
  <footer id="contact" className="overflow-visible relative pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="md:mb-56 md:px-0 mb-40 flex flex-col items-center px-8">
          <h2 className="md:text-[4.6rem] text-[3.8rem] leading-[1.15] font-semibold my-5 flex justify-center text-center bg-hero-title-gradient bg-clip-text text-transparent">
            Have an idea? <br /> Let&apos;s collaborate.
          </h2>
          <Link href="mailto:anguiano.dev@gmail.com" className="group">
            <span className="bg-hero-title-gradient text-white py-2.5 px-6 rounded-xl w-fit inline-flex mt-1 text-2xl items-center gap-2 shadow-lg shadow-pink-600/20 transition-transform group-hover:scale-[1.04] active:scale-95">
              Contact Me <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
        <div className="md:flex-row md:justify-between md:px-0 flex flex-col w-full items-center px-8">
          <span className="text-2xl text-center text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Tristan Anguiano
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 md:mt-0">
            <a
              href={SocialLinks.GitHub}
              target="_blank"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <IconBrandGithub />
            </a>
            <a
              href={SocialLinks.LinkedIn}
              target="_blank"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <IconBrandLinkedin />
            </a>
            <a
              href={SocialLinks.X}
              target="_blank"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <IconBrandX />
            </a>
          </div>
      <div className="absolute h-[10rem] blur-[120px] mx-auto w-[70%] bg-hero-title-gradient z-[-1] left-0 right-0 opacity-60" />
        </div>
      </div>
    </footer>
  );
};
