import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getProductByEan } from "../../../api"
import { CenteredOverlay } from "../../../components/CenteredOverlay"

const ProductView: NextPage = () => {
  const [ean, setEan] = useState<string>("")
  const router = useRouter()

  const { isLoading, error, data: product } = useQuery(
    ["getProductByEan", ean],
    ({ signal }) => getProductByEan(ean, signal),
  )

  useEffect(() => {
    const ean = router.query.ean?.toString()
    if (router.isReady && ean) {
      setEan(ean)
    }
  }, [router])

  useEffect(() => {
    if (product) {
      router.replace(`/product/${product.productId}`)
    }
  }, [router, product])
  // state.product → redirecting
  if (isLoading || product) {
    return <CenteredOverlay>Загрузка...</CenteredOverlay>
  }
  if (error) {
    return <CenteredOverlay>Ошибка :(</CenteredOverlay>
  }
  return <CenteredOverlay>Товара со штрих-кодом {ean} пока нет в базе.</CenteredOverlay>
}

export default ProductView
