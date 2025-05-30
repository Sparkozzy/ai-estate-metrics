
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
  start: string;
  end: string;
}

interface DateFilterProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateRange, setDateRange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, start: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, end: e.target.value });
  };

  const clearFilter = () => {
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={handleStartDateChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-400 text-sm">até</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={handleEndDateChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {(dateRange.start || dateRange.end) && (
        <button
          onClick={clearFilter}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Limpar
        </button>
      )}
    </div>
  );
};

export default DateFilter;
