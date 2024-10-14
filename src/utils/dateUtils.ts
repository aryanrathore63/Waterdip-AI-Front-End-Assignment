export const getMonthIndex = (month: string): number => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(month);
  };
  
  export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  export const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };