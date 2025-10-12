import React, { useState } from 'react'
import './SmartTriage.css'

interface TriageData {
  symptoms: string[]
  medicalHistory: string[]
  allergies: string[]
  currentMedications: string[]
  additionalInfo: string
}

interface TriageResult {
  recommendedProcedure: string
  doctorVisitNeeded: string
  urgencyLevel: string
  rationale: string
  suggestedSpecialist?: string
}

const SmartTriage: React.FC = () => {
  const [triageData, setTriageData] = useState<TriageData>({
    symptoms: [],
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
    additionalInfo: ''
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TriageResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const commonSymptoms = [
    'Abdominal pain', 'Back pain', 'Bleeding', 'Bloating', 'Breast changes',
    'Chest pain', 'Constipation', 'Cough', 'Diarrhea', 'Dizziness',
    'Fatigue', 'Fever', 'Headache', 'Irregular periods', 'Joint pain',
    'Mood changes', 'Nausea', 'Pelvic pain', 'Rash', 'Shortness of breath',
    'Sleep problems', 'Swelling', 'Urinary issues', 'Vaginal discharge', 'Weight changes'
  ]

  const commonConditions = [
    'Anxiety', 'Asthma', 'Diabetes', 'High blood pressure', 'Depression',
    'Heart disease', 'Thyroid disorder', 'Arthritis', 'Migraines', 'PCOS',
    'Endometriosis', 'Fibroids', 'Ovarian cysts', 'Breast cancer', 'Cervical cancer'
  ]

  const handleSymptomToggle = (symptom: string) => {
    setTriageData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const handleConditionToggle = (condition: string) => {
    setTriageData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock AI-powered triage assessment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate AI analysis based on symptoms
      const mockResult = generateMockTriageResult(triageData)
      setResult(mockResult)
    } catch (err) {
      setError('Triage assessment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateMockTriageResult = (data: TriageData): TriageResult => {
    const { symptoms, medicalHistory } = data
    
    // Simple rule-based logic for demo
    if (symptoms.includes('Chest pain') || symptoms.includes('Shortness of breath')) {
      return {
        recommendedProcedure: 'Immediate evaluation with ECG and chest X-ray',
        doctorVisitNeeded: 'Yes',
        urgencyLevel: 'Emergency',
        rationale: 'Chest pain and shortness of breath require immediate medical evaluation to rule out cardiac or pulmonary emergencies.',
        suggestedSpecialist: 'Emergency Medicine or Cardiology'
      }
    }
    
    if (symptoms.includes('Severe abdominal pain') || symptoms.includes('Bleeding')) {
      return {
        recommendedProcedure: 'Pelvic examination and ultrasound',
        doctorVisitNeeded: 'Yes',
        urgencyLevel: 'Urgent',
        rationale: 'Severe abdominal pain and bleeding require prompt evaluation to assess for gynecological emergencies.',
        suggestedSpecialist: 'OB/GYN'
      }
    }
    
    if (symptoms.includes('Irregular periods') || symptoms.includes('Pelvic pain')) {
      return {
        recommendedProcedure: 'Hormonal evaluation and pelvic ultrasound',
        doctorVisitNeeded: 'Yes',
        urgencyLevel: 'Routine',
        rationale: 'Irregular periods and pelvic pain suggest possible hormonal or structural issues that require evaluation.',
        suggestedSpecialist: 'Reproductive Endocrinology'
      }
    }
    
    if (symptoms.includes('Fatigue') && symptoms.includes('Weight changes')) {
      return {
        recommendedProcedure: 'Thyroid function tests and metabolic panel',
        doctorVisitNeeded: 'Yes',
        urgencyLevel: 'Routine',
        rationale: 'Fatigue with weight changes may indicate thyroid dysfunction or metabolic issues.',
        suggestedSpecialist: 'Endocrinology'
      }
    }
    
    // Default for minor symptoms
    return {
      recommendedProcedure: 'Rest, hydration, and over-the-counter pain relief as needed',
      doctorVisitNeeded: 'No',
      urgencyLevel: 'Self-Care',
      rationale: 'Based on the reported symptoms, self-care measures are appropriate. Monitor for worsening symptoms.',
      suggestedSpecialist: 'Primary Care'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return '#e55a6b'
      case 'Urgent': return '#ff808b'
      case 'Routine': return '#ebbad1'
      case 'Self-Care': return '#7ACAC'
      default: return '#666'
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Smart Triage System</h1>
        <p className="page-subtitle">AI-powered assessment for personalized care recommendations</p>
      </div>

      {!result ? (
        <div className="triage-container">
          <div className="triage-form">
            <div className="form-section">
              <h3>Current Symptoms</h3>
              <p className="section-description">Select all symptoms you're currently experiencing:</p>
              <div className="checkbox-grid">
                {commonSymptoms.map(symptom => (
                  <label key={symptom} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={triageData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                    />
                    <span className="checkbox-label">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Medical History</h3>
              <p className="section-description">Select any conditions you have been diagnosed with:</p>
              <div className="checkbox-grid">
                {commonConditions.map(condition => (
                  <label key={condition} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={triageData.medicalHistory.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                    />
                    <span className="checkbox-label">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="allergies">Known Allergies</label>
                <input
                  type="text"
                  id="allergies"
                  value={triageData.allergies.join(', ')}
                  onChange={(e) => setTriageData(prev => ({
                    ...prev,
                    allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                  placeholder="List any known allergies (e.g., penicillin, shellfish)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="medications">Current Medications</label>
                <input
                  type="text"
                  id="medications"
                  value={triageData.currentMedications.join(', ')}
                  onChange={(e) => setTriageData(prev => ({
                    ...prev,
                    currentMedications: e.target.value.split(',').map(m => m.trim()).filter(m => m)
                  }))}
                  placeholder="List current medications"
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  value={triageData.additionalInfo}
                  onChange={(e) => setTriageData(prev => ({
                    ...prev,
                    additionalInfo: e.target.value
                  }))}
                  placeholder="Describe any additional symptoms or concerns..."
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={handleSubmit}
                disabled={loading || triageData.symptoms.length === 0}
              >
                {loading ? 'Analyzing Symptoms...' : 'Get AI Assessment'}
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="triage-results">
          <div className="result-header">
            <h2>AI Assessment Results</h2>
            <p className="assessment-timestamp">Assessment completed at {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="result-cards">
            <div className="result-card">
              <h3>Recommended Procedure</h3>
              <p className="result-text">{result.recommendedProcedure}</p>
            </div>

            <div className="result-card">
              <h3>Doctor Visit Required</h3>
              <p className={`result-text ${result.doctorVisitNeeded === 'Yes' ? 'urgent' : 'routine'}`}>
                {result.doctorVisitNeeded}
              </p>
            </div>

            <div className="result-card">
              <h3>Urgency Level</h3>
              <div 
                className="urgency-badge"
                style={{ backgroundColor: getUrgencyColor(result.urgencyLevel) }}
              >
                {result.urgencyLevel}
              </div>
            </div>

            {result.suggestedSpecialist && (
              <div className="result-card">
                <h3>Suggested Specialist</h3>
                <p className="result-text">{result.suggestedSpecialist}</p>
              </div>
            )}
          </div>

          <div className="rationale-section">
            <h3>Assessment Rationale</h3>
            <p className="rationale-text">{result.rationale}</p>
          </div>

          <div className="result-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setResult(null)}
            >
              New Assessment
            </button>
            {result.doctorVisitNeeded === 'Yes' && (
              <button className="btn btn-primary">
                Schedule Appointment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartTriage
