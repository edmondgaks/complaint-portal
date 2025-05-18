import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-blue-400">Complaint Portal</h2>
            <p className="mt-2 text-sm text-gray-300">
              Connecting citizens with government services. Your voice matters.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-400 hover:text-white">
                  Submit Complaint
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-400 hover:text-white">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Roads & Infrastructure
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Sanitation & Waste
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Electricity
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Water Supply
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Public Transport
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <PhoneCall size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">contact@civiclink.gov</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-gray-400" />
                <span className="text-gray-400">123 Government Center<br />City Hall, Suite 400<br />Anytown, ST 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} CivicLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;