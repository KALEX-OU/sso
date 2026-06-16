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

export const assignServiceSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignServiceSeat', inputVars);
}
assignServiceSeatRef.operationName = 'AssignServiceSeat';

export function assignServiceSeat(dcOrVars, vars) {
  return executeMutation(assignServiceSeatRef(dcOrVars, vars));
}

export const revokeServiceSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RevokeServiceSeat', inputVars);
}
revokeServiceSeatRef.operationName = 'RevokeServiceSeat';

export function revokeServiceSeat(dcOrVars, vars) {
  return executeMutation(revokeServiceSeatRef(dcOrVars, vars));
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

export const updateOrganizationStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeCustomer', inputVars);
}
updateOrganizationStripeCustomerRef.operationName = 'UpdateOrganizationStripeCustomer';

export function updateOrganizationStripeCustomer(dcOrVars, vars) {
  return executeMutation(updateOrganizationStripeCustomerRef(dcOrVars, vars));
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

export const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';

export function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
}

export const deleteOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteOrganization', inputVars);
}
deleteOrganizationRef.operationName = 'DeleteOrganization';

export function deleteOrganization(dcOrVars, vars) {
  return executeMutation(deleteOrganizationRef(dcOrVars, vars));
}

export const deleteUserOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserOrganization', inputVars);
}
deleteUserOrganizationRef.operationName = 'DeleteUserOrganization';

export function deleteUserOrganization(dcOrVars, vars) {
  return executeMutation(deleteUserOrganizationRef(dcOrVars, vars));
}

export const deleteServiceSubscriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceSubscription', inputVars);
}
deleteServiceSubscriptionRef.operationName = 'DeleteServiceSubscription';

export function deleteServiceSubscription(dcOrVars, vars) {
  return executeMutation(deleteServiceSubscriptionRef(dcOrVars, vars));
}

export const createApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateApiKey', inputVars);
}
createApiKeyRef.operationName = 'CreateApiKey';

export function createApiKey(dcOrVars, vars) {
  return executeMutation(createApiKeyRef(dcOrVars, vars));
}

export const deleteApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKey', inputVars);
}
deleteApiKeyRef.operationName = 'DeleteApiKey';

export function deleteApiKey(dcOrVars, vars) {
  return executeMutation(deleteApiKeyRef(dcOrVars, vars));
}

export const upsertApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertApiKeyPermission', inputVars);
}
upsertApiKeyPermissionRef.operationName = 'UpsertApiKeyPermission';

export function upsertApiKeyPermission(dcOrVars, vars) {
  return executeMutation(upsertApiKeyPermissionRef(dcOrVars, vars));
}

export const createThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateThing', inputVars);
}
createThingRef.operationName = 'CreateThing';

export function createThing(dcOrVars, vars) {
  return executeMutation(createThingRef(dcOrVars, vars));
}

export const updateThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateThing', inputVars);
}
updateThingRef.operationName = 'UpdateThing';

export function updateThing(dcOrVars, vars) {
  return executeMutation(updateThingRef(dcOrVars, vars));
}

export const deleteThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteThing', inputVars);
}
deleteThingRef.operationName = 'DeleteThing';

export function deleteThing(dcOrVars, vars) {
  return executeMutation(deleteThingRef(dcOrVars, vars));
}

export const createAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditLog', inputVars);
}
createAuditLogRef.operationName = 'CreateAuditLog';

export function createAuditLog(dcOrVars, vars) {
  return executeMutation(createAuditLogRef(dcOrVars, vars));
}

export const deleteApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKeyPermission', inputVars);
}
deleteApiKeyPermissionRef.operationName = 'DeleteApiKeyPermission';

export function deleteApiKeyPermission(dcOrVars, vars) {
  return executeMutation(deleteApiKeyPermissionRef(dcOrVars, vars));
}

export const deleteAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditLog', inputVars);
}
deleteAuditLogRef.operationName = 'DeleteAuditLog';

export function deleteAuditLog(dcOrVars, vars) {
  return executeMutation(deleteAuditLogRef(dcOrVars, vars));
}

export const createServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateService', inputVars);
}
createServiceRef.operationName = 'CreateService';

export function createService(dcOrVars, vars) {
  return executeMutation(createServiceRef(dcOrVars, vars));
}

export const deleteServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteService', inputVars);
}
deleteServiceRef.operationName = 'DeleteService';

export function deleteService(dcOrVars, vars) {
  return executeMutation(deleteServiceRef(dcOrVars, vars));
}

export const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';

export function createProduct(dcOrVars, vars) {
  return executeMutation(createProductRef(dcOrVars, vars));
}

export const deleteProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProduct', inputVars);
}
deleteProductRef.operationName = 'DeleteProduct';

