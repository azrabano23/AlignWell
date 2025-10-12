import React, { useState } from 'react'
import './DoctorOnboarding.css'

interface DoctorFormData {
  email: string
  password: string
  fullName: string
  specialty: string
  credentials: string[]
  acceptedInsurances: string[]
  hospitalAffiliation: string
}

interface DoctorOnboardingProps {
  onRegistrationSuccess?: (doctorData: any) => void
}

const DoctorOnboarding: React.FC<DoctorOnboardingProps> = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    email: '',
    password: '',
    fullName: '',
    specialty: '',
    credentials: [],
    acceptedInsurances: [],
    hospitalAffiliation: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const specialties = [
    'Reproductive Endocrinology',
    'Maternal-Fetal Medicine',
    'Urogynecology & Reconstructive Pelvic Medicine',
    'Complex/Minimally Invasive Surgery',
    'Gynecologic Oncology',
    'General OB/GYN'
  ]

  const insuranceProviders = [
    'Aetna', 'BlueCross', 'Cigna', 'UnitedHealth', 'Humana', 
    'Kaiser Permanente', 'Medicare', 'Medicaid', 'Tricare'
  ]

  const commonCredentials = [
    'MD', 'DO', 'FACOG', 'FACOG-REI', 'FACOG-MFM', 'FACOG-URO', 
    'FACOG-GYN', 'FACOG-MIS', 'FACOG-GYN-ONC', 'RN', 'NP', 'PA'
  ]

  const handleInputChange = (field: keyof DoctorFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCredentialToggle = (credential: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.includes(credential)
        ? prev.credentials.filter(c => c !== credential)
        : [...prev.credentials, credential]
    }))
  }

  const handleInsuranceToggle = (insurance: string) => {
    setFormData(prev => ({
      ...prev,
      acceptedInsurances: prev.acceptedInsurances.includes(insurance)
        ? prev.acceptedInsurances.filter(i => i !== insurance)
        : [...prev.acceptedInsurances, insurance]
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.fullName
      case 2:
        return formData.specialty && formData.credentials.length > 0
      case 3:
        return formData.acceptedInsurances.length > 0 && formData.hospitalAffiliation
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/v1/doctors/register', {
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
        const doctorData = {
          email: formData.email,
          specialty: formData.specialty,
          credentials: formData.credentials,
          hospitalAffiliation: formData.hospitalAffiliation,
          acceptedInsurances: formData.acceptedInsurances,
          doctor_id: 'doc-' + Math.random().toString(36).substr(2, 9),
          status: 'success'
        }
        setResult(doctorData)
        
        // Call the success callback to redirect to doctor dashboard
        if (onRegistrationSuccess) {
          onRegistrationSuccess(doctorData)
        }
        
        setLoading(false)
      }, 1500)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
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
          <p className="page-subtitle">Welcome to AlignHer, Dr. {formData.fullName.split(' ')[1]}</p>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Created</h2>
            <p className="card-subtitle">Your doctor profile has been successfully registered</p>
          </div>
          
          <div className="success-details">
            <div className="detail-item">
              <strong>Email:</strong> {result.email}
            </div>
            <div className="detail-item">
              <strong>Specialty:</strong> {result.specialty}
            </div>
            <div className="detail-item">
              <strong>Credentials:</strong> {result.credentials.join(', ')}
            </div>
            <div className="detail-item">
              <strong>Hospital Affiliation:</strong> {result.hospitalAffiliation}
            </div>
            <div className="detail-item">
              <strong>Accepted Insurances:</strong> {result.acceptedInsurances.join(', ')}
            </div>
          </div>
          
          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li>Complete your profile verification</li>
              <li>Set up your availability calendar</li>
              <li>Configure your appointment preferences</li>
              <li>Start receiving patient referrals</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Onboarding</h1>
        <p className="page-subtitle">Join AlignHer's network of healthcare providers</p>
      </div>

      <div className="onboarding-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Account Info</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Credentials</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Practice Info</span>
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
              <h3>Account Information</h3>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="dr.carter@example.com"
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
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Dr. Evelyn Carter"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Credentials & Specialty */}
          {currentStep === 2 && (
            <div className="form-section">
              <h3>Medical Credentials</h3>
              
              <div className="form-group">
                <label htmlFor="specialty">Primary Specialty</label>
                <select
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  required
                >
                  <option value="">Select your specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Medical Credentials</label>
                <div className="checkbox-grid">
                  {commonCredentials.map(credential => (
                    <label key={credential} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.credentials.includes(credential)}
                        onChange={() => handleCredentialToggle(credential)}
                      />
                      <span className="checkbox-label">{credential}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Practice Information */}
          {currentStep === 3 && (
            <div className="form-section">
              <h3>Practice Information</h3>
              
              <div className="form-group">
                <label>Accepted Insurance Providers</label>
                <div className="checkbox-grid">
                  {insuranceProviders.map(insurance => (
                    <label key={insurance} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.acceptedInsurances.includes(insurance)}
                        onChange={() => handleInsuranceToggle(insurance)}
                      />
                      <span className="checkbox-label">{insurance}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="hospitalAffiliation">Hospital Affiliation</label>
                <input
                  type="text"
                  id="hospitalAffiliation"
                  value={formData.hospitalAffiliation}
                  onChange={(e) => handleInputChange('hospitalAffiliation', e.target.value)}
                  placeholder="New Brunswick General Hospital"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
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

export default DoctorOnboarding