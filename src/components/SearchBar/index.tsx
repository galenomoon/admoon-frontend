import React from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export default function SearchBar({ className, ...props }: ISearchBarProps) {
  return (
    <div className={`flex w-full items-center gap-2 overflow-hidden rounded-xl bg-gray-100 px-4 py-2 ${className}`}>
      <MagnifyingGlass size={20} color="black" />
      <input
        {...props}
        className="w-full bg-gray-100 focus:outline-none"
        placeholder={props?.placeholder || "Pesquisar produto..."}
      />
    </div>
  )
}
