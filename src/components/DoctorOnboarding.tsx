import React, { useState } from 'react';
import './DoctorOnboarding.css';

interface DoctorFormData {
  first_name: string;
  last_name: string;
  email: string;
  medical_license_number: string;
  specialty: string;
  years_of_experience: number;
  hospital_affiliation?: string;
  phone_number?: string;
  preferred_working_hours?: string;
  additional_notes?: string;
}

interface OnboardingResponse {
  doctor_id: string;
  status: string;
  message: string;
  generated_history?: string;
}

const DoctorOnboarding: React.FC = () => {
  const [formData, setFormData] = useState<DoctorFormData>({
    first_name: '',
    last_name: '',
    email: '',
    medical_license_number: '',
    specialty: '',
    years_of_experience: 0,
    hospital_affiliation: '',
    phone_number: '',
    preferred_working_hours: '',
    additional_notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OnboardingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    'Internal Medicine',
    'Cardiology',
    'Pediatrics',
    'Emergency Medicine',
    'Surgery',
    'Radiology',
    'Anesthesiology',
    'Dermatology',
    'Neurology',
    'Psychiatry',
    'Oncology',
    'Orthopedics',
    'Ophthalmology',
    'ENT',
    'Gynecology',
    'Urology',
    'Pathology',
    'Family Medicine',
    'Geriatrics',
    'Pulmonology'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_of_experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/onboard-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to onboard doctor');
      }

      const data: OnboardingResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      medical_license_number: '',
      specialty: '',
      years_of_experience: 0,
      hospital_affiliation: '',
      phone_number: '',
      preferred_working_hours: '',
      additional_notes: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="doctor-onboarding">
      <div className="container">
        <h1>Doctor Onboarding</h1>
        <p className="subtitle">
          Complete the form below to onboard a new doctor with AI-generated medical history
        </p>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="success-message">
            <h3>Onboarding Successful!</h3>
            <p><strong>Doctor ID:</strong> {result.doctor_id}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Message:</strong> {result.message}</p>
            
            {result.generated_history && (
              <div className="generated-history">
                <h4>Generated Medical History:</h4>
                <div className="history-content">
                  {result.generated_history.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
            
            <button onClick={resetForm} className="btn btn-secondary">
              Onboard Another Doctor
            </button>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="doctor@hospital.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Professional Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="medical_license_number">Medical License Number *</label>
                  <input
                    type="text"
                    id="medical_license_number"
                    name="medical_license_number"
                    value={formData.medical_license_number}
                    onChange={handleInputChange}
                    required
                    placeholder="MD123456"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialty">Medical Specialty *</label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="years_of_experience">Years of Experience *</label>
                  <input
                    type="number"
                    id="years_of_experience"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="50"
                    placeholder="5"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hospital_affiliation">Hospital Affiliation</label>
                  <input
                    type="text"
                    id="hospital_affiliation"
                    name="hospital_affiliation"
                    value={formData.hospital_affiliation}
                    onChange={handleInputChange}
                    placeholder="City General Hospital"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preferred_working_hours">Preferred Working Hours</label>
                <input
                  type="text"
                  id="preferred_working_hours"
                  name="preferred_working_hours"
                  value={formData.preferred_working_hours}
                  onChange={handleInputChange}
                  placeholder="Monday-Friday 8AM-5PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="additional_notes">Additional Notes</label>
                <textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any additional information about the doctor..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Onboarding...' : 'Onboard Doctor'}
              </button>
              
              <button 
                type="button" 
                onClick={resetForm}
                className="btn btn-secondary"
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorOnboarding;
