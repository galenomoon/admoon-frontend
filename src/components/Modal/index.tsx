import { X } from "@phosphor-icons/react"
import React from "react"

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
  return !isOpen ? null : (
    <div className="animate-fade-in max-w-screen fixed left-0 top-0 z-[901] flex h-screen max-h-screen w-screen items-center justify-center overflow-hidden bg-black bg-opacity-20 backdrop-blur-md transition-all ease-out">
      <div
        className={`animate-slide-in flex h-fit max-h-[580px] w-[500px] flex-col items-center gap-8 overflow-y-auto rounded-xl bg-white p-8 shadow-lg sm:h-[100dvh] sm:max-h-[100dvh] sm:w-[100dvw] sm:max-w-[100dvw] sm:self-start md:h-fit md:max-h-fit md:w-fit md:min-w-[500px] md:self-center ${className}`}
      >
        <header className="flex w-full items-center justify-between">
          <h1 className="font-satoshi-medium text-2xl">{title}</h1>
          <button onClick={close} className="rounded-lg bg-gray-200 p-1">
            <X size={28} weight="bold" className="opacity-80" />
          </button>
        </header>
        <section className="flex w-full flex-col">{children}</section>
      </div>
    </div>
  )
}
