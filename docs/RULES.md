# Development Rules

# 🍽️ Meals & Bowls - Project Rules

Version: 1.0

---

# Purpose

This document defines the development rules for the Meals & Bowls project to ensure consistency, maintainability, and high-quality code.

---

# ✅ What To Do

## General

- Follow the PRD before implementing any feature.
- Keep the UI simple and easy for non-technical staff.
- Write clean, readable, and maintainable code.
- Use meaningful variable, function, and component names.
- Keep business logic inside the backend.
- Validate all user inputs.
- Handle errors gracefully with user-friendly messages.
- Reuse existing components whenever possible.
- Keep modules independent.

---

## Frontend

- Build reusable UI components.
- Keep pages focused on a single responsibility.
- Show loading indicators during API calls.
- Display success and error messages clearly.
- Make the application responsive.
- Use consistent spacing, colors, and typography.
- Keep forms simple.

---

## Backend

- Keep controllers thin.
- Put business rules in the service layer.
- Validate requests before processing.
- Return consistent API responses.
- Use proper HTTP status codes.
- Write modular services.

---

## Database

- Maintain data integrity.
- Use proper relationships.
- Store timestamps for created and updated records.
- Never delete important business data permanently unless required.

---

## Meal Management

- Deduct exactly one meal for Lunch.
- Deduct exactly one meal for Dinner.
- Prevent duplicate meal entries for the same meal type on the same day.
- Allow meal correction only through Meal History.
- Always update meal history before sending notifications.

---

## Customer Management

- Store only:
  - Full Name
  - Mobile Number
  - Photo
- Ensure mobile numbers are unique.
- Allow only one active subscription per customer.

---

## Notifications

- Send WhatsApp notifications only after a successful operation.
- If notification fails, the meal record must remain saved.
- Log notification failures for review.

---

## Security

- Authenticate every protected request.
- Authorize access based on user role.
- Never expose passwords.
- Store passwords securely.

---

## Code Quality

- Keep functions small.
- Remove unused code.
- Remove unused imports.
- Follow consistent naming conventions.
- Write comments only where they add value.

---

# ❌ What To Avoid

## General

- Do not hardcode business values throughout the codebase.
- Do not duplicate code.
- Do not mix UI logic with business logic.
- Do not ignore validation.
- Do not ignore exceptions.
- Do not leave debugging code in production.
- Do not commit secrets or API keys.

---

## Frontend

- Avoid deeply nested components.
- Avoid inline business logic.
- Avoid inconsistent UI patterns.
- Avoid unnecessary re-renders.

---

## Backend

- Do not access the database directly from controllers.
- Do not write business logic in controllers.
- Do not return raw exception messages.
- Do not create large service classes.

---

## Database

- Do not delete meal history records.
- Do not create duplicate customer records.
- Do not allow multiple active subscriptions.
- Do not allow duplicate meal entries.

---

## Meal Management

- Do not deduct meals twice.
- Do not serve meals after subscription expiry.
- Do not serve meals when no meal credits remain.
- Do not allow the same Lunch or Dinner to be marked twice on the same date.

---

## Customer Portal

- Do not allow customers to edit subscription details.
- Do not allow customers to edit meal history.
- Do not allow customers to create accounts using unregistered mobile numbers.

---

# Development Principles

- Simplicity over complexity.
- Consistency over cleverness.
- Readability over shortcuts.
- Reusability over duplication.
- Security by default.
- Performance where it matters.
- Build for maintainability.

---

# Definition of Done

A feature is considered complete only if:

- Business rules are implemented.
- Validation is complete.
- Error handling is complete.
- UI is responsive.
- API is tested.
- No critical bugs remain.
- Code is reviewed.
- Documentation is updated where necessary.
