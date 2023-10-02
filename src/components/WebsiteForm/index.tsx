import React, { useEffect } from "react"

//interfaces
import { IAdmin } from "@/interfaces/admin"
import { IWebsite } from "@/interfaces/website"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { Spinner } from "@phosphor-icons/react"

interface WebsiteFormProps {
  website: IWebsite
  close: () => void
  getWebsites: () => void
}

export default function WebsiteForm({
  website,
  close,
  getWebsites,
}: WebsiteFormProps) {
  const [admins, setAdmins] = React.useState<IAdmin[]>([])
  const [newWebsite, setNewWebsite] = React.useState<IWebsite>(website)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)

  useEffect(() => {
    getAdmins()
  }, [])

  async function getAdmins() {
    setIsLoaded(false)
    await api_client
      .get("/admins")
      .then(({ data }) => setAdmins(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const endpoint = website.id ? `/websites/${website.id}` : "/websites/"
    const method = website.id ? "put" : "post"

    if (!newWebsite.url) {
      return toast.error("Informe a url do website")
    }

    if (!newWebsite.name) {
      return toast.error("Informe o nome do website")
    }

    if (!newWebsite.adminId) {
      return toast.error("Selecione o administrador do website")
    }

    setIsLoaded(false)

    await api_client[method](endpoint, newWebsite)
      .then(() => {
        getWebsites()
        toast.success("Website salvo com sucesso!")
        close()
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status === 409)
          return toast.error("Website já cadastrado")
        return toast.error("Erro ao salvar website")
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
          value={newWebsite.name}
          placeholder="Ex: Admoon"
          onChange={(event) => {
            setNewWebsite({ ...newWebsite, name: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">
          Domínio:
        </span>
        <input
          required
          type="url"
          value={newWebsite.url}
          placeholder="Ex: https://admoon.com"
          onChange={(event) => {
            setNewWebsite({ ...newWebsite, url: event.target.value })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">
          Administrador:
        </span>
        <select
          required
          value={newWebsite.adminId}
          onChange={(event) => {
            setNewWebsite({
              ...newWebsite,
              adminId: Number(event.target.value),
            })
          }}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        >
          <option value="">Selecione um administrador</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.firstName} {admin.lastName}
            </option>
          ))}
        </select>
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
