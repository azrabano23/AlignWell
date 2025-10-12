import React, { useState } from "react";
import "./MainPage.css";
import WomenSvg from "../assets/women.svg";

interface FeatureCard {
	icon: string;
	title: string;
	description: string;
	benefits: string[];
}

interface MainPageProps {
	setCurrentView: (view: 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention') => void;
}

const MainPage: React.FC<MainPageProps> = ({ setCurrentView }) => {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const features: FeatureCard[] = [
		{
			icon: "MD",
			title: "Doctor Onboarding & Management",
			description: "Build provider trust + ensure insurance/credentialing compliance",
			benefits: [
				"Account Creation with credentials verification",
				"Schedule Setup with calendar sync",
				"Delegation for staff management",
				"Dashboard for appointment approvals",
			],
		},
		{
			icon: "PT",
			title: "Patient Onboarding",
			description: "Reduce friction + ensure right subspecialist referral",
			benefits: [
				"Smart Triage with ElevenLabs voice agent",
				"AI-powered specialty mapping",
				"SNOMED/ICD-10 code generation",
				"Urgency bucket assignment",
			],
		},
		{
			icon: "SC",
			title: "Appointment Scheduling",
			description: "Align every appointment with the right specialist at the right time",
			benefits: [
				"Provider roster with credentialing",
				"Capacity-aware slotting",
				"3 best slots suggested",
				"Complete audit trail",
			],
		},
		{
			icon: "RS",
			title: "Risk-Aware No-Show Prevention",
			description: "Reduce cancellations + increase follow-through",
			benefits: [
				"AI-powered risk scoring engine",
				"Multi-channel outreach strategies",
				"Voice calls for high-risk patients",
				"Care coordinator alerts",
			],
		},
		{
			icon: "CC",
			title: "Cancellation Cascade",
			description: "Never let a slot go unused",
			benefits: [
				"30-minute slot hold system",
				"Virtual re-offer cascade",
				"Risk-based patient ranking",
				"Multi-channel offer system",
			],
		},
		{
			icon: "PF",
			title: "Predictive Follow-ups",
			description: "Close the loop on chronic + preventive care",
			benefits: [
				"PCOS check-ins every 3-6 months",
				"Menopause symptom monitoring",
				"Preventive screening automation",
				"AI-powered reminder intensity",
			],
		},
	];

	const specialties = [
		{ name: "Maternal-fetal Medicine", code: "MFM" },
		{ name: "Urogynecology & Reconstructive Pelvic Medicine", code: "URO" },
		{ name: "Complex/Minimally Invasive Surgery", code: "MIS" },
		{ name: "Reproductive Endocrinology", code: "REI" },
		{ name: "Gynecologic Oncology", code: "GYN" },
		{ name: "General OB/GYN", code: "OBG" },
	];

	const stats = [
		{ number: "89%", label: "Triage Accuracy", description: "AI-powered specialty mapping" },
		{ number: "45%", label: "ROI Improvement", description: "Revenue optimization" },
		{ number: "87%", label: "Auto-Refill Rate", description: "Slot utilization efficiency" },
		{ number: "92%", label: "Follow-up Rate", description: "Patient engagement success" },
	];
	const handleDropdownToggle = (dropdown: string) => {
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
	};

	const doctorDropdownItems = [
		{ id: 'doctor-onboarding', label: 'Doctor Onboarding' },
		{ id: 'doctor-dashboard', label: 'Doctor Dashboard' }
	];

	const patientDropdownItems = [
		{ id: 'patient-onboarding', label: 'Patient Onboarding' },
		{ id: 'patient-dashboard', label: 'Patient Dashboard' }
	];

	const x = Date.now();
	return (
		<div className="page-container">
			{/* Hero Section */}
			<div className="hero-section" style={{ backgroundImage: `url(${WomenSvg}?${x})`}}>
				<div className="hero-content">
					<h1 className="hero-title">AlignHer</h1>
					<p className="hero-subtitle">Women's Health Care Coordination Platform</p>
					<p className="hero-description">
						AI-powered healthcare coordination that reduces missed appointments, improves patient outcomes,
						and optimizes provider efficiency for women's health.
					</p>
					<div className="hero-dropdown">
						<div className="hero-dropdown-container">
							<button
								className={`hero-dropdown-trigger ${activeDropdown === 'hero-users' ? 'active' : ''}`}
								onClick={() => handleDropdownToggle('hero-users')}
							>
								<span>Get Started</span>
								<span className="dropdown-arrow">▼</span>
							</button>
							<div className={`hero-dropdown-menu ${activeDropdown === 'hero-users' ? 'show' : ''}`}>
								<div className="dropdown-section">
									<div className="dropdown-section-title">For Doctors</div>
									{doctorDropdownItems.map((item) => (
										<button
											key={item.id}
											className="dropdown-item"
											onClick={() => setCurrentView(item.id as 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention')}
										>
											{item.label}
										</button>
									))}
								</div>
								<div className="dropdown-section">
									<div className="dropdown-section-title">For Patients</div>
									{patientDropdownItems.map((item) => (
										<button
											key={item.id}
											className="dropdown-item"
											onClick={() => setCurrentView(item.id as 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention')}
										>
											{item.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="stats-section">
				<div className="stats-grid">
					{stats.map((stat, index) => (
						<div key={index} className="stat-card">
							<div className="stat-number">{stat.number}</div>
							<div className="stat-label">{stat.label}</div>
							<div className="stat-description">{stat.description}</div>
						</div>
					))}
				</div>
			</div>

			{/* Features Section */}
			<div className="features-section">
				<div className="section-header">
					<h2 className="section-title">Complete Healthcare Workflow</h2>
					<p className="section-subtitle">End-to-end solution from patient triage to follow-up care</p>
				</div>

				<div className="features-grid">
					{features.map((feature, index) => (
						<div key={index} className="feature-card">
							<div className="feature-icon">{feature.icon}</div>
							<h3 className="feature-title">{feature.title}</h3>
							<p className="feature-description">{feature.description}</p>
							<ul className="feature-benefits">
								{feature.benefits.map((benefit, benefitIndex) => (
									<li key={benefitIndex}>{benefit}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Specialties Section */}
			<div className="specialties-section">
				<div className="section-header">
					<h2 className="section-title">OB/GYN Subspecialties Supported</h2>
					<p className="section-subtitle">AI-powered triage maps patients to the right specialist</p>
				</div>

				<div className="specialties-grid">
					{specialties.map((specialty, index) => (
						<div key={index} className="specialty-card">
							<div className="specialty-icon">{specialty.code}</div>
							<h4 className="specialty-name">{specialty.name}</h4>
						</div>
					))}
				</div>
			</div>

			{/* Navigation Menu */}
			<div className="navigation-section">
				<div className="section-header">
					<h2 className="section-title">Explore All Features</h2>
					<p className="section-subtitle">Navigate through each component of the AlignHer platform</p>
				</div>

				<div className="navigation-grid">
					<div className="nav-card" onClick={() => setCurrentView("smart-triage")}>
						<div className="nav-icon">AI</div>
						<h3>Smart Triage</h3>
						<p>AI-powered symptom assessment</p>
					</div>

					<div className="nav-card" onClick={() => setCurrentView("appointment-scheduling")}>
						<div className="nav-icon">SC</div>
						<h3>Appointment Scheduling</h3>
						<p>Calendar integration and slot matching</p>
					</div>

					{/* Doctor & Patient Dropdown */}
					<div className="nav-card dropdown-card">
						<div className="nav-icon">MD</div>
						<h3>Doctors & Patients</h3>
						<p>Provider and patient management</p>
						<div className="dropdown-container">
							<button
								className={`dropdown-trigger ${activeDropdown === 'users' ? 'active' : ''}`}
								onClick={() => handleDropdownToggle('users')}
							>
								<span>Select User Type</span>
								<span className="dropdown-arrow">▼</span>
							</button>
							<div className={`dropdown-menu ${activeDropdown === 'users' ? 'show' : ''}`}>
								<div className="dropdown-section">
									<div className="dropdown-section-title">Doctors</div>
									{doctorDropdownItems.map((item) => (
										<button
											key={item.id}
											className="dropdown-item"
											onClick={() => setCurrentView(item.id as 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention')}
										>
											{item.label}
										</button>
									))}
								</div>
								<div className="dropdown-section">
									<div className="dropdown-section-title">Patients</div>
									{patientDropdownItems.map((item) => (
										<button
											key={item.id}
											className="dropdown-item"
											onClick={() => setCurrentView(item.id as 'main' | 'doctor-onboarding' | 'doctor-dashboard' | 'patient-onboarding' | 'patient-dashboard' | 'smart-triage' | 'appointment-scheduling' | 'cancellation-cascade' | 'predictive-followups' | 'no-show-prevention')}
										>
											{item.label}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="nav-card" onClick={() => setCurrentView("no-show-prevention")}>
						<div className="nav-icon">NS</div>
						<h3>No-Show Prevention</h3>
						<p>Risk assessment and interventions</p>
					</div>

					<div className="nav-card" onClick={() => setCurrentView("cancellation-cascade")}>
						<div className="nav-icon">CC</div>
						<h3>Cancellation Cascade</h3>
						<p>Automated slot re-offering</p>
					</div>

					<div className="nav-card" onClick={() => setCurrentView("predictive-followups")}>
						<div className="nav-icon">PF</div>
						<h3>Predictive Follow-ups</h3>
						<p>Chronic care management</p>
					</div>
				</div>
			</div>

			{/* Compliance Section */}
			<div className="compliance-section">
				<div className="section-header">
					<h2 className="section-title">HIPAA-Compliant & Secure</h2>
					<p className="section-subtitle">Built with healthcare security and compliance in mind</p>
				</div>

				<div className="compliance-grid">
					<div className="compliance-item">
						<div className="compliance-icon">SEC</div>
						<h4>HIPAA Compliance</h4>
						<p>End-to-end encryption and privacy protection</p>
					</div>

					<div className="compliance-item">
						<div className="compliance-icon">AUD</div>
						<h4>Audit Trail</h4>
						<p>Complete decision logging with rules version tracking</p>
					</div>

					<div className="compliance-item">
						<div className="compliance-icon">CRD</div>
						<h4>Credentialing</h4>
						<p>Automated provider verification and insurance matching</p>
					</div>

					<div className="compliance-item">
						<div className="compliance-icon">AI</div>
						<h4>Triage Accuracy</h4>
						<p>AI-powered specialty mapping with 89% accuracy</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainPage;
