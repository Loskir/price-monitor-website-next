import { useEvent, useStore } from "effector-react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { MainLayoutNoMargin } from "../components/Layout"
import { ProductListItemNew } from "../components/ProductListItemNew"
import { $isLoading, $products, $query, attachRouter, pageLoaded, queryChanged } from "../features/search/state"

const Search: NextPage = () => {
  const query = useStore($query)
  const queryChangedL = useEvent(queryChanged)
  const products = useStore($products)
  const isLoading = useStore($isLoading)
  const pageLoadedL = useEvent(pageLoaded)
  const attachRouterEvent = useEvent(attachRouter)
  const router = useRouter()
  useEffect(() => {
    pageLoadedL()
    attachRouterEvent(router)

    return () => {
      attachRouterEvent(null)
    }
  }, [pageLoadedL, attachRouterEvent, router])
  return (
    <MainLayoutNoMargin>
      <div className="flex flex-col h-full">
        <div className="w-full px-4 mb-1">
          <input
            className="bg-gray-100 p-2 rounded w-full"
            value={query}
            onChange={(e) => queryChangedL(e.target.value)}
            placeholder="Поиск по названию или штрих-коду…"
          />
        </div>
        {isLoading
          ? <div>Загрузка…</div>
          : (
            <div className="relative flex-grow">
              {products.map((product) => <ProductListItemNew product={product} key={product.productId} />)}
            </div>
          )}
      </div>
    </MainLayoutNoMargin>
  )
}

export default Search
