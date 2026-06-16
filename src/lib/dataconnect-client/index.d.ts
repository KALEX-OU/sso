import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  productId: string;
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
}

export interface CreateServiceData {
  service_insert: Service_Key;
}

export interface CreateServiceVariables {
  serviceId: string;
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
}

export interface CreateTeamData {
  team_insert: Team_Key;
}

export interface CreateTeamVariables {
  teamId: string;
  orgId: string;
  name: string;
  isTest?: boolean | null;
}

export interface CreateThingData {
  thing_insert: Thing_Key;
}

export interface CreateThingVariables {
  thingId: string;
  orgId: string;
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
    isTest: boolean;
    viesValidated: boolean;
    address?: string | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
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

export interface GetProductDetailsData {
  product?: {
    productId: string;
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
    createdAt: TimestampString;
  } & Product_Key;
}

export interface GetProductDetailsVariables {
  productId: string;
}

export interface GetServiceDetailsData {
  service?: {
    serviceId: string;
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
      userOrganizations_on_user: ({
        role: string;
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

export interface ListAllProductsData {
  products: ({
    productId: string;
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
  } & Product_Key)[];
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
    name: string;
    type: string;
    isActive: boolean;
    stripeProductId?: string | null;
    stripePricePersonalId?: string | null;
    stripePriceBusinessId?: string | null;
    stripePriceGovernmentId?: string | null;
    stripePriceEducationId?: string | null;
  } & Service_Key)[];
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
}

export interface ListAuditLogsByOrgData {
  auditLogs: ({
    logId: string;
  } & AuditLog_Key)[];
}

export interface ListAuditLogsByOrgVariables {
  orgId: string;
}

export interface ListInvoicesByOrgData {
  invoices: ({
    invoiceId: string;
    amount: number;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
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
    amount: number;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
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
    joinedAt: TimestampString;
    user: {
      uid: string;
      email: string;
      fullName?: string | null;
      avatarUrl?: string | null;
    } & User_Key;
  })[];
}

export interface ListMembersByOrgVariables {
  orgId: string;
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
    name: string;
    createdAt: TimestampString;
  } & Team_Key)[];
}

export interface ListTeamsByOrgVariables {
  orgId: string;
}

export interface ListThingsByOrgData {
  things: ({
    thingId: string;
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
}

export interface Organization_Key {
  orgId: string;
  __typename?: 'Organization_Key';
}

export interface PreRegistration_Key {
  email: string;
  __typename?: 'PreRegistration_Key';
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

export interface UpdateSubscriptionStatusData {
  serviceSubscription_upsert: ServiceSubscription_Key;
}

export interface UpdateSubscriptionStatusVariables {
  orgId: string;
  serviceId: string;
  status: string;
  tier?: string | null;
  seats?: number | null;
  expiresAt?: TimestampString | null;
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

interface AssignServiceSeatRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignServiceSeatVariables): MutationRef<AssignServiceSeatData, AssignServiceSeatVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignServiceSeatVariables): MutationRef<AssignServiceSeatData, AssignServiceSeatVariables>;
  operationName: string;
}
export const assignServiceSeatRef: AssignServiceSeatRef;

export function assignServiceSeat(vars: AssignServiceSeatVariables): MutationPromise<AssignServiceSeatData, AssignServiceSeatVariables>;
export function assignServiceSeat(dc: DataConnect, vars: AssignServiceSeatVariables): MutationPromise<AssignServiceSeatData, AssignServiceSeatVariables>;

interface RevokeServiceSeatRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RevokeServiceSeatVariables): MutationRef<RevokeServiceSeatData, RevokeServiceSeatVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RevokeServiceSeatVariables): MutationRef<RevokeServiceSeatData, RevokeServiceSeatVariables>;
  operationName: string;
}
export const revokeServiceSeatRef: RevokeServiceSeatRef;

export function revokeServiceSeat(vars: RevokeServiceSeatVariables): MutationPromise<RevokeServiceSeatData, RevokeServiceSeatVariables>;
export function revokeServiceSeat(dc: DataConnect, vars: RevokeServiceSeatVariables): MutationPromise<RevokeServiceSeatData, RevokeServiceSeatVariables>;

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

interface UpdateUserPreferencesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserPreferencesVariables): MutationRef<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserPreferencesVariables): MutationRef<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;
  operationName: string;
}
export const updateUserPreferencesRef: UpdateUserPreferencesRef;

