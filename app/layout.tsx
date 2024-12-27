import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from "@/components/ui/nav";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Make a Pie',
  description: 'A pie competition app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b">
            <div className="container flex h-16 items-center px-4">
              <MainNav />
            </div>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}

