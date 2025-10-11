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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Doctor Onboarding & Management</h1>
        <p className="page-subtitle">
          Build provider trust + ensure insurance/credentialing compliance
        </p>
      </div>

      {error && (
        <div className="card" style={{ background: '#fee', border: '1px solid #fcc', color: '#c33' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#c33' }}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: '#28a745' }}>Onboarding Successful!</h3>
          </div>
          <p><strong>Doctor ID:</strong> {result.doctor_id}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
          
          {result.generated_history && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.1rem' }}>Generated Medical History:</h4>
              <div style={{ color: '#555', lineHeight: '1.6' }}>
                {result.generated_history.split('\n').map((line, index) => (
                  <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={resetForm} className="btn btn-secondary">
              Onboard Another Doctor
            </button>
          </div>
        </div>
      )}

      {!result && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Account Creation</h3>
            <p className="card-subtitle">Doctor enters name, specialty, credentials, insurance accepted, hospital affiliation</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#333', margin: '0 0 1.5rem 0', fontSize: '1.3rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Personal Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter last name"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="doctor@hospital.com"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1-555-0123"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#333', margin: '0 0 1.5rem 0', fontSize: '1.3rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Professional Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="medical_license_number">Medical License Number *</label>
                  <input
                    type="text"
                    id="medical_license_number"
                    name="medical_license_number"
                    value={formData.medical_license_number}
                    onChange={handleInputChange}
                    required
                    placeholder="MD123456"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="specialty">Medical Specialty *</label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="years_of_experience">Years of Experience *</label>
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
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="hospital_affiliation">Hospital Affiliation</label>
                  <input
                    type="text"
                    id="hospital_affiliation"
                    name="hospital_affiliation"
                    value={formData.hospital_affiliation}
                    onChange={handleInputChange}
                    placeholder="City General Hospital"
                    style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="preferred_working_hours">Preferred Working Hours</label>
                <input
                  type="text"
                  id="preferred_working_hours"
                  name="preferred_working_hours"
                  value={formData.preferred_working_hours}
                  onChange={handleInputChange}
                  placeholder="Monday-Friday 8AM-5PM"
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.9rem' }} htmlFor="additional_notes">Additional Notes</label>
                <textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any additional information about the doctor..."
                  style={{ padding: '0.75rem', border: '2px solid #e1e5e9', borderRadius: '6px', fontSize: '1rem', transition: 'border-color 0.3s ease', background: 'white', resize: 'vertical', minHeight: '100px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e1e5e9' }}>
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
        </div>
      )}
    </div>
  );
};

export default DoctorOnboarding;