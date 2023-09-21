import React from "react"

interface AlertProps {
  onConfirm: () => void
  close: () => void
  message: string
  warning?: string
  title: string
  isOpen: boolean
}

export default function Alert({
  onConfirm,
  close,
  message,
  warning,
  isOpen,
  title,
}: AlertProps) {
  return !isOpen ? null : (
    <div className="animate-fade-in max-w-screen fixed left-0 top-0 z-[901] flex h-screen max-h-screen w-screen items-center justify-center overflow-hidden bg-black bg-opacity-20 backdrop-blur-md transition-all ease-out">
      <div className="animate-slide-in flex md:max-w-[30vw] flex-col items-center gap-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <h1 className="font-satoshi-medium text-center text-xl">{title}</h1>
          <p className="font-satoshi-regular mt-3 text-center text-lg opacity-80">
            {message}
          </p>
          {!warning ? null : (
            <p className="text-md font-satoshi-regular text-center text-red-600 opacity-80">
              {warning}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="font-satoshi-medium w-[128px] rounded-lg bg-red-600 py-2 text-white duration-200 hover:opacity-80"
          >
            Confirmar
          </button>
          <button
            onClick={close}
            className="font-satoshi-medium w-[128px] rounded-lg bg-gray-200 py-2 duration-200 hover:opacity-80"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
