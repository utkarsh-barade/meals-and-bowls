# 🍱 Admin & Customer System Features

## 1. Official Subscription Plans & Thali Specs

| Plan | Total Meals | Price | Validity | Cost Per Meal | Scope |
|---|---|---|---|---|---|
| **Plan 1** | 30 Meals | ₹2,700 | 35 Days | ~₹90 / meal | Lunch OR Dinner |
| **Plan 2 (Best Value)** | 56 Meals | ₹5,000 | 40 Days | ~₹89 / meal | Lunch AND Dinner |

### 🍱 7 Items Included Per Meal
1. 🥖 **Roti** (Soft wheat roti)
2. 🥗 **Seasonal Sabji** (Menu changes daily)
3. 🍲 **Dal** (Golden lentil tadka)
4. 🍚 **Rice** (Basmati rice)
5. 🥣 **Raita** (Curd raita with boondi)
6. 🥗 **Salad** (Cucumber, tomato & onion)
7. 🫙 **Pickle** (Home-style pickle)

*Takeaway / Parcel Charges: ₹10 Extra Per Meal. Jain Food available on request.*

---

## 2. Admin Panel Capabilities (`/admin/*`)

- **Dashboard (`/admin/dashboard`)**: Total customers count, meals served today, active plan stats, expiring plans table.
- **Customer Management (`/admin/customers`)**: Add Customer, View Profile, Edit Details, Search/Filter, Delete Customer.
- **Plan Assignment (`/admin/customers`)**: Modal to assign Plan 1 or Plan 2 with auto-calculated start & end dates.
- **Meal Management (`/admin/meal-management`)**: 1-Click Lunch/Dinner serving, status toggle, meal correction modal with audit logs.
- **Payment Records (`/admin/payments`)**: Record manual or online payments, transaction history table.
- **Reports & Analytics (`/admin/reports`)**: Exportable daily served meal counts, customer consumption breakdown.
- **WhatsApp Status (`/admin/whatsapp`)**: Live Gateway connection status, QR code scanner, pending queue counter, **Generate New QR** session reset button.

---

## 3. Customer Portal Capabilities (`/customer/*`)

- **Login & Signup (`/login`, `/signup`)**: Phone number authentication.
- **Dashboard (`/dashboard`)**: Active Subscription details, Meals Remaining gauge, Expiry date alert.
- **Meal History (`/meal-history`)**: Complete date-wise consumption log (Lunch & Dinner).
- **Profile (`/profile`)**: Manage personal details and delivery address.
