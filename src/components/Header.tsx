import React, { useState } from 'react'
import './Header.css'
import logoImage from './logos.png'

interface HeaderProps {
  currentView: string
  setCurrentView: (view: string) => void
  userRole?: 'doctor' | 'patient' | null
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, userRole }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const navigationItems = [
    { id: 'main', label: 'Home' },
    { id: 'smart-triage', label: 'Smart Triage' },
    { id: 'appointment-scheduling', label: 'Scheduling' },
    { id: 'risk-management', label: 'Risk Management' },
    { id: 'cancellation-cascade', label: 'Cancellation Cascade' },
    { id: 'predictive-followups', label: 'Follow-ups' },
    { id: 'no-show-prevention', label: 'No-Show Prevention' },
    { id: 'demo-flow', label: 'Demo Flow' }
  ]

  const doctorDropdownItems = [
    { id: 'doctor-onboarding', label: 'Doctor Onboarding' },
    { id: 'doctor-dashboard', label: 'Doctor Dashboard' }
  ]

  const patientDropdownItems = [
    { id: 'patient-onboarding', label: 'Patient Onboarding' },
    { id: 'patient-dashboard', label: 'Patient Dashboard' }
  ]

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    if (userRole === 'doctor') {
      return navigationItems.filter(item => 
        ['main', 'appointment-scheduling', 'risk-management', 'no-show-prevention', 'demo-flow'].includes(item.id)
      )
    } else if (userRole === 'patient') {
      return navigationItems.filter(item => 
        ['main', 'smart-triage', 'appointment-scheduling', 'demo-flow'].includes(item.id)
      )
    }
    return navigationItems
  }

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleItemClick = (itemId: string) => {
    setCurrentView(itemId)
    setActiveDropdown(null)
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
            {/* Doctor Dropdown */}
            <div className="dropdown-container2">
              <div className="dropdown-container">
                <button
                  className={`nav-item dropdown-trigger ${activeDropdown === 'doctor' ? 'active' : ''}`}
                  onClick={() => handleDropdownToggle('doctor')}
                  onMouseEnter={() => setActiveDropdown('doctor')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span className="nav-label">Doctors</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'doctor' ? 'show' : ''}`}>
                  {doctorDropdownItems.map((item) => (
                    <button
                      key={item.id}
                      className={`dropdown-item ${currentView === item.id ? 'active' : ''}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Patient Dropdown */}
            <div className="dropdown-container2">
            <div className="dropdown-container">
              <button
                className={`nav-item dropdown-trigger ${activeDropdown === 'patient' ? 'active' : ''}`}
                onClick={() => handleDropdownToggle('patient')}
                onMouseEnter={() => setActiveDropdown('patient')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className="nav-label">Patients</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'patient' ? 'show' : ''}`}>
                {patientDropdownItems.map((item) => (
                  <button
                    key={item.id}
                    className={`dropdown-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            </div>
            {/* Regular Navigation Items */}
            {getFilteredNavigationItems().map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
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
