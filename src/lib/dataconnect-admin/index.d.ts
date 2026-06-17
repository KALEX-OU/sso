import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddUserToOrganizationData {
  userOrganization_insert: UserOrganization_Key;
}

export interface AddUserToOrganizationVariables {
  uid: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface AddUserToTeamData {
  teamMember_insert: TeamMember_Key;
}

export interface AddUserToTeamVariables {
  uid: string;
  teamId: string;
}

export interface ApiKeyPermission_Key {
  keyHash: string;
  moduleId: string;
  __typename?: 'ApiKeyPermission_Key';
}

export interface ApiKey_Key {
  keyHash: string;
  __typename?: 'ApiKey_Key';
}

export interface AssignServiceSeatData {
  serviceSeat_insert: ServiceSeat_Key;
}

export interface AssignServiceSeatVariables {
  orgId: string;
  serviceId: string;
  uid: string;
}

export interface AuditLog_Key {
  logId: string;
  __typename?: 'AuditLog_Key';
}

export interface AuthCode_Key {
  code: string;
  __typename?: 'AuthCode_Key';
}

export interface CheckVatNumberExistsData {
  organizations: ({
    orgId: string;
    name: string;
  } & Organization_Key)[];
}

export interface CheckVatNumberExistsVariables {
  vatNumber: string;
}

export interface ConfirmOrganizationData {
  organization_update?: Organization_Key | null;
}

export interface ConfirmOrganizationVariables {
  orgId: string;
  confirmed: boolean;
}

export interface CreateApiKeyData {
  apiKey_insert: ApiKey_Key;
}

export interface CreateApiKeyVariables {
  keyHash: string;
  userUid?: string | null;
  thingId?: string | null;
  orgId: string;
  appId?: string | null;
  name: string;
  description?: string | null;
  ipWhitelist: unknown;
  isActive?: boolean | null;
  expiresAt?: TimestampString | null;
  isTest?: boolean | null;
}

export interface CreateAuditLogData {
  auditLog_insert: AuditLog_Key;
}

export interface CreateAuditLogVariables {
  orgId: string;
  appId?: string | null;
  uid: string;
  authType: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  userAgent?: string | null;
  responseCode: number;
  metadata?: unknown | null;
}

export interface CreateAuthCodeData {
  authCode_insert: AuthCode_Key;
}

export interface CreateAuthCodeVariables {
  code: string;
  userUid: string;
  clientId: string;
  redirectUri: string;
  expiresAt: TimestampString;
}

export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}

