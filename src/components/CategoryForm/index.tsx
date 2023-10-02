import React, { useContext } from "react"

//interfaces
import { ICategory } from "@/interfaces/category"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { Spinner } from "@phosphor-icons/react"

//context
import { WebsiteContext } from "@/contexts/websiteContext"

interface CategoryFormProps {
  category: ICategory
  close: () => void
  getCategories: () => void
}

export default function CategoryForm({
  category,
  close,
  getCategories,
}: CategoryFormProps) {
  const { currentWebsite } = useContext(WebsiteContext)
  const [name, setName] = React.useState<string>(category.name)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const endpoint = category.id ? `/categories/${category.id}` : "/categories"
    const method = category.id ? "put" : "post"

    if (!name) return toast.error("Preencha o nome da categoria")

    setIsLoaded(false)

    await api_client[method](`websites/${currentWebsite.id}` + endpoint, {
      name,
    })
      .then(() => {
        getCategories()
        toast.success("Categoria salva com sucesso!")
        close()
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status === 409)
          return toast.error("Já existe uma categoria com esse nome")
        return toast.error("Erro ao salvar categoria")
      })
      .finally(() => setIsLoaded(true))
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-typography-main font-satoshi-medium">Nome:</span>
        <input
          required
          type="text"
          value={name}
          placeholder="Nome da categoria"
          onChange={(event) => setName(event.target.value)}
          className="border-background-gray/20 rounded-lg border px-4 py-2"
        />
      </label>
      <div className="flex  gap-2">
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
