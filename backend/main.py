"""
AlignWell MedEd Tool - FastAPI Backend
Simulated Doctor Onboarding with AWS Integration
"""

import json
import uuid
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from enum import Enum

import boto3
from botocore.exceptions import ClientError
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configure logging for CloudWatch
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AlignWell MedEd Tool",
    description="Simulated Doctor Onboarding for Medical Education",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "AlignWell-Doctors")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")
CLOUDWATCH_LOG_GROUP = os.getenv("CLOUDWATCH_LOG_GROUP", "/aws/lambda/alignwell")

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
bedrock = boto3.client('bedrock-runtime', region_name=AWS_REGION)
cloudwatch_logs = boto3.client('logs', region_name=AWS_REGION)
iam = boto3.client('iam', region_name=AWS_REGION)

# Google Calendar Configuration
GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "credentials.json")
GOOGLE_TOKEN_FILE = os.getenv("GOOGLE_TOKEN_FILE", "token.json")
SCOPES = ['https://www.googleapis.com/auth/calendar']

# Enums
class OnboardingStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"

class StaffRole(str, Enum):
    ADMIN = "admin"
    NURSE = "nurse"
    RECEPTIONIST = "receptionist"
    ASSISTANT = "assistant"

# Pydantic Models
class InsuranceInfo(BaseModel):
    provider_name: str
    provider_id: str
    plan_type: str
    coverage_details: Optional[str] = None

class HospitalAffiliation(BaseModel):
    hospital_name: str
    hospital_id: str
    department: str
    position: str
    start_date: str
    end_date: Optional[str] = None

class CalendarBlock(BaseModel):
    start_time: str
    end_time: str
    day_of_week: str
    is_recurring: bool = True
    block_type: str = "available"  # available, busy, break

class StaffMember(BaseModel):
    name: str
    email: str
    role: StaffRole
    permissions: List[str] = []

class DoctorOnboardingRequest(BaseModel):
    # Account Creation
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    specialty: str = Field(..., min_length=2, max_length=100)
    medical_license_number: str = Field(..., min_length=5, max_length=20)
    npi_number: Optional[str] = Field(None, min_length=10, max_length=10)
    phone_number: str = Field(..., min_length=10, max_length=20)
    
    # Credentials and Insurance
    board_certifications: List[str] = []
    insurance_accepted: List[InsuranceInfo] = []
    hospital_affiliations: List[HospitalAffiliation] = []
    
    # Schedule Setup
    calendar_sync_enabled: bool = False
    calendar_provider: Optional[str] = Field(None, regex=r'^(google|outlook)$')
    manual_schedule_blocks: List[CalendarBlock] = []
    
    # Delegation
    staff_members: List[StaffMember] = []
    
    # Additional Info
    bio: Optional[str] = Field(None, max_length=1000)
    languages_spoken: List[str] = []
    emergency_contact: Optional[Dict[str, str]] = None

    @validator('insurance_accepted')
    def validate_insurance(cls, v):
        if len(v) == 0:
            raise ValueError('At least one insurance provider must be specified')
        return v

    @validator('hospital_affiliations')
    def validate_hospitals(cls, v):
        if len(v) == 0:
            raise ValueError('At least one hospital affiliation must be specified')
        return v

class OnboardingResponse(BaseModel):
    doctor_id: str
    status: str
    message: str
    calendar_sync_status: Optional[str] = None
    staff_access_granted: List[str] = []
    follow_up_plan: Optional[str] = None
    dashboard_metrics: Optional[Dict[str, Any]] = None

class DashboardMetrics(BaseModel):
    total_appointments: int
    pending_approvals: int
    cancellations_today: int
    follow_ups_scheduled: int
    patient_satisfaction_score: float
    average_appointment_duration: float

# Helper Functions
def log_to_cloudwatch(message: str, level: str = "INFO", doctor_id: str = None):
    """Log messages to CloudWatch"""
    try:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "message": message,
            "doctor_id": doctor_id,
            "service": "alignwell-backend"
        }
        
        cloudwatch_logs.put_log_events(
            logGroupName=CLOUDWATCH_LOG_GROUP,
            logStreamName=f"doctor-onboarding-{datetime.utcnow().strftime('%Y-%m-%d')}",
            logEvents=[
                {
                    "timestamp": int(datetime.utcnow().timestamp() * 1000),
                    "message": json.dumps(log_data)
                }
            ]
        )
    except Exception as e:
        logger.error(f"Failed to log to CloudWatch: {e}")

def create_dynamodb_table():
    """Create DynamoDB table with HIPAA encryption"""
    try:
        table = dynamodb.create_table(
            TableName=DYNAMODB_TABLE,
            KeySchema=[
                {
                    'AttributeName': 'doctor_id',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'doctor_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'EmailIndex',
                    'KeySchema': [
                        {
                            'AttributeName': 'email',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            BillingMode='PAY_PER_REQUEST',
            SSESpecification={
                'Enabled': True,
                'SSEType': 'KMS',
                'KMSMasterKeyId': 'alias/aws/dynamodb'
            },
            Tags=[
                {
                    'Key': 'Environment',
                    'Value': 'Production'
                },
                {
                    'Key': 'Compliance',
                    'Value': 'HIPAA'
                }
            ]
        )
        
        # Wait for table to be created
        table.wait_until_exists()
        logger.info(f"DynamoDB table {DYNAMODB_TABLE} created successfully")
        return True
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            logger.info(f"DynamoDB table {DYNAMODB_TABLE} already exists")
            return True
        else:
            logger.error(f"Error creating DynamoDB table: {e}")
            return False

def setup_google_calendar_service(credentials_file: str, token_file: str):
    """Set up Google Calendar API service"""
    try:
        creds = None
        
        # Load existing token
        if os.path.exists(token_file):
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)
        
        # If no valid credentials, run OAuth flow
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = Flow.from_client_secrets_file(credentials_file, SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next run
            with open(token_file, 'w') as token:
                token.write(creds.to_json())
        
        service = build('calendar', 'v3', credentials=creds)
        return service
        
    except Exception as e:
        logger.error(f"Error setting up Google Calendar service: {e}")
        return None

def sync_calendar_blocks(service, doctor_id: str, blocks: List[CalendarBlock]):
    """Sync calendar blocks with Google Calendar"""
    try:
        calendar_id = 'primary'
        
        for block in blocks:
            # Create recurring event for availability blocks
            event = {
                'summary': f'Available - Dr. {doctor_id}',
                'description': 'Doctor availability block',
                'start': {
                    'dateTime': f"{datetime.now().strftime('%Y-%m-%d')}T{block.start_time}:00",
                    'timeZone': 'America/New_York',
                },
                'end': {
                    'dateTime': f"{datetime.now().strftime('%Y-%m-%d')}T{block.end_time}:00",
                    'timeZone': 'America/New_York',
                },
                'recurrence': [
                    f'RRULE:FREQ=WEEKLY;BYDAY={block.day_of_week.upper()}'
                ] if block.is_recurring else [],
                'transparency': 'transparent',
                'visibility': 'private'
            }
            
            service.events().insert(calendarId=calendar_id, body=event).execute()
        
        logger.info(f"Successfully synced {len(blocks)} calendar blocks for doctor {doctor_id}")
        return True
        
    except HttpError as e:
        logger.error(f"Error syncing calendar blocks: {e}")
        return False

def generate_follow_up_plan(specialty: str, doctor_name: str) -> str:
    """Generate follow-up plan using Bedrock GenAI"""
    prompt = f"""
    Generate a comprehensive follow-up care plan for a {specialty} specialist named Dr. {doctor_name}.
    
    Include:
    1. Standard follow-up protocols for {specialty} patients
    2. Recommended appointment intervals
    3. Key metrics to monitor
    4. Patient education topics
    5. Referral criteria
    6. Emergency contact protocols
    
    Make it specific to {specialty} practice and include evidence-based recommendations.
    Format as a structured care plan suitable for medical education.
    """
    
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1500,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
        
        response = bedrock.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=body,
            contentType="application/json"
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except ClientError as e:
        logger.error(f"Bedrock error: {e}")
        # Fallback plan
        return f"""
        Follow-up Care Plan for {specialty} Practice - Dr. {doctor_name}
        
        1. Standard Follow-up Intervals:
           - Initial follow-up: 2-4 weeks post-treatment
           - Routine monitoring: Every 3-6 months
           - Annual comprehensive review
        
        2. Key Metrics to Monitor:
           - Patient symptoms and quality of life
           - Medication adherence
           - Laboratory values relevant to {specialty}
           - Functional status assessments
        
        3. Patient Education:
           - Disease-specific education materials
           - Medication management
           - Lifestyle modifications
           - Warning signs requiring immediate attention
        
        4. Referral Criteria:
           - Specialist consultation for complex cases
           - Emergency department for acute complications
           - Allied health services as needed
        
        5. Emergency Protocols:
           - 24/7 on-call coverage
           - Clear escalation pathways
           - Patient communication protocols
        """

def create_staff_iam_roles(doctor_id: str, staff_members: List[StaffMember]):
    """Create IAM roles for staff members"""
    created_roles = []
    
    for staff in staff_members:
        try:
            role_name = f"AlignWell-Staff-{doctor_id}-{staff.role.value}"
            
            # Define permissions based on role
            permissions = {
                StaffRole.ADMIN: [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:Scan",
                    "dynamodb:Query"
                ],
                StaffRole.NURSE: [
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:Query"
                ],
                StaffRole.RECEPTIONIST: [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:Query"
                ],
                StaffRole.ASSISTANT: [
                    "dynamodb:GetItem",
                    "dynamodb:Query"
                ]
            }
            
            # Create IAM role
            assume_role_policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": f"arn:aws:iam::{boto3.client('sts').get_caller_identity()['Account']}:root"
                        },
                        "Action": "sts:AssumeRole"
                    }
                ]
            }
            
            iam.create_role(
                RoleName=role_name,
                AssumeRolePolicyDocument=json.dumps(assume_role_policy),
                Description=f"Staff access role for {staff.role.value} in AlignWell"
            )
            
            # Attach DynamoDB permissions
            policy_document = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": permissions[staff.role],
                        "Resource": f"arn:aws:dynamodb:{AWS_REGION}:*:table/{DYNAMODB_TABLE}"
                    }
                ]
            }
            
            iam.put_role_policy(
                RoleName=role_name,
                PolicyName=f"DynamoDBAccess-{staff.role.value}",
                PolicyDocument=json.dumps(policy_document)
            )
            
            created_roles.append(role_name)
            logger.info(f"Created IAM role {role_name} for {staff.name}")
            
        except ClientError as e:
            logger.error(f"Error creating IAM role for {staff.name}: {e}")
    
    return created_roles

