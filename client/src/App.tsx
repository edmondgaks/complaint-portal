import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SubmitPage from './pages/SubmitPage';
import { ComplaintsProvider } from './context/ComplaintsContext';
import TrackPage from './pages/TrackPage';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';


function App() {
  return (
    <AuthProvider>
      <ComplaintsProvider>

        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/thank-you" element={<SubmitPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/complaint/:id" element={<ComplaintDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </ComplaintsProvider>
    </AuthProvider>
  );
}

export default App;