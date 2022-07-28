import { combine, createStore, forward, sample } from "effector-next"
import { Controller, createRequestFx } from "fry-fx"
import { getCategories } from "../../api"
import { CategoryModel } from "../../models/Category"
import { $categoryId, ParentCategoryId } from "./common"

const $categories = createStore<CategoryModel[]>([])

const loadCategoriesFx = createRequestFx<ParentCategoryId, CategoryModel[], Error>(
  async (parentId, controller?: Controller) => {
    return getCategories(parentId, controller?.getSignal())
  },
)

forward({
  from: loadCategoriesFx.doneData,
  to: $categories,
})

const $isLoading = loadCategoriesFx.pending

sample({
  source: $categoryId,
  target: loadCategoriesFx,
})

const $subcategoriesState = combine({
  isLoading: $isLoading,
  categories: $categories,
})

export { $subcategoriesState, loadCategoriesFx }
