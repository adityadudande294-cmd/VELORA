import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/contexts";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VELORA — Immersive Cinematic Storytelling Platform",
  description: "Experience history, mysteries, space, science, and legends through premium documentary-style reading, AI voice narration, and atmospheric ambient music.",
  keywords: ["storytelling", "cinematic reading", "Indian history", "ancient space", "science mysteries", "audio stories", "documentary"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://velora.com",
    title: "VELORA — Immersive Cinematic Storytelling Platform",
    description: "Experience history, mysteries, space, science, and legends through premium documentary-style reading, AI voice narration, and atmospheric ambient music.",
    siteName: "VELORA",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELORA — Immersive Cinematic Storytelling Platform",
    description: "Experience history, mysteries, space, science, and legends through premium documentary-style reading, AI voice narration, and atmospheric ambient music.",
  }
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


