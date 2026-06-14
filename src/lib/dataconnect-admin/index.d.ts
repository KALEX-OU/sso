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
  confirmed?: boolean | null;
  metadata?: unknown | null;
}

export interface DeleteAuthCodeData {
  authCode_delete?: AuthCode_Key | null;
}

export interface DeleteAuthCodeVariables {
  code: string;
}

export interface DeletePreRegistrationData {
  preRegistration_delete?: PreRegistration_Key | null;
}

export interface DeletePreRegistrationVariables {
  email: string;
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

export interface GetOrganizationDetailsData {
  organization?: {
    orgId: string;
    name: string;
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
    metadata?: unknown | null;
  } & PreRegistration_Key;
}

export interface GetPreRegistrationVariables {
  email: string;
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
    userOrganizations_on_user: ({
      role: string;
      organization: {
        orgId: string;
        name: string;
        type: string;
        confirmed: boolean;
        country: string;
        vatNumber?: string | null;
        sdiCode?: string | null;
        officeCode?: string | null;
        cigCode?: string | null;
        cupCode?: string | null;
        stripeCustomerId?: string | null;
        stripeConnectAccountId?: string | null;
        stripeConnectOnboarded?: boolean | null;
        metadata?: unknown | null;
        serviceSubscriptions_on_organization: ({
          serviceId: string;
          status: string;
          tier?: string | null;
          expiresAt?: TimestampString | null;
        })[];
      } & Organization_Key;
    })[];
  } & User_Key;
}

export interface GetUserClaimsContextVariables {
  uid: string;
}

export interface Organization_Key {
  orgId: string;
  __typename?: 'Organization_Key';
}

export interface PreRegistration_Key {
  email: string;
  __typename?: 'PreRegistration_Key';
}

export interface ServiceSubscription_Key {
  organizationOrgId: string;
  serviceId: string;
  __typename?: 'ServiceSubscription_Key';
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

export interface UpdateSubscriptionStatusData {
  serviceSubscription_upsert: ServiceSubscription_Key;
}

export interface UpdateSubscriptionStatusVariables {
  orgId: string;
  serviceId: string;
  status: string;
  tier?: string | null;
  expiresAt?: TimestampString | null;
}

export interface UpdateUserPreferencesData {
  user_update?: User_Key | null;
}

export interface UpdateUserPreferencesVariables {
  uid: string;
  locale: string;
  theme: string;
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

/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateSubscriptionStatus(dc: DataConnect, vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateSubscriptionStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateSubscriptionStatus(vars: UpdateSubscriptionStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateSubscriptionStatusData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeConnect' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrganizationStripeConnect(dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeConnectData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrganizationStripeConnect' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrganizationStripeConnect(vars: UpdateOrganizationStripeConnectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrganizationStripeConnectData>>;

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

