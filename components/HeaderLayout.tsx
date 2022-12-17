import React, { ReactNode } from "react"
import { Header } from "./Header"

export const HeaderLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export const HeaderSpacer: React.FC = () => <div style={{ height: "calc(56px + env(safe-area-inset-top))" }} />
