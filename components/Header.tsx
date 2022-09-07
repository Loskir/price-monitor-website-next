import clsx from "clsx"
import Link from "next/link"
import React from "react"
import styles from "./Header.module.css"

const HeaderLink: React.FC<{ link: string; text: string }> = ({ link, text }) => {
  return (
    <Link href={link}>
      <a className="my-2 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium flex-shrink-0">{text}</a>
    </Link>
  )
}

export const Header: React.FC = () => {
  return (
    <div className={clsx("w-full fixed z-50 top-0 bg-gray-100", styles.header)}>
      <div className="mx-auto max-w-xl flex flex-row items-center overflow-auto">
        <Link href="/">
          <a className="py-2 px-4 font-bold flex-shrink-0 hover:bg-gray-200 rounded-lg">Price Monitor</a>
        </Link>
        <HeaderLink link="/scanner" text="Scanner" />
        {/*<HeaderLink link="/search" text="Search" />*/}
        <HeaderLink link="/categories" text="Categories" />
        <div className="flex-grow"></div>
        <HeaderLink link="/search" text="Search" />
      </div>
    </div>
  )
}
