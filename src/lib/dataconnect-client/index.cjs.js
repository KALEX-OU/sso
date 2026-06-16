const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'kalex-cloud-service',
  location: 'europe-west4'
};
exports.connectorConfig = connectorConfig;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  return executeMutation(upsertUserRef(dcOrVars, vars));
};

const createOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrganization', inputVars);
}
createOrganizationRef.operationName = 'CreateOrganization';
exports.createOrganizationRef = createOrganizationRef;

exports.createOrganization = function createOrganization(dcOrVars, vars) {
  return executeMutation(createOrganizationRef(dcOrVars, vars));
};

const addUserToOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToOrganization', inputVars);
}
addUserToOrganizationRef.operationName = 'AddUserToOrganization';
exports.addUserToOrganizationRef = addUserToOrganizationRef;

exports.addUserToOrganization = function addUserToOrganization(dcOrVars, vars) {
  return executeMutation(addUserToOrganizationRef(dcOrVars, vars));
};

const updateSubscriptionStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSubscriptionStatus', inputVars);
}
updateSubscriptionStatusRef.operationName = 'UpdateSubscriptionStatus';
exports.updateSubscriptionStatusRef = updateSubscriptionStatusRef;

exports.updateSubscriptionStatus = function updateSubscriptionStatus(dcOrVars, vars) {
  return executeMutation(updateSubscriptionStatusRef(dcOrVars, vars));
};

const assignServiceSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignServiceSeat', inputVars);
}
assignServiceSeatRef.operationName = 'AssignServiceSeat';
exports.assignServiceSeatRef = assignServiceSeatRef;

exports.assignServiceSeat = function assignServiceSeat(dcOrVars, vars) {
  return executeMutation(assignServiceSeatRef(dcOrVars, vars));
};

const revokeServiceSeatRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RevokeServiceSeat', inputVars);
}
revokeServiceSeatRef.operationName = 'RevokeServiceSeat';
exports.revokeServiceSeatRef = revokeServiceSeatRef;

exports.revokeServiceSeat = function revokeServiceSeat(dcOrVars, vars) {
  return executeMutation(revokeServiceSeatRef(dcOrVars, vars));
};

const updateOrganizationStripeConnectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeConnect', inputVars);
}
updateOrganizationStripeConnectRef.operationName = 'UpdateOrganizationStripeConnect';
exports.updateOrganizationStripeConnectRef = updateOrganizationStripeConnectRef;

exports.updateOrganizationStripeConnect = function updateOrganizationStripeConnect(dcOrVars, vars) {
  return executeMutation(updateOrganizationStripeConnectRef(dcOrVars, vars));
};

const updateOrganizationStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeCustomer', inputVars);
}
updateOrganizationStripeCustomerRef.operationName = 'UpdateOrganizationStripeCustomer';
exports.updateOrganizationStripeCustomerRef = updateOrganizationStripeCustomerRef;

exports.updateOrganizationStripeCustomer = function updateOrganizationStripeCustomer(dcOrVars, vars) {
  return executeMutation(updateOrganizationStripeCustomerRef(dcOrVars, vars));
};

const createAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuthCode', inputVars);
}
createAuthCodeRef.operationName = 'CreateAuthCode';
exports.createAuthCodeRef = createAuthCodeRef;

exports.createAuthCode = function createAuthCode(dcOrVars, vars) {
  return executeMutation(createAuthCodeRef(dcOrVars, vars));
};

const deleteAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuthCode', inputVars);
}
deleteAuthCodeRef.operationName = 'DeleteAuthCode';
exports.deleteAuthCodeRef = deleteAuthCodeRef;

exports.deleteAuthCode = function deleteAuthCode(dcOrVars, vars) {
  return executeMutation(deleteAuthCodeRef(dcOrVars, vars));
};

const updateUserPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserPreferences', inputVars);
}
updateUserPreferencesRef.operationName = 'UpdateUserPreferences';
exports.updateUserPreferencesRef = updateUserPreferencesRef;

exports.updateUserPreferences = function updateUserPreferences(dcOrVars, vars) {
  return executeMutation(updateUserPreferencesRef(dcOrVars, vars));
};

const updateOrganizationBillingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationBilling', inputVars);
}
updateOrganizationBillingRef.operationName = 'UpdateOrganizationBilling';
exports.updateOrganizationBillingRef = updateOrganizationBillingRef;

exports.updateOrganizationBilling = function updateOrganizationBilling(dcOrVars, vars) {
  return executeMutation(updateOrganizationBillingRef(dcOrVars, vars));
};

const upsertPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPreRegistration', inputVars);
}
upsertPreRegistrationRef.operationName = 'UpsertPreRegistration';
exports.upsertPreRegistrationRef = upsertPreRegistrationRef;

exports.upsertPreRegistration = function upsertPreRegistration(dcOrVars, vars) {
  return executeMutation(upsertPreRegistrationRef(dcOrVars, vars));
};

const deletePreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePreRegistration', inputVars);
}
deletePreRegistrationRef.operationName = 'DeletePreRegistration';
exports.deletePreRegistrationRef = deletePreRegistrationRef;

exports.deletePreRegistration = function deletePreRegistration(dcOrVars, vars) {
  return executeMutation(deletePreRegistrationRef(dcOrVars, vars));
};

const confirmOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ConfirmOrganization', inputVars);
}
confirmOrganizationRef.operationName = 'ConfirmOrganization';
exports.confirmOrganizationRef = confirmOrganizationRef;

exports.confirmOrganization = function confirmOrganization(dcOrVars, vars) {
  return executeMutation(confirmOrganizationRef(dcOrVars, vars));
};

const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';
exports.deleteUserRef = deleteUserRef;

exports.deleteUser = function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
};

const deleteOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteOrganization', inputVars);
}
deleteOrganizationRef.operationName = 'DeleteOrganization';
exports.deleteOrganizationRef = deleteOrganizationRef;

exports.deleteOrganization = function deleteOrganization(dcOrVars, vars) {
  return executeMutation(deleteOrganizationRef(dcOrVars, vars));
};

const deleteUserOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserOrganization', inputVars);
}
deleteUserOrganizationRef.operationName = 'DeleteUserOrganization';
exports.deleteUserOrganizationRef = deleteUserOrganizationRef;

exports.deleteUserOrganization = function deleteUserOrganization(dcOrVars, vars) {
  return executeMutation(deleteUserOrganizationRef(dcOrVars, vars));
};

const deleteServiceSubscriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceSubscription', inputVars);
}
deleteServiceSubscriptionRef.operationName = 'DeleteServiceSubscription';
exports.deleteServiceSubscriptionRef = deleteServiceSubscriptionRef;

exports.deleteServiceSubscription = function deleteServiceSubscription(dcOrVars, vars) {
  return executeMutation(deleteServiceSubscriptionRef(dcOrVars, vars));
};

const createApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateApiKey', inputVars);
}
createApiKeyRef.operationName = 'CreateApiKey';
exports.createApiKeyRef = createApiKeyRef;

exports.createApiKey = function createApiKey(dcOrVars, vars) {
  return executeMutation(createApiKeyRef(dcOrVars, vars));
};

const deleteApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKey', inputVars);
}
deleteApiKeyRef.operationName = 'DeleteApiKey';
exports.deleteApiKeyRef = deleteApiKeyRef;

exports.deleteApiKey = function deleteApiKey(dcOrVars, vars) {
  return executeMutation(deleteApiKeyRef(dcOrVars, vars));
};

const upsertApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertApiKeyPermission', inputVars);
}
upsertApiKeyPermissionRef.operationName = 'UpsertApiKeyPermission';
exports.upsertApiKeyPermissionRef = upsertApiKeyPermissionRef;

exports.upsertApiKeyPermission = function upsertApiKeyPermission(dcOrVars, vars) {
  return executeMutation(upsertApiKeyPermissionRef(dcOrVars, vars));
};

const createThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateThing', inputVars);
}
createThingRef.operationName = 'CreateThing';
exports.createThingRef = createThingRef;

exports.createThing = function createThing(dcOrVars, vars) {
  return executeMutation(createThingRef(dcOrVars, vars));
};

const updateThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateThing', inputVars);
}
updateThingRef.operationName = 'UpdateThing';
exports.updateThingRef = updateThingRef;

