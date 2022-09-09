import React, { ReactNode } from "react"
import { Header } from "./Header"

export const HeaderLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div>
        {children}
      </div>
    </>
  )
}

export const HeaderSpacer: React.FC = () => <div style={{ height: "calc(56px + env(safe-area-inset-top))" }} />
