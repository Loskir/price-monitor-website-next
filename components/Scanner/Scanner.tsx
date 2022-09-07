import { ZBarSymbol } from "@undecaf/zbar-wasm"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { CenteredOverlay } from "../CenteredOverlay"

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

type OnResultFn = (result: string) => unknown

const handleScanResult = (result: ZBarSymbol[], onResult: OnResultFn) => {
  const z = result.find((v) => ["ZBAR_EAN13", "ZBAR_EAN8"].includes(v.typeName))
  if (z) {
    return onResult(Array.from(z.data).map((v) => String.fromCharCode(v)).join(""))
  }
}

const useWorker = (onScan: (data: ZBarSymbol[]) => any) => {
  const worker = useRef<Worker | null>(null)
  const [workerReady, setWorkerReady] = useState(false)
  const [workerError, setWorkerError] = useState("")

  useEffect(() => {
    const w = new Worker(new URL("./scanner.worker.ts", import.meta.url))
    worker.current = w
    w.addEventListener("message", (event) => {
      if (event.data.type === "ready") {
        setWorkerReady(true)
      } else if (event.data.type === "scan") {
        onScan(event.data.result)
      }
    })
    w.addEventListener("error", (event) => {
      setWorkerError(event.message)
    })
    return () => {
      worker.current?.terminate()
    }
  }, [onScan])

  return {
    worker,
    workerReady,
    workerError,
  }
}

export const Scanner: React.FC<{ onResult: OnResultFn }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoStream = useRef<MediaStream | null>(null)
  const pendingScans = useRef(0)
  const dateStart = useRef(0)

  const [videoReady, setVideoReady] = useState(false)

  const [dimensions, setDimensions] = useState<[number, number]>([0, 0])

  const [status, setStatus] = useState("Loading...")

  const { ms, reportMs } = useFps()

  const onScanCallback = useCallback((result: ZBarSymbol[]) => {
    pendingScans.current--
    handleScanResult(result, onResult)
    reportMs(Date.now() - dateStart.current)
  }, [onResult, reportMs])

  const {
    worker,
    workerReady,
    workerError,
  } = useWorker(onScanCallback)

  useEffect(() => {
    if (!videoReady || !workerReady) return
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current

    const grab = () => {
      if (pendingScans.current < 1) {
        dateStart.current = Date.now()
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        worker.current?.postMessage({ type: "scan", data })
        pendingScans.current++
      }
    }

    pendingScans.current = 0
    grab()
    const interval = setInterval(grab, 200)

    return () => {
      clearInterval(interval)
    }
  }, [worker, videoReady, workerReady])

  useEffect(() => {
    void (async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setStatus("Your device does not support camera")
      }

      setStatus("Setting up camera...")

      let cameraRes: MediaStream
      try {
        cameraRes = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: 1920,
          },
        })
      } catch (error) {
        console.error(error)
        if (error instanceof DOMException) {
          if (error.name === "NotAllowedError") {
            return setStatus("Camera access denied")
          }
        }
        setStatus("Failed to access camera")
        return
      }

      videoStream.current = cameraRes

      const video = videoRef.current
      if (!video) return

      setStatus("Setting up video...")

      video.srcObject = cameraRes
      video.play()
        .then(() => {
          setDimensions([video.videoWidth, video.videoHeight])
          const canvas = canvasRef.current
          if (canvas) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
          }

          setStatus("Running...")
          setVideoReady(true)
        })
        .catch((error) => {
          console.warn("unable to play video", error)
        })
    })()

    return () => {
      console.log("Clearing up...")
      videoStream.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return (
    <div>
      {!videoReady && <CenteredOverlay>{status}</CenteredOverlay>}
      <div className="relative" style={{ display: videoReady ? undefined : "none" }}>
        <video playsInline ref={videoRef} />
        <span className="absolute right-0 top-0 font-semibold text-xs text-right flex flex-col items-end">
          <span className="bg-white px-1 py-0.5">{dimensions[0]}×{dimensions[1]}</span>
          <span className="bg-white px-1 py-0.5">
            {workerError
              ? `Worker error: ${workerError}`
              : (workerReady ? `${ms.toFixed(1)} ms` : "Worker not ready")}
          </span>
        </span>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  )
}
