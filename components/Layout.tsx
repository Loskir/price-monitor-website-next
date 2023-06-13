import clsx from "clsx"
import React, { ReactNode } from "react"
import { NavbarSpacer } from "./NavbarLayout"

export const MainLayout: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <main className={clsx("max-w-xl mx-auto pt-4 px-4 pb-8 min-h-screen", className)}>
      <NavbarSpacer />
      {children}
    </main>
  )
}
export const MainLayoutNoMargin: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <main className={clsx("max-w-xl mx-auto pt-4 min-h-screen", className)}>
      <NavbarSpacer />
      {children}
    </main>
  )
}
