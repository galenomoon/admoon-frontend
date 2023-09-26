import React, { useEffect, useState } from "react"

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
import ClientForm from "../ClientForm"
import ClientsList from "../ClientsList"

//interfaces
import { IAdmin } from "@/interfaces/admin"

export default function Clients() {
  const { cadastrar } = useParams()
  const openModal = eval(cadastrar as string)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(openModal)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] = useState<IAdmin>()
  const [clients, setClients] = useState<IAdmin[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    getClients()
  }, [])

  async function getClients() {
    setIsLoaded(false)
    return await api_client
      .get("/admins")
      .then(({ data }) => setClients(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  async function deleteClient() {
    if (!selectedClient) return
    await api_client
      .delete(`/admins/${selectedClient.id}`)
      .then(({ data }) => {
        setClients(data)
        toast.success("Cliente excluído com sucesso")
      })
      .catch((error) => {
        console.error(error)
        toast.error("Erro ao excluir cliente")
      })
      .finally(() => close())
  }

  function openDeleteAlert(client: IAdmin) {
    setSelectedClient(client)
    setIsAlertOpen(true)
  }

  function openEditModal(client: IAdmin) {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  function close() {
    setIsAlertOpen(false)
    setIsModalOpen(false)
    setSelectedClient(undefined)
  }

  return (
    <>
      <main className="relative flex h-full w-full flex-col gap-6">
        <h1 className="font-satoshi-medium text-3xl sm:hidden md:block">
          Clientes
        </h1>
        <Button
          className="fixed bottom-[140px] right-7 z-[99] !h-[64px] !w-[64px] flex-shrink-0 !rounded-full md:hidden"
          disabled={!clients.length}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={32} color="#FFF" className="flex-shrink-0" />
        </Button>
        <section className="flex h-full w-full flex-col gap-6">
          <div className="text-typography-main relative flex w-full flex-col overflow-hidden rounded-xl bg-white pb-2 shadow-lg sm:h-[80dvh] sm:w-screen md:h-[85vh] md:w-full">
            <header className="h-[68px] w-full items-center justify-between bg-white p-4 sm:hidden md:flex">
              <p className="text-typography-main font-satoshi-semibold text-xl">
                Gerenciar Clientes
              </p>
              <br />
              <Button onClick={() => setIsModalOpen(true)}>
                Cadastrar cliente
              </Button>
            </header>
            <ClientsList
              isLoaded={isLoaded}
              clients={clients}
              openEditModal={openEditModal}
              setIsModalOpen={setIsModalOpen}
              openDeleteAlert={openDeleteAlert}
            />
          </div>
        </section>
      </main>
      <Alert
        onConfirm={() => deleteClient()}
        isOpen={!!selectedClient && isAlertOpen}
        close={() => close()}
        title={`Excluir cliente "${selectedClient?.firstName} ${selectedClient?.lastName}"`}
        message="Tem certeza que deseja excluir este cliente?"
        warning="O acesso aos websites deste cliente será excluído também."
      />
      <Modal
        isOpen={isModalOpen}
        close={() => close()}
        title={
          selectedClient?.id ? "Editar cliente" : "Cadastrar cliente"
        }
      >
        <ClientForm
          getClients={getClients}
          close={() => close()}
          client={selectedClient || { id: 0, firstName: "", lastName: "", email: "", password: "" }}
        />
      </Modal>
    </>
  )
}
