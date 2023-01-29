import { NextPage } from "next"
import { NextRouter, useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { searchProducts } from "../api"
import { MainLayoutNoMargin } from "../components/Layout"
import { ProductListItemNew } from "../components/ProductListItemNew"

const saveToURL = (router: NextRouter, query: string) => {
  if (query) {
    router?.replace({
      query: {
        q: query,
      },
    })
  } else {
    router?.replace({
      query: {},
    })
  }
}

const Search: NextPage = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>("")

  useEffect(() => {
    let q = router.query.q
    if (Array.isArray(q)) q = q[0]
    if (!q) q = ""
    setQuery(q)
  }, [router])

  const { isLoading, error, data } = useQuery(
    ["search", query],
    ({ signal }) => searchProducts(query, signal),
  )
  const products = data ?? []

  const queryChanged = useCallback((newQuery: string) => {
    setQuery(newQuery)
    saveToURL(router, newQuery)
  }, [router])

  return (
    <MainLayoutNoMargin>
      <div className="flex flex-col h-full">
        <div className="w-full px-4 mb-1">
          <input
            className="bg-gray-100 p-2 rounded w-full"
            value={query}
            onChange={(e) => queryChanged(e.target.value)}
            placeholder="Поиск по названию или штрих-коду…"
          />
        </div>
        {isLoading
          ? <div>Загрузка…</div>
          : error
          ? <div>Ошибка :(</div>
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
