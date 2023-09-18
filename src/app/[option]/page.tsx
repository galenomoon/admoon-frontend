"use client"
import React from 'react'

//components
import Welcome from '@/components/Welcome';

//next
import { useParams } from 'next/navigation'

export default function Option() {
  const { option } = useParams()

  if (option === "categorias") return <Welcome />
  if (option === "produtos") return <Welcome />
  if (option === "redes-sociais") return <Welcome />
  if (option === "estatisticas") return <Welcome />
  if (!option) return <Welcome />
  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <p className="text-5xl font-satoshi-medium text-gray-500 animate-slide-in">
        👨🏽‍💻 Em desenvolvimento...
      </p>
    </section>
  )
}
