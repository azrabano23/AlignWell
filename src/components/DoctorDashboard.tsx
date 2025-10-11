import React, { useState, useEffect } from 'react'

interface Appointment {
  id: string
  patientName: string
  time: string
  date: string
  specialty: string
  urgency: 'stat' | 'soon' | 'medium' | 'routine'
  status: 'pending' | 'approved' | 'cancelled' | 'completed'
  riskScore: number
  followUpRequired: boolean
}

interface DashboardStats {
  totalAppointments: number
  pendingApprovals: number
  cancellations: number
  autoRefillRate: number
  followUpRate: number
}

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    pendingApprovals: 0,
    cancellations: 0,
    autoRefillRate: 0,
    followUpRate: 0
  })
  const [selectedTab, setSelectedTab] = useState<'overview' | 'appointments' | 'analytics'>('overview')

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'Sarah Johnson',
        time: '9:00 AM',
        date: '2024-01-15',
        specialty: 'Reproductive Endocrinology',
        urgency: 'soon',
        status: 'pending',
        riskScore: 75,
        followUpRequired: true
      },
      {
        id: '2',
        patientName: 'Maria Rodriguez',
        time: '10:30 AM',
        date: '2024-01-15',
        specialty: 'Maternal-fetal Medicine',
        urgency: 'medium',
        status: 'approved',
        riskScore: 45,
        followUpRequired: false
      },
      {
        id: '3',
        patientName: 'Jennifer Chen',
        time: '2:00 PM',
        date: '2024-01-15',
        specialty: 'Gynecologic Oncology',
        urgency: 'stat',
        status: 'pending',
        riskScore: 90,
        followUpRequired: true
      },
      {
        id: '4',
        patientName: 'Lisa Thompson',
        time: '3:30 PM',
        date: '2024-01-15',
        specialty: 'Urogynecology',
        urgency: 'routine',
        status: 'completed',
        riskScore: 25,
        followUpRequired: false
      }
    ]

    const mockStats: DashboardStats = {
      totalAppointments: 24,
      pendingApprovals: 3,
      cancellations: 2,
      autoRefillRate: 87,
      followUpRate: 92
    }

    setAppointments(mockAppointments)
    setStats(mockStats)
  }, [])

  const handleAppointmentAction = (appointmentId: string, action: 'approve' | 'cancel') => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: action === 'approve' ? 'approved' : 'cancelled' }
          : apt
      )
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'stat': return 'status-critical'
      case 'soon': return 'status-high'
      case 'medium': return 'status-medium'
      case 'routine': return 'status-low'
      default: return 'status-low'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'status-critical'
    if (score >= 60) return 'status-high'
    if (score >= 40) return 'status-medium'
    return 'status-low'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="page-subtitle">
          Approve/auto-approve appointments, track cancellations, monitor patient follow-ups
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            className={`btn ${selectedTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`btn ${selectedTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('appointments')}
          >
            📅 Appointments
          </button>
          <button
            className={`btn ${selectedTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {selectedTab === 'overview' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Today's Overview</h3>
              <p className="card-subtitle">Quick stats and pending actions</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Total Appointments</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#1976d2' }}>{stats.totalAppointments}</p>
              </div>
              <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>Pending Approvals</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f57c00' }}>{stats.pendingApprovals}</p>
              </div>
              <div style={{ background: '#ffebee', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>Cancellations</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#d32f2f' }}>{stats.cancellations}</p>
              </div>
              <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#388e3c' }}>Auto-Refill Rate</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#388e3c' }}>{stats.autoRefillRate}%</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Pending Approvals</h4>
                {appointments.filter(apt => apt.status === 'pending').map(appointment => (
                  <div key={appointment.id} style={{ 
                    background: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{appointment.patientName}</strong>
                      <span className={`status-badge ${getUrgencyColor(appointment.urgency)}`}>
                        {appointment.urgency.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      {appointment.time} • {appointment.specialty}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Follow-up Required</h4>
                {appointments.filter(apt => apt.followUpRequired).map(appointment => (
                  <div key={appointment.id} style={{ 
                    background: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{appointment.patientName}</strong>
                      <span className={`status-badge ${getRiskColor(appointment.riskScore)}`}>
                        Risk: {appointment.riskScore}%
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      {appointment.specialty} • Follow-up needed
                    </p>
                    <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                      Schedule Follow-up
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'appointments' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Appointment Management</h3>
              <p className="card-subtitle">Manage all appointments and approvals</p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Patient</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Time</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Specialty</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Urgency</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Risk Score</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '1rem' }}>{appointment.patientName}</td>
                      <td style={{ padding: '1rem' }}>{appointment.time}</td>
                      <td style={{ padding: '1rem' }}>{appointment.specialty}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge ${getUrgencyColor(appointment.urgency)}`}>
                          {appointment.urgency.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge ${getRiskColor(appointment.riskScore)}`}>
                          {appointment.riskScore}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status-badge ${appointment.status === 'approved' ? 'status-low' : appointment.status === 'pending' ? 'status-medium' : 'status-high'}`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {appointment.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-success"
                                onClick={() => handleAppointmentAction(appointment.id, 'approve')}
                                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.followUpRequired && (
                            <button className="btn btn-warning" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                              Follow-up
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Analytics & Insights</h3>
              <p className="card-subtitle">Track performance metrics and trends</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Cancellation Trends</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.5rem 0' }}>This Week: 2 cancellations</p>
                  <p style={{ margin: '0.5rem 0' }}>Last Week: 4 cancellations</p>
                  <p style={{ margin: '0.5rem 0', color: '#28a745' }}>📈 50% improvement</p>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Auto-Refill Performance</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.5rem 0' }}>Current Rate: 87%</p>
                  <p style={{ margin: '0.5rem 0' }}>Target Rate: 90%</p>
                  <p style={{ margin: '0.5rem 0', color: '#ffc107' }}>📊 3% below target</p>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Follow-up Success</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.5rem 0' }}>Completion Rate: 92%</p>
                  <p style={{ margin: '0.5rem 0' }}>Average Response: 2.3 days</p>
                  <p style={{ margin: '0.5rem 0', color: '#28a745' }}>✅ Excellent performance</p>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Risk Distribution</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ margin: '0.5rem 0' }}>High Risk: 25%</p>
                  <p style={{ margin: '0.5rem 0' }}>Medium Risk: 40%</p>
                  <p style={{ margin: '0.5rem 0' }}>Low Risk: 35%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
