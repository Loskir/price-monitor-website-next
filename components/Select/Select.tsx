import clsx from "clsx"
import React from "react"

export interface SelectOption<T extends string = string> {
  value: T
  label?: string
}

export interface SelectProps<T extends string = string> {
  className?: string
  onChange?: (value: T) => any
  options: SelectOption<T>[]
  value: T
}

export function Select<T extends string = string>(props: SelectProps<T>) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value as T)}
      className={clsx(
        "rounded-xl py-2 px-4 border border-gray-200 bg-transparent",
        props.className,
      )}
    >
      {props.options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label ?? value}
        </option>
      ))}
    </select>
  )
}
