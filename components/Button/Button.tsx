import { CircularProgress } from "@mui/material"
import clsx from "clsx"
import React from "react"
import styles from "./Button.module.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ className, children, fullWidth, isLoading, ...props }) => {
  return (
    <button
      className={clsx(
        "py-2 px-4 bg-white rounded-2xl hover:text-orange-600 relative",
        fullWidth && "w-full",
        className,
      )}
      disabled={isLoading}
      {...props}
    >
      <span className={clsx(isLoading && styles.hidden)}>{children}</span>
      {isLoading && (
        <div className={styles.spinnerContainer}>
          <CircularProgress color={"inherit"} size={16} />
        </div>
      )}
    </button>
  )
}
