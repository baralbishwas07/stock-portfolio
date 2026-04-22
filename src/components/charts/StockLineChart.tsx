import { useMemo } from "react";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { Paper } from "@mui/material";
import type { StockHistoricalData } from "../../types/stock";

interface StockLineChartProps {
  data: StockHistoricalData;
}

export default function StockLineChart({ data }: StockLineChartProps) {
  // useMemo prevents Highcharts from re-rendering on every parent render.
  // Only recalculates when `data` actually changes.
  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "line",
        backgroundColor: "transparent",
        style: { fontFamily: "Inter, sans-serif" },
        marginRight: 20,
      },
      title: {
        text: `${data.companyName} (${data.ticker}) — Price Trend`,
        style: { fontSize: "14px", fontWeight: "600", color: "#1a1a2e" },
      },
      xAxis: {
        categories: data.data.map((d) => d.date),
        // Show every 15th label
        labels: {
          step: 15,
          rotation: -45,
          align: "right",
          y: 25,
          x: -5,
          style: { fontSize: "11px" },
        },
        tickmarkPlacement: "on",
      },
      yAxis: {
        title: { text: "Price (USD)" },
        labels: {
          formatter: function () {
            return `$${this.value}`;
          },
        },
      },
      series: [
        {
          type: "line",
          name: "Close Price",
          data: data.data.map((d) => d.close),
          color: "#1a1a2e",
          marker: { enabled: false },
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
      tooltip: {
        valuePrefix: "$",
        valueDecimals: 2,
      },
      responsive: {
        rules: [
          {
            condition: { maxWidth: 500 },
            chartOptions: {
              title: { style: { fontSize: "12px" } },
            },
          },
        ],
      },
    }),
    [data],
  );

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #e8e8e8" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Paper>
  );
}
