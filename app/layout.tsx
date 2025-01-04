import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/ui/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Make a Pie",
  description: "A pie competition app",
  keywords: "pie, competition, app, baking",
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "Make a Pie",
    description: "A pie competition app",
    url: "https://make-a-pie.vercel.app",
    siteName: "Make a Pie",
    images: [
      {
        url: "/path-to-your-image.jpg",
        width: 800,
        height: 600,
        alt: "A pie competition",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        href: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <Analytics />
          <SpeedInsights />
          <header className="border-b">
            <div className="container flex h-16 items-center px-4">
              <MainNav />
            </div>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
