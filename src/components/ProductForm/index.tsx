import React, { useContext, useRef } from "react"

//next
import Image from "next/image"

//interfaces
import { IImage } from "@/interfaces/image"
import { IProduct } from "@/interfaces/product"
import { ICategory } from "@/interfaces/category"

//config
import api_client from "@/config/api_client"

//styles
import { toast } from "react-hot-toast"
import { AnimatePresence, Reorder, motion } from "framer-motion"
import { HiPlusSm } from "react-icons/hi"
import { IoMdClose } from "react-icons/io"
import { Spinner } from "@phosphor-icons/react"

//contexts
import { WebsiteContext } from "@/contexts/websiteContext"
import axios from "axios"

interface ProductFormProps {
  product: IProduct
  close: () => void
  getAll: () => void
  categories: ICategory[]
}

export default function ProductForm({
  categories,
  product: productByProp,
  close,
  getAll,
}: ProductFormProps) {
  const { currentWebsite } = useContext(WebsiteContext)
  const input_ref = useRef<HTMLInputElement>(null)
  const [imagesToDelete, setImagesToDelete] = React.useState<IImage["id"][]>([])
  const [images, setImages] = React.useState<IImage[]>(
    productByProp.images || [],
  )
  const [product, setProduct] = React.useState<IProduct>({
    ...productByProp,
  })
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoaded(false)
    try {
      await submitProduct()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar produto")
    } finally {
      setIsLoaded(true)
    }
  }

  async function submitProduct() {
    const endpoint = product.id ? `/products/${product.id}` : "/products"
    const method = product.id ? "put" : "post"
    const payload = {
      ...product,
      price: Number(String(product.price).replace(/\D/g, "")) / 100,
    }

    if (!payload.name) {
      return toast.error("Preencha o nome do produto")
    }
    if (!payload.description) {
      return toast.error("Preencha a descrição do produto")
    }
    if (!payload.price) {
      return toast.error("Preencha o preço do produto")
    }
    if (!payload.categoryId) {
      return toast.error("Selecione uma categoria")
    }
    if (!images.length) {
      return toast.error("Adicione pelo menos uma imagem ao produto")
    }

    return await api_client[method](
      `websites/${currentWebsite.id}` + endpoint,
      payload,
    )
      .then(async ({ data }) => {
        try {
          await handleImages(data as IProduct)
        } catch (error) {
          console.error(error)
          toast.error("Erro ao salvar imagens")
        } finally {
          getAll()
          toast.success("Produto salvo com sucesso!")
          close()
        }
      })
      .catch(console.error)
  }

  async function handleImages(product: IProduct) {
    await deleteImages()
    await uploadImages(product)
    await shuffleImages(product)
  }

  async function shuffleImages(product: IProduct) {
    if (!images.length) return
    const initialImagesOrder = images.map((image) => image.id)
    const hasOrderChanged = initialImagesOrder.some(
      (id, index) => id !== product?.images?.[index]?.id,
    )
    if (!hasOrderChanged) return

    const formData = new FormData()
    for (const image of images) {
      if (image.id) {
        const fileImage = await convertImageToBlob(image)
        console.log(fileImage)
        if (fileImage) {
          formData.append("images", fileImage as unknown as File)
        }
      } else {
        formData.append("images", image as unknown as File)
      }
    }

    return await api_client.post(`/images/shuffle/${product.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  async function convertImageToBlob(image: IImage) {
    if (image.url) {
      try {
        const response = await axios.get(image.url, { responseType: "blob" })
        return new File(
          [response.data],
          image.filename || "image_" + Date.now(),
          {
            type: "image/png",
          },
        )
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function uploadImages(product: IProduct) {
    const hasNewImages = images?.some((image) => !image.id)
    if (!hasNewImages) return
    if (!images.length) return

    const formData = new FormData()
    images.forEach((image) => {
      if (image.id) return
      console.log({ File: image as unknown as File })
      formData.append("images", image as unknown as File)
    })
    return await api_client.post(`/images/${product.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  async function deleteImages() {
    if (!imagesToDelete.length) return
    const deleteRequests = imagesToDelete.map(async (id) => {
      return await api_client.delete(`/images/${id}`)
    })
    return await Promise.all(deleteRequests).catch(console.error)
  }

  function currencyFormat(value?: string | number) {
    const isNumber = typeof value === "number"
    const number = Number(
      `${isNumber ? value * 100 : value}`?.replace(/\D/g, ""),
    )
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number / 100)
  }

  function handleRemoveImage(index: number) {
    if (product.id && images[index]?.id) {
      setImagesToDelete([...imagesToDelete, images[index].id])
    }
    return setImages(images.filter((_, i) => i !== index))
  }

  function handleSetFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (Array.from(e?.target?.files as unknown as FileList).length > 6) {
      return toast.error("Você só pode adicionar até 6 imagens")
    }

    const image = e?.target?.files as unknown as IImage[]
    setImages([...images, ...image] as unknown as IImage[])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit flex-col gap-4 overflow-auto pb-3 sm:w-full md:w-full"
    >
      <section
        id="images"
        className="border-typography-black/10 flex w-full flex-col gap-4 overflow-hidden border-y-[1.6px] pb-4 pt-6"
      >
        <aside className="flex w-full items-center justify-between gap-3">
          <article className="flex flex-col justify-center text-start">
            <p className="text-xl font-semibold">Anexar imagens</p>
            <p className="text-typography-light opacity-60">
              Adicione imagens ao produto (máximo 6)
            </p>
          </article>
          <button
            type="button"
            onClick={() => input_ref?.current?.click()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/40 p-2 duration-150 hover:opacity-80"
          >
            <HiPlusSm size={32} className="cursor-pointer text-blue-600" />
          </button>
        </aside>
        <div className="flex flex-col">
          <Reorder.Group
            axis="x"
            values={images}
            className="scrollbar-hide flex gap-2 sm:w-full md:w-[500px]"
            onReorder={setImages}
            layoutScroll
            style={{ overflowX: "scroll" }}
          >
            <AnimatePresence>
              {images?.map((image, index) => (
                <Reorder.Item
                  key={image.id || image?.name || index}
                  value={image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative flex flex-shrink-0 !cursor-move items-center justify-center overflow-hidden rounded-lg first:border-2 first:border-blue-600 sm:h-[80px] sm:w-[80px] md:h-[88px] md:w-[88px]"
                >
                  <motion.img
                    src={
                      !image?.url
                        ? URL.createObjectURL(image as unknown as Blob)
                        : image?.url
                    }
                    alt={image?.filename || "image"}
                    width={80}
                    height={80}
                    className="h-full w-full cursor-move bg-gray-200 object-cover"
                  ></motion.img>
                  <motion.button
                    type="button"
                    className="absolute right-1 top-1 flex h-full w-full flex-col items-end justify-start"
                  >
                    <IoMdClose
                      title="Excluir Arquivo"
                      size={20}
                      onClick={() => handleRemoveImage(index)}
                      className="cursor-pointer rounded-full bg-blue-600 p-1 font-medium text-white duration-100 hover:bg-blue-600 hover:text-blue-200"
                    />
                  </motion.button>
                  {index === 0 && (
                    <section className="absolute bottom-0 left-0 flex h-[26px] w-full items-center justify-center rounded-t-sm bg-blue-600/80">
                      <p className="font-satoshi-medium text-xs text-white">
                        Foto de capa
                      </p>
                    </section>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <div className="flex items-center sm:flex-col sm:gap-2 md:flex-row md:gap-4">
            <input
              ref={input_ref}
              type="file"
              multiple={true}
              accept="image/png , image/jpeg , image/jpg"
              className="invisible absolute inset-0 h-full w-full opacity-0"
              onChange={handleSetFiles}
            />
          </div>
        </div>
      </section>
      <section
        id="productDetails"
        className="flex flex-shrink-0 flex-col gap-2"
      >
        <label className="flex flex-col gap-1">
          <span className="text-typography-main font-satoshi-medium">
            Nome:
          </span>
          <input
            type="text"
            required
            value={product.name || ""}
            placeholder="Nome do produto"
            onChange={(e) =>
              setProduct((product) => ({ ...product, name: e.target.value }))
            }
            className="border-background-gray/20 rounded-lg border px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-typography-main font-satoshi-medium">
            Descrição:
          </span>
          <textarea
            value={product.description}
            rows={4}
            required
            placeholder="Descrição do produto"
            onChange={(e) =>
              setProduct((product) => ({
                ...product,
                description: e.target.value,
              }))
            }
            className="border-background-gray/20 rounded-lg border px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-typography-main font-satoshi-medium">
            Preço:
          </span>
          <input
            type="text"
            required
            value={currencyFormat(product.price)}
            placeholder="Preço do produto"
            onChange={(e) =>
              setProduct((product) => ({
                ...product,
                price: currencyFormat(e.target.value),
              }))
            }
            className="border-background-gray/20 rounded-lg border px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-typography-main font-satoshi-medium">
            Categoria:
          </span>
          <select
            required
            value={product.categoryId || ""}
            onChange={(e) =>
              setProduct((product) => ({
                ...product,
                categoryId: Number(e.target.value),
              }))
            }
            className="border-background-gray/20 rounded-lg border bg-white px-4 py-2 sm:h-[40px]"
          >
            <option value={undefined}>Selecione uma categoria</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 flex gap-2">
          <button
            type="submit"
            disabled={!isLoaded}
            className="font-satoshi-medium flex h-12 w-full items-center justify-center rounded-lg bg-blue-800 px-4 text-white hover:opacity-80 disabled:opacity-80"
          >
            {isLoaded ? (
              "Salvar"
            ) : (
              <Spinner size={32} className="animate-spin" />
            )}
          </button>
          <button
            onClick={close}
            type="button"
            className="text-typography-main font-satoshi-medium w-full rounded-lg bg-gray-200 px-4 py-2 hover:opacity-80"
          >
            Cancelar
          </button>
        </div>
      </section>
    </form>
  )
}
