import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate, getStatusColor, getPriorityColor, getCategoryLabel } from '../../utils/helpers';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComplaint, addComment, updateComplaintStatus } = useComplaints();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  
  const complaint = getComplaint(id || '');
  
  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaint Not Found</h2>
        <p className="mb-4">The complaint you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/track')}>
          Back to Tracking
        </Button>
      </div>
    );
  }
  
  const handleStatusChange = (status: typeof complaint.status) => {
    updateComplaintStatus(complaint.id, status);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated) return;
    
    addComment(complaint.id, newComment);
    setNewComment('');
  };
  
  const isUserComplaint = user?.id === complaint.userId;
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
  
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{complaint.title}</h2>
            <Badge 
              text={complaint.status.replace('_', ' ').toUpperCase()} 
              color={getStatusColor(complaint.status)}
              className="mt-2 sm:mt-0"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Ticket ID: {complaint.id}
          </p>
        </div>
        
        {/* Complaint details */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {complaint.status.replace('_', ' ').toUpperCase()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Badge 
                  text={complaint.priority.toUpperCase()} 
                  color={getPriorityColor(complaint.priority)}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{getCategoryLabel(complaint.category)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{complaint.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(complaint.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(complaint.updatedAt)}</dd>
            </div>
          </dl>
        </div>
        
        {/* Description */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        </div>
        
        {/* Status control buttons for admin/staff */}
        {isAdminOrStaff && (
          <div className="px-4 py-4 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={complaint.status === 'new' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => handleStatusChange('new')}
                disabled={complaint.status === 'new'}
              >
                New
              </Button>
              <Button 
                variant={complaint.status === 'in_progress' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => handleStatusChange('in_progress')}
                disabled={complaint.status === 'in_progress'}
              >
                In Progress
              </Button>
              <Button 
                variant={complaint.status === 'resolved' ? 'success' : 'outline'} 
                size="sm" 
                onClick={() => handleStatusChange('resolved')}
                disabled={complaint.status === 'resolved'}
              >
                Resolved
              </Button>
              <Button 
                variant={complaint.status === 'rejected' ? 'danger' : 'outline'} 
                size="sm" 
                onClick={() => handleStatusChange('rejected')}
                disabled={complaint.status === 'rejected'}
              >
                Rejected
              </Button>
            </div>
          </div>
        )}
        
        {/* Comments section */}
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
            Comments ({complaint.comments.length})
          </h3>
          
          {complaint.comments.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No comments yet.</p>
          ) : (
            <ul className="space-y-4">
              {complaint.comments.map(comment => (
                <li key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">
                      {comment.userName}
                      <span className="ml-1 text-xs text-gray-500">
                        ({comment.userRole})
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
          
          {/* Add comment form for authenticated users */}
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a Comment
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <textarea
                  rows={3}
                  name="comment"
                  id="comment"
                  className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  size="sm"
                  icon={<Send size={16} />}
                >
                  Post Comment
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;