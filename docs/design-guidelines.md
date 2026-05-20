# EV Car Rental — Design Guidelines

---

## 1. Brand Colors

### Core Tokens (`globals.css` `@theme`)

| Token | Hex | Use |
|-------|-----|-----|
| `ev-primary` | `#C8102E` | CTA buttons, active nav, links, focus rings, key metrics |
| `ev-primary-dark` | `#A00D23` | Button hover / pressed state only |
| `ev-primary-tint` | `#FEF0F2` | Active nav background, selected row highlight |
| `ev-black` | `#000000` | Nav background, headings h1–h3 |
| `ev-muted` | `#6B6B6B` | Labels, captions, secondary text |
| `ev-dark` | `#1D1D1D` | Ghost button hover background |
| `ev-surface` | `#FFFFFF` | Cards, sidebar, modals, inputs |
| `ev-bg` | `#F5F5F5` | Page background canvas |

### Color Rules

| Token | Never use for |
|-------|---------------|
| `ev-primary` | Large background fills |
| `ev-primary-tint` | Cards, page background |
| `ev-black` | Captions, muted text |
| `ev-muted` | Headings, CTAs |
| `ev-surface` | Page background |
| `ev-bg` | Cards, inputs |

---

## 2. Typography

### Fonts

```tsx
// app/layout.tsx
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai_Looped } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const ibmPlexSansThai = IBM_Plex_Sans_Thai_Looped({
  variable: '--font-thai',
  subsets: ['thai'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})
```

Apply the Thai font via `.font-thai` class or `[lang="th"]` selector.

### Type Scale

| Class | Size | Line Height | Weight | Use |
|-------|------|-------------|--------|-----|
| `text-display` | 30px | 1.15 | 600 | Page hero numbers |
| `text-heading-lg` | 24px | 1.25 | 500 | Page titles |
| `text-heading-md` | 18px | 1.35 | 500 | Section headings |
| `text-heading-sm` | 15px | 1.4 | 500 | Card headings |
| `text-body-lg` | 14px | 1.6 | 400 | Primary body text |
| `text-body-md` | 13px | 1.6 | 400 | Table rows, descriptions |
| `text-body-sm` | 12px | 1.55 | 400 | Secondary info |
| `text-label` | 11px | 1.4 | 500 | Column headers, tags |
| `text-caption` | 11px | 1.4 | 400 | Timestamps, footnotes |
| `text-stat` | 32px | 1 | 500 | Dashboard stat numbers |

---

## 3. Design Language

- **Layout:** Clean and minimal — generous white space, thin 1px borders (`border-gray-200`)
- **Shadows:** No heavy shadows. Use `shadow-sm` at most. No gradients.
- **Nav / sidebar background:** `ev-black` (`#000000`)
- **Content area background:** `ev-bg` (`#F5F5F5`)
- **Cards:** `ev-surface` (`#FFFFFF`), `rounded-xl`, `border border-gray-100`
- **Primary button:** `bg-ev-primary hover:bg-ev-primary-dark text-white`
- **Ghost button:** `border border-ev-black text-ev-black hover:bg-ev-dark hover:text-white`
- **Links / accent highlights:** `text-ev-primary` (`#C8102E`)
- **Destructive actions:** `#EF4444` (standard red — distinct from brand red)
- **Focus rings:** `outline-2 outline-ev-primary` (set globally via `*:focus-visible`)
- **Active nav item:** `bg-ev-primary-tint border-l-2 border-ev-primary text-ev-primary`
- **Inactive nav item:** `text-ev-muted hover:text-ev-black hover:bg-gray-100`
- **Status badges:** Pill style, color-coded (see table below)

---

## 4. Status Badge Color System

Badges are rendered by `components/StatusBadge.tsx` using inline styles. Use `statusClass()` from `lib/design-system.ts` for Tailwind class-based variants.

### Car Status

| Status | Background | Text |
|--------|------------|------|
| Available | `#DCFCE7` | `#166534` |
| Rented | `#DBEAFE` | `#1E40AF` |
| Maintenance | `#FEF9C3` | `#854D0E` |
| Sold | `#F3F4F6` | `#374151` |

### Contract Status

