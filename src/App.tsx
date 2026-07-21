import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DoctorOnboarding from './pages/doctor/DoctorOnboarding';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientOnboarding from './pages/patient/PatientOnboarding';
import PatientDashboard from './pages/patient/PatientDashboard';
import TriagePage from './pages/patient/TriagePage';
import AppointmentBooking from './pages/patient/AppointmentBooking';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : 
          <Navigate to={user?.role === 'doctor' ? '/doctor' : '/patient'} replace />} 
      />
      
      {/* Doctor Routes */}
      <Route path="/doctor" element={
        <ProtectedRoute requireRole="doctor">
          {user?.profileCompleted ? <DoctorDashboard /> : <DoctorOnboarding />}
        </ProtectedRoute>
      } />
      <Route path="/doctor/onboarding" element={
        <ProtectedRoute requireRole="doctor">
          <DoctorOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute requireRole="doctor">
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      
      {/* Patient Routes */}
      <Route path="/patient" element={
        <ProtectedRoute requireRole="patient">
          {user?.profileCompleted ? <PatientDashboard /> : <PatientOnboarding />}
        </ProtectedRoute>
      } />
      <Route path="/patient/onboarding" element={
        <ProtectedRoute requireRole="patient">
          <PatientOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/patient/dashboard" element={
        <ProtectedRoute requireRole="patient">
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/triage" element={
        <ProtectedRoute requireRole="patient">
          <TriagePage />
        </ProtectedRoute>
      } />
      <Route path="/patient/book-appointment" element={
        <ProtectedRoute requireRole="patient">
          <AppointmentBooking />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
