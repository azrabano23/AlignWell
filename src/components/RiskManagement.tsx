import React, { useState, useEffect } from 'react'

interface Patient {
  id: string
  name: string
  appointmentDate: string
  appointmentTime: string
  specialty: string
  riskScore: number
  riskFactors: string[]
  lastAppointment: string
  responsivenessScore: number
  chronicConditions: string[]
  communicationPreference: 'sms' | 'email' | 'voice'
}

interface RiskProfile {
  attendance: number
  responsiveness: number
  timeFriction: number
  chronicConditionFlags: number
  overallRisk: number
}

interface OutreachAction {
  id: string
  patientId: string
  type: 'sms' | 'email' | 'voice_call'
  status: 'pending' | 'sent' | 'delivered' | 'responded' | 'failed'
  scheduledTime: string
  content: string
  response?: string
}

const RiskManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [outreachActions, setOutreachActions] = useState<OutreachAction[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [riskThresholds, setRiskThresholds] = useState({
    low: 30,
    medium: 60,
    high: 80
  })

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: 'patient-1',
        name: 'Sarah Johnson',
        appointmentDate: '2024-01-16',
        appointmentTime: '9:00 AM',
        specialty: 'Reproductive Endocrinology',
        riskScore: 25,
        riskFactors: ['Good attendance history', 'Responsive to reminders'],
        lastAppointment: '2023-12-15',
        responsivenessScore: 95,
        chronicConditions: [],
        communicationPreference: 'sms'
      },
      {
        id: 'patient-2',
        name: 'Maria Rodriguez',
        appointmentDate: '2024-01-16',
        appointmentTime: '10:30 AM',
        specialty: 'Maternal-fetal Medicine',
        riskScore: 65,
        riskFactors: ['Missed 2 appointments in past year', 'Slow response to reminders'],
        lastAppointment: '2023-11-20',
        responsivenessScore: 60,
        chronicConditions: ['Diabetes', 'High blood pressure'],
        communicationPreference: 'sms'
      },
      {
        id: 'patient-3',
        name: 'Jennifer Chen',
        appointmentDate: '2024-01-16',
        appointmentTime: '2:00 PM',
        specialty: 'Gynecologic Oncology',
        riskScore: 85,
        riskFactors: ['Multiple missed appointments', 'No response to previous outreach', 'High-risk condition'],
        lastAppointment: '2023-10-10',
        responsivenessScore: 20,
        chronicConditions: ['Cancer history'],
        communicationPreference: 'voice'
      },
      {
        id: 'patient-4',
        name: 'Lisa Thompson',
        appointmentDate: '2024-01-17',
        appointmentTime: '11:00 AM',
        specialty: 'Urogynecology',
        riskScore: 45,
        riskFactors: ['Occasional delays', 'Prefers email communication'],
        lastAppointment: '2023-12-01',
        responsivenessScore: 75,
        chronicConditions: [],
        communicationPreference: 'email'
      }
    ]

    const mockOutreachActions: OutreachAction[] = [
      {
        id: 'outreach-1',
        patientId: 'patient-1',
        type: 'sms',
        status: 'delivered',
        scheduledTime: '2024-01-15T08:00:00Z',
        content: 'Reminder: Your appointment with Dr. Williams is tomorrow at 9:00 AM. Reply STOP to opt out.',
        response: 'Confirmed, thank you!'
      },
      {
        id: 'outreach-2',
        patientId: 'patient-2',
        type: 'sms',
        status: 'sent',
        scheduledTime: '2024-01-15T08:00:00Z',
        content: 'Reminder: Your appointment with Dr. Rodriguez is tomorrow at 10:30 AM. Need to reschedule? Reply RESCHEDULE.'
      },
      {
        id: 'outreach-3',
        patientId: 'patient-3',
        type: 'voice_call',
        status: 'pending',
        scheduledTime: '2024-01-15T14:00:00Z',
        content: 'High-priority call: Confirming appointment with Dr. Chen tomorrow at 2:00 PM. Press 1 to confirm, 2 to reschedule, 3 for telehealth option.'
      }
    ]

    setPatients(mockPatients)
    setOutreachActions(mockOutreachActions)
  }, [])

  const getRiskLevel = (score: number) => {
    if (score >= riskThresholds.high) return 'high'
    if (score >= riskThresholds.medium) return 'medium'
    return 'low'
  }

  const getRiskColor = (score: number) => {
    const level = getRiskLevel(score)
    switch (level) {
      case 'high': return 'status-critical'
      case 'medium': return 'status-medium'
      case 'low': return 'status-low'
      default: return 'status-low'
    }
  }

  const getOutreachStrategy = (patient: Patient) => {
    const riskLevel = getRiskLevel(patient.riskScore)
    
    switch (riskLevel) {
      case 'low':
        return {
          strategy: 'SMS/email reminders only',
          actions: ['SMS reminder 24h before', 'Email confirmation'],
          intensity: 'Low'
        }
      case 'medium':
        return {
          strategy: 'SMS + easy reschedule option',
          actions: ['SMS reminder with reschedule link', 'Follow-up email', '1-click reschedule'],
          intensity: 'Medium'
        }
      case 'high':
        return {
          strategy: 'Voice call + care coordinator alert',
          actions: ['Outbound voice call', 'Care coordinator notification', 'Auto-offer telehealth'],
          intensity: 'High'
        }
      default:
        return {
          strategy: 'Standard reminders',
          actions: ['SMS reminder'],
          intensity: 'Low'
        }
    }
  }

  const triggerOutreach = (patientId: string, type: 'sms' | 'email' | 'voice_call') => {
    const patient = patients.find(p => p.id === patientId)
    if (!patient) return

    const newOutreach: OutreachAction = {
      id: `outreach-${Date.now()}`,
      patientId,
      type,
      status: 'pending',
      scheduledTime: new Date().toISOString(),
      content: generateOutreachContent(patient, type)
    }

    setOutreachActions(prev => [...prev, newOutreach])
  }

  const generateOutreachContent = (patient: Patient, type: string): string => {
    const riskLevel = getRiskLevel(patient.riskScore)
    
    switch (type) {
      case 'sms':
        if (riskLevel === 'low') {
          return `Reminder: Your appointment with Dr. ${patient.specialty} is tomorrow at ${patient.appointmentTime}. Reply STOP to opt out.`
        } else if (riskLevel === 'medium') {
          return `Reminder: Your appointment with Dr. ${patient.specialty} is tomorrow at ${patient.appointmentTime}. Need to reschedule? Reply RESCHEDULE.`
        } else {
          return `URGENT: Your appointment with Dr. ${patient.specialty} is tomorrow at ${patient.appointmentTime}. Please confirm ASAP.`
        }
      case 'email':
        return `Appointment Reminder - ${patient.appointmentDate} at ${patient.appointmentTime}`
      case 'voice_call':
        return `High-priority call: Confirming appointment with Dr. ${patient.specialty} tomorrow at ${patient.appointmentTime}. Press 1 to confirm, 2 to reschedule, 3 for telehealth option.`
      default:
        return 'Appointment reminder'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'status-low'
      case 'sent': return 'status-medium'
      case 'pending': return 'status-high'
      case 'failed': return 'status-critical'
      default: return 'status-low'
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Risk-Aware No-Show Prevention</h1>
        <p className="page-subtitle">
          Reduce cancellations + increase follow-through with AI-powered risk scoring
        </p>
      </div>

      {/* Risk Scoring Engine Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Risk Scoring Engine</h3>
          <p className="card-subtitle">Trained on attendance, responsiveness, time friction, chronic condition flags</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Low Risk</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', color: '#2e7d32' }}>
              {patients.filter(p => getRiskLevel(p.riskScore) === 'low').length}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#2e7d32' }}>
              SMS/email reminders only
            </p>
          </div>
          <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>Medium Risk</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', color: '#f57c00' }}>
              {patients.filter(p => getRiskLevel(p.riskScore) === 'medium').length}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#f57c00' }}>
              SMS + reschedule prompt
            </p>
          </div>
          <div style={{ background: '#ffebee', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>High Risk</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', color: '#d32f2f' }}>
              {patients.filter(p => getRiskLevel(p.riskScore) === 'high').length}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#d32f2f' }}>
              Voice call + coordinator alert
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Risk Factors Analysis</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Attendance History:</strong> 40% weight
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                  <div style={{ background: '#28a745', height: '100%', width: '75%', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Responsiveness:</strong> 30% weight
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                  <div style={{ background: '#ffc107', height: '100%', width: '60%', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Time Friction:</strong> 20% weight
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                  <div style={{ background: '#dc3545', height: '100%', width: '85%', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <strong>Chronic Conditions:</strong> 10% weight
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                  <div style={{ background: '#6f42c1', height: '100%', width: '45%', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Outreach Channels by Risk Bucket</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2e7d32' }}>Low Risk:</strong> Text reminders
                <br />
                <small style={{ color: '#666' }}>Standard SMS/email notifications</small>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#f57c00' }}>Medium Risk:</strong> Text + reschedule prompt
                <br />
                <small style={{ color: '#666' }}>SMS + follow-up email with easy reschedule</small>
              </div>
              <div>
                <strong style={{ color: '#d32f2f' }}>High Risk:</strong> Outbound voice call
                <br />
                <small style={{ color: '#666' }}>Voice call + care coordinator alert</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Risk Management */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Patient Risk Management</h3>
          <p className="card-subtitle">Monitor and manage high-risk patients</p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Appointment</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Risk Score</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Strategy</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => {
                const strategy = getOutreachStrategy(patient)
                return (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong>{patient.name}</strong>
                        <br />
                        <small style={{ color: '#666' }}>{patient.specialty}</small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        {new Date(patient.appointmentDate).toLocaleDateString()}
                        <br />
                        <small style={{ color: '#666' }}>{patient.appointmentTime}</small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-badge ${getRiskColor(patient.riskScore)}`}>
                        {patient.riskScore}% - {getRiskLevel(patient.riskScore).toUpperCase()}
                      </span>
                      <br />
                      <small style={{ color: '#666' }}>
                        Responsiveness: {patient.responsivenessScore}%
                      </small>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <strong>{strategy.strategy}</strong>
                        <br />
                        <small style={{ color: '#666' }}>Intensity: {strategy.intensity}</small>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {strategy.actions.map((action, index) => (
                          <button
                            key={index}
                            className={`btn ${getRiskLevel(patient.riskScore) === 'high' ? 'btn-danger' : getRiskLevel(patient.riskScore) === 'medium' ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => {
                              const type = action.includes('SMS') ? 'sms' : 
                                         action.includes('email') ? 'email' : 'voice_call'
                              triggerOutreach(patient.id, type as 'sms' | 'email' | 'voice_call')
                            }}
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                          >
                            {action.includes('SMS') ? 'SMS' : 
                             action.includes('email') ? 'Email' : 
                             action.includes('Voice') ? 'Voice' : 'Action'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outreach Actions Tracking */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Outreach Actions Tracking</h3>
          <p className="card-subtitle">Monitor delivery and response rates</p>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {outreachActions.map(action => {
            const patient = patients.find(p => p.id === action.patientId)
            return (
              <div key={action.id} style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid #e9ecef'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{patient?.name}</strong> - {action.type.toUpperCase()}
                    <br />
                    <small style={{ color: '#666' }}>
                      Scheduled: {new Date(action.scheduledTime).toLocaleString()}
                    </small>
                  </div>
                  <span className={`status-badge ${getStatusColor(action.status)}`}>
                    {action.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Content:</strong> {action.content}
                </div>
                {action.response && (
                  <div style={{ background: '#e8f5e8', padding: '0.5rem', borderRadius: '4px' }}>
                    <strong>Response:</strong> {action.response}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RiskManagement
