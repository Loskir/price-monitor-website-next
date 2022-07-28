import { NextPage } from "next"
import { useRouter } from "next/router"
import { CategoryView } from "../../features/category/CategoryView"

const Categories: NextPage = () => {
  const router = useRouter()
  return <CategoryView categoryId={router.isReady ? Number(router.query.id) : null} />
}

export default Categories
