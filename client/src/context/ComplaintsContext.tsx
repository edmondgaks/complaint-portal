import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ComplaintType, ComplaintStatus, Department } from '../types/complaint';

interface ComplaintContextType {
  complaints: ComplaintType[];
  addComplaint: (complaint: Omit<ComplaintType, 'id' | 'createdAt' | 'status' | 'updates'>) => string;
  getComplaintById: (id: string) => ComplaintType | undefined;
  updateComplaintStatus: (id: string, status: ComplaintStatus, message: string) => void;
  addResponse: (id: string, message: string) => void;
  filterComplaints: (department?: Department, status?: ComplaintStatus, search?: string) => ComplaintType[];
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const STORAGE_KEY = 'civicvoice_complaints';

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<ComplaintType[]>(() => {
    const savedComplaints = localStorage.getItem(STORAGE_KEY);
    return savedComplaints ? JSON.parse(savedComplaints) : [];
  });

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaintData: Omit<ComplaintType, 'id' | 'createdAt' | 'status' | 'updates'>) => {
    const id = uuidv4();
    const newComplaint: ComplaintType = {
      id,
      ...complaintData,
      createdAt: new Date().toISOString(),
      status: 'Received',
      updates: [
        {
          date: new Date().toISOString(),
          status: 'Received',
          message: 'Your complaint has been received and is being reviewed.',
        },
      ],
    };

    setComplaints((prevComplaints) => [...prevComplaints, newComplaint]);
    return id;
  };

  const getComplaintById = (id: string) => {
    return complaints.find((complaint) => complaint.id === id);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, message: string) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) => {
        if (complaint.id === id) {
          const update = {
            date: new Date().toISOString(),
            status,
            message,
          };
          return {
            ...complaint,
            status,
            updates: [...complaint.updates, update],
          };
        }
        return complaint;
      })
    );
  };

  const addResponse = (id: string, message: string) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) => {
        if (complaint.id === id) {
          const update = {
            date: new Date().toISOString(),
            status: complaint.status,
            message,
          };
          return {
            ...complaint,
            updates: [...complaint.updates, update],
          };
        }
        return complaint;
      })
    );
  };

  const filterComplaints = (department?: Department, status?: ComplaintStatus, search?: string) => {
    return complaints.filter((complaint) => {
      const matchesDepartment = !department || complaint.department === department;
      const matchesStatus = !status || complaint.status === status;
      const matchesSearch = !search || 
        complaint.description.toLowerCase().includes(search.toLowerCase()) ||
        complaint.location.toLowerCase().includes(search.toLowerCase()) ||
        complaint.id.toLowerCase().includes(search.toLowerCase());
      
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        addComplaint,
        getComplaintById,
        updateComplaintStatus,
        addResponse,
        filterComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};