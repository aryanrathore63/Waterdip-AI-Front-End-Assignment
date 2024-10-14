import React, { useState, useCallback, ErrorInfo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import styles from './Dashboard.module.css';
import { DateRangePicker } from '../DateRangePicker/DateRangePicker';
import { useBookingData } from '../../hooks/useBookingData';
import { getTimeSeriesData, getCountryData, getSparklineData as getSparklingData } from '../../utils/chartUtils';
import { formatDate } from '../../utils/dateUtils';

// src/components/Dashboard.tsx
import VisitorsTimeSeriesChart from '../VisitorsTimeSeriesChart';
import VisitorsPerCountryChart from '../VisitorsPerCountryChart';

// Sample Data
const timeSeriesData = [
  { date: '2015-07-01', totalVisitors: 63 },
  { date: '2015-07-02', totalVisitors: 72 },
  { date: '2015-07-03', totalVisitors: 77 },
  { date: '2015-07-04', totalVisitors: 72 },
  { date: '2015-07-05', totalVisitors: 63 },
  // Add more data as needed
];

const countryData = [
  { country: 'ALB', totalVisitors: 2 },
  { country: 'ARG', totalVisitors: 5 },
  { country: 'AUS', totalVisitors: 4 },
  { country: 'BEL', totalVisitors: 10 },
  { country: 'BRA', totalVisitors: 9 },
  // Add more data as needed
];

const DashboardComponent: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <div>
        <h2>Visitors Time Series</h2>
        <VisitorsTimeSeriesChart data={timeSeriesData} />
      </div>
      
      <div>
        <h2>Visitors Per Country</h2>
        <VisitorsPerCountryChart data={countryData} />
      </div>
    </div>
  );
};

export default DashboardComponent;

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page and try again.</h1>;
    }

    return this.props.children;
  }
}

export const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date('2015-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2015-12-31'));
  const { bookings, loading, error } = useBookingData(startDate, endDate);

  const handleStartDateChange = useCallback((date: Date) => {
    setStartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: Date) => {
    setEndDate(date);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const timeSeriesData = getTimeSeriesData(bookings);
  const countryData = getCountryData(bookings);
  const adultSparklineData = getSparklingData(bookings, 'adults');
  const childrenSparklineData = getSparklingData(bookings, 'children');

  const timeSeriesOptions: ApexOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: { text: 'Number of Visitors' },
    },
  };

  const columnChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: { horizontal: false },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: countryData.countries,
      title: { text: 'Country' },
    },
    yaxis: {
      title: { text: 'Number of Visitors' },
    },
  };

  const sparklineOptions: ApexOptions = {
    chart: {
      type: 'line',
      sparkline: { enabled: true },
    },
    stroke: { curve: 'straight' },
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: {
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  };

  return (
    <ErrorBoundary>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Hotel Booking Dashboard</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <div className={styles.dateRange}>
          Showing data from {formatDate(startDate)} to {formatDate(endDate)}
        </div>
        <div className={styles.charts}>
          <div className={styles.chart}>
            <h2>Number of Visitors per Day</h2>
            <Chart
              options={timeSeriesOptions}
              series={[{ name: 'Visitors', data: timeSeriesData }]}
              type="line"
              height={300}
            />
          </div>
          <div className={styles.chart}>
            <h2>Top 10 Countries by Visitors</h2>
            <Chart
              options={columnChartOptions}
              series={[{ name: 'Visitors', data: countryData.counts }]}
              type="bar"
              height={300}
            />
          </div>
          <div className={styles.sparklineContainer}>
            <div className={styles.sparkline}>
              <h3>Total Adult Visitors</h3>
              <div className={styles.sparklineValue}>{adultSparklineData.total}</div>
              <Chart
                options={sparklineOptions}
                series={[{ data: adultSparklineData.data }]}
                type="line"
                height={50}
                width={200}
              />
            </div>
            <div className={styles.sparkline}>
              <h3>Total Children Visitors</h3>
              <div className={styles.sparklineValue}>{childrenSparklineData.total}</div>
              <Chart
                options={sparklineOptions}
                series={[{ data: childrenSparklineData.data }]}
                type="line"
                height={50}
                width={200}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};