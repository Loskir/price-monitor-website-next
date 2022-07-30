import { combine, createStore, domain, forward, sample } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { getCategories } from "../../api"
import { CategoryModel } from "../../models/Category"
import { $categoryId, categoryIdChanged, ParentCategoryId } from "./common"

const $categories = createStore<CategoryModel[]>([])

const loadCategoriesFx = createRequestFx<ParentCategoryId, CategoryModel[], Error>({
  name: "loadCategoriesFx",
  domain,
  handler: async (parentId, controller?: Controller) => {
    return getCategories(parentId, controller?.getSignal())
  },
})

sample({
  clock: categoryIdChanged,
  source: $categoryId,
  target: loadCategoriesFx,
})

forward({
  from: loadCategoriesFx.doneData,
  to: $categories,
})

const $isLoading = loadCategoriesFx.pending

const $subcategoriesState = combine({
  isLoading: $isLoading,
  categories: $categories,
})

export { $subcategoriesState, loadCategoriesFx }
