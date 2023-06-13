import { useEffect } from "react"

export const useIslands = () => {
  useEffect(() => {
    document.body.classList.add("islands")
    return () => {
      document.body.classList.remove("islands")
    }
  }, [])
}
