import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const ThankYouPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-lg text-gray-600 mb-4">
          Your complaint has been submitted successfully.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
          <p className="text-sm text-gray-600 mb-1">
            We've received your complaint and it's being processed.
          </p>
          <p className="text-sm text-gray-600 mb-1">
            A confirmation has been saved to your account.
          </p>
          <p className="text-sm text-gray-600">
            You can track the status of your complaint at any time.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link to="/track">
            <Button variant="primary">
              Track Your Complaint
            </Button>
          </Link>
          <Link to="/submit">
            <Button variant="outline">
              Submit Another Complaint
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;