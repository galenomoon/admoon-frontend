interface SkeletonProps {
  conditional: boolean
  children?: React.ReactNode
  length?: number
  className?: string
}

export default function Skeleton({
  conditional,
  children,
  length = 1,
  className,
}: SkeletonProps) {
  return conditional
    ? children
    : Array(length)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`h-fit w-fit animate-[pulse_1230ms_ease-in-out_infinite] rounded-md bg-gray-300 ${className}`}
          >
            <div className="invisible"> {children} </div>
          </div>
        ))
}

export function ProductSkeleton({ isGrid = false, length = 1 }) {
  return Array(length)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className={`relative flex  ${
          isGrid
            ? "flex-col sm:!h-[260px] sm:!w-full md:!h-[370px] md:!w-[235px]"
            : "!h-fit !w-full gap-6"
        } bg-gray-100 p-2`}
      >
        <Skeleton
          className={`${
            isGrid ? "!h-[220px] !w-full !max-w-[220px]" : "!h-[124px] !w-[124px]"
          }`}
          conditional={false}
        />
        <footer
          className={`flex gap-2 py-2 ${
            isGrid ? "md:w-full" : "sm:w-[40%] md:w-[80%]"
          } flex-col`}
        >
          <Skeleton className="!h-4 !w-[50%]" conditional={false} />
          <Skeleton className="!h-4 !w-[30%]" conditional={false} />
        </footer>
        <section
          className={`absolute right-3 ${
            isGrid ? "bottom-3" : "top-3"
          } z-10 flex items-center justify-center gap-2`}
        >
          <Skeleton className="!h-[32px] !w-[32px]" conditional={false} />
          <Skeleton className="!h-[32px] !w-[32px]" conditional={false} />
        </section>
      </div>
    ))
}
