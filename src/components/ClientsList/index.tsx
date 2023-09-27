import React from "react"

//next
import Link from "next/link"

//components
import EmptyState from "../EmptyState"

//styles
import { Browsers, NotePencil, Spinner, Trash } from "@phosphor-icons/react"

//interfaces
import { IAdmin } from "@/interfaces/admin"

interface ClientsListProps {
  clients: IAdmin[]
  isLoaded: boolean
  setIsModalOpen: (value: boolean) => void
  openEditModal: (client: IAdmin) => void
  openDeleteAlert: (client: IAdmin) => void
}

export default function ClientsList({
  clients,
  isLoaded,
  setIsModalOpen,
  openEditModal,
  openDeleteAlert,
}: ClientsListProps) {
  if (!isLoaded)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner className="animate-spin" size={50} />
      </div>
    )

  if (clients?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Clique no botão abaixo para criar um novo cliente"
          buttonLabel="Cadastrar cliente"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
    )
  }

  return (
    <section className="scrollbar-hide w-full overflow-auto">
      <table className="font-satoshi-regular h-full w-full table-auto text-left text-sm">
        <thead className="font-satoshi-medium sticky top-0 z-10 h-12 bg-white shadow-sm">
          <tr>
            <th className="whitespace-nowrap p-4 opacity-40">#</th>
            <th className="whitespace-nowrap p-4">Nome Completo</th>
            <th className="whitespace-nowrap p-4">E-mail</th>
            <th className="whitespace-nowrap p-4">Websites cadastrados</th>
            <th className="whitespace-nowrap p-4">Criado em</th>
            <th className="whitespace-nowrap p-4">Atualizado em</th>
            <th className="flex justify-end whitespace-nowrap p-4"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => {
            if (!client.createdAt || !client.updatedAt) return null

            const createdAt = new Date(client.createdAt)
            const updatedAt = new Date(client.updatedAt)

            return (
              <tr
                key={index}
                className="font-satoshi-normal border-background-gray/20 w-full border-y text-sm duration-200 ease-in-out last:border-b-0 hover:cursor-pointer hover:bg-blue-400/5"
              >
                <td className="whitespace-nowrap p-4 opacity-40">
                  {client.id}
                </td>
                <td className="whitespace-nowrap p-4">
                  {client.firstName} {client.lastName}
                </td>
                <td className="whitespace-nowrap p-4">{client.email}</td>
                <td className="whitespace-nowrap p-4">
                  <p
                    className={`font-satoshi-medium text-sm ${
                      client?.websites?.length === 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {client?.websites?.length}
                  </p>
                </td>
                <td className="whitespace-nowrap p-4">
                  {createdAt?.toLocaleString("pt-BR")}
                </td>
                <td className="whitespace-nowrap p-4">
                  {updatedAt?.toLocaleString("pt-BR")}
                </td>
                <td className="flex justify-end gap-2 p-4">
                  <button
                    onClick={() => openEditModal(client)}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-800/20 bg-blue-400/20 p-1 text-blue-800 duration-200 hover:opacity-60"
                  >
                    <NotePencil size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Editar</p>
                  </button>
                  <button
                    onClick={() => openDeleteAlert(client)}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-800/20 bg-red-400/20 p-1 text-red-800 duration-200 hover:opacity-60"
                  >
                    <Trash size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Excluir</p>
                  </button>
                  <a
                    href={client.websites?.[0]?.url || "#"}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 ${client.websites?.length ? "border-green-800/20 bg-green-400/20 text-green-800" : "border-gray-800/20 bg-gray-400/20 text-gray-800 opacity-60 cursor-default"} p-1 duration-200 hover:opacity-60`}
                  >
                    <Browsers size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Acessar</p>
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
