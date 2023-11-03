"use server"
//next
import { Metadata } from "next"

//components
import Menu, { TabNavigation } from "@/components/Menu"

//styles
import { Toaster } from "react-hot-toast"

export async function generateMetadata({
  params: { option },
}: {
  params: { option: string }
}): Promise<Metadata> {
  function slugParser(slug: string) {
    const separated = slug.split("-")
    const capitalized = separated.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    const text = capitalized.join(" ")
    return text
  }
  return {
    title: `${slugParser(option)} | Admoon`,
    description: "Admoon - The best way to manage your website",
  }
}

export default async function AdminSideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="font-satoshi-regular relative flex min-h-screen w-fit sm:flex-col sm:bg-white md:flex-row md:bg-[#eee]">
      <Menu />
      <section className="flex flex-col pt-12 sm:px-0 md:w-[calc(100vw-324px)] md:px-12">
        {children}
      </section>
      <TabNavigation />
      <Toaster position="top-right" />
    </main>
  )
}
