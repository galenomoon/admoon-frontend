import React from "react"

//next
import Link from "next/link"

//interfaces
import { IWebsite } from "@/interfaces/website"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { ArrowSquareOut, Spinner } from "@phosphor-icons/react"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"

interface IWebsiteServicesFormProps {
  website: IWebsite
  close: () => void
  getWebsites: () => void
}

export default function WebsiteServicesForm({
  website,
  close,
  getWebsites,
}: IWebsiteServicesFormProps) {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const endpoint = website.id ? `/websites/${website.id}` : "/websites/"
    const method = website.id ? "put" : "post"

    if (!website.url) {
      return toast.error("Informe a url do website")
    }

    if (!website.name) {
      return toast.error("Informe o nome do website")
    }

    if (!website.adminId) {
      return toast.error("Selecione o administrador do website")
    }

    setIsLoaded(false)

    await api_client[method](endpoint, website)
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

  const servicesMock = [
    {
      id: 1,
      name: "Ecommerce",
      description: "Gerencie seus produtos e categorias",
      status: false,
    },
    {
      id: 2,
      name: "Blog",
      description: "Gerencie seus posts e categorias",
      status: false,
    },
    {
      id: 3,
      name: "Portifólio",
      description: "Gerencie seus projetos e categorias",
      status: false,
    },
  ]

  const [services, setServices] = React.useState(servicesMock)

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-3">
        <label className="flex flex-col">
          <span className="text-typography-main font-satoshi-medium">
            Nome:
          </span>
          <p>{website.name}</p>
        </label>
        <label className="flex flex-col">
          <span className="text-typography-main font-satoshi-medium">
            Domínio:
          </span>
          <Link
            href={website.url}
            className="flex w-fit items-center gap-1 text-blue-600 underline duration-200 hover:opacity-60"
          >
            <p>{website.url}</p>
            <ArrowSquareOut size={18} weight="duotone" />
          </Link>
        </label>
        <label className="flex flex-col">
          <span className="text-typography-main font-satoshi-medium">
            Administrador:
          </span>
          <p>
            {website?.admin?.firstName} {website?.admin?.lastName}
          </p>
        </label>
      </div>
      <div className="my-1 flex h-[2px] w-full bg-gray-300/30" />
      <div className="flex w-full flex-col gap-3 pb-3">
        {services.map((service) => {
          const Checkbox = service.status
            ? ImCheckboxChecked
            : ImCheckboxUnchecked
          return (
            <div key={service.id} className="flex flex-col gap-1">
              <label
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                  setServices(
                    services.map((s) => {
                      if (s.id === service.id) s.status = !s.status
                      return s
                    }),
                  )
                }}
              >
                <Checkbox
                  size={18}
                  className={service.status ? "text-blue-800" : "text-gray-400"}
                />
                <span className="text-typography-main font-satoshi-medium">
                  {service.name}
                </span>
              </label>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          )
        })}
      </div>
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
