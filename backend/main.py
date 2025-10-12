import uvicorn
import json
import uuid
import bcrypt
import csv
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta

# Base directory for data files
BASE_DIR = Path(__file__).resolve().parent
USERS_FILE = BASE_DIR / "users.txt"
DOCTORS_FILE = BASE_DIR / "doctors.txt"
PATIENTS_FILE = BASE_DIR / "patients.txt"
PRO_CSV_FILE = BASE_DIR / "pro.csv"
SCHEDULE_FILE = BASE_DIR / "schedule.txt"

# --- Pydantic Models ---
class DoctorRegistration(BaseModel):
    email: str
    password: str
    fullName: str
    specialty: str
    credentials: List[str]
    acceptedInsurances: List[str]
    hospitalAffiliation: str

class User(BaseModel):
    id: str
    email: str
    password_hash: str
    role: str

class DoctorProfile(BaseModel):
    id: str
    user_id: str
    fullName: str
    specialty: str
    credentials: List[str]
    acceptedInsurances: List[str]
    hospitalAffiliation: str

class PatientDemographics(BaseModel):
    firstName: str
    lastName: str
    dateOfBirth: str
    phone: str

class PatientInsurance(BaseModel):
    provider: str
    policyNumber: str

class PatientConsents(BaseModel):
    predictiveReminders: bool
    voiceFollowUps: bool

class PatientProfile(BaseModel):
    id: str
    user_id: str
    demographics: PatientDemographics
    insurance: PatientInsurance
    telehealthPreference: bool
    consents: PatientConsents

class PatientRegistration(BaseModel):
    email: str
    password: str
    demographics: PatientDemographics
    insurance: PatientInsurance
    telehealthPreference: bool
    consents: PatientConsents

class TriagePayload(BaseModel):
    symptoms: List[str]

class Appointment(BaseModel):
    patient_id: str
    doctor_id: str
    start_time: str
    end_time: str
    risk_score: Optional[float] = None
    appointment_type: str # e.g., "New Patient", "Follow-up", "Screening"

app = FastAPI()

