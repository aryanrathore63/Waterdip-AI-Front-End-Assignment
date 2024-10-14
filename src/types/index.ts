export interface BookingData {
    arrival_date_year: number;
    arrival_date_month: string;
    arrival_date_day_of_month: number;
    adults: number;
    children: number;
    babies: number;
    country: string;
  }
  
  export interface ChartData {
    x: Date | string;
    y: number;
  }
  
  export interface CountryData {
    countries: string[];
    counts: number[];
  }
  
  export interface SparklineData {
    total: number;
    data: number[];
  }