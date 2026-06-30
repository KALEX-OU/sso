import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddUserToOrganizationData {
  userOrganization_insert: UserOrganizations_Key;
}

export interface AddUserToOrganizationVariables {
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface AddUserToTeamData {
  teamMember_insert: TeamMembers_Key;
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
  vatNumber: string;
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

export interface CreateOrganizationData {
  organization_insert: Organizations_Key;
}

export interface CreateOrganizationVariables {
  orgId: string;
  name: string;
  stripeCustomerId?: string | null;
  type?: string | null;
  country?: string | null;
  vatNumber?: string | null;
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
  } & Prices_Key)[];
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

export interface ListAllProductsVariables {
  appId: string;
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
  } & Prices_Key)[];
}

export interface ListPricesByProductVariables {
  productId: string;
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

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface CreateOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrganizationVariables): MutationRef<CreateOrganizationData, CreateOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrganizationVariables): MutationRef<CreateOrganizationData, CreateOrganizationVariables>;
  operationName: string;
}
export const createOrganizationRef: CreateOrganizationRef;

export function createOrganization(vars: CreateOrganizationVariables): MutationPromise<CreateOrganizationData, CreateOrganizationVariables>;
export function createOrganization(dc: DataConnect, vars: CreateOrganizationVariables): MutationPromise<CreateOrganizationData, CreateOrganizationVariables>;

interface AddUserToOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserToOrganizationVariables): MutationRef<AddUserToOrganizationData, AddUserToOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddUserToOrganizationVariables): MutationRef<AddUserToOrganizationData, AddUserToOrganizationVariables>;
  operationName: string;
}
export const addUserToOrganizationRef: AddUserToOrganizationRef;

export function addUserToOrganization(vars: AddUserToOrganizationVariables): MutationPromise<AddUserToOrganizationData, AddUserToOrganizationVariables>;
export function addUserToOrganization(dc: DataConnect, vars: AddUserToOrganizationVariables): MutationPromise<AddUserToOrganizationData, AddUserToOrganizationVariables>;

interface UpdateUserOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserOrganizationVariables): MutationRef<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserOrganizationVariables): MutationRef<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;
  operationName: string;
}
export const updateUserOrganizationRef: UpdateUserOrganizationRef;

export function updateUserOrganization(vars: UpdateUserOrganizationVariables): MutationPromise<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;
export function updateUserOrganization(dc: DataConnect, vars: UpdateUserOrganizationVariables): MutationPromise<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;

interface UpdateSubscriptionStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSubscriptionStatusVariables): MutationRef<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSubscriptionStatusVariables): MutationRef<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;
  operationName: string;
}
export const updateSubscriptionStatusRef: UpdateSubscriptionStatusRef;

export function updateSubscriptionStatus(vars: UpdateSubscriptionStatusVariables): MutationPromise<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;
export function updateSubscriptionStatus(dc: DataConnect, vars: UpdateSubscriptionStatusVariables): MutationPromise<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;

interface UpdateOrganizationStripeConnectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationStripeConnectVariables): MutationRef<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables): MutationRef<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;
  operationName: string;
}
export const updateOrganizationStripeConnectRef: UpdateOrganizationStripeConnectRef;

export function updateOrganizationStripeConnect(vars: UpdateOrganizationStripeConnectVariables): MutationPromise<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;
export function updateOrganizationStripeConnect(dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables): MutationPromise<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;

interface UpdateOrganizationStripeCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationStripeCustomerVariables): MutationRef<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrganizationStripeCustomerVariables): MutationRef<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;
  operationName: string;
}
export const updateOrganizationStripeCustomerRef: UpdateOrganizationStripeCustomerRef;

export function updateOrganizationStripeCustomer(vars: UpdateOrganizationStripeCustomerVariables): MutationPromise<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;
export function updateOrganizationStripeCustomer(dc: DataConnect, vars: UpdateOrganizationStripeCustomerVariables): MutationPromise<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;

interface CreateAuthCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuthCodeVariables): MutationRef<CreateAuthCodeData, CreateAuthCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAuthCodeVariables): MutationRef<CreateAuthCodeData, CreateAuthCodeVariables>;
  operationName: string;
}
export const createAuthCodeRef: CreateAuthCodeRef;

export function createAuthCode(vars: CreateAuthCodeVariables): MutationPromise<CreateAuthCodeData, CreateAuthCodeVariables>;
export function createAuthCode(dc: DataConnect, vars: CreateAuthCodeVariables): MutationPromise<CreateAuthCodeData, CreateAuthCodeVariables>;

interface DeleteAuthCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuthCodeVariables): MutationRef<DeleteAuthCodeData, DeleteAuthCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAuthCodeVariables): MutationRef<DeleteAuthCodeData, DeleteAuthCodeVariables>;
  operationName: string;
}
export const deleteAuthCodeRef: DeleteAuthCodeRef;

export function deleteAuthCode(vars: DeleteAuthCodeVariables): MutationPromise<DeleteAuthCodeData, DeleteAuthCodeVariables>;
export function deleteAuthCode(dc: DataConnect, vars: DeleteAuthCodeVariables): MutationPromise<DeleteAuthCodeData, DeleteAuthCodeVariables>;

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateOrganizationBillingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationBillingVariables): MutationRef<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrganizationBillingVariables): MutationRef<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;
  operationName: string;
}
export const updateOrganizationBillingRef: UpdateOrganizationBillingRef;

export function updateOrganizationBilling(vars: UpdateOrganizationBillingVariables): MutationPromise<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;
export function updateOrganizationBilling(dc: DataConnect, vars: UpdateOrganizationBillingVariables): MutationPromise<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;

interface UpdateOrganizationViesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationViesVariables): MutationRef<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrganizationViesVariables): MutationRef<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;
  operationName: string;
}
export const updateOrganizationViesRef: UpdateOrganizationViesRef;

export function updateOrganizationVies(vars: UpdateOrganizationViesVariables): MutationPromise<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;
export function updateOrganizationVies(dc: DataConnect, vars: UpdateOrganizationViesVariables): MutationPromise<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;

interface UpdateOrganizationAppsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationAppsVariables): MutationRef<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrganizationAppsVariables): MutationRef<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;
  operationName: string;
}
export const updateOrganizationAppsRef: UpdateOrganizationAppsRef;

export function updateOrganizationApps(vars: UpdateOrganizationAppsVariables): MutationPromise<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;
export function updateOrganizationApps(dc: DataConnect, vars: UpdateOrganizationAppsVariables): MutationPromise<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;

interface UpsertPreRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPreRegistrationVariables): MutationRef<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPreRegistrationVariables): MutationRef<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;
  operationName: string;
}
export const upsertPreRegistrationRef: UpsertPreRegistrationRef;

export function upsertPreRegistration(vars: UpsertPreRegistrationVariables): MutationPromise<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;
export function upsertPreRegistration(dc: DataConnect, vars: UpsertPreRegistrationVariables): MutationPromise<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;

interface DeletePreRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePreRegistrationVariables): MutationRef<DeletePreRegistrationData, DeletePreRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePreRegistrationVariables): MutationRef<DeletePreRegistrationData, DeletePreRegistrationVariables>;
  operationName: string;
}
export const deletePreRegistrationRef: DeletePreRegistrationRef;

export function deletePreRegistration(vars: DeletePreRegistrationVariables): MutationPromise<DeletePreRegistrationData, DeletePreRegistrationVariables>;
export function deletePreRegistration(dc: DataConnect, vars: DeletePreRegistrationVariables): MutationPromise<DeletePreRegistrationData, DeletePreRegistrationVariables>;

interface ConfirmOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ConfirmOrganizationVariables): MutationRef<ConfirmOrganizationData, ConfirmOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ConfirmOrganizationVariables): MutationRef<ConfirmOrganizationData, ConfirmOrganizationVariables>;
  operationName: string;
}
export const confirmOrganizationRef: ConfirmOrganizationRef;

export function confirmOrganization(vars: ConfirmOrganizationVariables): MutationPromise<ConfirmOrganizationData, ConfirmOrganizationVariables>;
export function confirmOrganization(dc: DataConnect, vars: ConfirmOrganizationVariables): MutationPromise<ConfirmOrganizationData, ConfirmOrganizationVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrganizationVariables): MutationRef<DeleteOrganizationData, DeleteOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteOrganizationVariables): MutationRef<DeleteOrganizationData, DeleteOrganizationVariables>;
  operationName: string;
}
export const deleteOrganizationRef: DeleteOrganizationRef;

export function deleteOrganization(vars: DeleteOrganizationVariables): MutationPromise<DeleteOrganizationData, DeleteOrganizationVariables>;
export function deleteOrganization(dc: DataConnect, vars: DeleteOrganizationVariables): MutationPromise<DeleteOrganizationData, DeleteOrganizationVariables>;

interface DeleteUserOrganizationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserOrganizationVariables): MutationRef<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserOrganizationVariables): MutationRef<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;
  operationName: string;
}
export const deleteUserOrganizationRef: DeleteUserOrganizationRef;

export function deleteUserOrganization(vars: DeleteUserOrganizationVariables): MutationPromise<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;
export function deleteUserOrganization(dc: DataConnect, vars: DeleteUserOrganizationVariables): MutationPromise<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;

interface DeleteSubscriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSubscriptionVariables): MutationRef<DeleteSubscriptionData, DeleteSubscriptionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSubscriptionVariables): MutationRef<DeleteSubscriptionData, DeleteSubscriptionVariables>;
  operationName: string;
}
export const deleteSubscriptionRef: DeleteSubscriptionRef;

export function deleteSubscription(vars: DeleteSubscriptionVariables): MutationPromise<DeleteSubscriptionData, DeleteSubscriptionVariables>;
export function deleteSubscription(dc: DataConnect, vars: DeleteSubscriptionVariables): MutationPromise<DeleteSubscriptionData, DeleteSubscriptionVariables>;

interface CreateApiKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApiKeyVariables): MutationRef<CreateApiKeyData, CreateApiKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateApiKeyVariables): MutationRef<CreateApiKeyData, CreateApiKeyVariables>;
  operationName: string;
}
export const createApiKeyRef: CreateApiKeyRef;

export function createApiKey(vars: CreateApiKeyVariables): MutationPromise<CreateApiKeyData, CreateApiKeyVariables>;
export function createApiKey(dc: DataConnect, vars: CreateApiKeyVariables): MutationPromise<CreateApiKeyData, CreateApiKeyVariables>;

interface DeleteApiKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApiKeyVariables): MutationRef<DeleteApiKeyData, DeleteApiKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteApiKeyVariables): MutationRef<DeleteApiKeyData, DeleteApiKeyVariables>;
  operationName: string;
}
export const deleteApiKeyRef: DeleteApiKeyRef;

export function deleteApiKey(vars: DeleteApiKeyVariables): MutationPromise<DeleteApiKeyData, DeleteApiKeyVariables>;
export function deleteApiKey(dc: DataConnect, vars: DeleteApiKeyVariables): MutationPromise<DeleteApiKeyData, DeleteApiKeyVariables>;

interface SetApiKeyPermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetApiKeyPermissionVariables): MutationRef<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SetApiKeyPermissionVariables): MutationRef<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;
  operationName: string;
}
export const setApiKeyPermissionRef: SetApiKeyPermissionRef;

export function setApiKeyPermission(vars: SetApiKeyPermissionVariables): MutationPromise<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;
export function setApiKeyPermission(dc: DataConnect, vars: SetApiKeyPermissionVariables): MutationPromise<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;

interface CreateThingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateThingVariables): MutationRef<CreateThingData, CreateThingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateThingVariables): MutationRef<CreateThingData, CreateThingVariables>;
  operationName: string;
}
export const createThingRef: CreateThingRef;

export function createThing(vars: CreateThingVariables): MutationPromise<CreateThingData, CreateThingVariables>;
export function createThing(dc: DataConnect, vars: CreateThingVariables): MutationPromise<CreateThingData, CreateThingVariables>;

interface UpdateThingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateThingVariables): MutationRef<UpdateThingData, UpdateThingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateThingVariables): MutationRef<UpdateThingData, UpdateThingVariables>;
  operationName: string;
}
export const updateThingRef: UpdateThingRef;

export function updateThing(vars: UpdateThingVariables): MutationPromise<UpdateThingData, UpdateThingVariables>;
export function updateThing(dc: DataConnect, vars: UpdateThingVariables): MutationPromise<UpdateThingData, UpdateThingVariables>;

interface DeleteThingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteThingVariables): MutationRef<DeleteThingData, DeleteThingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteThingVariables): MutationRef<DeleteThingData, DeleteThingVariables>;
  operationName: string;
}
export const deleteThingRef: DeleteThingRef;

export function deleteThing(vars: DeleteThingVariables): MutationPromise<DeleteThingData, DeleteThingVariables>;
export function deleteThing(dc: DataConnect, vars: DeleteThingVariables): MutationPromise<DeleteThingData, DeleteThingVariables>;

interface CreateAuditLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
  operationName: string;
}
export const createAuditLogRef: CreateAuditLogRef;

export function createAuditLog(vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;
export function createAuditLog(dc: DataConnect, vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface DeleteApiKeyPermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApiKeyPermissionVariables): MutationRef<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteApiKeyPermissionVariables): MutationRef<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;
  operationName: string;
}
export const deleteApiKeyPermissionRef: DeleteApiKeyPermissionRef;

export function deleteApiKeyPermission(vars: DeleteApiKeyPermissionVariables): MutationPromise<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;
export function deleteApiKeyPermission(dc: DataConnect, vars: DeleteApiKeyPermissionVariables): MutationPromise<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;

interface DeleteAuditLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditLogVariables): MutationRef<DeleteAuditLogData, DeleteAuditLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAuditLogVariables): MutationRef<DeleteAuditLogData, DeleteAuditLogVariables>;
  operationName: string;
}
export const deleteAuditLogRef: DeleteAuditLogRef;

export function deleteAuditLog(vars: DeleteAuditLogVariables): MutationPromise<DeleteAuditLogData, DeleteAuditLogVariables>;
export function deleteAuditLog(dc: DataConnect, vars: DeleteAuditLogVariables): MutationPromise<DeleteAuditLogData, DeleteAuditLogVariables>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface CreateProductBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductBatchVariables): MutationRef<CreateProductBatchData, CreateProductBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductBatchVariables): MutationRef<CreateProductBatchData, CreateProductBatchVariables>;
  operationName: string;
}
export const createProductBatchRef: CreateProductBatchRef;

export function createProductBatch(vars: CreateProductBatchVariables): MutationPromise<CreateProductBatchData, CreateProductBatchVariables>;
export function createProductBatch(dc: DataConnect, vars: CreateProductBatchVariables): MutationPromise<CreateProductBatchData, CreateProductBatchVariables>;

interface DeleteProductBatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductBatchVariables): MutationRef<DeleteProductBatchData, DeleteProductBatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductBatchVariables): MutationRef<DeleteProductBatchData, DeleteProductBatchVariables>;
  operationName: string;
}
export const deleteProductBatchRef: DeleteProductBatchRef;

export function deleteProductBatch(vars: DeleteProductBatchVariables): MutationPromise<DeleteProductBatchData, DeleteProductBatchVariables>;
export function deleteProductBatch(dc: DataConnect, vars: DeleteProductBatchVariables): MutationPromise<DeleteProductBatchData, DeleteProductBatchVariables>;

interface CreateInvoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  operationName: string;
}
export const createInvoiceRef: CreateInvoiceRef;

export function createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;
export function createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface UpdateInvoiceStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  operationName: string;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;

export function updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
export function updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface DeleteInvoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInvoiceVariables): MutationRef<DeleteInvoiceData, DeleteInvoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteInvoiceVariables): MutationRef<DeleteInvoiceData, DeleteInvoiceVariables>;
  operationName: string;
}
export const deleteInvoiceRef: DeleteInvoiceRef;

