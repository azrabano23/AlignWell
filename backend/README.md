# AlignWell MedEd Tool - Backend API

A comprehensive FastAPI backend for simulated doctor onboarding in the AlignWell Medical Education platform. Features AWS DynamoDB integration, Google Calendar sync, AWS Bedrock GenAI, and serverless deployment capabilities.

## 🏥 Features

### Core Workflow
1. **Account Creation**: Complete doctor profile with credentials, insurance, and hospital affiliations
2. **Schedule Setup**: Google Calendar integration or manual schedule blocks
3. **Delegation**: Role-based IAM for staff access control
4. **Dashboard**: Simulated metrics and follow-up plan generation

### Technical Features
- **HIPAA Compliance**: DynamoDB encryption with AWS KMS
- **AI Integration**: AWS Bedrock (Claude 3 Sonnet) for follow-up plan generation
- **Calendar Sync**: Google Calendar API integration
- **Role-Based Access**: IAM roles for staff delegation
- **Audit Logging**: CloudWatch integration for compliance
- **Serverless Ready**: Lambda deployment with Mangum
- **Comprehensive Testing**: Full API test suite

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- AWS Account with DynamoDB and Bedrock access
- Google Cloud Project with Calendar API enabled
- AWS CLI configured

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your AWS credentials and Google API settings
   ```

3. **Set up DynamoDB**:
   ```bash
   python setup_dynamodb.py
   ```

4. **Configure Google Calendar**:
   ```bash
   python google_calendar_setup.py
   ```

5. **Start the server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Test the API**:
   ```bash
   python test_alignwell_api.py
   ```

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

# CloudWatch Configuration
CLOUDWATCH_LOG_GROUP=/aws/lambda/alignwell-meded-tool

# Google Calendar Configuration
GOOGLE_CREDENTIALS_FILE=credentials.json
GOOGLE_TOKEN_FILE=token.json
```

### AWS Permissions Required

**DynamoDB**:
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`
- `dynamodb:Scan`
- `dynamodb:Query`
- `dynamodb:ListTagsOfResource`

**Bedrock**:
- `bedrock:InvokeModel`

**CloudWatch**:
- `logs:CreateLogGroup`
- `logs:CreateLogStream`
- `logs:PutLogEvents`

**IAM**:
- `iam:CreateRole`
- `iam:PutRolePolicy`
- `iam:AttachRolePolicy`
- `iam:PassRole`

## 📊 Data Models

### DoctorOnboardingRequest
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "specialty": "string",
  "medical_license_number": "string",
  "npi_number": "string",
  "phone_number": "string",
  "board_certifications": ["string"],
  "insurance_accepted": [
    {
      "provider_name": "string",
      "provider_id": "string",
      "plan_type": "string",
      "coverage_details": "string"
    }
  ],
  "hospital_affiliations": [
    {
      "hospital_name": "string",
      "hospital_id": "string",
      "department": "string",
      "position": "string",
      "start_date": "string",
      "end_date": "string"
    }
  ],
  "calendar_sync_enabled": "boolean",
  "calendar_provider": "string",
  "manual_schedule_blocks": [
    {
      "start_time": "string",
      "end_time": "string",
      "day_of_week": "string",
      "is_recurring": "boolean",
      "block_type": "string"
    }
  ],
  "staff_members": [
    {
      "name": "string",
      "email": "string",
      "role": "string",
      "permissions": ["string"]
    }
  ],
  "bio": "string",
  "languages_spoken": ["string"],
  "emergency_contact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  }
}
```

### OnboardingResponse
```json
{
  "doctor_id": "string",
  "status": "string",
  "message": "string",
  "calendar_sync_status": "string",
  "staff_access_granted": ["string"],
  "follow_up_plan": "string",
  "dashboard_metrics": {
    "total_appointments": "integer",
    "pending_approvals": "integer",
    "cancellations_today": "integer",
    "follow_ups_scheduled": "integer",
    "patient_satisfaction_score": "float",
    "average_appointment_duration": "float"
  }
}
```

## 🗄️ DynamoDB Schema

### Table: `AlignWell-Doctors`

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

## 📊 Dashboard Metrics

### Simulated Metrics
- Total appointments
- Pending approvals
- Daily cancellations
- Follow-ups scheduled
- Patient satisfaction scores
- Average appointment duration

### Specialty-Specific Adjustments
Metrics are adjusted based on medical specialty to provide realistic simulations.

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

## 🚀 Serverless Deployment

### Lambda Deployment
```bash
# Install Serverless Framework
npm install -g serverless
npm install -g serverless-python-requirements

# Deploy to AWS
serverless deploy
```

### Docker Deployment
```bash
# Build image
docker build -t alignwell-meded-tool .

# Run container
docker run -p 8000:8000 --env-file .env alignwell-meded-tool
```

## 🧪 Testing

### API Testing
```bash
# Run comprehensive test suite
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

## 📚 API Documentation

Once the server is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Development

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

### Database Management
```bash
# Create table
python setup_dynamodb.py

# Add sample data
python setup_dynamodb.py
```

### Calendar Setup
```bash
# Configure Google Calendar
python google_calendar_setup.py
```

## 🚨 Troubleshooting

### Common Issues

1. **AWS Credentials Not Found**
   ```bash
   aws configure
   # Or set environment variables
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   ```

2. **DynamoDB Table Not Found**
   ```bash
   python setup_dynamodb.py
   ```

3. **Bedrock Access Denied**
   - Ensure your AWS account has Bedrock access
   - Check IAM permissions for `bedrock:InvokeModel`

4. **Google Calendar API Errors**
   - Verify credentials.json is properly configured
   - Check OAuth 2.0 setup
   - Ensure Calendar API is enabled

5. **Lambda Deployment Issues**
   - Check serverless.yml configuration
   - Verify AWS credentials
   - Ensure all dependencies are included

### Logs and Debugging
- **Application logs**: Check terminal output
- **CloudWatch logs**: AWS Console → CloudWatch → Log Groups
- **API testing**: Use http://localhost:8000/docs

## 📈 Performance Optimization

- DynamoDB on-demand billing
- Bedrock response caching
- Lambda cold start optimization
- Connection pooling

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
1. Check the troubleshooting section
2. Review the API documentation
3. Check the logs for error messages
4. Create an issue in the repository

---

**AlignWell MedEd Tool - Empowering Medical Education** 🏥✨