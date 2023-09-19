import React from "react";

//styles
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  nextPage: (page: number) => void;
  previousPage: (page: number) => void;
}

export default function Pagination({
  totalPages = 1,
  currentPage = 1,
  nextPage,
  previousPage,
}: IPaginationProps) {
  return (
    <section className="flex items-center justify-center rounded-full p-2 gap-1 bg-gray-200 sm:w-[170px] md:!w-[220px]">
      <p className="whitespace-nowrap w-[70px] gap-1 flex items-center justify-center">
        <span className="font-satoshi-bold">
          {currentPage < 10 ? `0${currentPage}` : currentPage}
        </span>
        <span className="font-satoshi-light"> de </span>
        <span className="font-satoshi-medium opacity-80">
          {totalPages < 10 ? `0${totalPages || 1}` : totalPages}
        </span>
      </p>
      <aside className="flex gap-2">
        <button
          onClick={() => previousPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:opacity-20 rounded-full w-6 h-6 flex items-center justify-center duration-200 hover:bg-gray-300"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <button
          onClick={() => nextPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="disabled:opacity-20 rounded-full w-6 h-6 flex items-center justify-center duration-200 hover:bg-gray-300"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </aside>
    </section>
  );
}
