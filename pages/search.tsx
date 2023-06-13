import clsx from "clsx"
import { NextPage } from "next"
import { NextRouter, useRouter } from "next/router"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { searchProducts } from "../api"
import { Button } from "../components/Button/Button"
import { H1 } from "../components/Header/Header"
import { Input } from "../components/Input/Input"
import { Island } from "../components/Island/Island"
import { NavbarSpacer } from "../components/NavbarLayout"
import { ProductListItem } from "../components/ProductListItem/ProductListItem"
import { ProductListItemSkeleton } from "../components/Skeletons/ProductListItemSkeleton"
import { pluralize } from "../functions/pluralize"
import { createArray } from "../functions/utils"
import { useIslands } from "../hooks/useIslands"

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

  useIslands()

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
  const totalCount = useMemo(
    () => data?.pages[data?.pages.length - 1].totalCount ?? 0,
    [data?.pages],
  )

  const renderSearchContent = () => {
    // if (!query) return <></>
    if (isLoading) {
      return (
        <Island>
          {createArray(6).map((_, index) => <ProductListItemSkeleton key={index} />)}
        </Island>
      )
    }
    if (error) {
      return <div>Ошибка :(</div>
    }
    return (
      <div className={"flex flex-col gap-4"}>
        <Island>
          {products.map((product) => <ProductListItem product={product} key={product.productId} />)}
        </Island>
        {hasNextPage && (
          <Button
            className={"mb-4"}
            isLoading={isFetching}
            fullWidth
            onClick={() => fetchNextPage()}
          >
            Ещё
          </Button>
        )}
      </div>
    )
  }

  return (
    <main className={clsx("min-h-screen")}>
      <div className={clsx("max-w-xl mx-auto")}>
        <NavbarSpacer />
        <div className="flex flex-col h-full p-4 gap-4">
          <Island className={"py-4 flex flex-col gap-2"}>
            <H1 className={"ml-2"}>Поиск по названию или штрих-коду</H1>
            <Input
              className={"w-full"}
              value={query}
              onChange={queryChanged}
              placeholder="Например, яблочный сок"
            />
            {query && (
              <span className={"ml-2 text-sm text-secondary"}>
                {isFetching ? "Загрузка…" : totalCount > 0
                  ? `${totalCount} ${pluralize(totalCount, "результат", "результата", "результатов")}`
                  : "Ничего не нашлось :("}
              </span>
            )}
          </Island>

          {renderSearchContent()}
        </div>
      </div>
    </main>
  )
}

export default Search