export function updateUserPreferences(vars: UpdateUserPreferencesVariables): MutationPromise<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;
export function updateUserPreferences(dc: DataConnect, vars: UpdateUserPreferencesVariables): MutationPromise<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;

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

interface DeleteServiceSubscriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceSubscriptionVariables): MutationRef<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceSubscriptionVariables): MutationRef<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;
  operationName: string;
}
export const deleteServiceSubscriptionRef: DeleteServiceSubscriptionRef;

export function deleteServiceSubscription(vars: DeleteServiceSubscriptionVariables): MutationPromise<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;
export function deleteServiceSubscription(dc: DataConnect, vars: DeleteServiceSubscriptionVariables): MutationPromise<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;

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

interface UpsertApiKeyPermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertApiKeyPermissionVariables): MutationRef<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertApiKeyPermissionVariables): MutationRef<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;
  operationName: string;
}
export const upsertApiKeyPermissionRef: UpsertApiKeyPermissionRef;

export function upsertApiKeyPermission(vars: UpsertApiKeyPermissionVariables): MutationPromise<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;
export function upsertApiKeyPermission(dc: DataConnect, vars: UpsertApiKeyPermissionVariables): MutationPromise<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;

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

interface CreateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  operationName: string;
}
export const createServiceRef: CreateServiceRef;

export function createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;
export function createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface DeleteServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  operationName: string;
}
export const deleteServiceRef: DeleteServiceRef;

export function deleteService(vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;
export function deleteService(dc: DataConnect, vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

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

interface GetUserClaimsContextRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
  operationName: string;
}
export const getUserClaimsContextRef: GetUserClaimsContextRef;

export function getUserClaimsContext(vars: GetUserClaimsContextVariables): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;
export function getUserClaimsContext(dc: DataConnect, vars: GetUserClaimsContextVariables): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

interface GetOrganizationDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
  operationName: string;
}
export const getOrganizationDetailsRef: GetOrganizationDetailsRef;

export function getOrganizationDetails(vars: GetOrganizationDetailsVariables): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
export function getOrganizationDetails(dc: DataConnect, vars: GetOrganizationDetailsVariables): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

interface GetAuthCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
  operationName: string;
}
export const getAuthCodeRef: GetAuthCodeRef;

export function getAuthCode(vars: GetAuthCodeVariables): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;
export function getAuthCode(dc: DataConnect, vars: GetAuthCodeVariables): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

interface GetPreRegistrationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
  operationName: string;
}
export const getPreRegistrationRef: GetPreRegistrationRef;

export function getPreRegistration(vars: GetPreRegistrationVariables): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;
export function getPreRegistration(dc: DataConnect, vars: GetPreRegistrationVariables): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

interface ListAllPreRegistrationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPreRegistrationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllPreRegistrationsData, undefined>;
  operationName: string;
}
export const listAllPreRegistrationsRef: ListAllPreRegistrationsRef;

export function listAllPreRegistrations(): QueryPromise<ListAllPreRegistrationsData, undefined>;
export function listAllPreRegistrations(dc: DataConnect): QueryPromise<ListAllPreRegistrationsData, undefined>;

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect): QueryPromise<ListAllUsersData, undefined>;

interface ListAllOrganizationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllOrganizationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllOrganizationsData, undefined>;
  operationName: string;
}
export const listAllOrganizationsRef: ListAllOrganizationsRef;

export function listAllOrganizations(): QueryPromise<ListAllOrganizationsData, undefined>;
export function listAllOrganizations(dc: DataConnect): QueryPromise<ListAllOrganizationsData, undefined>;

interface ListAllUserOrganizationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUserOrganizationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUserOrganizationsData, undefined>;
  operationName: string;
}
export const listAllUserOrganizationsRef: ListAllUserOrganizationsRef;

export function listAllUserOrganizations(): QueryPromise<ListAllUserOrganizationsData, undefined>;
export function listAllUserOrganizations(dc: DataConnect): QueryPromise<ListAllUserOrganizationsData, undefined>;

interface ListAllServiceSubscriptionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServiceSubscriptionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllServiceSubscriptionsData, undefined>;
  operationName: string;
}
export const listAllServiceSubscriptionsRef: ListAllServiceSubscriptionsRef;

