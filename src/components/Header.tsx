import React from 'react'
import './Header.css'

interface HeaderProps {
  currentView: string
  setCurrentView: (view: string) => void
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navigationItems = [
    { id: 'main', label: 'Home', icon: '🏠' },
    { id: 'doctor-onboarding', label: 'Doctor Onboarding', icon: '👨‍⚕️' },
    { id: 'doctor-dashboard', label: 'Doctor Dashboard', icon: '📊' },
    { id: 'patient-onboarding', label: 'Patient Onboarding', icon: '👩‍⚕️' },
    { id: 'appointment-scheduling', label: 'Scheduling', icon: '📅' },
    { id: 'risk-management', label: 'Risk Management', icon: '⚠️' },
    { id: 'cancellation-cascade', label: 'Cancellation Cascade', icon: '🔄' },
    { id: 'predictive-followups', label: 'Follow-ups', icon: '🔮' },
    { id: 'demo-flow', label: 'Demo Flow', icon: '🎯' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => setCurrentView('main')} style={{ cursor: 'pointer' }}>
          <h1>AlignHer</h1>
          <span className="tagline">Women's Health Care Coordination</span>
        </div>
        
        <nav className="navigation">
          <div className="nav-items">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
