# EV Car Rental — Design Guidelines

---

## 1. Brand Colors

```js
colors: {
  primary:    "#000000",
  secondary:  "#5F5F5F",
  tertiary:   "#0064FF",
  neutral:    "#F2EFE8",
  surface:    "#FFFFFF",
  on-primary: "#FFFFFF",
}
```

---

## 2. Typography

```css
/* English */
font-family: 'IBM Plex Sans', sans-serif;

/* Thai */
font-family: 'IBM Plex Sans Thai Looped', sans-serif;
```

Load both from Google Fonts. Apply the Thai font selectively using a `.font-thai` utility class or `lang="th"` attribute on elements containing Thai text.

---

## 3. Design Language

- **Layout:** Clean and minimal — generous white space, thin 1px borders (`border-gray-200`)
- **Shadows:** No heavy shadows. Use `shadow-sm` at most. No gradients.
- **Sidebar:** White background, thin right border
- **Content area:** Neutral background (`#F2EFE8`)
- **Cards:** White surface (`#FFFFFF`), `rounded-xl`, `border border-gray-100`
- **Primary actions:** Black button (`bg-black text-white`)
- **Accent / links / highlights:** `#0064FF`
- **Destructive actions:** Standard red (`#EF4444`)
- **Status badges:** Pill style, color-coded (see table below)

---

## 4. Status Badge Color System

| Status      | Background | Text      |
|-------------|------------|-----------|
| Available   | `#DCFCE7`  | `#166534` |
| Rented      | `#DBEAFE`  | `#1E40AF` |
| Maintenance | `#FEF9C3`  | `#854D0E` |
| Pending     | `#FEF3C7`  | `#92400E` |
| Confirmed   | `#DBEAFE`  | `#1E40AF` |
| Completed   | `#F3F4F6`  | `#374151` |
| Cancelled   | `#FEE2E2`  | `#991B1B` |
| Sold        | `#F3F4F6`  | `#374151` |

---

## 5. Shared Components

Build these before any pages — they are used across both Admin and Renter:

| # | Component | Description |
|---|-----------|-------------|
| 1 | `AppShell` | Sidebar + topbar layout wrapper; supports Admin and Renter nav variants |
| 2 | `StatusBadge` | Pill badge using the color system above |
| 3 | `DataTable` | Sortable, filterable table with pagination |
| 4 | `StatCard` | Metric card (label + number + optional trend arrow) |
| 5 | `BookingTimeline` | Approval step tracker: Submitted → Manager → Admin → Confirmed |
| 6 | `PricingSummary` | Line-item breakdown: base rate + add-ons + deposit + VAT + total |
| 7 | `EVSpecCard` | Displays battery kWh, WLTP/NEDC range, connectors, charge speed |
| 8 | `Modal` | Generic modal wrapper with backdrop and close button |
| 9 | `ConfirmDialog` | Destructive action confirmation modal |
| 10 | `FileUpload` | Drag-and-drop + click; supports PDF and images |
| 11 | `Toast` | Notification toasts: success / error / warning / info |

---

## 6. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Components | Custom — no UI library dependency |
| Charts | `recharts` |
| Icons | `lucide-react` |
| Language in UI | English primary, Thai secondary |

---

## 7. Formatting Conventions

- **Currency:** Thai Baht (฿), formatted with `toLocaleString('th-TH')`
- **Dates:** DD MMM YYYY (e.g. 15 May 2026); Thai month names as secondary
- **Roles (mock):** No authentication — simulate role switching via a context toggle (Admin / Renter)

---

## 8. Realistic Placeholder Data

Do not use "Lorem ipsum" or generic test data. Use:

- **Companies:** Siam Motors Group, Bangkok Fleet Solutions, ThaiBev Logistics, PTT Mobility Co., Central Retail Transport
- **EV Models:** Tesla Model 3 Long Range, BYD Atto 3, MG EP, Neta V Pro, Ora Good Cat
- **Locations:** Sukhumvit Service Center, Silom Office Hub, Ladkrabang Depot, Don Mueang Station, Rama 9 Headquarters
- **People:** Natthapong Charoenwong, Siriporn Wiriyakul, Thanakorn Pattanapong, Ananya Sukhonthamat
