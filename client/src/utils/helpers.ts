import { Category, Complaint } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString();
};

export const getCategoryIcon = (category: Category): string => {
  switch (category) {
    case 'roads': return 'road';
    case 'sanitation': return 'trash-2';
    case 'electricity': return 'zap';
    case 'water': return 'droplet';
    case 'public_transport': return 'bus';
    case 'parks': return 'tree';
    case 'other': return 'help-circle';
    default: return 'help-circle';
  }
};

export const getCategoryLabel = (category: Category): string => {
  switch (category) {
    case 'roads': return 'Roads & Infrastructure';
    case 'sanitation': return 'Sanitation & Waste';
    case 'electricity': return 'Electricity';
    case 'water': return 'Water Supply';
    case 'public_transport': return 'Public Transport';
    case 'parks': return 'Parks & Recreation';
    case 'other': return 'Other';
    default: return 'Other';
  }
};

export const getStatusColor = (status: Complaint['status']): string => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority: Complaint['priority']): string => {
  switch (priority) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const filterComplaints = (
  complaints: Complaint[],
  filters: {
    status?: Complaint['status'],
    category?: Category,
    priority?: Complaint['priority'],
    searchTerm?: string
  }
): Complaint[] => {
  return complaints.filter(complaint => {
    let matches = true;
    
    if (filters.status && complaint.status !== filters.status) {
      matches = false;
    }
    
    if (filters.category && complaint.category !== filters.category) {
      matches = false;
    }
    
    if (filters.priority && complaint.priority !== filters.priority) {
      matches = false;
    }
    
    if (filters.searchTerm && !complaint.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !complaint.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      matches = false;
    }
    
    return matches;
  });
};
