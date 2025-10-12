import React from 'react'
import './Header.css'
import logoImage from './logos.png'

interface HeaderProps {
  currentView: 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention'
  setCurrentView: (view: 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention') => void
  userRole?: 'doctor' | 'patient' | null
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, userRole }) => {

  const navigationItems = [
    { id: 'main', label: 'Home' },
    { id: 'smart-triage', label: 'Smart Triage' },
    { id: 'appointment-scheduling', label: 'Scheduling' },
    { id: 'cancellation-cascade', label: 'Cancellation Cascade' },
    { id: 'predictive-followups', label: 'Follow-ups' },
    { id: 'no-show-prevention', label: 'No-Show Prevention' }
  ]


  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    if (userRole === 'doctor') {
      return navigationItems.filter(item => 
        ['main', 'appointment-scheduling', 'no-show-prevention'].includes(item.id)
      )
    } else if (userRole === 'patient') {
      return navigationItems.filter(item => 
        ['main', 'smart-triage', 'appointment-scheduling'].includes(item.id)
      )
    }
    return navigationItems
  }



  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => setCurrentView('main')} style={{ cursor: 'pointer' }}>
          <img src={logoImage} alt="AlignHer Logo" className="header-logo" />
          <div className="logo-text">
            
          </div>
        </div>
        
        <nav className="navigation">
          <div className="nav-items">
            {/* Regular Navigation Items */}
            {getFilteredNavigationItems().map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id as 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention')}
                title={item.label}
              >
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
