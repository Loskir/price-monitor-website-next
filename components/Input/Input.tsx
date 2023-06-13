import { css } from "@emotion/css"
import clsx from "clsx"
import React from "react"

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
}

export const Input: React.FC<InputProps> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={clsx(
        "bg-white rounded-xl border border-gray-200 hover:border-gray-300 active:border-gray-300",
        css`padding: 9px 19px`,
        className,
      )}
      {...props}
    />
  )
}
