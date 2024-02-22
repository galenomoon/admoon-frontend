"use client"
import React from "react"

//next
import { useParams, useRouter } from "next/navigation"

//config
import { parseCookies } from "nookies"

//components
import Welcome from "@/components/Welcome"

//management
import Clients from "@/components/MANAGEMENT/Clients"
import Websites from "@/components/MANAGEMENT/Websites"

//ecommerce
import Products from "@/components/ECOMMERCE/Products"
import Categories from "@/components/ECOMMERCE/Categories"

//portifolio
import Address from "@/components/PORTIFOLIO/Address"

export default function Option() {
  const { push } = useRouter()
  const { option } = useParams()
  const { token } = parseCookies()
  if (!token) return push("/login")
  
  
  // WELCOME PAGE
  if (option === "welcome") return <Welcome />

  // E-COMMERCE PAGES
  if (option === "categorias") return <Categories />
  if (option === "produtos") return <Products />

  // MANAGEMENT PAGES
  if (option === "clientes") return <Clients />
  if (option === "websites") return <Websites />

  // PORTIFOLIO PAGES
  if (option === "endereco") return <Address/>

  return (
    <section className="flex flex-col items-center justify-center sm:h-[80dvh] sm:w-[100dvw] md:h-full md:w-full">
      <p className="font-satoshi-medium animate-slide-in text-gray-500 sm:text-3xl md:text-5xl">
        👨🏽‍💻 Em desenvolvimento...
      </p>
    </section>
  )
}
