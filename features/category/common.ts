import { createGate } from "effector-react"

export type ParentCategoryId = number | null

const CategoryGate = createGate<{ categoryId: ParentCategoryId }>({
  defaultState: { categoryId: null },
})
const pageLoaded = CategoryGate.open

export { CategoryGate, pageLoaded }
