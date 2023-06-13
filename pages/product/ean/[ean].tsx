import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useQuery } from "react-query"
import { getProductByEan } from "../../../api"
import { CenteredOverlay } from "../../../components/CenteredOverlay"
import { MainLayout } from "../../../components/Layout"
import { ProductSkeleton } from "../../../components/ProductView/Product"
import { useIslands } from "../../../hooks/useIslands"

const ProductView: NextPage = () => {
  useIslands()
  const router = useRouter()
  const ean = router.query.ean?.toString()

  const { isLoading, error, data: product } = useQuery(
    ["getProductByEan", ean],
    ({ signal }) => {
      if (!ean) return
      return getProductByEan(ean, signal)
    },
  )

  useEffect(() => {
    if (product) {
      router.replace(`/product/${product.productId}`)
    }
  }, [router, product])
  // state.product → redirecting
  if (isLoading || product) {
    return (
      <MainLayout>
        <div className="pt-4">
          <ProductSkeleton />
        </div>
      </MainLayout>
    )
  }
  if (error) {
    return <CenteredOverlay>Ошибка :(</CenteredOverlay>
  }
  return <CenteredOverlay>Товара со штрих-кодом {ean} пока нет в базе.</CenteredOverlay>
}

export default ProductView
