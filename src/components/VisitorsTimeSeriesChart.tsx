import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface VisitorsTimeSeriesChartProps {
    data: { date: string; totalVisitors: number }[];
  }
  
  const VisitorsTimeSeriesChart: React.FC<VisitorsTimeSeriesChartProps> = ({ data }) => {
    const chartData: {
      options: ApexOptions;
      series: { name: string; data: number[] }[];
    } = {
      series: [
        {
          name: 'Total Visitors',
          data: data.map((item) => item.totalVisitors),
        },
      ],
      options: {
        chart: {
          type: 'line',
          zoom: {
            enabled: true,
          },
        },
        xaxis: {
          categories: data.map((item) => item.date),
        },
        yaxis: {
          title: {
            text: 'Number of Visitors',
          },
        },
        title: {
          text: 'Number of Visitors per Day',
          align: 'left',
        },
      },
    };
  
    return (
      <div>
        <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
      </div>
    );
  };
  
  export default VisitorsTimeSeriesChart;
  