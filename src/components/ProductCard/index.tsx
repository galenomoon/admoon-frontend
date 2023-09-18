import React from "react";
import Image from "next/image";

//interfaces
import { IProduct } from "@/interfaces/product";

//styles
import { NotePencil, Trash } from "@phosphor-icons/react";

//assets
import imageNotFound from "@/assets/image-not-found-admin.jpg";

interface ProductCardProps {
  product: IProduct;
  openEditModal: (product: IProduct) => void;
  isGrid: boolean;
  openDeleteAlert: (product: IProduct) => void;
}

export default function ProductCard({
  product,
  openEditModal,
  openDeleteAlert,
  isGrid,
}: ProductCardProps) {
  return (
    <div
      className={`flex relative gap-3 ${
        isGrid
          ? "flex-col sm:w-full md:w-[305px] h-[400px]"
          : "flex-row w-full h-fit"
      } p-4 rounded-2xl bg-gray-100`}
    >
      <p
        className={`absolute opacity-40 ${
          isGrid ? "bottom-3 left-4" : "bottom-3 right-3"
        } z-10 flex gap-1 text-sm items-center justify-center`}
      >
        <span className="font-semibold">ID:</span> {product.id}
      </p>
      <section
        className={`absolute right-3 ${
          isGrid ? "bottom-3" : "top-3"
        } z-10 flex gap-2 items-center justify-center`}
      >
        <button
          onClick={() => openEditModal(product)}
          className="text-blue-800 bg-blue-400/20 border-2 border-blue-800/20 hover:opacity-60 duration-200 rounded-lg h-[32px] w-[32px] flex-shrink-0 flex items-center justify-center"
        >
          <NotePencil size={22} weight="fill" />
        </button>
        <button
          onClick={() => openDeleteAlert(product)}
          className="text-red-800 bg-red-400/20 border-2 border-red-800/20 hover:opacity-60 duration-200 rounded-lg h-[32px] w-[32px] flex-shrink-0 flex items-center justify-center"
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
          isGrid ? "w-full h-[220px]" : "w-[124px] h-[124px]"
        } flex-shrink-0 rounded-xl object-cover`}
      />
      <footer className="flex flex-col w-full">
        <h1 className="font-semibold text-lg truncate ">{product.name}</h1>
        <p className="font-satoshi-regular opacity-60 text-sm line-clamp-1">
          {product.description.trim() || "Sem descrição"}
        </p>
        <section className="flex items-center justify-between gap-6 mt-2">
          <h1 className="md:text-xl sm:text-3xl font-satoshi-black">
            R${Number(product.price).toFixed(2).replace(".", ",")}
          </h1>
        </section>
      </footer>
    </div>
  );
}
