import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  className,
  type,
  disabled
}: ButtonProps) {

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-800 flex items-center justify-center min-h-[44px] h-fit disabled:opacity-40 hover:opacity-80 duration-300 text-white font-satoshi-medium rounded-lg px-8 py-2 mt-4 ${className}`}
    >
      {children}
    </button>
  )
}
