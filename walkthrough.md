# Walkthrough — Customized Plan Feature

This walkthrough summarizes the implementation of the **Customized Plan** feature in the Meals & Bowls application and the port configuration updates.

---

## Changes Made

### 1. Backend (Spring Boot)
- **Request DTO ([AssignPlanRequest.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/AssignPlanRequest.java))**:
  - Removed `@NotNull` validation from `planId`.
  - Added new fields for custom plans: `isCustom`, `customName`, `customPrice`, `customTotalMeals`, and `customValidityDays`.
- **Subscription Service ([SubscriptionService.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/SubscriptionService.java))**:
  - Modified the signature of `assignPlan` to accept the `AssignPlanRequest` payload instead of a single `planId`.
  - Added validation for custom plan input parameters when `isCustom` is true.
  - Implemented the logic to directly create a custom subscription with user-specified values (name, price, total meals, and validity days).
  - Dynamically configured WhatsApp notifications to pull parameters from the `saved` subscription entity, ensuring standard and custom subscriptions both send formatted messages correctly.
- **Subscription Controller ([SubscriptionController.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/SubscriptionController.java))**:
  - Updated the POST endpoint (`/api/admin/customers/{customerId}/subscriptions`) to pass the request body payload directly.
- **CORS Configuration ([CorsConfig.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/config/CorsConfig.java) & [application.yml](file:///e:/Downloads/meals-bowls/backend/src/main/resources/application.yml))**:
  - Added support for `http://localhost:5175` as an allowed origin.

### 2. Frontend (React)
- **API Service ([subscriptionService.js](file:///e:/Downloads/meals-bowls/frontend/src/services/subscriptionService.js))**:
  - Updated `assignPlan` to accept and send the payload object.
- **Assign Plan UI Modal ([AssignPlanModal.jsx](file:///e:/Downloads/meals-bowls/frontend/src/pages/admin/customers/AssignPlanModal.jsx))**:
  - Replaced the simple list design with a tabbed interface ("Standard Plans" and "Custom Plan").
  - Under "Custom Plan", rendered validation-guarded inputs using our custom `Input` component for Plan Name, Price, Total Meals, and Validity Days.
  - Integrated submitting either standard or custom configurations depending on the active tab.
- **Vite Dev Server ([vite.config.js](file:///e:/Downloads/meals-bowls/frontend/vite.config.js))**:
  - Shifted the default port from `5173` to `5175`.

---

## How to Verify & Run

1. **Start the Frontend**:
   - Run `npm run dev` in the frontend directory.
   - Verify that the app opens on **`http://localhost:5175`**.
2. **Start the Backend**:
   - Compile and start the Spring Boot backend on port **`8080`**.
3. **Verify Standard Plan**:
   - Go to a customer details page in the Admin Dashboard, click **Assign Plan**, choose any standard plan, and assign it. Verify that it still works perfectly.
4. **Verify Custom Plan**:
   - Click **Assign Plan** again, switch to the **Custom Plan** tab.
   - Fill in custom values (e.g., Name: `Corporate Extra Plan`, Price: `2000`, Meals: `35`, Validity: `30`) and click **Assign Plan**.
   - Verify that the customer dashboard shows the correct active custom subscription and the WhatsApp message is sent out with the custom details!
