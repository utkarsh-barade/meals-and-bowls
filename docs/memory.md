# Meals & Bowls - Memory & Context

This file serves as a memory store for the project context, architecture, schema, and current state. 

## System Architecture

- **Backend:** Java 17, Spring Boot 3.3.1, Spring Security + JWT, Spring Data JPA, Hibernate, H2 Database (in-memory for dev).
- **Frontend:** React, Vite, Tailwind CSS, TanStack Query, React Router DOM, Lucide Icons.
- **State Management:** TanStack Query for remote state.
- **Build Tool:** Maven for backend, npm for frontend.

## Key Domains & Rules

1. **Customers:** 
   - Managed by Admin (approve/reject). 
   - Data stored: Full Name, Mobile (unique), Photo.
2. **Subscriptions (Plans):** 
   - e.g., Silver (30 meals), Gold (56 meals). 
   - Customers can have only *one* active subscription at a time.
3. **Meals:**
   - 1 Lunch and 1 Dinner allowed per day per active subscription.
   - Meals cannot be served if subscription is expired or out of credits.
   - Duplicate entries on the same day/type are blocked.
   - Meal corrections can only happen via Meal History.
4. **Payments:**
   - Managed manually by admin. Paid records are logged.
5. **Notifications:**
   - WhatsApp integration for Meal Served, Low Balance (<= 3 meals left), Meal Correction, Customer Approval/Rejection.
   - Notification service runs asynchronously.

## Current State & Recent Fixes (Phase 10 DoD Complete)

- Replaced raw `IllegalStateException` and `IllegalArgumentException` with `AppException` across `MealService` and `SubscriptionService` for consistent HTTP status codes.
- Added a `GlobalExceptionHandler` to gracefully catch and format validation errors and internal exceptions.
- Made the frontend UI fully responsive (desktop/laptop/tablet) by introducing a mobile hamburger menu and removing fixed margins on small screens in `AdminLayout` and `CustomerLayout`.
- Fixed missing `warning` color tokens in `tailwind.config.js`.
- Fixed `isPending` vs `isLoading` syntax issues in `RegistrationRequests.jsx` (TanStack Query v5 compatibility).
- Code is clean, with unused imports and stale comments removed.

## Known Limitations / TODOs

- Backend currently uses H2 in-memory DB by default. For production, the database needs to be switched to MySQL or PostgreSQL by updating `application.yml` and adding the appropriate driver dependency.
- WhatsApp API is currently mocked/stubbed. Real integration requires providing a valid `WHATSAPP_API_TOKEN` and updating the actual HTTP client logic in `WhatsAppNotificationService`.
- JWT Secret should be a secure 256-bit key in production, set via `JWT_SECRET` env variable.
