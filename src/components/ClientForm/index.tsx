import React, { useEffect } from "react"

//interfaces
import { IAdmin } from "@/interfaces/admin"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { Spinner } from "@phosphor-icons/react"

interface ClientFormProps {
  client: IAdmin
  close: () => void
  getClients: () => void
}

export default function ClientForm({
  client,
  close,
  getClients,
}: ClientFormProps) {
  const [newClient, setNewClient] = React.useState<IAdmin>(client)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)

  useEffect(() => {
    setNewClient(client)
  }, [client])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const endpoint = client.id ? `/admins/${client.id}` : "/admins/register"
    const method = client.id ? "put" : "post"

    if (!newClient.firstName) {
      return toast.error("Preencha o nome do cliente")
    }

    if (!newClient.lastName) {
      return toast.error("Preencha o sobrenome do cliente")
    }

    if (!newClient.email) {
      return toast.error("Preencha o email do cliente")
    }

    if (!newClient.password) {
      return toast.error("Preencha a senha do cliente")
    }

    setIsLoaded(false)

    await api_client[method](endpoint, newClient)
      .then(() => {
        getClients()
        toast.success("Cliente salvo com sucesso!")
        close()
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status === 409)
          return toast.error("Cliente já cadastrado")
        return toast.error("Erro ao salvar cliente")
      })
      .finally(() => setIsLoaded(true))
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">Nome:</span>
        <input
          required
          type="text"
          value={newClient.firstName}
          placeholder="Ex: João"
          onChange={(event) => {
            setNewClient({ ...newClient, firstName: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">
          Sobrenome:
        </span>
        <input
          required
          type="text"
          value={newClient.lastName}
          placeholder="Ex: Silva"
          onChange={(event) => {
            setNewClient({ ...newClient, lastName: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">Email:</span>
        <input
          required
          type="email"
          value={newClient.email}
          placeholder="Ex: joãodasilva@gmail.com"
          onChange={(event) => {
            setNewClient({ ...newClient, email: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">Senha:</span>
        <input
          required
          type="text"
          value={newClient.password}
          placeholder="********"
          onChange={(event) => {
            setNewClient({ ...newClient, password: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <div className="mt-2 flex gap-2">
        <button className="font-satoshi-medium flex h-12 w-full items-center justify-center rounded-lg bg-blue-800 px-4 text-white hover:opacity-80">
          {isLoaded ? "Salvar" : <Spinner size={32} className="animate-spin" />}
        </button>
        <button
          onClick={close}
          type="button"
          className="text-typography-main font-satoshi-medium w-full rounded-lg bg-gray-200 px-4 py-2 hover:opacity-80"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
