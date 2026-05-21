# EV Car Rental Platform — Project Index

B2B commercial fleet rental platform for JAC Motors. Admin portal for fleet operators, Renter portal for corporate clients.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript |
| Styling | Tailwind v4 — tokens in `app/globals.css` `@theme`, no `tailwind.config.ts` |
| Charts | Recharts |
| Icons | Lucide React |
| Images | `next/image` with `unoptimized` (JAC photos are HTTP) |
| Data | Mock only — `lib/mock-data.ts` |

---

## Design System

**Colors** (`app/globals.css`):
- `tertiary` #C8102E — JAC red, primary brand action
- `tertiary-dark` #A00D23 — hover state
- `tertiary-tint` #FEF0F2 — active/selected background
- `primary` #000000, `secondary` #6B6B6B, `neutral` #F5F5F5

**Card pattern:** `bg-white rounded-xl border border-gray-100 shadow-sm p-5`

**Docs:** `docs/design-guidelines.md`, `docs/requirements-admin-v2.md`, `docs/requirements-renter.md`

---

## Source Structure

```
app/
├── globals.css          Design tokens (Tailwind v4 @theme)
├── layout.tsx           Root HTML + font loading
├── page.tsx             Entry redirect → admin or renter
│
├── admin/               Admin Portal
│   ├── layout.tsx
│   ├── dashboard/       KPIs, Income vs Expense chart, activity feed
│   ├── fleet/           Inventory Management (vehicle list + detail)
│   ├── models/          JAC model catalog
│   ├── contracts/       Contract list + detail
│   ├── requests/        Pre-contract rent requests (list + detail with editable pricing)
│   ├── pricing/         Pricing tiers per model
│   ├── finance/         Finance overview
│   ├── rent-to-sell/    Purchase offer management
│   ├── companies/       Client company list + detail (team, KYC, contracts, requests)
│   └── settings/        Settings
│
└── renter/              Renter Portal
    ├── layout.tsx
    ├── dashboard/        KPIs, active fleet summary, telematics list
    ├── vehicles/         Vehicle Catalog (list + model detail)
    ├── fleet/            My Fleet (by contract / by car toggle)
    │   └── [contractId]/ Contract detail + vehicle rows → telematics
    ├── requests/
    │   └── new/          New Contract Request (6-step wizard)
    ├── telematics/       Fleet GPS map + behavior summary
    │   └── [vehicleId]/  4-tab detail: Location, Battery, Behavior, Status
    ├── billing/          Invoices and payment history
    ├── account/          Company profile and user settings
    └── notifications/    Notification inbox

components/
├── AppShell.tsx          Sidebar + topbar layout (admin: white, renter: slate-900)
├── StatusBadge.tsx       Colored status chip
├── Modal.tsx             Overlay dialog
├── Toast.tsx             Notification toasts
├── ConfirmDialog.tsx     Destructive action confirm
├── DataTable.tsx         Reusable sortable table
├── FileUpload.tsx        File input widget
├── BookingTimeline.tsx   Approval step dot tracker
├── PricingSummary.tsx    Pricing footer card
├── EVSpecCard.tsx        EV specification display
└── StatCard.tsx          KPI stat box

lib/
├── types.ts              All TypeScript interfaces and unions
├── mock-data.ts          All mock data (contracts, companies, cars, telematics, pricing)
├── utils.ts              formatDate, formatBaht helpers
└── role-context.tsx      Admin/Renter role switcher (preview toggle)

docs/
├── index.md              ← this file
├── design-guidelines.md  UI/UX design rules
├── requirements-admin-v2.md  Admin feature requirements (v2)
└── requirements-renter.md    Renter feature requirements
```

---

## Admin Routes

| URL | Purpose |
|---|---|
| `/admin/dashboard` | Overview KPIs, charts, activity |
| `/admin/fleet` | Inventory Management — vehicle list |
| `/admin/fleet/[id]` | Vehicle detail |
| `/admin/models` | JAC model catalog |
| `/admin/contracts` | All contracts with status filter |
| `/admin/contracts/[id]` | Contract detail |
| `/admin/requests` | Pre-contract rent requests list |
| `/admin/requests/[id]` | Request detail — edit pricing, approve/reject |
| `/admin/pricing` | Pricing tiers per model per duration |
| `/admin/finance` | Finance and billing overview |
| `/admin/rent-to-sell` | Purchase offer pipeline |
| `/admin/companies` | Client company list |
| `/admin/companies/[id]` | Company detail — profile, KYC, team, contracts, requests |
| `/admin/settings` | Platform settings |

## Renter Routes

| URL | Purpose |
|---|---|
| `/renter/dashboard` | Welcome, KPIs, fleet summary, telematics list |
| `/renter/vehicles` | Browse all JAC models |
| `/renter/vehicles/[modelId]` | Model detail — specs, photos, pricing |
| `/renter/fleet` | My Fleet — By Contract or By Car view |
| `/renter/fleet/[contractId]` | Contract detail — vehicles with telematics links, pricing, approvals |
| `/renter/requests/new` | New Contract Request — 6-step wizard |
| `/renter/telematics` | Fleet map, behavior events, top-5 vehicles |
| `/renter/telematics/[vehicleId]` | Vehicle detail — Location, Battery, Behavior, Status tabs |
| `/renter/billing` | Invoices and payment history |
| `/renter/account` | Account and team settings |
| `/renter/notifications` | Notification inbox |

---

## Mock Data Keys

| Export | Description |
|---|---|
| `contracts` | All rental contracts (ct1–ct8); c1 has ct1, ct7, ct8 |
| `rentRequests` | Pre-contract requests (req-001, req-002) |
| `companies` | Client companies (c1 = Siam Motors Group) |
| `carModels` | JAC model catalog with photos and specs |
| `cars` | Individual vehicle instances with carId, licensePlate |
| `telematicsVehicles` | Live vehicle data (car1, car5, car11 for c1) |
| `tripRecords` | Historical trip log per vehicle |
| `behaviorEvents` | Driver behavior events (hard brake, speeding, etc.) |
| `purchaseOffers` | Rent-to-sell offers linked to contracts |
| `pricingTiers` | Rate per model per duration (daily/weekly/monthly/yearly) |
| `locations` | Pickup/return depot locations |
| `notifications` | User notification inbox |
