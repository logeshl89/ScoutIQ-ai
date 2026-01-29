import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import NavigationHeader from "@/components/NavigationHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ScoutIQ - Automated Scouting Report Generator",
  description: "Automated scouting report generator for esports teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} bg-dark-900 min-h-screen relative overflow-x-hidden`}>
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>
        <div className="fixed inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none"></div>
        <NavigationHeader />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          {children}
        </div>
      </body>
    </html>
  );
}