| Status | Background | Text |
|--------|------------|------|
| Pending | `#FEF3C7` | `#92400E` |
| Confirmed | `#DBEAFE` | `#1E40AF` |
| Active | `#DBEAFE` | `#1E40AF` |
| Expiring Soon | `#FEF9C3` | `#854D0E` |
| Expired | `#F3F4F6` | `#374151` |
| Terminated | `#FEE2E2` | `#991B1B` |

### KYC Status

| Status | Background | Text |
|--------|------------|------|
| Verified | `#DCFCE7` | `#166534` |
| Pending | `#FEF3C7` | `#92400E` |
| Rejected | `#FEE2E2` | `#991B1B` |

### Purchase Offer / Conversion Status

| Status | Background | Text |
|--------|------------|------|
| Eligible | `#DCFCE7` | `#166534` |
| Offer Sent | `#DBEAFE` | `#1E40AF` |
| Client Confirmed | `#FEF3C7` | `#92400E` |
| Admin Confirmed | `#FEF9C3` | `#854D0E` |
| Completed | `#F3F4F6` | `#374151` |

### Invoice & Payment

| Status | Background | Text |
|--------|------------|------|
| Draft | `#F3F4F6` | `#374151` |
| Sent | `#DBEAFE` | `#1E40AF` |
| Paid | `#DCFCE7` | `#166534` |
| Held | `#FEF3C7` | `#92400E` |
| Refunded | `#DCFCE7` | `#166534` |
| Forfeited | `#FEE2E2` | `#991B1B` |

---

## 5. Chart Colors

```ts
import { chartColors } from '@/lib/design-system'

chartColors.revenue  // '#C8102E' — revenue bars
chartColors.expense  // '#D1D5DB' — expense bars
chartColors.profit   // '#166534' — profit line
chartColors.neutral  // '#9CA3AF' — neutral / other
```

---

## 6. Shared Components

| # | Component | File | Description |
|---|-----------|------|-------------|
| 1 | `AppShell` | `components/AppShell.tsx` | Sidebar + topbar layout; Admin and Renter nav variants |
| 2 | `StatusBadge` | `components/StatusBadge.tsx` | Pill badge using the color system above |
| 3 | `DataTable` | `components/DataTable.tsx` | Sortable, filterable table with pagination |
| 4 | `StatCard` | `components/StatCard.tsx` | Metric card (label + number + optional trend arrow) |
| 5 | `BookingTimeline` | `components/BookingTimeline.tsx` | Approval step tracker |
| 6 | `PricingSummary` | `components/PricingSummary.tsx` | Line-item breakdown: base rate + deposit + VAT + total |
| 7 | `EVSpecCard` | `components/EVSpecCard.tsx` | Battery kWh, WLTP/NEDC range, connectors, charge speed |
| 8 | `Modal` | `components/Modal.tsx` | Generic modal with backdrop and close button |
| 9 | `ConfirmDialog` | `components/ConfirmDialog.tsx` | Destructive action confirmation modal |
| 10 | `FileUpload` | `components/FileUpload.tsx` | Drag-and-drop + click; supports PDF and images |
| 11 | `Toast` | `components/Toast.tsx` | Notification toasts: success / error / warning / info |

---

## 7. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) — Tailwind CSS v4 |
| Styling | Tailwind CSS v4 (`@theme` in `globals.css` — no `tailwind.config.js`) |
| Design tokens | `lib/design-system.ts` |
| Components | Custom — no UI library dependency |
| Charts | `recharts` |
| Icons | `lucide-react` |
| Language in UI | English primary, Thai secondary |

---

## 8. Formatting Conventions

- **Currency:** Thai Baht (฿), formatted with `toLocaleString('th-TH')`
- **Dates:** DD MMM YYYY (e.g. 15 May 2026); Thai month names as secondary
- **Roles (mock):** No authentication — simulate role switching via context toggle (Admin / Renter)

---

## 9. Realistic Placeholder Data

Do not use "Lorem ipsum" or generic test data. Use:

- **Companies:** Siam Motors Group, Bangkok Fleet Solutions, ThaiBev Logistics, PTT Mobility Co., Central Retail Transport
- **EV Models:** JAC N42EV, JAC N75EV, JAC T9 EV, JAC Sunray EV, JAC M3 EV
- **Locations:** Sukhumvit Service Center, Silom Office Hub, Ladkrabang Depot, Don Mueang Station, Rama 9 Headquarters
- **People:** Natthapong Charoenwong, Siriporn Wiriyakul, Thanakorn Pattanapong, Ananya Sukhonthamat
