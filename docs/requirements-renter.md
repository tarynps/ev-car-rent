# EV Car Rental — Renter Requirements

**Role:** Corporate Client  
**Base path:** `/renter`

---

## User Roles

| Role | Access Level |
|------|-------------|
| Renter Admin | Company account management, can create bookings |
| Renter User | Can create booking requests only |

---

## Pages & Features

### 1. Dashboard — `/renter/dashboard`

- Active rentals: currently rented cars with return due dates
- Upcoming returns — due date countdown per car
- Recent booking activity — last 5 bookings with status
- Notifications / alerts panel (unread count)
- Ownership Progress section — rent-to-sell progress bar per active contract:
  - Amount paid vs. total buyout amount
  - Estimated ownership date

---

### 2. Browse Vehicles — `/renter/vehicles`

- Grid / list toggle view of available EV models
- Each card shows: car photo, model name, key specs, price from ฿X/day
- Filter by: brand, model, range, connector type

**Model detail — `/renter/vehicles/[modelId]`:**
- Full EV specs (battery, range, connectors, charge speed)
- Photo gallery
- Pricing table: all rate tiers (daily / weekly / monthly / yearly / rent-to-sell)
- Feature highlights
- Availability indicator
- "Request Rental" call-to-action button

---

### 3. Create Rental Request — `/renter/bookings/new`

8-step wizard with progress indicator:

| Step | Action |
|------|--------|
| 1 | Select car model |
| 2 | Choose duration type: daily / weekly / monthly / yearly / rent-to-sell |
| 3 | Set start date and end date |
| 4 | Select pick-up location and return location |
| 5 | Choose contract type: Rent-and-Return or Rent-to-Sell |
| 6 | Select add-ons: portable charger / child seat / extra insurance |
| 7 | Review pricing summary: base + add-ons + deposit + VAT + total |
| 8 | Submit for approval |

---

### 4. My Bookings — `/renter/bookings`

- Booking list filterable by status (All / Pending / Confirmed / Active / Completed / Cancelled)

**Booking detail — `/renter/bookings/[id]`:**
- Full booking information (car, dates, locations, pricing)
- Approval status tracker: Submitted → Manager Approved → Admin Approved → Confirmed
- Allocated car: license plate
- Pricing breakdown
- Download contract (PDF)
- Download invoice (PDF)
- Request extension: new return date input, submits for admin approval
- Cancel booking (cancellation policy shown before confirming)
- Report damage/issue: description text + photo upload

---

### 5. Rent-to-Sell — Renter View — `/renter/bookings/[id]/rent-to-sell`

- View rent-to-sell terms for this booking
- Remaining buyout calculation: amount paid vs. total required to own the car
- Progress bar showing ownership progress
- Confirm intent to purchase → triggers admin review
- Download sale agreement (available after conversion is confirmed)

---

### 6. Payment & Billing — `/renter/billing`

- Pay deposit and rental fees: choose payment method
- Payment methods: credit card / bank transfer / PromptPay
- Payment history: all transactions with date, amount, status
- Deposit refund status per booking: Held / Refunded / Forfeited
- Download receipt per payment

---

### 7. Company Account — `/renter/account`

- Company profile: name, address, tax ID — editable
- Manage team members: add users, set booking permissions (Renter Admin / Renter User)
- KYC document upload:
  - Business registration certificate
  - ID verification
- Monthly billing summary for the whole company

---

### 8. Notifications — `/renter/notifications`

Notification types:
- Booking approved (with confirmation details)
- Booking rejected (with reason from admin)
- Return reminder (configurable days before due date)
- Rent-to-sell conversion status update
- Invoice ready to download
- Contract expiry alert

Features:
- Mark individual notification as read
- Mark all as read
- Unread count badge in sidebar

---

## Build Priority (Phase 2)

1. Renter dashboard
2. Browse vehicles + model detail
3. Create rental request (multi-step form)
4. My bookings + booking detail
5. Rent-to-sell renter view
6. Payment & billing
7. Company account
8. Notifications