export interface CreateInvoiceVariables {
  invoiceId: string;
  stripeInvoiceId?: string | null;
  invoiceNumber?: string | null;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: string;
  pdfUrl?: string | null;
  taxPercent?: number | null;
  taxAmount?: number | null;
  subtotal?: number | null;
  products?: unknown | null;
  services?: unknown | null;
  dueDate?: TimestampString | null;
  paidAt?: TimestampString | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateOrganizationData {
  organization_insert: Organization_Key;
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
  confirmed?: boolean | null;
  viesValidated?: boolean | null;
  metadata?: unknown | null;
}

export interface CreatePaymentData {
  payment_insert: Payment_Key;
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
  stripeCustomerId?: string | null;
  stripeConnectAccountId?: string | null;
  applicationFeeAmount?: number | null;
  errorMessage?: string | null;
  metadata?: unknown | null;
}

export interface CreateProductBatchData {
  productBatch_insert: ProductBatch_Key;
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

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  productId: string;
  orgId: string;
  appId?: string | null;
  name: string;
  description?: string | null;
  type: string;
  sku?: string | null;
  price: number;
  stripeProductId?: string | null;
  stripePricePersonalId?: string | null;
  stripePriceBusinessId?: string | null;
  stripePriceGovernmentId?: string | null;
  stripePriceEducationId?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  metadata?: unknown | null;
  variants?: unknown | null;
  bom?: unknown | null;
  relatedProducts?: unknown | null;
  options?: unknown | null;
  taxBehavior?: string | null;
  taxCode?: string | null;
  aiSummary?: string | null;
  descriptionEmbedding?: unknown | null;
}

export interface CreateServiceData {
  service_insert: Service_Key;
}

export interface CreateServiceVariables {
  serviceId: string;
  orgId: string;
  appId?: string | null;
  name: string;
  description?: string | null;
  type: string;
  priceModel?: string | null;
  priceText?: string | null;
  stripeProductId?: string | null;
  stripePricePersonalId?: string | null;
  stripePriceBusinessId?: string | null;
  stripePriceGovernmentId?: string | null;
  stripePriceEducationId?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  metadata?: unknown | null;
  taxBehavior?: string | null;
  taxCode?: string | null;
}

export interface CreateTeamData {
  team_insert: Team_Key;
}

export interface CreateTeamVariables {
  teamId: string;
  orgId: string;
  appId?: string | null;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface CreateThingData {
  thing_insert: Thing_Key;
}

export interface CreateThingVariables {
  thingId: string;
  orgId: string;
  appId?: string | null;
  name: string;
  type: string;
  status?: string | null;
  deviceTokenHash: string;
  metadata?: unknown | null;
  isTest?: boolean | null;
}

export interface DeleteApiKeyData {
  apiKey_delete?: ApiKey_Key | null;
}

export interface DeleteApiKeyPermissionData {
  apiKeyPermission_delete?: ApiKeyPermission_Key | null;
}

export interface DeleteApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
}

export interface DeleteApiKeyVariables {
  keyHash: string;
}

export interface DeleteAuditLogData {
  auditLog_delete?: AuditLog_Key | null;
}

export interface DeleteAuditLogVariables {
  logId: string;
}

export interface DeleteAuthCodeData {
  authCode_delete?: AuthCode_Key | null;
}

export interface DeleteAuthCodeVariables {
  code: string;
}

export interface DeleteInvoiceData {
  invoice_delete?: Invoice_Key | null;
}

export interface DeleteInvoiceVariables {
  invoiceId: string;
}

export interface DeleteOrganizationData {
  organization_delete?: Organization_Key | null;
}

export interface DeleteOrganizationVariables {
  orgId: string;
}

export interface DeletePreRegistrationData {
  preRegistration_delete?: PreRegistration_Key | null;
}

export interface DeletePreRegistrationVariables {
  email: string;
}

export interface DeleteProductBatchData {
  productBatch_delete?: ProductBatch_Key | null;
}

export interface DeleteProductBatchVariables {
  batchId: string;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  productId: string;
}

export interface DeleteServiceData {
  service_delete?: Service_Key | null;
}

export interface DeleteServiceSubscriptionData {
  serviceSubscription_delete?: ServiceSubscription_Key | null;
}

export interface DeleteServiceSubscriptionVariables {
  orgId: string;
  serviceId: string;
}

export interface DeleteServiceVariables {
  serviceId: string;
}

export interface DeleteTeamData {
  team_delete?: Team_Key | null;
}

export interface DeleteTeamVariables {
  teamId: string;
}

export interface DeleteThingData {
  thing_delete?: Thing_Key | null;
}

export interface DeleteThingVariables {
  thingId: string;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserOrganizationData {
  userOrganization_delete?: UserOrganization_Key | null;
}

export interface DeleteUserOrganizationVariables {
  uid: string;
  orgId: string;
}

export interface DeleteUserVariables {
  uid: string;
}

export interface GetApiKeyData {
  apiKey?: {
    keyHash: string;
    user?: {
      uid: string;
      email: string;
    } & User_Key;
    thing?: {
      thingId: string;
      name: string;
    } & Thing_Key;
    orgId: string;
    appId: string;
    name: string;
    description?: string | null;
    ipWhitelist: unknown;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKey_Key;
}

export interface GetApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    allowedFields: unknown;
  } & ApiKeyPermission_Key)[];
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
    userUid: string;
    clientId: string;
    redirectUri: string;
    expiresAt: TimestampString;
  } & AuthCode_Key;
}

