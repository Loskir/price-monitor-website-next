import { css } from "@emotion/css"
import clsx from "clsx"
import React, { useCallback, useMemo } from "react"
import TextareaAutosize from "react-textarea-autosize"

export interface InputProps extends
  Pick<
    React.HTMLProps<HTMLInputElement>,
    "className" | "value" | "placeholder"
  >
{
  type?: "input" | "textarea"
  onChange?: (value: string) => void
}

export const Input: React.FC<InputProps> = ({
  className: classNameProp,
  type = "input",
  onChange: onChangeProp,
  ...forwardedProps
}) => {
  const className = useMemo(() =>
    clsx(
      "bg-white rounded-xl px-4 py-2 border border-gray-200 hover:border-gray-300 active:border-gray-300",
      css`min-height: 42px`,
      classNameProp,
    ), [classNameProp])
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeProp?.(event.target.value)
  }, [onChangeProp])

  const props = {
    className,
    onChange,
    ...forwardedProps,
  }

  if (type === "input") {
    return <input {...props} />
  }

  return <TextareaAutosize {...props} />
}
