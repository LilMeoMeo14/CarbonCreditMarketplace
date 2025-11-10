// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'EV_OWNER' | 'BUYER' | 'CVA' | 'ADMIN';
  phoneNumber?: string;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  batteryCapacity?: number;
  registrationNumber?: string;
}

// Carbon Credit Types
export interface CarbonCredit {
  id: string;
  ownerId: string;
  ownerName: string;
  amount: number;
  price: number;
  type: 'direct' | 'auction';
  status: 'published' | 'pending' | 'verified' | 'sold' | 'retired';
  vehicle: string;
  distance: string;
  region: string;
  createdAt: string;
  postedAt?: string;
  evidence: string[];
  projectInfo: ProjectInfo;
  verificationInfo: VerificationInfo;
  ledgerInfo: LedgerInfo;
  auctionEndTime?: string;
  currentBid?: number;
}

export interface ProjectInfo {
  title: string;
  quarter: string;
  vintage: string;
  evCount: number;
  totalDistance: string;
  description: string;
  communityDescription: string;
  availableCredits: number;
}

export interface VerificationInfo {
  standard: string;
  organization: string;
  certifications: string[];
  date: string;
  methodology: string;
  accreditation?: string;
  technicalReview?: string;
  sdgImpacts?: string[];
  auditors?: string;
  assuranceLevel?: string;
  additionalVerifiers?: string[];
}

export interface LedgerInfo {
  vintage: string;
  serialNumbers: string;
  projectId: string;
  status: string;
  registryUrl?: string;
  blockchainHash?: string;
  certificationDocs?: string[];
}

// Transaction Types
export interface Transaction {
  id: string;
  creditId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  pricePerCredit: number;
  totalPrice: number;
  platformFee: number;
  finalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  purchaseDate: string;
  certificateId?: string;
  type: 'direct' | 'auction';
}

// Issuance Request Types
export interface IssuanceRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  amount: number;
  vehicle: string;
  distance: string;
  electricityUsed: string;
  region: string;
  quarter: string;
  year: string;
  submittedAt: string;
  evidence: string[];
  status: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

// Cart Types
export interface CartItem {
  creditId: string;
  quantity: number;
  credit: CarbonCredit;
}

// Certificate Types
export interface Certificate {
  id: string;
  transactionId: string;
  buyerId: string;
  creditId: string;
  quantity: number;
  serialNumbers: string;
  issuedAt: string;
  status: 'active' | 'retired' | 'transferred';
}

// Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: any;
}
