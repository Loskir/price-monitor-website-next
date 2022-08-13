import { scanImageData } from "@undecaf/zbar-wasm"
import { WorkerEvent } from "./workerTypes"
let offscreenCanvas: OffscreenCanvas

addEventListener("message", async (event: MessageEvent<WorkerEvent>) => {
  // console.log(event.data)
  if (event.data.type === "init") {
    if (typeof OffscreenCanvas !== "undefined") {
      const { d } = event.data
      offscreenCanvas = new OffscreenCanvas(d[0], d[1])
    }
  }
  if (event.data.type === "scan") {
    const { data } = event.data
    const s = Date.now()
    const res = await scanImageData(data)
    // console.log(res)
    postMessage({
      type: "scan",
      result: res,
      duration: Date.now() - s,
    })
  }
})

export {}
