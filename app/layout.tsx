import type React from "react";
import type {Metadata} from "next";
import {Archivo, Geist} from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Mohammed Adebayo - Frontend Developer",
  description: "Frontend Developer from Nigeria with 5 years of experience.",
  generator: "v0.app",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${archivo.variable}`} suppressHydrationWarning>
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
