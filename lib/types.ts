export type CarStatus = "Available" | "Rented" | "Maintenance" | "Sold";
export type BookingStatus = "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
export type ContractStatus = "Pending" | "Confirmed" | "Active" | "Expiring Soon" | "Expired" | "Terminated";
export type KycStatus = "Pending" | "Verified" | "Rejected";
export type ConversionStatus = "Eligible" | "Offer Sent" | "Renter Confirmed" | "Client Confirmed" | "Admin Confirmed" | "Completed";
export type PaymentMethod = "Credit Card" | "Bank Transfer" | "PromptPay";
export type ContractType = "Rent-and-Return" | "Rent-with-Purchase-Option" | "Rent-to-Sell";
export type DurationType = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Semi-Annual" | "Annual" | "Yearly" | "Rent-to-Sell";
export type ConnectorType = "CCS2" | "Type 2" | "CHAdeMO" | "GB/T";
export type UserRole = "Super Admin" | "Manager" | "Renter Admin" | "Renter User";
export type AppRole = "admin" | "renter";
export type CarType = "6-wheel" | "8-wheel" | "10-wheel" | "Prime Mover" | "Electric Pickup" | "Electric Van";

export interface Brand {
  id: string;
  name: string;
}

export interface CarModel {
  id: string;
  name: string;
  brandId?: string;
  brandName?: string;
  carType: CarType;
  year: number;
  batteryKwh: number;
  rangeWltp: number;
  rangeNedc: number;
  connectors: ConnectorType[];
  maxAcKw: number;
  maxDcKw: number;
  motorPowerKw?: number;
  photos: string[];
  highlights: string[];
  priceFrom: number;
}

export interface Car {
  id: string;
  licensePlate: string;
  modelId: string;
  modelName: string;
  carType: CarType;
  year: number;
  color: string;
  status: CarStatus;
  rfidCard: string;
  currentRenterId?: string;
  currentRenterName?: string;
  currentContractId?: string;
  currentBookingId?: string;
  odometer: number;
  photo?: string;
  notes?: string;
  isPurchaseOfferEligible: boolean;
  isRentToSell?: boolean;
  brandName?: string;
  statusHistory: StatusHistoryEntry[];
  maintenanceLogs: MaintenanceLog[];
  insurance: InsuranceRecord;
  odometerLogs: OdometerLog[];
}

export interface StatusHistoryEntry {
  status: CarStatus;
  date: string;
  note?: string;
  changedBy: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  type: string;
  cost: number;
  provider: string;
  notes: string;
}

export interface InsuranceRecord {
  policyNumber: string;
  provider: string;
  expiryDate: string;
  annualPremium: number;
}

export interface OdometerLog {
  date: string;
  reading: number;
  contractId?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface AddOn {
  portableCharger: boolean;
  childSeat: boolean;
  extraInsurance: boolean;
}

export interface ApprovalStep {
  step: "Submitted" | "Manager Approved" | "Admin Approved" | "Active" | "Confirmed";
  actorName?: string;
  timestamp?: string;
  status: "done" | "current" | "pending" | "rejected";
  reason?: string;
}

export interface Booking {
  id: string;
  companyId: string;
  companyName: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  carId: string;
  licensePlate: string;
  modelId: string;
  modelName: string;
  brandName: string;
  status: BookingStatus;
  contractType: ContractType;
  durationType: DurationType;
  pickupDate: string;
  returnDate: string;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  addOns: AddOn;
  baseRate: number;
  addOnTotal: number;
  deposit: number;
  vat: number;
  total: number;
  approvalSteps: ApprovalStep[];
  createdAt: string;
  extensionRequest?: ExtensionRequest;
  cancellationReason?: string;
}

export interface ExtensionRequest {
  newReturnDate: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
}

export interface ContractVehicleGroup {
  carType: CarType;
  modelId: string;
  modelName: string;
  licensePlates: string[];
  quantity: number;
  ratePerUnit: number;
}

export interface Contract {
  id: string;
  companyId: string;
  companyName: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  vehicleGroups: ContractVehicleGroup[];
  status: ContractStatus;
  contractType: ContractType;
  durationType: DurationType;
  pickupDate: string;
  returnDate: string;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  deposit: number;
  vat: number;
  total: number;
  approvalSteps: ApprovalStep[];
  createdAt: string;
  extensionRequest?: ExtensionRequest;
  terminationReason?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  taxId: string;
  billingEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  kycStatus: KycStatus;
  kycDocuments: KycDocument[];
  users: CompanyUser[];
  activeContracts: number;
  totalVehiclesRented: number;
  status: "Active" | "Inactive";
  creditLimit?: number;
  activeRentals?: number;
  maxActiveRentals?: number;
}

export interface KycDocument {
  name: string;
  uploadedAt: string;
  type: string;
}

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastActive: string;
}