export function deleteInvoice(vars: DeleteInvoiceVariables): MutationPromise<DeleteInvoiceData, DeleteInvoiceVariables>;
export function deleteInvoice(dc: DataConnect, vars: DeleteInvoiceVariables): MutationPromise<DeleteInvoiceData, DeleteInvoiceVariables>;

interface CreatePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
  operationName: string;
}
export const createPaymentRef: CreatePaymentRef;

export function createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;
export function createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface UpdatePaymentStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
  operationName: string;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;

export function updatePaymentStatus(vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
export function updatePaymentStatus(dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface DeletePaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
  operationName: string;
}
export const deletePaymentRef: DeletePaymentRef;

export function deletePayment(vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;
export function deletePayment(dc: DataConnect, vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface CreateTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
  operationName: string;
}
export const createTeamRef: CreateTeamRef;

export function createTeam(vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;
export function createTeam(dc: DataConnect, vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface UpdateTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
  operationName: string;
}
export const updateTeamRef: UpdateTeamRef;

export function updateTeam(vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;
export function updateTeam(dc: DataConnect, vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface DeleteTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTeamVariables): MutationRef<DeleteTeamData, DeleteTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTeamVariables): MutationRef<DeleteTeamData, DeleteTeamVariables>;
  operationName: string;
}
export const deleteTeamRef: DeleteTeamRef;

export function deleteTeam(vars: DeleteTeamVariables): MutationPromise<DeleteTeamData, DeleteTeamVariables>;
export function deleteTeam(dc: DataConnect, vars: DeleteTeamVariables): MutationPromise<DeleteTeamData, DeleteTeamVariables>;

interface AddUserToTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserToTeamVariables): MutationRef<AddUserToTeamData, AddUserToTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddUserToTeamVariables): MutationRef<AddUserToTeamData, AddUserToTeamVariables>;
  operationName: string;
}
export const addUserToTeamRef: AddUserToTeamRef;

export function addUserToTeam(vars: AddUserToTeamVariables): MutationPromise<AddUserToTeamData, AddUserToTeamVariables>;
export function addUserToTeam(dc: DataConnect, vars: AddUserToTeamVariables): MutationPromise<AddUserToTeamData, AddUserToTeamVariables>;

interface RemoveUserFromTeamRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveUserFromTeamVariables): MutationRef<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveUserFromTeamVariables): MutationRef<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;
  operationName: string;
}
export const removeUserFromTeamRef: RemoveUserFromTeamRef;

export function removeUserFromTeam(vars: RemoveUserFromTeamVariables): MutationPromise<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;
export function removeUserFromTeam(dc: DataConnect, vars: RemoveUserFromTeamVariables): MutationPromise<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;

interface CreateComputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComputeVariables): MutationRef<CreateComputeData, CreateComputeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateComputeVariables): MutationRef<CreateComputeData, CreateComputeVariables>;
  operationName: string;
}
export const createComputeRef: CreateComputeRef;

export function createCompute(vars: CreateComputeVariables): MutationPromise<CreateComputeData, CreateComputeVariables>;
export function createCompute(dc: DataConnect, vars: CreateComputeVariables): MutationPromise<CreateComputeData, CreateComputeVariables>;

interface UpdateComputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateComputeVariables): MutationRef<UpdateComputeData, UpdateComputeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateComputeVariables): MutationRef<UpdateComputeData, UpdateComputeVariables>;
  operationName: string;
}
export const updateComputeRef: UpdateComputeRef;

export function updateCompute(vars: UpdateComputeVariables): MutationPromise<UpdateComputeData, UpdateComputeVariables>;
export function updateCompute(dc: DataConnect, vars: UpdateComputeVariables): MutationPromise<UpdateComputeData, UpdateComputeVariables>;

interface DeleteComputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteComputeVariables): MutationRef<DeleteComputeData, DeleteComputeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteComputeVariables): MutationRef<DeleteComputeData, DeleteComputeVariables>;
  operationName: string;
}
export const deleteComputeRef: DeleteComputeRef;

export function deleteCompute(vars: DeleteComputeVariables): MutationPromise<DeleteComputeData, DeleteComputeVariables>;
export function deleteCompute(dc: DataConnect, vars: DeleteComputeVariables): MutationPromise<DeleteComputeData, DeleteComputeVariables>;

interface CreatePriceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePriceVariables): MutationRef<CreatePriceData, CreatePriceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePriceVariables): MutationRef<CreatePriceData, CreatePriceVariables>;
  operationName: string;
}
export const createPriceRef: CreatePriceRef;

export function createPrice(vars: CreatePriceVariables): MutationPromise<CreatePriceData, CreatePriceVariables>;
export function createPrice(dc: DataConnect, vars: CreatePriceVariables): MutationPromise<CreatePriceData, CreatePriceVariables>;

interface UpdatePriceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePriceVariables): MutationRef<UpdatePriceData, UpdatePriceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePriceVariables): MutationRef<UpdatePriceData, UpdatePriceVariables>;
  operationName: string;
}
export const updatePriceRef: UpdatePriceRef;

export function updatePrice(vars: UpdatePriceVariables): MutationPromise<UpdatePriceData, UpdatePriceVariables>;
export function updatePrice(dc: DataConnect, vars: UpdatePriceVariables): MutationPromise<UpdatePriceData, UpdatePriceVariables>;

