import axios from 'axios';
import { useEffect, useState } from 'react';
import { BookingData } from '../types';

export const useBookingData = (startDate: Date, endDate: Date) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<BookingData[]>('/api/bookings', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch booking data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return { bookings, loading, error };
};