def generate_dashboard_metrics(doctor_id: str, specialty: str) -> DashboardMetrics:
    """Generate simulated dashboard metrics"""
    # Simulate metrics based on specialty
    base_metrics = {
        "total_appointments": 150,
        "pending_approvals": 12,
        "cancellations_today": 3,
        "follow_ups_scheduled": 45,
        "patient_satisfaction_score": 4.7,
        "average_appointment_duration": 25.5
    }
    
    # Adjust based on specialty
    specialty_adjustments = {
        "Emergency Medicine": {"total_appointments": 200, "average_appointment_duration": 15.0},
        "Surgery": {"total_appointments": 80, "average_appointment_duration": 45.0},
        "Pediatrics": {"total_appointments": 180, "average_appointment_duration": 20.0},
        "Psychiatry": {"total_appointments": 120, "average_appointment_duration": 50.0}
    }
    
    if specialty in specialty_adjustments:
        base_metrics.update(specialty_adjustments[specialty])
    
    return DashboardMetrics(**base_metrics)

def save_doctor_to_dynamodb(doctor_data: DoctorOnboardingRequest, doctor_id: str) -> bool:
    """Save doctor profile to DynamoDB"""
    try:
        table = dynamodb.Table(DYNAMODB_TABLE)
        
        item = {
            'doctor_id': doctor_id,
            'first_name': doctor_data.first_name,
            'last_name': doctor_data.last_name,
            'email': doctor_data.email,
            'specialty': doctor_data.specialty,
            'medical_license_number': doctor_data.medical_license_number,
            'npi_number': doctor_data.npi_number,
            'phone_number': doctor_data.phone_number,
            'board_certifications': doctor_data.board_certifications,
            'insurance_accepted': [insurance.dict() for insurance in doctor_data.insurance_accepted],
            'hospital_affiliations': [hospital.dict() for hospital in doctor_data.hospital_affiliations],
            'calendar_sync_enabled': doctor_data.calendar_sync_enabled,
            'calendar_provider': doctor_data.calendar_provider,
            'manual_schedule_blocks': [block.dict() for block in doctor_data.manual_schedule_blocks],
            'staff_members': [staff.dict() for staff in doctor_data.staff_members],
            'bio': doctor_data.bio,
            'languages_spoken': doctor_data.languages_spoken,
            'emergency_contact': doctor_data.emergency_contact,
            'onboarding_status': OnboardingStatus.PENDING.value,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        table.put_item(Item=item)
        logger.info(f"Successfully saved doctor {doctor_id} to DynamoDB")
        return True
        
    except ClientError as e:
        logger.error(f"Error saving doctor to DynamoDB: {e}")
        return False

# API Endpoints
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting AlignWell MedEd Tool backend")
    
    # Create DynamoDB table if it doesn't exist
    create_dynamodb_table()
    
    # Log startup to CloudWatch
    log_to_cloudwatch("AlignWell backend started successfully", "INFO")

@app.get("/")
async def root():
    return {
        "message": "AlignWell MedEd Tool API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "dynamodb": "connected",
            "bedrock": "available",
            "cloudwatch": "logging"
        }
    }

