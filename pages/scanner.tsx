import { type ZBarSymbol } from "@undecaf/zbar-wasm"
// const { scanImageData } = require("@undecaf/zbar-wasm")
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"

const useFps = () => {
  const [ms, setMs] = useState(0)
  const len = 10
  const [msArray] = useState(Array.from({ length: len }, () => 0))
  const reportMs = (ms: number) => {
    msArray.shift()
    msArray.push(ms)
    const sum = msArray.reduce((a, v) => a + v, 0)
    setMs(sum / len)
  }
  return {
    ms,
    reportMs,
  }
}

const initWorker = (video: HTMLVideoElement) => {
  const worker = new Worker(new URL("../scanner.worker.ts", import.meta.url))
  worker.postMessage({ type: "init", d: [video.videoWidth, video.videoHeight] })
  return worker
}

const setCanvasSize = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
}

type OnResultFn = (result: string) => unknown

const handleScanResult = (result: ZBarSymbol[], onResult: OnResultFn) => {
  const z = result.find((v) => v.typeName === "ZBAR_EAN13")
  if (z) {
    return onResult(Array.from(z.data).map((v) => String.fromCharCode(v)).join(""))
  }
}

const Scanner: React.FC<{ onResult: OnResultFn }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worker = useRef<Worker | null>(null)
  const pendingScans = useRef(0)
  const dateStart = useRef(0)

  const { ms, reportMs } = useFps()

  useEffect(() => {
    void (async () => {
      if (!navigator?.mediaDevices?.getUserMedia) return

      const res = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: 1920,
        },
      })

      const video = videoRef.current
      if (!video) return
      video.srcObject = res
      video.play()
        .then(() => {
          const canvas = canvasRef.current
          if (canvas) {
            setCanvasSize(canvas, video)
          }
          worker.current = initWorker(video)
          worker.current?.addEventListener("message", (event) => {
            if (event.data.type === "scan") {
              pendingScans.current--
              handleScanResult(event.data.result, onResult)
              reportMs(Date.now() - dateStart.current)
            }
            // console.log("from worker", event.data)
          })
        })
        .catch((error) => {
          console.warn("unable to play video", error)
        })
    })()

    // reader.decodeFromConstraints(
    //   { video: { facingMode: "environment" } },
    //   videoRef.current,
    //   (result, error) => {
    //     if (!result) {
    //       return
    //     }
    //     return onResult(result)
    //   },
    // )
    //
    // return () => reader.reset()
    return () => {
      worker.current?.terminate()
    }
  }, [])

  // useEffect(() => {
  //   void (async () => {
  //     // const device = await navigator?.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
  //     // setDeviceId(device.id)
  //     // const devices = await reader.listVideoInputDevices()
  //     // console.log(devices)
  //     // setDevices(devices)
  //     // if (devices.length > 0) {
  //     //   setDeviceId(devices.find((v) => v.)?.deviceId || devices[0].deviceId)
  //     // }
  //   })()
  // }, [])

  useEffect(() => {
    const grab = () => {
      if (pendingScans.current < 1) {
        dateStart.current = Date.now()
        if (!canvasRef.current || !videoRef.current) return
        const canvas = canvasRef.current
        const video = videoRef.current
        if (video.videoWidth === 0 || video.videoHeight === 0) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        // console.log(worker)
        worker.current?.postMessage({ type: "scan", data })
        pendingScans.current++
      }
      // const res: ZBarSymbol[] = await scanImageData(data)
      // console.log(Date.now() - s)
      // reportMs(Date.now() - s)
      // console.log(res)
      // handleScanResult(res, onResult)
    }

    pendingScans.current = 0

    const interval = setInterval(grab, 200)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      {/*<select onChange={(e) => setDeviceId(e.target.value)} value={deviceId || undefined}>*/}
      {/*  {devices.map((device) => <option value={device.deviceId} key={device.deviceId}>{device.label}</option>)}*/}
      {/*</select>*/}
      <div className="relative">
        <video playsInline ref={videoRef} />
        <span className="absolute right-0 top-0 bg-white font-semibold text-xs px-1 py-0.5">{ms.toFixed(1)} ms</span>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const onResult = async (result: string) => {
    console.log("onResult!")
    await router.push(`/product/ean/${result}`)
  }
  useEffect(() => {
    router.beforePopState((state) => {
      console.log("state", state)
      return true
    })
  }, [])
  return (
    <main>
      <Scanner onResult={onResult} />
    </main>
  )
}

export default Home
