# Implementation Plan — Add Customized Plan Feature

This plan details the implementation of a **Customized Plan** feature, enabling the admin to assign a subscription to a customer with a custom plan name, price, number of meals, and validity days. 

This change is designed to be **fully backward-compatible**, meaning the existing standard plans flow will continue to work without any modifications to its user experience or backend database records.

---

## Proposed Changes

### Backend (Spring Boot)

#### [MODIFY] [AssignPlanRequest.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/AssignPlanRequest.java)
- Remove `@NotNull` constraint on `planId` to allow custom plan assignments.
- Add fields for custom plans:
  - `isCustom` (Boolean)
  - `customName` (String)
  - `customTotalMeals` (Integer)
  - `customValidityDays` (Integer)
  - `customPrice` (Double)

```java
package com.mealsbowls.subscription;

import lombok.Data;

@Data
public class AssignPlanRequest {
    private Long planId; // Nullable if isCustom is true
    
    private Boolean isCustom;
    private String customName;
    private Integer customTotalMeals;
    private Integer customValidityDays;
    private Double customPrice;
}
```

#### [MODIFY] [SubscriptionService.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/SubscriptionService.java)
- Update `assignPlan(Long customerId, Long planId)` signature to `assignPlan(Long customerId, AssignPlanRequest request)`.
- If `request.getIsCustom()` is `true`:
  - Validate that `customName`, `customTotalMeals`, `customValidityDays`, and `customPrice` are not null or empty.
  - Set `planId` to `null` (or a default placeholder like `0L`).
  - Set the subscription properties (`planName`, `planPrice`, `mealsTotal`, `expiryDate`) directly from the custom request fields.
- If `request.getIsCustom()` is false/null:
  - Fetch the plan from `planRepository` as before, throw an exception if not found, and set properties from the standard plan.
- Update the WhatsApp message formatting block to fetch details from the `saved` subscription entity (e.g. `saved.getPlanName()`, `saved.getMealsTotal()`) instead of the `plan` variable. This ensures WhatsApp notifications work dynamically for both standard and custom plans.

#### [MODIFY] [SubscriptionController.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/subscription/SubscriptionController.java)
- Pass the entire `AssignPlanRequest` request object to `subscriptionService.assignPlan`.

---

### Frontend (React)

#### [MODIFY] [subscriptionService.js](file:///e:/Downloads/meals-bowls/frontend/src/services/subscriptionService.js)
- Update `assignPlan(customerId, payload)` to accept a payload instead of a single `planId`.
  ```javascript
  assignPlan: async (customerId, payload) => {
    return axios.post(`/api/admin/customers/${customerId}/subscriptions`, payload);
  }
  ```

#### [MODIFY] [AssignPlanModal.jsx](file:///e:/Downloads/meals-bowls/frontend/src/pages/admin/customers/AssignPlanModal.jsx)
- Add a tab header inside the modal: **"Standard Plans"** and **"Custom Plan"**.
- Keep the existing scrollable list of plans under the **Standard Plans** tab.
- Render a form under the **Custom Plan** tab with inputs:
  - Plan Name (Text input)
  - Price (₹) (Number input)
  - Number of Meals (Number input)
  - Validity (Days) (Number input)
- Handle form state and basic validation (non-empty fields, positive values).
- Call `assignPlan` with:
  - `{ planId: selectedPlan }` for standard plans.
  - `{ isCustom: true, customName, customPrice, customTotalMeals, customValidityDays }` for custom plans.

---

## Verification Plan

### Automated Tests
- Check compilation of backend using maven package or compiler verification command.

### Manual Verification
1. Open the Admin Panel and navigate to a Customer details page.
2. Click **Assign Plan** to open the modal.
3. Verify that standard plans still load and can be assigned as before.
4. Switch to the **Custom Plan** tab.
5. Enter custom details (e.g., Name: `Special Custom Plan`, Price: `1500`, Meals: `30`, Validity: `28`).
6. Click **Assign Plan** and verify:
   - A new active subscription is assigned with the custom values.
   - A pending payment is created with the exact custom price.
   - WhatsApp message sends the correct customized plan parameters.