interface DeletePriceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePriceVariables): MutationRef<DeletePriceData, DeletePriceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePriceVariables): MutationRef<DeletePriceData, DeletePriceVariables>;
  operationName: string;
}
export const deletePriceRef: DeletePriceRef;

export function deletePrice(vars: DeletePriceVariables): MutationPromise<DeletePriceData, DeletePriceVariables>;
export function deletePrice(dc: DataConnect, vars: DeletePriceVariables): MutationPromise<DeletePriceData, DeletePriceVariables>;

interface CreateCheckoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCheckoutVariables): MutationRef<CreateCheckoutData, CreateCheckoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCheckoutVariables): MutationRef<CreateCheckoutData, CreateCheckoutVariables>;
  operationName: string;
}
export const createCheckoutRef: CreateCheckoutRef;

export function createCheckout(vars: CreateCheckoutVariables): MutationPromise<CreateCheckoutData, CreateCheckoutVariables>;
export function createCheckout(dc: DataConnect, vars: CreateCheckoutVariables): MutationPromise<CreateCheckoutData, CreateCheckoutVariables>;

interface UpdateCheckoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCheckoutVariables): MutationRef<UpdateCheckoutData, UpdateCheckoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCheckoutVariables): MutationRef<UpdateCheckoutData, UpdateCheckoutVariables>;
  operationName: string;
}
export const updateCheckoutRef: UpdateCheckoutRef;

export function updateCheckout(vars: UpdateCheckoutVariables): MutationPromise<UpdateCheckoutData, UpdateCheckoutVariables>;
export function updateCheckout(dc: DataConnect, vars: UpdateCheckoutVariables): MutationPromise<UpdateCheckoutData, UpdateCheckoutVariables>;

interface DeleteCheckoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCheckoutVariables): MutationRef<DeleteCheckoutData, DeleteCheckoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCheckoutVariables): MutationRef<DeleteCheckoutData, DeleteCheckoutVariables>;
  operationName: string;
}
export const deleteCheckoutRef: DeleteCheckoutRef;

export function deleteCheckout(vars: DeleteCheckoutVariables): MutationPromise<DeleteCheckoutData, DeleteCheckoutVariables>;
export function deleteCheckout(dc: DataConnect, vars: DeleteCheckoutVariables): MutationPromise<DeleteCheckoutData, DeleteCheckoutVariables>;

interface CreateProductConsumeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductConsumeVariables): MutationRef<CreateProductConsumeData, CreateProductConsumeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductConsumeVariables): MutationRef<CreateProductConsumeData, CreateProductConsumeVariables>;
  operationName: string;
}
export const createProductConsumeRef: CreateProductConsumeRef;

export function createProductConsume(vars: CreateProductConsumeVariables): MutationPromise<CreateProductConsumeData, CreateProductConsumeVariables>;
export function createProductConsume(dc: DataConnect, vars: CreateProductConsumeVariables): MutationPromise<CreateProductConsumeData, CreateProductConsumeVariables>;

interface UpdateProductConsumeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductConsumeVariables): MutationRef<UpdateProductConsumeData, UpdateProductConsumeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductConsumeVariables): MutationRef<UpdateProductConsumeData, UpdateProductConsumeVariables>;
  operationName: string;
}
export const updateProductConsumeRef: UpdateProductConsumeRef;

export function updateProductConsume(vars: UpdateProductConsumeVariables): MutationPromise<UpdateProductConsumeData, UpdateProductConsumeVariables>;
export function updateProductConsume(dc: DataConnect, vars: UpdateProductConsumeVariables): MutationPromise<UpdateProductConsumeData, UpdateProductConsumeVariables>;

interface DeleteProductConsumeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductConsumeVariables): MutationRef<DeleteProductConsumeData, DeleteProductConsumeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductConsumeVariables): MutationRef<DeleteProductConsumeData, DeleteProductConsumeVariables>;
  operationName: string;
}
export const deleteProductConsumeRef: DeleteProductConsumeRef;

export function deleteProductConsume(vars: DeleteProductConsumeVariables): MutationPromise<DeleteProductConsumeData, DeleteProductConsumeVariables>;
export function deleteProductConsume(dc: DataConnect, vars: DeleteProductConsumeVariables): MutationPromise<DeleteProductConsumeData, DeleteProductConsumeVariables>;

interface GetUserClaimsContextRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
  operationName: string;
}
export const getUserClaimsContextRef: GetUserClaimsContextRef;

