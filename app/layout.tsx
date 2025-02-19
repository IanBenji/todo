'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useSupabaseAuth } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/auth') {
        router.push('/auth')
      } else if (user && pathname === '/auth') {
        router.push('/')
      }
    }
  }, [user, loading, pathname, router])

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {loading ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}