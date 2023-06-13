import { cx } from "@emotion/css"
import React from "react"

export const BaseSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <>
      <div
        className={cx(
          "bg-gray-100 rounded-lg relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent isolate overflow-hidden",
          className,
        )}
      />
    </>
  )
}
