"use client"
import React, { createContext, useState, ReactNode, useEffect } from "react"

//next
import { usePathname, useRouter } from "next/navigation"

//config
import { destroyCookie } from "nookies"
import api_client from "@/config/api_client"

//interfaces
import { IUser } from "@/interfaces/user"

interface AuthContextInterface {
  currentUser: IUser
}

export const AuthContext = createContext<AuthContextInterface>({
  currentUser: { email: "", password: "" },
})

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { push } = useRouter()
  const [currentUser, setCurrentUser] = useState<IUser>(
    null as unknown as IUser,
  )

  useEffect(() => {
    getCurrentUser()
  }, [])

  async function getCurrentUser() {
    return await api_client.get('auth/current_user/')
      .then((res) => {
        if (pathname === '/login') {
          return push('/welcome')
        }
        if (pathname === '/' || !pathname) {
          return push('/welcome')
        }

        setCurrentUser(res.data)
      })
      .catch((err) => {
        console.error(err)
        destroyCookie(undefined, "token")
        setCurrentUser(null as unknown as IUser)
        push('/login')
      })
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