export interface GetAuthCodeVariables {
  code: string;
}

export interface GetInvoiceDetailsData {
  invoice?: {
    invoiceId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organization_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organization_Key;
    amount: number;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    products?: unknown | null;
    services?: unknown | null;
    createdAt: TimestampString;
  } & Invoice_Key;
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
  } & Organization_Key)[];
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
    isTest: boolean;
    viesValidated: boolean;
    address?: string | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
    serviceSeats_on_organization: ({
      service: {
        serviceId: string;
      } & Service_Key;
      user: {
        uid: string;
      } & User_Key;
    })[];
  } & Organization_Key;
}

export interface GetOrganizationDetailsVariables {
  orgId: string;
}

export interface GetPreRegistrationData {
  preRegistration?: {
    email: string;
    type: string;
    companyName: string;
    country: string;
    vatNumber?: string | null;
    sdiCode?: string | null;
    officeCode?: string | null;
    cigCode?: string | null;
    cupCode?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    altitude?: number | null;
    metadata?: unknown | null;
  } & PreRegistration_Key;
}

export interface GetPreRegistrationVariables {
  email: string;
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
  } & ProductBatch_Key)[];
}

export interface GetProductBatchesByProductVariables {
  productId: string;
}

export interface GetProductDetailsData {
  product?: {
    productId: string;
    orgId: string;
    appId: string;
    name: string;
    description?: string | null;
    type: string;
    sku?: string | null;
    price: number;
    stripeProductId?: string | null;
    stripePricePersonalId?: string | null;
    stripePriceBusinessId?: string | null;
    stripePriceGovernmentId?: string | null;
    stripePriceEducationId?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior?: string | null;
    taxCode?: string | null;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
    createdAt: TimestampString;
  } & Product_Key;
}

export interface GetProductDetailsVariables {
  productId: string;
}

export interface GetServiceDetailsData {
  service?: {
    serviceId: string;
    orgId: string;
    appId: string;
    name: string;
    description?: string | null;
    type: string;
    priceModel?: string | null;
    priceText?: string | null;
    stripeProductId?: string | null;
    stripePricePersonalId?: string | null;
    stripePriceBusinessId?: string | null;
    stripePriceGovernmentId?: string | null;
    stripePriceEducationId?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    taxBehavior?: string | null;
    taxCode?: string | null;
    createdAt: TimestampString;
  } & Service_Key;
}

export interface GetServiceDetailsVariables {
  serviceId: string;
}

export interface GetThingByTokenHashData {
  things: ({
    thingId: string;
    orgId: string;
    appId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Thing_Key)[];
}

export interface GetThingByTokenHashVariables {
  deviceTokenHash: string;
}

export interface GetThingData {
  thing?: {
    thingId: string;
    orgId: string;
    appId: string;
    name: string;
    type: string;
    status: string;
    deviceTokenHash: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Thing_Key;
}

export interface GetThingVariables {
  thingId: string;
}

export interface GetUserClaimsContextData {
  user?: {
    uid: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    mobile?: string | null;
    locale?: string | null;
    theme?: string | null;
    metadata?: unknown | null;
    serviceSeats_on_user: ({
      service: {
        serviceId: string;
      } & Service_Key;
      organization: {
        orgId: string;
      } & Organization_Key;
    })[];
    teamMembers_on_user: ({
      team: {
        teamId: string;
        name: string;
        rbac?: unknown | null;
        organization: {
          orgId: string;
        } & Organization_Key;
      } & Team_Key;
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
        metadata?: unknown | null;
        serviceSubscriptions_on_organization: ({
          service: {
            serviceId: string;
          } & Service_Key;
          status: string;
          tier?: string | null;
          seats: number;
          expiresAt?: TimestampString | null;
        })[];
        serviceSeats_on_organization: ({
          service: {
            serviceId: string;
          } & Service_Key;
          user: {
            uid: string;
          } & User_Key;
        })[];
      } & Organization_Key;
    })[];
  } & User_Key;
}

export interface GetUserClaimsContextVariables {
  uid: string;
}

export interface Invoice_Key {
  invoiceId: string;
  __typename?: 'Invoice_Key';
}

export interface ListAllApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
  } & ApiKeyPermission_Key)[];
}

