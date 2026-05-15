import type {
  Brand, CarModel, Car, Company, Booking, PricingTier, Transaction,
  ChargingCost, Invoice, RentToSellEntry, AppNotification, AdminUser,
  Location, ConnectorType,
} from "./types";

// ─── Brands ───────────────────────────────────────────────────────────────────
export const brands: Brand[] = [
  { id: "b1", name: "Tesla" },
  { id: "b2", name: "BYD" },
  { id: "b3", name: "MG" },
  { id: "b4", name: "Neta" },
  { id: "b5", name: "Ora" },
];

// ─── Models ───────────────────────────────────────────────────────────────────
export const carModels: CarModel[] = [
  {
    id: "m1", brandId: "b1", brandName: "Tesla", name: "Model 3 Long Range",
    year: 2024, batteryKwh: 82, rangeWltp: 602, rangeNedc: 675,
    connectors: ["CCS2", "Type 2"] as ConnectorType[],
    maxAcKw: 11, maxDcKw: 250,
    photos: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80"],
    highlights: ["Autopilot", "15.4\" Touchscreen", "OTA Updates", "Performance Mode"],
    priceFrom: 2900,
  },
  {
    id: "m2", brandId: "b2", brandName: "BYD", name: "Atto 3",
    year: 2024, batteryKwh: 60.5, rangeWltp: 420, rangeNedc: 480,
    connectors: ["CCS2", "Type 2"] as ConnectorType[],
    maxAcKw: 7, maxDcKw: 100,
    photos: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"],
    highlights: ["Blade Battery", "360° Camera", "DiLink System", "Vegan Leather Interior"],
    priceFrom: 1800,
  },
  {
    id: "m3", brandId: "b3", brandName: "MG", name: "EP",
    year: 2023, batteryKwh: 50.3, rangeWltp: 380, rangeNedc: 425,
    connectors: ["CCS2", "Type 2"] as ConnectorType[],
    maxAcKw: 6.6, maxDcKw: 75,
    photos: ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80"],
    highlights: ["i-SMART Connected", "10.1\" Infotainment", "6-Year Battery Warranty"],
    priceFrom: 1400,
  },
  {
    id: "m4", brandId: "b4", brandName: "Neta", name: "V Pro",
    year: 2024, batteryKwh: 38.5, rangeWltp: 310, rangeNedc: 370,
    connectors: ["CCS2", "GB/T"] as ConnectorType[],
    maxAcKw: 6.6, maxDcKw: 40,
    photos: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80"],
    highlights: ["AI Voice Control", "Smart Cruise", "Face Recognition", "Wireless CarPlay"],
    priceFrom: 1200,
  },
  {
    id: "m5", brandId: "b5", brandName: "Ora", name: "Good Cat",
    year: 2024, batteryKwh: 63, rangeWltp: 500, rangeNedc: 560,
    connectors: ["CCS2", "Type 2"] as ConnectorType[],
    maxAcKw: 6.6, maxDcKw: 80,
    photos: ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80"],
    highlights: ["Retro Design", "L2 Autopilot", "OTA Updates", "Premium Sound System"],
    priceFrom: 1600,
  },
];

// ─── Locations ─────────────────────────────────────────────────────────────────
export const locations: Location[] = [
  { id: "l1", name: "Sukhumvit Service Center", address: "123 Sukhumvit Rd, Khlong Toei, Bangkok 10110" },
  { id: "l2", name: "Silom Office Hub", address: "45 Silom Rd, Bang Rak, Bangkok 10500" },
  { id: "l3", name: "Ladkrabang Depot", address: "88 Chalerm Mahanakorn Rd, Lat Krabang, Bangkok 10520" },
  { id: "l4", name: "Don Mueang Station", address: "222 Vibhavadi Rangsit Rd, Don Mueang, Bangkok 10210" },
  { id: "l5", name: "Rama 9 Headquarters", address: "9 Rama 9 Rd, Huai Khwang, Bangkok 10310" },
];

