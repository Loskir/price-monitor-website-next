import { Search } from "@mui/icons-material"
import clsx from "clsx"
import Link from "next/link"
import React, { ReactNode } from "react"
import styles from "./Header.module.css"

const HeaderLink: React.FC<{ link: string; text: string }> = ({ link, text }) => {
  return (
    <Link href={link}>
      <a className="my-2 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium flex-shrink-0">{text}</a>
    </Link>
  )
}

const HeaderLinkIcon: React.FC<{ link: string; label: string; children: ReactNode }> = ({ link, label, children }) => {
  return (
    <Link href={link}>
      <a className="p-2 rounded-lg leading-none hover:bg-gray-200 flex-shrink-0 -mr-2" aria-label={label}>
        {children}
      </a>
    </Link>
  )
}

export const Header: React.FC = () => {
  return (
    <div className={clsx("w-full fixed z-50 top-0 bg-gray-100", styles.header)}>
      <div className="mx-auto max-w-xl flex flex-row items-center overflow-auto px-4">
        <Link href="/">
          <a className="py-2 px-4 font-bold flex-shrink-0 hover:bg-gray-200 rounded-lg -ml-4">Price Monitor</a>
        </Link>
        <HeaderLink link="/scanner" text="Сканер" />
        <HeaderLink link="/categories" text="Категории" />
        <div className="flex-grow"></div>

        <HeaderLinkIcon link="/search" label="Поиск">
          <Search />
        </HeaderLinkIcon>
      </div>
    </div>
  )
}
