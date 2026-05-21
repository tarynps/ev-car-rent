# EV Car Rental — Admin Requirements v2

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

**Date & Filter**
- Default range: full history (earliest record) → today
- Filter controls: date range picker (start / end), with "All Time" as the default preset
- All sections below respect the selected date range

---

#### Section 1 — Fleet Status

Summary cards:

| Card | Value |
|------|-------|
| Total Vehicles | Count of all vehicles in the system |
| Available | Vehicles with status = Available |
| Rented | Vehicles with status = Rented |
| Maintenance | Vehicles with status = Maintenance |
| Sold | Vehicles converted / sold |

---

#### Section 2 — Contracts

| Metric | Description |
|--------|-------------|
| Active Contracts | Count of currently running contracts |
| Expiring This Month | Contracts with return date within this calendar month |
| New Contracts This Month | Contracts created within the selected period |
| Average Contract Duration | Mean duration (days) across all contracts in selected period |

---

#### Section 3 — Purchase Offer Opportunities

Expanded card showing the full rent-to-sell conversion pipeline:

| Metric | Description |
|--------|-------------|
| Eligible Vehicles | Total vehicles flagged as rent-to-sell eligible |
| Pending Renter Confirmations | Vehicles in "Eligible" status awaiting renter acceptance |
| Pending Admin Approvals | Vehicles in "Renter Confirmed" status awaiting admin sign-off |
| Near Conversion Threshold | Vehicles within 30 days or 90% of target buyout amount |
| Total Potential Conversion Value | ฿ sum of remaining buyout amounts across all eligible vehicles |
| Completed Conversions This Month | Conversions that reached "Completed" status in the selected period |

---

#### Section 4 — Top Clients

Table of top 10 clients ranked by total vehicles rented. Columns:

| Column | Description |
|--------|-------------|
| Client / Company | Company name with link to company detail |
| No. of Vehicles Rented | Total count (active + historical) in selected period |
| Accepted Rent-to-Sell | Count of rent-to-sell conversions accepted by this client |
| Total Amount Paid (฿) | Sum of all payments received from this client |
| Most-Picked Model | The car model this client has rented most frequently |

---

#### Additional Dashboard Widgets

- Fleet by Model — donut chart showing vehicle count per JAC model/body type
- Top-picked models — ranked list with % share
- Overdue returns — alert list
- Revenue: monthly income card, yearly income card
- Income vs expense — monthly bar chart comparison
- This month: pick-ups count, returns count, conversions count

**Car images & naming:** Use JAC model names and image URLs as defined in the Inventory section below.

---

### 2. Fleet Management (Inventory) — `/admin/fleet`

**Mock data — JAC Commercial EV Trucks**

All vehicles are under brand **JAC**. Image URLs reference the JAC official website.

| # | Model Name | Body Type | Image URL |
|---|-----------|-----------|-----------|
| 1 | N55 EV | — | `http://jacen.jac.com.cn/_nuxt/img/n55ev.5eb6f0b.png` |
| 2 | T9 EV | — | `http://jacen.jac.com.cn/_nuxt/img/t9ev.d5fb6be.png` |
| 3 | Sunray EV | — | `http://jacen.jac.com.cn/_nuxt/img/sunrayEv.d4abd52.png` |
| 4 | M3 EV | — | `http://jacen.jac.com.cn/_nuxt/img/m3ev.8830ba3.png` |
| 5 | N-Series | Cargo | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 6 | N-Series | Dump Truck | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 7 | N-Series | Sweeper | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 8 | N-Series | Wrecker | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 9 | N-Series | Fridge | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 10 | N-Series | Sewage | `http://jacen.jac.com.cn/_nuxt/img/n-series.442957a.png` |
| 11 | K7 | — | `http://jacen.jac.com.cn/_nuxt/img/k7.f1cc20e.png` |
| 12 | K3 | — | `http://jacen.jac.com.cn/_nuxt/img/K3.fb32588.png` |
| 13 | Q7 | — | `http://jacen.jac.com.cn/_nuxt/img/Q7.c13fa4b.png` |
| 14 | X-Series | — | `http://jacen.jac.com.cn/_nuxt/img/x-series.f7735ae.png` |
| 15 | SPV | — | `http://jacen.jac.com.cn/_nuxt/img/specialPurpose Truck.3820d53.png` |