export function getUserClaimsContext(vars: GetUserClaimsContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;
export function getUserClaimsContext(dc: DataConnect, vars: GetUserClaimsContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

interface GetOrganizationDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
  operationName: string;
}
export const getOrganizationDetailsRef: GetOrganizationDetailsRef;

export function getOrganizationDetails(vars: GetOrganizationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
export function getOrganizationDetails(dc: DataConnect, vars: GetOrganizationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

interface GetAuthCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
  operationName: string;
}
export const getAuthCodeRef: GetAuthCodeRef;

export function getAuthCode(vars: GetAuthCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;
export function getAuthCode(dc: DataConnect, vars: GetAuthCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

interface GetPreRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
  operationName: string;
}
export const getPreRegistrationRef: GetPreRegistrationRef;

export function getPreRegistration(vars: GetPreRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;
export function getPreRegistration(dc: DataConnect, vars: GetPreRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

interface ListAllPreRegistrationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPreRegistrationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllPreRegistrationsData, undefined>;
  operationName: string;
}
export const listAllPreRegistrationsRef: ListAllPreRegistrationsRef;

export function listAllPreRegistrations(options?: ExecuteQueryOptions): QueryPromise<ListAllPreRegistrationsData, undefined>;
export function listAllPreRegistrations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllPreRegistrationsData, undefined>;

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllOrganizationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllOrganizationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllOrganizationsData, undefined>;
  operationName: string;
}
export const listAllOrganizationsRef: ListAllOrganizationsRef;

export function listAllOrganizations(options?: ExecuteQueryOptions): QueryPromise<ListAllOrganizationsData, undefined>;
export function listAllOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllOrganizationsData, undefined>;

interface ListAllUserOrganizationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUserOrganizationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUserOrganizationsData, undefined>;
  operationName: string;
}
export const listAllUserOrganizationsRef: ListAllUserOrganizationsRef;

export function listAllUserOrganizations(options?: ExecuteQueryOptions): QueryPromise<ListAllUserOrganizationsData, undefined>;
export function listAllUserOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUserOrganizationsData, undefined>;

interface ListAllSubscriptionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSubscriptionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllSubscriptionsData, undefined>;
  operationName: string;
}
export const listAllSubscriptionsRef: ListAllSubscriptionsRef;

export function listAllSubscriptions(options?: ExecuteQueryOptions): QueryPromise<ListAllSubscriptionsData, undefined>;
export function listAllSubscriptions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSubscriptionsData, undefined>;

interface GetSubscriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSubscriptionVariables): QueryRef<GetSubscriptionData, GetSubscriptionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSubscriptionVariables): QueryRef<GetSubscriptionData, GetSubscriptionVariables>;
  operationName: string;
}
export const getSubscriptionRef: GetSubscriptionRef;

export function getSubscription(vars: GetSubscriptionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSubscriptionData, GetSubscriptionVariables>;
export function getSubscription(dc: DataConnect, vars: GetSubscriptionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSubscriptionData, GetSubscriptionVariables>;

interface ListAllAuthCodesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuthCodesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllAuthCodesData, undefined>;
  operationName: string;
}
export const listAllAuthCodesRef: ListAllAuthCodesRef;

export function listAllAuthCodes(options?: ExecuteQueryOptions): QueryPromise<ListAllAuthCodesData, undefined>;
export function listAllAuthCodes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAuthCodesData, undefined>;

interface GetApiKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
  operationName: string;
}
export const getApiKeyRef: GetApiKeyRef;

