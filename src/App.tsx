import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LiveEvaluationPage from './pages/LiveEvaluationPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import VehicleRegistrationPage from './pages/VehicleRegistrationPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/live-evaluation" 
              element={
                <ProtectedRoute>
                  <LiveEvaluationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register-vehicle" 
              element={
                <ProtectedRoute>
                  <VehicleRegistrationPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
