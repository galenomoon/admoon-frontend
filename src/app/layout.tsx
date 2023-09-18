"use client"
import { useEffect } from 'react'

//next
import { usePathname, useRouter } from 'next/navigation'

//styles
import '@/styles/globals.css'
import api_client from '@/config/api_client'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { push } = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    getCurrentUser()
  }, [pathname])

  async function getCurrentUser() {
    return await api_client.get('auth/current_user/')
      .then((res) => {
        if (pathname === '/login') {
          push('/welcome')
        } 
        if (pathname === '/') {
          push('/welcome')
        }
      })
      .catch((err) => {
        console.error(err)
        push('/login')
      })
  }


  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  )
}