export function listAllServiceSubscriptions(): QueryPromise<ListAllServiceSubscriptionsData, undefined>;
export function listAllServiceSubscriptions(dc: DataConnect): QueryPromise<ListAllServiceSubscriptionsData, undefined>;

interface ListAllAuthCodesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuthCodesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllAuthCodesData, undefined>;
  operationName: string;
}
export const listAllAuthCodesRef: ListAllAuthCodesRef;

export function listAllAuthCodes(): QueryPromise<ListAllAuthCodesData, undefined>;
export function listAllAuthCodes(dc: DataConnect): QueryPromise<ListAllAuthCodesData, undefined>;

interface GetApiKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
  operationName: string;
}
export const getApiKeyRef: GetApiKeyRef;

export function getApiKey(vars: GetApiKeyVariables): QueryPromise<GetApiKeyData, GetApiKeyVariables>;
export function getApiKey(dc: DataConnect, vars: GetApiKeyVariables): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

interface GetApiKeyPermissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
  operationName: string;
}
export const getApiKeyPermissionsRef: GetApiKeyPermissionsRef;

export function getApiKeyPermissions(vars: GetApiKeyPermissionsVariables): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
export function getApiKeyPermissions(dc: DataConnect, vars: GetApiKeyPermissionsVariables): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

interface GetThingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
  operationName: string;
}
export const getThingRef: GetThingRef;

export function getThing(vars: GetThingVariables): QueryPromise<GetThingData, GetThingVariables>;
export function getThing(dc: DataConnect, vars: GetThingVariables): QueryPromise<GetThingData, GetThingVariables>;

interface GetThingByTokenHashRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
  operationName: string;
}
export const getThingByTokenHashRef: GetThingByTokenHashRef;

export function getThingByTokenHash(vars: GetThingByTokenHashVariables): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;
export function getThingByTokenHash(dc: DataConnect, vars: GetThingByTokenHashVariables): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

interface ListThingsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
  operationName: string;
}
export const listThingsByOrgRef: ListThingsByOrgRef;

export function listThingsByOrg(vars: ListThingsByOrgVariables): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;
export function listThingsByOrg(dc: DataConnect, vars: ListThingsByOrgVariables): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

interface ListApiKeysByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
  operationName: string;
}
export const listApiKeysByOrgRef: ListApiKeysByOrgRef;

export function listApiKeysByOrg(vars: ListApiKeysByOrgVariables): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
export function listApiKeysByOrg(dc: DataConnect, vars: ListApiKeysByOrgVariables): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

interface ListMembersByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
  operationName: string;
}
export const listMembersByOrgRef: ListMembersByOrgRef;

export function listMembersByOrg(vars: ListMembersByOrgVariables): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;
export function listMembersByOrg(dc: DataConnect, vars: ListMembersByOrgVariables): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

interface ListAllThingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllThingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllThingsData, undefined>;
  operationName: string;
}
export const listAllThingsRef: ListAllThingsRef;

export function listAllThings(): QueryPromise<ListAllThingsData, undefined>;
export function listAllThings(dc: DataConnect): QueryPromise<ListAllThingsData, undefined>;

interface ListAllApiKeysRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeysData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllApiKeysData, undefined>;
  operationName: string;
}
export const listAllApiKeysRef: ListAllApiKeysRef;

export function listAllApiKeys(): QueryPromise<ListAllApiKeysData, undefined>;
export function listAllApiKeys(dc: DataConnect): QueryPromise<ListAllApiKeysData, undefined>;

interface ListAllApiKeyPermissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeyPermissionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllApiKeyPermissionsData, undefined>;
  operationName: string;
}
export const listAllApiKeyPermissionsRef: ListAllApiKeyPermissionsRef;

export function listAllApiKeyPermissions(): QueryPromise<ListAllApiKeyPermissionsData, undefined>;
export function listAllApiKeyPermissions(dc: DataConnect): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

interface ListAllAuditLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuditLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllAuditLogsData, undefined>;
  operationName: string;
}
export const listAllAuditLogsRef: ListAllAuditLogsRef;

export function listAllAuditLogs(): QueryPromise<ListAllAuditLogsData, undefined>;
export function listAllAuditLogs(dc: DataConnect): QueryPromise<ListAllAuditLogsData, undefined>;

interface ListAllServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllServicesData, undefined>;
  operationName: string;
}
export const listAllServicesRef: ListAllServicesRef;

