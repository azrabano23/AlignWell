#!/usr/bin/env python3
"""
AlignWell MedEd Tool - Google Calendar API Setup
Configures Google Calendar integration for doctor scheduling
"""

import os
import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Google Calendar Configuration
SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.json'

def setup_google_calendar_auth():
    """Set up Google Calendar authentication"""
    
    print("🔐 Setting up Google Calendar authentication...")
    
    # Check if credentials file exists
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ {CREDENTIALS_FILE} not found!")
        print("Please download your OAuth 2.0 credentials from Google Cloud Console:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Select your project or create a new one")
        print("3. Enable the Google Calendar API")
        print("4. Create OAuth 2.0 credentials")
        print("5. Download the credentials JSON file")
        print("6. Save it as 'credentials.json' in this directory")
        return False
    
    try:
        # Load existing token
        creds = None
        if os.path.exists(TOKEN_FILE):
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        
        # If no valid credentials, run OAuth flow
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("🔄 Refreshing expired credentials...")
                creds.refresh(Request())
            else:
                print("🔑 Starting OAuth flow...")
                flow = Flow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
                flow.redirect_uri = 'http://localhost:8080/callback'
                
                # Get authorization URL
                auth_url, _ = flow.authorization_url(prompt='consent')
                print(f"🌐 Please visit this URL to authorize the application:")
                print(f"   {auth_url}")
                
                # Get authorization code from user
                auth_code = input("Enter the authorization code: ").strip()
                
                # Exchange code for credentials
                flow.fetch_token(code=auth_code)
                creds = flow.credentials
            
            # Save credentials for next run
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
            
            print("✅ Credentials saved successfully!")
        
        # Test the connection
        service = build('calendar', 'v3', credentials=creds)
        
        # Get calendar list to verify connection
        calendar_list = service.calendarList().list().execute()
        calendars = calendar_list.get('items', [])
        
        print(f"📅 Connected to Google Calendar!")
        print(f"   Found {len(calendars)} calendars")
        
        for calendar in calendars[:3]:  # Show first 3 calendars
            print(f"   - {calendar['summary']} ({calendar['id']})")
        
        return True
        
    except HttpError as e:
        print(f"❌ Google Calendar API error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error setting up Google Calendar: {e}")
        return False

def test_calendar_sync():
    """Test calendar synchronization functionality"""
    
    print("\n🧪 Testing calendar synchronization...")
    
    try:
        # Load credentials
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        service = build('calendar', 'v3', credentials=creds)
        
        # Create a test event
        test_event = {
            'summary': 'AlignWell Test Event',
            'description': 'Test event created by AlignWell MedEd Tool',
            'start': {
                'dateTime': '2024-01-20T10:00:00',
                'timeZone': 'America/New_York',
            },
            'end': {
                'dateTime': '2024-01-20T11:00:00',
                'timeZone': 'America/New_York',
            },
            'recurrence': [
                'RRULE:FREQ=WEEKLY;BYDAY=MO'
            ],
            'transparency': 'transparent',
            'visibility': 'private'
        }
        
        # Insert the event
        event = service.events().insert(calendarId='primary', body=test_event).execute()
        
        print(f"✅ Test event created successfully!")
        print(f"   Event ID: {event['id']}")
        print(f"   Event URL: {event.get('htmlLink', 'N/A')}")
        
        # Clean up - delete the test event
        service.events().delete(calendarId='primary', eventId=event['id']).execute()
        print("🧹 Test event cleaned up")
        
        return True
        
    except HttpError as e:
        print(f"❌ Google Calendar API error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error testing calendar sync: {e}")
        return False

def create_sample_credentials():
    """Create a sample credentials.json file template"""
    
    sample_credentials = {
        "web": {
            "client_id": "your-client-id.apps.googleusercontent.com",
            "project_id": "your-project-id",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "your-client-secret",
            "redirect_uris": ["http://localhost:8080/callback"]
        }
    }
    
    with open('credentials.json.sample', 'w') as f:
        json.dump(sample_credentials, f, indent=2)
    
    print("📝 Sample credentials file created: credentials.json.sample")
    print("   Copy this file to credentials.json and update with your actual values")

if __name__ == "__main__":
    print("🏥 AlignWell MedEd Tool - Google Calendar Setup")
    print("=" * 50)
    
    # Check if credentials file exists
    if not os.path.exists(CREDENTIALS_FILE):
        print("❌ credentials.json not found!")
        create_sample = input("Would you like to create a sample credentials file? (y/n): ").lower().strip()
        if create_sample in ['y', 'yes']:
            create_sample_credentials()
        print("\nPlease set up your Google Calendar API credentials and run this script again.")
        exit(1)
    
    # Set up authentication
    if setup_google_calendar_auth():
        print("\n✅ Google Calendar authentication successful!")
        
        # Test synchronization
        if test_calendar_sync():
            print("\n🎉 Google Calendar integration is ready!")
            print("🚀 You can now use calendar sync in the AlignWell application")
        else:
            print("\n❌ Calendar sync test failed")
    else:
        print("\n❌ Google Calendar setup failed")
        exit(1)
