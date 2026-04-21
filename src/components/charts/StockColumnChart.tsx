import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Paper } from "@mui/material";
import type { StockHistoricalData } from "../../types/stock";

interface StockColumnChartProps {
  data: StockHistoricalData;
}

// Column chart showing daily gain/loss (close - open).
export default function StockColumnChart({ data }: StockColumnChartProps) {
  const options: Highcharts.Options = useMemo(() => {
    const gains = data.data.map((d) => ({
      y: parseFloat((d.close - d.open).toFixed(2)),
      color: d.close >= d.open ? "#00b894" : "#d63031",
    }));

    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        style: { fontFamily: "Inter, sans-serif" },
      },
      title: {
        text: `${data.ticker} — Daily Gain / Loss`,
        style: { fontSize: "14px", fontWeight: "600", color: "#1a1a2e" },
      },
      xAxis: {
        categories: data.data.map((d) => d.date),
        labels: { step: 15, rotation: -45, style: { fontSize: "11px" } },
      },
      yAxis: {
        title: { text: "Gain / Loss (USD)" },
        labels: {
          formatter: function () {
            return `$${this.value}`;
          },
        },
        // Draw a horizontal line at $0 for visual reference
        plotLines: [
          {
            value: 0,
            width: 1,
            color: "#999",
          },
        ],
      },
      series: [
        {
          type: "column",
          name: "Daily Change",
          data: gains,
          borderWidth: 0,
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
      tooltip: { valuePrefix: "$", valueDecimals: 2 },
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0.1,
        },
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
    };
  }, [data]);

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #e8e8e8" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Paper>
  );
}
