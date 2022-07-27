import { NextPage } from "next"
import { useRouter } from "next/router"
import { CategoryView } from "../../features/category/CategoryView"

const Categories: NextPage = () => {
  const router = useRouter()
  return <CategoryView categoryId={Number(router.query.id)} />
}

export default Categories
