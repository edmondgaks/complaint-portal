import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Send, AlertCircle } from 'lucide-react';
import { Department } from '../types/complaint';
import { useComplaints } from '../context/ComplaintsContext';
import toast from 'react-hot-toast';

const categories = [
  { value: 'pothole', label: 'Pothole', department: 'Roads' as Department },
  { value: 'streetlight', label: 'Streetlight Issue', department: 'Electricity' as Department },
  { value: 'water_leak', label: 'Water Leak', department: 'Water' as Department },
  { value: 'garbage', label: 'Garbage Collection', department: 'Sanitation' as Department },
  { value: 'park_maintenance', label: 'Park Maintenance', department: 'Parks' as Department },
  { value: 'noise', label: 'Noise Complaint', department: 'Public Safety' as Department },
  { value: 'graffiti', label: 'Graffiti', department: 'Other' as Department },
  { value: 'other', label: 'Other', department: 'Other' as Department },
];

const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    location: '',
    description: '',
    imageUrl: '',
    isAnonymous: false,
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    category: '',
    location: '',
    description: '',
  });

  const getDepartmentForCategory = (category: string): Department => {
    const found = categories.find((c) => c.value === category);
    return found ? found.department : 'Other';
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      category: '',
      location: '',
      description: '',
    };

    if (!formData.isAnonymous && !formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.isAnonymous && !formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (
      !formData.isAnonymous &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = 'Invalid email address';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Please select a category';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we're just storing a fake URL
      // In a real app, you would upload to cloud storage
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const department = getDepartmentForCategory(formData.category);
    
    try {
      const id = addComplaint({
        name: formData.isAnonymous ? 'Anonymous' : formData.name,
        email: formData.isAnonymous ? 'anonymous@example.com' : formData.email,
        phone: formData.phone,
        category: formData.category,
        department,
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imageUrl,
        isAnonymous: formData.isAnonymous,
      });

      setComplaintId(id);
      setFormSubmitted(true);
      toast.success('Complaint submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  if (formSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Send className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaint Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your complaint has been successfully submitted. You can track its progress using the ID below.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500 mb-1">Your Complaint ID</p>
              <p className="text-xl font-mono font-bold">{complaintId}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate(`/complaint/${complaintId}`)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Track Your Complaint
              </button>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    category: '',
                    location: '',
                    description: '',
                    imageUrl: '',
                    isAnonymous: false,
                  });
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Submit Another Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to report an issue with public services in your area.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isAnonymous" className="ml-2 text-gray-700">
                    Submit anonymously
                  </label>
                </div>
              </div>

              {!formData.isAnonymous && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className={formData.isAnonymous ? 'col-span-1' : ''}>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.category ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                )}
              </div>

              <div className="col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Address or description of the location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.location ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
                )}
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Please provide detailed information about the issue"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {formData.imageUrl ? (
                      <div>
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="mx-auto h-32 w-auto object-cover rounded"
                        />
                        <button
                          type="button"
                          className="mt-2 text-sm text-red-600 hover:text-red-500"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm text-gray-600">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;