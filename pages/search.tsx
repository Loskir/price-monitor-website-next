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
import { Select, SelectOption } from "../components/Select/Select"
import { ProductListItemSkeleton } from "../components/Skeletons/ProductListItemSkeleton"
import { sortMapper, SortTypeHuman } from "../features/search/sort"
import { pluralize } from "../functions/pluralize"
import { createArray } from "../functions/utils"
import { useIslands } from "../hooks/useIslands"

export const sortLocales: { [key in SortTypeHuman]: string } = {
  [SortTypeHuman.relevancy]: "По релевантности",
  [SortTypeHuman.nameAsc]: "От А до Я",
  [SortTypeHuman.nameDesc]: "От Я до А",
  [SortTypeHuman.priceAsc]: "Сначала дешевле",
  [SortTypeHuman.priceDesc]: "Сначала дороже",
  [SortTypeHuman.unitPriceAsc]: "Сначала выгодные",
  [SortTypeHuman.unitPriceDesc]: "Сначала невыгодные",
}

const saveToURL = (router: NextRouter, key: string, value: string | undefined) => {
  if (value) {
    router?.replace({
      query: {
        ...router.query,
        [key]: value,
      },
    })
  } else {
    delete router.query[key]
    router?.replace({
      query: router.query,
    })
  }
}

const Search: NextPage = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>("")
  const [sort, setSort] = useState<SortTypeHuman>(SortTypeHuman.relevancy)

  useIslands()

  useEffect(() => {
    let q = router.query.q
    if (Array.isArray(q)) q = q[0]
    if (!q) q = ""
    setQuery(q)

    const sort = router.query.sort
    if (Object.values(SortTypeHuman).includes(sort as any)) {
      setSort(sort as any)
    }
  }, [router])

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["search", query, sort],
    ({ signal, pageParam }) => {
      const [sortType, sortOrder] = sortMapper[sort]
      return searchProducts({
        query,
        offset: pageParam,
        sort: sortType,
        sortOrder,
      }, signal)
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextOffset || false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const queryChanged = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      saveToURL(router, "q", newQuery)
    },
    [router],
  )

  const sortChanged = useCallback(
    (newSort: SortTypeHuman) => {
      setSort(newSort)
      saveToURL(router, "sort", newSort === SortTypeHuman.relevancy ? undefined : newSort)
    },
    [router],
  )

  const lastResponse = useMemo(
    () => data?.pages[data?.pages.length - 1],
    [data?.pages],
  )

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  )
  const totalCount = lastResponse?.totalCount ?? 0

  const options = useMemo<SelectOption<SortTypeHuman>[]>(() => {
    return Object.values(SortTypeHuman).map((sortType) => ({
      value: sortType,
      label: sortLocales[sortType],
    }))
  }, [])

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
          <Island className={"py-4 flex flex-col gap-2 items-start"}>
            <H1 className={"ml-2"}>Поиск по названию или штрих-коду</H1>
            <Input
              type={"textarea"}
              className={"w-full"}
              value={query}
              onChange={queryChanged}
              placeholder="Например, яблочный сок"
            />
            <Select className={"w-full"} options={options} value={sort} onChange={sortChanged} />
            <div className={"mx-2 self-stretch flex justify-between text-sm text-secondary"}>
              {query && (
                <span>
                  {isFetching ? "Загрузка…" : totalCount > 0
                    ? `${totalCount} ${pluralize(totalCount, "результат", "результата", "результатов")}`
                    : "Ничего не нашлось :("}
                </span>
              )}

              {lastResponse?.ms && !isFetching && <span>{lastResponse.ms}ms</span>}
            </div>
          </Island>

          {renderSearchContent()}
        </div>
      </div>
    </main>
  )
}

export default Search
