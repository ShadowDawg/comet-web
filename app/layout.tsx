import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const playwrite = localFont({
  src: "./fonts/Playwrite_HU/PlaywriteHU-VariableFont_wght.ttf",
  variable: "--font-playwrite",
  weight: "100 900",
});

const manrope = localFont({
  src: "./fonts/Manrope/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "100 900",
});

const lora = localFont({
  src: "./fonts/Lora/Lora-VariableFont_wght.ttf",
  variable: "--font-lora",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Comet",
  description: "By insti, For insti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${manrope.variable} ${playwrite.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className={`font-manrope`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