// ─── Companies ────────────────────────────────────────────────────────────────
export const companies: Company[] = [
  {
    id: "c1", name: "Siam Motors Group", taxId: "0105562123456",
    address: "1 Wireless Rd, Lumpini, Bangkok 10330",
    billingEmail: "billing@siammotors.co.th",
    contactName: "Natthapong Charoenwong", contactPhone: "02-123-4567",
    contactEmail: "natthapong@siammotors.co.th",
    kycStatus: "Verified",
    kycDocuments: [
      { name: "Business Registration Certificate", uploadedAt: "2025-11-10", type: "PDF" },
      { name: "VAT Registration", uploadedAt: "2025-11-10", type: "PDF" },
      { name: "Director ID Card", uploadedAt: "2025-11-10", type: "Image" },
    ],
    users: [
      { id: "u1", name: "Natthapong Charoenwong", email: "natthapong@siammotors.co.th", role: "Renter Admin", lastActive: "2026-05-14" },
      { id: "u2", name: "Siriporn Wiriyakul", email: "siriporn@siammotors.co.th", role: "Renter User", lastActive: "2026-05-13" },
    ],
    creditLimit: 500000, maxActiveRentals: 10, activeRentals: 4, status: "Active",
  },
  {
    id: "c2", name: "Bangkok Fleet Solutions", taxId: "0105563234567",
    address: "200 Ratchadapisek Rd, Huai Khwang, Bangkok 10310",
    billingEmail: "accounts@bkkfleet.co.th",
    contactName: "Thanakorn Pattanapong", contactPhone: "02-234-5678",
    contactEmail: "thanakorn@bkkfleet.co.th",
    kycStatus: "Verified",
    kycDocuments: [
      { name: "Business Registration Certificate", uploadedAt: "2025-10-05", type: "PDF" },
      { name: "Bank Statement", uploadedAt: "2025-10-05", type: "PDF" },
    ],
    users: [
      { id: "u3", name: "Thanakorn Pattanapong", email: "thanakorn@bkkfleet.co.th", role: "Renter Admin", lastActive: "2026-05-15" },
    ],
    creditLimit: 300000, maxActiveRentals: 6, activeRentals: 2, status: "Active",
  },
  {
    id: "c3", name: "ThaiBev Logistics", taxId: "0105564345678",
    address: "14 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900",
    billingEmail: "finance@thaibevlogistics.co.th",
    contactName: "Ananya Sukhonthamat", contactPhone: "02-345-6789",
    contactEmail: "ananya@thaibevlogistics.co.th",
    kycStatus: "Pending",
    kycDocuments: [
      { name: "Business Registration Certificate", uploadedAt: "2026-04-20", type: "PDF" },
    ],
    users: [
      { id: "u4", name: "Ananya Sukhonthamat", email: "ananya@thaibevlogistics.co.th", role: "Renter Admin", lastActive: "2026-05-10" },
    ],
    creditLimit: 200000, maxActiveRentals: 4, activeRentals: 1, status: "Active",
  },
  {
    id: "c4", name: "PTT Mobility Co.", taxId: "0105565456789",
    address: "555 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900",
    billingEmail: "billing@pttmobility.co.th",
    contactName: "Siriporn Wiriyakul", contactPhone: "02-456-7890",
    contactEmail: "siriporn@pttmobility.co.th",
    kycStatus: "Verified",
    kycDocuments: [
      { name: "Business Registration Certificate", uploadedAt: "2025-09-15", type: "PDF" },
      { name: "Company Affidavit", uploadedAt: "2025-09-15", type: "PDF" },
    ],
    users: [
      { id: "u5", name: "Siriporn Wiriyakul", email: "siriporn@pttmobility.co.th", role: "Renter Admin", lastActive: "2026-05-12" },
      { id: "u6", name: "Kittipong Sangsuk", email: "kittipong@pttmobility.co.th", role: "Renter User", lastActive: "2026-05-08" },
    ],
    creditLimit: 800000, maxActiveRentals: 15, activeRentals: 5, status: "Active",
  },
  {
    id: "c5", name: "Central Retail Transport", taxId: "0105566567890",
    address: "306 Silom Rd, Suriyawong, Bang Rak, Bangkok 10500",
    billingEmail: "transport@central.co.th",
    contactName: "Thanakorn Pattanapong", contactPhone: "02-567-8901",
    contactEmail: "thanakorn.p@central.co.th",
    kycStatus: "Rejected",
    kycDocuments: [
      { name: "Business Registration Certificate", uploadedAt: "2026-03-10", type: "PDF" },
    ],
    users: [
      { id: "u7", name: "Thanakorn Pattanapong", email: "thanakorn.p@central.co.th", role: "Renter Admin", lastActive: "2026-03-20" },
    ],
    creditLimit: 0, maxActiveRentals: 0, activeRentals: 0, status: "Inactive",
  },
];

