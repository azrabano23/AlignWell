import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Calendar, 
  Shield, 
  Users, 
  ArrowRight, 
  Stethoscope,
  User,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <HeartHandshake className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AlignHer</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Smart Women's Health
            <span className="block text-primary-600">Care Coordination</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            AI-powered triage, intelligent scheduling, and seamless care coordination 
            connecting patients with the right OB/GYN subspecialists at the right time.
          </p>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Doctor Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-6">
                <Stethoscope className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                I'm a Healthcare Provider
              </h3>
              <p className="text-gray-600 mb-6">
                Streamline your practice with intelligent appointment management, 
                automated follow-ups, and comprehensive dashboard analytics.
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Calendar integration & scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  AI-powered follow-up recommendations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  HIPAA-compliant platform
                </li>
              </ul>
              <Link 
                to="/login?role=doctor"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition duration-200 flex items-center justify-center group"
              >
                Get Started as Provider
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition duration-200" />
              </Link>
            </div>

            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-6">
                <User className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                I Need Care
              </h3>
              <p className="text-gray-600 mb-6">
                Get connected with the right women's health specialist through our 
                intelligent triage system and seamless appointment booking.
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Smart symptom triage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Subspecialist matching
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Telehealth options available
                </li>
              </ul>
              <Link 
                to="/login?role=patient"
                className="w-full bg-secondary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-700 transition duration-200 flex items-center justify-center group"
              >
                Find Care Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforming Women's Healthcare
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for OB/GYN subspecialties with evidence-based triage 
              and intelligent care coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600">
                AI-powered appointment optimization with automated no-show prevention 
                and waitlist management.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-6">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Matching</h3>
              <p className="text-gray-600">
                Connect patients with the right subspecialist based on symptoms, 
                history, and clinical guidelines.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">HIPAA Compliant</h3>
              <p className="text-gray-600">
                Enterprise-grade security with encrypted data storage, 
                audit trails, and compliance monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subspecialties Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive OB/GYN Subspecialties
            </h2>
            <p className="text-lg text-gray-600">
              Our platform covers all major women's health subspecialties
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Maternal-Fetal Medicine',
              'Urogynecology & Reconstructive Pelvic Medicine', 
              'Complex/Minimally Invasive Surgery',
              'Reproductive Endocrinology',
              'Gynecologic Oncology',
              'General OB/GYN'
            ].map((specialty) => (
              <div key={specialty} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">{specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HeartHandshake className="h-6 w-6 text-primary-400" />
              <span className="ml-2 text-lg font-semibold">AlignHer</span>
            </div>
            <p className="text-gray-400">
              © 2024 AlignHer. Transforming women's healthcare access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;