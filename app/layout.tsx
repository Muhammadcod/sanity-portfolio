import type React from "react";
import type {Metadata} from "next";
import {Bricolage_Grotesque, Geist, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Mohammed Adebayo — Frontend Developer Lead",
  description: "Frontend Developer from Nigeria with 6 years of experience.",
  generator: "v0.app",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${bricolage.variable} ${jetbrains.variable}`} suppressHydrationWarning>
    <body className="font-sans antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <SanityLive />
      </ThemeProvider>
    </body>
    </html>
  );
}