// ─── Cars ─────────────────────────────────────────────────────────────────────
export const cars: Car[] = [
  {
    id: "car1", licensePlate: "กก 1234 กทม", modelId: "m1", brandName: "Tesla", modelName: "Model 3 Long Range",
    year: 2024, color: "Pearl White", status: "Rented", rfidCard: "RFID-TM3-001",
    currentRenterId: "c1", currentRenterName: "Siam Motors Group", currentBookingId: "bk1",
    odometer: 12450, isRentToSell: true,
    statusHistory: [
      { status: "Available", date: "2025-12-01", changedBy: "Natthapong Charoenwong" },
      { status: "Rented", date: "2026-02-01", changedBy: "System", note: "Booking BK-001" },
    ],
    maintenanceLogs: [
      { id: "ml1", date: "2026-01-15", type: "Tire Rotation", cost: 1500, provider: "Tesla Service Center", notes: "All tires rotated and balanced" },
    ],
    insurance: { policyNumber: "INS-2024-001", provider: "AXA Insurance", expiryDate: "2026-12-31", annualPremium: 28000 },
    odometerLogs: [
      { date: "2025-12-01", reading: 5000 },
      { date: "2026-02-01", reading: 8200, bookingId: "bk1" },
      { date: "2026-05-01", reading: 12450 },
    ],
  },
  {
    id: "car2", licensePlate: "ขข 5678 กทม", modelId: "m1", brandName: "Tesla", modelName: "Model 3 Long Range",
    year: 2024, color: "Midnight Silver", status: "Available", rfidCard: "RFID-TM3-002",
    odometer: 5300, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2025-11-15", changedBy: "Natthapong Charoenwong" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-002", provider: "AXA Insurance", expiryDate: "2026-12-31", annualPremium: 28000 },
    odometerLogs: [{ date: "2025-11-15", reading: 0 }],
  },
  {
    id: "car3", licensePlate: "คค 9012 กทม", modelId: "m2", brandName: "BYD", modelName: "Atto 3",
    year: 2024, color: "Surf Blue", status: "Rented", rfidCard: "RFID-BYD-001",
    currentRenterId: "c2", currentRenterName: "Bangkok Fleet Solutions", currentBookingId: "bk2",
    odometer: 8900, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2025-10-20", changedBy: "System" },
      { status: "Rented", date: "2026-03-01", changedBy: "System", note: "Booking BK-002" },
    ],
    maintenanceLogs: [
      { id: "ml2", date: "2025-12-10", type: "Annual Service", cost: 3500, provider: "BYD Authorized Service", notes: "Full annual inspection completed" },
    ],
    insurance: { policyNumber: "INS-2024-003", provider: "Dhipaya Insurance", expiryDate: "2026-10-31", annualPremium: 22000 },
    odometerLogs: [{ date: "2025-10-20", reading: 0 }, { date: "2026-03-01", reading: 5000 }],
  },
  {
    id: "car4", licensePlate: "งง 3456 กทม", modelId: "m2", brandName: "BYD", modelName: "Atto 3",
    year: 2024, color: "Coral Pink", status: "Maintenance", rfidCard: "RFID-BYD-002",
    odometer: 21000, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2025-08-01", changedBy: "System" },
      { status: "Rented", date: "2025-10-01", changedBy: "System" },
      { status: "Available", date: "2026-01-01", changedBy: "System" },
      { status: "Maintenance", date: "2026-04-01", changedBy: "Thanakorn Pattanapong", note: "Battery check required" },
    ],
    maintenanceLogs: [
      { id: "ml3", date: "2026-04-01", type: "Battery Diagnostic", cost: 5000, provider: "BYD Authorized Service", notes: "Battery capacity check in progress" },
    ],
    insurance: { policyNumber: "INS-2024-004", provider: "Dhipaya Insurance", expiryDate: "2026-10-31", annualPremium: 22000 },
    odometerLogs: [{ date: "2025-08-01", reading: 0 }, { date: "2026-04-01", reading: 21000 }],
  },
  {
    id: "car5", licensePlate: "จจ 7890 กทม", modelId: "m3", brandName: "MG", modelName: "EP",
    year: 2023, color: "Starry Silver", status: "Rented", rfidCard: "RFID-MG-001",
    currentRenterId: "c1", currentRenterName: "Siam Motors Group", currentBookingId: "bk3",
    odometer: 35200, isRentToSell: true,
    statusHistory: [
      { status: "Available", date: "2025-06-01", changedBy: "System" },
      { status: "Rented", date: "2025-08-01", changedBy: "System" },
    ],
    maintenanceLogs: [
      { id: "ml4", date: "2025-12-15", type: "Brake Inspection", cost: 2000, provider: "MG Service Center", notes: "Brake pads replaced" },
      { id: "ml5", date: "2026-03-20", type: "Tire Replacement", cost: 8000, provider: "MG Service Center", notes: "4 tires replaced" },
    ],
    insurance: { policyNumber: "INS-2023-001", provider: "Viriyah Insurance", expiryDate: "2026-07-31", annualPremium: 18000 },
    odometerLogs: [{ date: "2025-06-01", reading: 12000 }, { date: "2026-05-01", reading: 35200 }],
  },
  {
    id: "car6", licensePlate: "ฉฉ 1234 กทม", modelId: "m3", brandName: "MG", modelName: "EP",
    year: 2023, color: "Magnetic Black", status: "Available", rfidCard: "RFID-MG-002",
    odometer: 18500, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2025-07-01", changedBy: "System" },
      { status: "Rented", date: "2025-09-01", changedBy: "System" },
      { status: "Available", date: "2026-02-15", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2023-002", provider: "Viriyah Insurance", expiryDate: "2026-07-31", annualPremium: 18000 },
    odometerLogs: [{ date: "2025-07-01", reading: 5000 }],
  },
  {
    id: "car7", licensePlate: "ชช 5678 กทม", modelId: "m4", brandName: "Neta", modelName: "V Pro",
    year: 2024, color: "Sky Blue", status: "Rented", rfidCard: "RFID-NV-001",
    currentRenterId: "c4", currentRenterName: "PTT Mobility Co.", currentBookingId: "bk4",
    odometer: 6700, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2026-01-10", changedBy: "System" },
      { status: "Rented", date: "2026-04-01", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-005", provider: "LMG Insurance", expiryDate: "2027-01-31", annualPremium: 15000 },
    odometerLogs: [{ date: "2026-01-10", reading: 0 }],
  },
  {
    id: "car8", licensePlate: "ซซ 9012 กทม", modelId: "m4", brandName: "Neta", modelName: "V Pro",
    year: 2024, color: "Pearl White", status: "Available", rfidCard: "RFID-NV-002",
    odometer: 2100, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2026-02-01", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-006", provider: "LMG Insurance", expiryDate: "2027-01-31", annualPremium: 15000 },
    odometerLogs: [{ date: "2026-02-01", reading: 0 }],
  },
  {
    id: "car9", licensePlate: "ญญ 3456 กทม", modelId: "m5", brandName: "Ora", modelName: "Good Cat",
    year: 2024, color: "Cream White", status: "Rented", rfidCard: "RFID-ORA-001",
    currentRenterId: "c3", currentRenterName: "ThaiBev Logistics", currentBookingId: "bk5",
    odometer: 9400, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2025-12-20", changedBy: "System" },
      { status: "Rented", date: "2026-03-15", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-007", provider: "AXA Insurance", expiryDate: "2026-12-31", annualPremium: 20000 },
    odometerLogs: [{ date: "2025-12-20", reading: 0 }],
  },
  {
    id: "car10", licensePlate: "ฎฎ 7890 กทม", modelId: "m5", brandName: "Ora", modelName: "Good Cat",
    year: 2024, color: "Candy Pink", status: "Available", rfidCard: "RFID-ORA-002",
    odometer: 3200, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2026-01-05", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-008", provider: "AXA Insurance", expiryDate: "2026-12-31", annualPremium: 20000 },
    odometerLogs: [{ date: "2026-01-05", reading: 0 }],
  },
  {
    id: "car11", licensePlate: "ฏฏ 1111 กทม", modelId: "m1", brandName: "Tesla", modelName: "Model 3 Long Range",
    year: 2023, color: "Deep Blue Metallic", status: "Sold", rfidCard: "RFID-TM3-003",
    odometer: 48000, isRentToSell: false,
    statusHistory: [
      { status: "Available", date: "2024-01-01", changedBy: "System" },
      { status: "Rented", date: "2024-03-01", changedBy: "System" },
      { status: "Sold", date: "2026-03-01", changedBy: "Natthapong Charoenwong", note: "Rent-to-sell conversion completed" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2023-005", provider: "AXA Insurance", expiryDate: "2026-01-31", annualPremium: 28000 },
    odometerLogs: [{ date: "2024-01-01", reading: 0 }],
  },
  {
    id: "car12", licensePlate: "ฐฐ 2222 กทม", modelId: "m2", brandName: "BYD", modelName: "Atto 3",
    year: 2024, color: "Forest Green", status: "Rented", rfidCard: "RFID-BYD-003",
    currentRenterId: "c4", currentRenterName: "PTT Mobility Co.", currentBookingId: "bk6",
    odometer: 15600, isRentToSell: true,
    statusHistory: [
      { status: "Available", date: "2025-09-01", changedBy: "System" },
      { status: "Rented", date: "2025-11-01", changedBy: "System" },
    ],
    maintenanceLogs: [],
    insurance: { policyNumber: "INS-2024-009", provider: "Dhipaya Insurance", expiryDate: "2026-09-30", annualPremium: 22000 },
    odometerLogs: [{ date: "2025-09-01", reading: 0 }],
  },
];

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookings: Booking[] = [
  {
    id: "bk1", companyId: "c1", companyName: "Siam Motors Group",
    renterName: "Natthapong Charoenwong", renterPhone: "081-234-5678", renterEmail: "natthapong@siammotors.co.th",
    carId: "car1", licensePlate: "กก 1234 กทม", modelId: "m1", modelName: "Model 3 Long Range", brandName: "Tesla",
    status: "Active", contractType: "Rent-to-Sell", durationType: "Monthly",
    pickupDate: "2026-02-01", returnDate: "2027-01-31",
    pickupLocationId: "l1", pickupLocationName: "Sukhumvit Service Center",
    returnLocationId: "l1", returnLocationName: "Sukhumvit Service Center",
    addOns: { portableCharger: true, childSeat: false, extraInsurance: true },
    baseRate: 29000, addOnTotal: 3500, deposit: 30000, vat: 2275, total: 64775,
    approvalSteps: [
      { step: "Submitted", actorName: "Natthapong Charoenwong", timestamp: "2026-01-20 09:15", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-01-21 14:30", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2026-01-22 10:00", status: "done" },
      { step: "Confirmed", actorName: "System", timestamp: "2026-01-22 10:01", status: "done" },
    ],
    createdAt: "2026-01-20",
  },
  {
    id: "bk2", companyId: "c2", companyName: "Bangkok Fleet Solutions",
    renterName: "Thanakorn Pattanapong", renterPhone: "082-345-6789", renterEmail: "thanakorn@bkkfleet.co.th",
    carId: "car3", licensePlate: "คค 9012 กทม", modelId: "m2", modelName: "Atto 3", brandName: "BYD",
    status: "Active", contractType: "Rent-and-Return", durationType: "Monthly",
    pickupDate: "2026-03-01", returnDate: "2026-05-31",
    pickupLocationId: "l2", pickupLocationName: "Silom Office Hub",
    returnLocationId: "l2", returnLocationName: "Silom Office Hub",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: false },
    baseRate: 16200, addOnTotal: 0, deposit: 20000, vat: 1134, total: 37334,
    approvalSteps: [
      { step: "Submitted", actorName: "Thanakorn Pattanapong", timestamp: "2026-02-20 11:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-02-21 09:30", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2026-02-22 15:00", status: "done" },
      { step: "Confirmed", timestamp: "2026-02-22 15:01", status: "done" },
    ],
    createdAt: "2026-02-20",
  },
  {
    id: "bk3", companyId: "c1", companyName: "Siam Motors Group",
    renterName: "Siriporn Wiriyakul", renterPhone: "083-456-7890", renterEmail: "siriporn@siammotors.co.th",
    carId: "car5", licensePlate: "จจ 7890 กทม", modelId: "m3", modelName: "EP", brandName: "MG",
    status: "Active", contractType: "Rent-to-Sell", durationType: "Yearly",
    pickupDate: "2025-08-01", returnDate: "2026-07-31",
    pickupLocationId: "l5", pickupLocationName: "Rama 9 Headquarters",
    returnLocationId: "l5", returnLocationName: "Rama 9 Headquarters",
    addOns: { portableCharger: true, childSeat: true, extraInsurance: true },
    baseRate: 120000, addOnTotal: 12000, deposit: 25000, vat: 9240, total: 166240,
    approvalSteps: [
      { step: "Submitted", actorName: "Siriporn Wiriyakul", timestamp: "2025-07-15 10:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2025-07-16 11:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2025-07-17 09:00", status: "done" },
      { step: "Confirmed", timestamp: "2025-07-17 09:01", status: "done" },
    ],
    createdAt: "2025-07-15",
  },
  {
    id: "bk4", companyId: "c4", companyName: "PTT Mobility Co.",
    renterName: "Siriporn Wiriyakul", renterPhone: "084-567-8901", renterEmail: "siriporn@pttmobility.co.th",
    carId: "car7", licensePlate: "ชช 5678 กทม", modelId: "m4", modelName: "V Pro", brandName: "Neta",
    status: "Active", contractType: "Rent-and-Return", durationType: "Monthly",
    pickupDate: "2026-04-01", returnDate: "2026-06-30",
    pickupLocationId: "l4", pickupLocationName: "Don Mueang Station",
    returnLocationId: "l4", returnLocationName: "Don Mueang Station",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: false },
    baseRate: 10800, addOnTotal: 0, deposit: 15000, vat: 756, total: 26556,
    approvalSteps: [
      { step: "Submitted", actorName: "Siriporn Wiriyakul", timestamp: "2026-03-25 14:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-03-26 10:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2026-03-27 09:00", status: "done" },
      { step: "Confirmed", timestamp: "2026-03-27 09:01", status: "done" },
    ],
    createdAt: "2026-03-25",
  },
  {
    id: "bk5", companyId: "c3", companyName: "ThaiBev Logistics",
    renterName: "Ananya Sukhonthamat", renterPhone: "085-678-9012", renterEmail: "ananya@thaibevlogistics.co.th",
    carId: "car9", licensePlate: "ญญ 3456 กทม", modelId: "m5", modelName: "Good Cat", brandName: "Ora",
    status: "Active", contractType: "Rent-and-Return", durationType: "Monthly",
    pickupDate: "2026-03-15", returnDate: "2026-06-14",
    pickupLocationId: "l3", pickupLocationName: "Ladkrabang Depot",
    returnLocationId: "l3", returnLocationName: "Ladkrabang Depot",
    addOns: { portableCharger: true, childSeat: false, extraInsurance: false },
    baseRate: 14400, addOnTotal: 1500, deposit: 20000, vat: 1113, total: 37013,
    approvalSteps: [
      { step: "Submitted", actorName: "Ananya Sukhonthamat", timestamp: "2026-03-10 09:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-03-11 11:30", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2026-03-12 10:00", status: "done" },
      { step: "Confirmed", timestamp: "2026-03-12 10:01", status: "done" },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "bk6", companyId: "c4", companyName: "PTT Mobility Co.",
    renterName: "Kittipong Sangsuk", renterPhone: "086-789-0123", renterEmail: "kittipong@pttmobility.co.th",
    carId: "car12", licensePlate: "ฐฐ 2222 กทม", modelId: "m2", modelName: "Atto 3", brandName: "BYD",
    status: "Active", contractType: "Rent-to-Sell", durationType: "Monthly",
    pickupDate: "2025-11-01", returnDate: "2026-10-31",
    pickupLocationId: "l5", pickupLocationName: "Rama 9 Headquarters",
    returnLocationId: "l5", returnLocationName: "Rama 9 Headquarters",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: true },
    baseRate: 162000, addOnTotal: 18000, deposit: 25000, vat: 12600, total: 217600,
    approvalSteps: [
      { step: "Submitted", actorName: "Kittipong Sangsuk", timestamp: "2025-10-20 09:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2025-10-21 10:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2025-10-22 09:00", status: "done" },
      { step: "Confirmed", timestamp: "2025-10-22 09:01", status: "done" },
    ],
    createdAt: "2025-10-20",
  },
  {
    id: "bk7", companyId: "c2", companyName: "Bangkok Fleet Solutions",
    renterName: "Thanakorn Pattanapong", renterPhone: "082-345-6789", renterEmail: "thanakorn@bkkfleet.co.th",
    carId: "car2", licensePlate: "ขข 5678 กทม", modelId: "m1", modelName: "Model 3 Long Range", brandName: "Tesla",
    status: "Pending", contractType: "Rent-and-Return", durationType: "Weekly",
    pickupDate: "2026-05-20", returnDate: "2026-05-27",
    pickupLocationId: "l1", pickupLocationName: "Sukhumvit Service Center",
    returnLocationId: "l2", returnLocationName: "Silom Office Hub",
    addOns: { portableCharger: true, childSeat: false, extraInsurance: false },
    baseRate: 15000, addOnTotal: 700, deposit: 30000, vat: 1099, total: 46799,
    approvalSteps: [
      { step: "Submitted", actorName: "Thanakorn Pattanapong", timestamp: "2026-05-14 16:00", status: "done" },
      { step: "Manager Approved", status: "current" },
      { step: "Admin Approved", status: "pending" },
      { step: "Confirmed", status: "pending" },
    ],
    createdAt: "2026-05-14",
  },
  {
    id: "bk8", companyId: "c4", companyName: "PTT Mobility Co.",
    renterName: "Siriporn Wiriyakul", renterPhone: "084-567-8901", renterEmail: "siriporn@pttmobility.co.th",
    carId: "car6", licensePlate: "ฉฉ 1234 กทม", modelId: "m3", modelName: "EP", brandName: "MG",
    status: "Pending", contractType: "Rent-and-Return", durationType: "Daily",
    pickupDate: "2026-05-22", returnDate: "2026-05-27",
    pickupLocationId: "l4", pickupLocationName: "Don Mueang Station",
    returnLocationId: "l4", returnLocationName: "Don Mueang Station",
    addOns: { portableCharger: false, childSeat: true, extraInsurance: false },
    baseRate: 5000, addOnTotal: 750, deposit: 15000, vat: 403, total: 21153,
    approvalSteps: [
      { step: "Submitted", actorName: "Siriporn Wiriyakul", timestamp: "2026-05-15 08:30", status: "done" },
      { step: "Manager Approved", status: "current" },
      { step: "Admin Approved", status: "pending" },
      { step: "Confirmed", status: "pending" },
    ],
    createdAt: "2026-05-15",
  },
  {
    id: "bk9", companyId: "c1", companyName: "Siam Motors Group",
    renterName: "Natthapong Charoenwong", renterPhone: "081-234-5678", renterEmail: "natthapong@siammotors.co.th",
    carId: "car10", licensePlate: "ฎฎ 7890 กทม", modelId: "m5", modelName: "Good Cat", brandName: "Ora",
    status: "Completed", contractType: "Rent-and-Return", durationType: "Monthly",
    pickupDate: "2026-01-01", returnDate: "2026-03-31",
    pickupLocationId: "l1", pickupLocationName: "Sukhumvit Service Center",
    returnLocationId: "l1", returnLocationName: "Sukhumvit Service Center",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: false },
    baseRate: 14400, addOnTotal: 0, deposit: 20000, vat: 1008, total: 35408,
    approvalSteps: [
      { step: "Submitted", actorName: "Natthapong Charoenwong", timestamp: "2025-12-20 10:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2025-12-21 09:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2025-12-22 10:00", status: "done" },
      { step: "Confirmed", timestamp: "2025-12-22 10:01", status: "done" },
    ],
    createdAt: "2025-12-20",
  },
  {
    id: "bk10", companyId: "c2", companyName: "Bangkok Fleet Solutions",
    renterName: "Thanakorn Pattanapong", renterPhone: "082-345-6789", renterEmail: "thanakorn@bkkfleet.co.th",
    carId: "car8", licensePlate: "ซซ 9012 กทม", modelId: "m4", modelName: "V Pro", brandName: "Neta",
    status: "Cancelled", contractType: "Rent-and-Return", durationType: "Daily",
    pickupDate: "2026-04-10", returnDate: "2026-04-15",
    pickupLocationId: "l2", pickupLocationName: "Silom Office Hub",
    returnLocationId: "l2", returnLocationName: "Silom Office Hub",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: false },
    baseRate: 3600, addOnTotal: 0, deposit: 15000, vat: 252, total: 18852,
    approvalSteps: [
      { step: "Submitted", actorName: "Thanakorn Pattanapong", timestamp: "2026-04-05 11:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-04-06 09:00", status: "done" },
      { step: "Admin Approved", status: "rejected", reason: "Car unavailable due to emergency maintenance" },
      { step: "Confirmed", status: "pending" },
    ],
    createdAt: "2026-04-05",
    cancellationReason: "Car unavailable due to emergency maintenance",
  },
  {
    id: "bk11", companyId: "c4", companyName: "PTT Mobility Co.",
    renterName: "Kittipong Sangsuk", renterPhone: "086-789-0123", renterEmail: "kittipong@pttmobility.co.th",
    carId: "car8", licensePlate: "ซซ 9012 กทม", modelId: "m4", modelName: "V Pro", brandName: "Neta",
    status: "Confirmed", contractType: "Rent-and-Return", durationType: "Monthly",
    pickupDate: "2026-05-20", returnDate: "2026-06-19",
    pickupLocationId: "l4", pickupLocationName: "Don Mueang Station",
    returnLocationId: "l4", returnLocationName: "Don Mueang Station",
    addOns: { portableCharger: true, childSeat: false, extraInsurance: false },
    baseRate: 3600, addOnTotal: 500, deposit: 15000, vat: 291, total: 19391,
    approvalSteps: [
      { step: "Submitted", actorName: "Kittipong Sangsuk", timestamp: "2026-05-10 14:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2026-05-11 10:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2026-05-12 09:00", status: "done" },
      { step: "Confirmed", timestamp: "2026-05-12 09:01", status: "done" },
    ],
    createdAt: "2026-05-10",
    extensionRequest: {
      newReturnDate: "2026-07-19",
      submittedAt: "2026-05-15 10:00",
      status: "Pending",
    },
  },
  {
    id: "bk12", companyId: "c1", companyName: "Siam Motors Group",
    renterName: "Siriporn Wiriyakul", renterPhone: "083-456-7890", renterEmail: "siriporn@siammotors.co.th",
    carId: "car2", licensePlate: "ขข 5678 กทม", modelId: "m1", modelName: "Model 3 Long Range", brandName: "Tesla",
    status: "Completed", contractType: "Rent-and-Return", durationType: "Weekly",
    pickupDate: "2025-12-01", returnDate: "2025-12-28",
    pickupLocationId: "l5", pickupLocationName: "Rama 9 Headquarters",
    returnLocationId: "l1", returnLocationName: "Sukhumvit Service Center",
    addOns: { portableCharger: false, childSeat: false, extraInsurance: true },
    baseRate: 12000, addOnTotal: 2800, deposit: 30000, vat: 1036, total: 45836,
    approvalSteps: [
      { step: "Submitted", actorName: "Siriporn Wiriyakul", timestamp: "2025-11-25 09:00", status: "done" },
      { step: "Manager Approved", actorName: "Thanakorn Pattanapong", timestamp: "2025-11-26 10:00", status: "done" },
      { step: "Admin Approved", actorName: "Natthapong Charoenwong", timestamp: "2025-11-27 09:00", status: "done" },
      { step: "Confirmed", timestamp: "2025-11-27 09:01", status: "done" },
    ],
    createdAt: "2025-11-25",
  },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const pricingTiers: PricingTier[] = [
  { modelId: "m1", modelName: "Tesla Model 3 Long Range", daily1: 3200, daily3: 2900, daily5: 2700, weekly: 15000, monthly: 29000, yearly: 290000, rentToSell: 35000, deposit: 30000, addonCharger: 200, addonChildSeat: 150, addonInsurance: 400 },
  { modelId: "m2", modelName: "BYD Atto 3", daily1: 2000, daily3: 1800, daily5: 1600, weekly: 9800, monthly: 18000, yearly: 180000, rentToSell: 22000, deposit: 20000, addonCharger: 200, addonChildSeat: 150, addonInsurance: 300 },
  { modelId: "m3", modelName: "MG EP", daily1: 1600, daily3: 1400, daily5: 1300, weekly: 7500, monthly: 14000, yearly: 138000, rentToSell: 16000, deposit: 15000, addonCharger: 200, addonChildSeat: 150, addonInsurance: 250 },
  { modelId: "m4", modelName: "Neta V Pro", daily1: 1200, daily3: 1100, daily5: 1000, weekly: 5600, monthly: 10500, yearly: 105000, rentToSell: 12000, deposit: 12000, addonCharger: 200, addonChildSeat: 150, addonInsurance: 200 },
  { modelId: "m5", modelName: "Ora Good Cat", daily1: 1800, daily3: 1600, daily5: 1500, weekly: 8500, monthly: 16000, yearly: 158000, rentToSell: 19000, deposit: 18000, addonCharger: 200, addonChildSeat: 150, addonInsurance: 280 },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: "tx1", bookingId: "bk1", companyName: "Siam Motors Group", amount: 64775, type: "Rental Fee", method: "Bank Transfer", status: "Completed", date: "2026-02-01", depositStatus: "Held" },
  { id: "tx2", bookingId: "bk2", companyName: "Bangkok Fleet Solutions", amount: 37334, type: "Rental Fee", method: "PromptPay", status: "Completed", date: "2026-03-01", depositStatus: "Held" },
  { id: "tx3", bookingId: "bk3", companyName: "Siam Motors Group", amount: 166240, type: "Rental Fee", method: "Bank Transfer", status: "Completed", date: "2025-08-01", depositStatus: "Held" },
  { id: "tx4", bookingId: "bk5", companyName: "ThaiBev Logistics", amount: 37013, type: "Rental Fee", method: "Credit Card", status: "Completed", date: "2026-03-15", depositStatus: "Held" },
  { id: "tx5", bookingId: "bk9", companyName: "Siam Motors Group", amount: 35408, type: "Rental Fee", method: "Bank Transfer", status: "Completed", date: "2026-01-01", depositStatus: "Refunded" },
  { id: "tx6", bookingId: "bk10", companyName: "Bangkok Fleet Solutions", amount: 18852, type: "Deposit", method: "PromptPay", status: "Completed", date: "2026-04-05", depositStatus: "Refunded" },
  { id: "tx7", bookingId: "bk12", companyName: "Siam Motors Group", amount: 45836, type: "Rental Fee", method: "Credit Card", status: "Completed", date: "2025-12-01", depositStatus: "Refunded" },
  { id: "tx8", bookingId: "bk4", companyName: "PTT Mobility Co.", amount: 26556, type: "Rental Fee", method: "Bank Transfer", status: "Completed", date: "2026-04-01", depositStatus: "Held" },
  { id: "tx9", bookingId: "bk6", companyName: "PTT Mobility Co.", amount: 217600, type: "Rental Fee", method: "Bank Transfer", status: "Completed", date: "2025-11-01", depositStatus: "Held" },
];

