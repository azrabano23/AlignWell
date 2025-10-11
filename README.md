# AlignWell MedEd Tool

A comprehensive medical education platform for simulated doctor onboarding with AI-powered features, calendar integration, and HIPAA-compliant data management.

## 🏥 Overview

AlignWell is designed to streamline the doctor onboarding process in medical education environments. It features a complete workflow from account creation to dashboard analytics, with AI-generated follow-up plans and calendar synchronization.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Database**: AWS DynamoDB (HIPAA-compliant)
- **AI**: AWS Bedrock (Claude 3 Sonnet)
- **Calendar**: Google Calendar API
- **Deployment**: Serverless-ready (Lambda + Docker)

## ✨ Features

### Core Workflow
1. **Account Creation**: Complete doctor profiles with credentials, insurance, and hospital affiliations
2. **Schedule Setup**: Google Calendar sync or manual schedule blocks
3. **Delegation**: Role-based IAM for staff access control
4. **Dashboard**: Simulated metrics and AI-generated follow-up plans

### Technical Features
- **HIPAA Compliance**: DynamoDB encryption with AWS KMS
- **AI Integration**: AWS Bedrock for follow-up plan generation
- **Calendar Sync**: Google Calendar API integration
- **Role-Based Access**: IAM roles for staff delegation
- **Audit Logging**: CloudWatch integration
- **Serverless Ready**: Lambda deployment with Mangum

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- AWS Account with DynamoDB and Bedrock access
- Google Cloud Project with Calendar API enabled

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your AWS credentials and Google API settings

# Set up DynamoDB table
python setup_dynamodb.py

# Configure Google Calendar
python google_calendar_setup.py

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📋 API Endpoints

### Core Endpoints
- `POST /onboard-doctor` - Complete doctor onboarding workflow
- `GET /doctor/{doctor_id}` - Get doctor profile
- `GET /doctors` - List all doctors
- `PUT /doctor/{doctor_id}/status` - Update onboarding status
- `GET /doctor/{doctor_id}/dashboard` - Get dashboard metrics

### Utility Endpoints
- `GET /` - API information
- `GET /health` - Health check

## 🔧 Configuration

### Environment Variables

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB Configuration
DYNAMODB_TABLE=AlignWell-Doctors

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Google Calendar Configuration
GOOGLE_CREDENTIALS_FILE=credentials.json
GOOGLE_TOKEN_FILE=token.json
```

## 🗄️ Database Schema

### DynamoDB Table: `AlignWell-Doctors`

**Primary Key**: `doctor_id` (String)

**Global Secondary Index**: `EmailIndex`
- **Partition Key**: `email` (String)

**Attributes**:
- `doctor_id`: String (Primary Key)
- `email`: String (GSI Key)
- `first_name`: String
- `last_name`: String
- `specialty`: String
- `medical_license_number`: String
- `npi_number`: String
- `phone_number`: String
- `board_certifications`: List[String]
- `insurance_accepted`: List[Object]
- `hospital_affiliations`: List[Object]
- `calendar_sync_enabled`: Boolean
- `calendar_provider`: String
- `manual_schedule_blocks`: List[Object]
- `staff_members`: List[Object]
- `bio`: String
- `languages_spoken`: List[String]
- `emergency_contact`: Object
- `onboarding_status`: String
- `created_at`: String (ISO 8601)
- `updated_at`: String (ISO 8601)

## 🤖 AI Features

### Follow-up Plan Generation
The system uses AWS Bedrock with Claude 3 Sonnet to generate comprehensive follow-up care plans based on:

- Doctor's specialty
- Professional experience
- Hospital affiliations
- Best practices for the specialty

Generated plans include:
- Standard follow-up protocols
- Recommended appointment intervals
- Key metrics to monitor
- Patient education topics
- Referral criteria
- Emergency contact protocols

## 📅 Calendar Integration

### Google Calendar Sync
- OAuth 2.0 authentication
- Recurring availability blocks
- Real-time synchronization
- Privacy controls

### Manual Schedule Blocks
- Custom time slots
- Recurring patterns
- Block types (available, busy, break)
- Day-of-week scheduling

## 👥 Staff Delegation

### Role-Based Access Control
- **Admin**: Full access to all functions
- **Nurse**: Patient care and appointment management
- **Receptionist**: Scheduling and patient information
- **Assistant**: Basic patient information access

### IAM Role Creation
Automatically creates AWS IAM roles for each staff member with appropriate permissions based on their role.

## 🔒 Security & Compliance

### HIPAA Compliance
- DynamoDB encryption with AWS KMS
- Audit logging to CloudWatch
- Secure credential management
- Role-based access control

### Data Protection
- Input validation and sanitization
- Secure API endpoints
- Encrypted data storage
- Audit trail maintenance

## 🚀 Deployment

### Serverless Deployment
```bash
# Install Serverless Framework
npm install -g serverless
npm install -g serverless-python-requirements

# Deploy to AWS
cd backend
serverless deploy
```

### Docker Deployment
```bash
# Build image
cd backend
docker build -t alignwell-meded-tool .

# Run container
docker run -p 8000:8000 --env-file .env alignwell-meded-tool
```

## 🧪 Testing

### API Testing
```bash
cd backend
python test_alignwell_api.py
```

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test onboarding
curl -X POST http://localhost:8000/onboard-doctor \
  -H "Content-Type: application/json" \
  -d @sample_doctor.json
```

## 📚 Documentation

- **Backend API**: [backend/README.md](backend/README.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **Setup Guide**: [SETUP.md](SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section in [backend/README.md](backend/README.md)
2. Review the API documentation
3. Check the logs for error messages
4. Create an issue in the repository

---

**AlignWell MedEd Tool - Empowering Medical Education** 🏥✨