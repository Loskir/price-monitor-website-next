import { cx } from "@emotion/css"
import React from "react"
import { BaseSkeleton } from "./BaseSkeleton"
import styles from "./ProductListItemSkeleton.module.css"

export const ProductListItemSkeleton = () => {
  return (
    <div className={cx("pl-4 pt-4 relative", styles.productListItem)}>
      <div className="flex mb-4">
        <BaseSkeleton className="mr-4 rounded-2xl w-16 h-16 shrink-0 relative" />
        <div className="grow min-h-16">
          <div className="mr-4">
            <BaseSkeleton className={"h-5 w-11/12"} />
            <div className="mt-4">
              <div className="flex items-center">
                <BaseSkeleton className={"h-8 w-2/12"} />
                <div className="grow" />
                <BaseSkeleton className={"h-8 w-3/12"} />
              </div>
              <div className="flex flex-wrap justify-end mt-4">
                <BaseSkeleton className={"h-4 w-3/12"} />
                <div className="grow" />
                <BaseSkeleton className={"h-4 w-4/12"} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("ml-20", styles.divider)} />
    </div>
  )
}
