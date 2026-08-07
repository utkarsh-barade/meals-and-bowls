# 🔌 API Endpoint Reference

All backend endpoints are prefixed with `/api`. Authenticated endpoints require `Authorization: Bearer <jwt_token>`.

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/customer/login` | Login customer with mobile & password | Public |
| POST | `/api/auth/customer/register` | Register new customer account | Public |
| POST | `/api/auth/admin/login` | Login admin user | Public |

---

## 2. Customer Management (`/api/admin/customers`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/customers` | List all customers (supports search & filter) | Admin |
| GET | `/api/admin/customers/{id}` | Get customer profile & subscription details | Admin |
| POST | `/api/admin/customers` | Create new customer | Admin |
| PUT | `/api/admin/customers/{id}` | Update customer profile | Admin |
| DELETE | `/api/admin/customers/{id}` | Soft/hard delete customer | Admin |

---

## 3. Subscriptions (`/api/admin/subscriptions`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/admin/subscriptions/assign` | Assign Plan 1 or Plan 2 to customer | Admin |

---

## 4. Meal Serving & Management (`/api/admin/meals`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/meals/today` | Fetch today's meal serving list for Lunch & Dinner | Admin |
| POST | `/api/admin/meals/serve` | Mark Lunch or Dinner as served | Admin |
| POST | `/api/admin/meals/correct` | Undo or correct meal serving status | Admin |

---

## 5. WhatsApp Gateway (`/api/admin/whatsapp`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/whatsapp/status` | Get gateway connection status & QR code PNG | Admin |
| POST | `/api/admin/whatsapp/reconnect` | Wipe session & force generate fresh QR Code | Admin |
| POST | `/api/admin/whatsapp/flush-queue` | Flush pending offline message queue | Admin |

---

## 6. Public Health (`/api/public`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/public/health` | Public uptime monitoring health endpoint | Public |
