export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'staff';
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketId: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  status: 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  media?: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  responses: Response[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
  userRole: 'citizen' | 'admin' | 'staff';
}


export interface Response {
  respondent: {
    id: string;
    name: string;
    role: string;
  };
  message: string;
  timestamp: string;
}

export type Category = 
  | 'roads'
  | 'water'
  | 'electricity'
  | 'waste'
  | 'water'
  | 'public_safety'
  | 'environment'
  | 'public_property'
  | 'others';

export interface ComplaintsContextType {
  complaints: Complaint[];
  userComplaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  addComplaint: (data: FormData) => Promise<Complaint>;
  getComplaint: (id: string) => Promise<Complaint>;
  getUserComplaints: () => Promise<void>;
  updateStatus: (id: string, status: Complaint['status']) => Promise<void>;
  addResponse: (id: string, message: string) => Promise<void>;
  fetchComplaints: (filters?: ComplaintFilters) => Promise<void>;
}

export interface ComplaintFilters {
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}