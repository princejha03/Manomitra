import type { Metadata } from "next";
import { Poppins, Nunito, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const nunito = Nunito({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

const playfair = Playfair_Display({
  weight: ["400"],
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ManoMitra - Your AI Mental Wellness Companion",
  description: "A compassionate AI-powered emotional support companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${nunito.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
