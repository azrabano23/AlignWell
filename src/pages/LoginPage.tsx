import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HeartHandshake, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Stethoscope,
  User,
  AlertCircle
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | null>(
    (searchParams.get('role') as 'doctor' | 'patient') || null
  );
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    specialty: ''
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'doctor' || roleParam === 'patient') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!selectedRole) {
        setError('Please select a role to continue');
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        id: `${selectedRole}_${Date.now()}`,
        email: formData.email,
        role: selectedRole,
        firstName: formData.firstName || 'John',
        lastName: formData.lastName || 'Doe',
        specialty: selectedRole === 'doctor' ? formData.specialty : undefined,
        profileCompleted: isLogin // Assume existing users have completed profiles
      };

      login(userData);
      navigate(selectedRole === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!selectedRole) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4\">
        <div className=\"max-w-md w-full\">
          <div className=\"text-center mb-8\">
            <Link to=\"/\" className=\"inline-flex items-center mb-6\">
              <HeartHandshake className=\"h-8 w-8 text-primary-600\" />
              <span className=\"ml-2 text-2xl font-bold text-gray-900\">AlignHer</span>
            </Link>
            <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">Welcome Back</h1>
            <p className=\"text-gray-600\">Choose your role to continue</p>
          </div>

          <div className=\"space-y-4\">
            <button
              onClick={() => setSelectedRole('doctor')}
              className=\"w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition duration-200 text-left group\"
            >
              <div className=\"flex items-center\">
                <div className=\"flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4 group-hover:bg-primary-200 transition duration-200\">
                  <Stethoscope className=\"h-6 w-6 text-primary-600\" />
                </div>
                <div>
                  <h3 className=\"text-lg font-semibold text-gray-900\">Healthcare Provider</h3>
                  <p className=\"text-sm text-gray-600\">Access your practice dashboard</p>
                </div>
                <ArrowRight className=\"h-5 w-5 text-gray-400 ml-auto group-hover:text-primary-600 group-hover:translate-x-1 transition duration-200\" />
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('patient')}
              className=\"w-full p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-secondary-300 hover:shadow-xl transition duration-200 text-left group\"
            >
              <div className=\"flex items-center\">
                <div className=\"flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mr-4 group-hover:bg-secondary-200 transition duration-200\">
                  <User className=\"h-6 w-6 text-secondary-600\" />
                </div>
                <div>
                  <h3 className=\"text-lg font-semibold text-gray-900\">Patient</h3>
                  <p className=\"text-sm text-gray-600\">Find and book appointments</p>
                </div>
                <ArrowRight className=\"h-5 w-5 text-gray-400 ml-auto group-hover:text-secondary-600 group-hover:translate-x-1 transition duration-200\" />
              </div>
            </button>
          </div>

          <div className=\"mt-8 text-center\">
            <Link 
              to=\"/\" 
              className=\"text-sm text-gray-600 hover:text-gray-900 transition duration-200\"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleColor = selectedRole === 'doctor' ? 'primary' : 'secondary';

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4\">
      <div className=\"max-w-md w-full\">
        <div className=\"text-center mb-8\">
          <Link to=\"/\" className=\"inline-flex items-center mb-6\">
            <HeartHandshake className=\"h-8 w-8 text-primary-600\" />
            <span className=\"ml-2 text-2xl font-bold text-gray-900\">AlignHer</span>
          </Link>
          <div className=\"flex items-center justify-center mb-4\">
            <div className={`flex items-center justify-center w-12 h-12 bg-${roleColor}-100 rounded-lg mr-3`}>
              {selectedRole === 'doctor' ? (
                <Stethoscope className={`h-6 w-6 text-${roleColor}-600`} />
              ) : (
                <User className={`h-6 w-6 text-${roleColor}-600`} />
              )}
            </div>
            <div className=\"text-left\">
              <h1 className=\"text-2xl font-bold text-gray-900\">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className=\"text-sm text-gray-600\">
                {selectedRole === 'doctor' ? 'Healthcare Provider' : 'Patient'} Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRole(null)}
            className=\"text-sm text-gray-600 hover:text-gray-900 transition duration-200\"
          >
            Switch Role
          </button>
        </div>

        <div className=\"bg-white rounded-xl shadow-xl p-8 border border-gray-200\">
          {error && (
            <div className=\"mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center\">
              <AlertCircle className=\"h-4 w-4 text-red-500 mr-2\" />
              <span className=\"text-sm text-red-700\">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className=\"space-y-6\">
            {!isLogin && (
              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    First Name
                  </label>
                  <input
                    type=\"text\"
                    name=\"firstName\"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                    Last Name
                  </label>
                  <input
                    type=\"text\"
                    name=\"lastName\"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
                  />
                </div>
              </div>
            )}

            {!isLogin && selectedRole === 'doctor' && (
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  Specialty
                </label>
                <select
                  name=\"specialty\"
                  required
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
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
            )}

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Email Address
              </label>
              <div className=\"relative\">
                <Mail className=\"h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2\" />
                <input
                  type=\"email\"
                  name=\"email\"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className=\"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
                  placeholder=\"you@example.com\"
                />
              </div>
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                Password
              </label>
              <div className=\"relative\">
                <Lock className=\"h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2\" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name=\"password\"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className=\"w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
                  placeholder=\"Enter your password\"
                />
                <button
                  type=\"button\"
                  onClick={() => setShowPassword(!showPassword)}
                  className=\"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600\"
                >
                  {showPassword ? <EyeOff className=\"h-5 w-5\" /> : <Eye className=\"h-5 w-5\" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  Confirm Password
                </label>
                <div className=\"relative\">
                  <Lock className=\"h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2\" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name=\"confirmPassword\"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className=\"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200\"
                    placeholder=\"Confirm your password\"
                  />
                </div>
              </div>
            )}

            <button
              type=\"submit\"
              disabled={loading}
              className={`w-full bg-${roleColor}-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-${roleColor}-700 focus:ring-2 focus:ring-${roleColor}-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <div className=\"h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin\" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className=\"ml-2 h-4 w-4\" />
                </>
              )}
            </button>
          </form>

          <div className=\"mt-6 text-center\">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  specialty: ''
                });
              }}
              className=\"text-sm text-gray-600 hover:text-gray-900 transition duration-200\"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className=\"mt-8 text-center\">
          <Link 
            to=\"/\" 
            className=\"text-sm text-gray-600 hover:text-gray-900 transition duration-200\"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;