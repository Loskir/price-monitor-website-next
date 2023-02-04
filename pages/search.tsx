import { NextPage } from "next"
import { NextRouter, useRouter } from "next/router"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { searchProducts } from "../api"
import { MainLayoutNoMargin } from "../components/Layout"
import { ProductListItemNew } from "../components/ProductListItemNew"
import { ProductListItemSkeleton } from "../components/Skeletons/ProductListItemSkeleton"
import { createArray } from "../functions/utils"

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

  const { isLoading, error, data } = useQuery(["search", query], ({ signal }) => searchProducts(query, signal))
  const products = data ?? []

  const queryChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      saveToURL(router, newQuery)
    },
    [router],
  )

  return (
    <MainLayoutNoMargin>
      <div className="flex flex-col h-full">
        <div className="w-full px-4 mb-1">
          <input
            className="bg-gray-100 p-2 rounded w-full"
            value={query}
            onChange={queryChanged}
            placeholder="Поиск по названию или штрих-коду…"
          />
        </div>

        {isLoading
          ? (
            createArray(6).map((_, index) => <ProductListItemSkeleton key={index} />)
          )
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
