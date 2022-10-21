import { Chart, ChartData, registerables } from "chart.js"
import { DateTime } from "luxon"
import React, { useMemo } from "react"
import { Line } from "react-chartjs-2"
import colors from "tailwindcss/colors"
import "chartjs-adapter-luxon"
import { PriceHistoryModel, ShopType } from "../../models/Product"
import { getShopName } from "../shops"

const processDate = (date: string) => DateTime.fromISO(date).startOf("day").toJSDate()

const getColors = (shopType: string): [string, string] => {
  switch (shopType) {
    case "globus":
      return ["#ee7100", "rgb(253.22, 134.68, 55.92)"]
    case "lenta":
      return ["#171c8f", "rgb(34.76, 50.77, 164.21)"]
    case "auchan":
      return ["#e0021a", "rgb(251.6, 53.76, 53.08)"]
    default:
      return [colors.green[500], colors.green[400]]
  }
}

const mergePoints = (history: PriceHistoryModel): ChartData<"line"> => {
  // точки гарантированно отсортированы от новых к старым, но это тут не используется
  const xPoints = Array.from(new Set(history.shops.flatMap((shop) => shop.prices.map((v) => v.time))))
    .sort()
  const maps = history.shops.map((shop) => new Map(shop.prices.map((v) => [v.time, v])))
  return {
    labels: xPoints.map(processDate),
    datasets: history.shops.flatMap(({ shopType, prices }, i) => {
      const c = getColors(shopType)
      return [{
        label: getShopName(shopType),
        borderColor: c[0],
        pointBorderColor: c[1],
        backgroundColor: c[1],
        data: xPoints.map((x) => maps[i].get(x)?.price ?? null),
        cubicInterpolationMode: "monotone",
        pointRadius: 1,
      }, {
        label: `${getShopName(shopType)} (без скидки)`,
        borderColor: colors.gray[300],
        pointBorderColor: colors.gray[200],
        backgroundColor: colors.gray[200],
        data: xPoints.map((x) => {
          const data = maps[i].get(x)
          if (!data) return null
          if (data.basePrice === data.price) return null
          return data.basePrice
        }),
        cubicInterpolationMode: "monotone",
        pointRadius: 1,
      }]
    }),
  }
}

export const ProductHistoryGraph: React.FC<{ history: PriceHistoryModel }> = ({ history }) => {
  Chart.register(...registerables)
  const chartData = useMemo(() => {
    return mergePoints(history)
  }, [history])
  return (
    <Line
      data={chartData}
      options={{
        scales: {
          x: {
            type: "time",
            suggestedMax: DateTime.now().startOf("day").toString(),
            time: {
              unit: "day",
            },
          },
          y: {
            suggestedMin: 0,
            ticks: {
              callback: (v: any) => `${v}₽`,
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          tooltip: {
            position: "nearest",
            callbacks: {
              title: (ctx) => {
                const date = DateTime.fromMillis(ctx[0].parsed.x).setLocale("ru")
                if (date.year === DateTime.now().year) {
                  return date.toFormat("d MMMM")
                }
                return date.toFormat("d MMMM yyyy")
              },
            },
            itemSort: (a, b) => Number(b.raw) - Number(a.raw),
          },
        },
      }}
      height={220}
    />
  )
}
