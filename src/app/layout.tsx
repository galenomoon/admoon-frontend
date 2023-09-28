import React from "react"

//styles
import "@/styles/globals.css"

//next
import { Metadata } from "next"

//context
import AuthContextProvider from "@/contexts/authContext"
import WebsiteContextProvider from "@/contexts/websiteContext"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login | Admoon",
    description: "Login page",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <WebsiteContextProvider>{children}</WebsiteContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