export function getApiKey(vars: GetApiKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyData, GetApiKeyVariables>;
export function getApiKey(dc: DataConnect, vars: GetApiKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

interface GetApiKeyPermissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
  operationName: string;
}
export const getApiKeyPermissionsRef: GetApiKeyPermissionsRef;

export function getApiKeyPermissions(vars: GetApiKeyPermissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
export function getApiKeyPermissions(dc: DataConnect, vars: GetApiKeyPermissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

interface GetThingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
  operationName: string;
}
export const getThingRef: GetThingRef;

export function getThing(vars: GetThingVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingData, GetThingVariables>;
export function getThing(dc: DataConnect, vars: GetThingVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingData, GetThingVariables>;

interface GetThingByTokenHashRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
  operationName: string;
}
export const getThingByTokenHashRef: GetThingByTokenHashRef;

export function getThingByTokenHash(vars: GetThingByTokenHashVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;
export function getThingByTokenHash(dc: DataConnect, vars: GetThingByTokenHashVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

interface ListThingsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
  operationName: string;
}
export const listThingsByOrgRef: ListThingsByOrgRef;

export function listThingsByOrg(vars: ListThingsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;
export function listThingsByOrg(dc: DataConnect, vars: ListThingsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

interface ListApiKeysByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
  operationName: string;
}
export const listApiKeysByOrgRef: ListApiKeysByOrgRef;

export function listApiKeysByOrg(vars: ListApiKeysByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
export function listApiKeysByOrg(dc: DataConnect, vars: ListApiKeysByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

interface ListMembersByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
  operationName: string;
}
export const listMembersByOrgRef: ListMembersByOrgRef;

export function listMembersByOrg(vars: ListMembersByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;
export function listMembersByOrg(dc: DataConnect, vars: ListMembersByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

interface ListAllThingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllThingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllThingsData, undefined>;
  operationName: string;
}
export const listAllThingsRef: ListAllThingsRef;

export function listAllThings(options?: ExecuteQueryOptions): QueryPromise<ListAllThingsData, undefined>;
export function listAllThings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllThingsData, undefined>;

interface ListAllApiKeysRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeysData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllApiKeysData, undefined>;
  operationName: string;
}
export const listAllApiKeysRef: ListAllApiKeysRef;

export function listAllApiKeys(options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeysData, undefined>;
export function listAllApiKeys(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeysData, undefined>;

interface ListAllApiKeyPermissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeyPermissionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllApiKeyPermissionsData, undefined>;
  operationName: string;
}
export const listAllApiKeyPermissionsRef: ListAllApiKeyPermissionsRef;

export function listAllApiKeyPermissions(options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeyPermissionsData, undefined>;
export function listAllApiKeyPermissions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

interface ListAllAuditLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuditLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllAuditLogsData, undefined>;
  operationName: string;
}
export const listAllAuditLogsRef: ListAllAuditLogsRef;

export function listAllAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListAllAuditLogsData, undefined>;
export function listAllAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAuditLogsData, undefined>;

interface ListAllProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAllProductsVariables): QueryRef<ListAllProductsData, ListAllProductsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListAllProductsVariables): QueryRef<ListAllProductsData, ListAllProductsVariables>;
  operationName: string;
}
export const listAllProductsRef: ListAllProductsRef;

export function listAllProducts(vars: ListAllProductsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsData, ListAllProductsVariables>;
export function listAllProducts(dc: DataConnect, vars: ListAllProductsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsData, ListAllProductsVariables>;

interface ListAllProductsGlobalRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProductsGlobalData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllProductsGlobalData, undefined>;
  operationName: string;
}
export const listAllProductsGlobalRef: ListAllProductsGlobalRef;

export function listAllProductsGlobal(options?: ExecuteQueryOptions): QueryPromise<ListAllProductsGlobalData, undefined>;
export function listAllProductsGlobal(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsGlobalData, undefined>;

interface ListAllProductBatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProductBatchesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllProductBatchesData, undefined>;
  operationName: string;
}
export const listAllProductBatchesRef: ListAllProductBatchesRef;

export function listAllProductBatches(options?: ExecuteQueryOptions): QueryPromise<ListAllProductBatchesData, undefined>;
export function listAllProductBatches(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllProductBatchesData, undefined>;

interface GetProductBatchesByProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductBatchesByProductVariables): QueryRef<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductBatchesByProductVariables): QueryRef<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;
  operationName: string;
}
export const getProductBatchesByProductRef: GetProductBatchesByProductRef;

export function getProductBatchesByProduct(vars: GetProductBatchesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;
export function getProductBatchesByProduct(dc: DataConnect, vars: GetProductBatchesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;

interface ListAllInvoicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllInvoicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllInvoicesData, undefined>;
  operationName: string;
}
export const listAllInvoicesRef: ListAllInvoicesRef;

export function listAllInvoices(options?: ExecuteQueryOptions): QueryPromise<ListAllInvoicesData, undefined>;
export function listAllInvoices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllInvoicesData, undefined>;

interface ListAllTeamsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllTeamsData, undefined>;
  operationName: string;
}
export const listAllTeamsRef: ListAllTeamsRef;

export function listAllTeams(options?: ExecuteQueryOptions): QueryPromise<ListAllTeamsData, undefined>;
export function listAllTeams(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTeamsData, undefined>;

interface ListAllTeamMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllTeamMembersData, undefined>;
  operationName: string;
}
export const listAllTeamMembersRef: ListAllTeamMembersRef;

export function listAllTeamMembers(options?: ExecuteQueryOptions): QueryPromise<ListAllTeamMembersData, undefined>;
export function listAllTeamMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTeamMembersData, undefined>;

interface ListInvoicesByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
  operationName: string;
}
export const listInvoicesByOrgRef: ListInvoicesByOrgRef;

export function listInvoicesByOrg(vars: ListInvoicesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
export function listInvoicesByOrg(dc: DataConnect, vars: ListInvoicesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

interface ListInvoicesBySellerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
  operationName: string;
}
export const listInvoicesBySellerRef: ListInvoicesBySellerRef;

export function listInvoicesBySeller(vars: ListInvoicesBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
export function listInvoicesBySeller(dc: DataConnect, vars: ListInvoicesBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;

interface ListPaymentsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPaymentsByOrgVariables): QueryRef<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPaymentsByOrgVariables): QueryRef<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;
  operationName: string;
}
export const listPaymentsByOrgRef: ListPaymentsByOrgRef;

export function listPaymentsByOrg(vars: ListPaymentsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;
export function listPaymentsByOrg(dc: DataConnect, vars: ListPaymentsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;

interface ListPaymentsBySellerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPaymentsBySellerVariables): QueryRef<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPaymentsBySellerVariables): QueryRef<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;
  operationName: string;
}
export const listPaymentsBySellerRef: ListPaymentsBySellerRef;

export function listPaymentsBySeller(vars: ListPaymentsBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;
export function listPaymentsBySeller(dc: DataConnect, vars: ListPaymentsBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;

interface GetInvoiceDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  operationName: string;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;

export function getInvoiceDetails(vars: GetInvoiceDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
export function getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetOrganizationByStripeCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
  operationName: string;
}
export const getOrganizationByStripeCustomerRef: GetOrganizationByStripeCustomerRef;

export function getOrganizationByStripeCustomer(vars: GetOrganizationByStripeCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
export function getOrganizationByStripeCustomer(dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;

interface ListTeamsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
  operationName: string;
}
export const listTeamsByOrgRef: ListTeamsByOrgRef;

export function listTeamsByOrg(vars: ListTeamsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;
export function listTeamsByOrg(dc: DataConnect, vars: ListTeamsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

interface ListTeamMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
  operationName: string;
}
export const listTeamMembersRef: ListTeamMembersRef;

export function listTeamMembers(vars: ListTeamMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;
export function listTeamMembers(dc: DataConnect, vars: ListTeamMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

interface ListAuditLogsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
  operationName: string;
}
export const listAuditLogsByOrgRef: ListAuditLogsByOrgRef;

export function listAuditLogsByOrg(vars: ListAuditLogsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
export function listAuditLogsByOrg(dc: DataConnect, vars: ListAuditLogsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

interface CheckVatNumberExistsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckVatNumberExistsVariables): QueryRef<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CheckVatNumberExistsVariables): QueryRef<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;
  operationName: string;
}
export const checkVatNumberExistsRef: CheckVatNumberExistsRef;

export function checkVatNumberExists(vars: CheckVatNumberExistsVariables, options?: ExecuteQueryOptions): QueryPromise<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;
export function checkVatNumberExists(dc: DataConnect, vars: CheckVatNumberExistsVariables, options?: ExecuteQueryOptions): QueryPromise<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;

interface GetComputeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComputeVariables): QueryRef<GetComputeData, GetComputeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetComputeVariables): QueryRef<GetComputeData, GetComputeVariables>;
  operationName: string;
}
export const getComputeRef: GetComputeRef;

export function getCompute(vars: GetComputeVariables, options?: ExecuteQueryOptions): QueryPromise<GetComputeData, GetComputeVariables>;
export function getCompute(dc: DataConnect, vars: GetComputeVariables, options?: ExecuteQueryOptions): QueryPromise<GetComputeData, GetComputeVariables>;

interface ListComputesByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListComputesByOrgVariables): QueryRef<ListComputesByOrgData, ListComputesByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListComputesByOrgVariables): QueryRef<ListComputesByOrgData, ListComputesByOrgVariables>;
  operationName: string;
}
export const listComputesByOrgRef: ListComputesByOrgRef;

