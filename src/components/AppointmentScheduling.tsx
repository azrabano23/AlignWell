import React, { useState, useEffect } from 'react'
import './AppointmentScheduling.css'

interface TimeSlot {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  available: boolean
}

interface AppointmentData {
  patientName: string
  patientEmail: string
  patientPhone: string
  reason: string
  preferredDate: string
  preferredTime: string
  urgency: string
  telehealthPreference: boolean
}

const AppointmentScheduling: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    reason: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'Routine',
    telehealthPreference: false
  })

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [result, setResult] = useState<any>(null)

  const urgencyLevels = [
    { value: 'Emergency', label: 'Emergency (Same Day)', color: '#e55a6b' },
    { value: 'Urgent', label: 'Urgent (1-3 Days)', color: '#ff808b' },
    { value: 'Routine', label: 'Routine (1-2 Weeks)', color: '#ebbad1' },
    { value: 'Follow-up', label: 'Follow-up (As Needed)', color: '#7ACAC' }
  ]

  const specialties = [
    'Reproductive Endocrinology',
    'Maternal-Fetal Medicine', 
    'Urogynecology',
    'Gynecologic Oncology',
    'General OB/GYN'
  ]

  // Generate mock available slots
  useEffect(() => {
    const generateMockSlots = () => {
      const slots: TimeSlot[] = []
      const today = new Date()
      
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        const doctors = [
          'Dr. Sarah Johnson (Reproductive Endocrinology)',
          'Dr. Maria Rodriguez (Maternal-Fetal Medicine)',
          'Dr. Jennifer Chen (Urogynecology)',
          'Dr. Lisa Thompson (Gynecologic Oncology)',
          'Dr. Amanda Davis (General OB/GYN)'
        ]
        
        times.forEach(time => {
          doctors.forEach(doctor => {
            const specialty = doctor.split('(')[1]?.replace(')', '') || 'General OB/GYN'
            slots.push({
              id: `${date.toISOString().split('T')[0]}-${time}-${doctor}`,
              date: date.toISOString().split('T')[0],
              time,
              doctor,
              specialty,
              available: Math.random() > 0.3 // 70% availability
            })
          })
        })
      }
      
      return slots.filter(slot => slot.available)
    }

    setAvailableSlots(generateMockSlots())
  }, [])

  const handleInputChange = (field: keyof AppointmentData, value: string | boolean) => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setAppointmentData(prev => ({
      ...prev,
      preferredDate: slot.date,
      preferredTime: slot.time
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setResult({
        appointmentId: 'apt-' + Math.random().toString(36).substr(2, 9),
        patientName: appointmentData.patientName,
        doctor: selectedSlot?.doctor,
        date: selectedSlot?.date,
        time: selectedSlot?.time,
        specialty: selectedSlot?.specialty,
        telehealthPreference: appointmentData.telehealthPreference,
        status: 'confirmed'
      })
    } catch (error) {
      console.error('Appointment booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSlots = availableSlots.filter(slot => {
    if (appointmentData.preferredDate && slot.date !== appointmentData.preferredDate) {
      return false
    }
    return true
  })

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = []
    }
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, TimeSlot[]>)

  if (result) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Appointment Confirmed!</h1>
          <p className="page-subtitle">Your appointment has been successfully scheduled</p>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Appointment Details</h2>
            <p className="card-subtitle">Confirmation #{result.appointmentId}</p>
          </div>
          
          <div className="appointment-details">
            <div className="detail-row">
              <strong>Patient:</strong> {result.patientName}
            </div>
            <div className="detail-row">
              <strong>Doctor:</strong> {result.doctor}
            </div>
            <div className="detail-row">
              <strong>Specialty:</strong> {result.specialty}
            </div>
            <div className="detail-row">
              <strong>Date:</strong> {new Date(result.date).toLocaleDateString()}
            </div>
            <div className="detail-row">
              <strong>Time:</strong> {result.time}
            </div>
            <div className="detail-row">
              <strong>Type:</strong> {result.telehealthPreference ? 'Telehealth' : 'In-Person'}
            </div>
          </div>
          
          <div className="appointment-actions">
            <button className="btn btn-primary">Add to Calendar</button>
            <button className="btn btn-secondary">Reschedule</button>
            <button className="btn btn-secondary" onClick={() => setResult(null)}>
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Appointment Scheduling</h1>
        <p className="page-subtitle">Book your appointment with our healthcare providers</p>
      </div>

      <div className="scheduling-container">
        <div className="progress-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Patient Info</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Select Time</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        {/* Step 1: Patient Information */}
        {step === 1 && (
          <div className="form-section">
            <h3>Patient Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientName">Full Name</label>
                <input
                  type="text"
                  id="patientName"
                  value={appointmentData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="patientEmail">Email</label>
                <input
                  type="email"
                  id="patientEmail"
                  value={appointmentData.patientEmail}
                  onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="patientPhone">Phone Number</label>
              <input
                type="tel"
                id="patientPhone"
                value={appointmentData.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                placeholder="908-555-1234"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea
                id="reason"
                value={appointmentData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Describe your symptoms or reason for the appointment..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Urgency Level</label>
              <div className="urgency-options">
                {urgencyLevels.map(level => (
                  <label key={level.value} className="urgency-option">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={appointmentData.urgency === level.value}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                    />
                    <span 
                      className="urgency-label"
                      style={{ borderColor: level.color }}
                    >
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={appointmentData.telehealthPreference}
                  onChange={(e) => handleInputChange('telehealthPreference', e.target.checked)}
                />
                <span className="checkbox-label">I prefer a telehealth appointment</span>
              </label>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!appointmentData.patientName || !appointmentData.patientEmail || !appointmentData.patientPhone}
              >
                Next: Select Time
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && (
          <div className="time-selection">
            <h3>Available Time Slots</h3>
            <p className="section-description">Select your preferred appointment time</p>

            <div className="calendar-view">
              {Object.entries(groupedSlots).map(([date, slots]) => (
                <div key={date} className="date-group">
                  <h4 className="date-header">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  <div className="time-slots">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        className={`time-slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                        onClick={() => handleSlotSelection(slot)}
                      >
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-doctor">{slot.doctor}</div>
                        <div className="slot-specialty">{slot.specialty}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
              >
                Next: Confirm Appointment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && selectedSlot && (
          <div className="confirmation-section">
            <h3>Confirm Your Appointment</h3>
            
            <div className="appointment-summary">
              <div className="summary-card">
                <h4>Appointment Details</h4>
                <div className="summary-item">
                  <strong>Patient:</strong> {appointmentData.patientName}
                </div>
                <div className="summary-item">
                  <strong>Doctor:</strong> {selectedSlot.doctor}
                </div>
                <div className="summary-item">
                  <strong>Specialty:</strong> {selectedSlot.specialty}
                </div>
                <div className="summary-item">
                  <strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString()}
                </div>
                <div className="summary-item">
                  <strong>Time:</strong> {selectedSlot.time}
                </div>
                <div className="summary-item">
                  <strong>Type:</strong> {appointmentData.telehealthPreference ? 'Telehealth' : 'In-Person'}
                </div>
                <div className="summary-item">
                  <strong>Urgency:</strong> {appointmentData.urgency}
                </div>
              </div>

              <div className="summary-card">
                <h4>Reason for Visit</h4>
                <p className="reason-text">{appointmentData.reason}</p>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Booking Appointment...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentScheduling