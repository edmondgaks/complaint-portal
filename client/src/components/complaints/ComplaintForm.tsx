import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Complaint } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import { getCategoryLabel } from '../../utils/helpers';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { AlertCircle, Send } from 'lucide-react';

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addComplaint } = useComplaints();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category,
    location: '',
    priority: 'medium' as Complaint['priority']
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories = [
    { value: 'roads', label: getCategoryLabel('roads') },
    { value: 'sanitation', label: getCategoryLabel('sanitation') },
    { value: 'electricity', label: getCategoryLabel('electricity') },
    { value: 'water', label: getCategoryLabel('water') },
    { value: 'public_transport', label: getCategoryLabel('public_transport') },
    { value: 'parks', label: getCategoryLabel('parks') },
    { value: 'other', label: getCategoryLabel('other') }
  ];
  
  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      category: '',
      location: ''
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      valid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
      valid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      valid = false;
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/submit' } });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addComplaint(formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '' as Category,
        location: '',
        priority: 'medium'
      });
      
      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Complaint or Feedback</h2>
      
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You'll need to log in before your complaint can be submitted. You can fill out the form now, and you'll be prompted to log in when you submit.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          name="title"
          label="Title"
          placeholder="Briefly describe your complaint"
          value={formData.title}
          onChange={handleChange}
          required
          error={errors.title}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="category"
            name="category"
            label="Category"
            options={categories}
            value={formData.category}
            onChange={handleChange}
            required
            error={errors.category}
            placeholder="Select a category"
          />
          
          <Select
            id="priority"
            name="priority"
            label="Priority"
            options={priorities}
            value={formData.priority}
            onChange={handleChange}
          />
        </div>
        
        <Input
          id="location"
          name="location"
          label="Location"
          placeholder="Enter the address or location"
          value={formData.location}
          onChange={handleChange}
          required
          error={errors.location}
        />
        
        <TextArea
          id="description"
          name="description"
          label="Description"
          placeholder="Provide detailed information about your complaint"
          value={formData.description}
          onChange={handleChange}
          required
          error={errors.description}
          rows={6}
        />
        
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            className="mr-4"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            icon={<Send size={16} />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;