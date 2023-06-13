import { Search } from "@mui/icons-material"
import clsx from "clsx"
import Link from "next/link"
import React, { ReactNode } from "react"
import styles from "./Navbar.module.css"

const NavbarLink: React.FC<{ link: string; text: string }> = ({ link, text }) => {
  return (
    <Link href={link}>
      <a className="my-2 py-2 px-2 hover:text-orange-600 flex-shrink-0">{text}</a>
    </Link>
  )
}

const NavbarLinkIcon: React.FC<{ link: string; label: string; children: ReactNode }> = ({ link, label, children }) => {
  return (
    <Link href={link}>
      <a className="p-2 leading-none hover:text-orange-600 flex-shrink-0" aria-label={label}>
        {children}
      </a>
    </Link>
  )
}

export const Navbar: React.FC = () => {
  return (
    <nav className={clsx("w-full fixed z-50 top-0 bg-white drop-shadow-sm", styles.navbar)}>
      <div className="mx-auto max-w-xl flex flex-row items-center overflow-auto px-2">
        <Link href="/">
          <a className="py-2 px-2 font-semibold flex-shrink-0 hover:text-orange-600 rounded-lg">Price Monitor</a>
        </Link>
        <NavbarLink link="/scanner" text="Сканер" />
        <NavbarLink link="/categories" text="Категории" />
        <div className="flex-grow"></div>

        {/*<NavbarLinkIcon link="/scanner" label="Сканер">*/}
        {/*  <svg*/}
        {/*    width={24}*/}
        {/*    height={24}*/}
        {/*    version="1.1"*/}
        {/*    viewBox="0 0 24 24"*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*    className={"fill-current"}*/}
        {/*  >*/}
        {/*    <g id="Layer_2">*/}
        {/*      <g>*/}
        {/*        <path d="M17,3h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h1c1.1,0,2,0.9,2,2v1.1c0,0.6,0.4,1,1,1s1-0.4,1-1V7C21,4.8,19.2,3,17,3z" />*/}
        {/*        <path d="M20,15c-0.6,0-1,0.4-1,1v1c0,1.1-0.9,2-2,2h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h1c2.2,0,4-1.8,4-4v-1C21,15.4,20.6,15,20,15z" />*/}
        {/*        <path d="M8,19H7c-1.1,0-2-0.9-2-2v-1c0-0.6-0.4-1-1-1s-1,0.4-1,1v1c0,2.2,1.8,4,4,4h1c0.6,0,1-0.4,1-1S8.6,19,8,19z" />*/}
        {/*        <path d="M4,9c0.6,0,1-0.4,1-1V7c0-1.1,0.9-2,2-2h1c0.6,0,1-0.4,1-1S8.6,3,8,3H7C4.8,3,3,4.8,3,7v1C3,8.5,3.4,9,4,9z" />*/}
        {/*        <path d="M20,11H4c-0.6,0-1,0.4-1,1s0.4,1,1,1h16c0.6,0,1-0.4,1-1S20.6,11,20,11z" />*/}
        {/*      </g>*/}
        {/*    </g>*/}
        {/*  </svg>*/}
        {/*</NavbarLinkIcon>*/}

        <NavbarLinkIcon link="/search" label="Поиск">
          <Search />
        </NavbarLinkIcon>
      </div>
    </nav>
  )
}
