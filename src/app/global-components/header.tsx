"use client";

import Image from "next/image";
import Link from "next/link";
import tanguianoLogo from "../../../public/tanguianoLogo.svg";
import { Container } from "./container";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { resumeUri } from "../utils/constants";
import { useState, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";

const navLinks = [
  { label: "Services", href: "#our-services" },
  { label: "Projects", href: "#our-projects" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const { downloadURI } = useDownloadFile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-secondary/70 bg-secondary/85 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <Container className="px-5">
        <nav
          className="w-full flex justify-between items-center py-4"
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={tanguianoLogo}
              height={42}
              width={42}
              alt="logo"
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <span className="sr-only">Home</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => downloadURI(resumeUri, "Tristan_Anguiano_Resume.pdf")}
              className="relative inline-flex items-center gap-2 rounded-lg border border-glass px-4 py-2 text-sm font-medium text-pText/80 hover:text-white backdrop-blur bg-glass/40 hover:bg-white/5 transition-colors duration-300"
            >
              <span className="bg-gradient-to-r from-pixie-powder via-grape to-medium-orchid bg-clip-text text-transparent">
                Resume
              </span>
            </button>
            <a
              href="mailto:anguiano.dev@gmail.com"
              className="inline-flex items-center rounded-lg bg-hero-title-gradient px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 hover:scale-[1.04] active:scale-95 transition-transform"
            >
              Hire Me
            </a>
          </div>
          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-glass p-2 bg-tertiary/40 backdrop-blur text-white"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconX /> : <IconMenu2 />}
          </button>
        </nav>
      </Container>
      {/* Mobile panel */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          open ? "max-h-[520px]" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-6 flex flex-col gap-6 bg-secondary/95 backdrop-blur border-t border-glass">
          <ul className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-lg font-medium text-pText/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                downloadURI(resumeUri, "Tristan_Anguiano_Resume.pdf");
                setOpen(false);
              }}
              className="w-full rounded-lg border border-glass px-4 py-3 text-base font-medium text-pText/90 hover:text-white hover:bg-white/5 backdrop-blur"
            >
              Download Resume
            </button>
            <a
              href="mailto:anguiano.dev@gmail.com"
              onClick={() => setOpen(false)}
              className="w-full rounded-lg bg-hero-title-gradient px-4 py-3 text-base font-semibold text-white shadow-lg shadow-pink-600/20 hover:scale-[1.02] active:scale-95 text-center"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
