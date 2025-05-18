import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import toast from 'react-hot-toast';

const TrackComplaint: React.FC = () => {
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');
  const { getComplaintById } = useComplaints();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!complaintId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }

    const complaint = getComplaintById(complaintId.trim());
    
    if (complaint) {
      navigate(`/complaint/${complaintId}`);
    } else {
      setError('No complaint found with this ID');
      toast.error('No complaint found with this ID');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Complaint</h1>
        <p className="text-gray-600 mb-8">
          Enter your complaint ID to check its current status and updates.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="complaintId" className="block text-sm font-medium text-gray-700 mb-2">
                Complaint ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="complaintId"
                  name="complaintId"
                  value={complaintId}
                  onChange={(e) => {
                    setComplaintId(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your complaint ID"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
              </div>
              {error && (
                <div className="flex items-center mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Complaint
            </button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Track Your Complaint</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="ml-3 text-gray-600">
                Enter the unique complaint ID you received when you submitted your complaint.
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="ml-3 text-gray-600">
                Click the "Track Complaint" button to view the current status and updates.
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold">3</span>
              </div>
              <p className="ml-3 text-gray-600">
                You'll see detailed information about your complaint, including all updates and the current status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;