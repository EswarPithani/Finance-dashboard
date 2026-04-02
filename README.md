# Finance Data Processing and Access Control Backend

## Project Overview

This project implements a comprehensive finance data processing backend system with role-based access control for the Zorvyn Backend Developer Intern + FTE assignment. The system allows different users to interact with financial records based on their assigned roles (Viewer, Analyst, Admin). It includes complete user management, transaction CRUD operations, dashboard analytics with summary APIs, and secure JWT authentication.

The backend is built with Node.js and Express.js, uses MongoDB Atlas for data persistence, and includes a React frontend dashboard for demonstration purposes. The system is fully deployed and accessible via live URLs for immediate evaluation.

---

## Live Demo

| Component | URL |
|-----------|-----|
| Frontend Application | https://finance-dashboard-front.vercel.app |
| Backend API | https://finance-dashboard-api-mrtt.onrender.com |


### Demo Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@demo.com | admin123 | Full CRUD + User Management |
| Analyst | analyst@demo.com | analyst123 | Create/Read/Update (No Delete) |
| Viewer | viewer@demo.com | viewer123 | Read Only |

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | Node.js | v18.x | JavaScript runtime |
| Backend Framework | Express.js | 4.18.x | Web framework |
| Database | MongoDB Atlas | 6.0 | Cloud database |
| ODM | Mongoose | 7.5.x | Object data modeling |
| Authentication | JWT | 9.0.x | Token-based auth |
| Password Encryption | bcryptjs | 2.4.x | Password hashing |
| Validation | express-validator | 7.0.x | Input validation |
| Security | helmet, cors | Latest | Security middleware |
| Frontend | React | 18.2.x | UI framework |
| Styling | Tailwind CSS | 3.3.x | Utility-first CSS |
| Charts | Recharts | 2.8.x | Data visualization |
| HTTP Client | Axios | 1.5.x | API requests |
| Deployment (Backend) | Render | - | Cloud hosting |
| Deployment (Frontend) | Vercel | - | Cloud hosting |

---

## Features Implemented

### Core Requirements (100% Complete)

#### 1. User and Role Management
- User registration with name, email, and password
- User login with JWT token generation
- Three distinct roles: Viewer, Analyst, Admin
- User status management (active/inactive)
- Role-based middleware for authorization
- Get current user profile endpoint
- Email validation and duplicate email prevention

#### 2. Financial Records Management
- Create transaction entries with amount, type, category, date, description
- View all transactions with pagination support
- View single transaction by ID
- Update existing transactions
- Delete transactions (restricted to admin only)
- Filter transactions by date range, category, and type
- Sort transactions by amount or date
- Pagination with customizable page and limit parameters

#### 3. Dashboard Summary APIs
- Total income calculation over selected date range
- Total expenses calculation over selected date range
- Net balance computation (income - expenses)
- Category-wise breakdown with amounts
- Recent activity (last 5 transactions)
- Monthly trends for last 6 months
- Date range filtering for dashboard data
- Aggregated data using MongoDB aggregation pipeline

#### 4. Access Control Logic
- Viewer role: Read-only access to all data
- Analyst role: Read, Create, Update access (no delete)
- Admin role: Full CRUD access including user management
- Middleware-based authorization before route handlers
- Route-level protection with JWT verification
- User ownership validation for transactions

#### 5. Validation and Error Handling
- Input validation for all request bodies
- Email format validation using regex
- Password strength validation (min 6 characters, letters and numbers)
- Amount validation (positive numbers only)
- Category and type enum validation
- Proper HTTP status codes for different scenarios
- Descriptive error messages for debugging
- Centralized error handling middleware

#### 6. Data Persistence
- MongoDB Atlas cloud database for reliable storage
- Mongoose schemas with validation rules
- Indexes on frequently queried fields
- Relationship between User and Transaction models
- Proper data types and constraints

### Optional Enhancements Implemented
- JWT authentication with token expiration (7 days)
- Pagination for transaction listing
- Filtering and search support
- Interactive React dashboard with charts
- Responsive UI design
- Toast notifications for user feedback
- Loading states for better UX
- CORS configuration for secure cross-origin requests
- Helmet.js for security headers
- Environment variable configuration

---

## Assumptions Made

During the development of this assignment, the following assumptions were made to ensure clarity and focused implementation:

