import React, { useState, useEffect } from 'react'
import './NoShowPrevention.css'

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctor: string
  specialty: string
  date: string
  time: string
  reason: string
  urgency: string
  riskScore: number
  riskTier: 'Low' | 'Medium' | 'High'
  interventions: string[]
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'No-Show' | 'Cancelled'
}

interface RiskAssessment {
  patientHistory: number
  appointmentDetails: number
  clinicalContext: number
  overallScore: number
  tier: 'Low' | 'Medium' | 'High'
}

const NoShowPrevention: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate mock appointments with risk scores
  useEffect(() => {
    const generateMockAppointments = () => {
      const mockAppointments: Appointment[] = [
        {
          id: 'apt-001',
          patientName: 'Sarah Johnson',
          patientEmail: 'sarah.j@email.com',
          patientPhone: '908-555-0101',
          doctor: 'Dr. Maria Rodriguez',
          specialty: 'Maternal-Fetal Medicine',
          date: '2024-01-15',
          time: '10:00',
          reason: 'Prenatal checkup - 28 weeks',
          urgency: 'Routine',
          riskScore: 0.15,
          riskTier: 'Low',
          interventions: ['SMS reminder'],
          status: 'Scheduled'
        },
        {
          id: 'apt-002',
          patientName: 'Jennifer Chen',
          patientEmail: 'j.chen@email.com',
          patientPhone: '908-555-0102',
          doctor: 'Dr. Sarah Johnson',
          specialty: 'Reproductive Endocrinology',
          date: '2024-01-16',
          time: '14:00',
          reason: 'PCOS follow-up - irregular periods',
          urgency: 'Routine',
          riskScore: 0.45,
          riskTier: 'Medium',
          interventions: ['Digital pre-check-in', 'Telehealth option'],
          status: 'Scheduled'
        },
        {
          id: 'apt-003',
          patientName: 'Lisa Thompson',
          patientEmail: 'lisa.t@email.com',
          patientPhone: '908-555-0103',
          doctor: 'Dr. Jennifer Chen',
          specialty: 'Gynecologic Oncology',
          date: '2024-01-17',
          time: '09:00',
          reason: 'Cancer screening follow-up - abnormal results',
          urgency: 'Urgent',
          riskScore: 0.75,
          riskTier: 'High',
          interventions: ['Personal phone call', 'Transportation voucher', 'Procedure explanation'],
          status: 'Scheduled'
        },
        {
          id: 'apt-004',
          patientName: 'Amanda Davis',
          patientEmail: 'amanda.d@email.com',
          patientPhone: '908-555-0104',
          doctor: 'Dr. Lisa Thompson',
          specialty: 'Urogynecology',
          date: '2024-01-18',
          time: '11:00',
          reason: 'Pelvic floor therapy consultation',
          urgency: 'Routine',
          riskScore: 0.25,
          riskTier: 'Low',
          interventions: ['Email reminder'],
          status: 'Confirmed'
        },
        {
          id: 'apt-005',
          patientName: 'Michelle Rodriguez',
          patientEmail: 'michelle.r@email.com',
          patientPhone: '908-555-0105',
          doctor: 'Dr. Amanda Davis',
          specialty: 'General OB/GYN',
          date: '2024-01-19',
          time: '15:00',
          reason: 'Annual exam - first time patient',
          urgency: 'Routine',
          riskScore: 0.60,
          riskTier: 'High',
          interventions: ['Welcome call', 'Clinic tour', 'Procedure explanation'],
          status: 'Scheduled'
        }
      ]

      return mockAppointments
    }

    setAppointments(generateMockAppointments())
  }, [])

  const calculateRiskAssessment = (appointment: Appointment): RiskAssessment => {
    // Mock risk calculation based on appointment data
    const patientHistory = appointment.patientName.includes('Michelle') ? 0.8 : 
                          appointment.patientName.includes('Lisa') ? 0.6 : 0.3
    
    const appointmentDetails = appointment.urgency === 'Urgent' ? 0.9 : 
                              appointment.urgency === 'Routine' ? 0.4 : 0.2
    
    const clinicalContext = appointment.specialty === 'Gynecologic Oncology' ? 0.8 :
                           appointment.specialty === 'Maternal-Fetal Medicine' ? 0.3 : 0.5
    
    const overallScore = (patientHistory + appointmentDetails + clinicalContext) / 3
    
    let tier: 'Low' | 'Medium' | 'High'
    if (overallScore < 0.3) tier = 'Low'
    else if (overallScore < 0.6) tier = 'Medium'
    else tier = 'High'

    return {
      patientHistory,
      appointmentDetails,
      clinicalContext,
      overallScore,
      tier
    }
  }

  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    const assessment = calculateRiskAssessment(appointment)
    setRiskAssessment(assessment)
  }

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case 'Low': return '#7ACAC'
      case 'Medium': return '#ff808b'
      case 'High': return '#e55a6b'
      default: return '#666'
    }
  }

  const getInterventionDescription = (intervention: string) => {
    const descriptions: Record<string, string> = {
      'SMS reminder': 'Automated SMS reminder sent 24-48 hours before appointment',
      'Email reminder': 'Email reminder with appointment details and preparation instructions',
      'Digital pre-check-in': 'Interactive pre-check-in process to reduce wait times',
      'Telehealth option': 'Option to switch to telehealth appointment if needed',
      'Personal phone call': 'Staff member will call to confirm appointment and address concerns',
      'Transportation voucher': 'Ride-share voucher provided to help with transportation',
      'Procedure explanation': 'Educational materials and procedure explanation to reduce anxiety',
      'Welcome call': 'Welcome call for new patients to explain clinic procedures',
      'Clinic tour': 'Virtual or in-person clinic tour to familiarize patient with facility'
    }
    return descriptions[intervention] || intervention
  }

  const executeIntervention = async (appointmentId: string, intervention: string) => {
    setLoading(true)
    
    try {
      // Mock intervention execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update appointment status
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'Confirmed' as const }
          : apt
      ))
      
      alert(`${intervention} has been executed successfully!`)
    } catch (error) {
      alert('Failed to execute intervention. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">No-Show Prevention System</h1>
        <p className="page-subtitle">AI-powered risk assessment and proactive intervention management</p>
      </div>

      <div className="no-show-container">
        <div className="dashboard-grid">
          {/* Appointments List */}
          <div className="appointments-panel">
            <h3>Upcoming Appointments</h3>
            <div className="appointments-list">
              {appointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className={`appointment-card ${selectedAppointment?.id === appointment.id ? 'selected' : ''}`}
                  onClick={() => handleAppointmentSelect(appointment)}
                >
                  <div className="appointment-header">
                    <h4>{appointment.patientName}</h4>
                    <div 
                      className="risk-badge"
                      style={{ backgroundColor: getRiskColor(appointment.riskTier) }}
                    >
                      {appointment.riskTier} Risk
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="detail-item">
                      <strong>Doctor:</strong> {appointment.doctor}
                    </div>
                    <div className="detail-item">
                      <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <strong>Time:</strong> {appointment.time}
                    </div>
                    <div className="detail-item">
                      <strong>Specialty:</strong> {appointment.specialty}
                    </div>
                    <div className="detail-item">
                      <strong>Reason:</strong> {appointment.reason}
                    </div>
                  </div>
                  
                  <div className="appointment-status">
                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment Panel */}
          {selectedAppointment && riskAssessment && (
            <div className="risk-assessment-panel">
              <h3>Risk Assessment</h3>
              
              <div className="risk-summary">
                <div className="risk-score">
                  <h4>Overall Risk Score</h4>
                  <div className="score-circle-container">
                    <svg className="score-circle" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e1e5e9"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getRiskColor(riskAssessment.tier)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - riskAssessment.overallScore)}`}
                        transform="rotate(0 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="score-text"
                        transform="rotate(90 50 50)"
                      >
                        {Math.round(riskAssessment.overallScore * 100)}%
                      </text>
                    </svg>
                  </div>
                  <div 
                    className="risk-tier"
                    style={{ color: getRiskColor(riskAssessment.tier) }}
                  >
                    {riskAssessment.tier} Risk
                  </div>
                </div>
                
                <div className="risk-breakdown">
                  <h4>Risk Factors</h4>
                  <div className="risk-factor">
                    <span>Patient History</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill"
                        style={{ 
                          width: `${riskAssessment.patientHistory * 100}%`,
                          backgroundColor: getRiskColor(riskAssessment.tier)
                        }}
                      />
                    </div>
                    <span>{Math.round(riskAssessment.patientHistory * 100)}%</span>
                  </div>
                  
                  <div className="risk-factor">
                    <span>Appointment Details</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill"
                        style={{ 
                          width: `${riskAssessment.appointmentDetails * 100}%`,
                          backgroundColor: getRiskColor(riskAssessment.tier)
                        }}
                      />
                    </div>
                    <span>{Math.round(riskAssessment.appointmentDetails * 100)}%</span>
                  </div>
                  
                  <div className="risk-factor">
                    <span>Clinical Context</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill"
                        style={{ 
                          width: `${riskAssessment.clinicalContext * 100}%`,
                          backgroundColor: getRiskColor(riskAssessment.tier)
                        }}
                      />
                    </div>
                    <span>{Math.round(riskAssessment.clinicalContext * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="interventions-section">
                <h4>Recommended Interventions</h4>
                <div className="interventions-list">
                  {selectedAppointment.interventions.map((intervention, index) => (
                    <div key={index} className="intervention-item">
                      <div className="intervention-info">
                        <h5>{intervention}</h5>
                        <p>{getInterventionDescription(intervention)}</p>
                      </div>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => executeIntervention(selectedAppointment.id, intervention)}
                        disabled={loading}
                      >
                        Execute
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="patient-contact">
                <h4>Patient Contact Information</h4>
                <div className="contact-details">
                  <div className="contact-item">
                    <strong>Email:</strong> {selectedAppointment.patientEmail}
                  </div>
                  <div className="contact-item">
                    <strong>Phone:</strong> {selectedAppointment.patientPhone}
                  </div>
                </div>
                
                <div className="contact-actions">
                  <button className="btn btn-secondary">Send Email</button>
                  <button className="btn btn-secondary">Call Patient</button>
                  <button className="btn btn-secondary">Send SMS</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Statistics */}
        <div className="statistics-panel">
          <h3>System Performance</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">87%</div>
              <div className="stat-label">Show Rate</div>
              <div className="stat-description">Patients attending scheduled appointments</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">45%</div>
              <div className="stat-label">Risk Reduction</div>
              <div className="stat-description">Improvement in no-show rates</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">92%</div>
              <div className="stat-label">Intervention Success</div>
              <div className="stat-description">Successful intervention execution rate</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">$2.3M</div>
              <div className="stat-label">Revenue Saved</div>
              <div className="stat-description">Annual revenue protection from no-shows</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoShowPrevention
