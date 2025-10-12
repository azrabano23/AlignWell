import React, { useState, useEffect } from 'react'
import './PatientDashboard.css'

interface PatientProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  insurance: {
    provider: string
    policyNumber: string
  }
  telehealthPreference: boolean
  consents: {
    predictiveReminders: boolean
    voiceFollowUps: boolean
  }
}

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  reason: string
  urgency: string
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled'
  type: 'In-Person' | 'Telehealth'
}

interface HealthRecord {
  id: string
  date: string
  doctor: string
  diagnosis: string
  treatment: string
  notes: string
}

const PatientDashboard: React.FC = () => {
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'appointments' | 'health-records' | 'profile'>('overview')
  const [loading, setLoading] = useState(false)

  // Mock patient profile data
  useEffect(() => {
    const mockProfile: PatientProfile = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phone: '908-555-1234',
      dateOfBirth: '1985-05-22',
      insurance: {
        provider: 'Aetna',
        policyNumber: 'AET123456789'
      },
      telehealthPreference: true,
      consents: {
        predictiveReminders: true,
        voiceFollowUps: false
      }
    }
    setPatientProfile(mockProfile)
  }, [])

  // Mock appointments data
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: 'apt-001',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Reproductive Endocrinology',
        date: '2024-01-20',
        time: '10:00',
        reason: 'PCOS follow-up consultation',
        urgency: 'Routine',
        status: 'Scheduled',
        type: 'Telehealth'
      },
      {
        id: 'apt-002',
        doctor: 'Dr. Maria Rodriguez',
        specialty: 'Maternal-Fetal Medicine',
        date: '2024-01-25',
        time: '14:30',
        reason: 'Prenatal checkup - 28 weeks',
        urgency: 'Routine',
        status: 'Confirmed',
        type: 'In-Person'
      },
      {
        id: 'apt-003',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Reproductive Endocrinology',
        date: '2024-01-10',
        time: '09:00',
        reason: 'Initial consultation',
        urgency: 'Routine',
        status: 'Completed',
        type: 'Telehealth'
      }
    ]
    setAppointments(mockAppointments)
  }, [])

  // Mock health records data
  useEffect(() => {
    const mockRecords: HealthRecord[] = [
      {
        id: 'rec-001',
        date: '2024-01-10',
        doctor: 'Dr. Sarah Johnson',
        diagnosis: 'Polycystic Ovary Syndrome (PCOS)',
        treatment: 'Metformin 500mg twice daily, lifestyle modifications',
        notes: 'Patient shows improvement in insulin resistance. Continue current treatment plan.'
      },
      {
        id: 'rec-002',
        date: '2023-12-15',
        doctor: 'Dr. Maria Rodriguez',
        diagnosis: 'Pregnancy - 24 weeks',
        treatment: 'Prenatal vitamins, regular monitoring',
        notes: 'Normal pregnancy progression. Patient reports good fetal movement.'
      },
      {
        id: 'rec-003',
        date: '2023-11-20',
        doctor: 'Dr. Sarah Johnson',
        diagnosis: 'Irregular menstrual cycles',
        treatment: 'Hormonal evaluation, ultrasound',
        notes: 'Initial assessment for fertility concerns. Recommended follow-up in 3 months.'
      }
    ]
    setHealthRecords(mockRecords)
  }, [])

  const handleAppointmentAction = async (appointmentId: string, action: string) => {
    setLoading(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (action === 'Cancel') {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'Cancelled' as any }
            : apt
        ))
      }
      
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
      default: return '#666'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return '#e55a6b'
      case 'Urgent': return '#ff808b'
      case 'Routine': return '#ebbad1'
      case 'Follow-up': return '#7ACAC'
      default: return '#666'
    }
  }

  const upcomingAppointments = appointments.filter(apt => apt.status === 'Scheduled' || apt.status === 'Confirmed')
  const completedAppointments = appointments.filter(apt => apt.status === 'Completed')

  if (!patientProfile) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading patient profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Dashboard</h1>
        <p className="page-subtitle">Welcome back, {patientProfile.firstName}</p>
      </div>

      <div className="dashboard-container">
        {/* Patient Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-info">
              <h2>{patientProfile.firstName} {patientProfile.lastName}</h2>
              <p className="patient-id">Patient ID: PAT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="insurance">{patientProfile.insurance.provider} - {patientProfile.insurance.policyNumber}</p>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{appointments.length}</span>
                <span className="stat-label">Total Appointments</span>
              </div>
              <div className="stat">
                <span className="stat-number">{upcomingAppointments.length}</span>
                <span className="stat-label">Upcoming</span>
              </div>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <strong>Email:</strong> {patientProfile.email}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> {patientProfile.phone}
            </div>
            <div className="detail-item">
              <strong>Date of Birth:</strong> {new Date(patientProfile.dateOfBirth).toLocaleDateString()}
            </div>
            <div className="detail-item">
              <strong>Telehealth Preference:</strong> {patientProfile.telehealthPreference ? 'Yes' : 'No'}
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
            className={`tab ${selectedTab === 'health-records' ? 'active' : ''}`}
            onClick={() => setSelectedTab('health-records')}
          >
            Health Records
          </button>
          <button 
            className={`tab ${selectedTab === 'profile' ? 'active' : ''}`}
            onClick={() => setSelectedTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Upcoming Appointments</h3>
                  <div className="appointments-list">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-item">
                          <div className="appointment-time">{appointment.time}</div>
                          <div className="appointment-details">
                            <div className="doctor-name">{appointment.doctor}</div>
                            <div className="appointment-reason">{appointment.reason}</div>
                            <div className="appointment-type">{appointment.type}</div>
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
                      <p className="no-appointments">No upcoming appointments</p>
                    )}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="action-btn">
                      <span className="action-icon">📅</span>
                      <span>Book Appointment</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">💬</span>
                      <span>Message Doctor</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📋</span>
                      <span>View Records</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">⚙️</span>
                      <span>Update Profile</span>
                    </button>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Health Summary</h3>
                  <div className="health-summary">
                    <div className="summary-item">
                      <span className="summary-label">Last Visit:</span>
                      <span className="summary-value">
                        {completedAppointments.length > 0 
                          ? new Date(completedAppointments[0].date).toLocaleDateString()
                          : 'No previous visits'
                        }
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Primary Doctor:</span>
                      <span className="summary-value">Dr. Sarah Johnson</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Specialty:</span>
                      <span className="summary-value">Reproductive Endocrinology</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Next Appointment:</span>
                      <span className="summary-value">
                        {upcomingAppointments.length > 0 
                          ? new Date(upcomingAppointments[0].date).toLocaleDateString()
                          : 'None scheduled'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'appointments' && (
            <div className="appointments-content">
              <div className="appointments-header">
                <h3>My Appointments</h3>
                <button className="btn btn-primary">Book New Appointment</button>
              </div>
              
              <div className="appointments-list-detailed">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-info">
                        <h4>{appointment.doctor}</h4>
                        <p className="specialty">{appointment.specialty}</p>
                      </div>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-row">
                        <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="detail-row">
                        <strong>Time:</strong> {appointment.time}
                      </div>
                      <div className="detail-row">
                        <strong>Type:</strong> {appointment.type}
                      </div>
                      <div className="detail-row">
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                      <div className="detail-row">
                        <strong>Urgency:</strong> 
                        <span 
                          className="urgency-badge"
                          style={{ backgroundColor: getUrgencyColor(appointment.urgency) }}
                        >
                          {appointment.urgency}
                        </span>
                      </div>
                    </div>
                    
                    <div className="appointment-actions">
                      {appointment.status === 'Scheduled' && (
                        <>
                          <button 
                            className="btn btn-small btn-success"
                            onClick={() => handleAppointmentAction(appointment.id, 'Confirm')}
                            disabled={loading}
                          >
                            Confirm
                          </button>
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={() => handleAppointmentAction(appointment.id, 'Reschedule')}
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {appointment.status === 'Confirmed' && (
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => handleAppointmentAction(appointment.id, 'Cancel')}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                      <button className="btn btn-small btn-secondary">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'health-records' && (
            <div className="health-records-content">
              <div className="records-header">
                <h3>Health Records</h3>
                <button className="btn btn-primary">Request New Record</button>
              </div>
              
              <div className="records-list">
                {healthRecords.map(record => (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <div className="record-info">
                        <h4>{record.doctor}</h4>
                        <p className="record-date">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="record-details">
                      <div className="detail-section">
                        <h5>Diagnosis</h5>
                        <p>{record.diagnosis}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Treatment</h5>
                        <p>{record.treatment}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Notes</h5>
                        <p>{record.notes}</p>
                      </div>
                    </div>
                    
                    <div className="record-actions">
                      <button className="btn btn-small btn-primary">Download PDF</button>
                      <button className="btn btn-small btn-secondary">Share with Doctor</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'profile' && (
            <div className="profile-content">
              <h3>Profile Settings</h3>
              
              <div className="profile-form">
                <div className="form-section">
                  <h4>Personal Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" value={patientProfile.firstName} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" value={patientProfile.lastName} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={patientProfile.email} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" value={patientProfile.phone} readOnly />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" value={patientProfile.dateOfBirth} readOnly />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Insurance Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Insurance Provider</label>
                      <input type="text" value={patientProfile.insurance.provider} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Policy Number</label>
                      <input type="text" value={patientProfile.insurance.policyNumber} readOnly />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Preferences</h4>
                  <div className="preference-item">
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={patientProfile.telehealthPreference} 
                        readOnly 
                      />
                      <span>I prefer telehealth appointments when possible</span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={patientProfile.consents.predictiveReminders} 
                        readOnly 
                      />
                      <span>Receive predictive health reminders</span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <label className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={patientProfile.consents.voiceFollowUps} 
                        readOnly 
                      />
                      <span>Receive voice follow-up calls</span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary">Edit Profile</button>
                  <button className="btn btn-secondary">Change Password</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
