import { BookingData, ChartData, CountryData, SparklineData } from '../types';
import { getMonthIndex } from './dateUtils';

export const getTimeSeriesData = (bookings: BookingData[]): ChartData[] => {
  const data: { [key: string]: number } = {};

  bookings.forEach(booking => {
    const date = new Date(booking.arrival_date_year, getMonthIndex(booking.arrival_date_month), booking.arrival_date_day_of_month);
    const dateString = date.toISOString().split('T')[0];
    const totalVisitors = booking.adults + booking.children + booking.babies;

    if (data[dateString]) {
      data[dateString] += totalVisitors;
    } else {
      data[dateString] = totalVisitors;
    }
  });

  return Object.entries(data)
    .map(([date, count]) => ({ x: date, y: count }))
    .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};

export const getCountryData = (bookings: BookingData[]): CountryData => {
  const countryData: { [key: string]: number } = {};

  bookings.forEach(booking => {
    const totalVisitors = booking.adults + booking.children + booking.babies;
    countryData[booking.country] = (countryData[booking.country] || 0) + totalVisitors;
  });

  const sortedData = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    countries: sortedData.map(([country]) => country),
    counts: sortedData.map(([, count]) => count),
  };
};

export const getSparklineData = (bookings: BookingData[], type: 'adults' | 'children'): SparklineData => {
  const total = bookings.reduce((sum, booking) => sum + booking[type], 0);
  const data = bookings.map(booking => booking[type]);

  return { total, data };
};