import {
  Basket,
  Gauge,
  Link,
  SquaresFour,
  Icon,
  UserList,
  ProjectorScreenChart,
  MapPin,
  Article,
} from "@phosphor-icons/react"

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
    title: "Ecommerce",
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
  {
    title: "Portifólio",
    routes: [
      {
        Icon: UserList,
        title: "Informações Pessoais",
        href: "/informacoes-pessoais",
      },
      {
        Icon: MapPin,
        title: "Endereço",
        href: "/endereco",
      },
      {
        Icon: ProjectorScreenChart,
        title: "Projetos",
        href: "/projetos",
      },
      {
        Icon: Link,
        title: "Redes Sociais",
        href: "/redes-sociais",
      },
    ],
  },
  {
    title: "Blog",
    routes: [
      {
        Icon: Article,
        title: "Meus Posts",
        href: "/posts",
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
    ],
  }
] as IOption[]

export default adminOptions