exports.updateThing = function updateThing(dcOrVars, vars) {
  return executeMutation(updateThingRef(dcOrVars, vars));
};

const deleteThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteThing', inputVars);
}
deleteThingRef.operationName = 'DeleteThing';
exports.deleteThingRef = deleteThingRef;

exports.deleteThing = function deleteThing(dcOrVars, vars) {
  return executeMutation(deleteThingRef(dcOrVars, vars));
};

const createAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditLog', inputVars);
}
createAuditLogRef.operationName = 'CreateAuditLog';
exports.createAuditLogRef = createAuditLogRef;

exports.createAuditLog = function createAuditLog(dcOrVars, vars) {
  return executeMutation(createAuditLogRef(dcOrVars, vars));
};

const deleteApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKeyPermission', inputVars);
}
deleteApiKeyPermissionRef.operationName = 'DeleteApiKeyPermission';
exports.deleteApiKeyPermissionRef = deleteApiKeyPermissionRef;

exports.deleteApiKeyPermission = function deleteApiKeyPermission(dcOrVars, vars) {
  return executeMutation(deleteApiKeyPermissionRef(dcOrVars, vars));
};

const deleteAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditLog', inputVars);
}
deleteAuditLogRef.operationName = 'DeleteAuditLog';
exports.deleteAuditLogRef = deleteAuditLogRef;

exports.deleteAuditLog = function deleteAuditLog(dcOrVars, vars) {
  return executeMutation(deleteAuditLogRef(dcOrVars, vars));
};

const createServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateService', inputVars);
}
createServiceRef.operationName = 'CreateService';
exports.createServiceRef = createServiceRef;

exports.createService = function createService(dcOrVars, vars) {
  return executeMutation(createServiceRef(dcOrVars, vars));
};

const deleteServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteService', inputVars);
}
deleteServiceRef.operationName = 'DeleteService';
exports.deleteServiceRef = deleteServiceRef;

exports.deleteService = function deleteService(dcOrVars, vars) {
  return executeMutation(deleteServiceRef(dcOrVars, vars));
};

const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';
exports.createProductRef = createProductRef;

exports.createProduct = function createProduct(dcOrVars, vars) {
  return executeMutation(createProductRef(dcOrVars, vars));
};

const deleteProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProduct', inputVars);
}
deleteProductRef.operationName = 'DeleteProduct';
exports.deleteProductRef = deleteProductRef;

exports.deleteProduct = function deleteProduct(dcOrVars, vars) {
  return executeMutation(deleteProductRef(dcOrVars, vars));
};

const createInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInvoice', inputVars);
}
createInvoiceRef.operationName = 'CreateInvoice';
exports.createInvoiceRef = createInvoiceRef;

exports.createInvoice = function createInvoice(dcOrVars, vars) {
  return executeMutation(createInvoiceRef(dcOrVars, vars));
};

const deleteInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInvoice', inputVars);
}
deleteInvoiceRef.operationName = 'DeleteInvoice';
exports.deleteInvoiceRef = deleteInvoiceRef;

exports.deleteInvoice = function deleteInvoice(dcOrVars, vars) {
  return executeMutation(deleteInvoiceRef(dcOrVars, vars));
};

const createTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTeam', inputVars);
}
createTeamRef.operationName = 'CreateTeam';
exports.createTeamRef = createTeamRef;

exports.createTeam = function createTeam(dcOrVars, vars) {
  return executeMutation(createTeamRef(dcOrVars, vars));
};

const deleteTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTeam', inputVars);
}
deleteTeamRef.operationName = 'DeleteTeam';
exports.deleteTeamRef = deleteTeamRef;

exports.deleteTeam = function deleteTeam(dcOrVars, vars) {
  return executeMutation(deleteTeamRef(dcOrVars, vars));
};

const addUserToTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToTeam', inputVars);
}
addUserToTeamRef.operationName = 'AddUserToTeam';
exports.addUserToTeamRef = addUserToTeamRef;

exports.addUserToTeam = function addUserToTeam(dcOrVars, vars) {
  return executeMutation(addUserToTeamRef(dcOrVars, vars));
};

const removeUserFromTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveUserFromTeam', inputVars);
}
removeUserFromTeamRef.operationName = 'RemoveUserFromTeam';
exports.removeUserFromTeamRef = removeUserFromTeamRef;

exports.removeUserFromTeam = function removeUserFromTeam(dcOrVars, vars) {
  return executeMutation(removeUserFromTeamRef(dcOrVars, vars));
};

const getUserClaimsContextRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserClaimsContext', inputVars);
}
getUserClaimsContextRef.operationName = 'GetUserClaimsContext';
exports.getUserClaimsContextRef = getUserClaimsContextRef;

exports.getUserClaimsContext = function getUserClaimsContext(dcOrVars, vars) {
  return executeQuery(getUserClaimsContextRef(dcOrVars, vars));
};

const getOrganizationDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationDetails', inputVars);
}
getOrganizationDetailsRef.operationName = 'GetOrganizationDetails';
exports.getOrganizationDetailsRef = getOrganizationDetailsRef;

exports.getOrganizationDetails = function getOrganizationDetails(dcOrVars, vars) {
  return executeQuery(getOrganizationDetailsRef(dcOrVars, vars));
};

const getAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthCode', inputVars);
}
getAuthCodeRef.operationName = 'GetAuthCode';
exports.getAuthCodeRef = getAuthCodeRef;

exports.getAuthCode = function getAuthCode(dcOrVars, vars) {
  return executeQuery(getAuthCodeRef(dcOrVars, vars));
};

const getPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPreRegistration', inputVars);
}
getPreRegistrationRef.operationName = 'GetPreRegistration';
exports.getPreRegistrationRef = getPreRegistrationRef;

exports.getPreRegistration = function getPreRegistration(dcOrVars, vars) {
  return executeQuery(getPreRegistrationRef(dcOrVars, vars));
};

const listAllPreRegistrationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPreRegistrations');
}
listAllPreRegistrationsRef.operationName = 'ListAllPreRegistrations';
exports.listAllPreRegistrationsRef = listAllPreRegistrationsRef;

exports.listAllPreRegistrations = function listAllPreRegistrations(dc) {
  return executeQuery(listAllPreRegistrationsRef(dc));
};

const listAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUsers');
}
listAllUsersRef.operationName = 'ListAllUsers';
exports.listAllUsersRef = listAllUsersRef;

exports.listAllUsers = function listAllUsers(dc) {
  return executeQuery(listAllUsersRef(dc));
};

const listAllOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllOrganizations');
}
listAllOrganizationsRef.operationName = 'ListAllOrganizations';
exports.listAllOrganizationsRef = listAllOrganizationsRef;

exports.listAllOrganizations = function listAllOrganizations(dc) {
  return executeQuery(listAllOrganizationsRef(dc));
};

const listAllUserOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUserOrganizations');
}
listAllUserOrganizationsRef.operationName = 'ListAllUserOrganizations';
exports.listAllUserOrganizationsRef = listAllUserOrganizationsRef;

exports.listAllUserOrganizations = function listAllUserOrganizations(dc) {
  return executeQuery(listAllUserOrganizationsRef(dc));
};

const listAllServiceSubscriptionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllServiceSubscriptions');
}
listAllServiceSubscriptionsRef.operationName = 'ListAllServiceSubscriptions';
exports.listAllServiceSubscriptionsRef = listAllServiceSubscriptionsRef;

exports.listAllServiceSubscriptions = function listAllServiceSubscriptions(dc) {
  return executeQuery(listAllServiceSubscriptionsRef(dc));
};

const listAllAuthCodesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuthCodes');
}
listAllAuthCodesRef.operationName = 'ListAllAuthCodes';
exports.listAllAuthCodesRef = listAllAuthCodesRef;

exports.listAllAuthCodes = function listAllAuthCodes(dc) {
  return executeQuery(listAllAuthCodesRef(dc));
};

const getApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKey', inputVars);
}
getApiKeyRef.operationName = 'GetApiKey';
exports.getApiKeyRef = getApiKeyRef;

exports.getApiKey = function getApiKey(dcOrVars, vars) {
  return executeQuery(getApiKeyRef(dcOrVars, vars));
};

const getApiKeyPermissionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKeyPermissions', inputVars);
}
getApiKeyPermissionsRef.operationName = 'GetApiKeyPermissions';
exports.getApiKeyPermissionsRef = getApiKeyPermissionsRef;

exports.getApiKeyPermissions = function getApiKeyPermissions(dcOrVars, vars) {
  return executeQuery(getApiKeyPermissionsRef(dcOrVars, vars));
};

const getThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThing', inputVars);
}
getThingRef.operationName = 'GetThing';
exports.getThingRef = getThingRef;

exports.getThing = function getThing(dcOrVars, vars) {
  return executeQuery(getThingRef(dcOrVars, vars));
};

const getThingByTokenHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThingByTokenHash', inputVars);
}
getThingByTokenHashRef.operationName = 'GetThingByTokenHash';
exports.getThingByTokenHashRef = getThingByTokenHashRef;

exports.getThingByTokenHash = function getThingByTokenHash(dcOrVars, vars) {
  return executeQuery(getThingByTokenHashRef(dcOrVars, vars));
};

const listThingsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListThingsByOrg', inputVars);
}
listThingsByOrgRef.operationName = 'ListThingsByOrg';
exports.listThingsByOrgRef = listThingsByOrgRef;

exports.listThingsByOrg = function listThingsByOrg(dcOrVars, vars) {
  return executeQuery(listThingsByOrgRef(dcOrVars, vars));
};

const listApiKeysByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListApiKeysByOrg', inputVars);
}
listApiKeysByOrgRef.operationName = 'ListApiKeysByOrg';
exports.listApiKeysByOrgRef = listApiKeysByOrgRef;

exports.listApiKeysByOrg = function listApiKeysByOrg(dcOrVars, vars) {
  return executeQuery(listApiKeysByOrgRef(dcOrVars, vars));
};

const listMembersByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMembersByOrg', inputVars);
}
listMembersByOrgRef.operationName = 'ListMembersByOrg';
exports.listMembersByOrgRef = listMembersByOrgRef;

exports.listMembersByOrg = function listMembersByOrg(dcOrVars, vars) {
  return executeQuery(listMembersByOrgRef(dcOrVars, vars));
};

const listAllThingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllThings');
}
listAllThingsRef.operationName = 'ListAllThings';
exports.listAllThingsRef = listAllThingsRef;

exports.listAllThings = function listAllThings(dc) {
  return executeQuery(listAllThingsRef(dc));
};

const listAllApiKeysRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeys');
}
listAllApiKeysRef.operationName = 'ListAllApiKeys';
exports.listAllApiKeysRef = listAllApiKeysRef;

exports.listAllApiKeys = function listAllApiKeys(dc) {
  return executeQuery(listAllApiKeysRef(dc));
};

const listAllApiKeyPermissionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeyPermissions');
}
listAllApiKeyPermissionsRef.operationName = 'ListAllApiKeyPermissions';
exports.listAllApiKeyPermissionsRef = listAllApiKeyPermissionsRef;

exports.listAllApiKeyPermissions = function listAllApiKeyPermissions(dc) {
  return executeQuery(listAllApiKeyPermissionsRef(dc));
};

const listAllAuditLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuditLogs');
}
listAllAuditLogsRef.operationName = 'ListAllAuditLogs';
exports.listAllAuditLogsRef = listAllAuditLogsRef;

exports.listAllAuditLogs = function listAllAuditLogs(dc) {
  return executeQuery(listAllAuditLogsRef(dc));
};

const listAllServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllServices');
}
listAllServicesRef.operationName = 'ListAllServices';
exports.listAllServicesRef = listAllServicesRef;

exports.listAllServices = function listAllServices(dc) {
  return executeQuery(listAllServicesRef(dc));
};

const listAllProductsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProducts');
}
listAllProductsRef.operationName = 'ListAllProducts';
exports.listAllProductsRef = listAllProductsRef;

exports.listAllProducts = function listAllProducts(dc) {
  return executeQuery(listAllProductsRef(dc));
};

const listAllInvoicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllInvoices');
}
listAllInvoicesRef.operationName = 'ListAllInvoices';
exports.listAllInvoicesRef = listAllInvoicesRef;

