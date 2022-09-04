import { Chart, ChartData, registerables } from "chart.js"
import React, { useMemo } from "react"
import { Line } from "react-chartjs-2"
import colors from "tailwindcss/colors"
import { ProductPriceModel } from "../../models/Product"
import "chartjs-adapter-luxon"

const priceColor = colors.green[500]
const basePriceColor = colors.gray[300]

export const ProductHistoryGraph: React.FC<{ history: ProductPriceModel[] }> = (props) => {
  Chart.register(...registerables)
  const chartData = useMemo((): ChartData<"line"> => {
    const labels = props.history.map((v) => new Date(v.time))
    const data = props.history.map((v) => v.price)
    return {
      labels,
      datasets: [{
        label: "Цена",
        borderColor: priceColor,
        pointBorderColor: priceColor,
        backgroundColor: priceColor,
        data,
        cubicInterpolationMode: "monotone",
      }, {
        label: "Цена без скидки",
        borderColor: basePriceColor,
        pointBorderColor: basePriceColor,
        backgroundColor: basePriceColor,
        data: props.history.map((v) => v.basePrice),
        cubicInterpolationMode: "monotone",
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
      }}
      height={220}
    />
  )
}
