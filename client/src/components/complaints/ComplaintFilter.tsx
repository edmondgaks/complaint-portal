import React from 'react';
import { Category, Complaint } from '../../types';
import { getCategoryLabel } from '../../utils/helpers';
import Button from '../ui/Button';
import { FilterX } from 'lucide-react';

interface ComplaintFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
}

const ComplaintFilter: React.FC<ComplaintFilterProps> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  searchTerm,
  setSearchTerm,
  resetFilters
}) => {
  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];
  
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'roads', label: getCategoryLabel('roads') },
    { value: 'sanitation', label: getCategoryLabel('sanitation') },
    { value: 'electricity', label: getCategoryLabel('electricity') },
    { value: 'water', label: getCategoryLabel('water') },
    { value: 'public_transport', label: getCategoryLabel('public_transport') },
    { value: 'parks', label: getCategoryLabel('parks') },
    { value: 'other', label: getCategoryLabel('other') }
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700 mb-3 sm:mb-0">Filters</h3>
        
        {/* Reset filters button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          icon={<FilterX size={16} />}
          className="self-start sm:self-auto"
        >
          Reset Filters
        </Button>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Status select */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Category select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFilter;