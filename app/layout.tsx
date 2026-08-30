import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-plus-jakarta-sans",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hanken-grotesk",
});

export const metadata: Metadata = {
  title: "AAROMI - Independent Digital Design Studio",
  description: "Strategic websites, intuitive digital experiences, and distinctive visual identities for ambitious businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" 
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${hankenGrotesk.variable} font-sans antialiased overflow-x-hidden selection:bg-secondary-fixed selection:text-primary-container`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
