import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HeartHandshake, 
  User, 
  Calendar, 
  Users, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Shield,
  Clock,
  UserPlus
} from 'lucide-react';

const DoctorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    specialty: user?.specialty || '',
    medicalLicenseNumber: '',
    npiNumber: '',
    phoneNumber: '',
    bio: '',
    languagesSpoken: ['English'],
    boardCertifications: [''],
    hospitalAffiliations: [{ name: '', role: '' }],
    insuranceAccepted: [{ name: '', type: 'primary' }],
    emergencyContact: { name: '', relationship: '', phone: '' }
  });

  const [scheduleData, setScheduleData] = useState({
    calendarProvider: 'manual',
    manualBlocks: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', type: 'available' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', type: 'available' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', type: 'available' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', type: 'available' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', type: 'available' }
    ]
  });

  const [staffData, setStaffData] = useState({
    staffMembers: [{ name: '', email: '', role: 'receptionist' }]
  });

  const steps = [
    { number: 1, title: 'Profile Information', icon: User },
    { number: 2, title: 'Schedule Setup', icon: Calendar },
    { number: 3, title: 'Staff Management', icon: Users },
    { number: 4, title: 'Complete Setup', icon: CheckCircle }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section: 'profile' | 'schedule' | 'staff'
  ) => {
    const { name, value } = e.target;
    
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [name]: value }));
    } else if (section === 'schedule') {
      setScheduleData(prev => ({ ...prev, [name]: value }));
    } else if (section === 'staff') {
      setStaffData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (
    index: number,
    field: string,
    value: string,
    arrayName: string,
    section: 'profile' | 'schedule' | 'staff'
  ) => {
    if (section === 'profile') {
      setProfileData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName as keyof typeof prev].map((item: any, i: number) => 
          i === index ? (typeof item === 'string' ? value : { ...item, [field]: value }) : item
        )
      }));
    } else if (section === 'staff') {
      setStaffData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName as keyof typeof prev].map((item: any, i: number) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const addArrayItem = (arrayName: string, section: 'profile' | 'staff') => {
    if (section === 'profile') {
      if (arrayName === 'boardCertifications' || arrayName === 'languagesSpoken') {
        setProfileData(prev => ({
          ...prev,
          [arrayName]: [...prev[arrayName as keyof typeof prev], '']
        }));
      } else if (arrayName === 'hospitalAffiliations') {
        setProfileData(prev => ({
          ...prev,
          hospitalAffiliations: [...prev.hospitalAffiliations, { name: '', role: '' }]
        }));
      } else if (arrayName === 'insuranceAccepted') {
        setProfileData(prev => ({
          ...prev,
          insuranceAccepted: [...prev.insuranceAccepted, { name: '', type: 'primary' }]
        }));
      }
    } else if (section === 'staff') {
      setStaffData(prev => ({
        ...prev,
        staffMembers: [...prev.staffMembers, { name: '', email: '', role: 'receptionist' }]
      }));
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to save all data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile as completed
      updateUser({ profileCompleted: true });
      
      // Navigate to dashboard
      navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className=\"space-y-6\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  First Name *
                </label>
                <input
                  type=\"text\"
                  name=\"firstName\"
                  required
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange(e, 'profile')}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                />
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  Last Name *
                </label>
                <input
                  type=\"text\"
                  name=\"lastName\"
                  required
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange(e, 'profile')}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                />
              </div>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Medical Specialty *
              </label>
              <select
                name=\"specialty\"
                required
                value={profileData.specialty}
                onChange={(e) => handleInputChange(e, 'profile')}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
              >
                <option value=\"\">Select your specialty</option>
                <option value=\"maternal-fetal-medicine\">Maternal-Fetal Medicine</option>
                <option value=\"urogynecology\">Urogynecology & Reconstructive Pelvic Medicine</option>
                <option value=\"minimally-invasive-surgery\">Complex/Minimally Invasive Surgery</option>
                <option value=\"reproductive-endocrinology\">Reproductive Endocrinology</option>
                <option value=\"gynecologic-oncology\">Gynecologic Oncology</option>
                <option value=\"general-obgyn\">General OB/GYN</option>
              </select>
            </div>

            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  Medical License Number *
                </label>
                <input
                  type=\"text\"
                  name=\"medicalLicenseNumber\"
                  required
                  value={profileData.medicalLicenseNumber}
                  onChange={(e) => handleInputChange(e, 'profile')}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                />
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  NPI Number *
                </label>
                <input
                  type=\"text\"
                  name=\"npiNumber\"
                  required
                  value={profileData.npiNumber}
                  onChange={(e) => handleInputChange(e, 'profile')}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                />
              </div>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Phone Number *
              </label>
              <input
                type=\"tel\"
                name=\"phoneNumber\"
                required
                value={profileData.phoneNumber}
                onChange={(e) => handleInputChange(e, 'profile')}
                className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Professional Bio
              </label>
              <textarea
                name=\"bio\"
                rows={4}
                value={profileData.bio}
                onChange={(e) => handleInputChange(e, 'profile')}
                placeholder=\"Brief description of your practice and expertise...\"
                className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
              />
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Hospital Affiliations
              </label>
              {profileData.hospitalAffiliations.map((affiliation, index) => (
                <div key={index} className=\"grid grid-cols-2 gap-4 mb-3\">
                  <input
                    type=\"text\"
                    placeholder=\"Hospital name\"
                    value={affiliation.name}
                    onChange={(e) => handleArrayInputChange(index, 'name', e.target.value, 'hospitalAffiliations', 'profile')}
                    className=\"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                  />
                  <input
                    type=\"text\"
                    placeholder=\"Role/Department\"
                    value={affiliation.role}
                    onChange={(e) => handleArrayInputChange(index, 'role', e.target.value, 'hospitalAffiliations', 'profile')}
                    className=\"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                  />
                </div>
              ))}
              <button
                type=\"button\"
                onClick={() => addArrayItem('hospitalAffiliations', 'profile')}
                className=\"text-primary-600 hover:text-primary-700 text-sm font-medium\"
              >
                + Add Hospital Affiliation
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className=\"space-y-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-4\">
                How would you like to manage your schedule?
              </label>
              <div className=\"space-y-4\">
                <label className=\"flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer\">
                  <input
                    type=\"radio\"
                    name=\"calendarProvider\"
                    value=\"google\"
                    checked={scheduleData.calendarProvider === 'google'}
                    onChange={(e) => handleInputChange(e, 'schedule')}
                    className=\"mr-3\"
                  />
                  <Calendar className=\"h-5 w-5 text-primary-600 mr-3\" />
                  <div>
                    <div className=\"font-medium\">Google Calendar Integration</div>
                    <div className=\"text-sm text-gray-600\">Sync with your existing Google Calendar</div>
                  </div>
                </label>
                <label className=\"flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer\">
                  <input
                    type=\"radio\"
                    name=\"calendarProvider\"
                    value=\"outlook\"
                    checked={scheduleData.calendarProvider === 'outlook'}
                    onChange={(e) => handleInputChange(e, 'schedule')}
                    className=\"mr-3\"
                  />
                  <Calendar className=\"h-5 w-5 text-primary-600 mr-3\" />
                  <div>
                    <div className=\"font-medium\">Outlook Calendar Integration</div>
                    <div className=\"text-sm text-gray-600\">Sync with your Microsoft Outlook calendar</div>
                  </div>
                </label>
                <label className=\"flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer\">
                  <input
                    type=\"radio\"
                    name=\"calendarProvider\"
                    value=\"manual\"
                    checked={scheduleData.calendarProvider === 'manual'}
                    onChange={(e) => handleInputChange(e, 'schedule')}
                    className=\"mr-3\"
                  />
                  <Clock className=\"h-5 w-5 text-primary-600 mr-3\" />
                  <div>
                    <div className=\"font-medium\">Manual Schedule Blocks</div>
                    <div className=\"text-sm text-gray-600\">Set up availability manually</div>
                  </div>
                </label>
              </div>
            </div>

            {scheduleData.calendarProvider === 'manual' && (
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-4\">
                  Weekly Availability
                </label>
                <div className=\"space-y-4\">
                  {scheduleData.manualBlocks.map((block, index) => (
                    <div key={block.day} className=\"flex items-center space-x-4 p-4 bg-gray-50 rounded-lg\">
                      <div className=\"w-20 font-medium\">{block.day}</div>
                      <input
                        type=\"time\"
                        value={block.startTime}
                        className=\"px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500\"
                      />
                      <span className=\"text-gray-500\">to</span>
                      <input
                        type=\"time\"
                        value={block.endTime}
                        className=\"px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500\"
                      />
                      <select className=\"px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500\">
                        <option value=\"available\">Available</option>
                        <option value=\"busy\">Busy</option>
                        <option value=\"break\">Break</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className=\"space-y-6\">
            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-4\">
                Staff Members (Optional)
              </label>
              <p className=\"text-sm text-gray-600 mb-4\">
                Add staff members who can help manage appointments and patient communication.
              </p>
              
              {staffData.staffMembers.map((staff, index) => (
                <div key={index} className=\"grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4\">
                  <input
                    type=\"text\"
                    placeholder=\"Full name\"
                    value={staff.name}
                    onChange={(e) => handleArrayInputChange(index, 'name', e.target.value, 'staffMembers', 'staff')}
                    className=\"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                  />
                  <input
                    type=\"email\"
                    placeholder=\"Email address\"
                    value={staff.email}
                    onChange={(e) => handleArrayInputChange(index, 'email', e.target.value, 'staffMembers', 'staff')}
                    className=\"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                  />
                  <select
                    value={staff.role}
                    onChange={(e) => handleArrayInputChange(index, 'role', e.target.value, 'staffMembers', 'staff')}
                    className=\"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500\"
                  >
                    <option value=\"admin\">Admin</option>
                    <option value=\"nurse\">Nurse</option>
                    <option value=\"receptionist\">Receptionist</option>
                    <option value=\"assistant\">Assistant</option>
                  </select>
                </div>
              ))}
              
              <button
                type=\"button\"
                onClick={() => addArrayItem('staffMembers', 'staff')}
                className=\"flex items-center text-primary-600 hover:text-primary-700 font-medium\"
              >
                <UserPlus className=\"h-4 w-4 mr-2\" />
                Add Staff Member
              </button>
            </div>

            <div className=\"bg-blue-50 border border-blue-200 rounded-lg p-4\">
              <div className=\"flex items-start\">
                <Shield className=\"h-5 w-5 text-blue-600 mr-3 mt-0.5\" />
                <div>
                  <h4 className=\"font-medium text-blue-900 mb-1\">Role-Based Access Control</h4>
                  <p className=\"text-sm text-blue-700\">
                    Staff members will receive appropriate access permissions based on their role. 
                    Admin users get full access, while assistants have limited patient information access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className=\"text-center space-y-6\">
            <div className=\"flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto\">
              <CheckCircle className=\"h-12 w-12 text-green-600\" />
            </div>
            <div>
              <h3 className=\"text-2xl font-bold text-gray-900 mb-2\">Setup Complete!</h3>
              <p className=\"text-gray-600 mb-8\">
                Your AlignHer provider profile is ready. You can now start managing appointments 
                and accessing your dashboard.
              </p>
              
              <div className=\"grid grid-cols-2 gap-6 text-left\">
                <div className=\"bg-primary-50 border border-primary-200 rounded-lg p-4\">
                  <Stethoscope className=\"h-6 w-6 text-primary-600 mb-2\" />
                  <h4 className=\"font-medium text-gray-900 mb-1\">Profile Verified</h4>
                  <p className=\"text-sm text-gray-600\">Your medical credentials and specialty information are saved.</p>
                </div>
                
                <div className=\"bg-secondary-50 border border-secondary-200 rounded-lg p-4\">
                  <Calendar className=\"h-6 w-6 text-secondary-600 mb-2\" />
                  <h4 className=\"font-medium text-gray-900 mb-1\">Schedule Ready</h4>
                  <p className=\"text-sm text-gray-600\">Your availability is configured and ready for appointments.</p>
                </div>
                
                <div className=\"bg-green-50 border border-green-200 rounded-lg p-4\">
                  <Users className=\"h-6 w-6 text-green-600 mb-2\" />
                  <h4 className=\"font-medium text-gray-900 mb-1\">Team Access</h4>
                  <p className=\"text-sm text-gray-600\">Staff members have appropriate access permissions.</p>
                </div>
                
                <div className=\"bg-blue-50 border border-blue-200 rounded-lg p-4\">
                  <Shield className=\"h-6 w-6 text-blue-600 mb-2\" />
                  <h4 className=\"font-medium text-gray-900 mb-1\">HIPAA Compliant</h4>
                  <p className=\"text-sm text-gray-600\">All data is encrypted and audit trails are active.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Header */}
      <div className=\"bg-white border-b border-gray-200\">
        <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center\">
              <HeartHandshake className=\"h-8 w-8 text-primary-600\" />
              <span className=\"ml-2 text-2xl font-bold text-gray-900\">AlignHer</span>
            </div>
            <button
              onClick={logout}
              className=\"text-gray-600 hover:text-gray-900 text-sm\"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className=\"bg-white border-b border-gray-200\">
        <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
          <div className=\"flex items-center justify-between\">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <div key={step.number} className=\"flex items-center\">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : isActive 
                      ? 'border-primary-600 text-primary-600 bg-white' 
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className=\"h-5 w-5\" />
                    ) : (
                      <Icon className=\"h-5 w-5\" />
                    )}
                  </div>
                  <div className=\"ml-3\">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-8 ${
                      step.number < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
        <div className=\"bg-white rounded-xl shadow-lg border border-gray-200 p-8\">
          <div className=\"mb-8\">
            <h2 className=\"text-3xl font-bold text-gray-900 mb-2\">
              {steps[currentStep - 1].title}
            </h2>
            <p className=\"text-gray-600\">
              {currentStep === 1 && 'Complete your professional profile and credentials'}
              {currentStep === 2 && 'Set up your availability and calendar preferences'}
              {currentStep === 3 && 'Configure staff access and permissions'}
              {currentStep === 4 && 'Review and finalize your provider setup'}
            </p>
          </div>

          {renderStepContent()}

          <div className=\"flex justify-between mt-12 pt-8 border-t border-gray-200\">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className=\"flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed\"
            >
              <ArrowLeft className=\"h-4 w-4 mr-2\" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className=\"flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700\"
              >
                Next
                <ArrowRight className=\"h-4 w-4 ml-2\" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className=\"flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50\"
              >
                {loading ? (
                  <div className=\"h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2\" />
                ) : (
                  <CheckCircle className=\"h-5 w-5 mr-2\" />
                )}
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOnboarding;