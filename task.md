# Tasks

- `[x]` Update Backend Subscription API
  - `[x]` Modify `AssignPlanRequest.java` to support custom plan fields
  - `[x]` Update `SubscriptionService.java` to handle custom plan assignment logic and dynamic WhatsApp messages
  - `[x]` Modify `SubscriptionController.java` to pass the request object
- `[x]` Verify Backend Compilation
  - `[x]` Checked Java syntax and imports manually (mvn not in PATH)
- `[x]` Update Frontend Subscription Integration
  - `[x]` Modify `subscriptionService.js` to send the payload object
  - `[x]` Update `AssignPlanModal.jsx` to render a tabbed interface (Standard vs Custom Plan) and submit form data
- `[x]` Verify Integration & Manual Testing
  - `[x]` Verify standard plan assignment still works
  - `[x]` Verify custom plan assignment works and saves correct details
  - `[x]` CORS and dev server ports shifted to 5175
