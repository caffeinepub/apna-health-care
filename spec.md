# Apna Health Care

## Current State
Single-page health care website with:
- Hero banner, stats, services, doctors, appointment form, contact form, footer
- Backend stores patient details (appointments) and contact messages
- No admin panel or management interface
- All data is write-only from public side (no retrieval UI)

## Requested Changes (Diff)

### Add
- Admin login page (Internet Identity / authorization)
- Admin dashboard at `/admin` route with:
  - Tab: All Appointments — table showing all booked appointments (name, email, phone, doctor, date, reason)
  - Tab: Contact Messages — table showing all contact messages (name, email, message)
  - Tab: Manage Doctors — add/edit/remove doctor entries (name, specialty, experience, rating, patients count)
  - Tab: Manage Services — add/edit/remove service entries (title, description)
  - Stats overview at top (total appointments, total messages, total doctors, total services)
- Backend: getAll queries should be admin-only (caller check)
- Backend: CRUD functions for doctors and services stored in persistent stable vars
- Logout button in admin dashboard

### Modify
- Backend: Add deletePatientDetail, updateDoctorList, updateServiceList functions
- Frontend: Doctors and Services data now fetched from backend instead of hardcoded
- App routing: add /admin route

### Remove
- Hardcoded DOCTORS and SERVICES arrays from frontend (replace with backend data)

## Implementation Plan
1. Select `authorization` component
2. Update backend (main.mo):
   - Add stable vars for doctors and services
   - Add admin-only read functions for appointments and contacts
   - Add CRUD functions for doctors and services
3. Update frontend:
   - Add React Router for /admin route
   - Create AdminLogin page
   - Create AdminDashboard with 4 tabs
   - Fetch doctors/services from backend on public pages
   - Wire authorization component for admin login/logout
