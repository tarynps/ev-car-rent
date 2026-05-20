# EV Fleet — Renter Requirements v2

**Role:** Corporate Client (Logistics / Enterprise)
**Base path:** `/renter`
**Last updated:** 2026-05-20
**Status:** Implemented (Phase 2 complete)

---

## User Roles

| Role | Access Level |
|------|-------------|
| Renter Admin | Company account management, can create contract requests |
| Renter User | Can create contract requests only |

---

## Pages & Features

---

### 1. Dashboard — `/renter/dashboard`

**Fleet Summary (Overall)**
- Total vehicles currently rented under this company
- Vehicles by status: Active / Overdue / Maintenance
- Vehicles by car type: 6-wheel / 8-wheel / 10-wheel / Prime Mover / Pickup / Van
- Active contracts count
- Contracts expiring within 30 days — alert list

**Telematics Overview (Fleet-Wide)**
- Fleet live map: all rented vehicles plotted by GPS location in real time
- Fleet battery level summary: average SOC % across all active vehicles
- Vehicles currently charging vs. not charging
- Driver behavior summary (fleet aggregate):
  - Hard braking events today
  - Rapid acceleration events today
  - Speeding events today
  - Idle time today (hours)
- Alert count: vehicles with active warnings (low battery / geofence breach / speeding)

**Purchase Offer Alerts**
- Highlight vehicles whose contract has ended and a purchase offer has been sent by admin
- Per alert: vehicle photo, model, license plate, offer details, "View Offer" action button

> **Removed:** Recent booking activity widget
> **Removed:** Notifications panel — notifications moved to sidebar icon only (unread badge)
> **Removed:** Ownership progress section — moved to My Fleet contract detail

---

### 2. Vehicle Catalog — `/renter/vehicles`

*(Previously: Browse Vehicles)*

- Grid view of JAC EV commercial models available for rent
- Each card shows: model photo, model name, car type / wheel category, key specs (range, battery, motor power), price from ฿X/month
- Filter by: car type, model, range
- No brand filter — all vehicles are JAC Motors

**Top-right:** "Request a Quote / New Contract Request" button — navigates to contract request form

**Model detail — `/renter/vehicles/[modelId]`:**
- Full EV specs: battery capacity, WLTP range, NEDC range, supported connectors, max AC/DC charging speed, motor power
- Photo gallery
- Feature highlights
- Pricing table: monthly / quarterly / semi-annual / annual / rent-with-purchase-option rates
- Availability indicator
- **Top-right:** "Add to Request" button — adds this model to a new or existing draft contract request

---

### 3. Renter Request — `/renter/requests/new`

*(Previously: Create Rental Request — restructured)*

**Multi-step form with progress indicator:**

| Step | Action |
|------|--------|
| 1 | Add vehicle types and quantities — renter adds one or more rows: Car Type → Model → Quantity. Can add multiple rows (e.g. 6-wheel N42EV × 5, 10-wheel N75EV × 10) |
| 2 | Set contract duration: start date and end date |
| 3 | Select pick-up location and return location |
| 4 | Choose contract type: Rent-and-Return or Rent-with-Purchase-Option |
| 5 | Review pricing summary: base rate per model × quantity + deposit + VAT + total |
| 6 | Submit for approval |

> **Removed:** Daily / weekly duration options — commercial fleet uses monthly and above only
> **Removed:** Add-ons step (portable charger / child seat / extra insurance)

---

### 4. My Fleet — `/renter/fleet`

*(Previously: My Bookings)*

**List view — contract cards:**
- Each card displays: Contract ID, company name, list of vehicle types and quantities, contract status, start date, end date
- Status badge: Pending / Active / Expiring Soon / Expired / Terminated
- **Highlight:** Vehicles within an active contract that have ended rental period and are eligible for purchase — show a distinct "Purchase Offer Available" badge on the card
- Filter by: status, date range
- **Top-right:** "New Contract Request" button

**Contract detail — `/renter/fleet/[contractId]`:**
- Contract ID and created date
- Contract type: Rent-and-Return / Rent-with-Purchase-Option
- Vehicles in this contract grouped by type:
  - Car type label → assigned license plates → quantity
  - Example: 6-wheel truck (N42EV): [ABC-001, ABC-002, ABC-003] — 3 units
- Pick-up date, time, location
- Return date, time, location
- Rental duration and pricing tier applied
- Pricing breakdown: base rate per type × quantity + deposit + VAT + total
- Approval status tracker: Submitted → Manager Approved → Admin Approved → Active
- Download contract PDF
- Download invoice PDF
- Request extension: new return date input → submits for admin approval
- Terminate request (with reason input, subject to cancellation policy)
- Report damage / issue per vehicle: description + photo upload

**Purchase offer section (within contract detail):**
- Shown only when offer has been sent by admin
- Vehicles eligible for purchase listed with: model, license plate, buyout amount, offer expiry date
- Progress indicator: total rental paid vs. total buyout amount
- "Accept Offer" action → triggers admin confirmation flow
- Download sale agreement (available after conversion confirmed)

> **Removed:** Standalone Rent-to-Sell page — merged into contract detail above

---

### 5. Telematics — `/renter/telematics`

**Overview tab — Fleet-wide:**
- Live map: all active rented vehicles plotted by real-time GPS
- Vehicle list alongside map: license plate, model, car type, current speed, battery %, charging status
- Click any vehicle on map or list → opens vehicle telematics detail

