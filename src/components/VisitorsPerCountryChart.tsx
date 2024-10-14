// src/components/VisitorsPerCountryChart.tsx
import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface VisitorsPerCountryChartProps {
  data: { country: string; totalVisitors: number }[];
}

const VisitorsPerCountryChart: React.FC<VisitorsPerCountryChartProps> = ({ data }) => {
  const chartData: {
    options: ApexOptions;
    series: { name: string; data: number[] }[];
  } = {
    series: [
      {
        name: 'Visitors',
        data: data.map((item) => item.totalVisitors),
      },
    ],
    options: {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // This works fine for the bar chart
          },
        },
      },
      xaxis: {
        categories: data.map((item) => item.country),
        title: {
          text: 'Country',
        },
      },
      yaxis: {
        title: {
          text: 'Number of Visitors',
        },
      },
      title: {
        text: 'Number of Visitors per Country',
        align: 'left',
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
        offsetY: -20,
      },
    },
  };

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default VisitorsPerCountryChart;
