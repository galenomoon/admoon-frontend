"use client"
import React from "react"

//components
import Welcome from "@/components/Welcome"
import Products from "@/components/Products"
import Categories from "@/components/Categories"

//next
import { useParams, useRouter } from "next/navigation"

//config
import { parseCookies } from "nookies"

export default function Option() {
  const { push } = useRouter()
  const { option } = useParams()
  const { token } = parseCookies()

  if (!token) return push("/login")

  if (option === "categorias") return <Categories />
  if (option === "produtos") return <Products />
  if (option === "estatisticas" || option === "redes-sociais")

    return (
      <section className="flex flex-col items-center justify-center sm:h-[80dvh] sm:w-[100dvw] md:h-full md:w-full">
        <p className="font-satoshi-medium animate-slide-in text-gray-500 sm:text-3xl md:text-5xl">
          👨🏽‍💻 Em desenvolvimento...
        </p>
      </section>
    )
  if (option === "welcome") return <Welcome />
}
