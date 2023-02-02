import React from "react"
import { cx } from "@emotion/css"

const baseSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      <div
        className={cx(
          className,
          "bg-gray-100 rounded-lg relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent isolate overflow-hidden"
        )}
      />
    </>
  )
}

export default baseSkeleton
