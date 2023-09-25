"use client"
import React, { useContext, useState } from "react"

//next
import Image from "next/image"

//assets
import admoonLogo from "@/assets/dark_logo.png"
import clouds from "@/assets/clouds.png"

//styles
import { Toaster } from "react-hot-toast"

//interfaces
import { IAdmin } from "@/interfaces/admin"
import { ISuperUser } from "@/interfaces/superUser"

//components
import AuthForm from "@/components/AuthForm"

//context
import { AuthContext } from "@/contexts/authContext"

export default function Login() {
  const {
    authMode = "admin",
    setAuthMode,
    isLoaded,
    signIn,
  } = useContext(AuthContext)
  const [user, setUser] = useState<IAdmin | ISuperUser>({
    email: "",
    password: "",
  })

  const date = new Date()
  const year = date.getFullYear()

  return (
    <main className="font-satoshi-regular relative flex min-h-screen items-center justify-center sm:flex-col sm:bg-white sm:px-4 md:flex-row md:bg-[#eee] md:px-0">
      <section className="relative flex h-screen flex-col overflow-hidden bg-primary sm:w-[100dvw]  md:flex md:w-[50vw]">
        <Image
          src={admoonLogo}
          alt="logo"
          width={1400}
          height={420}
          className="absolute z-[20] mb-12 block self-center sm:top-20 sm:w-[80dvw] md:top-[40%] md:w-[70%] md:max-w-[500px]"
        />
        <Image
          src={clouds}
          alt="logo"
          objectFit="fill"
          className="absolute z-[10] animate-fade-in-up self-center sm:top-0 md:bottom-0"
        />
        <p className="absolute bottom-10 self-center text-white opacity-40 sm:hidden md:block">
          © {year} Admoon - Todos os direitos reservados
        </p>
      </section>
      <nav className="z-[30] flex flex-col items-center gap-4 bg-white sm:absolute sm:bottom-0 sm:h-[70vh] sm:w-full sm:rounded-t-3xl sm:px-8 sm:py-10 md:static md:flex md:h-screen md:w-[50vw] md:justify-center md:rounded-none md:p-10 md:px-0 md:shadow-xl">
        <section className="flex flex-row sm:w-full md:w-[300px]">
          <button
            className={`${
              authMode === "admin"
                ? "border-blue-800 text-blue-800 hover:bg-blue-800/5"
                : "opacity-60 hover:bg-[#eee]"
            } w-full rounded-t-xl border-b-[2px] py-2 duration-200`}
            onClick={() => setAuthMode("admin")}
          >
            Administradores
          </button>
          <button
            className={`${
              authMode === "superuser"
                ? "border-blue-800 text-blue-800 hover:bg-blue-800/5"
                : "opacity-60 hover:bg-[#eee]"
            } w-full rounded-t-xl border-b-[2px] py-2 duration-200`}
            onClick={() => setAuthMode("superuser")}
          >
            Desenvolvedores
          </button>
        </section>
        <section className="flex flex-col gap-2 sm:w-full md:w-[300px]">
          <h1 className="font-satoshi-bold text-start sm:text-4xl md:text-3xl">
            Log in
          </h1>
          <span className="sm:text-md text-start opacity-60 md:text-sm">
            Olá {authMode === "admin" ? "administrador" : "desenvolvedor"}!
            insira suas credenciais para acessar o
            {authMode === "admin" ? "painel de administração" : "dashboard"}
          </span>
        </section>
        <AuthForm
          user={user}
          setUser={setUser}
          isLoaded={isLoaded}
          handleAuth={(e) => signIn(e, user)}
        />
        <p className="bottom-24 z-[80] self-center text-black opacity-40 sm:absolute md:hidden">
          © {year} Admoon - Todos os direitos reservados
        </p>
      </nav>
      <Toaster position="top-right" />
    </main>
  )
}
