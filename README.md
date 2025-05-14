# 🩺 LifeLink – Emergency Medical & Appointment Management Platform

LifeLink is a full-stack medical management application designed to streamline patient appointment booking, improve communication among medical staff, and handle emergency situations with efficiency and speed.

## 🎯 Goals
- Simplify patient operations such as appointment booking and medical record access.
- Enhance collaboration and scheduling for medical staff.
- Provide emergency support through real-time location tracking and ambulance dispatch.

## 👥 User Roles & Features

### 🧑‍⚕️ Patients
- 🔐 Secure login and personal dashboard.
- 📅 Browse doctor profiles and book appointments based on real-time availability.
- 📧 Receive appointment confirmations via email from doctors.
- 📁 Access full medical history including:
  - Medical reports (PDFs)
  - Radiology images
  - Operation history
  - Appointment records
- 🤖 Chat with Dalanda, an integrated medical chatbot for instant advice.
- 🚨 Emergency Mode (Mobile App): With one button, send your live location to the admin who assigns the nearest ambulance to assist.

### 👨‍⚕️ Doctors
- 🗓️ View and manage personalized operation and appointment schedules.
- ✅ Accept or cancel appointments directly from email.
- 📝 Submit medical status updates and upload patient documents (reports, images, etc.).

### 🛠️ Admin
- 🖥️ Manage all system users and operations via a dedicated dashboard.
- 🏥 Create and assign operations directly—patients don't need to request them.
- 🚑 Monitor emergencies and dispatch ambulances to patient locations in real time.

## 💡 Key Features
- 🧑‍⚕️ Doctor & patient account management
- 📅 Smart appointment scheduling & conflict checking
- 📁 Centralized access to patient medical records
- 💬 AI-powered chatbot for quick medical assistance
- 🚨 Mobile-based emergency alert system with GPS tracking
- 📧 Email notifications for appointment status
- 📊 Admin dashboard for operational control
- 🧠 AI-based brain cancer classification model
- 🔍 Advanced search & filter in doctor listings

## 🛠️ Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB + Mongoose
- **AI Chatbot**: Chatbase

## 📱 Emergency System Flow (Mobile App)
1. Patient clicks "Emergency" in the mobile app.
2. The app sends their GPS location to the admin.
3. Admin assigns an ambulance from the dashboard.
4. Ambulance is dispatched to the patient’s location immediately.

## 🚀 Future Enhancements
- 🧠 Smarter AI triage system.
- 📲 Push notifications for real-time updates.
- 🧾 Billing and payment integration.

## 🧪 Getting Started – Run LifeLink Locally
Clone this repository:
```bash
git clone https://github.com/balsemkhouniblossom/fiveA-s.git

Start the backend

cd server
npm install
npm start

Start the frontend

cd template
npm install
npm start


start MobileApp 
cd piLifelink-mobile
npx expo start --offline


start Aimodels
cd  Aimodel
python app.py
