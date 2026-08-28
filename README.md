# Student Management System - Angular 21 Frontend

This is the standalone Single Page Application (SPA) frontend for the Student Management System built using Angular 21.

## Features
- **Student Dashboard**: Stat cards showing total students, active status, average GPA, and department breakdown.
- **Search & Filters**: Real-time name/email/department filtering.
- **Dual View Modes**: Switch seamlessly between Grid View and Table View.
- **CRUD Operations**: Interactive forms for adding, editing, and deleting student records with validation.
- **Alerts & Modals**: Smooth glassmorphic modals and toast notification alerts.

## API Endpoint Configuration
The API URL is configured in [`src/environments/environment.ts`](file:///d:/New%20folder%20%282%29/frontend/src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## How to Run Locally

```bash
cd frontend
npm start
```

Open `http://localhost:4200` in your browser.

## Deployment
This frontend can be deployed independently to Azure Static Web Apps, Vercel, Netlify, or Nginx:
```bash
npm run build
```
Production build outputs to `dist/student-frontend/`.
