import {
  UsersThree,
  Browsers,
  CurrencyCircleDollar,
} from "@phosphor-icons/react"

const superUserOptions = [
  {
    title: "GERENCIAMENTO",
    routes: [
      {
        Icon: UsersThree,
        title: "Clientes",
        href: "/clientes",
      },
      {
        Icon: Browsers,
        title: "Websites",
        href: "/websites",
      },
    ],
  },
  {
    title: "FINANCEIRO",
    routes: [
      {
        Icon: CurrencyCircleDollar,
        title: "Orçamentos",
        href: "/orcamentos",
      },
    ],
  }
]

export default superUserOptions
