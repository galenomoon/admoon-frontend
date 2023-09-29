"use client"
import React, { useContext, useEffect, useState } from "react"

//next
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams, usePathname } from "next/navigation"

//styles
import {
  ArrowSquareOut,
  CaretDown,
  Control,
  SignOut,
} from "@phosphor-icons/react"

//config
import { destroyCookie } from "nookies"

//assets
import admoon from "@/assets/admoon.png"

//mock
import superUserOptions from "@/mocks/superUserOptions"
import adminOptions, { IOption } from "@/mocks/adminOptions"

//context
import { AuthContext } from "@/contexts/authContext"
import { WebsiteContext } from "@/contexts/websiteContext"

export default function Menu() {
  const { authMode } = useContext(AuthContext)
  const { currentWebsite, websites } = useContext(WebsiteContext)
  const [options, setOptions] = useState([] as IOption[])
  const pathname = usePathname()
  const query = useParams()
  const { push } = useRouter()

  async function handleSignOut() {
    destroyCookie(undefined, "token")
    return push("/login")
  }

  if (pathname === "/login") return null

  useEffect(() => {
    handleOptions()
  }, [authMode, currentWebsite, adminOptions])

  function handleOptions() {
    if (authMode === "superuser") {
      setOptions(superUserOptions)
    }
    if (authMode === "admin") {
      const activatedOptions = adminOptions?.filter(
        (option) =>
          currentWebsite?.services?.some(
            (service) => service.name === option.title,
          ),
      )

      setOptions(activatedOptions)
    }
  }

  return (
    <nav className="h-screen w-[324px] flex-shrink-0 flex-col bg-white shadow-lg sm:hidden md:flex">
      <div className="flex w-full items-center justify-center px-8 pb-6 pt-12">
        <Image src={admoon} width={500} height={60} alt="logo" />
      </div>
      <span className="h-[2px] w-[80%] self-center bg-black/10" />
      <nav className="mt-6 flex h-full flex-col gap-4 overflow-auto pb-10">
        {authMode === "admin" && (
          <div className="flex h-fit w-[85%] flex-shrink-0 justify-between self-center rounded-xl bg-gray-100 px-3 py-2">
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-satoshi-variable text-lg opacity-80">
                  {currentWebsite?.name}
                </p>
                <a
                  href={currentWebsite?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir site"
                  className="hover:text-blue-600 duration-300"
                >
                  <ArrowSquareOut size={22} />
                </a>
              </div>
              <p className="text-sm opacity-60">
                {currentWebsite?.services
                  ?.map((service) => service.name)
                  .join(", ")}
              </p>
              <div className="flex items-center gap-1 text-sm opacity-80">
                {currentWebsite?.url
                  ?.replace("https://", "")
                  ?.replace("http://", "")}
              </div>
            </div>
            {websites?.length > 1 && (
              <div className="flex flex-col items-center justify-center gap-2">
                <button>
                  <Control size={20} />
                </button>
                <button>
                  <CaretDown size={20} />
                </button>
              </div>
            )}
          </div>
        )}
        {options?.map((option, index) => (
          <section key={index} className="flex flex-col">
            <p className="font-satoshi-bold mb-4 mt-2 px-8 uppercase opacity-80">
              {option.title}
            </p>
            {option?.routes?.map((route, route_index) => (
              <Link
                key={route_index}
                href={route.href}
                className={`px-8 py-3 text-xl ${
                  route.href === `/${query.option}`
                    ? "border-blue-800 bg-blue-800/10 text-blue-800"
                    : "border-transparent opacity-60 duration-300 hover:bg-[#eee]"
                } font-satoshi-medium flex items-center gap-5 border-r-4`}
              >
                <route.Icon size={26} weight="duotone" />
                <p>{route.title}</p>
              </Link>
            ))}
          </section>
        ))}
      </nav>
      <span className="h-[2px] w-[80%] self-center bg-black/10" />
      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 px-8 py-6 pb-12 text-red-600"
      >
        <SignOut size={22} weight="duotone" />
        <p>Sair</p>
      </button>
    </nav>
  )
}

export function TabNavigation() {
  const query = useParams()
  const onlyOptions = adminOptions?.map((option) => option.routes).flat()
  return (
    <nav className="fixed bottom-0 left-0 z-[90] flex h-20 w-full items-center justify-evenly border-t-2 bg-white shadow-lg md:hidden">
      {onlyOptions?.map((option, index) => (
        <Link
          key={index}
          href={option.href}
          className={`flex h-full w-full items-center justify-center text-xl ${
            option.href === `/${query.option}`
              ? "bg-blue-800/10 text-blue-800"
              : "opacity-60 duration-300 hover:bg-[#eee]"
          } font-satoshi-medium relative flex flex-col items-center`}
        >
          <option.Icon size={26} weight="duotone" className="flex-shrink-0" />
          <p className="text-xs">{option.title}</p>
        </Link>
      ))}
    </nav>
  )
}
