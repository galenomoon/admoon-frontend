"use client"
import React, { useContext, useEffect } from "react"

//components
import EmptyState from "../EmptyState"

//assets
import welcome from "@/assets/welcome.svg"
import development from "@/assets/development.svg"

//context
import { AuthContext } from "@/contexts/authContext"

export default function Welcome() {
  const { currentUser, authMode, getCurrentUser } = useContext(AuthContext)

  useEffect(() => {
    getCurrentUser()
  }, [authMode, currentUser])

  return (
    <section className="flex h-full flex-col items-center justify-center sm:h-[80dvh] md:w-full">
      <EmptyState
        imageSrc={authMode === "superuser" ? development : welcome}
        imageStyle={{
          width: 564,
          figureClassName: "sm:h-[320px] md:h-[422px]",
          imageClassName: "sm:h-[300px] md:h-[370px]",
        }}
        title={`Seja Bem-vindo(a) ${currentUser?.firstName || ""} ${
          currentUser?.lastName || ""
        }, ${
          authMode === "superuser"
            ? "este é o painel de desenvolvedor"
            : "este é o seu painel de administração"
        }!`}
        description={
          authMode === "superuser"
            ? "Aqui, você gerencia seus clientes e os seus websites\nalém de ter acesso a todos os dados e métricas de cada um deles."
            : "Aqui, você encontrará todas as ferramentas para gerenciar atividades e processos com eficiência.\nExplore as funcionalidades e recursos disponíveis para uma experiência completa."
        }
      />
    </section>
  )
}
