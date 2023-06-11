import { NextPage } from "next"
import { NextRouter, useRouter } from "next/router"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { searchProducts } from "../api"
import { Button } from "../components/Button/Button"
import { MainLayoutNoMargin } from "../components/Layout"
import { ProductListItem } from "../components/ProductListItem/ProductListItem"
import { ProductListItemSkeleton } from "../components/Skeletons/ProductListItemSkeleton"
// import { pluralize } from "../functions/pluralize"
import { createArray } from "../functions/utils"

const saveToURL = (router: NextRouter, query: string) => {
  if (query) {
    router?.replace({
      query: {
        ...router.query,
        q: query,
      },
    })
  } else {
    delete router.query.q
    router?.replace({
      query: router.query,
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

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["search", query],
    ({ signal, pageParam }) =>
      searchProducts({
        query,
        offset: pageParam,
        manticore: router.query.manticore,
      }, signal),
    {
      getNextPageParam: (lastPage) => lastPage.nextOffset || false,
      keepPreviousData: true,
    },
  )

  const queryChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      saveToURL(router, newQuery)
    },
    [router],
  )

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  )
  // const totalCount = useMemo(
  //   () => data?.pages[data?.pages.length - 1].totalCount,
  //   [data?.pages],
  // )

  const renderSearchContent = () => {
    // if (!query) return <></>
    if (isLoading) {
      return createArray(6).map((_, index) => <ProductListItemSkeleton key={index} />)
    }
    if (error) {
      return <div>Ошибка :(</div>
    }
    return (
      <div className="relative flex-grow pb-8">
        {/*<span className={"ml-4"}>*/}
        {/*  {totalCount} {totalCount !== undefined && pluralize(totalCount, "результат", "результата", "результатов")}*/}
        {/*</span>*/}
        {products.map((product) => <ProductListItem product={product} key={product.productId} />)}
        {hasNextPage && (
          <div className={"px-4 w-full"}>
            <Button
              isLoading={isFetching}
              fullWidth
              onClick={() => fetchNextPage()}
            >
              Ещё
            </Button>
          </div>
        )}
      </div>
    )
  }

  // todo: spinner on previous data
  return (
    <MainLayoutNoMargin>
      <div className="flex flex-col h-full mx-4">
        <input
          className="bg-gray-100 mb-2 py-2 px-4 rounded-xl"
          value={query}
          onChange={queryChanged}
          placeholder="Поиск по названию или штрих-коду…"
        />

        {renderSearchContent()}
      </div>
    </MainLayoutNoMargin>
  )
}

export default Search
