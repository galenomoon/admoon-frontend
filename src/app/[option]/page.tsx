"use client"
import React from 'react'

//components
import Welcome from '@/components/Welcome';

//next
import { useParams } from 'next/navigation'
import Categories from '@/components/Categories';
import Products from '@/components/Products';

export default function Option() {
  const { option } = useParams()

  if (option === "categorias") return <Categories />
  if (option === "produtos") return <Products />
  if (option === "welcome") return <Welcome />

  if (option === "estatisticas" || option === "redes-sociais")
    return (
      <section className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-5xl font-satoshi-medium text-gray-500 animate-slide-in">
          👨🏽‍💻 Em desenvolvimento...
        </p>
      </section>
    )
}
