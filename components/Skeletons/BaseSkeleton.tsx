import { cx } from "@emotion/css"
import React from "react"

interface BaseSkeletonProps {
  className?: string
  width?: string | number
}

export const BaseSkeleton: React.FC<BaseSkeletonProps> = (props) => {
  const { className, width } = props

  return (
    <>
      <div
        className={cx(
          className,
          "bg-gray-100 rounded-lg relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent isolate overflow-hidden",
        )}
        style={{ width }}
      />
    </>
  )
}
