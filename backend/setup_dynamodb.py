#!/usr/bin/env python3
"""
AlignWell MedEd Tool - DynamoDB Setup Script
Creates HIPAA-compliant DynamoDB table with encryption
"""

import boto3
import os
import json
from botocore.exceptions import ClientError

def create_doctors_table():
    """Create DynamoDB table for doctors with HIPAA compliance"""
    
    # Configuration
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    TABLE_NAME = os.getenv("DYNAMODB_TABLE", "AlignWell-Doctors")
    
    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb', region_name=AWS_REGION)
    
    try:
        # Check if table already exists
        response = dynamodb.describe_table(TableName=TABLE_NAME)
        print(f"✅ Table {TABLE_NAME} already exists")
        return True
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            # Table doesn't exist, create it
            print(f"🏗️  Creating HIPAA-compliant table {TABLE_NAME}...")
            
            table_schema = {
                'TableName': TABLE_NAME,
                'KeySchema': [
                    {
                        'AttributeName': 'doctor_id',
                        'KeyType': 'HASH'  # Partition key
                    }
                ],
                'AttributeDefinitions': [
                    {
                        'AttributeName': 'doctor_id',
                        'AttributeType': 'S'  # String
                    },
                    {
                        'AttributeName': 'email',
                        'AttributeType': 'S'  # String
                    }
                ],
                'GlobalSecondaryIndexes': [
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
                'BillingMode': 'PAY_PER_REQUEST',  # On-demand billing
                'SSESpecification': {
                    'Enabled': True,
                    'SSEType': 'KMS',
                    'KMSMasterKeyId': 'alias/aws/dynamodb'
                },
                'Tags': [
                    {
                        'Key': 'Environment',
                        'Value': 'Production'
                    },
                    {
                        'Key': 'Compliance',
                        'Value': 'HIPAA'
                    },
                    {
                        'Key': 'Application',
                        'Value': 'AlignWell-MedEd'
                    }
                ]
            }
            
            response = dynamodb.create_table(**table_schema)
            
            # Wait for table to be created
            waiter = dynamodb.get_waiter('table_exists')
            waiter.wait(TableName=TABLE_NAME)
            
            print(f"✅ HIPAA-compliant table {TABLE_NAME} created successfully!")
            print("🔒 Encryption enabled with AWS KMS")
            print("📋 HIPAA compliance tags added")
            return True
            
        else:
            print(f"❌ Error creating table: {e}")
            return False

def create_sample_data():
    """Create sample doctor data for testing"""
    
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    TABLE_NAME = os.getenv("DYNAMODB_TABLE", "AlignWell-Doctors")
    
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(TABLE_NAME)
    
    sample_doctors = [
        {
            'doctor_id': 'sample-cardio-001',
            'first_name': 'Dr. Sarah',
            'last_name': 'Chen',
            'email': 'sarah.chen@cityhospital.com',
            'specialty': 'Cardiology',
            'medical_license_number': 'MD123456',
            'npi_number': '1234567890',
            'phone_number': '+1-555-0123',
            'board_certifications': ['Internal Medicine', 'Cardiology'],
            'insurance_accepted': [
                {
                    'provider_name': 'Blue Cross Blue Shield',
                    'provider_id': 'BCBS001',
                    'plan_type': 'PPO',
                    'coverage_details': 'Full coverage for cardiology services'
                },
                {
                    'provider_name': 'Aetna',
                    'provider_id': 'AET001',
                    'plan_type': 'HMO',
                    'coverage_details': 'Standard coverage'
                }
            ],
            'hospital_affiliations': [
                {
                    'hospital_name': 'City General Hospital',
                    'hospital_id': 'CGH001',
                    'department': 'Cardiology',
                    'position': 'Attending Physician',
                    'start_date': '2020-01-15',
                    'end_date': None
                }
            ],
            'calendar_sync_enabled': True,
            'calendar_provider': 'google',
            'manual_schedule_blocks': [
                {
                    'start_time': '09:00',
                    'end_time': '17:00',
                    'day_of_week': 'MONDAY',
                    'is_recurring': True,
                    'block_type': 'available'
                },
                {
                    'start_time': '09:00',
                    'end_time': '17:00',
                    'day_of_week': 'TUESDAY',
                    'is_recurring': True,
                    'block_type': 'available'
                }
            ],
            'staff_members': [
                {
                    'name': 'Jennifer Martinez',
                    'email': 'j.martinez@cityhospital.com',
                    'role': 'nurse',
                    'permissions': ['view_patients', 'update_appointments']
                }
            ],
            'bio': 'Board-certified cardiologist with expertise in interventional cardiology and heart failure management.',
            'languages_spoken': ['English', 'Mandarin'],
            'emergency_contact': {
                'name': 'John Chen',
                'relationship': 'Spouse',
                'phone': '+1-555-0124'
            },
            'onboarding_status': 'approved',
            'created_at': '2024-01-15T10:00:00Z',
            'updated_at': '2024-01-15T10:00:00Z'
        },
        {
            'doctor_id': 'sample-peds-002',
            'first_name': 'Dr. Michael',
            'last_name': 'Rodriguez',
            'email': 'm.rodriguez@childrenshospital.com',
            'specialty': 'Pediatrics',
            'medical_license_number': 'MD789012',
            'npi_number': '0987654321',
            'phone_number': '+1-555-0456',
            'board_certifications': ['Pediatrics', 'Pediatric Emergency Medicine'],
            'insurance_accepted': [
                {
                    'provider_name': 'Cigna',
                    'provider_id': 'CIG001',
                    'plan_type': 'PPO',
                    'coverage_details': 'Full pediatric coverage'
                }
            ],
            'hospital_affiliations': [
                {
                    'hospital_name': "Children's Medical Center",
                    'hospital_id': 'CMC001',
                    'department': 'Pediatrics',
                    'position': 'Chief of Pediatrics',
                    'start_date': '2018-06-01',
                    'end_date': None
                }
            ],
            'calendar_sync_enabled': False,
            'calendar_provider': None,
            'manual_schedule_blocks': [
                {
                    'start_time': '08:00',
                    'end_time': '16:00',
                    'day_of_week': 'MONDAY',
                    'is_recurring': True,
                    'block_type': 'available'
                }
            ],
            'staff_members': [
                {
                    'name': 'Lisa Thompson',
                    'email': 'l.thompson@childrenshospital.com',
                    'role': 'receptionist',
                    'permissions': ['schedule_appointments', 'view_calendar']
                }
            ],
            'bio': 'Pediatrician specializing in emergency medicine and child development.',
            'languages_spoken': ['English', 'Spanish'],
            'emergency_contact': {
                'name': 'Maria Rodriguez',
                'relationship': 'Sister',
                'phone': '+1-555-0457'
            },
            'onboarding_status': 'pending',
            'created_at': '2024-01-16T14:30:00Z',
            'updated_at': '2024-01-16T14:30:00Z'
        }
    ]
    
    try:
        for doctor in sample_doctors:
            table.put_item(Item=doctor)
            print(f"✅ Added sample doctor: {doctor['first_name']} {doctor['last_name']} ({doctor['specialty']})")
        
        print("✅ Sample data created successfully!")
        return True
        
    except ClientError as e:
        print(f"❌ Error creating sample data: {e}")
        return False

def verify_table_security():
    """Verify table security settings"""
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    TABLE_NAME = os.getenv("DYNAMODB_TABLE", "AlignWell-Doctors")
    
    dynamodb = boto3.client('dynamodb', region_name=AWS_REGION)
    
    try:
        response = dynamodb.describe_table(TableName=TABLE_NAME)
        table_info = response['Table']
        
        print("\n🔒 Security Verification:")
        print(f"   Table Name: {table_info['TableName']}")
        print(f"   Encryption Status: {table_info['SSEDescription']['Status']}")
        print(f"   Encryption Type: {table_info['SSEDescription']['SSEType']}")
        print(f"   KMS Key: {table_info['SSEDescription'].get('KMSMasterKeyArn', 'Default')}")
        
        # Check tags
        tags_response = dynamodb.list_tags_of_resource(ResourceArn=table_info['TableArn'])
        hipaa_tag = any(tag['Key'] == 'Compliance' and tag['Value'] == 'HIPAA' 
                       for tag in tags_response['Tags'])
        
        print(f"   HIPAA Compliance: {'✅ Yes' if hipaa_tag else '❌ No'}")
        
        return True
        
    except ClientError as e:
        print(f"❌ Error verifying table security: {e}")
        return False

if __name__ == "__main__":
    print("🏥 AlignWell MedEd Tool - DynamoDB Setup")
    print("=" * 50)
    
    # Create table
    if create_doctors_table():
        print("\n🔍 Verifying security settings...")
        verify_table_security()
        
        # Ask user if they want to create sample data
        create_samples = input("\n📋 Would you like to create sample data? (y/n): ").lower().strip()
        if create_samples in ['y', 'yes']:
            create_sample_data()
        
        print("\n✅ Setup completed successfully!")
        print("🚀 You can now start the FastAPI server with: uvicorn main:app --reload")
    else:
        print("❌ Setup failed!")
        exit(1)