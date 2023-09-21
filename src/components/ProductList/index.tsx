import React from "react"

//interfaces
import { IProduct } from "@/interfaces/product"

//components
import { ProductSkeleton } from "../Skeleton"
import ProductCard from "../ProductCard"

interface ProductListProps {
  products: IProduct[]
  isGrid: boolean
  isLoaded: boolean
  openEditModal: (product: IProduct) => void
  openDeleteAlert: (product: IProduct) => void
}

export default function ProductList({
  products,
  isGrid,
  isLoaded,
  openEditModal,
  openDeleteAlert,
}: ProductListProps) {

  return (
    <section
      className={`${
        isGrid ? "sm:grid sm:grid-cols-2 md:flex md:flex-wrap" : "flex flex-col"
      } gap-1 sm:p-2 md:p-4`}
    >
      {!isLoaded ? (
        <ProductSkeleton isGrid={isGrid} length={20} />
      ) : (
        products?.map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard
              product={product}
              openEditModal={openEditModal}
              openDeleteAlert={openDeleteAlert}
              isGrid={isGrid}
            />
          </React.Fragment>
        ))
      )}
    </section>
  )
}
