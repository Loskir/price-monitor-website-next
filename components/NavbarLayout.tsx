import React, { ReactNode } from "react"
import { Navbar } from "./Navbar/Navbar"

export const NavbarLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export const NavbarSpacer: React.FC = () => <div style={{ height: "calc(56px + env(safe-area-inset-top))" }} />
