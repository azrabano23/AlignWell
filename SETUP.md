# AlignWell - Doctor Onboarding System Setup Guide

This guide will help you set up the complete AlignWell doctor onboarding system with FastAPI backend and React frontend.

## 🏗️ Architecture Overview

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Database**: AWS DynamoDB
- **AI**: AWS Bedrock (Claude 3 Sonnet)
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- AWS Account with DynamoDB and Bedrock access
- AWS CLI configured or environment variables

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Make startup script executable
chmod +x start.sh

# Run the startup script (handles everything automatically)
./start.sh
```

The startup script will:
- Create virtual environment
- Install dependencies
- Set up environment file
- Check DynamoDB table
- Start the FastAPI server

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install frontend dependencies
npm install

# Start the React development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Manual Setup (Alternative)

### Backend Manual Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your AWS credentials

# Set up DynamoDB table
python setup_dynamodb.py

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Manual Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB Configuration
DYNAMODB_TABLE=doctor-onboarding

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## 🐳 Docker Deployment

### Backend Only

```bash
cd backend

# Build and run with Docker Compose
docker-compose up --build
```

### Full Stack with Docker

```bash
# Build backend
cd backend
docker build -t doctor-onboarding-api .

# Run backend
docker run -p 8000:8000 --env-file .env doctor-onboarding-api

# Frontend (separate terminal)
cd ..
npm run build
# Serve the built files with any static server
```

## 🧪 Testing

### Backend API Tests

```bash
cd backend

# Run the test script
python test_api.py
```

### Frontend Testing

```bash
# Run frontend tests (if configured)
npm test
```

## 📊 Database Schema

### DynamoDB Table: `doctor-onboarding`

**Primary Key**: `doctor_id` (String)

**Global Secondary Index**: `EmailIndex`
- **Partition Key**: `email` (String)

**Attributes**:
- `doctor_id`: String (Primary Key)
- `email`: String (GSI Key)
- `first_name`: String
- `last_name`: String
- `medical_license_number`: String
- `specialty`: String
- `years_of_experience`: Number
- `hospital_affiliation`: String
- `phone_number`: String
- `preferred_working_hours`: String
- `additional_notes`: String
- `generated_history`: String
- `onboarding_status`: String
- `created_at`: String (ISO 8601)
- `updated_at`: String (ISO 8601)

## 🤖 AI Features

The system uses AWS Bedrock with Claude 3 Sonnet to generate realistic medical histories including:

- Educational background
- Professional experience highlights
- Notable cases and achievements
- Areas of expertise
- Certifications and memberships
- Research and publications
- Teaching experience

## 🔒 Security Considerations

- Input validation on all endpoints
- CORS configuration for frontend integration
- AWS IAM permissions for DynamoDB and Bedrock
- Environment variable protection
- Non-root user in Docker containers

## 🚨 Troubleshooting

### Common Issues

1. **AWS Credentials Not Found**
   ```bash
   # Configure AWS CLI
   aws configure
   
   # Or set environment variables
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   ```

2. **DynamoDB Table Not Found**
   ```bash
   cd backend
   python setup_dynamodb.py
   ```

3. **Bedrock Access Denied**
   - Ensure your AWS account has Bedrock access
   - Check IAM permissions for `bedrock:InvokeModel`

4. **CORS Errors**
   - Ensure backend is running on port 8000
   - Check CORS configuration in `main.py`

5. **Frontend Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs and Debugging

- **Backend logs**: Check terminal output
- **Frontend logs**: Browser developer console
- **API testing**: Use http://localhost:8000/docs

## 📈 Performance Optimization

- DynamoDB on-demand billing
- Bedrock response caching
- Frontend code splitting
- Docker multi-stage builds

## 🔄 Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

2. **Frontend Development**
   ```bash
   npm run dev
   ```

3. **Testing**
   ```bash
   # Backend tests
   cd backend && python test_api.py
   
   # Frontend tests
   npm test
   ```

4. **Deployment**
   ```bash
   # Build frontend
   npm run build
   
   # Deploy backend
   docker-compose up --build
   ```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
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

**Happy coding! 🚀**