export function deleteProduct(dcOrVars, vars) {
  return executeMutation(deleteProductRef(dcOrVars, vars));
}

export const createInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInvoice', inputVars);
}
createInvoiceRef.operationName = 'CreateInvoice';

export function createInvoice(dcOrVars, vars) {
  return executeMutation(createInvoiceRef(dcOrVars, vars));
}

export const deleteInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInvoice', inputVars);
}
deleteInvoiceRef.operationName = 'DeleteInvoice';

export function deleteInvoice(dcOrVars, vars) {
  return executeMutation(deleteInvoiceRef(dcOrVars, vars));
}

export const createTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTeam', inputVars);
}
createTeamRef.operationName = 'CreateTeam';

export function createTeam(dcOrVars, vars) {
  return executeMutation(createTeamRef(dcOrVars, vars));
}

export const deleteTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTeam', inputVars);
}
deleteTeamRef.operationName = 'DeleteTeam';

export function deleteTeam(dcOrVars, vars) {
  return executeMutation(deleteTeamRef(dcOrVars, vars));
}

export const addUserToTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToTeam', inputVars);
}
addUserToTeamRef.operationName = 'AddUserToTeam';

export function addUserToTeam(dcOrVars, vars) {
  return executeMutation(addUserToTeamRef(dcOrVars, vars));
}

export const removeUserFromTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveUserFromTeam', inputVars);
}
removeUserFromTeamRef.operationName = 'RemoveUserFromTeam';

export function removeUserFromTeam(dcOrVars, vars) {
  return executeMutation(removeUserFromTeamRef(dcOrVars, vars));
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

export const listAllPreRegistrationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPreRegistrations');
}
listAllPreRegistrationsRef.operationName = 'ListAllPreRegistrations';

export function listAllPreRegistrations(dc) {
  return executeQuery(listAllPreRegistrationsRef(dc));
}

export const listAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUsers');
}
listAllUsersRef.operationName = 'ListAllUsers';

export function listAllUsers(dc) {
  return executeQuery(listAllUsersRef(dc));
}

export const listAllOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllOrganizations');
}
listAllOrganizationsRef.operationName = 'ListAllOrganizations';

export function listAllOrganizations(dc) {
  return executeQuery(listAllOrganizationsRef(dc));
}

export const listAllUserOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUserOrganizations');
}
listAllUserOrganizationsRef.operationName = 'ListAllUserOrganizations';

export function listAllUserOrganizations(dc) {
  return executeQuery(listAllUserOrganizationsRef(dc));
}

export const listAllServiceSubscriptionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllServiceSubscriptions');
}
listAllServiceSubscriptionsRef.operationName = 'ListAllServiceSubscriptions';

export function listAllServiceSubscriptions(dc) {
  return executeQuery(listAllServiceSubscriptionsRef(dc));
}

export const listAllAuthCodesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuthCodes');
}
listAllAuthCodesRef.operationName = 'ListAllAuthCodes';

export function listAllAuthCodes(dc) {
  return executeQuery(listAllAuthCodesRef(dc));
}

export const getApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKey', inputVars);
}
getApiKeyRef.operationName = 'GetApiKey';

export function getApiKey(dcOrVars, vars) {
  return executeQuery(getApiKeyRef(dcOrVars, vars));
}

export const getApiKeyPermissionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKeyPermissions', inputVars);
}
getApiKeyPermissionsRef.operationName = 'GetApiKeyPermissions';

export function getApiKeyPermissions(dcOrVars, vars) {
  return executeQuery(getApiKeyPermissionsRef(dcOrVars, vars));
}

export const getThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThing', inputVars);
}
getThingRef.operationName = 'GetThing';

export function getThing(dcOrVars, vars) {
  return executeQuery(getThingRef(dcOrVars, vars));
}

export const getThingByTokenHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThingByTokenHash', inputVars);
}
getThingByTokenHashRef.operationName = 'GetThingByTokenHash';

export function getThingByTokenHash(dcOrVars, vars) {
  return executeQuery(getThingByTokenHashRef(dcOrVars, vars));
}

export const listThingsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListThingsByOrg', inputVars);
}
listThingsByOrgRef.operationName = 'ListThingsByOrg';

export function listThingsByOrg(dcOrVars, vars) {
  return executeQuery(listThingsByOrgRef(dcOrVars, vars));
}

export const listApiKeysByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListApiKeysByOrg', inputVars);
}
listApiKeysByOrgRef.operationName = 'ListApiKeysByOrg';

export function listApiKeysByOrg(dcOrVars, vars) {
  return executeQuery(listApiKeysByOrgRef(dcOrVars, vars));
}

