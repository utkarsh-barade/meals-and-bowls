# Design Guidelines

# 🍽️ Meals & Bowls - UI Design System

Version: 1.0

---

# 1. Design Philosophy

The application should feel:

- Simple
- Clean
- Modern
- Fast
- Professional
- Easy for non-technical staff

The interface should minimize clicks and keep the most-used actions visible.

---

# 2. Theme

## Primary Theme

Modern Light Theme

- Clean white background
- Soft neutral surfaces
- High contrast text
- Minimal visual clutter

Dark mode can be added in a future release.

---

# 3. Color Palette

## Primary

- Primary: Emerald Green (#16A34A)
- Primary Hover: #15803D

Used for:
- Primary buttons
- Active navigation
- Success states

---

## Secondary

- Amber (#F59E0B)

Used for:
- Warnings
- Low meal balance
- Expiring plans

---

## Success

- Green (#22C55E)

Used for:
- Meal served
- Payment completed
- Active plans

---

## Danger

- Red (#DC2626)

Used for:
- Errors
- Expired plans
- Failed actions

---

## Info

- Blue (#2563EB)

Used for:
- Information
- Links
- Reports

---

## Neutral

Background: #F8FAFC

Card: #FFFFFF

Border: #E2E8F0

Muted Background: #F1F5F9

Primary Text: #0F172A

Secondary Text: #475569

Placeholder Text: #94A3B8

---

# 4. Typography

## Font Family

Primary:
- Inter

Fallback:
- System UI
- Arial
- sans-serif

---

## Font Weights

- Regular (400)
- Medium (500)
- Semibold (600)
- Bold (700)

---

# 5. Type Scale

## Page Title

- 32px
- Bold

## Section Title

- 24px
- Semibold

## Card Title

- 20px
- Semibold

## Body Text

- 16px
- Regular

## Small Text

- 14px
- Regular

## Caption

- 12px
- Regular

---

# 6. Buttons

Primary
- Filled
- Emerald background
- White text

Secondary
- White background
- Emerald border

Danger
- Red background
- White text

Disabled
- Light gray background
- Gray text

Buttons should have:
- Rounded corners (10px)
- Minimum height: 44px

---

# 7. Cards

Use cards for:

- Dashboard metrics
- Customer details
- Plan information
- Reports

Card Style

- White background
- Soft shadow
- 12px radius
- 24px padding

---

# 8. Forms

Input Fields

- Height: 44px
- Rounded corners
- Clear labels
- Visible validation messages

Keep forms short and simple.

---

# 9. Icons

Use a single icon library consistently.

Suggested icons:

- Dashboard
- Customer
- Meal
- Payment
- Report
- Notification
- Settings

Icons should support the UI, not replace text labels.

---

# 10. Tables

Tables should include:

- Search
- Pagination
- Sorting (where useful)
- Status badges
- Action buttons

Columns should remain uncluttered.

---

# 11. Status Colors

Green
- Active
- Paid
- Meal Served

Yellow
- Expiring Soon
- Low Meal Balance

Red
- Expired
- Pending Payment
- Error

Blue
- Information

---

# 12. Layout

Desktop First

Structure

Header

↓

Sidebar

↓

Content Area

↓

Footer (optional)

Sidebar should remain fixed.

---

# 13. Spacing

Use an 8-point spacing system.

Common spacing:

- 8px
- 16px
- 24px
- 32px
- 48px

Maintain consistent spacing throughout.

---

# 14. Responsive Design

Support:

- Desktop
- Laptop
- Tablet

Mobile responsiveness is recommended but not required for the admin panel MVP.

---

# 15. User Experience Guidelines

- Minimize clicks.
- Keep primary actions visible.
- Use clear labels instead of technical terms.
- Confirm destructive actions.
- Show loading indicators during requests.
- Display success and error messages clearly.
- Keep navigation consistent across all screens.

---

# 16. Accessibility

- Sufficient color contrast.
- Keyboard-friendly navigation.
- Clear focus states.
- Readable font sizes.
- Avoid using color alone to convey meaning.

---

# 17. Visual Consistency

Maintain consistency for:

- Colors
- Typography
- Buttons
- Cards
- Icons
- Tables
- Form controls
- Spacing

Every screen should follow the same design language.
