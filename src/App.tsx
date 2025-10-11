import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import DoctorOnboarding from './components/DoctorOnboarding'
import DoctorDashboard from './components/DoctorDashboard'
import PatientOnboarding from './components/PatientOnboarding'
import AppointmentScheduling from './components/AppointmentScheduling'
import RiskManagement from './components/RiskManagement'
import CancellationCascade from './components/CancellationCascade'
import PredictiveFollowups from './components/PredictiveFollowups'
import DemoFlow from './components/DemoFlow'

type ViewType = 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'appointment-scheduling' | 'risk-management' | 'cancellation-cascade' | 'predictive-followups' | 'demo-flow'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('doctor-onboarding')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'doctor-onboarding':
        return <DoctorOnboarding />
      case 'doctor-dashboard':
        return <DoctorDashboard />
      case 'patient-onboarding':
        return <PatientOnboarding />
      case 'appointment-scheduling':
        return <AppointmentScheduling />
      case 'risk-management':
        return <RiskManagement />
      case 'cancellation-cascade':
        return <CancellationCascade />
      case 'predictive-followups':
        return <PredictiveFollowups />
      case 'demo-flow':
        return <DemoFlow />
      default:
        return <DoctorOnboarding />
    }
  }

  return (
    <div className="App">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App
