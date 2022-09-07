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
