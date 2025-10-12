import React, { useState, useEffect } from 'react'

interface CancelledAppointment {
  id: string
  patientName: string
  originalDate: string
  originalTime: string
  specialty: string
  provider: string
  cancellationReason: string
  cancelledAt: string
  slotHeldUntil: string
}

interface WaitlistPatient {
  id: string
  name: string
  specialty: string
  urgency: 'stat' | 'soon' | 'medium' | 'routine'
  riskBucket: 'low' | 'medium' | 'high'
  waitlistDate: string
  preferredDates: string[]
  contactMethod: 'sms' | 'email' | 'voice'
  severityScore: number
}

interface CascadeOffer {
  id: string
  patientId: string
  slotId: string
  offerMethod: 'sms' | 'email' | 'voice'
  status: 'pending' | 'sent' | 'accepted' | 'declined' | 'expired'
  sentAt?: string
  respondedAt?: string
  response?: string
}

const CancellationCascade: React.FC = () => {
  const [cancelledAppointments, setCancelledAppointments] = useState<CancelledAppointment[]>([])
  const [waitlistPatients, setWaitlistPatients] = useState<WaitlistPatient[]>([])
  const [cascadeOffers, setCascadeOffers] = useState<CascadeOffer[]>([])
  const [activeCascades, setActiveCascades] = useState<string[]>([])

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockCancelledAppointments: CancelledAppointment[] = [
      {
        id: 'cancel-1',
        patientName: 'Sarah Johnson',
        originalDate: '2024-01-16',
        originalTime: '9:00 AM',
        specialty: 'Reproductive Endocrinology',
        provider: 'Dr. Williams',
        cancellationReason: 'Family emergency',
        cancelledAt: '2024-01-15T14:30:00Z',
        slotHeldUntil: '2024-01-15T15:00:00Z'
      },
      {
        id: 'cancel-2',
        patientName: 'Maria Rodriguez',
        originalDate: '2024-01-16',
        originalTime: '2:00 PM',
        specialty: 'Maternal-fetal Medicine',
        provider: 'Dr. Rodriguez',
        cancellationReason: 'Work conflict',
        cancelledAt: '2024-01-15T16:45:00Z',
        slotHeldUntil: '2024-01-15T17:15:00Z'
      }
    ]

    const mockWaitlistPatients: WaitlistPatient[] = [
      {
        id: 'waitlist-1',
        name: 'Jennifer Chen',
        specialty: 'Reproductive Endocrinology',
        urgency: 'soon',
        riskBucket: 'low',
        waitlistDate: '2024-01-10',
        preferredDates: ['2024-01-16', '2024-01-17'],
        contactMethod: 'sms',
        severityScore: 75
      },
      {
        id: 'waitlist-2',
        name: 'Lisa Thompson',
        specialty: 'Reproductive Endocrinology',
        urgency: 'medium',
        riskBucket: 'medium',
        waitlistDate: '2024-01-12',
        preferredDates: ['2024-01-16', '2024-01-18'],
        contactMethod: 'sms',
        severityScore: 60
      },
      {
        id: 'waitlist-3',
        name: 'Amy Davis',
        specialty: 'Maternal-fetal Medicine',
        urgency: 'stat',
        riskBucket: 'high',
        waitlistDate: '2024-01-14',
        preferredDates: ['2024-01-16', '2024-01-17'],
        contactMethod: 'voice',
        severityScore: 95
      },
      {
        id: 'waitlist-4',
        name: 'Rachel Green',
        specialty: 'Reproductive Endocrinology',
        urgency: 'routine',
        riskBucket: 'low',
        waitlistDate: '2024-01-13',
        preferredDates: ['2024-01-17', '2024-01-18'],
        contactMethod: 'email',
        severityScore: 40
      }
    ]

    setCancelledAppointments(mockCancelledAppointments)
    setWaitlistPatients(mockWaitlistPatients)
  }, [])

  const initiateCascade = (cancelledAppointment: CancelledAppointment) => {
    // Find matching waitlist patients by specialty and urgency
    const matchingPatients = waitlistPatients
      .filter(patient => 
        patient.specialty === cancelledAppointment.specialty &&
        patient.preferredDates.includes(cancelledAppointment.originalDate)
      )
      .sort((a, b) => {
        // Sort by severity + risk bucket
        if (a.urgency !== b.urgency) {
          const urgencyOrder = { 'stat': 4, 'soon': 3, 'medium': 2, 'routine': 1 }
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
        }
        return b.severityScore - a.severityScore
      })

    // Create cascade offers for top candidates
    const newOffers: CascadeOffer[] = matchingPatients.slice(0, 3).map((patient, index) => ({
      id: `offer-${Date.now()}-${index}`,
      patientId: patient.id,
      slotId: cancelledAppointment.id,
      offerMethod: patient.contactMethod,
      status: 'pending'
    }))

    setCascadeOffers(prev => [...prev, ...newOffers])
    setActiveCascades(prev => [...prev, cancelledAppointment.id])
  }

  const sendOffer = (offerId: string) => {
    setCascadeOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'sent', sentAt: new Date().toISOString() }
          : offer
      )
    )
  }

  const respondToOffer = (offerId: string, response: 'accepted' | 'declined') => {
    setCascadeOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { 
              ...offer, 
              status: response, 
              respondedAt: new Date().toISOString(),
              response: response === 'accepted' ? 'Confirmed appointment' : 'Declined offer'
            }
          : offer
      )
    )

    if (response === 'accepted') {
      // Cancel other offers for the same slot
      const acceptedOffer = cascadeOffers.find(o => o.id === offerId)
      if (acceptedOffer) {
        setCascadeOffers(prev => 
          prev.map(offer => 
            offer.slotId === acceptedOffer.slotId && offer.id !== offerId
              ? { ...offer, status: 'expired', response: 'Slot filled by another patient' }
              : offer
          )
        )
      }
    }
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'status-critical'
      case 'medium': return 'status-medium'
      case 'low': return 'status-low'
      default: return 'status-low'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'status-low'
      case 'sent': return 'status-medium'
      case 'pending': return 'status-high'
      case 'declined': return 'status-critical'
      case 'expired': return 'status-critical'
      default: return 'status-low'
    }
  }

  const getOfferContent = (offer: CascadeOffer) => {
    const patient = waitlistPatients.find(p => p.id === offer.patientId)
    const cancelledAppointment = cancelledAppointments.find(c => c.id === offer.slotId)
    
    if (!patient || !cancelledAppointment) return ''

    switch (offer.offerMethod) {
      case 'sms':
        return `URGENT: Appointment slot available tomorrow ${cancelledAppointment.originalTime} with ${cancelledAppointment.provider}. Reply YES to confirm, NO to decline.`
      case 'email':
        return `Appointment Opportunity: ${cancelledAppointment.originalDate} at ${cancelledAppointment.originalTime} with ${cancelledAppointment.provider}`
      case 'voice':
        return `Press 1 to confirm appointment tomorrow ${cancelledAppointment.originalTime} with ${cancelledAppointment.provider}, 2 to reschedule, 3 to decline.`
      default:
        return 'Appointment offer'
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cancellation Cascade</h1>
        <p className="page-subtitle">
          Never let a slot go unused - Virtual re-offer cascade to waitlist patients
        </p>
      </div>

      {/* Cancelled Appointments */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cancelled Appointments</h3>
          <p className="card-subtitle">Appointment canceled → system holds slot for 30 min</p>
        </div>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cancelledAppointments.map(appointment => (
            <div key={appointment.id} style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef',
              borderLeft: '4px solid #dc3545'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{appointment.patientName}</h4>
                  <p style={{ margin: '0', color: '#666' }}>
                    {appointment.originalDate} at {appointment.originalTime}
                    <br />
                    {appointment.specialty} - {appointment.provider}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="status-badge status-critical">CANCELLED</span>
                  <br />
                  <small style={{ color: '#666' }}>
                    Slot held until: {new Date(appointment.slotHeldUntil).toLocaleTimeString()}
                  </small>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Reason:</strong> {appointment.cancellationReason}
                <br />
                <strong>Cancelled at:</strong> {new Date(appointment.cancelledAt).toLocaleString()}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem'}}>
                {!activeCascades.includes(appointment.id) ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => initiateCascade(appointment)}
                  >
                    Initiate Cascade
                  </button>
                ) : (
                  <span className="status-badge status-medium">CASCADE ACTIVE</span>
                )}
                <button className="btn btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist Management */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Waitlist Patients</h3>
          <p className="card-subtitle">Ranked by severity + risk bucket</p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Specialty</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Urgency</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Risk Bucket</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Severity Score</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Contact Method</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e9ecef' }}>Waitlist Date</th>
              </tr>
            </thead>
            <tbody>
              {waitlistPatients
                .sort((a, b) => b.severityScore - a.severityScore)
                .map(patient => (
                <tr key={patient.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '1rem' }}>{patient.name}</td>
                  <td style={{ padding: '1rem' }}>{patient.specialty}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge ${getUrgencyColor(patient.urgency)}`}>
                      {patient.urgency.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge ${getRiskColor(patient.riskBucket)}`}>
                      {patient.riskBucket.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <strong>{patient.severityScore}%</strong>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge ${patient.contactMethod === 'voice' ? 'status-high' : patient.contactMethod === 'sms' ? 'status-medium' : 'status-low'}`}>
                      {patient.contactMethod.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(patient.waitlistDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cascade Offers */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Virtual Re-offer Cascade</h3>
          <p className="card-subtitle">Offer slot to top candidates by severity + risk bucket</p>
        </div>
        
        {cascadeOffers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No active cascade offers. Initiate a cascade from a cancelled appointment above.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {cascadeOffers.map(offer => {
              const patient = waitlistPatients.find(p => p.id === offer.patientId)
              const cancelledAppointment = cancelledAppointments.find(c => c.id === offer.slotId)
              
              return (
                <div key={offer.id} style={{ 
                  background: '#f8f9fa', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e9ecef',
                  borderLeft: '4px solid #667eea'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                        {patient?.name} - {offer.offerMethod.toUpperCase()} Offer
                      </h4>
                      <p style={{ margin: '0', color: '#666' }}>
                        Slot: {cancelledAppointment?.originalDate} at {cancelledAppointment?.originalTime}
                        <br />
                        Provider: {cancelledAppointment?.provider}
                      </p>
                    </div>
                    <span className={`status-badge ${getStatusColor(offer.status)}`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Offer Content:</strong>
                    <div style={{ background: '#e9ecef', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                      {getOfferContent(offer)}
                    </div>
                  </div>
                  
                  {offer.sentAt && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Sent:</strong> {new Date(offer.sentAt).toLocaleString()}
                    </div>
                  )}
                  
                  {offer.response && (
                    <div style={{ background: '#e8f5e8', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
                      <strong>Response:</strong> {offer.response}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {offer.status === 'pending' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => sendOffer(offer.id)}
                      >
                        Send Offer
                      </button>
                    )}
                    {offer.status === 'sent' && (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => respondToOffer(offer.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => respondToOffer(offer.id, 'declined')}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {offer.status === 'accepted' && (
                      <span className="status-badge status-low">SLOT FILLED</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cascade Statistics */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cascade Performance</h3>
          <p className="card-subtitle">Track slot utilization and response rates</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>Slots Recovered</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#2e7d32' }}>
              {cascadeOffers.filter(o => o.status === 'accepted').length}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#2e7d32' }}>
              {cancelledAppointments.length} total cancelled
            </p>
          </div>
          <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>Response Rate</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#f57c00' }}>
              {cascadeOffers.length > 0 ? Math.round((cascadeOffers.filter(o => o.status === 'accepted' || o.status === 'declined').length / cascadeOffers.length) * 100) : 0}%
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#f57c00' }}>
              Patient engagement
            </p>
          </div>
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Avg Response Time</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#1976d2' }}>
              2.3h
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#1976d2' }}>
              Time to fill slot
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancellationCascade
