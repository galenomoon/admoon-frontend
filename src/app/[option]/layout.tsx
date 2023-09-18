//components
import Menu from "@/components/Menu";

//styles
import { Toaster } from "react-hot-toast";

export default function AdminSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="relative flex min-h-screen w-fit font-satoshi-regular sm:bg-white md:bg-[#eee]">
      <Menu />
      <section className="flex flex-col px-12 pt-12 w-[calc(100vw-324px)]">
        {children}
      </section>
      <Toaster position="top-right" />
    </main>
  );
}
