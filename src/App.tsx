import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import MainPage from './components/MainPage'
import DoctorOnboarding from './components/DoctorOnboarding'
import DoctorDashboard from './components/DoctorDashboard'
import PatientOnboarding from './components/PatientOnboarding'
import AppointmentScheduling from './components/AppointmentScheduling'
import RiskManagement from './components/RiskManagement'
import CancellationCascade from './components/CancellationCascade'
import PredictiveFollowups from './components/PredictiveFollowups'
import DemoFlow from './components/DemoFlow'

type ViewType = 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'appointment-scheduling' | 'risk-management' | 'cancellation-cascade' | 'predictive-followups' | 'demo-flow'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('main')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main':
        return <MainPage setCurrentView={setCurrentView} />
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
        return <MainPage setCurrentView={setCurrentView} />
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
