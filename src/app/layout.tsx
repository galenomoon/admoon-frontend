import React from 'react'

//styles
import '@/styles/globals.css'

//next
import { Metadata } from 'next';

//context
import AuthContextProvider from '@/contexts/authContext'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login | Admoon",
    description: "Login page",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body >
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
