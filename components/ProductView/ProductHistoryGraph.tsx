import { Chart, ChartData, ChartDataset, registerables } from "chart.js"
import { DateTime } from "luxon"
import React, { useMemo } from "react"
import { Line } from "react-chartjs-2"
import "chartjs-adapter-luxon"
import { getShopName } from "../../functions/shops"
import { PriceHistoryModel } from "../../models/Product"
import { BaseSkeleton } from "../Skeletons/BaseSkeleton"

Chart.register(...registerables)

const processDate = (date: string) => DateTime.fromISO(date).startOf("day").toJSDate()

const getColors = (shopType: string): [string, string, string] => {
  switch (shopType) {
    case "globus":
      return [
        "#ee7100",
        "rgb(253.22, 134.68, 55.92)",
        "rgb(247.61, 202.75, 178.08)",
      ]
    case "lenta":
      return [
        "#171c8f",
        "rgb(34.76, 50.77, 164.21)",
        "rgb(115.17, 145.76, 245.29)",
      ]
    case "auchan":
      return [
        "#e0021a",
        "rgb(251.6, 53.76, 53.08)",
        "rgb(254.99, 173.87, 164.21)",
      ]
    case "perekrestok":
      return ["#1EAF37", "#4ade80", "#bbf7d0"]
    default:
      return ["#6b7280", "#9ca3af", "#e5e7eb"]
  }
}

const mergePoints = (history: PriceHistoryModel): ChartData<"line"> => {
  // точки гарантированно отсортированы от новых к старым, но это тут не используется
  const xPoints = Array.from(
    new Set(history.shops.flatMap((shop) => shop.prices.map((v) => v.time))),
  ).sort()
  const maps = history.shops.map(
    (shop) => new Map(shop.prices.map((v) => [v.time, v])),
  )
  return {
    labels: xPoints.map(processDate),
    datasets: history.shops.flatMap(
      ({ shopType, prices }, i): ChartDataset<"line">[] => {
        // const spanGaps = 1000 * 60 * 60 * 24 * 7 // 1 week
        const spanGaps = true
        const c = getColors(shopType)
        return [
          {
            label: getShopName(shopType),
            borderColor: c[0],
            pointBorderColor: c[0],
            backgroundColor: c[0],
            data: xPoints.map((x) => maps[i].get(x)?.price ?? null),
            cubicInterpolationMode: "monotone",
            pointRadius: 1.4,
            pointBorderWidth: 0,
            hoverBorderWidth: 0,
            // @ts-ignore
            hoverRadius: 4,
            borderWidth: 3,
            spanGaps,
          },
          {
            label: `${getShopName(shopType)} (без скидки)`,
            // borderColor: colors.gray[300],
            // pointBorderColor: colors.gray[200],
            // backgroundColor: colors.gray[200],
            borderColor: c[2],
            pointBorderColor: c[2],
            backgroundColor: c[2],
            data: xPoints.map((x) => {
              const data = maps[i].get(x)
              if (!data) return null
              // if (data.basePrice === data.price) return null
              return data.basePrice
            }),
            cubicInterpolationMode: "monotone",
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [4, 2],
            spanGaps,
          },
        ]
      },
    ),
  }
}

export const ProductItemPriceHistorySkeleton: React.FC = () => {
  return <BaseSkeleton className={"mt-2 w-full h-[300px]"} />
}

export const ProductHistoryGraph: React.FC<{ history: PriceHistoryModel }> = ({
  history,
}) => {
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
