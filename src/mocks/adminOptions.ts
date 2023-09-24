
import { Basket, Gauge, Link, SquaresFour, Icon } from "@phosphor-icons/react"

export interface IRoute {
  Icon: Icon
  title: string
  href: string
}

export interface IOption {
  title: string
  routes: IRoute[]
}

const adminOptions = [
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
] as IOption[]

export default adminOptions
