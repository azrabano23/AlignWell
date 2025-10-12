import React, { useState, useEffect } from 'react'
import './DoctorDashboard.css'

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string
  time: string
  specialty: string
  reason: string
  urgency: string
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show'
  riskScore: number
  riskTier: 'Low' | 'Medium' | 'High'
}

interface DoctorProfile {
  fullName: string
  specialty: string
  credentials: string[]
  hospitalAffiliation: string
  acceptedInsurances: string[]
  email: string
}

const DoctorDashboard: React.FC = () => {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'appointments' | 'patients' | 'analytics'>('overview')
  const [loading, setLoading] = useState(false)

  // Mock doctor profile data
  useEffect(() => {
    const mockProfile: DoctorProfile = {
      fullName: 'Dr. Sarah Johnson',
      specialty: 'Reproductive Endocrinology',
      credentials: ['MD', 'FACOG-REI'],
      hospitalAffiliation: 'New Brunswick General Hospital',
      acceptedInsurances: ['Aetna', 'BlueCross', 'Cigna', 'UnitedHealth'],
      email: 'dr.sarah.johnson@hospital.com'
    }
    setDoctorProfile(mockProfile)
  }, [])

  // Mock appointments data
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: 'apt-001',
        patientName: 'Jennifer Chen',
        patientEmail: 'j.chen@email.com',
        patientPhone: '908-555-0101',
        date: '2024-01-15',
        time: '09:00',
        specialty: 'Reproductive Endocrinology',
        reason: 'PCOS follow-up - irregular periods',
        urgency: 'Routine',
        status: 'Scheduled',
        riskScore: 0.25,
        riskTier: 'Low'
      },
      {
        id: 'apt-002',
        patientName: 'Maria Rodriguez',
        patientEmail: 'm.rodriguez@email.com',
        patientPhone: '908-555-0102',
        date: '2024-01-15',
        time: '10:30',
        specialty: 'Reproductive Endocrinology',
        reason: 'Fertility consultation',
        urgency: 'Urgent',
        status: 'Confirmed',
        riskScore: 0.45,
        riskTier: 'Medium'
      },
      {
        id: 'apt-003',
        patientName: 'Lisa Thompson',
        patientEmail: 'lisa.t@email.com',
        patientPhone: '908-555-0103',
        date: '2024-01-16',
        time: '14:00',
        specialty: 'Reproductive Endocrinology',
        reason: 'IUI procedure',
        urgency: 'Routine',
        status: 'Scheduled',
        riskScore: 0.15,
        riskTier: 'Low'
      },
      {
        id: 'apt-004',
        patientName: 'Amanda Davis',
        patientEmail: 'amanda.d@email.com',
        patientPhone: '908-555-0104',
        date: '2024-01-16',
        time: '15:30',
        specialty: 'Reproductive Endocrinology',
        reason: 'Follow-up - pregnancy monitoring',
        urgency: 'Routine',
        status: 'Completed',
        riskScore: 0.20,
        riskTier: 'Low'
      }
    ]
    setAppointments(mockAppointments)
  }, [])

  const handleAppointmentAction = async (appointmentId: string, action: string) => {
    setLoading(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: action as any }
          : apt
      ))
      
      alert(`Appointment ${action.toLowerCase()} successfully!`)
    } catch (error) {
      alert('Failed to update appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return '#ebbad1'
      case 'Confirmed': return '#7ACAC'
      case 'Completed': return '#7ACAC'
      case 'Cancelled': return '#999'
      case 'No-Show': return '#e55a6b'
      default: return '#666'
    }
  }

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'Low': return '#7ACAC'
      case 'Medium': return '#ff808b'
      case 'High': return '#e55a6b'
      default: return '#666'
    }
  }

  const todayAppointments = appointments.filter(apt => apt.date === '2024-01-15')
  const upcomingAppointments = appointments.filter(apt => apt.status === 'Scheduled' || apt.status === 'Confirmed')

  if (!doctorProfile) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="page-subtitle">Welcome back, {doctorProfile.fullName}</p>
      </div>

      <div className="dashboard-container">
        {/* Doctor Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-info">
              <h2>{doctorProfile.fullName}</h2>
              <p className="specialty">{doctorProfile.specialty}</p>
              <p className="credentials">{doctorProfile.credentials.join(', ')}</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{appointments.length}</span>
                <span className="stat-label">Total Appointments</span>
              </div>
              <div className="stat">
                <span className="stat-number">{todayAppointments.length}</span>
                <span className="stat-label">Today's Appointments</span>
              </div>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <strong>Hospital Affiliation:</strong> {doctorProfile.hospitalAffiliation}
            </div>
            <div className="detail-item">
              <strong>Accepted Insurances:</strong> {doctorProfile.acceptedInsurances.join(', ')}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {doctorProfile.email}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${selectedTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setSelectedTab('appointments')}
          >
            Appointments
          </button>
          <button 
            className={`tab ${selectedTab === 'patients' ? 'active' : ''}`}
            onClick={() => setSelectedTab('patients')}
          >
            Patients
          </button>
          <button 
            className={`tab ${selectedTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setSelectedTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Today's Schedule</h3>
                  <div className="appointments-list">
                    {todayAppointments.length > 0 ? (
                      todayAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-item">
                          <div className="appointment-time">{appointment.time}</div>
                          <div className="appointment-details">
                            <div className="patient-name">{appointment.patientName}</div>
                            <div className="appointment-reason">{appointment.reason}</div>
                          </div>
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(appointment.status) }}
                          >
                            {appointment.status}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-appointments">No appointments scheduled for today</p>
                    )}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="action-btn">
                      <span className="action-icon">📅</span>
                      <span>View Schedule</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">👥</span>
                      <span>Patient List</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📊</span>
                      <span>Analytics</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">⚙️</span>
                      <span>Settings</span>
                    </button>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-time">2 hours ago</span>
                      <span className="activity-text">Completed appointment with Amanda Davis</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-time">4 hours ago</span>
                      <span className="activity-text">Confirmed appointment with Maria Rodriguez</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-time">Yesterday</span>
                      <span className="activity-text">New patient Jennifer Chen scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'appointments' && (
            <div className="appointments-content">
              <div className="appointments-header">
                <h3>All Appointments</h3>
                <button className="btn btn-primary">Add New Appointment</button>
              </div>
              
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Patient</th>
                      <th>Reason</th>
                      <th>Urgency</th>
                      <th>Risk</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>
                          <div className="datetime-cell">
                            <div className="date">{new Date(appointment.date).toLocaleDateString()}</div>
                            <div className="time">{appointment.time}</div>
                          </div>
                        </td>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-name">{appointment.patientName}</div>
                            <div className="patient-contact">{appointment.patientEmail}</div>
                          </div>
                        </td>
                        <td className="reason-cell">{appointment.reason}</td>
                        <td>
                          <span className={`urgency-badge ${appointment.urgency.toLowerCase()}`}>
                            {appointment.urgency}
                          </span>
                        </td>
                        <td>
                          <div 
                            className="risk-indicator"
                            style={{ backgroundColor: getRiskColor(appointment.riskTier) }}
                          >
                            {appointment.riskTier}
                          </div>
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(appointment.status) }}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {appointment.status === 'Scheduled' && (
                              <button 
                                className="btn btn-small btn-success"
                                onClick={() => handleAppointmentAction(appointment.id, 'Confirmed')}
                                disabled={loading}
                              >
                                Confirm
                              </button>
                            )}
                            {appointment.status === 'Confirmed' && (
                              <button 
                                className="btn btn-small btn-primary"
                                onClick={() => handleAppointmentAction(appointment.id, 'Completed')}
                                disabled={loading}
                              >
                                Complete
                              </button>
                            )}
                            <button className="btn btn-small btn-secondary">Reschedule</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'patients' && (
            <div className="patients-content">
              <div className="patients-header">
                <h3>Patient Management</h3>
                <div className="patient-filters">
                  <input type="text" placeholder="Search patients..." />
                  <select>
                    <option value="">All Patients</option>
                    <option value="active">Active Patients</option>
                    <option value="new">New Patients</option>
                  </select>
                </div>
              </div>
              
              <div className="patients-grid">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="patient-card">
                    <div className="patient-header">
                      <h4>{appointment.patientName}</h4>
                      <span className="patient-status">Active</span>
                    </div>
                    <div className="patient-details">
                      <div className="detail-row">
                        <strong>Email:</strong> {appointment.patientEmail}
                      </div>
                      <div className="detail-row">
                        <strong>Phone:</strong> {appointment.patientPhone}
                      </div>
                      <div className="detail-row">
                        <strong>Last Visit:</strong> {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="detail-row">
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                    </div>
                    <div className="patient-actions">
                      <button className="btn btn-small btn-primary">View Profile</button>
                      <button className="btn btn-small btn-secondary">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="analytics-content">
              <h3>Practice Analytics</h3>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Appointment Statistics</h4>
                  <div className="stat-item">
                    <span className="stat-label">Total Appointments:</span>
                    <span className="stat-value">{appointments.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Completed:</span>
                    <span className="stat-value">{appointments.filter(a => a.status === 'Completed').length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">No-Shows:</span>
                    <span className="stat-value">{appointments.filter(a => a.status === 'No-Show').length}</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Patient Demographics</h4>
                  <div className="stat-item">
                    <span className="stat-label">New Patients:</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Returning Patients:</span>
                    <span className="stat-value">28</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average Age:</span>
                    <span className="stat-value">32 years</span>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Revenue Metrics</h4>
                  <div className="stat-item">
                    <span className="stat-label">Monthly Revenue:</span>
                    <span className="stat-value">$45,000</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average per Visit:</span>
                    <span className="stat-value">$350</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Insurance Claims:</span>
                    <span className="stat-value">85%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard