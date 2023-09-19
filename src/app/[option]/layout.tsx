
//next
import { Metadata } from "next";

//components
import Menu, { TabNavigation } from "@/components/Menu";

//styles
import { Toaster } from "react-hot-toast";

export async function generateMetadata({ params: { option } }: { params: { option: string } }): Promise<Metadata> {
  function slugParser(slug: string) {
    const separated = slug.split("-");
    const capitalized = separated.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const text = capitalized.join(" ");
    return text;
  }
  return {
    title: `${slugParser(option)} | Admoon`,
    description: "Admoon - The best way to manage your website",
  };
}


export default function AdminSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="relative flex md:flex-row sm:flex-col min-h-screen w-fit font-satoshi-regular sm:bg-white md:bg-[#eee]">
      <Menu />
      <section className="flex flex-col sm:px-0 md:px-12 pt-12 md:w-[calc(100vw-324px)]">
        {children}
      </section>
      <TabNavigation />
      <Toaster position="top-right" />
    </main>
  );
}
