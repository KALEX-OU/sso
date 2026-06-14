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

