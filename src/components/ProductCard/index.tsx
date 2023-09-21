import React from "react"
import Image from "next/image"

//interfaces
import { IProduct } from "@/interfaces/product"

//styles
import { NotePencil, Trash } from "@phosphor-icons/react"

//assets
import imageNotFound from "@/assets/image-not-found-admin.jpg"

interface ProductCardProps {
  product: IProduct
  openEditModal: (product: IProduct) => void
  isGrid: boolean
  openDeleteAlert: (product: IProduct) => void
}

export default function ProductCard({
  product,
  openEditModal,
  openDeleteAlert,
  isGrid,
}: ProductCardProps) {
  return (
    <div
      className={`relative flex gap-3 ${
        isGrid
          ? "flex-col sm:h-[260px] sm:w-full md:h-[390px] md:w-[235px] md:p-2"
          : "h-fit w-full flex-row"
      } bg-gray-100 sm:rounded-sm sm:p-1 md:rounded-lg`}
    >
      <p
        className={`absolute opacity-40 ${
          isGrid ? "bottom-3 sm:left-1 md:left-2" : "bottom-3 right-3"
        } z-10 flex items-center justify-center gap-1 text-xs`}
      >
        <span className="font-semibold">ID:</span> {product.id}
      </p>
      <section
        className={`absolute right-3 ${
          isGrid ? "bottom-3" : "top-3"
        } z-10 flex items-center justify-center gap-2`}
      >
        <button
          onClick={() => openEditModal(product)}
          className="flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-lg border-2 border-blue-800/20 bg-blue-400/20 text-blue-800 duration-200 hover:opacity-60"
        >
          <NotePencil size={22} weight="fill" />
        </button>
        <button
          onClick={() => openDeleteAlert(product)}
          className="flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-lg border-2 border-red-800/20 bg-red-400/20 text-red-800 duration-200 hover:opacity-60"
        >
          <Trash size={22} weight="duotone" />
        </button>
      </section>
      <Image
        src={product.images?.[0]?.url || imageNotFound}
        alt={product.name}
        width={isGrid ? 305 : 124}
        height={isGrid ? 220 : 124}
        className={`${
          isGrid ? "w-full sm:h-[128px] md:h-[220px]" : "h-[124px] w-[124px]"
        } flex-shrink-0 object-cover sm:rounded-sm md:rounded-lg`}
      />
      <footer className={`flex ${isGrid ? "md:w-full" : "md:w-[80%] sm:w-[40%]"} flex-col`}>
        <h1 className="sm:line-clamp-1 md:line-clamp-2 font-semibold sm:text-sm md:text-lg">
          {product.name}
        </h1>
        <p className="font-satoshi-regular line-clamp-1 opacity-60 sm:text-xs md:text-sm">
          {product.description.trim() || "Sem descrição"}
        </p>
        <section className="mt-2 flex items-center justify-between gap-6">
          <h1 className="font-satoshi-black sm:text-lg md:text-xl">
            R${Number(product.price).toFixed(2).replace(".", ",")}
          </h1>
        </section>
      </footer>
    </div>
  )
}
