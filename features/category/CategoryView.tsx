import { useGate, useUnit } from "effector-react/scope"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { SortOrder, SortType } from "../../api"
import { MainLayout } from "../../components/Layout"
import { ProductListItem } from "../../components/ProductListItem"
import { CategoryGate } from "./common"
import { $productsState } from "./products"
import { $sort, sortChanged, sortOrderFlipped } from "./sort"
import { $subcategoriesState } from "./subcategories"

const Subcategories: React.FC = () => {
  const {
    isLoading,
    categories,
  } = useUnit($subcategoriesState)
  if (isLoading) {
    return <p>Loading...</p>
  }
  if (categories.length > 0) {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <Link href={`/category/${c.categoryId}`} key={c.categoryId}>
            <a className="px-4 py-2 bg-gray-100 rounded-full">{c.name}</a>
          </Link>
        ))}
      </div>
    )
  }
  return <></>
}

const Sort: React.FC = () => {
  const {
    sortType,
    sortOrder,
  } = useUnit($sort)
  const setSort = useUnit(sortChanged)
  const flipOrder = useUnit(sortOrderFlipped)
  return (
    <div>
      <select
        className="bg-gray-100 p-4 rounded rounded-r-none h-14"
        value={sortType}
        onChange={(e) => setSort(e.target.value as SortType)}
      >
        <option value="name">По названию</option>
        <option value="price">По цене</option>
        <option value="unitPrice">По удельной цене</option>
      </select>
      <button className="p-4 rounded rounded-l-none bg-gray-100 h-14" onClick={flipOrder}>
        {sortOrder === SortOrder.asc ? "↑" : "↓"}
      </button>
    </div>
  )
}

const Products: React.FC = () => {
  const {
    isLoading,
    products,
  } = useUnit($productsState)
  if (isLoading) {
    return <p>Loading...</p>
  }
  if (products.length > 0) {
    return (
      <div className="flex flex-col mt-4">
        {products.map((product) => <ProductListItem product={product} key={product.productId} />)}
      </div>
    )
  }
  return <></>
}

export const CategoryView: React.FC<{ categoryId: number | null }> = ({ categoryId }) => {
  const router = useRouter()
  useGate(CategoryGate, { categoryId, routerReady: router.isReady })
  return (
    <MainLayout>
      <Subcategories />
      <Sort />
      <Products />
    </MainLayout>
  )
}

// <div v-if="categoryProductsStore.isLoading">Loading...</div>
// <div className="flex flex-col mt-4" v-else>
//   {/*<ProductListItem*/}
//   {/*  v-for="p in categoryProductsStore.products"*/}
//   {/*  product="p"*/}
//   {/*/>*/}
// </div>
