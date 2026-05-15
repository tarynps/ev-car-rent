# EV Car Rental — Admin Requirements

**Role:** Fleet Operator  
**Base path:** `/admin`

---

## User Roles

| Role | Access Level |
|------|-------------|
| Super Admin | Full system access |
| Manager | Booking approval, fleet view, reports |

---

## Pages & Features

### 1. Dashboard — `/admin/dashboard`

- Fleet overview stats: Total cars / Available / Rented / Maintenance / Sold
- Rent-to-sell conversions this month
- Fleet % breakdown by brand/model — donut chart
- Top-picked models — ranked list with % share
- Overdue returns — alert list
- Revenue: monthly income card, yearly income card
- Income vs expense — monthly bar chart comparison
- This month: pick-ups count, returns count, conversions count
- Pending approvals — list with quick-approve action

---

### 2. Fleet Management — `/admin/fleet`

**List view:**
- Table columns: License Plate / Brand / Model / Year / Status / Current Renter / Actions
- Filter by: status, brand, model
- Add new car: license plate, brand/model assignment, status, RFID card number, notes, photo upload

**Car detail — `/admin/fleet/[id]`:**
- Car info: license plate, brand, model, year, color, photo
- Current status + status history log
- Assigned RFID charging card number
- Mileage / odometer log (updated per return)
- Maintenance log: date, type, cost, service provider, notes
- Insurance record: policy number, provider, expiry date, annual premium
- Full rental history: all past bookings for this car
- Rent-to-sell flag toggle
- Swap vehicle action (only when car has an active booking)

---

### 3. Brand & Model Master Data — `/admin/models`

- Brand list: add / edit / delete brands
- Model list under each brand: add / edit / delete models
- Model spec fields:
  - Brand name
  - Model name
  - Year
  - Battery capacity (kWh)
  - Max range — WLTP (km) and NEDC (km)
  - Supported connectors: multi-select (CCS2, Type 2, CHAdeMO, GB/T)
  - Max AC charging speed (kW)
  - Max DC charging speed (kW)
  - Model photos (gallery, multiple upload)
  - Feature highlights (text list)

---

### 4. Booking Management — `/admin/bookings`

**List view:**
- Table columns: Booking ID / Renter Company / Renter Name / Car / Status / Pick-up Date / Return Date / Contract Type / Actions
- Filter by: status, date range, contract type, company

**Booking detail — `/admin/bookings/[id]`:**
- Booking ID and created date
- Renter: company name, contact person, phone, email
- Contract type: Rent-and-Return / Rent-to-Sell
- Allocated car: license plate (links to fleet detail)
- Pick-up: date, time, location
- Return: date, time, location
- Rental duration + pricing tier applied
- Add-ons: portable charger / child seat / extra insurance
- Pricing summary: base rate + add-ons + deposit + VAT + total
- Approval status + audit trail (who approved, timestamp)
- Swap vehicle (re-assign car without cancelling booking)
- Cancel booking (requires reason input)
- Handle extension request: approve or reject

---

### 5. Approval Workflow — `/admin/approvals`

- Queue list: pending requests sorted by submission date
- Each item shows: Booking ID / Company / Model Requested / Duration / Contract Type / Submitted By / Submitted At
- Approval steps: Manager Approve → Admin Approve → Confirmed
- Reject: requires reason input; renter is notified automatically
- Audit trail per request: full history with timestamps and actor names

---

### 6. Pricing Management — `/admin/pricing`

Pricing table per model:
- Daily: 1-day rate, 3-day rate, 5-day rate
- Weekly rate
- Monthly rate
- Yearly rate
- Rent-to-sell rate (loan/contract-based, configurable)

Add-on pricing:
- Portable charger / child seat / extra insurance (per day or flat fee)

Deposit:
- Deposit amount per model

Settings:
- VAT-inclusive / VAT-exclusive toggle

---

### 7. Financial Management — `/admin/finance`

**Revenue tab:**
- Transaction list: Booking ID / Company / Amount / Type / Payment Method / Status / Date
- Payment types: deposit, rental fee, late fee, forfeited deposit
- Payment methods: credit card / bank transfer / PromptPay
- Deposit status per booking: Held / Refunded / Forfeited

**Expense tab:**
- EV charging costs: linked to RFID card per car — date, kWh, cost
- Maintenance costs: linked to car — date, type, amount
- Insurance costs: linked to car — annual premium, renewal date

**Reports tab:**
- P&L per vehicle: total revenue − total costs = net profit
- P&L fleet-wide: aggregated summary
- Date range filter
- Export: CSV and PDF
- VAT breakdown for B2B invoicing

**Invoices tab:**
- Invoice list: Invoice Number / Company / Booking ID / Amount / VAT / Total / Status / Date
- Generate invoice per booking
- Download PDF invoice

---

### 8. Rent-to-Sell Management — `/admin/rent-to-sell`

- List of all cars flagged as rent-to-sell eligible
- Per car: contract start date, total amount accumulated, buyout amount remaining, conversion status
- Admin actions:
  - Set conversion trigger: time-based (e.g. after 12 months) or amount-based (e.g. after ฿XXX paid)
  - Generate sale contract (PDF)
  - Confirm conversion → marks car as Sold, removes from rental inventory
- Conversion status flow: Eligible → Renter Confirmed → Admin Confirmed → Completed

---

### 9. Company / Renter Account Management — `/admin/companies`

**List view:**
- Table columns: Company Name / Contact / Active Rentals / Status / KYC Status

**Company detail — `/admin/companies/[id]`:**
- Company profile: name, address, tax ID, billing info
- KYC status: Pending / Verified / Rejected + list of uploaded documents
- Users under this company: name, role, email, last active
- Add / remove users
- Credit limit and max active rentals quota
- Full rental history for this company
- Monthly billing summary

---

### 10. System Settings — `/admin/settings`

- **Users tab:** Admin and manager accounts — create, edit, set permission level
- **Notifications tab:** Email / SMS trigger settings and timing
- **Locations tab:** Manage pick-up / drop-off locations (name, address)
- **Contract Templates tab:** Upload or edit rental template and rent-to-sell template (PDF or text)

---

## Build Priority (Phase 1)

1. Shared components
2. Dashboard
3. Fleet management + car detail
4. Brand & model master data
5. Booking management + booking detail
6. Approval workflow
7. Pricing management
8. Financial management
9. Rent-to-sell management
10. Company account management
11. System settings
