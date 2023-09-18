import React, { useEffect, useState } from "react";

//next
import { useParams, useRouter } from "next/navigation";

//interfaces
import { IProduct, IProductPaginated } from "@/interfaces/product";
import { ICategory } from "@/interfaces/category";

//config
import api_client from "@/config/api_client";

//components
import Modal from "../Modal";
import Alert from "../Alert";
import Button from "../Button";
import Pagination from "../Pagination";
import EmptyState from "../EmptyState";
import ProductList from "../ProductList";
import ProductForm from "../ProductForm";

//styles
import { toast } from "react-hot-toast";
import { MagnifyingGlass, Rows, SquaresFour } from "@phosphor-icons/react";

//hooks
import { useDebounce } from "@/hooks/useDebounce";

export default function Products() {
  const { category } = useParams();
  const { push } = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ICategory>({
    id: Number(category),
  } as ICategory);
  const [products, setProducts] = useState<IProductPaginated>(
    {} as unknown as IProductPaginated
  );

  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const debouncedSearch = useDebounce(productName);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, debouncedSearch]);

  async function getCategories() {
    setIsLoaded(false);
    return await api_client
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoaded(true));
  }

  async function getProducts(page = 1) {
    const nameQuery = debouncedSearch ? `&q=${debouncedSearch}` : "";

    const endpoint = currentCategory?.id
      ? `/products/category/${currentCategory?.id}?page=${page}${nameQuery}`
      : `/products?page=${page}${nameQuery}`;

    return await api_client
      .get(endpoint)
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error(error));
  }

  function openEditModal(product: IProduct) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function openDeleteAlert(product: IProduct) {
    setSelectedProduct(product);
    setIsAlertOpen(true);
  }

  function deleteProduct() {
    if (!selectedProduct) return;
    api_client
      .delete(`/products/${selectedProduct.id}`)
      .then(({ data }) => {
        setProducts(data);
        toast.success("Produto excluído com sucesso");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erro ao excluir produto");
      })
      .finally(() => getAll());
  }

  function close() {
    setIsAlertOpen(false);
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  }

  async function getAll() {
    setSelectedProduct(undefined);
    await getProducts();
    await getCategories();
  }

  return (
    <>
      <main className="flex flex-col h-full gap-6 w-full">
        <h1 className="text-3xl font-satoshi-medium">Produtos</h1>
        <div className="flex flex-col h-[85vh] text-typography-main relative overflow-hidden max-w-full bg-white shadow-lg rounded-xl pb-2">
          <header className="h-[68px] bg-white w-full flex items-center justify-between p-4">
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
          <section className="overflow-y-auto h-full w-full scrollbar-hide">
            <nav className="font-satoshi-medium flex flex-col sticky top-0 z-20 bg-white shadow-sm">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() =>
                    setCurrentCategory(undefined as unknown as ICategory)
                  }
                  className={`border-b-4 whitespace-nowrap ${!currentCategory?.id
                    ? "text-blue-800 border-blue-800"
                    : "border-gray-100"
                    } hover:bg-[#eee]/60 duration-300 rounded-t-lg w-fit px-6 py-3`}
                >
                  Todos
                </button>
                {categories?.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCategory(category)}
                    className={`border-b-4 whitespace-nowrap ${category.id === currentCategory?.id
                      ? "text-blue-800 border-blue-800"
                      : "border-gray-100"
                      } hover:bg-[#eee]/60 duration-300 rounded-t-lg w-fit px-6 py-3`}
                  >
                    {category.name} ({category.quantityProducts})
                  </button>
                ))}
                <span className="border-b-4 w-full border-gray-100" />
              </div>
              <header className="flex w-full p-3 gap-3">
                <Pagination
                  nextPage={getProducts}
                  previousPage={getProducts}
                  totalPages={products.totalPages}
                  currentPage={products.currentPage}
                />
                <div className="flex w-full gap-2 items-center px-4 py-2 bg-gray-100 rounded-xl overflow-hidden">
                  <MagnifyingGlass size={20} color="black" />
                  <input
                    className="bg-gray-100 focus:outline-none w-full"
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Pesquisar produto..."
                    value={productName}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsGrid(true)}
                    className={`${isGrid
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white hover:bg-gray-100"
                      } border-2 duration-200 flex-shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded-lg font-satoshi-medium`}
                  >
                    <SquaresFour size={20} />
                  </button>
                  <button
                    onClick={() => setIsGrid(false)}
                    className={`${!isGrid
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white hover:bg-gray-100"
                      } border-2 duration-200 flex-shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded-lg font-satoshi-medium`}
                  >
                    <Rows size={20} />
                  </button>
                </div>
              </header>
            </nav>
            {products?.results?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[80%] w-full">
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
        className="w-fit !max-h-fit"
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
  );
}
