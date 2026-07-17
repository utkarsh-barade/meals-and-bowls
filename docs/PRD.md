# Product Requirements Document (PRD)

# 🍽️ Meals & Bowls - Mess Management System

**Version:** 1.0 (MVP)

---

# 1. Product Overview

Meals & Bowls is a web application for managing subscription-based thali plans. It enables administrators to manage customers, subscriptions, meal serving, payments, and reports. Customers can sign up, log in, and view their subscription and meal information.

---

# 2. Business Model

## Silver Plan
- 30 Meals
- 35 Days Validity
- ₹2700

## Gold Plan
- 56 Meals
- 40 Days Validity
- ₹5000

---

# 3. Business Rules

- Every Lunch deducts **1 meal**.
- Every Dinner deducts **1 meal**.
- A customer may take Lunch, Dinner, or both on the same day.
- Meals are deducted only when served.
- A customer can have only one active subscription.
- A meal cannot be marked twice for the same meal type on the same day.
- A subscription expires when all meals are consumed or the validity period ends.
- Admin can correct missed meal entries through Meal History.

---

# 4. User Roles

## Admin
- Login
- Dashboard
- Customer Management
- Plan Assignment
- Meal Management
- Meal History Correction
- Payments
- Reports

## Customer
- Sign Up
- Login
- Dashboard
- Meal History
- Profile

Customers have read-only access.

---

# 5. Functional Requirements

## FR-001
Admin shall be able to create a customer.

## FR-002
Customer information shall include:
- Full Name
- Mobile Number
- Photo

## FR-003
Admin shall be able to assign a subscription plan.

## FR-004
Admin shall be able to serve Lunch.

## FR-005
Admin shall be able to serve Dinner.

## FR-006
System shall deduct one meal whenever Lunch or Dinner is served.

## FR-007
System shall prevent duplicate Lunch entries for the same date.

## FR-008
System shall prevent duplicate Dinner entries for the same date.

## FR-009
Admin shall be able to correct missed meal entries using Meal History.

## FR-010
System shall automatically update remaining meals.

## FR-011
System shall send a WhatsApp notification after every successful meal.

## FR-012
Admin shall be able to record customer payments.

## FR-013
Customer signup shall be allowed only if the mobile number already exists in the system.

## FR-014
Customer shall be able to log in.

## FR-015
Customer shall be able to view:
- Current Plan
- Total Meals
- Consumed Meals
- Remaining Meals
- Plan Validity
- Today's Meal Status

## FR-016
Customer shall be able to view meal history.

---

# 6. Admin Modules

## Dashboard
- Total Customers
- Active Customers
- Lunch Served Today
- Dinner Served Today
- Total Meals Served Today
- Plans Expiring Soon
- Today's Collection

## Customer Management
- Add Customer
- Edit Customer
- View Customer
- Renew Subscription

## Meal Management
- Search Customer
- Serve Lunch
- Serve Dinner
- Prevent duplicate meal entries
- Automatic meal deduction
- WhatsApp notification

## Meal History
- View history
- Correct missed meals

## Payments
- Record payment
- Payment history
- Payment status

## Reports
- Daily Meal Report
- Customer Meal Report
- Expiring Plans
- Pending Payments

---

# 7. Customer Portal

## Sign Up
- Full Name
- Mobile Number
- Password
- Confirm Password

Validation:
- Mobile number must already exist in the system.

## Login
- Mobile Number
- Password

## Dashboard
- Current Plan
- Total Meals
- Consumed Meals
- Remaining Meals
- Plan Start Date
- Plan Expiry Date
- Today's Lunch Status
- Today's Dinner Status
- Payment Status

## Meal History
- Date
- Lunch Status
- Dinner Status

## Profile
- Photo
- Full Name
- Mobile Number

---

# 8. Validation Rules

- Mobile number must be unique.
- One active subscription per customer.
- Meal cannot be served if no meals remain.
- Meal cannot be served after plan expiry.
- Duplicate Lunch/Dinner entries are not allowed for the same date.
- Customer signup requires an existing customer record.

---

# 9. WhatsApp Notifications

The system shall send notifications for:
- Lunch Served
- Dinner Served
- Meal Correction
- Low Meal Balance
- Plan Expiry Reminder
- Plan Renewal Confirmation

---

# 10. User Flow

## Admin

Login
→ Dashboard
→ Add Customer
→ Assign Plan
→ Serve Lunch/Dinner
→ Payments
→ Reports

## Customer

Sign Up
→ Login
→ Dashboard
→ Meal History
→ Profile

---

# 11. Success Criteria

- Customer registration takes less than 30 seconds.
- Meal serving takes less than 5 seconds.
- Meal deductions remain accurate.
- Duplicate meal entries are prevented.
- Customers receive WhatsApp notifications after meal serving.
- Customers can view their subscription and meal information anytime.

---

# 12. Future Scope

- Inventory Management
- Staff Management
- Mobile Application
- Online Payments
- Multi-Branch Support
- Analytics Dashboard
