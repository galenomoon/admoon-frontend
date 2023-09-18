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
    <main className="font-satoshi-regular relative flex min-h-screen items-center justify-center sm:bg-white sm:px-4 md:bg-[#eee] md:px-0">
      <section className="w-[50vw] h-screen bg-primary flex flex-col sm:hidden md:flex relative">
        <Image
          src={admoonLogo}
          alt="logo"
          width={1000}
          height={120}
          className="mb-12 w-[600px] sm:hidden md:block self-center absolute bottom-[45%] z-[20]"
        />
        <Image
          src={clouds}
          alt="logo"
          objectFit="fill"
          className="sm:hidden md:block self-center absolute bottom-0 z-[10] animate-fade-in-up"
        />
        <p className="text-white absolute bottom-10 self-center opacity-40">
          © {year} Admoon - Todos os direitos reservados
        </p>
      </section>
      <nav className=" relative flex flex-col items-center justify-center gap-4 md:rounded-none sm:rounded-[12px] bg-white sm:w-[96vw] sm:px-4 sm:py-10 md:w-[50vw] md:h-screen md:p-10 md:shadow-xl">
        <section className="flex flex-col gap-2 w-[300px]">
          <h1 className="font-satoshi-bold text-start text-3xl">Log in</h1>
          <span className="text-start text-sm opacity-60">
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
      </nav>
      <Toaster position="top-right" />
    </main>
  )
}
