import clsx from "clsx"
import React from "react"

export interface HeaderProps {
  children?: React.ReactNode
  className?: string
}

export const H1: React.FC<HeaderProps> = ({ children, className }) => {
  return <h1 className={clsx("text-lg font-semibold leading-6", className)}>{children}</h1>
}
