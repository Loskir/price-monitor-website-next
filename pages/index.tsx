import type { NextPage } from "next"
import Link from "next/link"
import { MainLayout } from "../components/Layout"

const Home: NextPage = () => {
  return (
    <MainLayout>
      <h1 className="text-xl mb-4 font-medium">Price Monitor — агрегатор цен на продукты</h1>
      <p className="my-2">
        Мы ежедневно собираем данные о товарах из магазинов, чтобы вы могли узнать о лучших ценах.
      </p>
      <p className="my-2">
        <Link href="/scanner">
          <a className="font-semibold text-blue-800 hover:text-blue-600">Сканер</a>
        </Link>{" "}
        поможет найти товар, отсканировав штрих-код на упаковке.
      </p>
      <p className="my-2">
        В{" "}
        <Link href="/search">
          <a className="font-semibold text-blue-800 hover:text-blue-600">Поиске</a>
        </Link>{" "}
        можно найти товар по названию или производителю.
      </p>
    </MainLayout>
  )
}

export default Home
