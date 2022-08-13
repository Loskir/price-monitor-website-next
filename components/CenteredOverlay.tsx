import React, { ReactNode } from "react"

export const CenteredOverlay: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 p-12 bg-white flex flex-col justify-center text-center font-medium">
      {children}
    </div>
  )
}
