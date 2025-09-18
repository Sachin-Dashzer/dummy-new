# Clinic CRM (Next.js + Tailwind + MongoDB)

## Quick start
1) Copy `.env.local.example` to `.env.local` and fill values.
2) Install deps: `npm install`
3) Run: `npm run dev`
4) Open: `http://localhost:3000`

## Seed Admin
POST `/api/auth/register` with JSON:
```
{ "name":"Admin", "email":"admin@crm.com", "phone":"9999999999", "password":"admin123", "role":"Admin" }
```

## Bulk Users (Admin only)
POST `/api/users/bulk`
```
{ "users":[
  {"name":"A1","email":"a1@rc.com","phone":"9000000001","password":"pass123","role":"Agent"},
  {"name":"C1","email":"c1@rc.com","phone":"9000000002","password":"pass123","role":"Counsellor"}
]}
```

## Bulk Patients
POST `/api/patients/bulk`
```
{ "patients":[
  { "personal": { "name":"John","phone":"9991112222","location":"Delhi","visitDate":"2025-09-15","package":"Transplant","reference":"FB" },
    "counselling": { "counsellor":"C1","techniqueSuggested":"DHI","packageQuoted":80000,"graftsSuggested":3000 } },
  { "personal": { "name":"Asha","phone":"8887776666","location":"Mumbai","visitDate":"2025-09-16","package":"PRP","reference":"Google" } }
]}
```
