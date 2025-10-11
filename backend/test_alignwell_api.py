#!/usr/bin/env python3
"""
AlignWell MedEd Tool - API Test Suite
Comprehensive testing for the doctor onboarding workflow
"""

import requests
import json
import time
from datetime import datetime, timedelta

# API Configuration
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the server is running.")
        return False
    return True

def test_complete_onboarding_workflow():
    """Test the complete doctor onboarding workflow"""
    print("\n👨‍⚕️ Testing complete doctor onboarding workflow...")
    
    # Sample doctor data with all required fields
    doctor_data = {
        "first_name": "Dr. Emily",
        "last_name": "Watson",
        "email": "emily.watson@medcenter.com",
        "specialty": "Internal Medicine",
        "medical_license_number": "MD987654",
        "npi_number": "1234567890",
        "phone_number": "+1-555-0199",
        "board_certifications": ["Internal Medicine", "Geriatrics"],
        "insurance_accepted": [
            {
                "provider_name": "Blue Cross Blue Shield",
                "provider_id": "BCBS001",
                "plan_type": "PPO",
                "coverage_details": "Full coverage for internal medicine services"
            },
            {
                "provider_name": "Medicare",
                "provider_id": "MED001",
                "plan_type": "Traditional",
                "coverage_details": "Standard Medicare coverage"
            }
        ],
        "hospital_affiliations": [
            {
                "hospital_name": "MedCenter General Hospital",
                "hospital_id": "MCGH001",
                "department": "Internal Medicine",
                "position": "Attending Physician",
                "start_date": "2020-03-15",
                "end_date": None
            }
        ],
        "calendar_sync_enabled": True,
        "calendar_provider": "google",
        "manual_schedule_blocks": [
            {
                "start_time": "09:00",
                "end_time": "17:00",
                "day_of_week": "MONDAY",
                "is_recurring": True,
                "block_type": "available"
            },
            {
                "start_time": "09:00",
                "end_time": "17:00",
                "day_of_week": "TUESDAY",
                "is_recurring": True,
                "block_type": "available"
            },
            {
                "start_time": "09:00",
                "end_time": "17:00",
                "day_of_week": "WEDNESDAY",
                "is_recurring": True,
                "block_type": "available"
            }
        ],
        "staff_members": [
            {
                "name": "Maria Gonzalez",
                "email": "m.gonzalez@medcenter.com",
                "role": "nurse",
                "permissions": ["view_patients", "update_appointments", "schedule_follow_ups"]
            },
            {
                "name": "James Wilson",
                "email": "j.wilson@medcenter.com",
                "role": "receptionist",
                "permissions": ["schedule_appointments", "view_calendar", "manage_patient_info"]
            }
        ],
        "bio": "Board-certified internal medicine physician with expertise in geriatric care and chronic disease management.",
        "languages_spoken": ["English", "Spanish"],
        "emergency_contact": {
            "name": "Robert Watson",
            "relationship": "Spouse",
            "phone": "+1-555-0200"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/onboard-doctor",
            json=doctor_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Complete onboarding workflow successful")
            print(f"   Doctor ID: {result['doctor_id']}")
            print(f"   Status: {result['status']}")
            print(f"   Message: {result['message']}")
            print(f"   Calendar Sync: {result['calendar_sync_status']}")
            print(f"   Staff Access Granted: {len(result['staff_access_granted'])} roles")
            print(f"   Follow-up Plan Generated: {'Yes' if result['follow_up_plan'] else 'No'}")
            print(f"   Dashboard Metrics: {'Yes' if result['dashboard_metrics'] else 'No'}")
            
            if result['follow_up_plan']:
                print(f"   Follow-up Plan Preview: {result['follow_up_plan'][:200]}...")
            
            if result['dashboard_metrics']:
                metrics = result['dashboard_metrics']
                print(f"   Dashboard Metrics:")
                print(f"     - Total Appointments: {metrics['total_appointments']}")
                print(f"     - Pending Approvals: {metrics['pending_approvals']}")
                print(f"     - Patient Satisfaction: {metrics['patient_satisfaction_score']}")
            
            return result['doctor_id']
        else:
            print(f"❌ Onboarding failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during onboarding: {e}")
        return None

def test_get_doctor_profile(doctor_id):
    """Test getting doctor profile"""
    print(f"\n📋 Testing get doctor profile for ID: {doctor_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/doctor/{doctor_id}")
        
        if response.status_code == 200:
            doctor = response.json()
            print("✅ Get doctor profile successful")
            print(f"   Name: {doctor['first_name']} {doctor['last_name']}")
            print(f"   Specialty: {doctor['specialty']}")
            print(f"   Status: {doctor['onboarding_status']}")
            print(f"   Insurance Providers: {len(doctor['insurance_accepted'])}")
            print(f"   Hospital Affiliations: {len(doctor['hospital_affiliations'])}")
            print(f"   Staff Members: {len(doctor['staff_members'])}")
            print(f"   Calendar Sync: {'Enabled' if doctor['calendar_sync_enabled'] else 'Disabled'}")
        else:
            print(f"❌ Get doctor profile failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error getting doctor profile: {e}")

def test_dashboard_metrics(doctor_id):
    """Test dashboard metrics endpoint"""
    print(f"\n📊 Testing dashboard metrics for ID: {doctor_id}")
    
    try:
        response = requests.get(f"{BASE_URL}/doctor/{doctor_id}/dashboard")
        
        if response.status_code == 200:
            metrics = response.json()
            print("✅ Dashboard metrics retrieved successfully")
            print(f"   Total Appointments: {metrics['total_appointments']}")
            print(f"   Pending Approvals: {metrics['pending_approvals']}")
            print(f"   Cancellations Today: {metrics['cancellations_today']}")
            print(f"   Follow-ups Scheduled: {metrics['follow_ups_scheduled']}")
            print(f"   Patient Satisfaction: {metrics['patient_satisfaction_score']}/5.0")
            print(f"   Avg Appointment Duration: {metrics['average_appointment_duration']} min")
        else:
            print(f"❌ Dashboard metrics failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error getting dashboard metrics: {e}")

def test_update_status(doctor_id):
    """Test updating doctor status"""
    print(f"\n🔄 Testing update doctor status for ID: {doctor_id}")
    
    try:
        response = requests.put(
            f"{BASE_URL}/doctor/{doctor_id}/status",
            json="approved",
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Update status successful")
            print(f"   Message: {result['message']}")
            print(f"   Updated: {result['updated_at']}")
        else:
            print(f"❌ Update status failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error updating status: {e}")

def test_list_doctors():
    """Test listing all doctors"""
    print("\n📋 Testing list all doctors...")
    
    try:
        response = requests.get(f"{BASE_URL}/doctors")
        
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ List doctors successful - Found {len(doctors)} doctors")
            for doctor in doctors:
                print(f"   - {doctor['first_name']} {doctor['last_name']} ({doctor['specialty']}) - {doctor['onboarding_status']}")
        else:
            print(f"❌ List doctors failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error listing doctors: {e}")

def test_validation_errors():
    """Test input validation"""
    print("\n🔍 Testing input validation...")
    
    # Test invalid email
    invalid_data = {
        "first_name": "Test",
        "last_name": "Doctor",
        "email": "invalid-email",
        "specialty": "Test",
        "medical_license_number": "MD123",
        "npi_number": "1234567890",
        "phone_number": "+1-555-0123",
        "insurance_accepted": [
            {
                "provider_name": "Test Insurance",
                "provider_id": "TEST001",
                "plan_type": "PPO"
            }
        ],
        "hospital_affiliations": [
            {
                "hospital_name": "Test Hospital",
                "hospital_id": "TEST001",
                "department": "Test",
                "position": "Test",
                "start_date": "2024-01-01"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/onboard-doctor",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 422:
            print("✅ Input validation working correctly")
            print("   Validation error details:")
            errors = response.json()
            for error in errors.get('detail', []):
                print(f"     - {error['loc']}: {error['msg']}")
        else:
            print(f"❌ Expected validation error, got: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing validation: {e}")

def test_edge_cases():
    """Test edge cases and error handling"""
    print("\n🧪 Testing edge cases...")
    
    # Test non-existent doctor
    try:
        response = requests.get(f"{BASE_URL}/doctor/non-existent-id")
        if response.status_code == 404:
            print("✅ Non-existent doctor handling correct")
        else:
            print(f"❌ Expected 404, got: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing non-existent doctor: {e}")
    
    # Test invalid status update
    try:
        response = requests.put(
            f"{BASE_URL}/doctor/test-id/status",
            json="invalid_status",
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 422:
            print("✅ Invalid status validation correct")
        else:
            print(f"❌ Expected validation error, got: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing invalid status: {e}")

def main():
    """Run all tests"""
    print("🏥 AlignWell MedEd Tool - API Test Suite")
    print("=" * 60)
    
    # Test health check first
    if not test_health_check():
        print("\n❌ API is not running. Please start the server first:")
        print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return
    
    # Test complete onboarding workflow
    doctor_id = test_complete_onboarding_workflow()
    
    if doctor_id:
        # Test individual endpoints
        test_get_doctor_profile(doctor_id)
        test_dashboard_metrics(doctor_id)
        test_update_status(doctor_id)
    
    # Test other endpoints
    test_list_doctors()
    test_validation_errors()
    test_edge_cases()
    
    print("\n" + "=" * 60)
    print("🏁 Test suite completed!")
    print("\n📚 API Documentation available at:")
    print(f"   - Swagger UI: {BASE_URL}/docs")
    print(f"   - ReDoc: {BASE_URL}/redoc")
    
    print("\n🚀 Next steps:")
    print("   1. Review the API documentation")
    print("   2. Test calendar sync functionality")
    print("   3. Verify DynamoDB data")
    print("   4. Check CloudWatch logs")

if __name__ == "__main__":
    main()
