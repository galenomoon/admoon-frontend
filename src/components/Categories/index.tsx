import React, { useContext, useEffect, useState } from "react"

//next
import { useParams } from "next/navigation"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { Plus } from "@phosphor-icons/react"

//components
import Modal from "../Modal"
import Alert from "../Alert"
import Button from "../Button"
import CategoryForm from "../CategoryForm"
import CategoriesList from "../CategoriesList"

//interfaces
import { ICategory } from "@/interfaces/category"

//contexts
import { WebsiteContext } from "@/contexts/websiteContext"

export default function Categories() {
  const { cadastrar } = useParams()
  const openModal = eval(cadastrar as string)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(openModal)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<ICategory>()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const { currentWebsite } = useContext(WebsiteContext)

  useEffect(() => {
    getCategories()
  }, [currentWebsite?.id])

  async function getCategories() {
    setIsLoaded(false)
    if (!currentWebsite) return
    return await api_client
      .get(`websites/${currentWebsite.id}/categories`)
      .then(({ data }) => setCategories(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  async function deleteCategory() {
    if (!selectedCategory) return
    await api_client
      .delete(`websites/${currentWebsite.id}/categories/${selectedCategory.id}`)
      .then(({ data }) => {
        setCategories(data)
        toast.success("Categoria excluída com sucesso")
      })
      .catch((error) => {
        console.error(error)
        toast.error("Erro ao excluir categoria")
      })
      .finally(() => close())
  }

  function openDeleteAlert(category: ICategory) {
    setSelectedCategory(category)
    setIsAlertOpen(true)
  }

  function openEditModal(category: ICategory) {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  function close() {
    setIsAlertOpen(false)
    setIsModalOpen(false)
    setSelectedCategory(undefined)
  }

  return (
    <>
      <main className="relative flex h-full w-full flex-col gap-6">
        <h1 className="font-satoshi-medium text-3xl sm:hidden md:block">
          Categorias
        </h1>
        <Button
          className="fixed bottom-[140px] right-7 z-[99] !h-[64px] !w-[64px] flex-shrink-0 !rounded-full md:hidden"
          disabled={!categories.length}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={32} color="#FFF" className="flex-shrink-0" />
        </Button>
        <section className="flex h-full w-full flex-col gap-6">
          <div className="text-typography-main relative flex w-full flex-col overflow-hidden rounded-xl bg-white pb-2 shadow-lg sm:h-[80dvh] sm:w-screen md:h-[85vh] md:w-full">
            <header className="h-[68px] w-full items-center justify-between bg-white p-4 sm:hidden md:flex">
              <p className="text-typography-main font-satoshi-semibold text-xl">
                Gerenciar Categorias
              </p>
              <br />
              <Button onClick={() => setIsModalOpen(true)}>
                Cadastrar Categoria
              </Button>
            </header>
            <CategoriesList
              isLoaded={isLoaded}
              categories={categories}
              openEditModal={openEditModal}
              setIsModalOpen={setIsModalOpen}
              openDeleteAlert={openDeleteAlert}
            />
          </div>
        </section>
      </main>
      <Alert
        onConfirm={() => deleteCategory()}
        isOpen={!!selectedCategory && isAlertOpen}
        close={() => close()}
        title={`Excluir categoria "${selectedCategory?.name}"`}
        message="Tem certeza que deseja excluir esta categoria?"
        warning="Todos os produtos desta categoria serão excluídos também."
      />
      <Modal
        isOpen={isModalOpen}
        close={() => close()}
        title={
          selectedCategory?.id ? "Editar categoria" : "Cadastrar categoria"
        }
      >
        <CategoryForm
          getCategories={getCategories}
          close={() => close()}
          category={selectedCategory || { id: 0, name: "" }}
        />
      </Modal>
    </>
  )
}