@app.post("/onboard-doctor", response_model=OnboardingResponse)
async def onboard_doctor(
    doctor_data: DoctorOnboardingRequest,
    background_tasks: BackgroundTasks
):
    """
    Complete doctor onboarding workflow for AlignWell MedEd tool
    """
    doctor_id = str(uuid.uuid4())
    
    try:
        # Log onboarding start
        log_to_cloudwatch(f"Starting onboarding for doctor {doctor_id}", "INFO", doctor_id)
        
        # 1. Account Creation - Save to DynamoDB
        if not save_doctor_to_dynamodb(doctor_data, doctor_id):
            raise HTTPException(status_code=500, detail="Failed to save doctor profile")
        
        # 2. Schedule Setup - Google Calendar sync
        calendar_sync_status = "not_synced"
        if doctor_data.calendar_sync_enabled and doctor_data.calendar_provider == "google":
            background_tasks.add_task(
                sync_calendar_blocks,
                setup_google_calendar_service(GOOGLE_CREDENTIALS_FILE, GOOGLE_TOKEN_FILE),
                doctor_id,
                doctor_data.manual_schedule_blocks
            )
            calendar_sync_status = "syncing"
        
        # 3. Delegation - Create IAM roles for staff
        staff_access_granted = []
        if doctor_data.staff_members:
            staff_access_granted = create_staff_iam_roles(doctor_id, doctor_data.staff_members)
        
        # 4. Dashboard - Generate follow-up plan and metrics
        follow_up_plan = generate_follow_up_plan(doctor_data.specialty, f"{doctor_data.first_name} {doctor_data.last_name}")
        dashboard_metrics = generate_dashboard_metrics(doctor_id, doctor_data.specialty)
        
        # Log successful onboarding
        log_to_cloudwatch(f"Successfully onboarded doctor {doctor_id}", "INFO", doctor_id)
        
        return OnboardingResponse(
            doctor_id=doctor_id,
            status="success",
            message="Doctor successfully onboarded to AlignWell MedEd tool",
            calendar_sync_status=calendar_sync_status,
            staff_access_granted=staff_access_granted,
            follow_up_plan=follow_up_plan,
            dashboard_metrics=dashboard_metrics.dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during onboarding: {e}")
        log_to_cloudwatch(f"Onboarding failed for doctor {doctor_id}: {str(e)}", "ERROR", doctor_id)
        raise HTTPException(status_code=500, detail="Internal server error during onboarding")

@app.get("/doctor/{doctor_id}")
async def get_doctor_profile(doctor_id: str):
    """Get doctor profile by ID"""
    try:
        table = dynamodb.Table(DYNAMODB_TABLE)
        response = table.get_item(Key={'doctor_id': doctor_id})
        
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        log_to_cloudwatch(f"Retrieved profile for doctor {doctor_id}", "INFO", doctor_id)
        return response['Item']
        
    except ClientError as e:
        logger.error(f"DynamoDB error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve doctor profile")

@app.get("/doctors")
async def list_doctors():
    """List all onboarded doctors"""
    try:
        table = dynamodb.Table(DYNAMODB_TABLE)
        response = table.scan()
        
        log_to_cloudwatch(f"Listed {len(response['Items'])} doctors", "INFO")
        return response['Items']
        
    except ClientError as e:
        logger.error(f"DynamoDB error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve doctors list")

@app.put("/doctor/{doctor_id}/status")
async def update_onboarding_status(doctor_id: str, status: OnboardingStatus):
    """Update doctor's onboarding status"""
    try:
        table = dynamodb.Table(DYNAMODB_TABLE)
        
        table.update_item(
            Key={'doctor_id': doctor_id},
            UpdateExpression='SET onboarding_status = :status, updated_at = :updated_at',
            ExpressionAttributeValues={
                ':status': status.value,
                ':updated_at': datetime.utcnow().isoformat()
            },
            ConditionExpression='attribute_exists(doctor_id)'
        )
        
        log_to_cloudwatch(f"Updated status to {status.value} for doctor {doctor_id}", "INFO", doctor_id)
        return {
            "message": f"Doctor status updated to {status.value}",
            "updated_at": datetime.utcnow().isoformat()
        }
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            raise HTTPException(status_code=404, detail="Doctor not found")
        logger.error(f"DynamoDB error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update doctor status")

@app.get("/doctor/{doctor_id}/dashboard")
async def get_dashboard_metrics(doctor_id: str):
    """Get dashboard metrics for a doctor"""
    try:
        table = dynamodb.Table(DYNAMODB_TABLE)
        response = table.get_item(Key={'doctor_id': doctor_id})
        
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        doctor = response['Item']
        metrics = generate_dashboard_metrics(doctor_id, doctor['specialty'])
        
        log_to_cloudwatch(f"Retrieved dashboard metrics for doctor {doctor_id}", "INFO", doctor_id)
        return metrics.dict()
        
    except ClientError as e:
        logger.error(f"DynamoDB error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard metrics")

# Lambda handler for serverless deployment
def lambda_handler(event, context):
    """AWS Lambda handler for serverless deployment"""
    from mangum import Mangum
    
    handler = Mangum(app)
    return handler(event, context)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)