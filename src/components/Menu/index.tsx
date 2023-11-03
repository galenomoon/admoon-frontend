"use client"
import React, { useContext, useEffect, useState } from "react"

//next
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams, usePathname } from "next/navigation"

//styles
import { CaretDown, SignOut, Warning, XCircle } from "@phosphor-icons/react"
import toast from "react-hot-toast"

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
  const { currentWebsite, websites, setCurrentWebsite } =
    useContext(WebsiteContext)
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
    if (authMode === "superuser" && !currentWebsite?.id) {
      setOptions(superUserOptions)
    }

    const activatedOptions = adminOptions?.filter(
      (option) =>
        currentWebsite?.services?.some(
          (service) => service.name === option.title,
        ),
    )
    if (authMode === "admin") {
      setOptions(activatedOptions)
    }

    if (authMode === "superuser" && currentWebsite?.id) {
      setOptions([...superUserOptions, ...activatedOptions])
    }
  }

  const [isOpened, setIsOpened] = useState(false)

  function Websites() {
    return (
      <section className="h-fit w-[85%] self-center">
        <div className="flex h-fit min-h-[80px] flex-shrink-0 justify-between rounded-xl bg-gray-100 px-3 py-2">
          <div className="flex w-full flex-col justify-center">
            <div className="flex items-center justify-between gap-2">
              <p className="font-satoshi-variable flex items-center justify-center gap-2 text-lg opacity-80">
                {currentWebsite?.id && websites?.length >= 1 && (
                  <button
                    onClick={() => setCurrentWebsite({} as any)}
                    className="transition duration-300 hover:text-red-600"
                  >
                    <XCircle size={18} weight="duotone" />
                  </button>
                )}
                {currentWebsite?.name || "Selecione um site"}
              </p>
            </div>
            {authMode === "superuser" && (
              <p className="text-sm opacity-60">
                {currentWebsite?.services
                  ?.map((service) => service.name)
                  .join(", ") || "Para acessar o painel de controle"}
              </p>
            )}

            {authMode === "admin" && (
              <div className="flex items-center gap-1 text-sm opacity-80">
                {currentWebsite?.url
                  ?.replace("https://", "")
                  ?.replace("http://", "")}
              </div>
            )}
          </div>
          {websites?.length > 1 && (
            <div className="flex flex-col items-center justify-center gap-2">
              <button onClick={() => setIsOpened(!isOpened)}>
                <CaretDown size={20} />
              </button>
            </div>
          )}
        </div>
        {isOpened && (
          <div className="absolute z-[99] mt-2 flex max-h-[400px] w-[85%] flex-col overflow-y-scroll rounded-xl bg-white pb-3 shadow-lg">
            {websites?.map((website, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpened(false)
                  setCurrentWebsite(website)
                  toast.success(`Site ${website.name} selecionado`)
                  return push(`/welcome`)
                }}
                className="flex w-full flex-col p-3 text-start transition duration-300 hover:bg-gray-100"
              >
                <p className="font-satoshi-variable text-md opacity-80">
                  {website.name}
                </p>
                <p className="text-sm opacity-60">
                  {website.services
                    ?.map((service) => service.name)
                    .join(", ") || "Nenhum serviço ativado"}
                </p>
                <p className="flex items-center gap-1 text-sm text-blue-600/80 underline opacity-80">
                  {website.url?.replace("https://", "")?.replace("http://", "")}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <nav className="relative h-screen w-[324px] flex-shrink-0 flex-col bg-white shadow-lg sm:hidden md:flex">
      <div className="flex w-full items-center justify-center px-8 pb-6 pt-12">
        <Image src={admoon} width={500} height={60} alt="logo" />
      </div>
      <span className="h-[2px] w-[80%] self-center bg-black/10" />
      <nav className="mt-6 flex h-full flex-col gap-4 overflow-auto pb-10">
        <Websites />
        {options.length ? (
          options?.map((option, index) => (
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
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Warning size={48} weight="duotone" />
            <article className="flex flex-col">
              <p className="font-satoshi-bold mt-2 px-8 uppercase opacity-80">
                Nenhum serviço ativado
              </p>
              <p className="px-2 text-sm opacity-60">
                Para acessar o painel de controle, entre em contato com o
                administrador para ativar os serviços
              </p>
            </article>
          </div>
        )}
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