export function listComputesByOrg(vars: ListComputesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListComputesByOrgData, ListComputesByOrgVariables>;
export function listComputesByOrg(dc: DataConnect, vars: ListComputesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListComputesByOrgData, ListComputesByOrgVariables>;

interface GetProductConsumeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductConsumeVariables): QueryRef<GetProductConsumeData, GetProductConsumeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductConsumeVariables): QueryRef<GetProductConsumeData, GetProductConsumeVariables>;
  operationName: string;
}
export const getProductConsumeRef: GetProductConsumeRef;

export function getProductConsume(vars: GetProductConsumeVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductConsumeData, GetProductConsumeVariables>;
export function getProductConsume(dc: DataConnect, vars: GetProductConsumeVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductConsumeData, GetProductConsumeVariables>;

interface ListProductConsumesByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductConsumesByOrgVariables): QueryRef<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductConsumesByOrgVariables): QueryRef<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;
  operationName: string;
}
export const listProductConsumesByOrgRef: ListProductConsumesByOrgRef;

export function listProductConsumesByOrg(vars: ListProductConsumesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;
export function listProductConsumesByOrg(dc: DataConnect, vars: ListProductConsumesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;

interface GetPriceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPriceVariables): QueryRef<GetPriceData, GetPriceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPriceVariables): QueryRef<GetPriceData, GetPriceVariables>;
  operationName: string;
}
export const getPriceRef: GetPriceRef;

export function getPrice(vars: GetPriceVariables, options?: ExecuteQueryOptions): QueryPromise<GetPriceData, GetPriceVariables>;
export function getPrice(dc: DataConnect, vars: GetPriceVariables, options?: ExecuteQueryOptions): QueryPromise<GetPriceData, GetPriceVariables>;

interface ListPricesByProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPricesByProductVariables): QueryRef<ListPricesByProductData, ListPricesByProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPricesByProductVariables): QueryRef<ListPricesByProductData, ListPricesByProductVariables>;
  operationName: string;
}
export const listPricesByProductRef: ListPricesByProductRef;

export function listPricesByProduct(vars: ListPricesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<ListPricesByProductData, ListPricesByProductVariables>;
export function listPricesByProduct(dc: DataConnect, vars: ListPricesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<ListPricesByProductData, ListPricesByProductVariables>;

interface ListAllPricesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPricesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllPricesData, undefined>;
  operationName: string;
}
export const listAllPricesRef: ListAllPricesRef;

export function listAllPrices(options?: ExecuteQueryOptions): QueryPromise<ListAllPricesData, undefined>;
export function listAllPrices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllPricesData, undefined>;

interface GetCheckoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCheckoutVariables): QueryRef<GetCheckoutData, GetCheckoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCheckoutVariables): QueryRef<GetCheckoutData, GetCheckoutVariables>;
  operationName: string;
}
export const getCheckoutRef: GetCheckoutRef;

export function getCheckout(vars: GetCheckoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetCheckoutData, GetCheckoutVariables>;
export function getCheckout(dc: DataConnect, vars: GetCheckoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetCheckoutData, GetCheckoutVariables>;

interface ListCheckoutsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCheckoutsByOrgVariables): QueryRef<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCheckoutsByOrgVariables): QueryRef<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;
  operationName: string;
}
export const listCheckoutsByOrgRef: ListCheckoutsByOrgRef;

export function listCheckoutsByOrg(vars: ListCheckoutsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;
export function listCheckoutsByOrg(dc: DataConnect, vars: ListCheckoutsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;

interface ListAllCheckoutsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCheckoutsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllCheckoutsData, undefined>;
  operationName: string;
}
export const listAllCheckoutsRef: ListAllCheckoutsRef;

export function listAllCheckouts(options?: ExecuteQueryOptions): QueryPromise<ListAllCheckoutsData, undefined>;
export function listAllCheckouts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllCheckoutsData, undefined>;

interface GetPaymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
  operationName: string;
}
export const getPaymentRef: GetPaymentRef;

export function getPayment(vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;
export function getPayment(dc: DataConnect, vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface GetProductDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
  operationName: string;
}
export const getProductDetailsRef: GetProductDetailsRef;

export function getProductDetails(vars: GetProductDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;
export function getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

