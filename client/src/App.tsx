import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
           
              <Route path="/login" element={<LoginPage />} />
              
            </Routes>
          </Layout>
        </Router>
    </AuthProvider>
  );
}

export default App;