export const chargingCosts: ChargingCost[] = [
  { id: "cc1", carId: "car1", licensePlate: "กก 1234 กทม", date: "2026-05-01", kwh: 45, cost: 315, rfidCard: "RFID-TM3-001" },
  { id: "cc2", carId: "car3", licensePlate: "คค 9012 กทม", date: "2026-05-03", kwh: 38, cost: 266, rfidCard: "RFID-BYD-001" },
  { id: "cc3", carId: "car5", licensePlate: "จจ 7890 กทม", date: "2026-05-05", kwh: 30, cost: 210, rfidCard: "RFID-MG-001" },
  { id: "cc4", carId: "car7", licensePlate: "ชช 5678 กทม", date: "2026-05-07", kwh: 25, cost: 175, rfidCard: "RFID-NV-001" },
  { id: "cc5", carId: "car9", licensePlate: "ญญ 3456 กทม", date: "2026-05-08", kwh: 40, cost: 280, rfidCard: "RFID-ORA-001" },
  { id: "cc6", carId: "car12", licensePlate: "ฐฐ 2222 กทม", date: "2026-05-10", kwh: 35, cost: 245, rfidCard: "RFID-BYD-003" },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-2026-001", bookingId: "bk1", companyName: "Siam Motors Group", amount: 60537, vat: 4238, total: 64775, status: "Paid", date: "2026-02-05" },
  { id: "inv2", invoiceNumber: "INV-2026-002", bookingId: "bk2", companyName: "Bangkok Fleet Solutions", amount: 34892, vat: 2442, total: 37334, status: "Paid", date: "2026-03-05" },
  { id: "inv3", invoiceNumber: "INV-2026-003", bookingId: "bk3", companyName: "Siam Motors Group", amount: 155327, vat: 10873, total: 166240, status: "Paid", date: "2025-08-05" },
  { id: "inv4", invoiceNumber: "INV-2026-004", bookingId: "bk5", companyName: "ThaiBev Logistics", amount: 34591, vat: 2422, total: 37013, status: "Sent", date: "2026-03-18" },
  { id: "inv5", invoiceNumber: "INV-2026-005", bookingId: "bk9", companyName: "Siam Motors Group", amount: 33092, vat: 2316, total: 35408, status: "Paid", date: "2026-01-05" },
  { id: "inv6", invoiceNumber: "INV-2026-006", bookingId: "bk4", companyName: "PTT Mobility Co.", amount: 24818, vat: 1738, total: 26556, status: "Sent", date: "2026-04-05" },
  { id: "inv7", invoiceNumber: "INV-2026-007", bookingId: "bk6", companyName: "PTT Mobility Co.", amount: 203364, vat: 14236, total: 217600, status: "Paid", date: "2025-11-05" },
  { id: "inv8", invoiceNumber: "INV-2026-008", bookingId: "bk12", companyName: "Siam Motors Group", amount: 42836, vat: 3000, total: 45836, status: "Paid", date: "2025-12-05" },
];

// ─── Rent-to-Sell ─────────────────────────────────────────────────────────────
export const rentToSellEntries: RentToSellEntry[] = [
  {
    carId: "car1", licensePlate: "กก 1234 กทม", modelName: "Model 3 Long Range", brandName: "Tesla",
    companyName: "Siam Motors Group", contractStart: "2026-02-01",
    totalPaid: 64775, buyoutAmount: 750000, conversionStatus: "Eligible", bookingId: "bk1",
  },
  {
    carId: "car5", licensePlate: "จจ 7890 กทม", modelName: "EP", brandName: "MG",
    companyName: "Siam Motors Group", contractStart: "2025-08-01",
    totalPaid: 166240, buyoutAmount: 650000, conversionStatus: "Renter Confirmed", bookingId: "bk3",
  },
  {
    carId: "car12", licensePlate: "ฐฐ 2222 กทม", modelName: "Atto 3", brandName: "BYD",
    companyName: "PTT Mobility Co.", contractStart: "2025-11-01",
    totalPaid: 217600, buyoutAmount: 700000, conversionStatus: "Admin Confirmed", bookingId: "bk6",
  },
  {
    carId: "car11", licensePlate: "ฏฏ 1111 กทม", modelName: "Model 3 Long Range", brandName: "Tesla",
    companyName: "Bangkok Fleet Solutions", contractStart: "2024-03-01",
    totalPaid: 520000, buyoutAmount: 750000, conversionStatus: "Completed", bookingId: "bk12",
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications: AppNotification[] = [
  { id: "n1", type: "approval", title: "Booking Approved", message: "Your booking BK-007 (Tesla Model 3) has been confirmed.", createdAt: "2026-05-12 09:01", read: false, bookingId: "bk11" },
  { id: "n2", type: "reminder", title: "Return Reminder", message: "Your rental for BYD Atto 3 (คค 9012) is due in 16 days on 31 May 2026.", createdAt: "2026-05-14 08:00", read: false, bookingId: "bk2" },
  { id: "n3", type: "invoice", title: "Invoice Ready", message: "Invoice INV-2026-004 for ฿37,013 is ready to download.", createdAt: "2026-03-18 15:00", read: true, bookingId: "bk5" },
  { id: "n4", type: "conversion", title: "Rent-to-Sell Update", message: "Your conversion request for MG EP (จจ 7890) has been confirmed by admin.", createdAt: "2026-05-10 11:00", read: false, bookingId: "bk3" },
  { id: "n5", type: "rejection", title: "Booking Rejected", message: "Booking BK-010 (Neta V Pro) was rejected: Car unavailable due to emergency maintenance.", createdAt: "2026-04-07 09:00", read: true, bookingId: "bk10" },
  { id: "n6", type: "contract", title: "Contract Expiry Alert", message: "Your rental contract for Ora Good Cat (ญญ 3456) expires in 30 days.", createdAt: "2026-05-15 08:00", read: false, bookingId: "bk5" },
];

// ─── Admin Users ──────────────────────────────────────────────────────────────
export const adminUsers: AdminUser[] = [
  { id: "a1", name: "Natthapong Charoenwong", email: "natthapong@evfleet.co.th", role: "Super Admin", createdAt: "2024-01-01" },
  { id: "a2", name: "Thanakorn Pattanapong", email: "thanakorn@evfleet.co.th", role: "Manager", createdAt: "2024-03-15" },
  { id: "a3", name: "Siriporn Wiriyakul", email: "siriporn@evfleet.co.th", role: "Manager", createdAt: "2025-01-10" },
];

// ─── Monthly chart data ────────────────────────────────────────────────────────
export const monthlyChartData = [
  { month: "Dec 25", income: 211076, expense: 45000 },
  { month: "Jan 26", income: 35408, expense: 38000 },
  { month: "Feb 26", income: 102109, expense: 52000 },
  { month: "Mar 26", income: 202587, expense: 61000 },
  { month: "Apr 26", income: 45408, expense: 28000 },
  { month: "May 26", income: 90000, expense: 35000 },
];
