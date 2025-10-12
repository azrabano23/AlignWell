import React, { useState, useEffect } from 'react'

interface Patient {
  id: string
  name: string
  lastAppointment: string
  specialty: string
  conditions: string[]
  followUpType: 'preventive' | 'chronic' | 'acute'
  nextFollowUpDate: string
  interval: string
  riskLevel: 'low' | 'medium' | 'high'
  communicationPreference: 'sms' | 'email' | 'voice'
}

interface FollowUpPlan {
  id: string
  patientId: string
  type: 'PCOS' | 'Menopause' | 'Pap' | 'Mammogram' | 'Pregnancy' | 'Cancer_Screening'
  interval: string
  nextDue: string
  status: 'scheduled' | 'overdue' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  lastReminder?: string
  reminderIntensity: 'text' | 'voice'
}

interface ReminderCampaign {
  id: string
  patientId: string
  followUpId: string
  type: 'predictive' | 'overdue'
  scheduledDate: string
  method: 'sms' | 'email' | 'voice'
  content: string
  status: 'scheduled' | 'sent' | 'delivered' | 'responded'
  response?: string
}

const PredictiveFollowups: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [followUpPlans, setFollowUpPlans] = useState<FollowUpPlan[]>([])
  const [reminderCampaigns, setReminderCampaigns] = useState<ReminderCampaign[]>([])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'plans' | 'campaigns' | 'analytics'>('overview')

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: 'patient-1',
        name: 'Sarah Johnson',
        lastAppointment: '2023-10-15',
        specialty: 'Reproductive Endocrinology',
        conditions: ['PCOS'],
        followUpType: 'chronic',
        nextFollowUpDate: '2024-01-15',
        interval: '3 months',
        riskLevel: 'medium',
        communicationPreference: 'sms'
      },
      {
        id: 'patient-2',
        name: 'Maria Rodriguez',
        lastAppointment: '2023-12-01',
        specialty: 'General OB/GYN',
        conditions: ['Menopause'],
        followUpType: 'chronic',
        nextFollowUpDate: '2024-12-01',
        interval: '1 year',
        riskLevel: 'low',
        communicationPreference: 'email'
      },
      {
        id: 'patient-3',
        name: 'Jennifer Chen',
        lastAppointment: '2023-11-20',
        specialty: 'Gynecologic Oncology',
        conditions: ['Cancer history'],
        followUpType: 'preventive',
        nextFollowUpDate: '2024-02-20',
        interval: '3 months',
        riskLevel: 'high',
        communicationPreference: 'voice'
      },
      {
        id: 'patient-4',
        name: 'Lisa Thompson',
        lastAppointment: '2023-09-10',
        specialty: 'General OB/GYN',
        conditions: [],
        followUpType: 'preventive',
        nextFollowUpDate: '2024-01-10',
        interval: '4 months',
        riskLevel: 'low',
        communicationPreference: 'sms'
      }
    ]

    const mockFollowUpPlans: FollowUpPlan[] = [
      {
        id: 'plan-1',
        patientId: 'patient-1',
        type: 'PCOS',
        interval: '3-6 months',
        nextDue: '2024-01-15',
        status: 'overdue',
        priority: 'high',
        reminderIntensity: 'voice'
      },
      {
        id: 'plan-2',
        patientId: 'patient-2',
        type: 'Menopause',
        interval: 'yearly',
        nextDue: '2024-12-01',
        status: 'scheduled',
        priority: 'low',
        reminderIntensity: 'text'
      },
      {
        id: 'plan-3',
        patientId: 'patient-3',
        type: 'Cancer_Screening',
        interval: '3 months',
        nextDue: '2024-02-20',
        status: 'scheduled',
        priority: 'high',
        reminderIntensity: 'voice'
      },
      {
        id: 'plan-4',
        patientId: 'patient-4',
        type: 'Pap',
        interval: '4 months',
        nextDue: '2024-01-10',
        status: 'overdue',
        priority: 'medium',
        reminderIntensity: 'text'
      }
    ]

    const mockReminderCampaigns: ReminderCampaign[] = [
      {
        id: 'campaign-1',
        patientId: 'patient-1',
        followUpId: 'plan-1',
        type: 'overdue',
        scheduledDate: '2024-01-16',
        method: 'voice',
        content: 'Your PCOS follow-up appointment is overdue. Press 1 to schedule, 2 to reschedule, 3 for telehealth.',
        status: 'scheduled'
      },
      {
        id: 'campaign-2',
        patientId: 'patient-4',
        followUpId: 'plan-4',
        type: 'overdue',
        scheduledDate: '2024-01-16',
        method: 'sms',
        content: 'Your Pap smear is overdue. Schedule now: [LINK]. Reply STOP to opt out.',
        status: 'sent',
        response: 'Scheduled for next week'
      }
    ]

    setPatients(mockPatients)
    setFollowUpPlans(mockFollowUpPlans)
    setReminderCampaigns(mockReminderCampaigns)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'status-critical'
      case 'medium': return 'status-medium'
      case 'low': return 'status-low'
      default: return 'status-low'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-low'
      case 'scheduled': return 'status-medium'
      case 'overdue': return 'status-critical'
      case 'cancelled': return 'status-critical'
      default: return 'status-low'
    }
  }

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'responded': return 'status-low'
      case 'delivered': return 'status-medium'
      case 'sent': return 'status-medium'
      case 'scheduled': return 'status-high'
      default: return 'status-low'
    }
  }

  const getFollowUpTypeDescription = (type: string) => {
    switch (type) {
      case 'PCOS': return 'PCOS check-ins every 3–6 months'
      case 'Menopause': return 'Menopause symptom monitoring yearly'
      case 'Pap': return 'Pap smear screening'
      case 'Mammogram': return 'Mammogram screening'
      case 'Pregnancy': return 'Pregnancy follow-up care'
      case 'Cancer_Screening': return 'Cancer screening and monitoring'
      default: return 'Follow-up care'
    }
  }

  const triggerReminder = (followUpId: string) => {
    const followUp = followUpPlans.find(p => p.id === followUpId)
    const patient = patients.find(p => p.id === followUp?.patientId)
    
    if (!followUp || !patient) return

    const newCampaign: ReminderCampaign = {
      id: `campaign-${Date.now()}`,
      patientId: patient.id,
      followUpId: followUp.id,
      type: followUp.status === 'overdue' ? 'overdue' : 'predictive',
      scheduledDate: new Date().toISOString(),
      method: patient.communicationPreference,
      content: generateReminderContent(followUp, patient),
      status: 'scheduled'
    }

    setReminderCampaigns(prev => [...prev, newCampaign])
  }

  const generateReminderContent = (followUp: FollowUpPlan, patient: Patient): string => {
    const typeDescription = getFollowUpTypeDescription(followUp.type)
    
    switch (patient.communicationPreference) {
      case 'sms':
        return `Reminder: ${typeDescription} is due. Schedule now: [LINK]. Reply STOP to opt out.`
      case 'email':
        return `Follow-up Reminder: ${typeDescription} - Your ${followUp.type} follow-up is due. Please schedule your appointment.`
      case 'voice':
        return `Press 1 to schedule your ${followUp.type} follow-up, 2 to reschedule, 3 for telehealth option.`
      default:
        return 'Follow-up reminder'
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Predictive Follow-ups</h1>
        <p className="page-subtitle">
          Close the loop on chronic + preventive care with AI-powered scheduling
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
            className={`btn ${selectedTab === 'plans' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('plans')}
          >
            📋 Follow-up Plans
          </button>
          <button
            className={`btn ${selectedTab === 'campaigns' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('campaigns')}
          >
            📢 Reminder Campaigns
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
              <h3 className="card-title">Follow-up Care Overview</h3>
              <p className="card-subtitle">After each appointment → system sets a predictive follow-up date</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Active Plans</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#2e7d32' }}>
                  {followUpPlans.length}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#2e7d32' }}>
                  Total follow-up plans
                </p>
              </div>
              <div style={{ background: '#ffebee', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>Overdue</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#d32f2f' }}>
                  {followUpPlans.filter(p => p.status === 'overdue').length}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#d32f2f' }}>
                  Require immediate attention
                </p>
              </div>
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Scheduled</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#1976d2' }}>
                  {followUpPlans.filter(p => p.status === 'scheduled').length}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#1976d2' }}>
                  Upcoming follow-ups
                </p>
              </div>
              <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>Response Rate</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f57c00' }}>
                  78%
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#f57c00' }}>
                  Patient engagement
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Follow-up Types</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>PCOS check-ins:</strong> Every 3–6 months
                    <br />
                    <small style={{ color: '#666' }}>Hormonal monitoring and symptom management</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Menopause symptom monitoring:</strong> Yearly
                    <br />
                    <small style={{ color: '#666' }}>Symptom tracking and treatment adjustments</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Preventive screenings:</strong> Auto-scheduled intervals
                    <br />
                    <small style={{ color: '#666' }}>Pap/mammogram at correct intervals</small>
                  </div>
                  <div>
                    <strong>Cancer follow-up:</strong> 3-month intervals
                    <br />
                    <small style={{ color: '#666' }}>High-risk patient monitoring</small>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Reminder Intensity</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#2e7d32' }}>Low Risk:</strong> Text reminders
                    <br />
                    <small style={{ color: '#666' }}>Standard SMS/email notifications</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#f57c00' }}>Medium Risk:</strong> Text + email
                    <br />
                    <small style={{ color: '#666' }}>Multi-channel approach</small>
                  </div>
                  <div>
                    <strong style={{ color: '#d32f2f' }}>High Risk:</strong> Voice calls
                    <br />
                    <small style={{ color: '#666' }}>Personal outreach for critical follow-ups</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'plans' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Follow-up Plans</h3>
              <p className="card-subtitle">Patients nudged 2–3 weeks before with appropriate intensity</p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Patient</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Follow-up Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Next Due</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Interval</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Priority</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {followUpPlans.map(plan => {
                    const patient = patients.find(p => p.id === plan.patientId)
                    return (
                      <tr key={plan.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '1rem' }}>{patient?.name}</td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <strong>{plan.type}</strong>
                            <br />
                            <small style={{ color: '#666' }}>{getFollowUpTypeDescription(plan.type)}</small>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>{new Date(plan.nextDue).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>{plan.interval}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`status-badge ${getPriorityColor(plan.priority)}`}>
                            {plan.priority.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`status-badge ${getStatusColor(plan.status)}`}>
                            {plan.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className={`btn ${plan.status === 'overdue' ? 'btn-danger' : 'btn-primary'}`}
                              onClick={() => triggerReminder(plan.id)}
                              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            >
                              {plan.status === 'overdue' ? 'Send Urgent Reminder' : 'Send Reminder'}
                            </button>
                            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                              Schedule
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'campaigns' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Reminder Campaigns</h3>
              <p className="card-subtitle">Track delivery and response rates for follow-up reminders</p>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {reminderCampaigns.map(campaign => {
                const patient = patients.find(p => p.id === campaign.patientId)
                const followUp = followUpPlans.find(f => f.id === campaign.followUpId)
                
                return (
                  <div key={campaign.id} style={{ 
                    background: '#f8f9fa', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid #e9ecef',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                          {patient?.name} - {campaign.type.toUpperCase()} Reminder
                        </h4>
                        <p style={{ margin: '0', color: '#666' }}>
                          {followUp?.type} follow-up • {campaign.method.toUpperCase()} • 
                          Scheduled: {new Date(campaign.scheduledDate).toLocaleString()}
                        </p>
                      </div>
                      <span className={`status-badge ${getCampaignStatusColor(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Content:</strong>
                      <div style={{ background: '#e9ecef', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                        {campaign.content}
                      </div>
                    </div>
                    
                    {campaign.response && (
                      <div style={{ background: '#e8f5e8', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        <strong>Response:</strong> {campaign.response}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {campaign.status === 'scheduled' && (
                        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                          Send Now
                        </button>
                      )}
                      {campaign.status === 'sent' && (
                        <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                          Track Delivery
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div>
            <div className="card-header">
              <h3 className="card-title">Follow-up Analytics</h3>
              <p className="card-subtitle">Track performance metrics and patient engagement</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Follow-up Completion Rates</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>PCOS Follow-ups:</strong> 85% completion rate
                    <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                      <div style={{ background: '#28a745', height: '100%', width: '85%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Preventive Screenings:</strong> 92% completion rate
                    <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                      <div style={{ background: '#28a745', height: '100%', width: '92%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Cancer Monitoring:</strong> 78% completion rate
                    <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                      <div style={{ background: '#ffc107', height: '100%', width: '78%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <strong>Menopause Monitoring:</strong> 88% completion rate
                    <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', marginTop: '0.25rem' }}>
                      <div style={{ background: '#28a745', height: '100%', width: '88%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Reminder Effectiveness</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>SMS Reminders:</strong> 65% response rate
                    <br />
                    <small style={{ color: '#666' }}>Average response time: 4.2 hours</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Email Reminders:</strong> 45% response rate
                    <br />
                    <small style={{ color: '#666' }}>Average response time: 12.8 hours</small>
                  </div>
                  <div>
                    <strong>Voice Calls:</strong> 85% response rate
                    <br />
                    <small style={{ color: '#666' }}>Average response time: 0.3 hours</small>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Patient Engagement Trends</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>High Engagement:</strong> 35% of patients
                    <br />
                    <small style={{ color: '#666' }}>Respond within 2 hours</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Medium Engagement:</strong> 45% of patients
                    <br />
                    <small style={{ color: '#666' }}>Respond within 24 hours</small>
                  </div>
                  <div>
                    <strong>Low Engagement:</strong> 20% of patients
                    <br />
                    <small style={{ color: '#666' }}>Require multiple reminders</small>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#333' }}>Predictive Insights</h4>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Risk Prediction Accuracy:</strong> 89%
                    <br />
                    <small style={{ color: '#666' }}>AI correctly identifies high-risk patients</small>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Optimal Reminder Timing:</strong> 2-3 weeks before
                    <br />
                    <small style={{ color: '#666' }}>Highest scheduling success rate</small>
                  </div>
                  <div>
                    <strong>Channel Preference Accuracy:</strong> 92%
                    <br />
                    <small style={{ color: '#666' }}>Correctly matches patient communication preferences</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictiveFollowups
