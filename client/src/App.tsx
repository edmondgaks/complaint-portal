import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SubmitPage from './pages/SubmitPage';
import { ComplaintProvider } from './context/ComplaintsContext';
import TrackPage from './pages/TrackPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import ThankYouPage from './pages/ThankYouPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>

        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                  path="/admin/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              <Route path="/complaint/:id" element={<ComplaintDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;