import { X } from "@phosphor-icons/react";
import React from "react";

interface ModalProps {
  close: () => void;
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  className?: string;
}

export default function Modal({
  close,
  children,
  isOpen,
  title,
  className,
}: ModalProps) {
  return !isOpen ? null : (
    <div className="animate-fade-in w-screen fixed left-0 top-0 z-[901] backdrop-blur-md h-screen overflow-hidden max-w-screen max-h-screen flex items-center justify-center bg-black bg-opacity-20 transition-all ease-out">
      <div className={`bg-white w-[500px] h-fit max-h-[580px] animate-slide-in rounded-xl shadow-lg items-center flex flex-col gap-8 p-8 ${className}`}>
        <header className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-satoshi-medium">{title}</h1>
          <button onClick={close} className="bg-gray-200 rounded-lg p-1">
            <X size={28} weight="bold" className="opacity-80" />
          </button>
        </header>
        <section className="flex flex-col w-full">{children}</section>
      </div>
    </div>
  );
}