export interface ListAllApiKeysData {
  apiKeys: ({
    keyHash: string;
  } & ApiKey_Key)[];
}

export interface ListAllAuditLogsData {
  auditLogs: ({
    logId: string;
    orgId: string;
    uid: string;
  } & AuditLog_Key)[];
}

export interface ListAllAuthCodesData {
  authCodes: ({
    code: string;
  } & AuthCode_Key)[];
}

export interface ListAllInvoicesData {
  invoices: ({
    invoiceId: string;
    amount: number;
    status: string;
  } & Invoice_Key)[];
}

export interface ListAllOrganizationsData {
  organizations: ({
    orgId: string;
    stripeCustomerId?: string | null;
  } & Organization_Key)[];
}

export interface ListAllPreRegistrationsData {
  preRegistrations: ({
    email: string;
  } & PreRegistration_Key)[];
}

export interface ListAllProductBatchesData {
  productBatches: ({
    batchId: string;
    product: {
      productId: string;
      sku?: string | null;
    } & Product_Key;
    batchNumber: string;
    expirationDate?: TimestampString | null;
    productionDate?: TimestampString | null;
    stockStatus: unknown;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductBatch_Key)[];
}

export interface ListAllProductsData {
  products: ({
    productId: string;
    orgId: string;
    appId: string;
    name: string;
    type: string;
    sku?: string | null;
    price: number;
    isActive: boolean;
    stripeProductId?: string | null;
    stripePricePersonalId?: string | null;
    stripePriceBusinessId?: string | null;
    stripePriceGovernmentId?: string | null;
    stripePriceEducationId?: string | null;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior?: string | null;
    taxCode?: string | null;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
  } & Product_Key)[];
}

export interface ListAllProductsVariables {
  appId: string;
}

export interface ListAllServiceSubscriptionsData {
  serviceSubscriptions: ({
    organization: {
      orgId: string;
    } & Organization_Key;
    service: {
      serviceId: string;
    } & Service_Key;
  })[];
}

export interface ListAllServicesData {
  services: ({
    serviceId: string;
    orgId: string;
    appId: string;
    name: string;
    description?: string | null;
    type: string;
    isActive: boolean;
    stripeProductId?: string | null;
    stripePricePersonalId?: string | null;
    stripePriceBusinessId?: string | null;
    stripePriceGovernmentId?: string | null;
    stripePriceEducationId?: string | null;
    metadata?: unknown | null;
    taxBehavior?: string | null;
    taxCode?: string | null;
  } & Service_Key)[];
}

export interface ListAllServicesVariables {
  appId: string;
}

export interface ListAllTeamMembersData {
  teamMembers: ({
    user: {
      uid: string;
    } & User_Key;
    team: {
      teamId: string;
    } & Team_Key;
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
    } & Organization_Key;
  } & Team_Key)[];
}

export interface ListAllThingsData {
  things: ({
    thingId: string;
  } & Thing_Key)[];
}

export interface ListAllUserOrganizationsData {
  userOrganizations: ({
    user: {
      uid: string;
    } & User_Key;
    organization: {
      orgId: string;
    } & Organization_Key;
  })[];
}

export interface ListAllUsersData {
  users: ({
    uid: string;
    email: string;
  } & User_Key)[];
}

