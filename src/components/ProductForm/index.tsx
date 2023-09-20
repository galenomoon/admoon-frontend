import React, { useRef } from "react";

//next
import Image from "next/image";

//interfaces
import { IImage } from "@/interfaces/image";
import { IProduct } from "@/interfaces/product";
import { ICategory } from "@/interfaces/category";

//config
import api_client from "@/config/api_client";

//styles
import { toast } from "react-hot-toast";
import { HiPlusSm } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Spinner } from "@phosphor-icons/react";

interface ProductFormProps {
  product: IProduct;
  close: () => void;
  getAll: () => void;
  categories: ICategory[];
}

export default function ProductForm({
  categories,
  product: productByProp,
  close,
  getAll,
}: ProductFormProps) {
  const input_ref = useRef<HTMLInputElement>(null);
  const [imagesToDelete, setImagesToDelete] = React.useState<IImage["id"][]>(
    []
  );
  const [images, setImages] = React.useState<IImage[]>(
    productByProp.images || []
  );
  const [product, setProduct] = React.useState<IProduct>({
    ...productByProp,
  });
  const [isLoaded, setIsLoaded] = React.useState<boolean>(true);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoaded(false);
    try {
      await submitProduct();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoaded(true);
    }
  }

  async function submitProduct() {
    const endpoint = product.id ? `/products/${product.id}` : "/products";
    const method = product.id ? "put" : "post";
    const payload = {
      ...product,
      price: Number(String(product.price).replace(/\D/g, "")) / 100,
    };

    if (!payload.name) {
      return toast.error("Preencha o nome do produto");
    }
    if (!payload.description) {
      return toast.error("Preencha a descrição do produto");
    }
    if (!payload.price) {
      return toast.error("Preencha o preço do produto");
    }
    if (!payload.categoryId) {
      return toast.error("Selecione uma categoria");
    }
    if (!images.length) {
      return toast.error("Adicione pelo menos uma imagem ao produto");
    }

    return await api_client[method](endpoint, payload)
      .then(async ({ data }) => {
        try {
          await handleImages(data as IProduct);
        } catch (error) {
          console.error(error);
          toast.error("Erro ao salvar imagens");
        } finally {
          getAll();
          toast.success("Produto salvo com sucesso!");
          close();
        }
      })
      .catch(console.error);
  }

  async function handleImages(product: IProduct) {
    const hasNewImages = images?.some((image) => !image.id);
    if (!hasNewImages) return await deleteImages();
    await uploadImages(product);
  }

  async function uploadImages(product: IProduct) {
    const requests = images.map(async (image) => {
      if (image.id) return;
      const formData = new FormData();
      formData.append("image", image as unknown as File);
      await api_client.post(`/images/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
    return await Promise.all(requests).catch(console.error);
  }

  async function deleteImages() {
    if (imagesToDelete.length) {
      const deleteRequests = imagesToDelete.map(async (id) => {
        return await api_client.delete(`/images/${id}`);
      });
      return await Promise.all(deleteRequests).catch(console.error);
    }
  }

  function currencyFormat(value?: string | number) {
    const isNumber = typeof value === "number";
    const number = Number(`${isNumber ? value * 100 : value}`?.replace(/\D/g, ""));
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(number / 100);
  }

  function handleRemoveImage(index: number) {
    if (product.id && images[index]?.id) {
      setImagesToDelete([...imagesToDelete, images[index].id]);
    }
    return setImages(images.filter((_, i) => i !== index));
  }

  function handleSetFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e?.target?.files as unknown as IImage[];
    setImages([...images, ...image] as unknown as IImage[]);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:w-full h-fit overflow-auto md:w-full pb-3">
      <section
        id="images"
        className="flex flex-col gap-4 overflow-hidden w-full border-y-[1.6px] border-typography-black/10 pb-4 pt-6"
      >
        <aside className="flex gap-3 items-center w-full justify-between">
          <article className="flex flex-col text-start justify-center">
            <p className="font-semibold text-2xl">Anexar imagens</p>
            <p className="text-typography-light dark:text-dark-typography-light">
              Adicione imagens ao produto
            </p>
          </article>
          <button
            type="button"
            onClick={() => input_ref?.current?.click()}
            className="flex bg-blue-600/40 items-center w-12 h-12 hover:opacity-80 duration-150 justify-center p-2 rounded-xl"
          >
            <HiPlusSm size={32} className="text-blue-600 cursor-pointer" />
          </button>
        </aside>
        <div className="flex flex-col">
          <div className="overflow-x-auto flex">
            <div className="flex gap-2 w-fit">
              {images?.map((image, index) => (
                <div
                  key={index}
                  className="duration-200 relative cursor-pointer md:w-[88px] group md:h-[88px] sm:w-[80px] sm:h-[80px] rounded-2xl"
                >
                  <Image
                    src={
                      !image?.url
                        ? URL.createObjectURL(image as unknown as Blob)
                        : image?.url
                    }
                    alt={product?.name || ""}
                    width={80}
                    height={80}
                    className="md:w-[80px] md:h-[80px] sm:w-[80px] sm:h-[80px] object-cover rounded-2xl"
                  />
                  <div className="flex absolute -top-0 right-0 flex-col items-end justify-start w-full h-full">
                    <IoMdClose
                      title="Excluir Arquivo"
                      size={24}
                      onClick={() => handleRemoveImage(index)}
                      className="text-blue-600 bg-blue-200 hover:bg-blue-600 font-medium hover:text-blue-200 rounded-full p-1 duration-100 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex md:flex-row sm:flex-col items-center sm:gap-2 md:gap-4">
            <input
              ref={input_ref}
              type="file"
              multiple={true}
              accept="image/png , image/jpeg , image/jpg"
              className="absolute inset-0 w-full h-full opacity-0 invisible"
              onChange={handleSetFiles}
            />
          </div>
        </div>
      </section>
      <section
        id="productDetails"
        className="flex flex-col gap-2 flex-shrink-0"
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
            className="border border-background-gray/20 rounded-lg px-4 py-2"
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
            className="border border-background-gray/20 rounded-lg px-4 py-2"
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
            className="border border-background-gray/20 rounded-lg px-4 py-2"
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
            className="border border-background-gray/20 bg-white rounded-lg px-4 sm:h-[40px] py-2"
          >
            <option value={undefined}>Selecione uma categoria</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex mt-6 gap-2">
          <button
            type="submit"
            disabled={!isLoaded}
            className="bg-blue-800 disabled:opacity-80 flex items-center justify-center hover:opacity-80 text-white w-full px-4 h-12 rounded-lg font-satoshi-medium"
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
            className="bg-gray-200 hover:opacity-80 w-full text-typography-main px-4 py-2 rounded-lg font-satoshi-medium"
          >
            Cancelar
          </button>
        </div>
      </section>
    </form>
  );
}
