import React from "react"

//next
import Link from "next/link"

//components
import EmptyState from "../EmptyState"

//styles
import { Gear, NotePencil, Spinner, Trash } from "@phosphor-icons/react"

//interfaces
import { IWebsite } from "@/interfaces/website"

interface WebsitesListProps {
  websites: IWebsite[]
  isLoaded: boolean
  setIsModalOpen: (value: boolean) => void
  openEditModal: (website: IWebsite) => void
  openDeleteAlert: (website: IWebsite) => void
}

export default function WebsitesList({
  websites,
  isLoaded,
  setIsModalOpen,
  openEditModal,
  openDeleteAlert,
}: WebsitesListProps) {
  if (!isLoaded)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Spinner className="animate-spin" size={50} />
      </div>
    )

  if (websites?.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <EmptyState
          title="Nenhum website cadastrado"
          description="Clique no botão abaixo para criar um novo website"
          buttonLabel="Cadastrar website"
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
            <th className="whitespace-nowrap p-4">Nome</th>
            <th className="whitespace-nowrap p-4">Domínio</th>
            <th className="whitespace-nowrap p-4">Administrador</th>
            <th className="whitespace-nowrap p-4">Criado em</th>
            <th className="whitespace-nowrap p-4">Atualizado em</th>
            <th className="flex justify-end whitespace-nowrap p-4"></th>
          </tr>
        </thead>
        <tbody>
          {websites.map((website, index) => {
            if (!website.createdAt || !website.updatedAt) return null

            const createdAt = new Date(website.createdAt)
            const updatedAt = new Date(website.updatedAt)

            return (
              <tr
                key={index}
                className="font-satoshi-normal border-background-gray/20 w-full border-y text-sm duration-200 ease-in-out last:border-b-0 hover:cursor-pointer hover:bg-blue-400/5"
              >
                <td className="whitespace-nowrap p-4 opacity-40">
                  {website.id}
                </td>
                <td className="whitespace-nowrap p-4">{website.name}</td>
                <td className="whitespace-nowrap p-4">
                  <a href={website.url} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                    {website.url}
                  </a>
                </td>
                <td className="whitespace-nowrap p-4">
                  {website?.admin?.firstName} {website?.admin?.lastName}
                </td>
                <td className="whitespace-nowrap p-4">
                  {createdAt?.toLocaleString("pt-BR")}
                </td>
                <td className="whitespace-nowrap p-4">
                  {updatedAt?.toLocaleString("pt-BR")}
                </td>
                <td className="flex justify-end gap-2 p-4">
                  <button
                    onClick={() => openEditModal(website)}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-800/20 bg-blue-400/20 p-1 text-blue-800 duration-200 hover:opacity-60"
                  >
                    <NotePencil size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Editar</p>
                  </button>
                  <button
                    onClick={() => openDeleteAlert(website)}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-800/20 bg-red-400/20 p-1 text-red-800 duration-200 hover:opacity-60"
                  >
                    <Trash size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Excluir</p>
                  </button>
                  <Link
                    href={`/produtos?website=${website.id}`}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-green-800/20 bg-green-400/20 p-1 text-green-800 duration-200 hover:opacity-60"
                  >
                    <Gear size={28} weight="duotone" />
                    <p className="font-satoshi-medium pr-1">Serviços</p>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
