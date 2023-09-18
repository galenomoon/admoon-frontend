import React from 'react'

//next
import Link from 'next/link'

//interfaces
import { ICategory } from '@/interfaces/category'

//components
import EmptyState from '../EmptyState'

//styles
import { Basket, NotePencil, Spinner, Trash } from '@phosphor-icons/react'


interface CategoriesListProps {
  categories: ICategory[]
  isLoaded: boolean
  setIsModalOpen: (value: boolean) => void
  openEditModal: (category: ICategory) => void
  openDeleteAlert: (category: ICategory) => void
}

export default function CategoriesList({ categories, isLoaded, setIsModalOpen, openEditModal, openDeleteAlert }: CategoriesListProps) {

  if (!isLoaded) return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <Spinner className='animate-spin' size={50} />
    </div>
  )

  if (categories?.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full'>
        <EmptyState
          title='Nenhuma categoria cadastrada'
          description='Clique no botão abaixo para criar uma nova categoria'
          buttonLabel='Cadastrar categoria'
          onClick={() => setIsModalOpen(true)}
        />
      </div>
    )
  }

  return (
    <section className='overflow-auto scrollbar-hide w-full'>
      <table className="table-auto w-full text-left font-satoshi-regular h-full text-sm">
        <thead className="h-12 font-satoshi-medium sticky top-0 z-10 bg-white shadow-sm">
          <tr>
            <th className='p-4 whitespace-nowrap opacity-40'>#</th>
            <th className='p-4 whitespace-nowrap'>Nome</th>
            <th className='p-4 whitespace-nowrap'>Produtos cadastrados</th>
            <th className='p-4 whitespace-nowrap'>Criado em</th>
            <th className='p-4 whitespace-nowrap'>Atualizado em</th>
            <th className='p-4 whitespace-nowrap flex justify-end'></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => {
            if (!category.createdAt || !category.updatedAt) return null

            const createdAt = new Date(category.createdAt)
            const updatedAt = new Date(category.updatedAt)

            return (
              <tr key={index} className="w-full border-y last:border-b-0 text-sm font-satoshi-normal border-background-gray/20 hover:cursor-pointer duration-200 ease-in-out hover:bg-blue-400/5">
                <td className='p-4 whitespace-nowrap opacity-40'>{category.id}</td>
                <td className='p-4 whitespace-nowrap'>{category.name}</td>
                <td className='p-4 whitespace-nowrap'>
                  <p className={`text-sm font-satoshi-medium ${category.quantityProducts === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {category.quantityProducts}
                  </p>
                </td>
                <td className='p-4 whitespace-nowrap'>{createdAt?.toLocaleString('pt-BR')}</td>
                <td className='p-4 whitespace-nowrap'>{updatedAt?.toLocaleString('pt-BR')}</td>
                <td className='p-4 flex gap-2 justify-end'>
                  <button onClick={() => openEditModal(category)} className='flex gap-2 items-center text-blue-800 bg-blue-400/20 border-2 border-blue-800/20 hover:opacity-60 duration-200 rounded-lg p-1 justify-center'>
                    <NotePencil size={28} weight="duotone" />
                    <p className='font-satoshi-medium pr-1'>
                      Editar
                    </p>
                  </button>
                  <button onClick={() => openDeleteAlert(category)} className='flex gap-2 items-center text-red-800 bg-red-400/20 border-2 border-red-800/20 hover:opacity-60 duration-200 rounded-lg p-1 justify-center'>
                    <Trash size={28} weight="duotone" />
                    <p className='font-satoshi-medium pr-1'>
                      Excluir
                    </p>
                  </button>
                  <Link
                    href={`/produtos?category=${category.id}`}
                    className='flex gap-2 items-center text-green-800 bg-green-400/20 border-2 border-green-800/20 hover:opacity-60 duration-200 rounded-lg p-1 justify-center'
                  >
                    <Basket size={28} weight="duotone" />
                    <p className='font-satoshi-medium pr-1'>
                      Produtos
                    </p>
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
