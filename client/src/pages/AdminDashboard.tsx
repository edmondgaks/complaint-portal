import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListFilter, 
  Search, 
  User, 
  LogOut, 
  BarChart,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { ComplaintStatus, Department } from '../types/complaint';
import ComplaintList from '../components/admin/ComplaintList';
import ComplaintDetail from '../components/admin/ComplaintDetail';
import AdminAnalytics from '../components/admin/AdminAnalytics';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { complaints, filterComplaints } = useComplaints();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const filteredComplaints = filterComplaints(
    selectedDepartment as Department || undefined,
    selectedStatus as ComplaintStatus || undefined,
    searchQuery
  );

  // Filter complaints based on the user's department if they are not an admin
  const userComplaints = user?.role === 'admin' 
    ? filteredComplaints 
    : filteredComplaints.filter(c => c.department === user?.department);

  const pendingCount = complaints.filter(c => 
    c.status !== 'Resolved' && c.status !== 'Closed' && 
    (user?.role === 'admin' || c.department === user?.department)
  ).length;

  const resolvedCount = complaints.filter(c => 
    (c.status === 'Resolved' || c.status === 'Closed') && 
    (user?.role === 'admin' || c.department === user?.department)
  ).length;

  const departmentOptions: Department[] = [
    'Roads',
    'Water',
    'Electricity',
    'Sanitation',
    'Parks',
    'Public Safety',
    'Other'
  ];

  const statusOptions: ComplaintStatus[] = [
    'Received',
    'In Progress',
    'Under Review',
    'Resolved',
    'Closed'
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.department}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/dashboard')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/admin/dashboard/analytics"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/dashboard/analytics')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart className="mr-3 h-5 w-5" />
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Statistics
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4 text-center">
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-lg font-bold text-yellow-700">{pendingCount}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-lg font-bold text-green-700">{resolvedCount}</p>
                  <p className="text-xs text-green-600">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {isActive('/admin/dashboard/analytics') ? 'Analytics Dashboard' : 'Complaint Management'}
              </h1>
              
              {!isActive('/admin/dashboard/analytics') && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search complaints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="relative">
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center text-sm hover:bg-gray-200"
                    >
                      <ListFilter className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isActive('/admin/dashboard/analytics') && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value as Department | '')}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    disabled={user?.role !== 'admin'}
                  >
                    <option value="">All Departments</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus | '')}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {pendingCount > 0 && !isActive('/admin/dashboard/analytics') && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    You have {pendingCount} pending complaint{pendingCount !== 1 ? 's' : ''} that need{pendingCount === 1 ? 's' : ''} attention.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {userComplaints.length === 0 && !isActive('/admin/dashboard/analytics') && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedDepartment || selectedStatus
                  ? 'Try adjusting your filters to find what you\'re looking for.'
                  : 'There are no complaints in the system yet.'}
              </p>
            </div>
          )}

          <Routes>
            <Route path="/" element={<ComplaintList complaints={userComplaints} />} />
            <Route path="/complaint/:id" element={<ComplaintDetail />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;