### User Management Assumptions
1. **Role Assignment**: Users are assigned roles during registration and cannot change their own role. Only an admin would have the ability to change roles in a production system, but this feature was not explicitly required.
2. **User Status**: New users are automatically set to 'active' status upon registration. Admin users can change status through database directly as no admin panel was built.
3. **Email Uniqueness**: Email addresses must be unique across the system. No two users can register with the same email.
4. **Password Requirements**: Passwords must be at least 6 characters and contain at least one letter and one number. This provides basic security without overcomplicating.

### Transaction Assumptions
1. **Currency**: All amounts are in USD (US Dollars). No multi-currency support was implemented as not required.
2. **Categories**: Seven predefined categories (food, transport, utilities, entertainment, salary, investment, other) cover most common transaction types.
3. **Date Format**: All dates are stored in ISO format and expected in YYYY-MM-DD format from the client.
4. **Transaction Ownership**: Every transaction belongs to exactly one user. Users can only see and modify their own transactions unless they are an admin.
5. **No Soft Delete**: Transactions are permanently deleted from the database. Soft delete was considered but not implemented as an optional enhancement.

### Dashboard Assumptions
1. **Default Date Range**: If no date range is provided, the dashboard shows data from the last 30 days.
2. **Monthly Trends**: Trends are calculated for the last 6 complete months plus the current month to date.
3. **Category Breakdown**: Shows all categories even if they have zero transactions for consistency.

### Authentication Assumptions
1. **Token Storage**: JWT tokens are stored in localStorage on the frontend. In production, secure HTTP-only cookies would be better but localStorage was used for simplicity.
2. **Token Expiration**: Tokens expire after 7 days. Users must log in again after expiration.
3. **No Refresh Tokens**: Refresh token mechanism was not implemented as it was an optional enhancement.

### Frontend Assumptions
1. **Responsive Design**: The dashboard is designed for desktop screens primarily but includes basic mobile responsiveness.
2. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) are supported.
3. **API Error Handling**: Frontend displays toast notifications for API errors rather than complex error pages.

### Deployment Assumptions
1. **Free Tier Limitations**: Both Render and Vercel free tiers are used. First request to backend may take 30-40 seconds (cold start).
2. **Environment Variables**: All sensitive data is stored in environment variables, not hardcoded.
3. **CORS Configuration**: Only specific frontend URLs are allowed to access the API.

---

## Tradeoffs Considered

Several tradeoffs were made during development to balance requirements, time constraints, and best practices:

### Database Choice: MongoDB vs PostgreSQL

**Chosen**: MongoDB Atlas

**Reasoning**:
- Flexible schema allows easy iteration during development
- Document model matches JavaScript/Node.js ecosystem naturally
- Aggregation pipeline is powerful for dashboard analytics
- Free tier is generous for demonstration purposes

**Tradeoff**: 
- Lost relational integrity features like foreign key constraints
- More complex joins compared to SQL
- Less mature for financial applications requiring strict ACID compliance

### Authentication: JWT vs Sessions

**Chosen**: JWT (JSON Web Tokens)

**Reasoning**:
- Stateless authentication works well with REST APIs
- No server-side session storage required
- Easy to scale horizontally
- Simpler implementation for assignment scope

**Tradeoff**:
- Tokens cannot be invalidated easily before expiration
- Larger payload size compared to session IDs
- Token stored in localStorage (vulnerable to XSS)

**Mitigation**:
- Short token expiration time (7 days)
- Implemented logout on frontend (clears token)
- In production, use HTTP-only cookies with refresh tokens
---

## Setup Process

### Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v14 or higher | `node --version` |
| MongoDB | Local or Atlas | - |
| npm | v6 or higher | `npm --version` |
| Git | Latest | `git --version` |

### Local Development Setup

#### Step 1: Clone Repository

```bash
git clone reponame
cd finance-dashboard
```

## Backend Setup 
cd backend
npm install

## Start Backend Server
npm run dev 


##  Frontend Setup (New Terminal)
cd frontend
npm install
npm start


**Project Structure:**

finance-dashboard-zorvyn/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── scripts/
│   │   ├── createDummyUsers.js
│   │   └── createSampleTransactions.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Transactions.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md


# Setup and Installation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn package manager

## Local Development Setup

### 1. Clone the repository
git clone Finance-dashboard
cd finance-dashboard

## Backend Setup
cd backend
npm install

## Access the application
- Frontend: https://finance-dashboard-front.vercel.app
- Backend API: https://finance-dashboard-api-mrtt.onrender.com
