# Emergency Report System - Setup Guide

## ✅ Features Implemented

### 1. **Incident Category Selection**
   - Injured Animal
   - Stray Animal
   - Animal Abuse
   - Lost Pet
   - Wildlife Issue
   - Other

### 2. **Priority Level Selection**
   - Low
   - Medium (default)
   - High
   - Critical

### 3. **Photo Upload Capability**
   - Optional photo upload with validation
   - Supports: JPEG, PNG, GIF, WebP
   - Max file size: 5MB
   - Photos stored in `backend/uploads/emergency-reports/` directory

### 4. **Backend API Integration**
   - Full CRUD operations for emergency reports
   - MongoDB database storage
   - File upload with multer middleware
   - Proper error handling and validation

---

## 📦 Backend Installation

### Step 1: Install Dependencies
```bash
cd backend
npm install multer
```

### Step 2: Create .env File (if not already present)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Step 3: Start Backend Server
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

---

## 🎨 Frontend Setup

The frontend Emergency Report page has been updated with:
- Form fields: Name, Email, Mobile, Address, Description
- Category dropdown selector
- Priority level selector
- Photo upload file input
- Form validation and loading states
- API integration with backend

### Step 1: Install Dependencies (if needed)
```bash
cd frontend
npm install
```

### Step 2: Start Frontend Server
```bash
npm run dev
```

---

## 📝 API Endpoints

### Get All Reports
- **GET** `/api/emergency-reports`
- Returns: Array of all emergency reports

### Create New Report
- **POST** `/api/emergency-reports`
- Body: FormData with:
  - `name` (required)
  - `email` (required)
  - `mobile` (required)
  - `address` (required)
  - `description` (required)
  - `category` (required): injured-animal | stray-animal | animal-abuse | lost-pet | wildlife-issue | other
  - `priority` (optional): low | medium | high | critical
  - `photo` (optional): Image file

### Get Single Report
- **GET** `/api/emergency-reports/:id`
- Returns: Single report by ID

### Update Report
- **PUT** `/api/emergency-reports/:id`
- Body: `{ status, priority }`
- Used to update report status and priority

### Delete Report
- **DELETE** `/api/emergency-reports/:id`
- Deletes a report

---

## 📁 File Structure

### Backend
```
backend/
├── models/
│   └── EmergencyReport.js         (New)
├── controllers/
│   └── emergencyReportController.js  (New)
├── routes/
│   └── emergencyReportRoutes.js      (New)
├── uploads/
│   └── emergency-reports/            (New - auto-created)
├── server.js                         (Updated)
├── package.json                      (Updated)
└── .gitignore                        (New)
```

### Frontend
```
frontend/src/pages/
├── EmergencyReport.jsx              (New)
└── EmergencyReport.css              (New)
```

---

## 🔄 How It Works

1. **User fills form** with all required incident details
2. **Optionally uploads photo** of the incident
3. **Clicks Submit Report**
4. **Frontend:**
   - Creates FormData object with all fields
   - Sends POST request to backend API
   - Shows loading state while submitting
   - Displays success/error message
   - Clears form on successful submission

5. **Backend:**
   - Receives request with FormData
   - Validates all required fields
   - Processes photo upload with multer
   - Stores report in MongoDB
   - Returns success response

6. **Database:**
   - Stores report with timestamp
   - Default status: "pending"
   - Photo stored in filesystem with unique name
   - All reports retrievable via API

---

## 🚀 Next Steps (Optional Enhancements)

1. **Admin Dashboard** - Create admin panel to view/manage reports
2. **Email Notifications** - Send confirmation email to submitter
3. **Report Tracking** - Allow users to track their reports with unique ID
4. **Map Integration** - Show incident location on map
5. **Image Gallery** - Display uploaded photos in report details
6. **User Authentication** - Add user login/signup for tracking reports
7. **Analytics** - Dashboard showing incident statistics

---

## ⚠️ Important Notes

- **Photo uploads** are currently disabled for Web3Forms, backend API is used instead
- **API URL** is set to `http://localhost:5000` - update for production
- **CORS** is enabled on backend to accept requests from frontend
- **File uploads** are stored locally - consider cloud storage for production
- **Validation** happens on both frontend and backend

---

## 🐛 Troubleshooting

### Error: "Error submitting report"
- Check if backend server is running on port 5000
- Verify MongoDB connection is working
- Check browser console for detailed error messages

### Error: "File too large"
- Max file size is 5MB
- Use image compression tools
- Try with a smaller image

### Photos not uploading
- Check file format (JPEG, PNG, GIF, WebP)
- Verify uploads directory exists and has write permissions
- Check file size is under 5MB

---

## ✨ Configuration

To customize the system:

1. **Change upload directory** - Edit `emergencyReportRoutes.js` destination path
2. **Modify file size limit** - Change `limits: { fileSize: 5 * 1024 * 1024 }` in routes
3. **Add more categories** - Update EmergencyReport model enum values
4. **Change API base URL** - Update EmergencyReport.jsx fetch URL