> N-Series variants share the same listing image. The "Body Type" column is displayed as a tag in the inventory table to differentiate each variant.

**List view:**
- Table columns: License Plate / Brand / Model / Body Type / Year / Status / Current Renter / Actions
- Filter by: status, brand, model, body type
- Add new car: license plate, brand/model assignment, body type (for N-Series), status, RFID card number, notes, photo upload

**Car detail — `/admin/fleet/[id]`:**
- Car info: license plate, brand, model, body type, year, color, photo
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

All models under brand **JAC**. Model list matches the 15 entries in the Inventory section above.

- Brand list: add / edit / delete brands
- Model list under each brand: add / edit / delete models
- Model spec fields:
  - Brand name
  - Model name
  - Body Type (applicable to N-Series variants)
  - Year
  - Battery capacity (kWh)
  - Max range — WLTP (km) and NEDC (km)
  - Supported connectors: multi-select (CCS2, Type 2, CHAdeMO, GB/T)
  - Max AC charging speed (kW)
  - Max DC charging speed (kW)
  - Model photos — use image URLs from the inventory table above; support additional upload
  - **Card display:** `photos[0]` rendered as a full-width thumbnail (h-32, object-contain, bg-gray-50) at the top of each model card, above all spec fields
  - Feature highlights (text list)

---

### 4. Contracts — `/admin/contracts`

**Data model:** 1 contract = 1 company + multiple ContractLine entries. Each line represents one model with one or more assigned vehicles (license plates).

```
Contract
  ├─ company, contact, dates, locations, add-ons, deposit, VAT, total, status
  └─ lines[]
       ├─ modelId, modelName, bodyType, brandName
       ├─ assignedCars[]: { carId, licensePlate }
       └─ baseRate
```

**List view — `/admin/contracts`:**
- Table columns: Contract ID / Company / Models (count) / Vehicles (count) / Start / End / Type / Total / Status / Actions
- Filter by: status, contract type, company, date range

**Contract detail — `/admin/contracts/[id]`:**
- Header: company name, status badge, contract type, duration type, start → end dates, total + VAT
- Contact info: name, phone, email
- Locations: pickup / return
- Add-ons: portable charger / child seat / extra insurance
- Deposit amount
- **Contract Lines table:** Model | Body Type | Assigned Vehicles | Base Rate/mo
  - Each license plate is a **required clickable link** → navigates to `/admin/fleet/[carId]`
- Approval Audit Trail: step-by-step with actor name and timestamp
- Actions: cancel contract (requires reason), handle extension request (approve / reject)

---

### 5. Requests — `/admin/requests`

- Queue list: pending contract requests sorted by submission date
- Each item shows: Contract ID / Company / Models count / Vehicles count / Duration / Contract Type / Submitted By / Submitted At
- Approval steps: Manager Approve → Admin Approve → Confirmed
- Reject: requires reason input; company is notified automatically
- Expand row to see full Approval Audit Trail with timestamps and actor names

---

### 6. Pricing Management — `/admin/pricing`

Pricing table per model — rows correspond to the 15 JAC models in the Inventory section:

| Model | Body Type | Daily (1-day) | Daily (3-day) | Daily (5-day) | Weekly | Monthly | Yearly | Rent-to-Sell |
|-------|-----------|--------------|--------------|--------------|--------|---------|--------|--------------|
| N55 EV | — | | | | | | | |
| T9 EV | — | | | | | | | |
| Sunray EV | — | | | | | | | |
| M3 EV | — | | | | | | | |
| N-Series | Cargo | | | | | | | |
| N-Series | Dump Truck | | | | | | | |
| N-Series | Sweeper | | | | | | | |
| N-Series | Wrecker | | | | | | | |
| N-Series | Fridge | | | | | | | |
| N-Series | Sewage | | | | | | | |
| K7 | — | | | | | | | |
| K3 | — | | | | | | | |
| Q7 | — | | | | | | | |
| X-Series | — | | | | | | | |
| SPV | — | | | | | | | |

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
5. Contracts + contract detail
6. Requests (approval workflow)
7. Pricing management
8. Financial management
9. Rent-to-sell management
10. Company account management
11. System settings
