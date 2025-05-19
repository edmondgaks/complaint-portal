# complaint-portal


# Citizen Engagement System (CivicVoice)

A modern, user-friendly platform that empowers citizens to submit and track complaints about public services while enabling government administrators to efficiently manage and respond to citizen feedback.

## 🌟 Features

### For Citizens
- **Easy Complaint Submission**
  - Intuitive form with category selection
  - Optional photo upload
  - Anonymous submission option
  - Real-time validation and feedback

- **Efficient Tracking**
  - Unique complaint ID for each submission
  - Real-time status updates
  - Complete complaint history
  - Visual progress indicators

### For Administrators
- **Powerful Dashboard**
  - Comprehensive complaint overview
  - Advanced filtering and search
  - Department-wise categorization
  - Analytics and insights

- **Complaint Management**
  - Status updates and responses
  - Department assignment
  - Resolution tracking
  - Performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm 

## 🔑 Demo Credentials

### Admin Access
- **Email:** admin@example.com
- **Password:** admin123

### Department Access
- **Water Department**
  - Email: water@example.com
  - Password: water123
- **Roads Department**
  - Email: roads@example.com
  - Password: roads123

## 🔄 Application Flow

### Citizen Journey
1. **Submit Complaint**
   - Visit the homepage
   - Click "Submit a Complaint"
   - Fill out the complaint form
   - Receive a unique tracking ID

2. **Track Complaint**
   - Visit "Track Complaint"
   - Enter the tracking ID
   - View complaint status and updates

### Administrator Journey
1. **Login**
   - Access admin login
   - Enter credentials
   - Access department-specific dashboard

2. **Manage Complaints**
   - View assigned complaints
   - Update status
   - Respond to citizens
   - Track resolution metrics

## 📱 Pages and Components

### Public Pages
- **Home (`/`)**
  - Landing page with feature overview
  - Quick access to submit/track complaints

- **Submit Complaint (`/submit`)**
  - Complaint submission form
  - Category selection
  - Location input
  - Media upload

- **Track Complaint (`/track`)**
  - Complaint tracking interface
  - Status updates
  - Communication history

### Admin Pages
- **Admin Login (`/admin/login`)**
  - Secure authentication
  - Role-based access

- **Dashboard (`/admin/dashboard`)**
  - Complaint overview
  - Analytics
  - Department filters

- **Complaint Details (`/admin/dashboard/complaint/:id`)**
  - Detailed complaint view
  - Status management
  - Response system

## 🔧 Technical Details

### Built With
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

### Key Features Implementation
- **State Management**
  - React Context API
  - Local Storage persistence
  - Real-time updates

- **Authentication**
  - Role-based access control
  - Protected routes
  - Secure session management

- **Routing**
  - React Router v6
  - Dynamic route handling
  - Protected admin routes

### Data Structure
```typescript
interface Complaint {
  id: string;
  category: string;
  department: Department;
  location: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updates: StatusUpdate[];
  // ... other fields
}

type ComplaintStatus = 
  | 'Received'
  | 'In Progress'
  | 'Under Review'
  | 'Resolved'
  | 'Closed';

type Department = 
  | 'Roads'
  | 'Water'
  | 'Electricity'
  | 'Sanitation'
  | 'Parks'
  | 'Public Safety'
  | 'Other';
```

## 📊 Analytics Features
- Complaint distribution by status
- Department-wise statistics
- Resolution time tracking
- Trend analysis
- Performance metrics

## 🛠️ Configuration

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Winston Logger
- Multer for file uploads


## 🔒 Security Features
- Protected admin routes
- Role-based access control
- Input validation


## 🎨 UI/UX Features
- Responsive design
- Mobile-first approach
- Accessible components
- Real-time feedback
- Loading states
- Error handling

## 📱 Mobile Responsiveness
The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)


