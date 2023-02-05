import React from "react"
import { createArray } from "../../functions/utils"
import { BaseSkeleton } from "./BaseSkeleton"

export const ProductItemPriceHistorySkeleton: React.FC = () => {
  return <BaseSkeleton className={"w-full h-[420px]"} />
}

export const ProductItemSkeleton: React.FC = () => {
  return (
    <div>
      <div className="h-48 w-64 mx-auto flex justify-center items-center">
        <BaseSkeleton className="w-full h-full" />
      </div>
      <div className="mb-12">
        <BaseSkeleton className="mt-4 h-7 mb-2 w-full" />
        <BaseSkeleton className="h-6 w-4/12" />
      </div>
      <BaseSkeleton className="h-7 w-4/12 mt-4 mb-2" />
      <div>
        {createArray(4).map((_, index) => (
          <div
            className="flex flex-row items-center py-4 flex-wrap border-b border-solid border-gray-100 last:border-none"
            key={index}
          >
            <BaseSkeleton className="h-[32px] mr-4 w-14 sm:w-16" />
            <div className="flex flex-col mr-4 w-1/2">
              <BaseSkeleton className={"h-5 w-3/12 mb-1"} />
              <BaseSkeleton className={"h-4 w-4/12"} />
            </div>
            <div className="flex flex-col ml-auto items-end w-1/12">
              <BaseSkeleton className={"h-7 w-full"} />
            </div>
          </div>
        ))}
      </div>
      <BaseSkeleton className="h-7 w-3/12 my-4" />
      <ProductItemPriceHistorySkeleton />
    </div>
  )
}
