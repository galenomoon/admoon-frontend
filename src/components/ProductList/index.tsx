import React from "react";

//interfaces
import { IProduct } from "@/interfaces/product";

//components
import ProductCard from "../ProductCard";

//styles
import { Spinner } from "@phosphor-icons/react";

interface ProductListProps {
  products: IProduct[];
  isGrid: boolean;
  isLoaded: boolean;
  openEditModal: (product: IProduct) => void;
  openDeleteAlert: (product: IProduct) => void;
}

export default function ProductList({
  products,
  isGrid,
  isLoaded,
  openEditModal,
  openDeleteAlert
}: ProductListProps) {
  if (!isLoaded)
    return (
      <div className="flex flex-col items-center justify-center h-[80%] w-full">
        <Spinner className="animate-spin" size={50} />
      </div>
    );

  return (
    <section className={`${isGrid ? "sm:grid sm:grid-cols-2 md:flex md:flex-wrap" : "flex flex-col"} sm:gap-1 md:gap-4 sm:p-2 md:p-4`}>
      {products?.map((product) => (
        <React.Fragment key={product.id}>
          <ProductCard
            product={product}
            openEditModal={openEditModal}
            openDeleteAlert={openDeleteAlert}
            isGrid={isGrid}
          />
        </React.Fragment>
      ))}
    </section>
  );
}
