"use client"
import React, { useState } from "react"

//next
import Image from "next/image"
import { useRouter } from "next/navigation"

//assets
import admoonLogo from "@/assets/dark_logo.png"
import clouds from "@/assets/clouds.png"

//styles
import { Toaster, toast } from "react-hot-toast"

//interfaces
import { IUser } from "@/interfaces/user"

//components
import AuthForm from "@/components/AuthForm"

//config
import { setCookie } from "nookies"
import api_client from "@/config/api_client"

export default function Login() {
  const [user, setUser] = useState<IUser>({ email: "", password: "" })
  const [isLoaded, setIsLoaded] = useState(true)

  const { push } = useRouter()

  const date = new Date()
  const year = date.getFullYear()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()

    setIsLoaded(false)
    await api_client
      .post("/auth/login", user)
      .then(({ data }) => {
        setCookie(undefined, "token", data.token)
        push("/welcome")
      })
      .catch((err) => {
        console.error(err)
        if (err.response.status === 401) {
          return toast.error("Email ou senha incorretos")
        }
        if (err.response.status === 404) {
          return toast.error("Usuário não encontrado")
        }
        if (err.response.status === 500) {
          return toast.error("Algo deu errado, tente novamente mais tarde")
        }
      })
      .finally(() => setIsLoaded(true))
  }

  return (
    <main className="font-satoshi-regular relative flex min-h-screen items-center justify-center sm:flex-col sm:bg-white sm:px-4 md:flex-row md:bg-[#eee] md:px-0">
      <section className="relative flex overflow-hidden h-screen flex-col bg-primary sm:w-[100dvw]  md:flex md:w-[50vw]">
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
        <p className="bottom-10 self-center text-white opacity-40 sm:hidden md:block absolute">
          © {year} Admoon - Todos os direitos reservados
        </p>
      </section>
      <nav className="z-[30] flex flex-col items-center gap-4 bg-white sm:absolute sm:bottom-0 sm:h-[70vh] sm:w-full sm:rounded-t-3xl sm:px-8 sm:py-10 md:static md:flex md:h-screen md:w-[50vw] md:justify-center md:rounded-none md:p-10 md:px-0 md:shadow-xl">
        <section className="flex flex-col gap-2 sm:w-full md:w-[300px]">
          <h1 className="font-satoshi-bold text-start sm:text-4xl md:text-3xl">Log in</h1>
          <span className="text-start md:text-sm sm:text-md opacity-60">
            Olá, insira suas credenciais para acessar o <br />
            painel de administração
          </span>
        </section>
        <AuthForm
          user={user}
          setUser={setUser}
          isLoaded={isLoaded}
          handleAuth={handleAuth}
        />
        <p className="bottom-24 z-[80] self-center text-black opacity-40 sm:absolute md:hidden">
          © {year} Admoon - Todos os direitos reservados
        </p>
      </nav>
      <Toaster position="top-right" />
    </main>
  )
}
