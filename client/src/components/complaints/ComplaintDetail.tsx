import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  Tag, 
  Building, 
  CheckCircle,
  ArrowLeft,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintsContext';
import { ComplaintStatus } from '../../types/complaint';

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
    icon: <AlertCircle className="h-4 w-4" />
  },
  'Resolved': { 
    bg: 'bg-green-100', 
    text: 'text-green-700',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'Closed': { 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    icon: <CheckCircle className="h-4 w-4" />
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

const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComplaintById } = useComplaints();
  
  const complaint = id ? getComplaintById(id) : undefined;

  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Not Found</h2>
        <p className="text-gray-600 mb-6">
          The complaint you're looking for does not exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/track')}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back to Tracking
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

  const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
    const { bg, text, icon } = statusColors[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
        {icon}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Complaint Details</h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-blue-100 text-sm mt-1">Complaint ID: {complaint.id}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Complaint Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-900">
                        {categoryLabels[complaint.category] || complaint.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{complaint.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{complaint.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium text-gray-900">{formattedDate(complaint.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {!complaint.isAnonymous && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{complaint.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{complaint.email}</p>
                      </div>
                    </div>
                    
                    {complaint.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{complaint.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{complaint.description}</p>
              
              {complaint.imageUrl && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Attached Image</h3>
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint evidence"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Status Updates</h2>
          </div>
          
          <div className="p-6">
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
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
            
            {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm">
                  This complaint is still being processed. Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;