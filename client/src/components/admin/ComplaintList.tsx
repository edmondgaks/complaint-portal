import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertCircle, Clock } from 'lucide-react';
import { ComplaintType, ComplaintStatus } from '../../types/complaint';

interface ComplaintListProps {
  complaints: ComplaintType[];
}

const statusColors: Record<ComplaintStatus, { bg: string; text: string }> = {
  'Received': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'In Progress': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Under Review': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-700' },
  'Closed': { bg: 'bg-gray-100', text: 'text-gray-700' }
};

const priorityColor = (status: ComplaintStatus): string => {
  switch (status) {
    case 'Received':
      return 'bg-red-500';
    case 'In Progress':
      return 'bg-yellow-500';
    case 'Under Review':
      return 'bg-blue-500';
    case 'Resolved':
    case 'Closed':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const categoryLabels: Record<string, string> = {
  'pothole': 'Pothole',
  'streetlight': 'Streetlight Issue',
  'water_leak': 'Water Leak',
  'garbage': 'Garbage Collection',
  'park_maintenance': 'Park Maintenance',
  'noise': 'Noise Complaint',
  'graffiti': 'Graffiti',
  'other': 'Other',
};

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID & Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`h-8 w-1 ${priorityColor(complaint.status)} rounded-full`}></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{complaint.id.substring(0, 8)}...</span>
                  <span className="text-sm text-gray-500">{complaint.isAnonymous ? 'Anonymous' : complaint.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {categoryLabels[complaint.category] || complaint.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {complaint.location.length > 25 ? `${complaint.location.substring(0, 25)}...` : complaint.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(complaint.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[complaint.status].bg} ${statusColors[complaint.status].text}`}>
                  {complaint.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/admin/dashboard/complaint/${complaint.id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                >
                  View
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {complaints.length === 0 && (
        <div className="py-8 flex flex-col items-center justify-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;