import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import Input from '../components/ui/Input';
import { Complaint } from '../types';

const TrackPage: React.FC = () => {
  const navigate = useNavigate();
  const { complaints } = useComplaints();
  const { user, isAuthenticated } = useAuth();
  
  const [ticketId, setTicketId] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  
  // Load user's complaints if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const filteredComplaints = complaints.filter(
        complaint => complaint.userId === user.id
      );
      setUserComplaints(filteredComplaints);
    } else {
      setUserComplaints([]);
    }
  }, [isAuthenticated, user, complaints]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setSearchedComplaint(null);
    setError('');
    
    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }
    
    // Find the complaint
    const found = complaints.find(c => c.id === ticketId.trim());
    
    if (found) {
      setSearchedComplaint(found);
    } else {
      setError('No complaint found with this ticket ID');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Track Your Complaint</h1>
          <p className="mt-2 text-lg text-gray-600">
            Enter your ticket ID to check the status of your complaint.
          </p>
        </div>
        
        {/* Search box */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex items-center">
              <div className="flex-grow">
                <Input
                  id="ticketId"
                  label="Ticket ID"
                  placeholder="Enter your ticket ID"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  error={error}
                  className="mb-0"
                />
              </div>
              <div className="ml-4 mt-6">
                <Button
                  type="submit"
                  icon={<Search size={16} />}
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Search result */}
        {searchedComplaint && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Search Result</h2>
            <ComplaintCard complaint={searchedComplaint} />
          </div>
        )}
        
        {/* User's complaints if logged in */}
        {isAuthenticated ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Complaints</h2>
            
            {userComplaints.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500 mb-4">You haven't submitted any complaints yet.</p>
                <Button
                  onClick={() => navigate('/submit')}
                  variant="primary"
                >
                  Submit a Complaint
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userComplaints.map(complaint => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Log in to see all your complaints</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you have an account, log in to view all your submitted complaints and their status.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => navigate('/login')}
                    variant="primary"
                  >
                    Log In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;