**Fleet behavior summary:**
- Hard braking: total events today / this week / this month
- Rapid acceleration: total events today / this week / this month
- Speeding: total events today / this week / this month
- Idle time: total hours today / this week / this month
- Top 5 vehicles with most behavior events this month (ranked list)

**Vehicle telematics detail — `/renter/telematics/[vehicleId]`:**

*Location tab:*
- Real-time GPS position on map
- Trip history: list of trips with start/end location, distance, duration, date
- Route replay per trip

*Battery & Charging tab:*
- Current state of charge (SOC %)
- Battery level history chart (last 7 days)
- Charging sessions: date, location, duration, kWh charged, cost
- Estimated remaining range (km)
- Charging status: Charging / Not Charging / Full

*Driver Behavior tab:*
- Events log: timestamp, event type (hard brake / rapid accel / speeding / idle), location, severity
- Behavior score (if scoring model is implemented — optional)
- Charts: event count by type over time (daily / weekly / monthly)

*Vehicle Status tab:*
- Current speed
- Odometer / mileage (current reading)
- Ignition status: On / Off
- Door status: Open / Closed
- Last updated timestamp

---

### 6. Payment & Billing — `/renter/billing`

- Pay deposit and rental fees: choose payment method
- Payment methods: bank transfer / PromptPay / credit card
- Payment history: all transactions with date, contract ID, amount, type, status
- Deposit status per contract: Held / Refunded / Forfeited
- Download receipt per payment

---

### 7. Company Account — `/renter/account`

- Company profile: name, industry, address, tax ID — editable
- Manage team members: add / remove users, set role (Renter Admin / Renter User)
- KYC document upload:
  - Business registration certificate
  - ID verification
- Monthly billing summary for the whole company

---

### 8. Notifications — sidebar icon only (no dedicated page)

- Unread count badge on sidebar notification icon
- Dropdown panel on click: list of recent notifications with mark-as-read
- Notification types:
  - Contract request approved
  - Contract request rejected (with reason)
  - Return reminder (X days before contract end date)
  - Purchase offer received from admin
  - Invoice ready to download
  - Contract expiry alert
  - Telematics alert (low battery / speeding / geofence breach)

---

## Build Priority (Phase 2)

1. Shared components
2. Dashboard (fleet summary + telematics overview)
3. Vehicle catalog + model detail
4. Contract request (multi-step form)
5. My Fleet — contract list + contract detail (including purchase offer section)
6. Telematics — overview + vehicle detail
7. Payment & billing
8. Company account
9. Notifications (sidebar panel)

---

## Change Log (v1 → v2)

| Section | Change |
|---------|--------|
| Dashboard | Removed recent bookings, notification panel, ownership progress; added fleet-wide telematics overview and live map; added purchase offer alerts |
| Browse Vehicles | Renamed to Vehicle Catalog; updated to JAC commercial lineup only; removed brand filter; added "Add to Request" and "New Contract Request" buttons |
| Create Rental Request | Restructured to support multiple car types + quantities per submission; removed daily/weekly options; removed add-ons step |
| My Bookings | Renamed to My Fleet; changed to contract card layout; added "Purchase Offer Available" highlight badge; merged rent-to-sell view into contract detail |
| Rent-to-Sell page | Removed as standalone page; merged into My Fleet contract detail as a conditional section |
| Telematics | New section — fleet-wide live map + behavior summary + per-vehicle detail (location, battery, driver behavior, vehicle status) |
| Notifications | Removed as standalone page; moved to sidebar dropdown panel only |

---

## As-Built Notes (2026-05-20)

### What was implemented in this session

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Dashboard | `/renter/dashboard` | Carried over from v1 | Hero rental cards, ownership progress retained; telematics overview widget deferred |
| Vehicle Catalog | `/renter/vehicles` | ✅ Implemented | Renamed nav from "Browse Vehicles"; grid/list toggle, filters |
| Vehicle Detail | `/renter/vehicles/[modelId]` | ✅ Implemented | Fixed Next.js 15+ async params bug |
| Contract Request | `/renter/bookings/new` | Carried over from v1 | Path unchanged; multi-vehicle form restructure deferred |
| My Fleet | `/renter/fleet` | ✅ New | Contract card list with status tabs, alert banners, Purchase Offer Available badge |
| Contract Detail | `/renter/fleet/[contractId]` | ✅ New | Vehicle list, pricing, approval tracker, purchase offer section, request extension/terminate/damage actions |
| Telematics Overview | `/renter/telematics` | ✅ New | Live map (Bangkok coordinate-based), fleet vehicle list, SOC bars, behavior summary, events log |
| Telematics Vehicle Detail | `/renter/telematics/[vehicleId]` | ✅ New | 4 tabs: Location & Trips, Battery & Charging (SOC chart + sessions), Driver Behavior (events + chart), Vehicle Status |
| Billing | `/renter/billing` | Carried over from v1 | — |
| Company Account | `/renter/account` | Carried over from v1 | — |
| Notifications | Sidebar bell icon | Carried over from v1 | Standalone page still exists at `/renter/notifications`; sidebar nav entry removed per v2 |

### Sidebar nav (v2)
Dashboard · Vehicle Catalog · My Fleet · Telematics · Billing · Account

### Map implementation note
Live map uses a coordinate-projection placeholder (Bangkok bounding box, CSS-positioned vehicle pins) since no mapping library (Leaflet, Google Maps) is installed. Replace with a proper map tile library for production.

### Data model note
`FleetContract` type added to support multi-vehicle contracts. Existing `Booking` records are preserved alongside the new `fleetContracts` mock array. In production, migrate all bookings to the FleetContract model.
