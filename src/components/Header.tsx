import React from 'react'
import './Header.css'
import logoImage from './logos.png'

interface HeaderProps {
  currentView: string
  setCurrentView: (view: string) => void
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navigationItems = [
    { id: 'main', label: 'Home',  },
    { id: 'doctor-onboarding', label: 'Doctor Onboarding',  },
    { id: 'doctor-dashboard', label: 'Doctor Dashboard', },
    { id: 'patient-onboarding', label: 'Patient Onboarding',  },
    { id: 'appointment-scheduling', label: 'Scheduling',  },
    { id: 'risk-management', label: 'Risk Management',  },
    { id: 'cancellation-cascade', label: 'Cancellation Cascade',  },
    { id: 'predictive-followups', label: 'Follow-ups',  },
    { id: 'demo-flow', label: 'Demo Flow', }
  ]

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
