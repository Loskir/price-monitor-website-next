import { Scope } from "effector"

interface State {
  clientScope: Scope | null
  current: any
}

export const state: State = {
  clientScope: null,
  current: null,
}
