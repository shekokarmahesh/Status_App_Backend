

# Status Page Backend

Status
Node.js
MongoDB
Clerk

A robust backend API for a status page monitoring system that enables organizations to monitor services, manage incidents, schedule maintenance events, and track website uptime.

---

## 🚀 Overview

This project provides a backend solution for managing and displaying the operational status of services. It includes features such as:

- **Service Status Management**: Track and update the status of services.
- **Incident Tracking**: Document and update incidents affecting services.
- **Maintenance Events**: Schedule and monitor maintenance activities.
- **Website Monitoring**: Monitor uptime and response times of websites.
- **Authentication**: Secure API with Clerk integration.
- **Multi-Tenant Architecture**: Organization-based data separation.

---

## 🛠️ Features

- **Service Groups**: Organize services by categories.
- **Incident Updates**: Add updates to incidents for real-time communication.
- **Scheduled Maintenance**: Inform users about upcoming maintenance events.
- **Website Health Checks**: Automated checks for website availability.
- **Role-Based Access Control**: Admin privileges for managing organization data.

---

## 🧰 Tech Stack

| Technology | Purpose |
| :-- | :-- |
| Node.js + Express | Backend framework |
| MongoDB + Mongoose | Database management |
| Clerk | Authentication \& user management |
| dotenv | Environment variable handling |
| CORS Middleware | Cross-origin resource sharing |

---

## 📂 Project Structure

```
status-page-backend/
├── middleware/             # Custom middleware
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/                 # MongoDB models
│   ├── Incident.js         # Incident model
│   ├── Maintenance.js      # Maintenance model 
│   ├── Service.js          # Service model
│   └── WebsiteModel.js     # Website monitoring model
├── routes/                 # API routes
│   ├── incidentRoutes.js   # Incident endpoints
│   ├── maintenanceRoutes.js# Maintenance endpoints
│   ├── serviceRoutes.js    # Service endpoints
│   └── websiteRoutes.js    # Website monitoring endpoints
├── seeds/                  # Database seed scripts
├── utils/                  # Utility functions
├── .env                    # Environment variables (not in repo)
├── package.json            # Project dependencies
└── server.js               # Application entry point
```

---

## 📖 API Endpoints

### Public Endpoints

- `GET /api/public` - Health check endpoint.


### Protected Endpoints (require authentication)

#### Services API

- `GET /api/services` - Fetch all services.
- `POST /api/services` - Create a new service.
- `PATCH /api/services/:id` - Update a service.
- `DELETE /api/services/:id` - Delete a service.


#### Incidents API

- `GET /api/incidents` - Fetch all incidents.
- `POST /api/incidents` - Create a new incident.
- `PATCH /api/incidents/:id` - Update an incident.


#### Maintenance API

- `GET /api/maintenance` - Fetch all maintenance events.
- `POST /api/maintenance` - Create a new maintenance event.
- `PATCH /api/maintenance/:id` - Update a maintenance event.


#### Website Monitoring API

- `POST /api/v1/website` - Register a website to monitor.
- `GET /api/v1/website/status` - Get website status.

---

## 🔒 Authentication

This project uses Clerk for secure authentication. Key middleware includes:

1. **requireAuth()**: Ensures authenticated access.
2. **requireOrganization()**: Enforces organization context.
3. **requireAdmin()**: Grants admin privileges.

---

## 📋 Database Models

### Service Model

Tracks monitored services with fields like name, description, status, and group.

### Incident Model

Manages incidents with title, impact level, affected services, and updates.

### Maintenance Model

Schedules maintenance events with start/end times and updates.

### Website Model

Monitors websites' uptime and response times.

---

## 🛠️ Getting Started

### Prerequisites

1. Node.js (v14+)
2. MongoDB Atlas account
3. Clerk account for authentication

### Installation

1. Clone the repository:

```
git clone https://github.com/&lt;your-repo&gt;/status-page-backend.git
```

2. Install dependencies:

```
npm install
```

3. Set up environment variables in `.env`:

```
PORT=5050
MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@&lt;cluster&gt;/&lt;database&gt;
CLERK_SECRET_KEY=your_clerk_secret_key
```


### Run the Server

Development mode:

```
npm run dev
```

Production mode:

```
npm start
```

---

## 🌱 Database Seeding

Seed your database using these scripts:

```
node seeds/serviceSeeds.js
node seeds/incidentSeeds.js
node seeds/maintenanceSeeds.js
node seeds/websiteSeeds.js
```


---

## 🙌 Author

Developed by Mahesh Shekokar. Contributions are welcome!

---

Feel free to reach out for support or feature requests!

