import clsx from "clsx"
import React from "react"

export interface VStackProps {
  gap: "2" | "4" | "6" | "8"
  children: React.ReactNode
  className?: string
}

export const VStack: React.FC<VStackProps> = ({ gap, children, className }) => {
  return (
    <div
      className={clsx(
        "flex flex-col",
        gap === "2" && "gap-2",
        gap === "4" && "gap-4",
        gap === "6" && "gap-6",
        gap === "8" && "gap-8",
        className,
      )}
    >
      {children}
    </div>
  )
}