export function listAllServices(): QueryPromise<ListAllServicesData, undefined>;
export function listAllServices(dc: DataConnect): QueryPromise<ListAllServicesData, undefined>;

interface ListAllProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllProductsData, undefined>;
  operationName: string;
}
export const listAllProductsRef: ListAllProductsRef;

export function listAllProducts(): QueryPromise<ListAllProductsData, undefined>;
export function listAllProducts(dc: DataConnect): QueryPromise<ListAllProductsData, undefined>;

interface ListAllInvoicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllInvoicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllInvoicesData, undefined>;
  operationName: string;
}
export const listAllInvoicesRef: ListAllInvoicesRef;

export function listAllInvoices(): QueryPromise<ListAllInvoicesData, undefined>;
export function listAllInvoices(dc: DataConnect): QueryPromise<ListAllInvoicesData, undefined>;

interface ListAllTeamsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllTeamsData, undefined>;
  operationName: string;
}
export const listAllTeamsRef: ListAllTeamsRef;

export function listAllTeams(): QueryPromise<ListAllTeamsData, undefined>;
export function listAllTeams(dc: DataConnect): QueryPromise<ListAllTeamsData, undefined>;

interface ListAllTeamMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamMembersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllTeamMembersData, undefined>;
  operationName: string;
}
export const listAllTeamMembersRef: ListAllTeamMembersRef;

export function listAllTeamMembers(): QueryPromise<ListAllTeamMembersData, undefined>;
export function listAllTeamMembers(dc: DataConnect): QueryPromise<ListAllTeamMembersData, undefined>;

interface ListInvoicesByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
  operationName: string;
}
export const listInvoicesByOrgRef: ListInvoicesByOrgRef;

export function listInvoicesByOrg(vars: ListInvoicesByOrgVariables): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
export function listInvoicesByOrg(dc: DataConnect, vars: ListInvoicesByOrgVariables): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

interface ListInvoicesBySellerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
  operationName: string;
}
export const listInvoicesBySellerRef: ListInvoicesBySellerRef;

export function listInvoicesBySeller(vars: ListInvoicesBySellerVariables): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
export function listInvoicesBySeller(dc: DataConnect, vars: ListInvoicesBySellerVariables): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;

interface GetInvoiceDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  operationName: string;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;

export function getInvoiceDetails(vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
export function getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetServiceDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceDetailsVariables): QueryRef<GetServiceDetailsData, GetServiceDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceDetailsVariables): QueryRef<GetServiceDetailsData, GetServiceDetailsVariables>;
  operationName: string;
}
export const getServiceDetailsRef: GetServiceDetailsRef;

export function getServiceDetails(vars: GetServiceDetailsVariables): QueryPromise<GetServiceDetailsData, GetServiceDetailsVariables>;
export function getServiceDetails(dc: DataConnect, vars: GetServiceDetailsVariables): QueryPromise<GetServiceDetailsData, GetServiceDetailsVariables>;

interface GetProductDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
  operationName: string;
}
export const getProductDetailsRef: GetProductDetailsRef;

export function getProductDetails(vars: GetProductDetailsVariables): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;
export function getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

interface GetOrganizationByStripeCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
  operationName: string;
}
export const getOrganizationByStripeCustomerRef: GetOrganizationByStripeCustomerRef;

export function getOrganizationByStripeCustomer(vars: GetOrganizationByStripeCustomerVariables): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
export function getOrganizationByStripeCustomer(dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;

interface ListTeamsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
  operationName: string;
}
export const listTeamsByOrgRef: ListTeamsByOrgRef;

export function listTeamsByOrg(vars: ListTeamsByOrgVariables): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;
export function listTeamsByOrg(dc: DataConnect, vars: ListTeamsByOrgVariables): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

interface ListTeamMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
  operationName: string;
}
export const listTeamMembersRef: ListTeamMembersRef;

export function listTeamMembers(vars: ListTeamMembersVariables): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;
export function listTeamMembers(dc: DataConnect, vars: ListTeamMembersVariables): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

interface ListAuditLogsByOrgRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
  operationName: string;
}
export const listAuditLogsByOrgRef: ListAuditLogsByOrgRef;

export function listAuditLogsByOrg(vars: ListAuditLogsByOrgVariables): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
export function listAuditLogsByOrg(dc: DataConnect, vars: ListAuditLogsByOrgVariables): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

