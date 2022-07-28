import { createGate } from "effector-react"

export type ParentCategoryId = number | null

const CategoryGate = createGate<{ categoryId: ParentCategoryId }>({
  defaultState: { categoryId: null },
})
const pageLoaded = CategoryGate.open
const $categoryId = CategoryGate.state.map((v) => v.categoryId)

$categoryId.watch((v) => console.log("categoryId changed", v))

export { $categoryId, CategoryGate, pageLoaded }
