"use client"
import React, { createContext, useState, ReactNode, useEffect } from "react"

//next
import { usePathname, useRouter } from "next/navigation"

//config
import { destroyCookie, parseCookies, setCookie } from "nookies"
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"

//interfaces
import { IAdmin } from "@/interfaces/admin"
import { ISuperUser } from "@/interfaces/superUser"

interface AuthContextInterface {
  currentUser: IAdmin | ISuperUser
  authMode: "superuser" | "admin" | undefined
  setAuthMode: React.Dispatch<React.SetStateAction<"superuser" | "admin" | undefined>>
  isLoaded: boolean
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>
  signIn: (e: React.FormEvent, user: IAdmin | ISuperUser) => Promise<void>
  signOut: () => void
  getCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextInterface>({
  currentUser: { email: "", password: "" },
  authMode: "admin",
  setAuthMode: () => {},
  isLoaded: true,
  setIsLoaded: () => {},
  signIn: async () => {},
  signOut: () => {},
  getCurrentUser: async () => {},
})

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { token } = parseCookies()
  const pathname = usePathname()
  const { push } = useRouter()
  const [currentUser, setCurrentUser] = useState<IAdmin | ISuperUser>(
    null as unknown as IAdmin | ISuperUser,
  )
  const [authMode, setAuthMode] = useState<"superuser" | "admin">()
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    getCurrentUser()
  }, [])

  async function getCurrentUser() {
    if (!token) return signOut()
    if (currentUser?.email) return

    return await api_client
      .get(`/auth/current_user/`)
      .then((res) => {
        if (pathname === "/login") {
          return push("/welcome")
        }

        if (pathname === "/" || !pathname) {
          return push("/welcome")
        }

        setCurrentUser(res.data)
        setAuthMode(res.data.role)
      })
      .catch((err) => {
        console.error(err)
        signOut()
      })
  }

  async function signIn(e: React.FormEvent, user: IAdmin | ISuperUser) {
    e.preventDefault()

    setIsLoaded(false)
    await api_client
      .post(`/${authMode}s/login`, user)
      .then(({ data }) => {
        setCookie(undefined, "token", data.token)
        push("/welcome")
      })
      .catch((err) => {
        console.error(err)
        if (err?.response?.status === 401) {
          return toast.error("Email ou senha incorretos")
        }
        if (err?.response?.status === 404) {
          return toast.error("Usuário não encontrado")
        }
        if (err?.response?.status === 500) {
          return toast.error("Algo deu errado, tente novamente mais tarde")
        }
      })
      .finally(() => setIsLoaded(true))
  }

  async function signOut() {
    destroyCookie(undefined, "token")
    setCurrentUser(null as unknown as IAdmin | ISuperUser)
    return push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        getCurrentUser,
        authMode,
        setAuthMode,
        isLoaded,
        setIsLoaded,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