export interface ListApiKeysByOrgData {
  apiKeys: ({
    keyHash: string;
    appId: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKey_Key)[];
}

export interface ListApiKeysByOrgVariables {
  orgId: string;
  appId: string;
}

export interface ListAuditLogsByOrgData {
  auditLogs: ({
    logId: string;
    appId: string;
  } & AuditLog_Key)[];
}

export interface ListAuditLogsByOrgVariables {
  orgId: string;
  appId: string;
}

export interface ListInvoicesByOrgData {
  invoices: ({
    invoiceId: string;
    stripeInvoiceId?: string | null;
    invoiceNumber?: string | null;
    amount: number;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    buyer: {
      orgId: string;
      name: string;
    } & Organization_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organization_Key;
  } & Invoice_Key)[];
}

export interface ListInvoicesByOrgVariables {
  orgId: string;
}

export interface ListInvoicesBySellerData {
  invoices: ({
    invoiceId: string;
    stripeInvoiceId?: string | null;
    invoiceNumber?: string | null;
    amount: number;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    buyer: {
      orgId: string;
      name: string;
    } & Organization_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organization_Key;
  } & Invoice_Key)[];
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
      uid: string;
      email: string;
      fullName?: string | null;
      avatarUrl?: string | null;
      metadata?: unknown | null;
      locale?: string | null;
      teamMembers_on_user: ({
        team: {
          teamId: string;
          name: string;
        } & Team_Key;
      })[];
    } & User_Key;
  })[];
}

export interface ListMembersByOrgVariables {
  orgId: string;
}

export interface ListPaymentsByOrgData {
  payments: ({
    paymentId: string;
    sellerOrgId?: string | null;
    invoiceId?: string | null;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payment_Key)[];
}

export interface ListPaymentsByOrgVariables {
  orgId: string;
}

export interface ListPaymentsBySellerData {
  payments: ({
    paymentId: string;
    orgId: string;
    invoiceId?: string | null;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payment_Key)[];
}

export interface ListPaymentsBySellerVariables {
  sellerOrgId: string;
}

export interface ListTeamMembersData {
  teamMembers: ({
    joinedAt: TimestampString;
    user: {
      uid: string;
      email: string;
      fullName?: string | null;
      avatarUrl?: string | null;
    } & User_Key;
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
  } & Team_Key)[];
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
  } & Thing_Key)[];
}

export interface ListThingsByOrgVariables {
  orgId: string;
  appId: string;
}

export interface Organization_Key {
  orgId: string;
  __typename?: 'Organization_Key';
}

export interface Payment_Key {
  paymentId: string;
  __typename?: 'Payment_Key';
}

export interface PreRegistration_Key {
  email: string;
  __typename?: 'PreRegistration_Key';
}

export interface ProductBatch_Key {
  batchId: string;
  __typename?: 'ProductBatch_Key';
}

export interface Product_Key {
  productId: string;
  __typename?: 'Product_Key';
}

export interface RemoveUserFromTeamData {
  teamMember_delete?: TeamMember_Key | null;
}

export interface RemoveUserFromTeamVariables {
  uid: string;
  teamId: string;
}

export interface RevokeServiceSeatData {
  serviceSeat_delete?: ServiceSeat_Key | null;
}

export interface RevokeServiceSeatVariables {
  orgId: string;
  serviceId: string;
  uid: string;
}

export interface ServiceSeat_Key {
  organizationOrgId: string;
  serviceServiceId: string;
  userUid: string;
  __typename?: 'ServiceSeat_Key';
}

export interface ServiceSubscription_Key {
  organizationOrgId: string;
  serviceServiceId: string;
  __typename?: 'ServiceSubscription_Key';
}

export interface Service_Key {
  serviceId: string;
  __typename?: 'Service_Key';
}

export interface TeamMember_Key {
  userUid: string;
  teamTeamId: string;
  __typename?: 'TeamMember_Key';
}

export interface Team_Key {
  teamId: string;
  __typename?: 'Team_Key';
}

export interface Thing_Key {
  thingId: string;
  __typename?: 'Thing_Key';
}

export interface UpdateInvoiceStatusData {
  invoice_update?: Invoice_Key | null;
}

export interface UpdateInvoiceStatusVariables {
  invoiceId: string;
  status: string;
}

export interface UpdateOrganizationBillingData {
  organization_update?: Organization_Key | null;
}

export interface UpdateOrganizationBillingVariables {
  orgId: string;
  type: string;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
}

