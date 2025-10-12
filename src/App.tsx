import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainPage from './components/MainPage'
import DoctorOnboarding from './components/DoctorOnboarding'
import DoctorDashboard from './components/DoctorDashboard'
import PatientOnboarding from './components/PatientOnboarding'
import PatientDashboard from './components/PatientDashboard'
import SmartTriage from './components/SmartTriage'
import AppointmentScheduling from './components/AppointmentScheduling'
import CancellationCascade from './components/CancellationCascade'
import PredictiveFollowups from './components/PredictiveFollowups'
import NoShowPrevention from './components/NoShowPrevention'

type ViewType = 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('main')
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null)

  const handleDoctorRegistrationSuccess = (doctorData: any) => {
    setUserRole('doctor')
    setCurrentView('doctor-dashboard')
  }

  const handlePatientRegistrationSuccess = (patientData: any) => {
    setUserRole('patient')
    setCurrentView('patient-dashboard')
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main':
        return <MainPage setCurrentView={handleViewChange} />
      case 'doctor-onboarding':
        return <DoctorOnboarding onRegistrationSuccess={handleDoctorRegistrationSuccess} />
      case 'doctor-dashboard':
        return <DoctorDashboard />
      case 'patient-onboarding':
        return <PatientOnboarding onRegistrationSuccess={handlePatientRegistrationSuccess} />
      case 'patient-dashboard':
        return <PatientDashboard />
      case 'smart-triage':
        return <SmartTriage />
      case 'appointment-scheduling':
        return <AppointmentScheduling />
      case 'cancellation-cascade':
        return <CancellationCascade />
      case 'predictive-followups':
        return <PredictiveFollowups />
      case 'no-show-prevention':
        return <NoShowPrevention />
      default:
        return <MainPage setCurrentView={handleViewChange} />
    }
  }

  return (
    <div className="App">
      <Header currentView={currentView} setCurrentView={handleViewChange} userRole={userRole} />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App
