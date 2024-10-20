import React from "react"

//styles
import { X } from "@phosphor-icons/react"

//animations
import { motion } from "framer-motion"
import { fade } from "@/animations/fade"
import { slide } from "@/animations/slide"

interface ModalProps {
  close: () => void
  children: React.ReactNode
  title: string
  isOpen: boolean
  className?: string
}

export default function Modal({
  close,
  children,
  isOpen,
  title,
  className,
}: ModalProps) {
  return (
    <motion.div
      animate={fade(isOpen)}
      initial={{ display: "none" }}
      className="max-w-screen fixed left-0 top-0 z-[901] flex h-screen max-h-screen w-screen items-center justify-center overflow-hidden bg-black bg-opacity-20 backdrop-blur-md"
    >
      <motion.nav
        animate={slide(isOpen)}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-[500px] flex-col items-center gap-8 overflow-y-auto bg-white p-8 shadow-lg transition-all duration-300 ease-out sm:h-[100dvh] sm:max-h-[100dvh] sm:w-[100dvw] sm:self-start sm:rounded-none md:h-fit md:max-h-[99vh] md:w-fit md:min-w-[500px] md:self-center md:rounded-xl ${
          className ? className : ""
        }`}
      >
        <header className="flex w-full items-center justify-between">
          <h1 className="font-satoshi-medium text-2xl">{title}</h1>
          <button onClick={close} className="rounded-lg bg-gray-200 p-1">
            <X size={28} weight="bold" className="opacity-80" />
          </button>
        </header>
        <section className="flex w-full flex-col">{children}</section>
      </motion.nav>
    </motion.div>
  )
}
