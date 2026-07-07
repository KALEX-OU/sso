// Tipi autogenerati da generate-db-schema.ts. NON MODIFICARE MANUALMENTE.

export interface Dashboard {
  orgName?: string;
  orgType?: string;
  onboardingStatus?: string;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  mobile?: string;
  locale: string;
  theme: string;
  metadata?: unknown;
  createdAt: string;
}

export interface Team {
  teamId: string;
  name: string;
  appId: string;
  description?: string;
  rbac?: unknown;
  metadata?: unknown;
  orgId: string;
  isTest: boolean;
  createdAt: string;
}

export interface Subscription {
  subscriptionId: string;
  buyerId: string;
  sellerId?: string;
  appId: string;
  status: string;
  items: unknown;
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  trialStart?: string;
  trialEnd?: string;
  expiresAt?: string;
  updatedAt: string;
  metadata?: unknown;
}

export interface Checkout {
  checkoutId: string;
  buyerId: string;
  sellerId?: string;
  appId: string;
  status: string;
  mode: string;
  items: unknown;
  amount: number;
  isTest: boolean;
  createdAt: string;
}

export interface Invoice {
  invoiceId: string;
  invoiceNumber?: string;
  buyerId: string;
  sellerId: string;
  appId: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl?: string;
  taxPercent?: number;
  taxAmount?: number;
  subtotal?: number;
  subscriptionId?: string;
  checkoutId?: string;
  lineItems?: unknown;
  dueDate?: string;
  paidAt?: string;
  metadata?: unknown;
  isTest: boolean;
  createdAt: string;
}

export interface Payment {
  paymentId: string;
  orgId: string;
  sellerOrgId?: string;
  invoiceId?: string;
  amount: number;
  status: string;
  currency: string;
  paymentMethodType?: string;
  cardBrand?: string;
  cardLast4?: string;
  receiptUrl?: string;
  stripeConnectAccountId?: string;
  applicationFeeAmount?: number;
  errorMessage?: string;
  appId: string;
  createdAt: string;
  metadata?: unknown;
}

export interface Compute {
  computeId: string;
  orgId: string;
  resourceType: string;
  usage: number;
  status: string;
  isTest: boolean;
  metadata?: unknown;
  createdAt: string;
}

export interface ProductConsume {
  consumeId: string;
  orgId: string;
  productId: string;
  quantity: number;
  status: string;
  isTest: boolean;
  metadata?: unknown;
  createdAt: string;
}

export interface Apikey {
  keyHash: string;
  orgId: string;
  name: string;
  description?: string;
  ipWhitelist: unknown;
  isActive: boolean;
  expiresAt?: string;
  isTest: boolean;
  appId: string;
  permissions?: unknown;
  userId?: string;
  thingId?: string;
  createdAt: string;
}

export interface Thing {
  thingId: string;
  orgId: string;
  appId: string;
  name: string;
  type: string;
  status: string;
  deviceTokenHash: string;
  metadata?: unknown;
  isTest: boolean;
  createdAt: string;
}

export interface Product {
  productId: string;
  orgId: string;
  appId: string;
  name: string;
  description?: string;
  mode: string;
  type: string;
  route: string;
  sku?: string;
  isActive: boolean;
  isTest: boolean;
  metadata?: unknown;
  variants?: unknown;
  bom?: unknown;
  relatedProducts?: unknown;
  options?: unknown;
  taxBehavior: string;
  aiSummary?: string;
  descriptionEmbedding?: unknown;
  createdAt: string;
  prices?: unknown;
  batches?: unknown;
  consumes?: unknown;
}

export interface Productprice {
  priceId: string;
  productId: string;
  amount: number;
  currency: string;
  type: string;
  billingScheme?: string;
  recurringInterval?: string;
  recurringUsageType?: string;
  tier?: string;
  isActive: boolean;
  isTest: boolean;
  taxBehavior?: string;
  metadata?: unknown;
  createdAt: string;
}

export interface Organization {
  orgId: string;
  name: string;
  type: string;
  country: string;
  viesValidated: boolean;
  vatNumber?: string;
  vatNumberHash?: string;
  fiscalCode?: string;
  billingAddress?: string;
  sdiCode?: string;
  officeCode?: string;
  cigCode?: string;
  cupCode?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  stripeCustomerId?: string;
  stripeConnectAccountId?: string;
  stripeConnectOnboarded?: boolean;
  isTest: boolean;
  confirmed: boolean;
  addressDetails?: unknown;
  metadata?: unknown;
  createdAt: string;
  apps?: unknown;
}

export interface UserOrganization {
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown;
  joinedAt: string;
}

export interface AuthCode {
  code: string;
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: string;
  createdAt: string;
}

export interface PreRegistration {
  email: string;
  type: string;
  companyName: string;
  isTest: boolean;
  country: string;
  vatNumber?: string;
  fiscalCode?: string;
  sdiCode?: string;
  officeCode?: string;
  cigCode?: string;
  cupCode?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  addressDetails?: unknown;
  metadata?: unknown;
  createdAt: string;
}

export interface ApiKeyPermission {
  keyHash: string;
  moduleId: string;
  canCreate: boolean;
  canRead: boolean;
  canList: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: string[];
}

export interface AuditLog {
  logId: string;
  timestamp: string;
  orgId: string;
  appId: string;
  userId: string;
  authType: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  userAgent?: string;
  responseCode: number;
  metadata?: unknown;
}

export interface ProductBatch {
  batchId: string;
  productId: string;
  batchNumber: string;
  expirationDate?: string;
  productionDate?: string;
  stockStatus: unknown;
  metadata?: unknown;
  isTest: boolean;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  teamId: string;
  joinedAt: string;
}
