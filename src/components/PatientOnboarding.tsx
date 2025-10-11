import React, { useState } from 'react'

interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  insuranceProvider: string
  insuranceNumber: string
  telehealthPreference: boolean
  emergencyContact: string
  emergencyPhone: string
}

interface TriageQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'text' | 'scale'
  options?: string[]
  required: boolean
}

interface TriageResult {
  specialty: string
  urgency: 'stat' | 'soon' | 'medium' | 'routine'
  confidence: number
  reasoning: string
  snomedCodes: string[]
  icd10Codes: string[]
}

const PatientOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'demographics' | 'triage' | 'profile' | 'results'>('demographics')
  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    insuranceProvider: '',
    insuranceNumber: '',
    telehealthPreference: false,
    emergencyContact: '',
    emergencyPhone: ''
  })
  
  const [triageAnswers, setTriageAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [isTriageComplete, setIsTriageComplete] = useState(false)

  const specialties = [
    'Maternal-fetal Medicine',
    'Urogynecology & Reconstructive Pelvic Medicine',
    'Complex/Minimally Invasive Surgery',
    'Reproductive Endocrinology',
    'Gynecologic Oncology',
    'General OB/GYN'
  ]

  const triageQuestions: TriageQuestion[] = [
    {
      id: 'primary_concern',
      question: 'What is your primary health concern today?',
      type: 'multiple-choice',
      options: [
        'Pregnancy-related concerns',
        'Irregular menstrual cycles',
        'Pelvic pain or discomfort',
        'Urinary incontinence',
        'Fertility issues',
        'Menopause symptoms',
        'Cancer screening/prevention',
        'Other'
      ],
      required: true
    },
    {
      id: 'symptom_duration',
      question: 'How long have you been experiencing these symptoms?',
      type: 'multiple-choice',
      options: [
        'Less than 24 hours',
        '1-7 days',
        '1-4 weeks',
        '1-6 months',
        'More than 6 months'
      ],
      required: true
    },
    {
      id: 'pain_level',
      question: 'On a scale of 1-10, how would you rate your current pain level?',
      type: 'scale',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      required: true
    },
    {
      id: 'pregnancy_status',
      question: 'Are you currently pregnant?',
      type: 'multiple-choice',
      options: ['Yes', 'No', 'Unsure'],
      required: true
    },
    {
      id: 'medical_history',
      question: 'Do you have any of the following conditions? (Select all that apply)',
      type: 'multiple-choice',
      options: [
        'PCOS (Polycystic Ovary Syndrome)',
        'Endometriosis',
        'Diabetes',
        'High blood pressure',
        'Thyroid disorders',
        'Cancer history',
        'None of the above'
      ],
      required: true
    },
    {
      id: 'additional_symptoms',
      question: 'Are you experiencing any additional symptoms? Please describe.',
      type: 'text',
      required: false
    }
  ]

  const handleDemographicsChange = (field: keyof PatientFormData, value: string | boolean) => {
    setPatientData(prev => ({ ...prev, [field]: value }))
  }

  const handleTriageAnswer = (questionId: string, answer: string) => {
    setTriageAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const nextTriageQuestion = () => {
    if (currentQuestionIndex < triageQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Complete triage and generate results
      generateTriageResult()
    }
  }

  const prevTriageQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const generateTriageResult = () => {
    // Mock AI triage logic - in real app this would call ElevenLabs API
    const mockResult: TriageResult = {
      specialty: 'Reproductive Endocrinology',
      urgency: 'soon',
      confidence: 87,
      reasoning: 'Based on your symptoms of irregular menstrual cycles and fertility concerns, our AI recommends seeing a Reproductive Endocrinology specialist. Your symptoms suggest hormonal imbalances that require specialized care.',
      snomedCodes: ['44054006', '237600007'],
      icd10Codes: ['N97.9', 'E28.9']
    }
    
    setTriageResult(mockResult)
    setIsTriageComplete(true)
    setCurrentStep('results')
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

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'stat': return 'STAT (Red Flag) - Immediate attention required'
      case 'soon': return 'SOON - Within 72 hours'
      case 'medium': return 'MEDIUM - Within 2 weeks'
      case 'routine': return 'ROUTINE - Standard scheduling'
      default: return 'ROUTINE'
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Onboarding</h1>
        <p className="page-subtitle">
          Reduce friction + ensure right subspecialist referral with AI-powered smart triage
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {['demographics', 'triage', 'profile', 'results'].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: currentStep === step ? '#667eea' : '#e9ecef',
                    color: currentStep === step ? 'white' : '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </div>
                <span style={{ marginLeft: '0.5rem', color: currentStep === step ? '#667eea' : '#6c757d' }}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
                {index < 3 && (
                  <div style={{ width: '50px', height: '2px', background: '#e9ecef', margin: '0 1rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentStep === 'demographics' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Account Creation</h3>
            <p className="card-subtitle">Patient enters demographics, insurance, telehealth preference</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('triage') }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>First Name *</label>
                <input
                  type="text"
                  value={patientData.firstName}
                  onChange={(e) => handleDemographicsChange('firstName', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Last Name *</label>
                <input
                  type="text"
                  value={patientData.lastName}
                  onChange={(e) => handleDemographicsChange('lastName', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Email *</label>
                <input
                  type="email"
                  value={patientData.email}
                  onChange={(e) => handleDemographicsChange('email', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Phone *</label>
                <input
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => handleDemographicsChange('phone', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Date of Birth *</label>
                <input
                  type="date"
                  value={patientData.dateOfBirth}
                  onChange={(e) => handleDemographicsChange('dateOfBirth', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Insurance Provider *</label>
                <select
                  value={patientData.insuranceProvider}
                  onChange={(e) => handleDemographicsChange('insuranceProvider', e.target.value)}
                  required
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
                >
                  <option value="">Select insurance</option>
                  <option value="Aetna">Aetna</option>
                  <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  <option value="Cigna">Cigna</option>
                  <option value="UnitedHealth">UnitedHealth</option>
                  <option value="Medicare">Medicare</option>
                  <option value="Medicaid">Medicaid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
              <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Insurance Number *</label>
              <input
                type="text"
                value={patientData.insuranceNumber}
                onChange={(e) => handleDemographicsChange('insuranceNumber', e.target.value)}
                required
                style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="telehealth"
                checked={patientData.telehealthPreference}
                onChange={(e) => handleDemographicsChange('telehealthPreference', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="telehealth" style={{ fontWeight: '600', color: '#333' }}>
                I prefer telehealth appointments when possible
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">
                Continue to Smart Triage →
              </button>
            </div>
          </form>
        </div>
      )}

      {currentStep === 'triage' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Smart Triage (Voice + Web)</h3>
            <p className="card-subtitle">ElevenLabs voice agent OR chatbot runs stepwise questionnaire</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0', color: '#333' }}>
                Question {currentQuestionIndex + 1} of {triageQuestions.length}
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={prevTriageQuestion}
                  disabled={currentQuestionIndex === 0}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                  ← Previous
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={nextTriageQuestion}
                  disabled={!triageAnswers[triageQuestions[currentQuestionIndex].id]}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                  Next →
                </button>
              </div>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                {triageQuestions[currentQuestionIndex].question}
              </h4>
              
              {triageQuestions[currentQuestionIndex].type === 'multiple-choice' && (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {triageQuestions[currentQuestionIndex].options?.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={triageQuestions[currentQuestionIndex].id}
                        value={option}
                        checked={triageAnswers[triageQuestions[currentQuestionIndex].id] === option}
                        onChange={(e) => handleTriageAnswer(triageQuestions[currentQuestionIndex].id, e.target.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              
              {triageQuestions[currentQuestionIndex].type === 'scale' && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  {triageQuestions[currentQuestionIndex].options?.map((value) => (
                    <label key={value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={triageQuestions[currentQuestionIndex].id}
                        value={value}
                        checked={triageAnswers[triageQuestions[currentQuestionIndex].id] === value}
                        onChange={(e) => handleTriageAnswer(triageQuestions[currentQuestionIndex].id, e.target.value)}
                        style={{ marginRight: '0.25rem' }}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              )}
              
              {triageQuestions[currentQuestionIndex].type === 'text' && (
                <textarea
                  value={triageAnswers[triageQuestions[currentQuestionIndex].id] || ''}
                  onChange={(e) => handleTriageAnswer(triageQuestions[currentQuestionIndex].id, e.target.value)}
                  placeholder="Please describe your symptoms..."
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', minHeight: '100px' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === 'results' && triageResult && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Triage Results</h3>
            <p className="card-subtitle">AI-powered specialty recommendation and urgency assessment</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>Recommended Specialty</h4>
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ margin: '0', color: '#1976d2' }}>{triageResult.specialty}</h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1976d2' }}>
                  Confidence: {triageResult.confidence}%
                </p>
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>Urgency Level</h4>
              <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <span className={`status-badge ${getUrgencyColor(triageResult.urgency)}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  {triageResult.urgency.toUpperCase()}
                </span>
                <p style={{ margin: '0.5rem 0 0 0', color: '#f57c00' }}>
                  {getUrgencyText(triageResult.urgency)}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>AI Reasoning</h4>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
              <p style={{ margin: '0', lineHeight: '1.6' }}>{triageResult.reasoning}</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>SNOMED Codes</h4>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                {triageResult.snomedCodes.map((code, index) => (
                  <span key={index} style={{ 
                    background: '#e9ecef', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    margin: '0.25rem', 
                    display: 'inline-block',
                    fontSize: '0.9rem'
                  }}>
                    {code}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#333' }}>ICD-10 Codes</h4>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                {triageResult.icd10Codes.map((code, index) => (
                  <span key={index} style={{ 
                    background: '#e9ecef', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    margin: '0.25rem', 
                    display: 'inline-block',
                    fontSize: '0.9rem'
                  }}>
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary">
              Schedule Appointment →
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentStep('demographics')}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientOnboarding
