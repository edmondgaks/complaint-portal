import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Complaint } from '../../types';
import { useComplaints } from '../../context/ComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import ComplaintFilter from '../complaints/ComplaintFilter';
import ComplaintCard from '../complaints/ComplaintCard';
import { filterComplaints } from '../../utils/helpers';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
    <div className="p-5 flex items-center">
      <div className="flex-shrink-0">
        <div className={`text-${color.replace('border-', '')} opacity-80`}>
          {icon}
        </div>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd>
            <div className="text-lg font-bold text-gray-900">{value}</div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { complaints } = useComplaints();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  
  // Filter staff complaints by their department if they are staff
  useEffect(() => {
    let results = complaints;
    
    // If user is staff (not admin), only show complaints for their department
    if (user?.role === 'staff' && user?.department) {
      results = complaints.filter(c => c.category === user.department);
    }
    
    // Apply filters
    results = filterComplaints(results, {
      status: statusFilter as Complaint['status'],
      category: categoryFilter as Category,
      searchTerm
    });
    
    setFilteredComplaints(results);
  }, [complaints, statusFilter, categoryFilter, searchTerm, user]);
  
  // Redirect if not authenticated or not admin/staff
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login', { state: { from: '/admin' } });
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Compute stats
  const totalComplaints = filteredComplaints.length;
  const newComplaints = filteredComplaints.filter(c => c.status === 'new').length;
  const inProgressComplaints = filteredComplaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'resolved').length;
  
  const resetFilters = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setSearchTerm('');
  };
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Complaints" 
          value={totalComplaints} 
          icon={<FileText size={24} />}
          color="border-blue-500"
        />
        <StatCard 
          title="New" 
          value={newComplaints} 
          icon={<AlertTriangle size={24} />}
          color="border-yellow-500"
        />
        <StatCard 
          title="In Progress" 
          value={inProgressComplaints} 
          icon={<Clock size={24} />}
          color="border-orange-500"
        />
        <StatCard 
          title="Resolved" 
          value={resolvedComplaints} 
          icon={<CheckCircle size={24} />}
          color="border-green-500"
        />
      </div>
      
      {/* Filters */}
      <ComplaintFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />
      
      {/* Complaints List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Complaints {filteredComplaints.length > 0 && `(${filteredComplaints.length})`}
        </h2>
        
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No complaints found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;