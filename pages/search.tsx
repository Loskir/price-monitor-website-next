import { useEvent, useStore } from "effector-react"
import { NextPage } from "next"
import { MainLayout } from "../components/Layout"
import { ProductListItem } from "../components/ProductListItem"
import { $isLoading, $products, $query, queryChanged } from "../features/search/state"

const Search: NextPage = () => {
  const query = useStore($query)
  const queryChangedL = useEvent(queryChanged)
  const products = useStore($products)
  const isLoading = useStore($isLoading)
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <input
          className="bg-gray-100 p-2 rounded w-full mb-1"
          value={query}
          onChange={(e) => queryChangedL(e.target.value)}
          placeholder="Поиск по названию или штрих-коду…"
        />
        {isLoading
          ? <div>Загрузка…</div>
          : (
            <div className="relative flex-grow">
              {products.map((product) => <ProductListItem product={product} key={product.productId} />)}
            </div>
          )}
      </div>
    </MainLayout>
  )
}

export default Search
