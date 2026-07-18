# Dummy Data

# Meals & Bowls - Test Dataset

Version: 1.0

---

## Purpose

This dataset covers major business scenarios, validations, edge cases, UI states, and notification testing.

---

## Customer Dummy Data

| ID | Full Name | Mobile | Plan | Total Meals | Consumed | Remaining | Validity | Payment | Scenario |
|----|-----------|---------|------|------------:|---------:|----------:|----------|---------|----------|
| C001 | Rahul Sharma | 9876543210 | Gold | 56 | 22 | 34 | Active | Paid | Normal customer |
| C002 | Aman Patel | 9876543211 | Silver | 30 | 5 | 25 | Active | Paid | New customer |
| C003 | Neha Verma | 9876543212 | Gold | 56 | 55 | 1 | Active | Paid | Low meal balance |
| C004 | Priya Singh | 9876543213 | Silver | 30 | 30 | 0 | Active | Paid | No meals left |
| C005 | Mohit Jain | 9876543214 | Gold | 56 | 18 | 38 | Expired | Paid | Expired plan |
| C006 | Riya Gupta | 9876543215 | Silver | 30 | 10 | 20 | Active | Pending | Payment pending |
| C007 | Karan Yadav | 9876543216 | Gold | 56 | 0 | 56 | Active | Paid | First meal |
| C008 | Sneha Joshi | 9876543217 | Silver | 30 | 28 | 2 | Active | Paid | Almost finished |
| C009 | Vivek Mishra | 9876543218 | Gold | 56 | 56 | 0 | Expired | Paid | Fully consumed |
| C010 | Pooja Shah | 9876543219 | Silver | 30 | 12 | 18 | Active | Paid | Meal correction |
| C011 | Deepak Kumar | 9876543220 | Gold | 56 | 40 | 16 | Active | Paid | Payment received |
| C012 | Komal Soni | 9876543221 | Silver | 30 | 15 | 15 | Active | Paid | Mid subscription |
| C013 | Arjun Mehta | 9876543222 | Gold | 56 | 54 | 2 | Active | Paid | Almost complete |
| C014 | Anjali Patel | 9876543223 | Silver | 30 | 2 | 28 | Active | Paid | Recently joined |
| C015 | Nikhil Singh | 9876543224 | Gold | 56 | 31 | 25 | Active | Pending | Partial payment |
| C016 | Aditi Sharma | 9876543225 | Silver | 30 | 0 | 30 | Active | Paid | Fresh subscription |
| C017 | Saurabh Gupta | 9876543226 | Gold | 56 | 50 | 6 | Expires in 2 Days | Paid | Expiring soon |
| C018 | Meera Jain | 9876543227 | Silver | 30 | 29 | 1 | Active | Paid | Last meal remaining |
| C019 | Rohit Das | 9876543228 | Gold | 56 | 8 | 48 | Active | Paid | Regular customer |
| C020 | Kavya Nair | 9876543229 | Silver | 30 | 17 | 13 | Active | Paid | Normal customer |

---

## Test Scenarios

- Normal meal serving
- First meal
- Low meal balance
- Last meal remaining
- No meals remaining
- Expired subscription
- Plan renewal
- Payment pending
- Meal correction
- Customer search
- Dashboard counters
- Reports
- WhatsApp notifications

---

## Notification Test Matrix

- Meal Served → C001
- Meal Corrected → C010
- Subscription Activated → C016
- Plan Renewed → C004
- Low Meal Balance → C003
- Plan Expiring Soon → C017
- Plan Expired → C005
- Payment Received → C011
- Payment Pending → C006
- No Meals Remaining → C018
