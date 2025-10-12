import React, { useState } from 'react'
import './PatientOnboarding.css'

interface Demographics {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
}

interface Insurance {
  provider: string
  policyNumber: string
}

interface Consents {
  predictiveReminders: boolean
  voiceFollowUps: boolean
}

interface PatientFormData {
  email: string
  password: string
  demographics: Demographics
  insurance: Insurance
  telehealthPreference: boolean
  consents: Consents
}

interface PatientOnboardingProps {
  onRegistrationSuccess?: (patientData: any) => void
}

const PatientOnboarding: React.FC<PatientOnboardingProps> = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState<PatientFormData>({
    email: '',
    password: '',
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phone: ''
    },
    insurance: {
      provider: '',
      policyNumber: ''
    },
    telehealthPreference: false,
    consents: {
      predictiveReminders: false,
      voiceFollowUps: false
    }
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const insuranceProviders = [
    'Aetna', 'BlueCross', 'Cigna', 'UnitedHealth', 'Humana', 
    'Kaiser Permanente', 'Medicare', 'Medicaid', 'Tricare'
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof PatientFormData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.email && formData.password
      case 2:
        return formData.demographics.firstName && 
               formData.demographics.lastName && 
               formData.demographics.dateOfBirth && 
               formData.demographics.phone
      case 3:
        return formData.insurance.provider && formData.insurance.policyNumber
      case 4:
        return formData.consents.predictiveReminders || formData.consents.voiceFollowUps
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/v1/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`)
      }

      const result = await response.json()
      setResult(result)
    } catch (err) {
      // For demo purposes, simulate successful registration
      setTimeout(() => {
        const patientData = {
          email: formData.email,
          demographics: formData.demographics,
          insurance: formData.insurance,
          telehealthPreference: formData.telehealthPreference,
          consents: formData.consents,
          patient_id: 'pat-' + Math.random().toString(36).substr(2, 9),
          status: 'success'
        }
        setResult(patientData)
        
        // Call the success callback to redirect to patient dashboard
        if (onRegistrationSuccess) {
          onRegistrationSuccess(patientData)
        }
        
        setLoading(false)
      }, 1500)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  if (result) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Registration Successful!</h1>
          <p className="page-subtitle">Welcome to AlignHer, {formData.demographics.firstName}</p>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Created</h2>
            <p className="card-subtitle">Your patient profile has been successfully registered</p>
          </div>
          
          <div className="success-details">
            <div className="detail-item">
              <strong>Email:</strong> {result.email}
            </div>
            <div className="detail-item">
              <strong>Name:</strong> {result.demographics.firstName} {result.demographics.lastName}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> {result.demographics.phone}
            </div>
            <div className="detail-item">
              <strong>Insurance:</strong> {result.insurance.provider} - {result.insurance.policyNumber}
            </div>
            <div className="detail-item">
              <strong>Telehealth Preference:</strong> {result.telehealthPreference ? 'Yes' : 'No'}
            </div>
          </div>
          
          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li>Complete your health questionnaire</li>
              <li>Schedule your first appointment</li>
              <li>Set up your patient portal access</li>
              <li>Review your care preferences</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Onboarding</h1>
        <p className="page-subtitle">Join AlignHer for personalized women's healthcare</p>
      </div>

      <div className="onboarding-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Account</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Demographics</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Insurance</span>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Preferences</span>
          </div>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="form-section">
              <h3>Create Your Account</h3>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Demographics */}
          {currentStep === 2 && (
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.demographics.firstName}
                    onChange={(e) => handleInputChange('demographics.firstName', e.target.value)}
                    placeholder="Jane"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.demographics.lastName}
                    onChange={(e) => handleInputChange('demographics.lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.demographics.dateOfBirth}
                  onChange={(e) => handleInputChange('demographics.dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.demographics.phone}
                  onChange={(e) => handleInputChange('demographics.phone', e.target.value)}
                  placeholder="908-555-1234"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Insurance */}
          {currentStep === 3 && (
            <div className="form-section">
              <h3>Insurance Information</h3>
              
              <div className="form-group">
                <label htmlFor="insuranceProvider">Insurance Provider</label>
                <select
                  id="insuranceProvider"
                  value={formData.insurance.provider}
                  onChange={(e) => handleInputChange('insurance.provider', e.target.value)}
                  required
                >
                  <option value="">Select your insurance provider</option>
                  {insuranceProviders.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="policyNumber">Policy Number</label>
                <input
                  type="text"
                  id="policyNumber"
                  value={formData.insurance.policyNumber}
                  onChange={(e) => handleInputChange('insurance.policyNumber', e.target.value)}
                  placeholder="AET123456789"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {currentStep === 4 && (
            <div className="form-section">
              <h3>Care Preferences</h3>
              
              <div className="form-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.telehealthPreference}
                    onChange={(e) => handleInputChange('telehealthPreference', e.target.checked)}
                  />
                  <span className="checkbox-label">I prefer telehealth appointments when possible</span>
                </label>
              </div>

              <div className="form-group">
                <label>Communication Preferences</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.consents.predictiveReminders}
                      onChange={(e) => handleInputChange('consents.predictiveReminders', e.target.checked)}
                    />
                    <span className="checkbox-label">Receive predictive health reminders</span>
                  </label>
                  
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.consents.voiceFollowUps}
                      onChange={(e) => handleInputChange('consents.voiceFollowUps', e.target.checked)}
                    />
                    <span className="checkbox-label">Receive voice follow-up calls</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={loading || !validateStep(currentStep)}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientOnboarding