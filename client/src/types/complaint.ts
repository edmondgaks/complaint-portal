export type ComplaintStatus = 'Received' | 'In Progress' | 'Under Review' | 'Resolved' | 'Closed';

export type Department = 'Roads' | 'Water' | 'Electricity' | 'Sanitation' | 'Parks' | 'Public Safety' | 'Other';

export interface StatusUpdate {
  date: string;
  status: ComplaintStatus;
  message: string;
}

export interface ComplaintType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  department: Department;
  location: string;
  description: string;
  imageUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
  status: ComplaintStatus;
  updates: StatusUpdate[];
}