import React from "react";
import smallMedSolLogoClear from "../../../../public/medSolLogoClear.svg";
import unoLogoClear from "../../../../public/unoLogoClear.svg";
import fusionLogoClear from "../../../../public/fusionLogoClear.svg";
import fiservLogoClear from "../../../../public/fiservLogoClear.svg";
import Image from "next/image";

export enum clientNames {
  UNO = "University of Nebraska At Omaha",
  Fiserv = "Fiserv",
  Fusion = "Fusion Medical Staffing",
  MedSol = "Medical Solutions",
  TheCrackCrew = "The Crack Crew Mobile",
  FusionMarketplace = "Fusion Marketplace",
}

export const clients = [
  {
    name: clientNames.UNO,
    img: unoLogoClear,
    imgHeight: 200,
    imgWidth: 200,
    href: "https://www.unomaha.edu/",
  },
  {
    name: clientNames.Fiserv,
    img: fiservLogoClear,
    imgHeight: 125,
    imgWidth: 125,
    href: "https://www.fiserv.com/",
  },
  {
    name: clientNames.Fusion,
    img: fusionLogoClear,
    imgHeight: 175,
    imgWidth: 175,
    href: "https://www.fusionmedstaff.com/",
  },
  {
    name: clientNames.MedSol,
    img: smallMedSolLogoClear,
    imgHeight: 300,
    imgWidth: 300,
    href: "https://www.medicalsolutions.com/",
  },
];

export const ClientLogos = () => {
  const duplicated = [...clients, ...clients];
  return (
    <section
      aria-label="Client Logos"
      className="relative mt-28 mb-32 px-4 md:px-8 overflow-hidden"
    >
      <div className="flex flex-col items-center">
        <p className="pb-10 text-2xl md:text-3xl font-light text-white/40 tracking-wide">
          Trusted by
        </p>
        <div className="relative w-full max-w-6xl">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          <ul
            className="flex items-center gap-16 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused] will-change-transform"
          >
            {duplicated.map((client, index) => (
              <li key={`${client.name}-${index}`} className="shrink-0 group">
                <button
                  onClick={() => window.open(client.href, "_blank")}
                  className="relative grayscale hover:grayscale-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-medium-orchid/70 rounded-xl"
                  aria-label={client.name}
                >
                  <Image
                    height={client.imgHeight}
                    width={client.imgWidth}
                    src={client.img}
                    alt={`${client.name} logo`}
                    className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
