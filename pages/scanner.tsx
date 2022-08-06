import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, Result } from "@zxing/library"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useRef } from "react"

const Scanner: React.FC<{ onResult: (result: Result) => unknown }> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reader = useMemo(() => new BrowserMultiFormatReader(), [])

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    const hints = new Map()
    const formats = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)

    reader.hints = hints

    reader.decodeFromConstraints(
      { video: { facingMode: "environment" } },
      videoRef.current,
      (result, error) => {
        if (!result) {
          return
        }
        return onResult(result)
      },
    )

    return () => reader.reset()
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

  return (
    <div>
      {/*<select onChange={(e) => setDeviceId(e.target.value)} value={deviceId || undefined}>*/}
      {/*  {devices.map((device) => <option value={device.deviceId} key={device.deviceId}>{device.label}</option>)}*/}
      {/*</select>*/}
      <video ref={videoRef} id="video" />
    </div>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const onResult = (result: Result) => {
    if (result.getBarcodeFormat() !== BarcodeFormat.EAN_13 && result.getBarcodeFormat() !== BarcodeFormat.EAN_8) {
      return
    }
    console.log(result)
    return router.push(`/product/ean/${result.getText()}`)
  }
  return (
    <main>
      <Scanner onResult={onResult} />
    </main>
  )
}

export default Home
