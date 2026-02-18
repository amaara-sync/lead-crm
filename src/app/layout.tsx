import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lead CRM — Google Maps Business Finder",
  description: "Discover and manage business leads from Google Maps. Search by area and type to get full contact details, reviews, hours, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white flex flex-col h-screen overflow-hidden`}>
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
