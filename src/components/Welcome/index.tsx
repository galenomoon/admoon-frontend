import React, { useContext, useEffect, useState } from "react"

//components
import EmptyState from "../EmptyState"

//assets
import welcome from "@/assets/welcome.svg"
import development from "@/assets/development.svg"

//context
import { AuthContext } from "@/contexts/authContext"

//interfaces
import { IAdmin } from "@/interfaces/admin"
import { ISuperUser } from "@/interfaces/superUser"

export default function Welcome() {
  const { currentUser, authMode } = useContext(AuthContext)
  const isSuperuser = authMode === "superuser"
  const [user, setUser] = useState<IAdmin | ISuperUser>(null as unknown as IAdmin | ISuperUser)

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
    }
  }, [currentUser])

  return (
    <section className="flex h-full flex-col items-center justify-center sm:h-[80dvh] md:w-full">
      <EmptyState
        imageSrc={isSuperuser ? development : welcome}
        imageStyle={{
          width: 564,
          figureClassName: "sm:h-[320px] md:h-[422px]",
          imageClassName: "sm:h-[300px] md:h-[370px]",
        }}
        title={`Seja Bem-vindo(a) ${user?.firstName || ""} ${
          user?.lastName || ""
        }, ${
          isSuperuser
            ? "este é o painel de desenvolvedor"
            : "este é o seu painel de administração"
        }!`}
        description={
          isSuperuser
            ? "Aqui, você gerencia seus clientes e os seus websites\nalém de ter acesso a todos os dados e métricas de cada um deles."
            : "Aqui, você encontrará todas as ferramentas para gerenciar atividades e processos com eficiência.\nExplore as funcionalidades e recursos disponíveis para uma experiência completa."
        }
      />
    </section>
  )
}
