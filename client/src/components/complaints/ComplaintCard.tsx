import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { Complaint } from '../../types';
import Badge from '../ui/Badge';
import { getStatusColor, getPriorityColor, formatDate, getCategoryLabel } from '../../utils/helpers';

interface ComplaintCardProps {
  complaint: Complaint;
  showDetails?: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, showDetails = true }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {complaint.title}
          </h3>
          <Badge 
            text={complaint.status.replace('_', ' ').toUpperCase()} 
            color={getStatusColor(complaint.status)}
          />
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>Submitted on {formatDate(complaint.createdAt)}</span>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p className="mt-1 text-sm text-gray-900">
              {getCategoryLabel(complaint.category)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Priority</p>
            <p className="mt-1">
              <Badge 
                text={complaint.priority.toUpperCase()} 
                color={getPriorityColor(complaint.priority)}
              />
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="mt-1 text-sm text-gray-900 truncate">
              {complaint.location}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ticket ID</p>
            <p className="mt-1 text-sm text-gray-900">
              {complaint.id}
            </p>
          </div>
        </div>
        {showDetails && (
          <div className="mt-4 flex justify-end">
            <Link
              to={`/complaint/${complaint.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
            >
              View details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;