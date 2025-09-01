import "./globals.css";
import { Container } from "./global-components/container";
import { Footer } from "./global-components/footer";
import { Header } from "./global-components/header";

export const metadata = {
  title: "Tristan Anguiano Portfolio",
  description: "Full Stack / Front-End Engineer portfolio for Tristan Anguiano",
  icons: {
    icon: [
      { url: "/tanguianoLogofavIcon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/tanguianoLogofavIcon.svg"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#24272e",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#24272e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background dark select-none">
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden font-kanit">
        <div>
          <Header />
          <div className="">{children}</div>
          <Container>
            <Footer />
          </Container>
        </div>
      </body>
    </html>
  );
}
