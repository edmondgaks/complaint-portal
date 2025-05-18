export type Category = 
  | 'roads'
  | 'sanitation'
  | 'electricity'
  | 'water'
  | 'waste'
  | 'public_transport'
  | 'parks'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'staff';
  department?: Category;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  images?: string[];
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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
export interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  addComment: (complaintId: string, text: string) => void;
  getComplaint: (id: string) => Complaint | undefined;
  assignComplaint: (complaintId: string, staffId: string) => void;
}