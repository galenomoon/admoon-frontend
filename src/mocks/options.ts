import { Basket, Gauge, Link, SquaresFour } from "@phosphor-icons/react"

const options = [
  {
    title: "E-COMMERCE",
    routes: [
      {
        Icon: Basket,
        title: "Meus Produtos",
        href: "/produtos",
      },
      {
        Icon: SquaresFour,
        title: "Categorias",
        href: "/categorias",
      },
      {
        Icon: Link,
        title: "Redes Sociais",
        href: "/redes-sociais",
      },
      {
        Icon: Gauge,
        title: "Estatísticas",
        href: "/estatisticas",
      },
    ],
  },
]

export default options
