"use client"
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react"

//config
import api_client from "@/config/api_client"

//interfaces
import { IAdmin } from "@/interfaces/admin"
import { IWebsite } from "@/interfaces/website"

//context
import { AuthContext } from "./authContext"

interface WebsiteContextInterface {
  currentWebsite: IWebsite
  setCurrentWebsite: React.Dispatch<React.SetStateAction<IWebsite>>
  websites: IWebsite[]
  isLoaded: boolean
  getCurrentWebsite: () => Promise<void>
}

export const WebsiteContext = createContext<WebsiteContextInterface>({
  currentWebsite: { id: 0, name: "", url: "" },
  setCurrentWebsite: () => {},
  getCurrentWebsite: async () => {},
  websites: [],
  isLoaded: true,
})

export default function WebsiteContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { currentUser, authMode } = useContext(AuthContext)
  const adminUser = currentUser as IAdmin
  const [currentWebsite, setCurrentWebsite] = useState<IWebsite>(
    adminUser?.websites?.[0] as IWebsite,
  )
  const [websites, setWebsites] = useState<IWebsite[]>(
    adminUser?.websites as IWebsite[],
  )
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    if (currentUser) {
      getCurrentWebsite()
      getWebsites()
    }
  }, [currentUser])

  async function getCurrentWebsite() {
    if (!adminUser?.websites?.[0]?.id) return
    setIsLoaded(false)
    return await api_client
      .get(`/websites/${adminUser?.websites?.[0]?.id}/`)
      .then(({ data }) => setCurrentWebsite(data))
      .catch((err) => {
        console.error(err)
      })
      .finally(() => setIsLoaded(true))
  }

  async function getWebsites() {
    if (authMode === "admin") {
      setWebsites(adminUser?.websites as IWebsite[])
      return
    }

    if (authMode === "superuser") {
      return await api_client.get("/websites/").then(({ data }) => {
        setWebsites(data)
      })
    }
  }

  return (
    <WebsiteContext.Provider
      value={{
        currentWebsite,
        setCurrentWebsite,
        websites,
        isLoaded,
        getCurrentWebsite,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  )
}
