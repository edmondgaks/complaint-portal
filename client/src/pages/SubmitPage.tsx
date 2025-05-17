import React from 'react';
import ComplaintForm from '../components/complaints/ComplaintForm';

const SubmitPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Submit a Complaint</h1>
          <p className="mt-2 text-lg text-gray-600">
            Help us improve our community by reporting issues you encounter.
          </p>
        </div>
        
        <ComplaintForm />
      </div>
    </div>
  );
};

export default SubmitPage;