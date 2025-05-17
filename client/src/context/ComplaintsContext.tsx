import React, { createContext, useState, useContext, useEffect } from 'react';
import { Complaint, ComplaintsContextType } from '../types';
import { generateId } from '../utils/helpers';
import { useAuth } from './AuthContext';

// Create the complaints context
const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

// Initial mock data for demonstration
const initialComplaints: Complaint[] = [
  {
    id: 'c1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues and potential vehicle damage.',
    category: 'roads',
    location: '123 Main St, Downtown',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'citizen-1',
    assignedTo: 'staff-1',
    comments: [
      {
        id: 'comment-1',
        text: 'We have scheduled repairs for next week.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'staff-1',
        userName: 'Staff Roads',
        userRole: 'staff'
      }
    ]
  },
  {
    id: 'c2',
    title: 'Street light out',
    description: 'Street light at the corner of Oak and Pine has been out for a week.',
    category: 'electricity',
    location: 'Corner of Oak and Pine',
    status: 'new',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'citizen-1',
    comments: []
  },
  {
    id: 'c3',
    title: 'Trash not collected',
    description: 'Trash has not been collected for two weeks on Cedar Avenue.',
    category: 'sanitation',
    location: 'Cedar Avenue, Block 300-400',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'citizen-1',
    assignedTo: 'staff-2',
    comments: [
      {
        id: 'comment-2',
        text: 'Our team will collect the trash tomorrow.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'staff-2',
        userName: 'Staff Sanitation',
        userRole: 'staff'
      },
      {
        id: 'comment-3',
        text: 'The trash has been collected. Thank you for your patience.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'staff-2',
        userName: 'Staff Sanitation',
        userRole: 'staff'
      }
    ]
  }
];

export const ComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { user } = useAuth();

  // Load complaints from localStorage on initial render
  useEffect(() => {
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      setComplaints(initialComplaints);
      localStorage.setItem('complaints', JSON.stringify(initialComplaints));
    }
  }, []);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem('complaints', JSON.stringify(complaints));
    }
  }, [complaints]);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => {
    if (!user) return;
    
    const newComplaint: Complaint = {
      ...complaintData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'new',
      userId: user.id,
      comments: []
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
  };
  
  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              status, 
              updatedAt: new Date().toISOString() 
            } 
          : complaint
      )
    );
  };
  
  const addComment = (complaintId: string, text: string) => {
    if (!user) return;
    
    const newComment = {
      id: generateId(),
      text,
      createdAt: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role
    };
    
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              comments: [...complaint.comments, newComment],
              updatedAt: new Date().toISOString()
            } 
          : complaint
      )
    );
  };
  
  const getComplaint = (id: string) => {
    return complaints.find(complaint => complaint.id === id);
  };
  
  const assignComplaint = (complaintId: string, staffId: string) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              assignedTo: staffId,
              status: complaint.status === 'new' ? 'in_progress' : complaint.status,
              updatedAt: new Date().toISOString() 
            } 
          : complaint
      )
    );
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        updateComplaintStatus,
        addComment,
        getComplaint,
        assignComplaint
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = (): ComplaintsContextType => {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
};