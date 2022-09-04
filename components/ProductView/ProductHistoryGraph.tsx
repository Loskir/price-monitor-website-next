import { Chart, ChartData, registerables } from "chart.js"
import React, { useMemo } from "react"
import { Line } from "react-chartjs-2"
import colors from "tailwindcss/colors"
import { ProductPriceModel } from "../../models/Product"
import "chartjs-adapter-luxon"
import { DateTime } from "luxon"

export const ProductHistoryGraph: React.FC<{ history: ProductPriceModel[] }> = (props) => {
  Chart.register(...registerables)
  const chartData = useMemo((): ChartData<"line"> => {
    const labels = props.history.map((v) => DateTime.fromISO(v.time).startOf("day").toJSDate())
    const data = props.history.map((v) => v.price)
    const dataBasePrice = props.history.map((v) => v.basePrice)
    return {
      labels,
      datasets: [{
        label: "Цена",
        borderColor: colors.green[500],
        pointBorderColor: colors.green[400],
        backgroundColor: colors.green[400],
        data,
        cubicInterpolationMode: "monotone",
        pointRadius: 1,
      }, {
        label: "Цена без скидки",
        borderColor: colors.gray[300],
        pointBorderColor: colors.gray[200],
        backgroundColor: colors.gray[200],
        data: dataBasePrice,
        cubicInterpolationMode: "monotone",
        pointRadius: 1,
      }],
    }
  }, [props.history])
  return (
    <Line
      data={chartData}
      options={{
        scales: {
          x: {
            type: "time",
            suggestedMax: Date.now(),
          },
          y: {
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
          },
        },
      }}
      height={220}
    />
  )
}
