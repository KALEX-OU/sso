import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddUserToOrganizationData {
  userOrganization_upsert: UserOrganizations_Key;
}

export interface AddUserToOrganizationVariables {
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface AddUserToTeamData {
  teamMember_upsert: TeamMembers_Key;
}

export interface AddUserToTeamVariables {
  userId: string;
  teamId: string;
}

export interface ApiKeyPermissions_Key {
  keyHash: string;
  moduleId: string;
  __typename?: 'ApiKeyPermissions_Key';
}

export interface ApiKeys_Key {
  keyHash: string;
  __typename?: 'ApiKeys_Key';
}

export interface AuditLogs_Key {
  logId: string;
  __typename?: 'AuditLogs_Key';
}

export interface AuthCodes_Key {
  code: string;
  __typename?: 'AuthCodes_Key';
}

export interface CheckVatNumberExistsData {
  organizations: ({
    orgId: string;
    name: string;
  } & Organizations_Key)[];
}

export interface CheckVatNumberExistsVariables {
  vatNumberHash: string;
}

export interface Checkouts_Key {
  checkoutId: string;
  __typename?: 'Checkouts_Key';
}

export interface Computes_Key {
  computeId: string;
  __typename?: 'Computes_Key';
}

export interface ConfirmOrganizationData {
  organization_update?: Organizations_Key | null;
}

export interface ConfirmOrganizationVariables {
  orgId: string;
  confirmed: boolean;
}

export interface CreateApiKeyData {
  apiKey_upsert: ApiKeys_Key;
}

export interface CreateApiKeyVariables {
  keyHash: string;
  userId?: string | null;
  thingId?: string | null;
  orgId: string;
  appId: string;
  name: string;
  description?: string | null;
  ipWhitelist: unknown;
  isActive?: boolean | null;
  expiresAt?: TimestampString | null;
  isTest?: boolean | null;
}

export interface CreateAuditLogData {
  auditLog_insert: AuditLogs_Key;
}

export interface CreateAuditLogVariables {
  orgId: string;
  appId?: string | null;
  userId: string;
  authType: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  userAgent?: string | null;
  responseCode: number;
  metadata?: unknown | null;
}

export interface CreateAuthCodeData {
  authCode_insert: AuthCodes_Key;
}

export interface CreateAuthCodeVariables {
  code: string;
  userId: string;
  clientId: string;
  redirectUri: string;
  expiresAt: TimestampString;
}

export interface CreateCheckoutData {
  checkout_upsert: Checkouts_Key;
}

export interface CreateCheckoutVariables {
  checkoutId: string;
  buyerId: string;
  sellerId?: string | null;
  appId: string;
  status: string;
  mode: string;
  items: unknown;
  amount: number;
  isTest?: boolean | null;
}

export interface CreateComputeData {
  compute_upsert: Computes_Key;
}

export interface CreateComputeVariables {
  computeId: string;
  orgId: string;
  resourceType: string;
  usage?: number | null;
  status?: string | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateInvoiceData {
  invoice_upsert: Invoices_Key;
}

export interface CreateInvoiceVariables {
  invoiceId: string;
  invoiceNumber?: string | null;
  buyerId: string;
  sellerId: string;
  appId: string;
  amount: number;
  currency?: string | null;
  status: string;
  pdfUrl?: string | null;
  taxPercent?: number | null;
  taxAmount?: number | null;
  subtotal?: number | null;
  subscriptionId?: string | null;
  checkoutId?: string | null;
  lineItems?: unknown | null;
  dueDate?: TimestampString | null;
  paidAt?: TimestampString | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateMemberWithUserData {
  user_upsert: Users_Key;
  userOrganization_upsert: UserOrganizations_Key;
}

export interface CreateMemberWithUserVariables {
  userId: string;
  email: string;
  fullName?: string | null;
  userMetadata?: unknown | null;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface CreateOrgWithOwnerData {
  organization_upsert: Organizations_Key;
  userOrganization_upsert: UserOrganizations_Key;
}

export interface CreateOrgWithOwnerVariables {
  orgId: string;
  name: string;
  stripeCustomerId?: string | null;
  type?: string | null;
  country?: string | null;
  vatNumber?: string | null;
  vatNumberHash?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  addressDetails?: unknown | null;
  confirmed?: boolean | null;
  viesValidated?: boolean | null;
  metadata?: unknown | null;
  ownerId: string;
  ownerRbac?: unknown | null;
}

export interface CreateOrganizationData {
  organization_upsert: Organizations_Key;
}

export interface CreateOrganizationDomainData {
  organizationDomain_insert: OrganizationDomains_Key;
}

export interface CreateOrganizationDomainVariables {
  domainId: string;
  orgId: string;
  domain: string;
  status?: string | null;
}

export interface CreateOrganizationVariables {
  orgId: string;
  name: string;
  stripeCustomerId?: string | null;
  type?: string | null;
  country?: string | null;
  vatNumber?: string | null;
  vatNumberHash?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  addressDetails?: unknown | null;
  confirmed?: boolean | null;
  viesValidated?: boolean | null;
  metadata?: unknown | null;
}

export interface CreatePaymentData {
  payment_upsert: Payments_Key;
}

export interface CreatePaymentVariables {
  paymentId: string;
  orgId: string;
  sellerOrgId?: string | null;
  invoiceId?: string | null;
  amount: number;
  currency?: string | null;
  status: string;
  paymentMethodType?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  receiptUrl?: string | null;
  stripeConnectAccountId?: string | null;
  applicationFeeAmount?: number | null;
  errorMessage?: string | null;
  metadata?: unknown | null;
  appId: string;
}

export interface CreatePriceData {
  price_upsert: Prices_Key;
}

export interface CreatePriceVariables {
  priceId: string;
  productId: string;
  amount: number;
  currency?: string | null;
  type: string;
  billingScheme?: string | null;
  recurringInterval?: string | null;
  recurringUsageType?: string | null;
  tier?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  taxBehavior?: string | null;
  metadata?: unknown | null;
}

export interface CreateProductBatchData {
  productBatch_insert: ProductBatches_Key;
}

export interface CreateProductBatchVariables {
  batchId: string;
  productId: string;
  batchNumber: string;
  expirationDate?: TimestampString | null;
  productionDate?: TimestampString | null;
  stockStatus: unknown;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateProductConsumeData {
  productConsume_upsert: ProductConsumes_Key;
}

export interface CreateProductConsumeVariables {
  consumeId: string;
  orgId: string;
  productId: string;
  quantity: number;
  status?: string | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateProductData {
  product_upsert: Products_Key;
}

export interface CreateProductVariables {
  productId: string;
  orgId: string;
  appId: string;
  name: string;
  description?: string | null;
  mode: string;
  type: string;
  route?: string | null;
  sku?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  metadata?: unknown | null;
  variants?: unknown | null;
  bom?: unknown | null;
  relatedProducts?: unknown | null;
  options?: unknown | null;
  taxBehavior?: string | null;
  aiSummary?: string | null;
  descriptionEmbedding?: unknown | null;
}

export interface CreateTeamData {
  team_upsert: Teams_Key;
}

export interface CreateTeamVariables {
  teamId: string;
  orgId: string;
  appId: string;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateThingData {
  thing_insert: Things_Key;
}

export interface CreateThingVariables {
  thingId: string;
  orgId: string;
  appId: string;
  name: string;
  type: string;
  status?: string | null;
  deviceTokenHash: string;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface DeleteApiKeyData {
  apiKey_delete?: ApiKeys_Key | null;
}

export interface DeleteApiKeyPermissionData {
  apiKeyPermission_delete?: ApiKeyPermissions_Key | null;
}

export interface DeleteApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
}

export interface DeleteApiKeyVariables {
  keyHash: string;
}

export interface DeleteAuditLogData {
  auditLog_delete?: AuditLogs_Key | null;
}

export interface DeleteAuditLogVariables {
  logId: string;
}

export interface DeleteAuthCodeData {
  authCode_delete?: AuthCodes_Key | null;
}

export interface DeleteAuthCodeVariables {
  code: string;
}

export interface DeleteCheckoutData {
  checkout_delete?: Checkouts_Key | null;
}

export interface DeleteCheckoutVariables {
  checkoutId: string;
}

export interface DeleteComputeData {
  compute_delete?: Computes_Key | null;
}

export interface DeleteComputeVariables {
  computeId: string;
}

export interface DeleteInvoiceData {
  invoice_delete?: Invoices_Key | null;
}

export interface DeleteInvoiceVariables {
  invoiceId: string;
}

export interface DeleteOrganizationData {
  organization_delete?: Organizations_Key | null;
}

export interface DeleteOrganizationDomainData {
  organizationDomain_delete?: OrganizationDomains_Key | null;
}

export interface DeleteOrganizationDomainVariables {
  domainId: string;
}

export interface DeleteOrganizationVariables {
  orgId: string;
}

export interface DeletePaymentData {
  payment_delete?: Payments_Key | null;
}

export interface DeletePaymentVariables {
  paymentId: string;
}

export interface DeletePreRegistrationData {
  preRegistration_delete?: PreRegistrations_Key | null;
}

export interface DeletePreRegistrationVariables {
  email: string;
}

export interface DeletePriceData {
  price_delete?: Prices_Key | null;
}

export interface DeletePriceVariables {
  priceId: string;
}

export interface DeleteProductBatchData {
  productBatch_delete?: ProductBatches_Key | null;
}

export interface DeleteProductBatchVariables {
  batchId: string;
}

export interface DeleteProductConsumeData {
  productConsume_delete?: ProductConsumes_Key | null;
}

export interface DeleteProductConsumeVariables {
  consumeId: string;
}

export interface DeleteProductData {
  product_delete?: Products_Key | null;
}

export interface DeleteProductVariables {
  productId: string;
}

export interface DeleteSubscriptionData {
  subscription_delete?: Subscriptions_Key | null;
}

export interface DeleteSubscriptionVariables {
  subscriptionId: string;
}

export interface DeleteTeamData {
  team_delete?: Teams_Key | null;
}

export interface DeleteTeamVariables {
  teamId: string;
}

export interface DeleteThingData {
  thing_delete?: Things_Key | null;
}

export interface DeleteThingVariables {
  thingId: string;
}

export interface DeleteUserData {
  user_delete?: Users_Key | null;
}

export interface DeleteUserOrganizationData {
  userOrganization_delete?: UserOrganizations_Key | null;
}

export interface DeleteUserOrganizationVariables {
  userId: string;
  orgId: string;
}

export interface DeleteUserVariables {
  userId: string;
}

export interface GetApiKeyData {
  apiKey?: {
    keyHash: string;
    user?: {
      userId: string;
      email: string;
      userOrganizations_on_user: ({
        role: string;
        organization: {
          orgId: string;
        } & Organizations_Key;
      })[];
    } & Users_Key;
    thing?: {
      thingId: string;
      name: string;
    } & Things_Key;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    ipWhitelist: unknown;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKeys_Key;
}

export interface GetApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
    canCreate: boolean;
    canRead: boolean;
    canList: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    allowedFields: unknown;
  } & ApiKeyPermissions_Key)[];
}

export interface GetApiKeyPermissionsVariables {
  keyHash: string;
}

export interface GetApiKeyVariables {
  keyHash: string;
}

export interface GetAuthCodeData {
  authCode?: {
    code: string;
    userId: string;
    clientId: string;
    redirectUri: string;
    expiresAt: TimestampString;
  } & AuthCodes_Key;
}

export interface GetAuthCodeVariables {
  code: string;
}

export interface GetCheckoutData {
  checkout?: {
    checkoutId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    status: string;
    mode: string;
    items: unknown;
    amount: number;
    isTest: boolean;
    createdAt: TimestampString;
  } & Checkouts_Key;
}

export interface GetCheckoutVariables {
  checkoutId: string;
}

export interface GetComputeData {
  compute?: {
    computeId: string;
    orgId: string;
    resourceType: string;
    usage: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Computes_Key;
}

export interface GetComputeVariables {
  computeId: string;
}

export interface GetInvoiceDetailsData {
  invoice?: {
    invoiceId: string;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    subscriptionId?: string | null;
    checkoutId?: string | null;
    lineItems?: unknown | null;
    createdAt: TimestampString;
    metadata?: unknown | null;
    isTest: boolean;
  } & Invoices_Key;
}

export interface GetInvoiceDetailsVariables {
  invoiceId: string;
}

export interface GetOrgMemberData {
  userOrganization?: {
    role: string;
    rbac?: unknown | null;
    joinedAt: TimestampString;
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
      metadata?: unknown | null;
      locale: string;
      teamMembers_on_user: ({
        team: {
          teamId: string;
          name: string;
        } & Teams_Key;
      })[];
    } & Users_Key;
  };
}

export interface GetOrgMemberVariables {
  orgId: string;
  userId: string;
}

export interface GetOrgOwnerData {
  userOrganizations: ({
    role: string;
    user: {
      userId: string;
      email: string;
      fullName: string;
      locale: string;
    } & Users_Key;
  })[];
}

export interface GetOrgOwnerVariables {
  orgId: string;
}

export interface GetOrganizationByStripeCustomerData {
  organizations: ({
    orgId: string;
    name: string;
    type: string;
    country: string;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
  } & Organizations_Key)[];
}

export interface GetOrganizationByStripeCustomerVariables {
  stripeCustomerId: string;
}

export interface GetOrganizationBySubdomainData {
  organizations: ({
    orgId: string;
    name: string;
    subdomain?: string | null;
    type: string;
    country: string;
  } & Organizations_Key)[];
}

export interface GetOrganizationBySubdomainVariables {
  subdomain: string;
}

export interface GetOrganizationDetailsData {
  organization?: {
    orgId: string;
    name: string;
    type: string;
    country: string;
    vatNumber?: string | null;
    fiscalCode?: string | null;
    billingAddress?: string | null;
    sdiCode?: string | null;
    officeCode?: string | null;
    cigCode?: string | null;
    cupCode?: string | null;
    isTest: boolean;
    viesValidated: boolean;
    address?: string | null;
    addressDetails?: unknown | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
    confirmed: boolean;
    metadata?: unknown | null;
    createdAt: TimestampString;
    subscriptions_on_buyer: ({
      subscriptionId: string;
      buyerId: string;
      sellerId?: string | null;
      appId: string;
      status: string;
      items: unknown;
      expiresAt?: TimestampString | null;
      updatedAt: TimestampString;
    } & Subscriptions_Key)[];
  } & Organizations_Key;
}

export interface GetOrganizationDetailsVariables {
  orgId: string;
}

export interface GetOrganizationDomainByDomainData {
  organizationDomains: ({
    domainId: string;
    orgId: string;
    domain: string;
    status: string;
    certName?: string | null;
    verifiedAt?: TimestampString | null;
    createdAt: TimestampString;
    organization: {
      orgId: string;
      name: string;
      subdomain?: string | null;
    } & Organizations_Key;
  } & OrganizationDomains_Key)[];
}

export interface GetOrganizationDomainByDomainVariables {
  domain: string;
}

export interface GetOrganizationDomainData {
  organizationDomain?: {
    domainId: string;
    orgId: string;
    domain: string;
    status: string;
    certName?: string | null;
    verifiedAt?: TimestampString | null;
    createdAt: TimestampString;
  } & OrganizationDomains_Key;
}

export interface GetOrganizationDomainVariables {
  domainId: string;
}

export interface GetPaymentData {
  payment?: {
    paymentId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key;
}

export interface GetPaymentVariables {
  paymentId: string;
}

export interface GetPreRegistrationData {
  preRegistration?: {
    email: string;
    type: string;
    companyName: string;
    country: string;
    vatNumber?: string | null;
    fiscalCode?: string | null;
    sdiCode?: string | null;
    officeCode?: string | null;
    cigCode?: string | null;
    cupCode?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    altitude?: number | null;
    addressDetails?: unknown | null;
    metadata?: unknown | null;
  } & PreRegistrations_Key;
}

export interface GetPreRegistrationVariables {
  email: string;
}

export interface GetPriceData {
  price?: {
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    billingScheme?: string | null;
    recurringInterval?: string | null;
    recurringUsageType?: string | null;
    tier?: string | null;
    isActive: boolean;
    isTest: boolean;
    taxBehavior?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Prices_Key;
}

export interface GetPriceVariables {
  priceId: string;
}

export interface GetProductBatchesByProductData {
  productBatches: ({
    batchId: string;
    batchNumber: string;
    expirationDate?: TimestampString | null;
    productionDate?: TimestampString | null;
    stockStatus: unknown;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductBatches_Key)[];
}

export interface GetProductBatchesByProductVariables {
  productId: string;
}

export interface GetProductConsumeData {
  productConsume?: {
    consumeId: string;
    orgId: string;
    productId: string;
    quantity: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductConsumes_Key;
}

export interface GetProductConsumeVariables {
  consumeId: string;
}

export interface GetProductDetailsData {
  product?: {
    productId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    createdAt: TimestampString;
  } & Products_Key;
}

export interface GetProductDetailsVariables {
  productId: string;
}

export interface GetSubscriptionData {
  subscription?: {
    subscriptionId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    status: string;
    items: unknown;
    cancelAtPeriodEnd?: boolean | null;
    currentPeriodStart?: TimestampString | null;
    currentPeriodEnd?: TimestampString | null;
    trialStart?: TimestampString | null;
    trialEnd?: TimestampString | null;
    metadata?: unknown | null;
    expiresAt?: TimestampString | null;
    updatedAt: TimestampString;
  } & Subscriptions_Key;
}

export interface GetSubscriptionVariables {
  subscriptionId: string;
}

export interface GetThingByTokenHashData {
  things: ({
    thingId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key)[];
}

export interface GetThingByTokenHashVariables {
  deviceTokenHash: string;
}

export interface GetThingData {
  thing?: {
    thingId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    type: string;
    status: string;
    deviceTokenHash: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key;
}

export interface GetThingVariables {
  thingId: string;
}

export interface GetUserClaimsContextData {
  user?: {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    mobile?: string | null;
    locale: string;
    theme: string;
    metadata?: unknown | null;
    teamMembers_on_user: ({
      team: {
        teamId: string;
        name: string;
        rbac?: unknown | null;
        organization: {
          orgId: string;
        } & Organizations_Key;
      } & Teams_Key;
    })[];
    userOrganizations_on_user: ({
      role: string;
      rbac?: unknown | null;
      organization: {
        orgId: string;
        name: string;
        type: string;
        confirmed: boolean;
        isTest: boolean;
        viesValidated: boolean;
        country: string;
        vatNumber?: string | null;
        fiscalCode?: string | null;
        billingAddress?: string | null;
        sdiCode?: string | null;
        officeCode?: string | null;
        cigCode?: string | null;
        cupCode?: string | null;
        stripeCustomerId?: string | null;
        stripeConnectAccountId?: string | null;
        stripeConnectOnboarded?: boolean | null;
        address?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        altitude?: number | null;
        addressDetails?: unknown | null;
        metadata?: unknown | null;
        apps?: unknown | null;
        createdAt: TimestampString;
        subscriptions_on_buyer: ({
          subscriptionId: string;
          buyerId: string;
          sellerId?: string | null;
          appId: string;
          status: string;
          items: unknown;
          expiresAt?: TimestampString | null;
          updatedAt: TimestampString;
        } & Subscriptions_Key)[];
      } & Organizations_Key;
    })[];
  } & Users_Key;
}

export interface GetUserClaimsContextVariables {
  userId: string;
}

export interface Invoices_Key {
  invoiceId: string;
  __typename?: 'Invoices_Key';
}

export interface ListAllApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
  } & ApiKeyPermissions_Key)[];
}

export interface ListAllApiKeysData {
  apiKeys: ({
    keyHash: string;
  } & ApiKeys_Key)[];
}

export interface ListAllAuditLogsData {
  auditLogs: ({
    logId: string;
    orgId: string;
    userId: string;
  } & AuditLogs_Key)[];
}

export interface ListAllAuthCodesData {
  authCodes: ({
    code: string;
  } & AuthCodes_Key)[];
}

export interface ListAllCheckoutsData {
  checkouts: ({
    checkoutId: string;
    buyerId: string;
    status: string;
    mode: string;
    amount: number;
  } & Checkouts_Key)[];
}

export interface ListAllInvoicesData {
  invoices: ({
    invoiceId: string;
    amount: number;
    status: string;
    appId: string;
  } & Invoices_Key)[];
}

export interface ListAllOrganizationsData {
  organizations: ({
    orgId: string;
    stripeCustomerId?: string | null;
  } & Organizations_Key)[];
}

export interface ListAllPreRegistrationsData {
  preRegistrations: ({
    email: string;
  } & PreRegistrations_Key)[];
}

export interface ListAllPricesData {
  prices: ({
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    isActive: boolean;
    tier?: string | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Prices_Key)[];
}

export interface ListAllPricesVariables {
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListAllProductBatchesData {
  productBatches: ({
    batchId: string;
    product: {
      productId: string;
      sku?: string | null;
    } & Products_Key;
    batchNumber: string;
    expirationDate?: TimestampString | null;
    productionDate?: TimestampString | null;
    stockStatus: unknown;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductBatches_Key)[];
}

export interface ListAllProductsData {
  products: ({
    productId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
    createdAt: TimestampString;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    productBatches_on_product: ({
      batchId: string;
      productId: string;
      batchNumber: string;
      expirationDate?: TimestampString | null;
      productionDate?: TimestampString | null;
      stockStatus: unknown;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductBatches_Key)[];
    productConsumes_on_product: ({
      consumeId: string;
      orgId: string;
      productId: string;
      quantity: number;
      status: string;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductConsumes_Key)[];
  } & Products_Key)[];
}

export interface ListAllProductsGlobalData {
  products: ({
    productId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
    createdAt: TimestampString;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    productBatches_on_product: ({
      batchId: string;
      productId: string;
      batchNumber: string;
      expirationDate?: TimestampString | null;
      productionDate?: TimestampString | null;
      stockStatus: unknown;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductBatches_Key)[];
    productConsumes_on_product: ({
      consumeId: string;
      orgId: string;
      productId: string;
      quantity: number;
      status: string;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductConsumes_Key)[];
  } & Products_Key)[];
}

export interface ListAllProductsGlobalVariables {
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListAllProductsVariables {
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListAllSubscriptionsData {
  subscriptions: ({
    subscriptionId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    status: string;
    items: unknown;
  } & Subscriptions_Key)[];
}

export interface ListAllTeamMembersData {
  teamMembers: ({
    user: {
      userId: string;
    } & Users_Key;
    team: {
      teamId: string;
    } & Teams_Key;
  })[];
}

export interface ListAllTeamsData {
  teams: ({
    teamId: string;
    name: string;
    description?: string | null;
    rbac?: unknown | null;
    metadata?: unknown | null;
    organization: {
      orgId: string;
    } & Organizations_Key;
  } & Teams_Key)[];
}

export interface ListAllThingsData {
  things: ({
    thingId: string;
  } & Things_Key)[];
}

export interface ListAllUserOrganizationsData {
  userOrganizations: ({
    user: {
      userId: string;
    } & Users_Key;
    organization: {
      orgId: string;
    } & Organizations_Key;
  })[];
}

export interface ListAllUsersData {
  users: ({
    userId: string;
    email: string;
  } & Users_Key)[];
}

export interface ListApiKeysByOrgData {
  apiKeys: ({
    keyHash: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    user?: {
      userId: string;
      email: string;
    } & Users_Key;
    appId: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKeys_Key)[];
}

export interface ListApiKeysByOrgVariables {
  orgId: string;
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListAuditLogsByOrgData {
  auditLogs: ({
    logId: string;
    appId: string;
  } & AuditLogs_Key)[];
}

export interface ListAuditLogsByOrgVariables {
  orgId: string;
  appId: string;
}

export interface ListCheckoutsByOrgData {
  checkouts: ({
    checkoutId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    status: string;
    mode: string;
    amount: number;
    isTest: boolean;
    createdAt: TimestampString;
  } & Checkouts_Key)[];
}

export interface ListCheckoutsByOrgVariables {
  buyerId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListComputesByOrgData {
  computes: ({
    computeId: string;
    orgId: string;
    resourceType: string;
    usage: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Computes_Key)[];
}

export interface ListComputesByOrgVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListInvoicesByOrgData {
  invoices: ({
    invoiceId: string;
    invoiceNumber?: string | null;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
  } & Invoices_Key)[];
}

export interface ListInvoicesByOrgVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListInvoicesBySellerData {
  invoices: ({
    invoiceId: string;
    invoiceNumber?: string | null;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
  } & Invoices_Key)[];
}

export interface ListInvoicesBySellerVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListMembersByOrgData {
  userOrganizations: ({
    role: string;
    rbac?: unknown | null;
    joinedAt: TimestampString;
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
      metadata?: unknown | null;
      locale: string;
      teamMembers_on_user: ({
        team: {
          teamId: string;
          name: string;
        } & Teams_Key;
      })[];
    } & Users_Key;
  })[];
}

export interface ListMembersByOrgVariables {
  orgId: string;
}

export interface ListOrganizationDomainsByOrgData {
  organizationDomains: ({
    domainId: string;
    orgId: string;
    domain: string;
    status: string;
    certName?: string | null;
    verifiedAt?: TimestampString | null;
    createdAt: TimestampString;
  } & OrganizationDomains_Key)[];
}

export interface ListOrganizationDomainsByOrgVariables {
  orgId: string;
}

export interface ListPaymentsByOrgData {
  payments: ({
    paymentId: string;
    appId: string;
    buyer: {
      orgId: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
    } & Organizations_Key;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key)[];
}

export interface ListPaymentsByOrgVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListPaymentsBySellerData {
  payments: ({
    paymentId: string;
    appId: string;
    buyer: {
      orgId: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
    } & Organizations_Key;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key)[];
}

export interface ListPaymentsBySellerVariables {
  sellerOrgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListPricesByProductData {
  prices: ({
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    isActive: boolean;
    tier?: string | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Prices_Key)[];
}

export interface ListPricesByProductVariables {
  productId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListProductConsumesByOrgData {
  productConsumes: ({
    consumeId: string;
    orgId: string;
    productId: string;
    quantity: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductConsumes_Key)[];
}

export interface ListProductConsumesByOrgVariables {
  orgId: string;
}

export interface ListTeamMembersData {
  teamMembers: ({
    joinedAt: TimestampString;
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
    } & Users_Key;
  })[];
}

export interface ListTeamMembersVariables {
  teamId: string;
}

export interface ListTeamsByOrgData {
  teams: ({
    teamId: string;
    appId: string;
    name: string;
    description?: string | null;
    rbac?: unknown | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Teams_Key)[];
}

export interface ListTeamsByOrgVariables {
  orgId: string;
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface ListThingsByOrgData {
  things: ({
    thingId: string;
    appId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key)[];
}

export interface ListThingsByOrgVariables {
  orgId: string;
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}

export interface MigrateInviteeMembershipData {
  userOrganization_delete?: UserOrganizations_Key | null;
  user_upsert: Users_Key;
  userOrganization_upsert: UserOrganizations_Key;
}

export interface MigrateInviteeMembershipVariables {
  tempUserId: string;
  orgId: string;
  realUserId: string;
  email: string;
  fullName?: string | null;
  userMetadata?: unknown | null;
  role: string;
  rbac?: unknown | null;
}

export interface OrganizationDomains_Key {
  domainId: string;
  __typename?: 'OrganizationDomains_Key';
}

export interface Organizations_Key {
  orgId: string;
  __typename?: 'Organizations_Key';
}

export interface Payments_Key {
  paymentId: string;
  __typename?: 'Payments_Key';
}

export interface PreRegistrations_Key {
  email: string;
  __typename?: 'PreRegistrations_Key';
}

export interface Prices_Key {
  priceId: string;
  __typename?: 'Prices_Key';
}

export interface ProductBatches_Key {
  batchId: string;
  __typename?: 'ProductBatches_Key';
}

export interface ProductConsumes_Key {
  consumeId: string;
  __typename?: 'ProductConsumes_Key';
}

export interface Products_Key {
  productId: string;
  __typename?: 'Products_Key';
}

export interface RemoveUserFromTeamData {
  teamMember_delete?: TeamMembers_Key | null;
}

export interface RemoveUserFromTeamVariables {
  userId: string;
  teamId: string;
}

export interface SetApiKeyPermissionData {
  apiKeyPermission_upsert: ApiKeyPermissions_Key;
}

export interface SetApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
  canCreate: boolean;
  canRead: boolean;
  canList: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: unknown;
}

export interface Subscriptions_Key {
  subscriptionId: string;
  __typename?: 'Subscriptions_Key';
}

export interface TeamMembers_Key {
  userId: string;
  teamId: string;
  __typename?: 'TeamMembers_Key';
}

export interface Teams_Key {
  teamId: string;
  __typename?: 'Teams_Key';
}

export interface Things_Key {
  thingId: string;
  __typename?: 'Things_Key';
}

export interface UpdateCheckoutData {
  checkout_update?: Checkouts_Key | null;
}

export interface UpdateCheckoutVariables {
  checkoutId: string;
  status: string;
}

export interface UpdateComputeData {
  compute_update?: Computes_Key | null;
}

export interface UpdateComputeVariables {
  computeId: string;
  usage?: number | null;
  status?: string | null;
  metadata?: unknown | null;
}

export interface UpdateInvoiceStatusData {
  invoice_update?: Invoices_Key | null;
}

export interface UpdateInvoiceStatusVariables {
  invoiceId: string;
  status: string;
  metadata?: unknown | null;
}

export interface UpdateOrganizationAppsData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationAppsVariables {
  orgId: string;
  apps?: unknown | null;
}

export interface UpdateOrganizationBillingData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationBillingVariables {
  orgId: string;
  type: string;
  name?: string | null;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  addressDetails?: unknown | null;
  metadata?: unknown | null;
}

export interface UpdateOrganizationDomainStatusData {
  organizationDomain_update?: OrganizationDomains_Key | null;
}

export interface UpdateOrganizationDomainStatusVariables {
  domainId: string;
  status?: string | null;
  certName?: string | null;
  verifiedAt?: TimestampString | null;
}

export interface UpdateOrganizationStripeConnectData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationStripeConnectVariables {
  orgId: string;
  stripeConnectAccountId?: string | null;
  stripeConnectOnboarded: boolean;
}

export interface UpdateOrganizationStripeCustomerData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationStripeCustomerVariables {
  orgId: string;
  stripeCustomerId?: string | null;
}

export interface UpdateOrganizationSubdomainData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationSubdomainVariables {
  orgId: string;
  subdomain?: string | null;
}

export interface UpdateOrganizationVatHashData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationVatHashVariables {
  orgId: string;
  vatNumberHash?: string | null;
}

export interface UpdateOrganizationViesData {
  organization_update?: Organizations_Key | null;
}

export interface UpdateOrganizationViesVariables {
  orgId: string;
  viesValidated: boolean;
}

export interface UpdatePaymentStatusData {
  payment_update?: Payments_Key | null;
}

export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  errorMessage?: string | null;
  metadata?: unknown | null;
}

export interface UpdatePriceData {
  price_update?: Prices_Key | null;
}

export interface UpdatePriceVariables {
  priceId: string;
  isActive?: boolean | null;
  metadata?: unknown | null;
}

export interface UpdateProductConsumeData {
  productConsume_update?: ProductConsumes_Key | null;
}

export interface UpdateProductConsumeVariables {
  consumeId: string;
  quantity?: number | null;
  status?: string | null;
  metadata?: unknown | null;
}

export interface UpdateSubscriptionStatusData {
  subscription_upsert: Subscriptions_Key;
}

export interface UpdateSubscriptionStatusVariables {
  subscriptionId: string;
  buyerId: string;
  sellerId?: string | null;
  appId: string;
  status: string;
  items: unknown;
  cancelAtPeriodEnd?: boolean | null;
  currentPeriodStart?: TimestampString | null;
  currentPeriodEnd?: TimestampString | null;
  trialStart?: TimestampString | null;
  trialEnd?: TimestampString | null;
  metadata?: unknown | null;
  expiresAt?: TimestampString | null;
}

export interface UpdateTeamData {
  team_update?: Teams_Key | null;
}

export interface UpdateTeamVariables {
  teamId: string;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
}

export interface UpdateThingData {
  thing_update?: Things_Key | null;
}

export interface UpdateThingVariables {
  thingId: string;
  name?: string | null;
  type?: string | null;
  status?: string | null;
  metadata?: unknown | null;
}

export interface UpdateUserMetadataData {
  user_update?: Users_Key | null;
}

export interface UpdateUserMetadataVariables {
  userId: string;
  metadata?: unknown | null;
}

export interface UpdateUserOrganizationData {
  userOrganization_update?: UserOrganizations_Key | null;
}

export interface UpdateUserOrganizationVariables {
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface UpdateUserProfileData {
  user_update?: Users_Key | null;
}

export interface UpdateUserProfileVariables {
  userId: string;
  fullName?: string | null;
  locale?: string | null;
  theme?: string | null;
  avatarUrl?: string | null;
  mobile?: string | null;
}

export interface UpsertPreRegistrationData {
  preRegistration_upsert: PreRegistrations_Key;
}

export interface UpsertPreRegistrationVariables {
  email: string;
  type: string;
  companyName: string;
  country?: string | null;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  addressDetails?: unknown | null;
  metadata?: unknown | null;
}

export interface UpsertUserData {
  user_upsert: Users_Key;
}

export interface UpsertUserVariables {
  userId: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  mobile?: string | null;
  locale?: string | null;
  theme?: string | null;
  metadata?: unknown | null;
}

export interface UserOrganizations_Key {
  userId: string;
  orgId: string;
  __typename?: 'UserOrganizations_Key';
}

export interface Users_Key {
  userId: string;
  __typename?: 'Users_Key';
}

/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUser(vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;

/** Generated Node Admin SDK operation action function for the 'CreateOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function createOrganization(dc: DataConnect, vars: CreateOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'CreateOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function createOrganization(vars: CreateOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'AddUserToOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function addUserToOrganization(dc: DataConnect, vars: AddUserToOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddUserToOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'AddUserToOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function addUserToOrganization(vars: AddUserToOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddUserToOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'CreateOrgWithOwner' Mutation. Allow users to execute without passing in DataConnect. */
export function createOrgWithOwner(dc: DataConnect, vars: CreateOrgWithOwnerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrgWithOwnerData>>;
/** Generated Node Admin SDK operation action function for the 'CreateOrgWithOwner' Mutation. Allow users to pass in custom DataConnect instances. */
export function createOrgWithOwner(vars: CreateOrgWithOwnerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrgWithOwnerData>>;

/** Generated Node Admin SDK operation action function for the 'CreateMemberWithUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createMemberWithUser(dc: DataConnect, vars: CreateMemberWithUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMemberWithUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMemberWithUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMemberWithUser(vars: CreateMemberWithUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMemberWithUserData>>;

/** Generated Node Admin SDK operation action function for the 'MigrateInviteeMembership' Mutation. Allow users to execute without passing in DataConnect. */
export function migrateInviteeMembership(dc: DataConnect, vars: MigrateInviteeMembershipVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MigrateInviteeMembershipData>>;
/** Generated Node Admin SDK operation action function for the 'MigrateInviteeMembership' Mutation. Allow users to pass in custom DataConnect instances. */
export function migrateInviteeMembership(vars: MigrateInviteeMembershipVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MigrateInviteeMembershipData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserOrganization(dc: DataConnect, vars: UpdateUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserOrganization(vars: UpdateUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateSubscriptionStatus(dc: DataConnect, vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateSubscriptionStatus(vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeConnect' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationStripeConnect(dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeConnectData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeConnect' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationStripeConnect(vars: UpdateOrganizationStripeConnectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeConnectData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeCustomer' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationStripeCustomer(dc: DataConnect, vars: UpdateOrganizationStripeCustomerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeCustomerData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeCustomer' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationStripeCustomer(vars: UpdateOrganizationStripeCustomerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeCustomerData>>;

/** Generated Node Admin SDK operation action function for the 'CreateAuthCode' Mutation. Allow users to execute without passing in DataConnect. */
export function createAuthCode(dc: DataConnect, vars: CreateAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAuthCodeData>>;
/** Generated Node Admin SDK operation action function for the 'CreateAuthCode' Mutation. Allow users to pass in custom DataConnect instances. */
export function createAuthCode(vars: CreateAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAuthCodeData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAuthCode' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAuthCode(dc: DataConnect, vars: DeleteAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuthCodeData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAuthCode' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAuthCode(vars: DeleteAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuthCodeData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserProfile(vars: UpdateUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserMetadata' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserMetadata(dc: DataConnect, vars: UpdateUserMetadataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserMetadataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserMetadata' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserMetadata(vars: UpdateUserMetadataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserMetadataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationBilling' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationBilling(dc: DataConnect, vars: UpdateOrganizationBillingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationBillingData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationBilling' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationBilling(vars: UpdateOrganizationBillingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationBillingData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationVies' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationVies(dc: DataConnect, vars: UpdateOrganizationViesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationViesData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationVies' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationVies(vars: UpdateOrganizationViesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationViesData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationApps' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationApps(dc: DataConnect, vars: UpdateOrganizationAppsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationAppsData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationApps' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationApps(vars: UpdateOrganizationAppsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationAppsData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertPreRegistration' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertPreRegistration(dc: DataConnect, vars: UpsertPreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPreRegistrationData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertPreRegistration' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertPreRegistration(vars: UpsertPreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPreRegistrationData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePreRegistration' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePreRegistration(dc: DataConnect, vars: DeletePreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePreRegistrationData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePreRegistration' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePreRegistration(vars: DeletePreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePreRegistrationData>>;

/** Generated Node Admin SDK operation action function for the 'ConfirmOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function confirmOrganization(dc: DataConnect, vars: ConfirmOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ConfirmOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'ConfirmOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function confirmOrganization(vars: ConfirmOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ConfirmOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(vars: DeleteUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationVatHash' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationVatHash(dc: DataConnect, vars: UpdateOrganizationVatHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationVatHashData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationVatHash' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationVatHash(vars: UpdateOrganizationVatHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationVatHashData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteOrganization(dc: DataConnect, vars: DeleteOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteOrganization(vars: DeleteOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUserOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUserOrganization(dc: DataConnect, vars: DeleteUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUserOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUserOrganization(vars: DeleteUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteSubscription' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteSubscription(dc: DataConnect, vars: DeleteSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSubscriptionData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteSubscription' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteSubscription(vars: DeleteSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSubscriptionData>>;

/** Generated Node Admin SDK operation action function for the 'CreateApiKey' Mutation. Allow users to execute without passing in DataConnect. */
export function createApiKey(dc: DataConnect, vars: CreateApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateApiKeyData>>;
/** Generated Node Admin SDK operation action function for the 'CreateApiKey' Mutation. Allow users to pass in custom DataConnect instances. */
export function createApiKey(vars: CreateApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateApiKeyData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteApiKey' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteApiKey(dc: DataConnect, vars: DeleteApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteApiKey' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteApiKey(vars: DeleteApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyData>>;

/** Generated Node Admin SDK operation action function for the 'SetApiKeyPermission' Mutation. Allow users to execute without passing in DataConnect. */
export function setApiKeyPermission(dc: DataConnect, vars: SetApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SetApiKeyPermissionData>>;
/** Generated Node Admin SDK operation action function for the 'SetApiKeyPermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function setApiKeyPermission(vars: SetApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SetApiKeyPermissionData>>;

/** Generated Node Admin SDK operation action function for the 'CreateThing' Mutation. Allow users to execute without passing in DataConnect. */
export function createThing(dc: DataConnect, vars: CreateThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateThingData>>;
/** Generated Node Admin SDK operation action function for the 'CreateThing' Mutation. Allow users to pass in custom DataConnect instances. */
export function createThing(vars: CreateThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateThingData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateThing' Mutation. Allow users to execute without passing in DataConnect. */
export function updateThing(dc: DataConnect, vars: UpdateThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateThingData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateThing' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateThing(vars: UpdateThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateThingData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteThing' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteThing(dc: DataConnect, vars: DeleteThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteThingData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteThing' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteThing(vars: DeleteThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteThingData>>;

/** Generated Node Admin SDK operation action function for the 'CreateAuditLog' Mutation. Allow users to execute without passing in DataConnect. */
export function createAuditLog(dc: DataConnect, vars: CreateAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAuditLogData>>;
/** Generated Node Admin SDK operation action function for the 'CreateAuditLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function createAuditLog(vars: CreateAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAuditLogData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteApiKeyPermission' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteApiKeyPermission(dc: DataConnect, vars: DeleteApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyPermissionData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteApiKeyPermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteApiKeyPermission(vars: DeleteApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyPermissionData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAuditLog' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAuditLog(dc: DataConnect, vars: DeleteAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditLogData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAuditLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAuditLog(vars: DeleteAuditLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAuditLogData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function createProduct(dc: DataConnect, vars: CreateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProduct(vars: CreateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProduct(vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProductBatch' Mutation. Allow users to execute without passing in DataConnect. */
export function createProductBatch(dc: DataConnect, vars: CreateProductBatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductBatchData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProductBatch' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProductBatch(vars: CreateProductBatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductBatchData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProductBatch' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProductBatch(dc: DataConnect, vars: DeleteProductBatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductBatchData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProductBatch' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProductBatch(vars: DeleteProductBatchVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductBatchData>>;

/** Generated Node Admin SDK operation action function for the 'CreateInvoice' Mutation. Allow users to execute without passing in DataConnect. */
export function createInvoice(dc: DataConnect, vars: CreateInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInvoiceData>>;
/** Generated Node Admin SDK operation action function for the 'CreateInvoice' Mutation. Allow users to pass in custom DataConnect instances. */
export function createInvoice(vars: CreateInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInvoiceData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateInvoiceStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInvoiceStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateInvoiceStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateInvoiceStatus(vars: UpdateInvoiceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInvoiceStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteInvoice' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteInvoice(dc: DataConnect, vars: DeleteInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteInvoiceData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteInvoice' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteInvoice(vars: DeleteInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteInvoiceData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePayment' Mutation. Allow users to execute without passing in DataConnect. */
export function createPayment(dc: DataConnect, vars: CreatePaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePaymentData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePayment' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPayment(vars: CreatePaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePaymentData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePaymentStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePaymentStatus(dc: DataConnect, vars: UpdatePaymentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePaymentStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePaymentStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePaymentStatus(vars: UpdatePaymentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePaymentStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePayment' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePayment(dc: DataConnect, vars: DeletePaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePaymentData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePayment' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePayment(vars: DeletePaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePaymentData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTeam' Mutation. Allow users to execute without passing in DataConnect. */
export function createTeam(dc: DataConnect, vars: CreateTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTeamData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTeam' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTeam(vars: CreateTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTeamData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTeam' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTeam(dc: DataConnect, vars: UpdateTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTeamData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTeam' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTeam(vars: UpdateTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTeamData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTeam' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTeam(dc: DataConnect, vars: DeleteTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTeamData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTeam' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTeam(vars: DeleteTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTeamData>>;

/** Generated Node Admin SDK operation action function for the 'AddUserToTeam' Mutation. Allow users to execute without passing in DataConnect. */
export function addUserToTeam(dc: DataConnect, vars: AddUserToTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddUserToTeamData>>;
/** Generated Node Admin SDK operation action function for the 'AddUserToTeam' Mutation. Allow users to pass in custom DataConnect instances. */
export function addUserToTeam(vars: AddUserToTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddUserToTeamData>>;

/** Generated Node Admin SDK operation action function for the 'RemoveUserFromTeam' Mutation. Allow users to execute without passing in DataConnect. */
export function removeUserFromTeam(dc: DataConnect, vars: RemoveUserFromTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveUserFromTeamData>>;
/** Generated Node Admin SDK operation action function for the 'RemoveUserFromTeam' Mutation. Allow users to pass in custom DataConnect instances. */
export function removeUserFromTeam(vars: RemoveUserFromTeamVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveUserFromTeamData>>;

/** Generated Node Admin SDK operation action function for the 'CreateCompute' Mutation. Allow users to execute without passing in DataConnect. */
export function createCompute(dc: DataConnect, vars: CreateComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateComputeData>>;
/** Generated Node Admin SDK operation action function for the 'CreateCompute' Mutation. Allow users to pass in custom DataConnect instances. */
export function createCompute(vars: CreateComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateComputeData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCompute' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCompute(dc: DataConnect, vars: UpdateComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateComputeData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCompute' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCompute(vars: UpdateComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateComputeData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCompute' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCompute(dc: DataConnect, vars: DeleteComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteComputeData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCompute' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCompute(vars: DeleteComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteComputeData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePrice' Mutation. Allow users to execute without passing in DataConnect. */
export function createPrice(dc: DataConnect, vars: CreatePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePriceData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePrice' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPrice(vars: CreatePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePriceData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePrice' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePrice(dc: DataConnect, vars: UpdatePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePriceData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePrice' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePrice(vars: UpdatePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePriceData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePrice' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePrice(dc: DataConnect, vars: DeletePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePriceData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePrice' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePrice(vars: DeletePriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePriceData>>;

/** Generated Node Admin SDK operation action function for the 'CreateCheckout' Mutation. Allow users to execute without passing in DataConnect. */
export function createCheckout(dc: DataConnect, vars: CreateCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCheckoutData>>;
/** Generated Node Admin SDK operation action function for the 'CreateCheckout' Mutation. Allow users to pass in custom DataConnect instances. */
export function createCheckout(vars: CreateCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCheckoutData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCheckout' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCheckout(dc: DataConnect, vars: UpdateCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCheckoutData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCheckout' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCheckout(vars: UpdateCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCheckoutData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCheckout' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCheckout(dc: DataConnect, vars: DeleteCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCheckoutData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCheckout' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCheckout(vars: DeleteCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCheckoutData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProductConsume' Mutation. Allow users to execute without passing in DataConnect. */
export function createProductConsume(dc: DataConnect, vars: CreateProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductConsumeData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProductConsume' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProductConsume(vars: CreateProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductConsumeData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProductConsume' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProductConsume(dc: DataConnect, vars: UpdateProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductConsumeData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProductConsume' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProductConsume(vars: UpdateProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductConsumeData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProductConsume' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProductConsume(dc: DataConnect, vars: DeleteProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductConsumeData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProductConsume' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProductConsume(vars: DeleteProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductConsumeData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationSubdomain' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationSubdomain(dc: DataConnect, vars: UpdateOrganizationSubdomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationSubdomainData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationSubdomain' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationSubdomain(vars: UpdateOrganizationSubdomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationSubdomainData>>;

/** Generated Node Admin SDK operation action function for the 'CreateOrganizationDomain' Mutation. Allow users to execute without passing in DataConnect. */
export function createOrganizationDomain(dc: DataConnect, vars: CreateOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrganizationDomainData>>;
/** Generated Node Admin SDK operation action function for the 'CreateOrganizationDomain' Mutation. Allow users to pass in custom DataConnect instances. */
export function createOrganizationDomain(vars: CreateOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrganizationDomainData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationDomainStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationDomainStatus(dc: DataConnect, vars: UpdateOrganizationDomainStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationDomainStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationDomainStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationDomainStatus(vars: UpdateOrganizationDomainStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationDomainStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteOrganizationDomain' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteOrganizationDomain(dc: DataConnect, vars: DeleteOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationDomainData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteOrganizationDomain' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteOrganizationDomain(vars: DeleteOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationDomainData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserClaimsContext' Query. Allow users to execute without passing in DataConnect. */
export function getUserClaimsContext(dc: DataConnect, vars: GetUserClaimsContextVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserClaimsContextData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserClaimsContext' Query. Allow users to pass in custom DataConnect instances. */
export function getUserClaimsContext(vars: GetUserClaimsContextVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserClaimsContextData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrganizationDetails' Query. Allow users to execute without passing in DataConnect. */
export function getOrganizationDetails(dc: DataConnect, vars: GetOrganizationDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrganizationDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getOrganizationDetails(vars: GetOrganizationDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDetailsData>>;

/** Generated Node Admin SDK operation action function for the 'GetAuthCode' Query. Allow users to execute without passing in DataConnect. */
export function getAuthCode(dc: DataConnect, vars: GetAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAuthCodeData>>;
/** Generated Node Admin SDK operation action function for the 'GetAuthCode' Query. Allow users to pass in custom DataConnect instances. */
export function getAuthCode(vars: GetAuthCodeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAuthCodeData>>;

/** Generated Node Admin SDK operation action function for the 'GetPreRegistration' Query. Allow users to execute without passing in DataConnect. */
export function getPreRegistration(dc: DataConnect, vars: GetPreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPreRegistrationData>>;
/** Generated Node Admin SDK operation action function for the 'GetPreRegistration' Query. Allow users to pass in custom DataConnect instances. */
export function getPreRegistration(vars: GetPreRegistrationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPreRegistrationData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllPreRegistrations' Query. Allow users to execute without passing in DataConnect. */
export function listAllPreRegistrations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllPreRegistrationsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllPreRegistrations' Query. Allow users to pass in custom DataConnect instances. */
export function listAllPreRegistrations(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllPreRegistrationsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to execute without passing in DataConnect. */
export function listAllUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listAllUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUsersData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllOrganizations' Query. Allow users to execute without passing in DataConnect. */
export function listAllOrganizations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllOrganizationsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllOrganizations' Query. Allow users to pass in custom DataConnect instances. */
export function listAllOrganizations(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllOrganizationsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllUserOrganizations' Query. Allow users to execute without passing in DataConnect. */
export function listAllUserOrganizations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUserOrganizationsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllUserOrganizations' Query. Allow users to pass in custom DataConnect instances. */
export function listAllUserOrganizations(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllUserOrganizationsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllSubscriptions' Query. Allow users to execute without passing in DataConnect. */
export function listAllSubscriptions(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllSubscriptionsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllSubscriptions' Query. Allow users to pass in custom DataConnect instances. */
export function listAllSubscriptions(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllSubscriptionsData>>;

/** Generated Node Admin SDK operation action function for the 'GetSubscription' Query. Allow users to execute without passing in DataConnect. */
export function getSubscription(dc: DataConnect, vars: GetSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSubscriptionData>>;
/** Generated Node Admin SDK operation action function for the 'GetSubscription' Query. Allow users to pass in custom DataConnect instances. */
export function getSubscription(vars: GetSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSubscriptionData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllAuthCodes' Query. Allow users to execute without passing in DataConnect. */
export function listAllAuthCodes(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllAuthCodesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllAuthCodes' Query. Allow users to pass in custom DataConnect instances. */
export function listAllAuthCodes(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllAuthCodesData>>;

/** Generated Node Admin SDK operation action function for the 'GetApiKey' Query. Allow users to execute without passing in DataConnect. */
export function getApiKey(dc: DataConnect, vars: GetApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetApiKeyData>>;
/** Generated Node Admin SDK operation action function for the 'GetApiKey' Query. Allow users to pass in custom DataConnect instances. */
export function getApiKey(vars: GetApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetApiKeyData>>;

/** Generated Node Admin SDK operation action function for the 'GetApiKeyPermissions' Query. Allow users to execute without passing in DataConnect. */
export function getApiKeyPermissions(dc: DataConnect, vars: GetApiKeyPermissionsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetApiKeyPermissionsData>>;
/** Generated Node Admin SDK operation action function for the 'GetApiKeyPermissions' Query. Allow users to pass in custom DataConnect instances. */
export function getApiKeyPermissions(vars: GetApiKeyPermissionsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetApiKeyPermissionsData>>;

/** Generated Node Admin SDK operation action function for the 'GetThing' Query. Allow users to execute without passing in DataConnect. */
export function getThing(dc: DataConnect, vars: GetThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetThingData>>;
/** Generated Node Admin SDK operation action function for the 'GetThing' Query. Allow users to pass in custom DataConnect instances. */
export function getThing(vars: GetThingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetThingData>>;

/** Generated Node Admin SDK operation action function for the 'GetThingByTokenHash' Query. Allow users to execute without passing in DataConnect. */
export function getThingByTokenHash(dc: DataConnect, vars: GetThingByTokenHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetThingByTokenHashData>>;
/** Generated Node Admin SDK operation action function for the 'GetThingByTokenHash' Query. Allow users to pass in custom DataConnect instances. */
export function getThingByTokenHash(vars: GetThingByTokenHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetThingByTokenHashData>>;

/** Generated Node Admin SDK operation action function for the 'ListThingsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listThingsByOrg(dc: DataConnect, vars: ListThingsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListThingsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListThingsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listThingsByOrg(vars: ListThingsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListThingsByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListApiKeysByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listApiKeysByOrg(dc: DataConnect, vars: ListApiKeysByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListApiKeysByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListApiKeysByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listApiKeysByOrg(vars: ListApiKeysByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListApiKeysByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListMembersByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listMembersByOrg(dc: DataConnect, vars: ListMembersByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMembersByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListMembersByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listMembersByOrg(vars: ListMembersByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMembersByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrgMember' Query. Allow users to execute without passing in DataConnect. */
export function getOrgMember(dc: DataConnect, vars: GetOrgMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrgMemberData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrgMember' Query. Allow users to pass in custom DataConnect instances. */
export function getOrgMember(vars: GetOrgMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrgMemberData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrgOwner' Query. Allow users to execute without passing in DataConnect. */
export function getOrgOwner(dc: DataConnect, vars: GetOrgOwnerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrgOwnerData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrgOwner' Query. Allow users to pass in custom DataConnect instances. */
export function getOrgOwner(vars: GetOrgOwnerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrgOwnerData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllThings' Query. Allow users to execute without passing in DataConnect. */
export function listAllThings(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllThingsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllThings' Query. Allow users to pass in custom DataConnect instances. */
export function listAllThings(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllThingsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllApiKeys' Query. Allow users to execute without passing in DataConnect. */
export function listAllApiKeys(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllApiKeysData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllApiKeys' Query. Allow users to pass in custom DataConnect instances. */
export function listAllApiKeys(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllApiKeysData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllApiKeyPermissions' Query. Allow users to execute without passing in DataConnect. */
export function listAllApiKeyPermissions(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllApiKeyPermissionsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllApiKeyPermissions' Query. Allow users to pass in custom DataConnect instances. */
export function listAllApiKeyPermissions(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllApiKeyPermissionsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllAuditLogs' Query. Allow users to execute without passing in DataConnect. */
export function listAllAuditLogs(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllAuditLogsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllAuditLogs' Query. Allow users to pass in custom DataConnect instances. */
export function listAllAuditLogs(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllAuditLogsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllProducts' Query. Allow users to execute without passing in DataConnect. */
export function listAllProducts(dc: DataConnect, vars: ListAllProductsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllProducts' Query. Allow users to pass in custom DataConnect instances. */
export function listAllProducts(vars: ListAllProductsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllProductsGlobal' Query. Allow users to execute without passing in DataConnect. */
export function listAllProductsGlobal(dc: DataConnect, vars?: ListAllProductsGlobalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsGlobalData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllProductsGlobal' Query. Allow users to pass in custom DataConnect instances. */
export function listAllProductsGlobal(vars?: ListAllProductsGlobalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsGlobalData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllProductBatches' Query. Allow users to execute without passing in DataConnect. */
export function listAllProductBatches(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductBatchesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllProductBatches' Query. Allow users to pass in custom DataConnect instances. */
export function listAllProductBatches(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductBatchesData>>;

/** Generated Node Admin SDK operation action function for the 'GetProductBatchesByProduct' Query. Allow users to execute without passing in DataConnect. */
export function getProductBatchesByProduct(dc: DataConnect, vars: GetProductBatchesByProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductBatchesByProductData>>;
/** Generated Node Admin SDK operation action function for the 'GetProductBatchesByProduct' Query. Allow users to pass in custom DataConnect instances. */
export function getProductBatchesByProduct(vars: GetProductBatchesByProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductBatchesByProductData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllInvoices' Query. Allow users to execute without passing in DataConnect. */
export function listAllInvoices(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllInvoicesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllInvoices' Query. Allow users to pass in custom DataConnect instances. */
export function listAllInvoices(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllInvoicesData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllTeams' Query. Allow users to execute without passing in DataConnect. */
export function listAllTeams(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTeamsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllTeams' Query. Allow users to pass in custom DataConnect instances. */
export function listAllTeams(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTeamsData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllTeamMembers' Query. Allow users to execute without passing in DataConnect. */
export function listAllTeamMembers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTeamMembersData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllTeamMembers' Query. Allow users to pass in custom DataConnect instances. */
export function listAllTeamMembers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTeamMembersData>>;

/** Generated Node Admin SDK operation action function for the 'ListInvoicesByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listInvoicesByOrg(dc: DataConnect, vars: ListInvoicesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListInvoicesByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listInvoicesByOrg(vars: ListInvoicesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListInvoicesBySeller' Query. Allow users to execute without passing in DataConnect. */
export function listInvoicesBySeller(dc: DataConnect, vars: ListInvoicesBySellerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesBySellerData>>;
/** Generated Node Admin SDK operation action function for the 'ListInvoicesBySeller' Query. Allow users to pass in custom DataConnect instances. */
export function listInvoicesBySeller(vars: ListInvoicesBySellerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesBySellerData>>;

/** Generated Node Admin SDK operation action function for the 'ListPaymentsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listPaymentsByOrg(dc: DataConnect, vars: ListPaymentsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPaymentsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListPaymentsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listPaymentsByOrg(vars: ListPaymentsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPaymentsByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListPaymentsBySeller' Query. Allow users to execute without passing in DataConnect. */
export function listPaymentsBySeller(dc: DataConnect, vars: ListPaymentsBySellerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPaymentsBySellerData>>;
/** Generated Node Admin SDK operation action function for the 'ListPaymentsBySeller' Query. Allow users to pass in custom DataConnect instances. */
export function listPaymentsBySeller(vars: ListPaymentsBySellerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPaymentsBySellerData>>;

/** Generated Node Admin SDK operation action function for the 'GetInvoiceDetails' Query. Allow users to execute without passing in DataConnect. */
export function getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInvoiceDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetInvoiceDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getInvoiceDetails(vars: GetInvoiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInvoiceDetailsData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrganizationByStripeCustomer' Query. Allow users to execute without passing in DataConnect. */
export function getOrganizationByStripeCustomer(dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationByStripeCustomerData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrganizationByStripeCustomer' Query. Allow users to pass in custom DataConnect instances. */
export function getOrganizationByStripeCustomer(vars: GetOrganizationByStripeCustomerVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationByStripeCustomerData>>;

/** Generated Node Admin SDK operation action function for the 'ListTeamsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listTeamsByOrg(dc: DataConnect, vars: ListTeamsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTeamsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListTeamsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listTeamsByOrg(vars: ListTeamsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTeamsByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListTeamMembers' Query. Allow users to execute without passing in DataConnect. */
export function listTeamMembers(dc: DataConnect, vars: ListTeamMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTeamMembersData>>;
/** Generated Node Admin SDK operation action function for the 'ListTeamMembers' Query. Allow users to pass in custom DataConnect instances. */
export function listTeamMembers(vars: ListTeamMembersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTeamMembersData>>;

/** Generated Node Admin SDK operation action function for the 'ListAuditLogsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listAuditLogsByOrg(dc: DataConnect, vars: ListAuditLogsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAuditLogsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListAuditLogsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listAuditLogsByOrg(vars: ListAuditLogsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAuditLogsByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'CheckVatNumberExists' Query. Allow users to execute without passing in DataConnect. */
export function checkVatNumberExists(dc: DataConnect, vars: CheckVatNumberExistsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckVatNumberExistsData>>;
/** Generated Node Admin SDK operation action function for the 'CheckVatNumberExists' Query. Allow users to pass in custom DataConnect instances. */
export function checkVatNumberExists(vars: CheckVatNumberExistsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CheckVatNumberExistsData>>;

/** Generated Node Admin SDK operation action function for the 'GetCompute' Query. Allow users to execute without passing in DataConnect. */
export function getCompute(dc: DataConnect, vars: GetComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetComputeData>>;
/** Generated Node Admin SDK operation action function for the 'GetCompute' Query. Allow users to pass in custom DataConnect instances. */
export function getCompute(vars: GetComputeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetComputeData>>;

/** Generated Node Admin SDK operation action function for the 'ListComputesByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listComputesByOrg(dc: DataConnect, vars: ListComputesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListComputesByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListComputesByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listComputesByOrg(vars: ListComputesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListComputesByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'GetProductConsume' Query. Allow users to execute without passing in DataConnect. */
export function getProductConsume(dc: DataConnect, vars: GetProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductConsumeData>>;
/** Generated Node Admin SDK operation action function for the 'GetProductConsume' Query. Allow users to pass in custom DataConnect instances. */
export function getProductConsume(vars: GetProductConsumeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductConsumeData>>;

/** Generated Node Admin SDK operation action function for the 'ListProductConsumesByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listProductConsumesByOrg(dc: DataConnect, vars: ListProductConsumesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductConsumesByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListProductConsumesByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listProductConsumesByOrg(vars: ListProductConsumesByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductConsumesByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'GetPrice' Query. Allow users to execute without passing in DataConnect. */
export function getPrice(dc: DataConnect, vars: GetPriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPriceData>>;
/** Generated Node Admin SDK operation action function for the 'GetPrice' Query. Allow users to pass in custom DataConnect instances. */
export function getPrice(vars: GetPriceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPriceData>>;

/** Generated Node Admin SDK operation action function for the 'ListPricesByProduct' Query. Allow users to execute without passing in DataConnect. */
export function listPricesByProduct(dc: DataConnect, vars: ListPricesByProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPricesByProductData>>;
/** Generated Node Admin SDK operation action function for the 'ListPricesByProduct' Query. Allow users to pass in custom DataConnect instances. */
export function listPricesByProduct(vars: ListPricesByProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPricesByProductData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllPrices' Query. Allow users to execute without passing in DataConnect. */
export function listAllPrices(dc: DataConnect, vars?: ListAllPricesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllPricesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllPrices' Query. Allow users to pass in custom DataConnect instances. */
export function listAllPrices(vars?: ListAllPricesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllPricesData>>;

/** Generated Node Admin SDK operation action function for the 'GetCheckout' Query. Allow users to execute without passing in DataConnect. */
export function getCheckout(dc: DataConnect, vars: GetCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCheckoutData>>;
/** Generated Node Admin SDK operation action function for the 'GetCheckout' Query. Allow users to pass in custom DataConnect instances. */
export function getCheckout(vars: GetCheckoutVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCheckoutData>>;

/** Generated Node Admin SDK operation action function for the 'ListCheckoutsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listCheckoutsByOrg(dc: DataConnect, vars: ListCheckoutsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCheckoutsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListCheckoutsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listCheckoutsByOrg(vars: ListCheckoutsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCheckoutsByOrgData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllCheckouts' Query. Allow users to execute without passing in DataConnect. */
export function listAllCheckouts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCheckoutsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllCheckouts' Query. Allow users to pass in custom DataConnect instances. */
export function listAllCheckouts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCheckoutsData>>;

/** Generated Node Admin SDK operation action function for the 'GetPayment' Query. Allow users to execute without passing in DataConnect. */
export function getPayment(dc: DataConnect, vars: GetPaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPaymentData>>;
/** Generated Node Admin SDK operation action function for the 'GetPayment' Query. Allow users to pass in custom DataConnect instances. */
export function getPayment(vars: GetPaymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPaymentData>>;

/** Generated Node Admin SDK operation action function for the 'GetProductDetails' Query. Allow users to execute without passing in DataConnect. */
export function getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetProductDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getProductDetails(vars: GetProductDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductDetailsData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrganizationBySubdomain' Query. Allow users to execute without passing in DataConnect. */
export function getOrganizationBySubdomain(dc: DataConnect, vars: GetOrganizationBySubdomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationBySubdomainData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrganizationBySubdomain' Query. Allow users to pass in custom DataConnect instances. */
export function getOrganizationBySubdomain(vars: GetOrganizationBySubdomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationBySubdomainData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrganizationDomainByDomain' Query. Allow users to execute without passing in DataConnect. */
export function getOrganizationDomainByDomain(dc: DataConnect, vars: GetOrganizationDomainByDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDomainByDomainData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrganizationDomainByDomain' Query. Allow users to pass in custom DataConnect instances. */
export function getOrganizationDomainByDomain(vars: GetOrganizationDomainByDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDomainByDomainData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrganizationDomain' Query. Allow users to execute without passing in DataConnect. */
export function getOrganizationDomain(dc: DataConnect, vars: GetOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDomainData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrganizationDomain' Query. Allow users to pass in custom DataConnect instances. */
export function getOrganizationDomain(vars: GetOrganizationDomainVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrganizationDomainData>>;

/** Generated Node Admin SDK operation action function for the 'ListOrganizationDomainsByOrg' Query. Allow users to execute without passing in DataConnect. */
export function listOrganizationDomainsByOrg(dc: DataConnect, vars: ListOrganizationDomainsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListOrganizationDomainsByOrgData>>;
/** Generated Node Admin SDK operation action function for the 'ListOrganizationDomainsByOrg' Query. Allow users to pass in custom DataConnect instances. */
export function listOrganizationDomainsByOrg(vars: ListOrganizationDomainsByOrgVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListOrganizationDomainsByOrgData>>;

