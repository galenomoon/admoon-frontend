import React, { useEffect } from "react"

//next
import Link from "next/link"

//interfaces
import { IService } from "@/interfaces/service"
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
  const [services, setServices] = React.useState([])
  const [selectedServices, setSelectedServices] = React.useState<IService[]>(
    website.services || [],
  )
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)
  const [isServicesLoaded, setIsServicesLoaded] = React.useState<boolean>(true)

  useEffect(() => {
    getServices()
  }, [])

  useEffect(() => {
    if (website.services) {
      setSelectedServices(website.services)
    }
  }, [website])

  async function getServices() {
    setIsServicesLoaded(false)

    await api_client
      .get("/services/")
      .then(({ data }) => {
        setServices(data)
      })
      .catch((error) => {
        console.error(error)
        return toast.error("Ocorreu um erro ao carregar os serviços")
      })
      .finally(() => setIsServicesLoaded(true))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!website.id) {
      return toast.error("Tente novamente mais tarde")
    }

    setIsLoaded(false)

    await api_client
      .post(`/websites/${website.id}/services`, { services: selectedServices })
      .then(() => {
        getWebsites()
        close()
        toast.success("Serviços salvos com sucesso")
      })
      .catch((error) => {
        console.error(error)
        return toast.error("Tente novamente mais tarde")
      })
      .finally(() => setIsLoaded(true))
  }

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
        {isServicesLoaded ? (
          services.map((service: IService) => {
            const isServiceSelected = selectedServices?.some(
              (item) => item.id === service.id,
            )
            const Checkbox = isServiceSelected
              ? ImCheckboxChecked
              : ImCheckboxUnchecked
            return (
              <div key={service.id} className="flex flex-col gap-1">
                <label
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => {
                    setSelectedServices(
                      isServiceSelected
                        ? selectedServices.filter(
                            (item) => item.id !== service.id,
                          )
                        : [...selectedServices, service],
                    )
                  }}
                >
                  <Checkbox
                    size={18}
                    className={
                      isServiceSelected ? "text-blue-800" : "text-gray-400"
                    }
                  />
                  <span className="text-typography-main font-satoshi-medium">
                    {service.name}
                  </span>
                </label>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            )
          })
        ) : (
          <Spinner size={32} className="animate-spin self-center" />
        )}
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
