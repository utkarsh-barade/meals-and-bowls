# Architecture Document

# 🍽️ Meals & Bowls - System Architecture

Version: 1.0 (MVP)

---

# 1. High Level Architecture

```text
                    +----------------------+
                    |      Web Browser     |
                    +----------+-----------+
                               |
                +--------------+--------------+
                |                             |
        +-------v--------+           +--------v--------+
        |  Admin Portal  |           | Customer Portal |
        +-------+--------+           +--------+--------+
                \                           /
                 \                         /
                  +-----------+-----------+
                              |
                    REST API / HTTPS
                              |
                  +-----------v-----------+
                  |   Backend Application |
                  | Business Logic Layer  |
                  +-----------+-----------+
                              |
         +--------------------+--------------------+
         |                    |                    |
 +-------v------+     +-------v-------+    +-------v------+
 | Authentication|     | WhatsApp API |    | File Storage |
 +--------------+     +---------------+    +--------------+
                              |
                  +-----------v-----------+
                  |      Database         |
                  +-----------------------+
```

---

# 2. Application Flow

## Admin Flow

```text
Login
   │
   ▼
Dashboard
   │
   ├── Customers
   │      ├── Add Customer
   │      ├── Edit Customer
   │      ├── Assign Plan
   │      └── View Details
   │
   ├── Meal Management
   │      ├── Serve Lunch
   │      ├── Serve Dinner
   │      └── Meal History
   │
   ├── Payments
   │
   └── Reports
```

## Customer Flow

```text
Sign Up
   │
   ▼
Login
   │
   ▼
Dashboard
   │
   ├── Current Plan
   ├── Meal Summary
   ├── Meal History
   └── Profile
```

---

# 3. Meal Serving Flow

```text
Customer Arrives
        │
        ▼
Admin Opens Meal Management
        │
        ▼
Search Customer
        │
        ▼
Serve Lunch / Serve Dinner
        │
        ▼
Validate Subscription
        │
        ├── Active?
        ├── Meals Remaining?
        └── Meal Already Served?
        │
        ▼
Save Meal History
        │
        ▼
Increase Meals Consumed
        │
        ▼
Send WhatsApp Notification
        │
        ▼
Success
```

---

# 4. Project Folder Structure

```text
meals-bowls/

├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── customers/
│   │   │   │   ├── meal-management/
│   │   │   │   ├── meal-history/
│   │   │   │   ├── payments/
│   │   │   │   └── reports/
│   │   │   └── customer/
│   │   │       ├── auth/
│   │   │       ├── dashboard/
│   │   │       ├── meal-history/
│   │   │       └── profile/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/mealsbowls/
│   │   │   │       ├── config/
│   │   │   │       ├── auth/
│   │   │   │       ├── customer/
│   │   │   │       ├── plan/
│   │   │   │       ├── subscription/
│   │   │   │       ├── meal/
│   │   │   │       ├── payment/
│   │   │   │       ├── report/
│   │   │   │       ├── notification/
│   │   │   │       ├── common/
│   │   │   │       └── exception/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── BUSINESS_RULES.md
│   └── USER_FLOW.md
│
└── README.md
```

---

# 5. Backend Module Architecture

```text
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
```

Supporting Layers

- DTO
- Entity
- Mapper
- Validation
- Exception Handling
- Notification Service

---

# 6. Frontend Architecture

```text
Pages
   │
   ▼
Components
   │
   ▼
Services
   │
   ▼
API
```

---

# 7. Technology Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod

## Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Lombok
- MapStruct

## Database
- MySQL

## Authentication
- JWT

## Notifications
- WhatsApp Cloud API

## Build Tools
- Maven
- npm

---

# 8. Design Principles

- Clean Architecture
- Feature-based module organization
- Separation of concerns
- RESTful APIs
- Responsive UI
- Secure authentication
- Scalable and maintainable codebase