exports.listAllInvoices = function listAllInvoices(dc) {
  return executeQuery(listAllInvoicesRef(dc));
};

const listAllTeamsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeams');
}
listAllTeamsRef.operationName = 'ListAllTeams';
exports.listAllTeamsRef = listAllTeamsRef;

exports.listAllTeams = function listAllTeams(dc) {
  return executeQuery(listAllTeamsRef(dc));
};

const listAllTeamMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeamMembers');
}
listAllTeamMembersRef.operationName = 'ListAllTeamMembers';
exports.listAllTeamMembersRef = listAllTeamMembersRef;

exports.listAllTeamMembers = function listAllTeamMembers(dc) {
  return executeQuery(listAllTeamMembersRef(dc));
};

const listInvoicesByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesByOrg', inputVars);
}
listInvoicesByOrgRef.operationName = 'ListInvoicesByOrg';
exports.listInvoicesByOrgRef = listInvoicesByOrgRef;

exports.listInvoicesByOrg = function listInvoicesByOrg(dcOrVars, vars) {
  return executeQuery(listInvoicesByOrgRef(dcOrVars, vars));
};

const listInvoicesBySellerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesBySeller', inputVars);
}
listInvoicesBySellerRef.operationName = 'ListInvoicesBySeller';
exports.listInvoicesBySellerRef = listInvoicesBySellerRef;

exports.listInvoicesBySeller = function listInvoicesBySeller(dcOrVars, vars) {
  return executeQuery(listInvoicesBySellerRef(dcOrVars, vars));
};

const getInvoiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInvoiceDetails', inputVars);
}
getInvoiceDetailsRef.operationName = 'GetInvoiceDetails';
exports.getInvoiceDetailsRef = getInvoiceDetailsRef;

exports.getInvoiceDetails = function getInvoiceDetails(dcOrVars, vars) {
  return executeQuery(getInvoiceDetailsRef(dcOrVars, vars));
};

const getServiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceDetails', inputVars);
}
getServiceDetailsRef.operationName = 'GetServiceDetails';
exports.getServiceDetailsRef = getServiceDetailsRef;

exports.getServiceDetails = function getServiceDetails(dcOrVars, vars) {
  return executeQuery(getServiceDetailsRef(dcOrVars, vars));
};

const getProductDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductDetails', inputVars);
}
getProductDetailsRef.operationName = 'GetProductDetails';
exports.getProductDetailsRef = getProductDetailsRef;

exports.getProductDetails = function getProductDetails(dcOrVars, vars) {
  return executeQuery(getProductDetailsRef(dcOrVars, vars));
};

const getOrganizationByStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationByStripeCustomer', inputVars);
}
getOrganizationByStripeCustomerRef.operationName = 'GetOrganizationByStripeCustomer';
exports.getOrganizationByStripeCustomerRef = getOrganizationByStripeCustomerRef;

exports.getOrganizationByStripeCustomer = function getOrganizationByStripeCustomer(dcOrVars, vars) {
  return executeQuery(getOrganizationByStripeCustomerRef(dcOrVars, vars));
};

const listTeamsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamsByOrg', inputVars);
}
listTeamsByOrgRef.operationName = 'ListTeamsByOrg';
exports.listTeamsByOrgRef = listTeamsByOrgRef;

exports.listTeamsByOrg = function listTeamsByOrg(dcOrVars, vars) {
  return executeQuery(listTeamsByOrgRef(dcOrVars, vars));
};

const listTeamMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamMembers', inputVars);
}
listTeamMembersRef.operationName = 'ListTeamMembers';
exports.listTeamMembersRef = listTeamMembersRef;

exports.listTeamMembers = function listTeamMembers(dcOrVars, vars) {
  return executeQuery(listTeamMembersRef(dcOrVars, vars));
};

const listAuditLogsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditLogsByOrg', inputVars);
}
listAuditLogsByOrgRef.operationName = 'ListAuditLogsByOrg';
exports.listAuditLogsByOrgRef = listAuditLogsByOrgRef;

exports.listAuditLogsByOrg = function listAuditLogsByOrg(dcOrVars, vars) {
  return executeQuery(listAuditLogsByOrgRef(dcOrVars, vars));
};
