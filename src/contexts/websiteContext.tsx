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
import { IWebsite } from "@/interfaces/website"

//context
import { AuthContext } from "./authContext"
import { IAdmin } from "@/interfaces/admin"

interface WebsiteContextInterface {
  currentWebsite: IWebsite
  setCurrentWebsite: React.Dispatch<React.SetStateAction<IWebsite>>
  websites: IWebsite[]
  isLoaded: boolean
}

export const WebsiteContext = createContext<WebsiteContextInterface>({
  currentWebsite: { id: 0, name: "", url: "" },
  setCurrentWebsite: () => {},
  websites: [],
  isLoaded: true,
})

export default function WebsiteContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { currentUser } = useContext(AuthContext)
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
      setWebsites(adminUser?.websites as IWebsite[])
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

  return (
    <WebsiteContext.Provider
      value={{
        currentWebsite,
        setCurrentWebsite,
        websites,
        isLoaded,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  )
}