export interface UpdateOrganizationStripeConnectData {
  organization_update?: Organization_Key | null;
}

export interface UpdateOrganizationStripeConnectVariables {
  orgId: string;
  stripeConnectAccountId: string;
  stripeConnectOnboarded: boolean;
}

export interface UpdateOrganizationStripeCustomerData {
  organization_update?: Organization_Key | null;
}

export interface UpdateOrganizationStripeCustomerVariables {
  orgId: string;
  stripeCustomerId: string;
}

export interface UpdatePaymentStatusData {
  payment_update?: Payment_Key | null;
}

export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  errorMessage?: string | null;
}

export interface UpdateSubscriptionStatusData {
  serviceSubscription_upsert: ServiceSubscription_Key;
}

export interface UpdateSubscriptionStatusVariables {
  orgId: string;
  serviceId: string;
  status: string;
  tier?: string | null;
  seats?: number | null;
  stripeSubscriptionId?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  currentPeriodStart?: TimestampString | null;
  currentPeriodEnd?: TimestampString | null;
  trialStart?: TimestampString | null;
  trialEnd?: TimestampString | null;
  metadata?: unknown | null;
  expiresAt?: TimestampString | null;
}

export interface UpdateTeamData {
  team_update?: Team_Key | null;
}

export interface UpdateTeamVariables {
  teamId: string;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
}

export interface UpdateThingData {
  thing_update?: Thing_Key | null;
}

export interface UpdateThingVariables {
  thingId: string;
  name?: string | null;
  type?: string | null;
  status?: string | null;
  metadata?: unknown | null;
}

export interface UpdateUserOrganizationData {
  userOrganization_update?: UserOrganization_Key | null;
}

export interface UpdateUserOrganizationVariables {
  uid: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}

export interface UpdateUserPreferencesData {
  user_update?: User_Key | null;
}

export interface UpdateUserPreferencesVariables {
  uid: string;
  locale: string;
  theme: string;
}

export interface UpsertApiKeyPermissionData {
  apiKeyPermission_upsert: ApiKeyPermission_Key;
}

export interface UpsertApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: unknown;
}

export interface UpsertPreRegistrationData {
  preRegistration_upsert: PreRegistration_Key;
}

export interface UpsertPreRegistrationVariables {
  email: string;
  type: string;
  companyName: string;
  country?: string | null;
  vatNumber?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  metadata?: unknown | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  uid: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  mobile?: string | null;
  locale?: string | null;
  theme?: string | null;
  metadata?: unknown | null;
}

