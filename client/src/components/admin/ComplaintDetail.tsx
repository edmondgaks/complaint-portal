import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Tag, 
  Clock, 
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clipboard,
  Building
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import { ComplaintStatus } from '../../types/complaint';
import toast from 'react-hot-toast';

const statusOptions: ComplaintStatus[] = [
  'Received',
  'In Progress',
  'Under Review',
  'Resolved',
  'Closed'
];

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

const statusColors: Record<ComplaintStatus, { bg: string; text: string; icon: JSX.Element }> = {
  'Received': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-700',
    icon: <Clock className="h-4 w-4" />
  },
  'In Progress': { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700',
    icon: <Clock className="h-4 w-4" />
  },
  'Under Review': { 
    bg: 'bg-purple-100', 
    text: 'text-purple-700',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  'Resolved': { 
    bg: 'bg-green-100', 
    text: 'text-green-700',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'Closed': { 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    icon: <XCircle className="h-4 w-4" />
  }
};

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComplaintById, updateComplaintStatus, addResponse } = useComplaints();
  const { user } = useAuth();
  
  const complaint = id ? getComplaintById(id) : undefined;
  
  const [newStatus, setNewStatus] = useState<ComplaintStatus | ''>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  if (!complaint) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Complaint not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The complaint you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = () => {
    if (!newStatus || !statusMessage.trim()) {
      toast.error('Please select a status and enter a message');
      return;
    }

    updateComplaintStatus(complaint.id, newStatus, statusMessage);
    setNewStatus('');
    setStatusMessage('');
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAddResponse = () => {
    if (!responseMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    addResponse(complaint.id, responseMessage);
    setResponseMessage('');
    toast.success('Response added successfully');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaint.id);
    toast.success('Complaint ID copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <button
          onClick={copyToClipboard}
          className="flex items-center text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          <Clipboard className="h-4 w-4 mr-1" />
          Copy ID
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            Complaint Details
            <span className={`ml-3 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[complaint.status].bg} ${statusColors[complaint.status].text}`}>
              {statusColors[complaint.status].icon}
              <span className="ml-1">{complaint.status}</span>
            </span>
          </h2>
          <p className="text-sm text-gray-500">ID: {complaint.id}</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">
                      {categoryLabels[complaint.category] || complaint.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{complaint.department}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{complaint.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted On</p>
                    <p className="font-medium text-gray-900">{formattedDate(complaint.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{complaint.name}</p>
                  </div>
                </div>
                {!complaint.isAnonymous && (
                  <>
                    <div className="flex items-start">
                      <Send className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{complaint.email}</p>
                      </div>
                    </div>
                    {complaint.phone && (
                      <div className="flex items-start">
                        <Send className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{complaint.phone}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {complaint.isAnonymous && (
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      This complaint was submitted anonymously
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-line mb-6">{complaint.description}</p>
            
            {complaint.imageUrl && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Attached Image</h3>
                <img
                  src={complaint.imageUrl}
                  alt="Complaint evidence"
                  className="max-w-full h-auto max-h-96 rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                New Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Status Message
              </label>
              <textarea
                id="statusMessage"
                rows={3}
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Provide details about this status update"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Response</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="responseMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Response Message
              </label>
              <textarea
                id="responseMessage"
                rows={5}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Write a response to the citizen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddResponse}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Add Response
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Updates & Responses</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {complaint.updates.map((update, index) => (
              <div key={index} className="relative pl-10">
                <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${statusColors[update.status].bg}`}>
                  {statusColors[update.status].icon}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className={`font-medium ${statusColors[update.status].text}`}>
                      {update.status}
                    </h3>
                    <span className="ml-2 text-sm text-gray-500">
                      {formattedDate(update.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{update.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;