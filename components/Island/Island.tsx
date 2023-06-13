import clsx from "clsx"
import React from "react"

export const Island: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={clsx("flex-grow bg-white rounded-2xl px-4", className)}>
      {children}
    </div>
  )
}