export interface PricingTier {
  modelId: string;
  modelName: string;
  carType: CarType;
  monthly: number;
  quarterly: number;
  semiAnnual: number;
  annual: number;
  rentWithPurchase: number;
  deposit: number;
  daily1?: number;
  daily3?: number;
  daily5?: number;
  weekly?: number;
  yearly?: number;
  rentToSell?: number;
  addonCharger?: number;
  addonChildSeat?: number;
  addonInsurance?: number;
}

export interface Transaction {
  id: string;
  contractId: string;
  companyName: string;
  amount: number;
  type: "Deposit" | "Rental Fee" | "Late Fee" | "Deposit Refund" | "Deposit Forfeit";
  method: PaymentMethod;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  depositStatus?: "Held" | "Refunded" | "Forfeited";
  bookingId?: string;
}

export interface ChargingCost {
  id: string;
  carId: string;
  licensePlate: string;
  date: string;
  kwh: number;
  cost: number;
  rfidCard: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  companyName: string;
  amount: number;
  vat: number;
  total: number;
  status: "Draft" | "Sent" | "Paid";
  date: string;
}

export interface RentToSellEntry {
  id: string;
  carId: string;
  licensePlate: string;
  modelName: string;
  brandName?: string;
  companyName: string;
  companyId: string;
  contractStart: string;
  totalPaid: number;
  buyoutAmount: number;
  conversionStatus: ConversionStatus;
  bookingId?: string;
}

export interface PurchaseOffer {
  id: string;
  carId: string;
  licensePlate: string;
  modelName: string;
  carType: CarType;
  companyName: string;
  companyId: string;
  contractId: string;
  contractStart: string;
  totalPaid: number;
  buyoutAmount: number;
  conversionStatus: ConversionStatus;
  offerSentAt?: string;
  offerExpiryDate?: string;
}

export interface AppNotification {
  id: string;
  type: "approval" | "rejection" | "reminder" | "invoice" | "contract" | "purchase-offer" | "telematics" | "conversion";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  contractId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Manager";
  createdAt: string;
}

// ─── Fleet Contracts (v2 Renter) ──────────────────────────────────────────────
export interface ContractVehicleEntry {
  carId: string;
  licensePlate: string;
  modelId: string;
  modelName: string;
  brandName: string;
  photo?: string;
}

export interface PurchaseOfferDetail {
  vehicleId: string;
  licensePlate: string;
  modelName: string;
  brandName: string;
  buyoutAmount: number;
  offerExpiry: string;
  totalPaid: number;
}

export interface FleetContract {
  id: string;
  companyId: string;
  companyName: string;
  status: "Pending" | "Active" | "Expiring Soon" | "Expired" | "Terminated";
  contractType: "Rent-and-Return" | "Rent-with-Purchase-Option";
  startDate: string;
  endDate: string;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  vehicles: ContractVehicleEntry[];
  totalAmount: number;
  deposit: number;
  vat: number;
  baseRate: number;
  createdAt: string;
  purchaseOfferAvailable?: boolean;
  purchaseOffers?: PurchaseOfferDetail[];
  approvalSteps: ApprovalStep[];
}

// ─── Telematics (v2 Renter) ───────────────────────────────────────────────────
export interface VehicleTelematics {
  vehicleId: string;
  licensePlate: string;
  modelName: string;
  brandName: string;
  lat: number;
  lng: number;
  speed: number;
  soc: number;
  chargingStatus: "Charging" | "Not Charging" | "Full";
  ignition: "On" | "Off";
  odometer: number;
  estimatedRange: number;
  doorStatus: "Open" | "Closed";
  lastUpdated: string;
  companyId: string;
}

export interface TripRecord {
  id: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  distanceKm: number;
  durationMin: number;
  date: string;
}

export interface ChargingSessionRecord {
  id: string;
  vehicleId: string;
  date: string;
  location: string;
  durationMin: number;
  kwhCharged: number;
  cost: number;
}

export interface DriverBehaviorEvent {
  id: string;
  vehicleId: string;
  timestamp: string;
  type: "Hard Brake" | "Rapid Acceleration" | "Speeding" | "Idle";
  location: string;
  severity: "Low" | "Medium" | "High";
}

export interface SocHistoryEntry {
  date: string;
  soc: number;
}