export interface UserOrganization_Key {
  userUid: string;
  organizationOrgId: string;
  __typename?: 'UserOrganization_Key';
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
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

/** Generated Node Admin SDK operation action function for the 'UpdateUserOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserOrganization(dc: DataConnect, vars: UpdateUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserOrganization(vars: UpdateUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateSubscriptionStatus(dc: DataConnect, vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateSubscriptionStatus(vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;

/** Generated Node Admin SDK operation action function for the 'AssignServiceSeat' Mutation. Allow users to execute without passing in DataConnect. */
export function assignServiceSeat(dc: DataConnect, vars: AssignServiceSeatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignServiceSeatData>>;
/** Generated Node Admin SDK operation action function for the 'AssignServiceSeat' Mutation. Allow users to pass in custom DataConnect instances. */
export function assignServiceSeat(vars: AssignServiceSeatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AssignServiceSeatData>>;

/** Generated Node Admin SDK operation action function for the 'RevokeServiceSeat' Mutation. Allow users to execute without passing in DataConnect. */
export function revokeServiceSeat(dc: DataConnect, vars: RevokeServiceSeatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RevokeServiceSeatData>>;
/** Generated Node Admin SDK operation action function for the 'RevokeServiceSeat' Mutation. Allow users to pass in custom DataConnect instances. */
export function revokeServiceSeat(vars: RevokeServiceSeatVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RevokeServiceSeatData>>;

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

/** Generated Node Admin SDK operation action function for the 'UpdateUserPreferences' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserPreferences(dc: DataConnect, vars: UpdateUserPreferencesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserPreferencesData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserPreferences' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserPreferences(vars: UpdateUserPreferencesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserPreferencesData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationBilling' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationBilling(dc: DataConnect, vars: UpdateOrganizationBillingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationBillingData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationBilling' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationBilling(vars: UpdateOrganizationBillingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationBillingData>>;

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

/** Generated Node Admin SDK operation action function for the 'DeleteOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteOrganization(dc: DataConnect, vars: DeleteOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteOrganization(vars: DeleteOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUserOrganization' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUserOrganization(dc: DataConnect, vars: DeleteUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserOrganizationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUserOrganization' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUserOrganization(vars: DeleteUserOrganizationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserOrganizationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteServiceSubscription' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteServiceSubscription(dc: DataConnect, vars: DeleteServiceSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteServiceSubscriptionData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteServiceSubscription' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteServiceSubscription(vars: DeleteServiceSubscriptionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteServiceSubscriptionData>>;

/** Generated Node Admin SDK operation action function for the 'CreateApiKey' Mutation. Allow users to execute without passing in DataConnect. */
export function createApiKey(dc: DataConnect, vars: CreateApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateApiKeyData>>;
/** Generated Node Admin SDK operation action function for the 'CreateApiKey' Mutation. Allow users to pass in custom DataConnect instances. */
export function createApiKey(vars: CreateApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateApiKeyData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteApiKey' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteApiKey(dc: DataConnect, vars: DeleteApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteApiKey' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteApiKey(vars: DeleteApiKeyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteApiKeyData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertApiKeyPermission' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertApiKeyPermission(dc: DataConnect, vars: UpsertApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertApiKeyPermissionData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertApiKeyPermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertApiKeyPermission(vars: UpsertApiKeyPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertApiKeyPermissionData>>;

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

/** Generated Node Admin SDK operation action function for the 'CreateService' Mutation. Allow users to execute without passing in DataConnect. */
export function createService(dc: DataConnect, vars: CreateServiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateServiceData>>;
/** Generated Node Admin SDK operation action function for the 'CreateService' Mutation. Allow users to pass in custom DataConnect instances. */
export function createService(vars: CreateServiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateServiceData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteService' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteService(dc: DataConnect, vars: DeleteServiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteServiceData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteService' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteService(vars: DeleteServiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteServiceData>>;

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

/** Generated Node Admin SDK operation action function for the 'ListAllServiceSubscriptions' Query. Allow users to execute without passing in DataConnect. */
export function listAllServiceSubscriptions(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllServiceSubscriptionsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllServiceSubscriptions' Query. Allow users to pass in custom DataConnect instances. */
export function listAllServiceSubscriptions(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllServiceSubscriptionsData>>;

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

/** Generated Node Admin SDK operation action function for the 'ListAllServices' Query. Allow users to execute without passing in DataConnect. */
export function listAllServices(dc: DataConnect, vars: ListAllServicesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllServicesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllServices' Query. Allow users to pass in custom DataConnect instances. */
export function listAllServices(vars: ListAllServicesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllServicesData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllProducts' Query. Allow users to execute without passing in DataConnect. */
export function listAllProducts(dc: DataConnect, vars: ListAllProductsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllProducts' Query. Allow users to pass in custom DataConnect instances. */
export function listAllProducts(vars: ListAllProductsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllProductsData>>;

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

/** Generated Node Admin SDK operation action function for the 'GetServiceDetails' Query. Allow users to execute without passing in DataConnect. */
export function getServiceDetails(dc: DataConnect, vars: GetServiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetServiceDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetServiceDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getServiceDetails(vars: GetServiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetServiceDetailsData>>;

/** Generated Node Admin SDK operation action function for the 'GetProductDetails' Query. Allow users to execute without passing in DataConnect. */
export function getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetProductDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getProductDetails(vars: GetProductDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductDetailsData>>;

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

