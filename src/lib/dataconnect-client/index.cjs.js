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
