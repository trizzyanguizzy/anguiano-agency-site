import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: '"Inter"',
        kanit: ["Kanit", "sans-serif"],
      },
      colors: {
        background: "#181b20",
        white: "#fff",
        glass: "rgba(17, 25, 40, 0.75)",
        input: "#1f2a37",
        primary: "#F87000",
        secondary: "#24272e",
        tertiary: "#3b444b",
        accent: "#0244BB",
        neutral: "#415058",
        "base-100": "#0F0A19",
        info: "#ffffff",
        success: "#5EB234",
        warning: "#E8B130",
        error: "#C91D2B",
        logoClear: "rgba(255, 255, 255, 0.40)",
        pText: "#d0d6de",
        "pixie-powder": "#2E1B86",
        grape: "#7723AC",
        "medium-orchid": "#B053CB",
        "yellow-orange": "#FFA84C",
        sunglow: "#FED338",
        "lemon-glacier": "#FEFD00",
        "web-dev-icon": "rgba(133, 223, 144, 0.15)",
        "web-dev-text": "rgba(133, 223, 144)",
        "mobile-dev-icon": "rgba(255, 84, 136, 0.15)",
        "mobile-dev-tezt": "rgba(255, 84, 136)",
        "full-stack-icon": "rgba(255, 216, 32, 0.15)",
        "full-stack-text": "rgba(255, 216, 32)",
        "ui-ux-icon": "rgba(31, 201, 255, 0.15)",
        "ui-ux-text": "rgba(31, 201, 255)",
      },
      spacing: {
        0: "0",
        1: "0.4rem",
        2: "0.8rem",
        3: "1.2rem",
        4: "1.6rem",
        5: "2rem",
        6: "2.4rem",
        7: "2.8rem",
        8: "3.2rem",
        9: "3.6rem",
        10: "4rem",
        11: "4.4rem",
        12: "4.8rem",
        13: "5.2rem",
        14: "5.6rem",
        15: "6rem",
        16: "6.4rem",
      },
      backgroundImage: {
        "primary-gradient":
          "radial-gradient(circle, #845ec2, #0078d1, #0086c1, #008d9f, #008f7a)",
        "hero-title-gradient": "linear-gradient(to right,#FD5244,#D12591)",
        "header-radial-gradient":
          "radial-gradient(62.87% 100% at 50% 100%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 100%)",
        "emphasized-hero-gradient":
          "linear-gradient(-58deg, #35B1A1 30.16%, #0078B5 43.02%, #404BC1 56.61%, #EB07E0 69.99%)",
        "nav-border":
          "linear-gradient(90deg, rgba(45,45,48,0), #2d2d30 35%, #2d2d30 65%, rgba(45,45,48,0))",
        "nav-effect":
          "linear-gradient(135deg, rgba(215, 237, 237, .08), rgba(204, 235, 235, 0))",
        "web-design-dev-gradient":
          "linear-gradient(201deg, rgba(63,39,173,1) 0%, rgba(180,0,255,1) 69%)",
        "app-design-dev-gradient":
          "linear-gradient(201deg, rgba(15,64,255,1) 0%, rgba(100,202,255,1) 69%)",
        "seo-gradient":
          "linear-gradient(201deg, rgba(0,130,143,1) 0%, rgba(0,255,184,1) 69%)",
        "ai-gradient":
          "linear-gradient(201deg, rgba(255,15,205,1) 0%, rgba(250,117,117,1) 69%)",
      },
      boxShadow: {
        glass: "0 8px 22px 0 rgba( 31, 38, 135, 0.37 )",
        purple: "0 0 1px #4a148c",
        blue: "0 0 1px #0d47a1",
        green: "0 0 1px #1b5e20",
        red: "0 0 1px #b71c1c",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.125)",
      },
      backdropBlur: {
        glass: "4px",
      },
      borderRadius: {
        glass: "12px",
      },
      brightness: {
        servicesBrightness: "110%",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("flowbite/plugin"),
    addVariablesForColors,
  ],
  darkMode: "class",
};
export default config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
