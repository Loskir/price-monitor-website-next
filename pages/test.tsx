import { createEffect, createEvent, createStore, forward, PageContext, withStart } from "effector-next"
import { useUnit } from "effector-react"
import { NextPage } from "next"

const pageLoaded = createEvent<PageContext>()

const loadDataFx = createEffect({
  handler: async () => {
    await new Promise((r) => setTimeout(r, 1000))
    return "new value " + Date.now()
  },
})

const $greeting = createStore("init value")

forward({
  from: [pageLoaded],
  to: loadDataFx,
})

forward({
  from: loadDataFx.doneData,
  to: $greeting,
})

const Test: NextPage = () => {
  const greeting = useUnit($greeting)
  return (
    <main>
      {greeting}
    </main>
  )
}

export default withStart(pageLoaded)(Test)
