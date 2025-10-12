import React, { useState, useEffect } from 'react'

interface Provider {
  id: string
  name: string
  specialty: string
  credentials: string
  hospitalAffiliation: string
  insuranceAccepted: string[]
  availability: TimeSlot[]
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
  capacity: number
  currentBookings: number
}

interface AppointmentRequest {
  patientId: string
  specialty: string
  urgency: 'stat' | 'soon' | 'medium' | 'routine'
  preferredDates: string[]
  preferredTimes: string[]
  telehealthPreference: boolean
  insuranceProvider: string
}

interface SuggestedSlot {
  provider: Provider
  slot: TimeSlot
  score: number
  reasoning: string
}

const AppointmentScheduling: React.FC = () => {
  const [appointmentRequest, setAppointmentRequest] = useState<AppointmentRequest>({
    patientId: 'patient-123',
    specialty: 'Reproductive Endocrinology',
    urgency: 'soon',
    preferredDates: [],
    preferredTimes: [],
    telehealthPreference: true,
    insuranceProvider: 'Blue Cross Blue Shield'
  })
  
  const [providers, setProviders] = useState<Provider[]>([])
  const [suggestedSlots, setSuggestedSlots] = useState<SuggestedSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SuggestedSlot | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState<'search' | 'confirm' | 'confirmed'>('search')

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockProviders: Provider[] = [
      {
        id: 'provider-1',
        name: 'Dr. Sarah Williams',
        specialty: 'Reproductive Endocrinology',
        credentials: 'MD, FACOG',
        hospitalAffiliation: 'City General Hospital',
        insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna'],
        availability: [
          { date: '2024-01-16', time: '9:00 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-16', time: '10:30 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-16', time: '2:00 PM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-17', time: '9:00 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-17', time: '11:00 AM', available: true, capacity: 1, currentBookings: 0 }
        ]
      },
      {
        id: 'provider-2',
        name: 'Dr. Maria Rodriguez',
        specialty: 'Reproductive Endocrinology',
        credentials: 'MD, PhD',
        hospitalAffiliation: 'Metro Medical Center',
        insuranceAccepted: ['Blue Cross Blue Shield', 'UnitedHealth', 'Medicare'],
        availability: [
          { date: '2024-01-16', time: '8:30 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-16', time: '1:30 PM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-18', time: '9:30 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-18', time: '2:30 PM', available: true, capacity: 1, currentBookings: 0 }
        ]
      },
      {
        id: 'provider-3',
        name: 'Dr. Jennifer Chen',
        specialty: 'Reproductive Endocrinology',
        credentials: 'MD, FACOG',
        hospitalAffiliation: 'University Hospital',
        insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medicaid'],
        availability: [
          { date: '2024-01-16', time: '10:00 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-17', time: '8:00 AM', available: true, capacity: 1, currentBookings: 0 },
          { date: '2024-01-17', time: '3:00 PM', available: true, capacity: 1, currentBookings: 0 }
        ]
      }
    ]

    setProviders(mockProviders)
  }, [])

  const searchForSlots = () => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const availableProviders = providers.filter(provider => 
        provider.specialty === appointmentRequest.specialty &&
        provider.insuranceAccepted.includes(appointmentRequest.insuranceProvider)
      )

      const suggestions: SuggestedSlot[] = []
      
      availableProviders.forEach(provider => {
        provider.availability.forEach(slot => {
          if (slot.available && slot.currentBookings < slot.capacity) {
            // Calculate score based on urgency, preferences, and availability
            let score = 100
            
            // Urgency scoring
            if (appointmentRequest.urgency === 'stat' && slot.date === '2024-01-16') {
              score += 20
            } else if (appointmentRequest.urgency === 'soon' && 
                      (slot.date === '2024-01-16' || slot.date === '2024-01-17')) {
              score += 15
            }
            
            // Time preference scoring
            if (appointmentRequest.preferredTimes.includes(slot.time)) {
              score += 10
            }
            
            // Date preference scoring
            if (appointmentRequest.preferredDates.includes(slot.date)) {
              score += 10
            }
            
            suggestions.push({
              provider,
              slot,
              score,
              reasoning: `High availability, matches ${appointmentRequest.urgency} urgency, credentialed specialist`
            })
          }
        })
      })
      
      // Sort by score and take top 3
      const topSuggestions = suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      
      setSuggestedSlots(topSuggestions)
      setIsLoading(false)
    }, 1500)
  }

  const confirmAppointment = (slot: SuggestedSlot) => {
    setSelectedSlot(slot)
    setConfirmationStep('confirm')
  }

  const finalizeAppointment = () => {
    // Simulate appointment booking
    setTimeout(() => {
      setConfirmationStep('confirmed')
    }, 1000)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Appointment Scheduling</h1>
        <p className="page-subtitle">
          Align every appointment with the right specialist at the right time
        </p>
      </div>

      {confirmationStep === 'search' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System pulls provider roster</h3>
            <p className="card-subtitle">Credentialed, insurance accepted, available providers</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Appointment Request Details</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Specialty:</strong> {appointmentRequest.specialty}
                </div>
                <div>
                  <strong>Urgency:</strong> 
                  <span className={`status-badge ${getUrgencyColor(appointmentRequest.urgency)}`} style={{ marginLeft: '0.5rem' }}>
                    {appointmentRequest.urgency.toUpperCase()}
                  </span>
                </div>
                <div>
                  <strong>Insurance:</strong> {appointmentRequest.insuranceProvider}
                </div>
                <div>
                  <strong>Telehealth:</strong> {appointmentRequest.telehealthPreference ? 'Preferred' : 'Not preferred'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <button 
              className="btn btn-primary"
              onClick={searchForSlots}
              disabled={isLoading}
            >
              {isLoading ? 'Searching for available slots...' : 'Find Available Appointments'}
            </button>
          </div>

          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p style={{ marginLeft: '1rem' }}>Searching provider roster and availability...</p>
            </div>
          )}

          {suggestedSlots.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>3 Best Slots Suggested</h4>
              <p style={{ marginBottom: '2rem', color: '#666' }}>
                Based on provider availability + patient calendar preferences
              </p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {suggestedSlots.map((suggestion, index) => (
                  <div key={index} style={{ 
                    background: '#f8f9fa', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '2px solid #e9ecef',
                    borderLeft: '4px solid #667eea'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                          Option {index + 1} - Score: {suggestion.score}/100
                        </h5>
                        <p style={{ margin: '0', color: '#666' }}>{suggestion.reasoning}</p>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => confirmAppointment(suggestion)}
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                      >
                        Select This Slot
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <strong>Provider:</strong> {suggestion.provider.name}
                        <br />
                        <strong>Credentials:</strong> {suggestion.provider.credentials}
                        <br />
                        <strong>Hospital:</strong> {suggestion.provider.hospitalAffiliation}
                      </div>
                      <div>
                        <strong>Date:</strong> {formatDate(suggestion.slot.date)}
                        <br />
                        <strong>Time:</strong> {suggestion.slot.time}
                        <br />
                        <strong>Capacity:</strong> {suggestion.slot.currentBookings}/{suggestion.slot.capacity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {confirmationStep === 'confirm' && selectedSlot && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Confirm Appointment</h3>
            <p className="card-subtitle">Patient confirms via web/SMS/voice agent</p>
          </div>
          
          <div style={{ background: '#e8f5e8', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>Appointment Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Provider:</strong> {selectedSlot.provider.name}
                <br />
                <strong>Specialty:</strong> {selectedSlot.provider.specialty}
                <br />
                <strong>Credentials:</strong> {selectedSlot.provider.credentials}
              </div>
              <div>
                <strong>Date:</strong> {formatDate(selectedSlot.slot.date)}
                <br />
                <strong>Time:</strong> {selectedSlot.slot.time}
                <br />
                <strong>Type:</strong> {appointmentRequest.telehealthPreference ? 'Telehealth' : 'In-person'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Appointment will be logged with:</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
              <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                <li>Audit trail with rules version</li>
                <li>Triage inputs and decision reasoning</li>
                <li>Scheduling confirmation details</li>
                <li>Provider credentialing verification</li>
                <li>Insurance pre-authorization status</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-success"
              onClick={finalizeAppointment}
            >
              Confirm Appointment
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setConfirmationStep('search')}
            >
              Back to Search
            </button>
          </div>
        </div>
      )}

      {confirmationStep === 'confirmed' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: '#28a745' }}>Appointment Confirmed!</h3>
            <p className="card-subtitle">Your appointment has been successfully scheduled</p>
          </div>
          
          <div style={{ background: '#e8f5e8', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>Confirmation Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Appointment ID:</strong> APT-{Date.now().toString().slice(-6)}
                <br />
                <strong>Provider:</strong> {selectedSlot?.provider.name}
                <br />
                <strong>Specialty:</strong> {selectedSlot?.provider.specialty}
              </div>
              <div>
                <strong>Date:</strong> {selectedSlot && formatDate(selectedSlot.slot.date)}
                <br />
                <strong>Time:</strong> {selectedSlot?.slot.time}
                <br />
                <strong>Type:</strong> {appointmentRequest.telehealthPreference ? 'Telehealth' : 'In-person'}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>Next Steps:</h5>
            <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#856404' }}>
              <li>You will receive SMS/email confirmation</li>
              <li>Telehealth link will be sent 24 hours before appointment</li>
              <li>Risk-aware reminders will be sent based on your profile</li>
              <li>Follow-up care plan will be generated after your visit</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setConfirmationStep('search')
                setSelectedSlot(null)
                setSuggestedSlots([])
              }}
            >
              Schedule Another Appointment
            </button>
            <button className="btn btn-secondary">
              View My Appointments
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentScheduling
