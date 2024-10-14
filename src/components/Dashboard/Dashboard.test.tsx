import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { useBookingData } from '../../hooks/useBookingData';
import { Dashboard } from './Dashboard';

jest.mock('../../hooks/useBookingData');

const mockUseBookingData = useBookingData as jest.MockedFunction<typeof useBookingData>;

describe('Dashboard', () => {
  beforeEach(() => {
    mockUseBookingData.mockReturnValue({
      bookings: [],
      loading: false,
      error: null,
    });
  });

  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Hotel Booking Dashboard')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockUseBookingData.mockReturnValue({
      bookings: [],
      loading: true,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseBookingData.mockReturnValue({
      bookings: [],
      loading: false,
      error: 'Failed to fetch booking data',
    });
    render(<Dashboard />);
    expect(screen.getByText('Failed to fetch booking data')).toBeInTheDocument();
  });

  it('renders all chart titles when data is loaded', async () => {
    mockUseBookingData.mockReturnValue({
        bookings: [{
          arrival_date_year: 2022,
          arrival_date_month: 'January',
          arrival_date_day_of_month: 1,
          adults: 2,
          children: 1,
          babies: 0,
          country: 'USA',
        }],
        loading: false,
        error: null,
      });
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Number of Visitors per Day')).toBeInTheDocument();
      expect(screen.getByText('Number of Visitors per Country')).toBeInTheDocument();
      expect(screen.getByText('Total Adult Visitors')).toBeInTheDocument();
      expect(screen.getByText('Total Children Visitors')).toBeInTheDocument();
    });
  });
});