# --- Startup Event ---
@app.on_event("startup")
async def startup_event():
    # Create data files if they don't exist
    for file_path in [USERS_FILE, DOCTORS_FILE, PATIENTS_FILE, SCHEDULE_FILE]:
        if not file_path.is_file():
            file_path.touch()

    if not PRO_CSV_FILE.is_file():
        with open(PRO_CSV_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Condition", "Symptoms", "Recommended Procedure", "Doctor Needed", "Urgency", "Specialty"])
            writer.writerow(["Common Cold", "runny nose,cough,sore throat", "Rest, fluids", "No", "Self-Care", "General Practice"])
            writer.writerow(["Strep Throat", "sore throat,fever,swollen tonsils", "Antibiotics", "Yes", "Urgent", "General Practice"])
            writer.writerow(["Appendicitis", "abdominal pain,fever,nausea,vomiting", "Appendectomy", "Yes", "Emergency", "General Surgery"])
            writer.writerow(["Sprained Ankle", "swelling,pain,bruising,limited mobility", "R.I.C.E.", "Yes", "Routine", "Orthopedics"])
            writer.writerow(["Pregnancy", "missed period,nausea,fatigue", "Prenatal care", "Yes", "Routine", "Obstetrics"])
            writer.writerow(["Irregular Cycles", "irregular periods,hormonal imbalance", "Hormonal therapy", "Yes", "Soon", "Gynecology"])
            writer.writerow(["Pelvic Pain", "chronic pelvic pain,cramps,discomfort", "Pelvic exam, imaging", "Yes", "Soon", "Gynecology"])

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Onboarding Endpoints ---
@app.post("/api/v1/doctors/register", status_code=status.HTTP_201_CREATED, response_model=DoctorProfile)
def register_doctor(doctor: DoctorRegistration):
    # ... (code from previous step, confirmed to be correct)
    with open(USERS_FILE, "r") as f:
        if any(json.loads(line).get("email") == doctor.email for line in f if line.strip()):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw(doctor.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(id=user_id, email=doctor.email, password_hash=hashed_password, role="doctor")
    with open(USERS_FILE, "a") as f:
        f.write(json.dumps(new_user.dict()) + "\n")

    doctor_id = str(uuid.uuid4())
    new_doctor_profile = DoctorProfile(id=doctor_id, user_id=user_id, **doctor.dict())
    with open(DOCTORS_FILE, "a") as f:
        f.write(json.dumps(new_doctor_profile.dict()) + "\n")
    return new_doctor_profile

@app.post("/api/v1/patients/register", status_code=status.HTTP_201_CREATED, response_model=PatientProfile)
def register_patient(patient: PatientRegistration):
    # ... (code from previous step, confirmed to be correct)
    with open(USERS_FILE, "r") as f:
        if any(json.loads(line).get("email") == patient.email for line in f if line.strip()):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw(patient.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(id=user_id, email=patient.email, password_hash=hashed_password, role="patient")
    with open(USERS_FILE, "a") as f:
        f.write(json.dumps(new_user.dict()) + "\n")

    patient_id = str(uuid.uuid4())
    new_patient_profile = PatientProfile(id=patient_id, user_id=user_id, **patient.dict())
    with open(PATIENTS_FILE, "a") as f:
        f.write(json.dumps(new_patient_profile.dict()) + "\n")
    return new_patient_profile

# --- Smart Triage Endpoint ---
@app.post("/api/v1/triage")
def triage_patient(payload: TriagePayload):
    scores = {}
    with open(PRO_CSV_FILE, "r") as f:
        reader = csv.DictReader(f)
        conditions = list(reader)

    for condition in conditions:
        score = 0
        condition_symptoms = [s.strip() for s in condition["Symptoms"].lower().split(',')]
        for symptom in payload.symptoms:
            if symptom.lower() in condition_symptoms:
                score += 1
        if score > 0:
            scores[condition["Condition"]] = (score, condition)

    if not scores:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not assess symptoms.")

    best_match_condition_name = max(scores, key=lambda k: scores[k][0])
    best_match_data = scores[best_match_condition_name][1]

    return {
        "recommended_procedure": best_match_data["Recommended Procedure"],
        "doctor_visit_needed": best_match_data["Doctor Needed"],
        "urgency_level": best_match_data["Urgency"],
        "recommended_specialty": best_match_data["Specialty"],
        "rationale": f"The symptoms provided have a strong correlation with {best_match_data['Condition']}."
    }

# --- Scheduling Endpoints ---
@app.get("/api/v1/doctors/{doctor_id}/availability")
def get_doctor_availability(doctor_id: str):
    # Dummy implementation for demo purposes
    # In a real app, this would check the doctor's actual calendar
    availability = []
    today = datetime.now()
    for i in range(7): # Next 7 days
        day = today + timedelta(days=i)
        for hour in range(9, 17): # 9 AM to 5 PM
            if hour != 12: # Lunch break
                availability.append(day.replace(hour=hour, minute=0, second=0, microsecond=0).isoformat())
                availability.append(day.replace(hour=hour, minute=30, second=0, microsecond=0).isoformat())
    return availability

@app.get("/api/v1/appointments/{doctor_id}")
def get_doctor_appointments(doctor_id: str):
    appointments = []
    if SCHEDULE_FILE.is_file():
        with open(SCHEDULE_FILE, "r") as f:
            for line in f:
                if line.strip():
                    appointment_data = json.loads(line)
                    if appointment_data["doctor_id"] == doctor_id:
                        appointments.append(appointment_data)
    return appointments

@app.post("/api/v1/appointments", status_code=status.HTTP_201_CREATED)
def book_appointment(appointment: Appointment):
    # More realistic no-show risk assessment
    risk_score = 0.1
    if "New Patient" in appointment.appointment_type:
        risk_score += 0.2
    if "Screening" in appointment.appointment_type:
        risk_score -= 0.05

    appointment_time = datetime.fromisoformat(appointment.start_time)
    if appointment_time.weekday() >= 4: # Friday or Saturday
        risk_score += 0.1

    lead_time = (appointment_time - datetime.now()).days
    if lead_time < 2:
        risk_score += 0.15
    elif lead_time > 30:
        risk_score += 0.1

    appointment.risk_score = round(max(0.05, min(0.95, risk_score)), 2)

    with open(SCHEDULE_FILE, "a") as f:
        f.write(json.dumps(appointment.dict()) + "\n")

    return appointment

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)