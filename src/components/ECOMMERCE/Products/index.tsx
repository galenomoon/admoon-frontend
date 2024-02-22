import React, { useContext, useEffect, useState } from "react"

//next
import { useParams, useRouter } from "next/navigation"

//interfaces
import { IProduct, IProductPaginated } from "@/interfaces/product"
import { ICategory } from "@/interfaces/category"

//config
import api_client from "@/config/api_client"

//components
import Modal from "../../Modal"
import Alert from "../../Alert"
import Button from "../../Button"
import SearchBar from "../../SearchBar"
import Pagination from "../../Pagination"
import EmptyState from "../../EmptyState"
import ProductList from "../../ProductList"
import ProductForm from "../../ProductForm"

//styles
import { toast } from "react-hot-toast"
import { Plus, Rows, SquaresFour } from "@phosphor-icons/react"

//hooks
import { useDebounce } from "@/hooks/useDebounce"

//contexts
import { WebsiteContext } from "@/contexts/websiteContext"

export default function Products() {
  const { currentWebsite } = useContext(WebsiteContext)
  const { category } = useParams()
  const { push } = useRouter()

  const [categories, setCategories] = useState<ICategory[]>([])
  const [currentCategory, setCurrentCategory] = useState<ICategory>({
    id: Number(category),
  } as ICategory)
  const [products, setProducts] = useState<IProductPaginated>(
    {} as unknown as IProductPaginated,
  )

  const [selectedProduct, setSelectedProduct] = useState<IProduct>()
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [productName, setProductName] = useState<string>("")
  const [isGrid, setIsGrid] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const debouncedSearch = useDebounce(productName)

  useEffect(() => {
    getCategories()
  }, [currentWebsite])

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, debouncedSearch, currentWebsite])

  async function getCategories() {
    if (!currentWebsite?.id) return
    setIsLoaded(false)
    return await api_client
      .get(`websites/${currentWebsite?.id}/categories`)
      .then(({ data }) => setCategories(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  async function getProducts(page = 1) {
    if (!currentWebsite?.id) return
    const nameQuery = debouncedSearch ? `&q=${debouncedSearch}` : ""

    const endpoint = currentCategory?.id
      ? `/products/category/${currentCategory?.id}?page=${page}${nameQuery}`
      : `/products?page=${page}${nameQuery}`
    setIsLoaded(false)
    return await api_client
      .get(`websites/${currentWebsite?.id}` + endpoint)
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true))
  }

  function openEditModal(product: IProduct) {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  function openDeleteAlert(product: IProduct) {
    setSelectedProduct(product)
    setIsAlertOpen(true)
  }

  function deleteProduct() {
    if (!selectedProduct) return
    api_client
      .delete(`websites/${currentWebsite.id}/products/${selectedProduct.id}`)
      .then(({ data }) => {
        setProducts(data)
        toast.success("Produto excluído com sucesso")
      })
      .catch((error) => {
        console.error(error)
        toast.error("Erro ao excluir produto")
      })
      .finally(() => getAll())
  }

  function close() {
    setIsAlertOpen(false)
    setIsModalOpen(false)
    setSelectedProduct(undefined)
  }

  async function getAll() {
    setSelectedProduct(undefined)
    await getProducts()
    await getCategories()
  }

  return (
    <>
      <main className="relative flex h-full w-full flex-col gap-6">
        <h1 className="font-satoshi-medium text-3xl sm:hidden md:block">
          Produtos
        </h1>
        <Button
          className="absolute bottom-[140px] right-7 z-[99] !h-[64px] !w-[64px] flex-shrink-0 !rounded-full md:hidden"
          disabled={!categories.length}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={32} color="#FFF" className="flex-shrink-0" />
        </Button>
        <div className="text-typography-main relative flex h-[85vh] flex-col overflow-hidden rounded-xl bg-white pb-2 shadow-lg sm:max-w-[100dvw] md:max-w-full">
          <header className="h-[68px] w-full  items-center justify-between bg-white p-4 sm:hidden md:flex">
            <p className="text-typography-main font-satoshi-semibold text-xl">
              Gerenciar Produtos
            </p>
            <br />
            <Button
              disabled={!categories.length}
              onClick={() => setIsModalOpen(true)}
            >
              Cadastrar Produto
            </Button>
          </header>
          <div className="m-2 sm:flex md:hidden">
            <SearchBar
              className=" w-full self-center"
              value={productName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setProductName(e.target.value)
              }
            />
          </div>
          <section className="scrollbar-hide h-full w-full overflow-y-auto">
            <nav className="font-satoshi-medium sticky top-0 z-20 flex flex-col shadow-sm sm:pb-0 md:pb-0">
              <div className="scrollbar-hide flex overflow-x-auto bg-white">
                <button
                  onClick={() =>
                    setCurrentCategory(undefined as unknown as ICategory)
                  }
                  className={`whitespace-nowrap border-b-4 ${
                    !currentCategory?.id
                      ? "border-blue-800 text-blue-800"
                      : "border-gray-100"
                  } w-fit rounded-t-lg px-6 py-3 duration-300 hover:bg-[#eee]/60`}
                >
                  Todos
                </button>
                {categories?.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCategory(category)}
                    className={`whitespace-nowrap border-b-4 ${
                      category.id === currentCategory?.id
                        ? "border-blue-800 text-blue-800"
                        : "border-gray-100"
                    } w-fit rounded-t-lg px-6 py-3 duration-300 hover:bg-[#eee]/60`}
                  >
                    {category.name} ({category.quantityProducts})
                  </button>
                ))}
                <span className="w-full border-b-4 border-gray-100" />
              </div>
              <header className="flex w-full justify-between gap-3 bg-white/60 p-3 backdrop-blur-md">
                <Pagination
                  nextPage={getProducts}
                  previousPage={getProducts}
                  totalPages={products.totalPages}
                  currentPage={products.currentPage}
                />
                <SearchBar
                  className="sm:hidden md:flex"
                  value={productName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProductName(e.target.value)
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsGrid(true)}
                    className={`${
                      isGrid
                        ? "border-blue-800 bg-blue-800 text-white"
                        : "bg-white hover:bg-gray-100"
                    } font-satoshi-medium flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-lg border-2 duration-200`}
                  >
                    <SquaresFour size={20} />
                  </button>
                  <button
                    onClick={() => setIsGrid(false)}
                    className={`${
                      !isGrid
                        ? "border-blue-800 bg-blue-800 text-white"
                        : "bg-white hover:bg-gray-100"
                    } font-satoshi-medium flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-lg border-2 duration-200`}
                  >
                    <Rows size={20} />
                  </button>
                </div>
              </header>
            </nav>
            {products?.results?.length === 0 ? (
              <div className="flex h-[80%] w-full flex-col items-center justify-center">
                <EmptyState
                  onClick={() =>
                    categories.length
                      ? setIsModalOpen(true)
                      : push("/categorias?cadastrar=true")
                  }
                  buttonLabel={
                    categories.length
                      ? "Criar novo produto"
                      : "Criar nova categoria"
                  }
                  title={
                    categories.length
                      ? "Nenhum produto encontrado"
                      : "Nenhuma categoria encontrada\n para criar um produto"
                  }
                  description={
                    categories.length
                      ? "Tente novamente com outros termos de busca, ou tente em outra categoria"
                      : "Você precisa criar pelo menos uma categoria para poder criar um produto"
                  }
                />
              </div>
            ) : (
              <ProductList
                isGrid={isGrid}
                products={products.results}
                isLoaded={isLoaded}
                openEditModal={openEditModal}
                openDeleteAlert={openDeleteAlert}
              />
            )}
          </section>
        </div>
      </main>
      <Alert
        onConfirm={() => deleteProduct()}
        isOpen={!!selectedProduct && isAlertOpen}
        close={() => close()}
        title={`Excluir produto "${selectedProduct?.name}"`}
        message="Tem certeza que deseja excluir este produto?"
        warning="Esta ação não poderá ser desfeita."
      />
      <Modal
        isOpen={isModalOpen}
        close={() => close()}
        className="md:w-[600px]"
        title={selectedProduct?.id ? "Editar produto" : "Adicionar produto"}
      >
        <ProductForm
          categories={categories}
          getAll={getAll}
          close={() => close()}
          product={
            {
              ...selectedProduct,
              categoryId: selectedProduct?.categoryId || currentCategory?.id,
            } as IProduct
          }
        />
      </Modal>
    </>
  )
}
