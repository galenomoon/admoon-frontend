import React from 'react'

interface AlertProps {
  onConfirm: () => void,
  close: () => void,
  message: string,
  warning?: string,
  title: string,
  isOpen: boolean,
}

export default function Alert({ onConfirm, close, message, warning, isOpen, title }: AlertProps) {
  return !isOpen ? null :
    <div className='animate-fade-in w-screen fixed left-0 top-0 z-[901] backdrop-blur-md h-screen overflow-hidden max-w-screen max-h-screen flex items-center justify-center bg-black bg-opacity-20 transition-all ease-out'>
      <div className='bg-white max-w-[30vw] animate-slide-in rounded-xl shadow-lg items-center flex flex-col gap-8 p-8'>
        <div className='flex flex-col items-center'>
          <h1 className='text-xl font-satoshi-medium text-center'>
            {title}
          </h1>
          <p className='text-lg mt-3 font-satoshi-regular text-center opacity-80'>
            {message}
          </p>
          {!warning ? null :
            <p className='text-md text-red-600 font-satoshi-regular text-center opacity-80'>
              {warning}
            </p>
          }
        </div>
        <div className='flex gap-4'>
          <button
            onClick={onConfirm}
            className='bg-red-600 hover:opacity-80 duration-200 text-white w-[128px] py-2 rounded-lg font-satoshi-medium'
          >
            Confirmar
          </button>
          <button
            onClick={close}
            className='bg-gray-200 hover:opacity-80 duration-200 w-[128px] py-2 rounded-lg font-satoshi-medium'
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
}
