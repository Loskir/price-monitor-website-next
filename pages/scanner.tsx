import { type ZBarSymbol } from "@undecaf/zbar-wasm"
const { scanImageData } = require("@undecaf/zbar-wasm")
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"

const useFps = () => {
  const [fps, setFps] = useState(0)
  const len = 10
  const [fpsArray] = useState(Array.from({ length: len }, () => 0))
  const reportFps = (ms: number) => {
    fpsArray.shift()
    fpsArray.push(ms)
    const sum = fpsArray.reduce((a, v) => a + v, 0)
    setFps(1000 / (sum / len))
  }
  return {
    fps,
    reportFps,
  }
}

const Scanner: React.FC<{ onResult: (result: string) => unknown }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { fps, reportFps } = useFps()
  // const reader = useMemo(() => {
  //   const reader = new BrowserMultiFormatReader()
  //
  //   const hints = new Map()
  //   const formats = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]
  //   hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
  //   reader.hints = hints
  //
  //   return reader
  // }, [])

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    navigator?.mediaDevices?.getUserMedia({
      video: {
        facingMode: "environment",
        width: 1920,
      },
    })
      .then((res) => {
        if (videoRef.current) {
          videoRef.current.srcObject = res
          videoRef.current.play().catch((error) => {
            console.warn("unable to play video", error)
          })
        }
      })

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
  }, [videoRef])

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

  const grab = async () => {
    let s = Date.now()
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    if (video.videoWidth === 0 || video.videoHeight === 0) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const res: ZBarSymbol[] = await scanImageData(data)
    // console.log(Date.now() - s)
    reportFps(Date.now() - s)
    // console.log(res)
    const z = res.find((v) => v.typeName === "ZBAR_EAN13")
    if (z) {
      return onResult(Array.from(z.data).map((v) => String.fromCharCode(v)).join(""))
    }
    // for (const code of res) {
    //   if (code.points.length > 0) {
    //     ctx.strokeStyle = "green"
    //     ctx.lineWidth = 2
    //     ctx.moveTo(code.points[0].x, code.points[0].y)
    //     for (let i = 1; i < code.points.length; ++i) {
    //       ctx.lineTo(code.points[i].x, code.points[i].y)
    //     }
    //     ctx.stroke()
    //   }
    // }
    // reader.decodeFromVideoDevice()
  }

  useEffect(() => {
    let stopped = false
    const loop = async () => {
      if (stopped) {
        return
      }
      await grab()
      requestAnimationFrame(loop)
    }

    loop()

    return () => {
      stopped = true
    }
  }, [])

  return (
    <div>
      {/*<select onChange={(e) => setDeviceId(e.target.value)} value={deviceId || undefined}>*/}
      {/*  {devices.map((device) => <option value={device.deviceId} key={device.deviceId}>{device.label}</option>)}*/}
      {/*</select>*/}
      <div className="relative">
        <video playsInline ref={videoRef} />
        <span className="absolute right-0 top-0 bg-white font-semibold text-xs">{fps.toFixed(2)} FPS</span>
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
