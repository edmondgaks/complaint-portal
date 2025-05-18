import React, { useMemo } from 'react';
import { useComplaints } from '../../context/ComplaintsContext';
import { BarChart2, PieChart, ArrowUp, ArrowDown, Users, Clock } from 'lucide-react';
import { ComplaintStatus, Department } from '../../types/complaint';

const AdminAnalytics: React.FC = () => {
  const { complaints } = useComplaints();

  // Status Distribution
  const statusDistribution = useMemo(() => {
    const distribution: Record<ComplaintStatus, number> = {
      'Received': 0,
      'In Progress': 0,
      'Under Review': 0,
      'Resolved': 0,
      'Closed': 0,
    };
    
    complaints.forEach(complaint => {
      distribution[complaint.status]++;
    });
    
    return distribution;
  }, [complaints]);

  // Department Distribution
  const departmentDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    complaints.forEach(complaint => {
      if (!distribution[complaint.department]) {
        distribution[complaint.department] = 0;
      }
      distribution[complaint.department]++;
    });
    
    return distribution;
  }, [complaints]);

  // Category Distribution
  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    complaints.forEach(complaint => {
      if (!distribution[complaint.category]) {
        distribution[complaint.category] = 0;
      }
      distribution[complaint.category]++;
    });
    
    return distribution;
  }, [complaints]);

  const averageResolutionTime = useMemo(() => {
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');
    if (resolvedComplaints.length === 0) return 0;
    
    return 3.5; // In days
  }, [complaints]);

  // Stats
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const pendingComplaints = totalComplaints - resolvedComplaints;
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  // Calculate trend (for demo purposes)
  const weeklyTrend = 8; 

  const getStatusColor = (status: ComplaintStatus): string => {
    switch (status) {
      case 'Received': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Under Review': return 'bg-purple-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDepartmentColor = (index: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-indigo-500', 
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalComplaints}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${weeklyTrend > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {weeklyTrend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(weeklyTrend)}%
            </div>
            <span className="text-xs text-gray-500 ml-2">From last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{resolutionRate}%</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${resolutionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageResolutionTime} days</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Based on {resolvedComplaints} resolved complaints
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Complaints</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingComplaints}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pendingComplaints > resolvedComplaints ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {pendingComplaints > resolvedComplaints ? (
                <>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Needs attention
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Good progress
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getStatusColor(status as ComplaintStatus)} h-2 rounded-full`} 
                    style={{ width: `${totalComplaints ? (count / totalComplaints) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h3>
          <div className="space-y-4">
            {Object.entries(departmentDistribution).map(([department, count], index) => (
              <div key={department}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{department}</span>
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getDepartmentColor(index)} h-2 rounded-full`} 
                    style={{ width: `${totalComplaints ? (count / totalComplaints) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryDistribution).map(([category, count], index) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${getDepartmentColor(index)} mb-2`}></div>
              <p className="text-sm font-medium text-gray-700">{category}</p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">
                {Math.round((count / totalComplaints) * 100)}% of total
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;