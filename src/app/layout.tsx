"use client"
import { useEffect } from 'react'

//next
import { usePathname, useRouter } from 'next/navigation'

//styles
import '@/styles/globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    autoRedirect()
  }, [pathname])

  function autoRedirect() {
    if (pathname === "/") {
      push("/welcome")
    }
  }


  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  )
}
