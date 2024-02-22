import React, { useEffect, useState } from "react"

//next
import { useParams } from "next/navigation"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { Plus } from "@phosphor-icons/react"

//components
import Modal from "../../Modal"
import Alert from "../../Alert"
import Button from "../../Button"
import WebsiteForm from "../../WebsiteForm"
import WebsitesList from "../../WebsitesList"
import WebsiteServicesForm from "../../WebsiteServicesForm"

//interfaces
import { IWebsite } from "@/interfaces/website"

export default function Websites() {
  const { cadastrar } = useParams()
  const openModal = eval(cadastrar as string)
  const [isModalOpen, setIsModalOpen] = useState<{
    show: boolean
    type: "create" | "edit" | "services"
  }>({
    show: openModal,
    type: "create",
  })
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [selectedWebsite, setSelectedWebsite] = useState<IWebsite>()
  const [websites, setWebsites] = useState<IWebsite[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    getWebsites()
  }, [])

  async function getWebsites() {
    setIsLoaded(false)
    return await api_client
      .get("/websites")
      .then(({ data }) => setWebsites(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  async function deleteClient() {
    if (!selectedWebsite) return
    await api_client
      .delete(`/websites/${selectedWebsite.id}`)
      .then(({ data }) => {
        setWebsites(data)
        toast.success("Website excluído com sucesso")
      })
      .catch((error) => {
        console.error(error)
        toast.error("Erro ao excluir website")
      })
      .finally(() => close())
  }

  function openDeleteAlert(website: IWebsite) {
    setSelectedWebsite(website)
    setIsAlertOpen(true)
  }

  function openEditModal(website: IWebsite) {
    setSelectedWebsite(website)
    setIsModalOpen({ show: true, type: "edit" })
  }

  function openServicesModal(website: IWebsite) {
    setSelectedWebsite(website)
    setIsModalOpen({ show: true, type: "services" })
  }

  function close() {
    setIsAlertOpen(false)
    setIsModalOpen({ show: false, type: "create" })
    setSelectedWebsite(undefined)
  }

  return (
    <>
      <main className="relative flex h-full w-full flex-col gap-6">
        <h1 className="font-satoshi-medium text-3xl sm:hidden md:block">
          Websites
        </h1>
        <Button
          className="fixed bottom-[140px] right-7 z-[99] !h-[64px] !w-[64px] flex-shrink-0 !rounded-full md:hidden"
          disabled={!websites.length}
          onClick={() => setIsModalOpen({ show: true, type: "create" })}
        >
          <Plus size={32} color="#FFF" className="flex-shrink-0" />
        </Button>
        <section className="flex h-full w-full flex-col gap-6">
          <div className="text-typography-main relative flex w-full flex-col overflow-hidden rounded-xl bg-white pb-2 shadow-lg sm:h-[80dvh] sm:w-screen md:h-[85vh] md:w-full">
            <header className="h-[68px] w-full items-center justify-between bg-white p-4 sm:hidden md:flex">
              <p className="text-typography-main font-satoshi-semibold text-xl">
                Gerenciar Websites
              </p>
              <br />
              <Button
                onClick={() => setIsModalOpen({ show: true, type: "create" })}
              >
                Cadastrar website
              </Button>
            </header>
            <WebsitesList
              isLoaded={isLoaded}
              websites={websites}
              openEditModal={openEditModal}
              setIsModalOpen={setIsModalOpen}
              openDeleteAlert={openDeleteAlert}
              openServicesModal={openServicesModal}
            />
          </div>
        </section>
      </main>
      <Alert
        onConfirm={() => deleteClient()}
        isOpen={!!selectedWebsite && isAlertOpen}
        close={() => close()}
        title={`Excluir website "${selectedWebsite?.name}"`}
        message="Tem certeza que deseja excluir este website?"
        confirmationPassword={selectedWebsite?.name}
        warning="O website será excluído permanentemente."
      />
      <Modal
        isOpen={isModalOpen.show}
        close={() => close()}
        title={
          isModalOpen.type === "create"
            ? "Cadastrar website"
            : isModalOpen.type === "edit"
            ? "Editar website"
            : "Serviços"
        }
      >
        {isModalOpen.type === "services" ? (
          <WebsiteServicesForm
            website={selectedWebsite as IWebsite}
            close={() => close()}
            getWebsites={getWebsites}
          />
        ) : (
          <WebsiteForm
            getWebsites={getWebsites}
            close={() => close()}
            website={
              selectedWebsite || {
                id: 0,
                name: "",
                url: "",
              }
            }
          />
        )}
      </Modal>
    </>
  )
}
