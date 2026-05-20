export type CarStatus = "Available" | "Rented" | "Maintenance" | "Sold";
export type BookingStatus = "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
export type KycStatus = "Pending" | "Verified" | "Rejected";
export type ConversionStatus = "Eligible" | "Renter Confirmed" | "Admin Confirmed" | "Completed";
export type PaymentMethod = "Credit Card" | "Bank Transfer" | "PromptPay";
export type ContractType = "Rent-and-Return" | "Rent-to-Sell";
export type DurationType = "Daily" | "Weekly" | "Monthly" | "Yearly" | "Rent-to-Sell";
export type ConnectorType = "CCS2" | "Type 2" | "CHAdeMO" | "GB/T";
export type UserRole = "Super Admin" | "Manager" | "Renter Admin" | "Renter User";
export type AppRole = "admin" | "renter";

export interface Brand {
  id: string;
  name: string;
}

export interface CarModel {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  bodyType?: string;
  year: number;
  batteryKwh: number;
  rangeWltp: number;
  rangeNedc: number;
  connectors: ConnectorType[];
  maxAcKw: number;
  maxDcKw: number;
  photos: string[];
  highlights: string[];
  priceFrom: number;
}

export interface Car {
  id: string;
  licensePlate: string;
  modelId: string;
  brandName: string;
  modelName: string;
  bodyType?: string;
  year: number;
  color: string;
  status: CarStatus;
  rfidCard: string;
  currentRenterId?: string;
  currentRenterName?: string;
  currentBookingId?: string;
  odometer: number;
  photo?: string;
  notes?: string;
  isRentToSell: boolean;
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
  bookingId?: string;
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
  step: "Submitted" | "Sales Review" | "Manager Approved" | "Admin Approved" | "Confirmed" | "Contract Generated";
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

export interface Company {
  id: string;
  name: string;
  address: string;
  taxId: string;
  billingEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  kycStatus: KycStatus;
  kycDocuments: KycDocument[];
  users: CompanyUser[];
  creditLimit: number;
  maxActiveRentals: number;
  activeRentals: number;
  status: "Active" | "Inactive";
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
  daily1: number;
  daily3: number;
  daily5: number;
  weekly: number;
  monthly: number;
  yearly: number;
  rentToSell: number;
  deposit: number;
  addonCharger: number;
  addonChildSeat: number;
  addonInsurance: number;
}

export interface Transaction {
  id: string;
  bookingId: string;
  companyName: string;
  amount: number;
  type: "Deposit" | "Rental Fee" | "Late Fee" | "Deposit Refund" | "Deposit Forfeit";
  method: PaymentMethod;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  depositStatus?: "Held" | "Refunded" | "Forfeited";
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
  bookingId: string;
  companyName: string;
  amount: number;
  vat: number;
  total: number;
  status: "Draft" | "Sent" | "Paid";
  date: string;
}

export interface RentToSellEntry {
  carId: string;
  licensePlate: string;
  modelName: string;
  brandName: string;
  companyId: string;
  companyName: string;
  contractStart: string;
  totalPaid: number;
  buyoutAmount: number;
  conversionStatus: ConversionStatus;
  bookingId: string;
}

export interface ContractLine {
  modelId: string;
  modelName: string;
  bodyType?: string;
  brandName: string;
  assignedCars: { carId: string; licensePlate: string }[];
  baseRate: number;
}

export interface Contract {
  id: string;
  companyId: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contractType: ContractType;
  durationType: DurationType;
  startDate: string;
  endDate: string;
  pickupLocationId: string;
  pickupLocationName: string;
  returnLocationId: string;
  returnLocationName: string;
  lines: ContractLine[];
  addOns: AddOn;
  deposit: number;
  vat: number;
  total: number;
  status: BookingStatus;
  approvalSteps: ApprovalStep[];
  createdAt: string;
  extensionRequest?: ExtensionRequest;
  cancellationReason?: string;
}

export interface AppNotification {
  id: string;
  type: "approval" | "rejection" | "reminder" | "invoice" | "contract" | "conversion";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  bookingId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Manager";
  createdAt: string;
}

export interface RequestedModel {
  modelName: string;
  bodyType?: string;
  qty: number;
}

export interface RentRequest {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  requestedModels: RequestedModel[];
  startDate: string;
  endDate: string;
  contractType: "Rent-and-Return" | "Rent-to-Sell";
  durationType: "Daily" | "Weekly" | "Monthly" | "Yearly";
  notes?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  approvalSteps: ApprovalStep[];
}