export const listMembersByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMembersByOrg', inputVars);
}
listMembersByOrgRef.operationName = 'ListMembersByOrg';

export function listMembersByOrg(dcOrVars, vars) {
  return executeQuery(listMembersByOrgRef(dcOrVars, vars));
}

export const listAllThingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllThings');
}
listAllThingsRef.operationName = 'ListAllThings';

export function listAllThings(dc) {
  return executeQuery(listAllThingsRef(dc));
}

export const listAllApiKeysRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeys');
}
listAllApiKeysRef.operationName = 'ListAllApiKeys';

export function listAllApiKeys(dc) {
  return executeQuery(listAllApiKeysRef(dc));
}

export const listAllApiKeyPermissionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeyPermissions');
}
listAllApiKeyPermissionsRef.operationName = 'ListAllApiKeyPermissions';

export function listAllApiKeyPermissions(dc) {
  return executeQuery(listAllApiKeyPermissionsRef(dc));
}

export const listAllAuditLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuditLogs');
}
listAllAuditLogsRef.operationName = 'ListAllAuditLogs';

export function listAllAuditLogs(dc) {
  return executeQuery(listAllAuditLogsRef(dc));
}

export const listAllServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllServices');
}
listAllServicesRef.operationName = 'ListAllServices';

export function listAllServices(dc) {
  return executeQuery(listAllServicesRef(dc));
}

export const listAllProductsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProducts');
}
listAllProductsRef.operationName = 'ListAllProducts';

export function listAllProducts(dc) {
  return executeQuery(listAllProductsRef(dc));
}

export const listAllInvoicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllInvoices');
}
listAllInvoicesRef.operationName = 'ListAllInvoices';

export function listAllInvoices(dc) {
  return executeQuery(listAllInvoicesRef(dc));
}

export const listAllTeamsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeams');
}
listAllTeamsRef.operationName = 'ListAllTeams';

export function listAllTeams(dc) {
  return executeQuery(listAllTeamsRef(dc));
}

export const listAllTeamMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeamMembers');
}
listAllTeamMembersRef.operationName = 'ListAllTeamMembers';

export function listAllTeamMembers(dc) {
  return executeQuery(listAllTeamMembersRef(dc));
}

export const listInvoicesByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesByOrg', inputVars);
}
listInvoicesByOrgRef.operationName = 'ListInvoicesByOrg';

export function listInvoicesByOrg(dcOrVars, vars) {
  return executeQuery(listInvoicesByOrgRef(dcOrVars, vars));
}

export const listInvoicesBySellerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesBySeller', inputVars);
}
listInvoicesBySellerRef.operationName = 'ListInvoicesBySeller';

export function listInvoicesBySeller(dcOrVars, vars) {
  return executeQuery(listInvoicesBySellerRef(dcOrVars, vars));
}

export const getInvoiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInvoiceDetails', inputVars);
}
getInvoiceDetailsRef.operationName = 'GetInvoiceDetails';

export function getInvoiceDetails(dcOrVars, vars) {
  return executeQuery(getInvoiceDetailsRef(dcOrVars, vars));
}

export const getServiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceDetails', inputVars);
}
getServiceDetailsRef.operationName = 'GetServiceDetails';

export function getServiceDetails(dcOrVars, vars) {
  return executeQuery(getServiceDetailsRef(dcOrVars, vars));
}

export const getProductDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductDetails', inputVars);
}
getProductDetailsRef.operationName = 'GetProductDetails';

export function getProductDetails(dcOrVars, vars) {
  return executeQuery(getProductDetailsRef(dcOrVars, vars));
}

export const getOrganizationByStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationByStripeCustomer', inputVars);
}
getOrganizationByStripeCustomerRef.operationName = 'GetOrganizationByStripeCustomer';

export function getOrganizationByStripeCustomer(dcOrVars, vars) {
  return executeQuery(getOrganizationByStripeCustomerRef(dcOrVars, vars));
}

export const listTeamsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamsByOrg', inputVars);
}
listTeamsByOrgRef.operationName = 'ListTeamsByOrg';

export function listTeamsByOrg(dcOrVars, vars) {
  return executeQuery(listTeamsByOrgRef(dcOrVars, vars));
}

export const listTeamMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamMembers', inputVars);
}
listTeamMembersRef.operationName = 'ListTeamMembers';

export function listTeamMembers(dcOrVars, vars) {
  return executeQuery(listTeamMembersRef(dcOrVars, vars));
}

export const listAuditLogsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditLogsByOrg', inputVars);
}
listAuditLogsByOrgRef.operationName = 'ListAuditLogsByOrg';

export function listAuditLogsByOrg(dcOrVars, vars) {
  return executeQuery(listAuditLogsByOrgRef(dcOrVars, vars));
}

