import React, { useState } from "react"

//next
import Image from "next/image"

//interfaces
import { IProduct } from "@/interfaces/product"

//assets
import imageNotFound from "@/assets/image-not-found-admin.jpg"

//styles
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface ProductImageCarouselProps {
  product: IProduct
  setCurrentImage: React.Dispatch<
    React.SetStateAction<{
      index: number
      url: string
    }>
  >
  currentImage?: {
    index: number
    url: string
  }
}

export default function ProductImageCarousel({
  product,
  setCurrentImage,
  currentImage,
}: ProductImageCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)

  const imagesToDisplay =
    product.images?.slice(startIndex, startIndex + 5) || []

  const handlePreviousClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }

  const handleNextClick = () => {
    if (startIndex + 5 < product.images.length) {
      setStartIndex(startIndex + 1)
    }
  }

  return (
    <div
      className={`relative ${
        product?.images?.length > 5 ? "" : "justify-center"
      } my-2 flex h-fit w-full items-center gap-2 overflow-hidden rounded-xl pl-3`}
    >
      {product?.images?.length > 5 && (
        <button
          onClick={handlePreviousClick}
          disabled={startIndex === 0}
          className="absolute left-0 z-50 flex h-16 w-8 items-center justify-center self-center rounded-l-xl border border-typography-black/20 bg-white bg-opacity-80 p-2 text-typography-black duration-300 hover:bg-typography-primary/80 hover:text-white"
        >
          <CaretLeft size={28} className="flex-shrink-0" />
        </button>
      )}
      {imagesToDisplay.map((image, index) => (
        <button
          key={index}
          onMouseEnter={() =>
            setCurrentImage({ url: image.url, index: startIndex + index })
          }
          onClick={() =>
            setCurrentImage({ url: image.url, index: startIndex + index })
          }
          className={`flex-shrink-0 ${
            image?.url === currentImage?.url &&
            "h-fit rounded-xl opacity-40 shadow-md"
          }`}
        >
          <Image
            src={image.url || imageNotFound}
            alt={product.name || ""}
            width={80}
            height={80}
            className="scrollbar-hide h-16 w-16 flex-shrink-0 rounded-lg object-cover"
          />
        </button>
      ))}
      {product?.images?.length > 5 && (
        <button
          onClick={handleNextClick}
          disabled={startIndex + 5 >= product?.images?.length}
          className="absolute right-0 z-50 flex h-16 w-8 items-center justify-center self-center rounded-r-xl border border-typography-black/20 bg-white bg-opacity-80 p-2 text-typography-black duration-300 hover:bg-typography-primary/80 hover:text-white"
        >
          <CaretRight size={28} className="flex-shrink-0" />
        </button>
      )}
    </div>
  )
}
