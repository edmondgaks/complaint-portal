import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, Search, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.pexels.com/photos/2883380/pexels-photo-2883380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="City skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Complaint Portal
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Your voice matters. Report issues, track progress, and help improve your community.
            Connect directly with local government services for faster resolutions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/submit')}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Submit a Complaint
            </Button>
            <Button
              onClick={() => navigate('/track')}
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Track Existing Complaint
            </Button>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects citizens with government agencies to resolve issues quickly and efficiently.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md text-blue-600 mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900">1. Submit Your Issue</h3>
                <p className="mt-2 text-gray-600">
                  Fill out a simple form with details about the problem you've encountered in your community.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md text-blue-600 mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900">2. Track the Progress</h3>
                <p className="mt-2 text-gray-600">
                  Use your ticket ID to check the status of your complaint and receive updates on its resolution.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md text-blue-600 mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900">3. Get Resolution</h3>
                <p className="mt-2 text-gray-600">
                  Receive notifications when your issue is resolved, and provide feedback on the service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Report Issues in Any Category
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform handles a wide range of public service issues.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { name: 'Roads & Infrastructure', icon: '🛣️' },
              { name: 'Sanitation & Waste', icon: '🗑️' },
              { name: 'Electricity', icon: '⚡' },
              { name: 'Water Supply', icon: '💧' },
              { name: 'Public Transport', icon: '🚌' },
              { name: 'Parks & Recreation', icon: '🌳' },
            ].map((category) => (
              <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm text-center transition-transform duration-300 hover:scale-105">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Citizens Are Saying
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from community members who used CivicLink.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 rounded-full text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                  <p className="text-sm text-gray-500">Resident</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 italic">
                "I reported a broken street light that had been out for months. Within a week of using CivicLink, it was fixed! The ability to track progress kept me informed the whole time."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 rounded-full text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 italic">
                "The garbage collection on our street was inconsistent for months. After submitting a complaint through CivicLink, the schedule was corrected and has been reliable ever since."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-10 w-10 rounded-full text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-500">Community Organizer</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 italic">
                "CivicLink has transformed how our neighborhood interacts with city services. It's transparent, efficient, and actually gets results. I recommend it to everyone in our community meetings."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to report an issue?</span>
            <span className="block text-blue-300">It only takes a few minutes.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button size="lg" onClick={() => navigate('/submit')}>
                Submit Now
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button variant="secondary" size="lg" onClick={() => navigate('/track')}>
                Track Complaint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;