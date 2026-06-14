import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'kalex-cloud-service',
  location: 'europe-west4'
};

export const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';

export function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
}

export const createOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrganization', inputVars);
}
createOrganizationRef.operationName = 'CreateOrganization';

export function createOrganization(dcOrVars, vars) {
  return executeMutation(createOrganizationRef(dcOrVars, vars));
}

export const addUserToOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToOrganization', inputVars);
}
addUserToOrganizationRef.operationName = 'AddUserToOrganization';

export function addUserToOrganization(dcOrVars, vars) {
  return executeMutation(addUserToOrganizationRef(dcOrVars, vars));
}

export const updateSubscriptionStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSubscriptionStatus', inputVars);
}
updateSubscriptionStatusRef.operationName = 'UpdateSubscriptionStatus';

export function updateSubscriptionStatus(dcOrVars, vars) {
  return executeMutation(updateSubscriptionStatusRef(dcOrVars, vars));
}

export const updateOrganizationStripeConnectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeConnect', inputVars);
}
updateOrganizationStripeConnectRef.operationName = 'UpdateOrganizationStripeConnect';

export function updateOrganizationStripeConnect(dcOrVars, vars) {
  return executeMutation(updateOrganizationStripeConnectRef(dcOrVars, vars));
}

export const createAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuthCode', inputVars);
}
createAuthCodeRef.operationName = 'CreateAuthCode';

export function createAuthCode(dcOrVars, vars) {
  return executeMutation(createAuthCodeRef(dcOrVars, vars));
}

export const deleteAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuthCode', inputVars);
}
deleteAuthCodeRef.operationName = 'DeleteAuthCode';

export function deleteAuthCode(dcOrVars, vars) {
  return executeMutation(deleteAuthCodeRef(dcOrVars, vars));
}

export const updateUserPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserPreferences', inputVars);
}
updateUserPreferencesRef.operationName = 'UpdateUserPreferences';

export function updateUserPreferences(dcOrVars, vars) {
  return executeMutation(updateUserPreferencesRef(dcOrVars, vars));
}

export const updateOrganizationBillingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationBilling', inputVars);
}
updateOrganizationBillingRef.operationName = 'UpdateOrganizationBilling';

export function updateOrganizationBilling(dcOrVars, vars) {
  return executeMutation(updateOrganizationBillingRef(dcOrVars, vars));
}

export const upsertPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPreRegistration', inputVars);
}
upsertPreRegistrationRef.operationName = 'UpsertPreRegistration';

export function upsertPreRegistration(dcOrVars, vars) {
  return executeMutation(upsertPreRegistrationRef(dcOrVars, vars));
}

export const deletePreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePreRegistration', inputVars);
}
deletePreRegistrationRef.operationName = 'DeletePreRegistration';

export function deletePreRegistration(dcOrVars, vars) {
  return executeMutation(deletePreRegistrationRef(dcOrVars, vars));
}

export const confirmOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ConfirmOrganization', inputVars);
}
confirmOrganizationRef.operationName = 'ConfirmOrganization';

export function confirmOrganization(dcOrVars, vars) {
  return executeMutation(confirmOrganizationRef(dcOrVars, vars));
}

export const getUserClaimsContextRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserClaimsContext', inputVars);
}
getUserClaimsContextRef.operationName = 'GetUserClaimsContext';

export function getUserClaimsContext(dcOrVars, vars) {
  return executeQuery(getUserClaimsContextRef(dcOrVars, vars));
}

export const getOrganizationDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationDetails', inputVars);
}
getOrganizationDetailsRef.operationName = 'GetOrganizationDetails';

export function getOrganizationDetails(dcOrVars, vars) {
  return executeQuery(getOrganizationDetailsRef(dcOrVars, vars));
}

export const getAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthCode', inputVars);
}
getAuthCodeRef.operationName = 'GetAuthCode';

export function getAuthCode(dcOrVars, vars) {
  return executeQuery(getAuthCodeRef(dcOrVars, vars));
}

export const getPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPreRegistration', inputVars);
}
getPreRegistrationRef.operationName = 'GetPreRegistration';

export function getPreRegistration(dcOrVars, vars) {
  return executeQuery(getPreRegistrationRef(dcOrVars, vars));
}

