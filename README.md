# AlignWell — a medical onboarding & education platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)

AlignWell is a full-stack platform for **simulated clinical onboarding** — registering doctors and patients, capturing structured demographics/insurance/consent, running a triage intake, and scheduling appointments — built as a medical-education tool that mirrors a real intake system without touching real patient data.

---

## The problem

Clinical onboarding and intake is where a lot of healthcare's administrative cost and error lives, and it's also something medical trainees rarely get to practice end-to-end before they're doing it for real. The pieces — provider registration, patient demographics, insurance capture, consent, triage, scheduling — are individually simple and collectively a mess of state, validation, and privacy requirements. AlignWell is a sandbox that makes that whole flow concrete: a realistic intake system trainees and builders can work against, using synthetic data.

## Market

Digital health and medical-education software are both large, growing markets — global digital health is measured in the **hundreds of billions of USD** with strong double-digit growth (Grand View Research / Statista sector data), and clinician onboarding/credentialing is a recognized pain point that startups (e.g. Medallion) specifically target. AlignWell sits at the education end: a teaching/prototyping environment for the intake workflows that production EHRs make hard to experiment with.

## What it does

- **Provider onboarding** — doctor registration and structured `DoctorProfile`s.
- **Patient intake** — demographics, insurance, and explicit `PatientConsents` as first-class typed models.
- **Triage** — a structured triage payload to route incoming patients.
- **Scheduling** — appointment creation with Google Calendar integration.

## Technical breakdown

- **Typed API backend** — **FastAPI** with Pydantic models for every entity (doctor, patient, demographics, insurance, consents, triage, appointment), so the data contract is explicit and validated at the edge rather than hoped for.
- **Managed, encrypted datastore** — **AWS DynamoDB** with **KMS** encryption at rest. DynamoDB is a HIPAA-*eligible* AWS service, and the app is built with those safeguards in mind (encryption, least-privilege keys) — see the honest note below.
- **Calendar integration** — Google Calendar for appointment scheduling.
- **React + TypeScript front end** (Vite) over the API.

**Skills demonstrated:** designing a typed, validated API for a domain with real structure (clinical intake); modelling consent/insurance/demographics as explicit schemas; integrating a managed encrypted datastore and a third-party calendar API; and full-stack delivery (FastAPI + React/TS).

## Honest note on "HIPAA"

The architecture uses **HIPAA-eligible services and encryption (DynamoDB + KMS)**, but this is an **educational tool on synthetic data — it is not a HIPAA-certified system.** Real HIPAA compliance requires a signed AWS Business Associate Agreement, full administrative/physical/technical safeguards, access auditing, and a formal risk assessment — none of which a teaching prototype carries. The design is HIPAA-*aware*; it is not HIPAA-*compliant*, and it shouldn't be used with real PHI. Saying so is the responsible version of the claim.

## Quick start

```bash
# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# configure .env with AWS + Google credentials, then:
uvicorn main:app --reload

# Frontend
npm install && npm run dev
```

## License

MIT — see [LICENSE](LICENSE). Author: **Azra Bano**.
