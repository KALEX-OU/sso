const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

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
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;

const createOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrganization', inputVars);
}
createOrganizationRef.operationName = 'CreateOrganization';
exports.createOrganizationRef = createOrganizationRef;

exports.createOrganization = function createOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOrganizationRef(dcInstance, inputVars));
}
;

const addUserToOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToOrganization', inputVars);
}
addUserToOrganizationRef.operationName = 'AddUserToOrganization';
exports.addUserToOrganizationRef = addUserToOrganizationRef;

exports.addUserToOrganization = function addUserToOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addUserToOrganizationRef(dcInstance, inputVars));
}
;

const createOrgWithOwnerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrgWithOwner', inputVars);
}
createOrgWithOwnerRef.operationName = 'CreateOrgWithOwner';
exports.createOrgWithOwnerRef = createOrgWithOwnerRef;

exports.createOrgWithOwner = function createOrgWithOwner(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOrgWithOwnerRef(dcInstance, inputVars));
}
;

const updateUserOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserOrganization', inputVars);
}
updateUserOrganizationRef.operationName = 'UpdateUserOrganization';
exports.updateUserOrganizationRef = updateUserOrganizationRef;

exports.updateUserOrganization = function updateUserOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserOrganizationRef(dcInstance, inputVars));
}
;

const updateSubscriptionStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSubscriptionStatus', inputVars);
}
updateSubscriptionStatusRef.operationName = 'UpdateSubscriptionStatus';
exports.updateSubscriptionStatusRef = updateSubscriptionStatusRef;

exports.updateSubscriptionStatus = function updateSubscriptionStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateSubscriptionStatusRef(dcInstance, inputVars));
}
;

const updateOrganizationStripeConnectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeConnect', inputVars);
}
updateOrganizationStripeConnectRef.operationName = 'UpdateOrganizationStripeConnect';
exports.updateOrganizationStripeConnectRef = updateOrganizationStripeConnectRef;

exports.updateOrganizationStripeConnect = function updateOrganizationStripeConnect(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationStripeConnectRef(dcInstance, inputVars));
}
;

const updateOrganizationStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationStripeCustomer', inputVars);
}
updateOrganizationStripeCustomerRef.operationName = 'UpdateOrganizationStripeCustomer';
exports.updateOrganizationStripeCustomerRef = updateOrganizationStripeCustomerRef;

exports.updateOrganizationStripeCustomer = function updateOrganizationStripeCustomer(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationStripeCustomerRef(dcInstance, inputVars));
}
;

const createAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuthCode', inputVars);
}
createAuthCodeRef.operationName = 'CreateAuthCode';
exports.createAuthCodeRef = createAuthCodeRef;

exports.createAuthCode = function createAuthCode(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuthCodeRef(dcInstance, inputVars));
}
;

const deleteAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuthCode', inputVars);
}
deleteAuthCodeRef.operationName = 'DeleteAuthCode';
exports.deleteAuthCodeRef = deleteAuthCodeRef;

exports.deleteAuthCode = function deleteAuthCode(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuthCodeRef(dcInstance, inputVars));
}
;

const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';
exports.updateUserProfileRef = updateUserProfileRef;

exports.updateUserProfile = function updateUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserProfileRef(dcInstance, inputVars));
}
;

const updateUserMetadataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserMetadata', inputVars);
}
updateUserMetadataRef.operationName = 'UpdateUserMetadata';
exports.updateUserMetadataRef = updateUserMetadataRef;

exports.updateUserMetadata = function updateUserMetadata(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserMetadataRef(dcInstance, inputVars));
}
;

const updateOrganizationBillingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationBilling', inputVars);
}
updateOrganizationBillingRef.operationName = 'UpdateOrganizationBilling';
exports.updateOrganizationBillingRef = updateOrganizationBillingRef;

exports.updateOrganizationBilling = function updateOrganizationBilling(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationBillingRef(dcInstance, inputVars));
}
;

const updateOrganizationViesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationVies', inputVars);
}
updateOrganizationViesRef.operationName = 'UpdateOrganizationVies';
exports.updateOrganizationViesRef = updateOrganizationViesRef;

exports.updateOrganizationVies = function updateOrganizationVies(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationViesRef(dcInstance, inputVars));
}
;

const updateOrganizationAppsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationApps', inputVars);
}
updateOrganizationAppsRef.operationName = 'UpdateOrganizationApps';
exports.updateOrganizationAppsRef = updateOrganizationAppsRef;

exports.updateOrganizationApps = function updateOrganizationApps(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationAppsRef(dcInstance, inputVars));
}
;

const upsertPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPreRegistration', inputVars);
}
upsertPreRegistrationRef.operationName = 'UpsertPreRegistration';
exports.upsertPreRegistrationRef = upsertPreRegistrationRef;

exports.upsertPreRegistration = function upsertPreRegistration(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertPreRegistrationRef(dcInstance, inputVars));
}
;

const deletePreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePreRegistration', inputVars);
}
deletePreRegistrationRef.operationName = 'DeletePreRegistration';
exports.deletePreRegistrationRef = deletePreRegistrationRef;

exports.deletePreRegistration = function deletePreRegistration(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePreRegistrationRef(dcInstance, inputVars));
}
;

const confirmOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ConfirmOrganization', inputVars);
}
confirmOrganizationRef.operationName = 'ConfirmOrganization';
exports.confirmOrganizationRef = confirmOrganizationRef;

exports.confirmOrganization = function confirmOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(confirmOrganizationRef(dcInstance, inputVars));
}
;

const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';
exports.deleteUserRef = deleteUserRef;

exports.deleteUser = function deleteUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserRef(dcInstance, inputVars));
}
;

const updateOrganizationVatHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOrganizationVatHash', inputVars);
}
updateOrganizationVatHashRef.operationName = 'UpdateOrganizationVatHash';
exports.updateOrganizationVatHashRef = updateOrganizationVatHashRef;

exports.updateOrganizationVatHash = function updateOrganizationVatHash(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOrganizationVatHashRef(dcInstance, inputVars));
}
;

const deleteOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteOrganization', inputVars);
}
deleteOrganizationRef.operationName = 'DeleteOrganization';
exports.deleteOrganizationRef = deleteOrganizationRef;

exports.deleteOrganization = function deleteOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteOrganizationRef(dcInstance, inputVars));
}
;

const deleteUserOrganizationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserOrganization', inputVars);
}
deleteUserOrganizationRef.operationName = 'DeleteUserOrganization';
exports.deleteUserOrganizationRef = deleteUserOrganizationRef;

exports.deleteUserOrganization = function deleteUserOrganization(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserOrganizationRef(dcInstance, inputVars));
}
;

const deleteSubscriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSubscription', inputVars);
}
deleteSubscriptionRef.operationName = 'DeleteSubscription';
exports.deleteSubscriptionRef = deleteSubscriptionRef;

exports.deleteSubscription = function deleteSubscription(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSubscriptionRef(dcInstance, inputVars));
}
;

const createApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateApiKey', inputVars);
}
createApiKeyRef.operationName = 'CreateApiKey';
exports.createApiKeyRef = createApiKeyRef;

exports.createApiKey = function createApiKey(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createApiKeyRef(dcInstance, inputVars));
}
;

const deleteApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKey', inputVars);
}
deleteApiKeyRef.operationName = 'DeleteApiKey';
exports.deleteApiKeyRef = deleteApiKeyRef;

exports.deleteApiKey = function deleteApiKey(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteApiKeyRef(dcInstance, inputVars));
}
;

const setApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetApiKeyPermission', inputVars);
}
setApiKeyPermissionRef.operationName = 'SetApiKeyPermission';
exports.setApiKeyPermissionRef = setApiKeyPermissionRef;

exports.setApiKeyPermission = function setApiKeyPermission(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setApiKeyPermissionRef(dcInstance, inputVars));
}
;

const createThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateThing', inputVars);
}
createThingRef.operationName = 'CreateThing';
exports.createThingRef = createThingRef;

exports.createThing = function createThing(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createThingRef(dcInstance, inputVars));
}
;

const updateThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateThing', inputVars);
}
updateThingRef.operationName = 'UpdateThing';
exports.updateThingRef = updateThingRef;

exports.updateThing = function updateThing(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateThingRef(dcInstance, inputVars));
}
;

const deleteThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteThing', inputVars);
}
deleteThingRef.operationName = 'DeleteThing';
exports.deleteThingRef = deleteThingRef;

exports.deleteThing = function deleteThing(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteThingRef(dcInstance, inputVars));
}
;

const createAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditLog', inputVars);
}
createAuditLogRef.operationName = 'CreateAuditLog';
exports.createAuditLogRef = createAuditLogRef;

exports.createAuditLog = function createAuditLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuditLogRef(dcInstance, inputVars));
}
;

const deleteApiKeyPermissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApiKeyPermission', inputVars);
}
deleteApiKeyPermissionRef.operationName = 'DeleteApiKeyPermission';
exports.deleteApiKeyPermissionRef = deleteApiKeyPermissionRef;

exports.deleteApiKeyPermission = function deleteApiKeyPermission(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteApiKeyPermissionRef(dcInstance, inputVars));
}
;

const deleteAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditLog', inputVars);
}
deleteAuditLogRef.operationName = 'DeleteAuditLog';
exports.deleteAuditLogRef = deleteAuditLogRef;

exports.deleteAuditLog = function deleteAuditLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditLogRef(dcInstance, inputVars));
}
;

const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';
exports.createProductRef = createProductRef;

exports.createProduct = function createProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductRef(dcInstance, inputVars));
}
;

const deleteProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProduct', inputVars);
}
deleteProductRef.operationName = 'DeleteProduct';
exports.deleteProductRef = deleteProductRef;

exports.deleteProduct = function deleteProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteProductRef(dcInstance, inputVars));
}
;

const createProductBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProductBatch', inputVars);
}
createProductBatchRef.operationName = 'CreateProductBatch';
exports.createProductBatchRef = createProductBatchRef;

exports.createProductBatch = function createProductBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductBatchRef(dcInstance, inputVars));
}
;

const deleteProductBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProductBatch', inputVars);
}
deleteProductBatchRef.operationName = 'DeleteProductBatch';
exports.deleteProductBatchRef = deleteProductBatchRef;

exports.deleteProductBatch = function deleteProductBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteProductBatchRef(dcInstance, inputVars));
}
;

const createInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInvoice', inputVars);
}
createInvoiceRef.operationName = 'CreateInvoice';
exports.createInvoiceRef = createInvoiceRef;

exports.createInvoice = function createInvoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInvoiceRef(dcInstance, inputVars));
}
;

const updateInvoiceStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInvoiceStatus', inputVars);
}
updateInvoiceStatusRef.operationName = 'UpdateInvoiceStatus';
exports.updateInvoiceStatusRef = updateInvoiceStatusRef;

exports.updateInvoiceStatus = function updateInvoiceStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateInvoiceStatusRef(dcInstance, inputVars));
}
;

const deleteInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInvoice', inputVars);
}
deleteInvoiceRef.operationName = 'DeleteInvoice';
exports.deleteInvoiceRef = deleteInvoiceRef;

exports.deleteInvoice = function deleteInvoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteInvoiceRef(dcInstance, inputVars));
}
;

const createPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayment', inputVars);
}
createPaymentRef.operationName = 'CreatePayment';
exports.createPaymentRef = createPaymentRef;

exports.createPayment = function createPayment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPaymentRef(dcInstance, inputVars));
}
;

const updatePaymentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePaymentStatus', inputVars);
}
updatePaymentStatusRef.operationName = 'UpdatePaymentStatus';
exports.updatePaymentStatusRef = updatePaymentStatusRef;

exports.updatePaymentStatus = function updatePaymentStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePaymentStatusRef(dcInstance, inputVars));
}
;

const deletePaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePayment', inputVars);
}
deletePaymentRef.operationName = 'DeletePayment';
exports.deletePaymentRef = deletePaymentRef;

exports.deletePayment = function deletePayment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePaymentRef(dcInstance, inputVars));
}
;

const createTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTeam', inputVars);
}
createTeamRef.operationName = 'CreateTeam';
exports.createTeamRef = createTeamRef;

exports.createTeam = function createTeam(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTeamRef(dcInstance, inputVars));
}
;

const updateTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTeam', inputVars);
}
updateTeamRef.operationName = 'UpdateTeam';
exports.updateTeamRef = updateTeamRef;

exports.updateTeam = function updateTeam(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateTeamRef(dcInstance, inputVars));
}
;

const deleteTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTeam', inputVars);
}
deleteTeamRef.operationName = 'DeleteTeam';
exports.deleteTeamRef = deleteTeamRef;

exports.deleteTeam = function deleteTeam(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTeamRef(dcInstance, inputVars));
}
;

const addUserToTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddUserToTeam', inputVars);
}
addUserToTeamRef.operationName = 'AddUserToTeam';
exports.addUserToTeamRef = addUserToTeamRef;

exports.addUserToTeam = function addUserToTeam(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addUserToTeamRef(dcInstance, inputVars));
}
;

const removeUserFromTeamRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveUserFromTeam', inputVars);
}
removeUserFromTeamRef.operationName = 'RemoveUserFromTeam';
exports.removeUserFromTeamRef = removeUserFromTeamRef;

exports.removeUserFromTeam = function removeUserFromTeam(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(removeUserFromTeamRef(dcInstance, inputVars));
}
;

const createComputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCompute', inputVars);
}
createComputeRef.operationName = 'CreateCompute';
exports.createComputeRef = createComputeRef;

exports.createCompute = function createCompute(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createComputeRef(dcInstance, inputVars));
}
;

const updateComputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCompute', inputVars);
}
updateComputeRef.operationName = 'UpdateCompute';
exports.updateComputeRef = updateComputeRef;

exports.updateCompute = function updateCompute(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateComputeRef(dcInstance, inputVars));
}
;

const deleteComputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCompute', inputVars);
}
deleteComputeRef.operationName = 'DeleteCompute';
exports.deleteComputeRef = deleteComputeRef;

exports.deleteCompute = function deleteCompute(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteComputeRef(dcInstance, inputVars));
}
;

const createPriceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePrice', inputVars);
}
createPriceRef.operationName = 'CreatePrice';
exports.createPriceRef = createPriceRef;

exports.createPrice = function createPrice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPriceRef(dcInstance, inputVars));
}
;

const updatePriceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePrice', inputVars);
}
updatePriceRef.operationName = 'UpdatePrice';
exports.updatePriceRef = updatePriceRef;

exports.updatePrice = function updatePrice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePriceRef(dcInstance, inputVars));
}
;

const deletePriceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePrice', inputVars);
}
deletePriceRef.operationName = 'DeletePrice';
exports.deletePriceRef = deletePriceRef;

exports.deletePrice = function deletePrice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePriceRef(dcInstance, inputVars));
}
;

const createCheckoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCheckout', inputVars);
}
createCheckoutRef.operationName = 'CreateCheckout';
exports.createCheckoutRef = createCheckoutRef;

exports.createCheckout = function createCheckout(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCheckoutRef(dcInstance, inputVars));
}
;

const updateCheckoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCheckout', inputVars);
}
updateCheckoutRef.operationName = 'UpdateCheckout';
exports.updateCheckoutRef = updateCheckoutRef;

exports.updateCheckout = function updateCheckout(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCheckoutRef(dcInstance, inputVars));
}
;

const deleteCheckoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCheckout', inputVars);
}
deleteCheckoutRef.operationName = 'DeleteCheckout';
exports.deleteCheckoutRef = deleteCheckoutRef;

exports.deleteCheckout = function deleteCheckout(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteCheckoutRef(dcInstance, inputVars));
}
;

const createProductConsumeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProductConsume', inputVars);
}
createProductConsumeRef.operationName = 'CreateProductConsume';
exports.createProductConsumeRef = createProductConsumeRef;

exports.createProductConsume = function createProductConsume(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductConsumeRef(dcInstance, inputVars));
}
;

const updateProductConsumeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProductConsume', inputVars);
}
updateProductConsumeRef.operationName = 'UpdateProductConsume';
exports.updateProductConsumeRef = updateProductConsumeRef;

exports.updateProductConsume = function updateProductConsume(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateProductConsumeRef(dcInstance, inputVars));
}
;

const deleteProductConsumeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProductConsume', inputVars);
}
deleteProductConsumeRef.operationName = 'DeleteProductConsume';
exports.deleteProductConsumeRef = deleteProductConsumeRef;

exports.deleteProductConsume = function deleteProductConsume(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteProductConsumeRef(dcInstance, inputVars));
}
;

const getUserClaimsContextRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserClaimsContext', inputVars);
}
getUserClaimsContextRef.operationName = 'GetUserClaimsContext';
exports.getUserClaimsContextRef = getUserClaimsContextRef;

exports.getUserClaimsContext = function getUserClaimsContext(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserClaimsContextRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrganizationDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationDetails', inputVars);
}
getOrganizationDetailsRef.operationName = 'GetOrganizationDetails';
exports.getOrganizationDetailsRef = getOrganizationDetailsRef;

exports.getOrganizationDetails = function getOrganizationDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrganizationDetailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAuthCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthCode', inputVars);
}
getAuthCodeRef.operationName = 'GetAuthCode';
exports.getAuthCodeRef = getAuthCodeRef;

exports.getAuthCode = function getAuthCode(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAuthCodeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPreRegistrationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPreRegistration', inputVars);
}
getPreRegistrationRef.operationName = 'GetPreRegistration';
exports.getPreRegistrationRef = getPreRegistrationRef;

exports.getPreRegistration = function getPreRegistration(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPreRegistrationRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllPreRegistrationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPreRegistrations');
}
listAllPreRegistrationsRef.operationName = 'ListAllPreRegistrations';
exports.listAllPreRegistrationsRef = listAllPreRegistrationsRef;

exports.listAllPreRegistrations = function listAllPreRegistrations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllPreRegistrationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUsers');
}
listAllUsersRef.operationName = 'ListAllUsers';
exports.listAllUsersRef = listAllUsersRef;

exports.listAllUsers = function listAllUsers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllUsersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllOrganizations');
}
listAllOrganizationsRef.operationName = 'ListAllOrganizations';
exports.listAllOrganizationsRef = listAllOrganizationsRef;

exports.listAllOrganizations = function listAllOrganizations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllOrganizationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllUserOrganizationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllUserOrganizations');
}
listAllUserOrganizationsRef.operationName = 'ListAllUserOrganizations';
exports.listAllUserOrganizationsRef = listAllUserOrganizationsRef;

exports.listAllUserOrganizations = function listAllUserOrganizations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllUserOrganizationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllSubscriptionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllSubscriptions');
}
listAllSubscriptionsRef.operationName = 'ListAllSubscriptions';
exports.listAllSubscriptionsRef = listAllSubscriptionsRef;

exports.listAllSubscriptions = function listAllSubscriptions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllSubscriptionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getSubscriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSubscription', inputVars);
}
getSubscriptionRef.operationName = 'GetSubscription';
exports.getSubscriptionRef = getSubscriptionRef;

exports.getSubscription = function getSubscription(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getSubscriptionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllAuthCodesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuthCodes');
}
listAllAuthCodesRef.operationName = 'ListAllAuthCodes';
exports.listAllAuthCodesRef = listAllAuthCodesRef;

exports.listAllAuthCodes = function listAllAuthCodes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllAuthCodesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getApiKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKey', inputVars);
}
getApiKeyRef.operationName = 'GetApiKey';
exports.getApiKeyRef = getApiKeyRef;

exports.getApiKey = function getApiKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getApiKeyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getApiKeyPermissionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApiKeyPermissions', inputVars);
}
getApiKeyPermissionsRef.operationName = 'GetApiKeyPermissions';
exports.getApiKeyPermissionsRef = getApiKeyPermissionsRef;

exports.getApiKeyPermissions = function getApiKeyPermissions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getApiKeyPermissionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getThingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThing', inputVars);
}
getThingRef.operationName = 'GetThing';
exports.getThingRef = getThingRef;

exports.getThing = function getThing(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getThingRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getThingByTokenHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetThingByTokenHash', inputVars);
}
getThingByTokenHashRef.operationName = 'GetThingByTokenHash';
exports.getThingByTokenHashRef = getThingByTokenHashRef;

exports.getThingByTokenHash = function getThingByTokenHash(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getThingByTokenHashRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listThingsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListThingsByOrg', inputVars);
}
listThingsByOrgRef.operationName = 'ListThingsByOrg';
exports.listThingsByOrgRef = listThingsByOrgRef;

exports.listThingsByOrg = function listThingsByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listThingsByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listApiKeysByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListApiKeysByOrg', inputVars);
}
listApiKeysByOrgRef.operationName = 'ListApiKeysByOrg';
exports.listApiKeysByOrgRef = listApiKeysByOrgRef;

exports.listApiKeysByOrg = function listApiKeysByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listApiKeysByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMembersByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMembersByOrg', inputVars);
}
listMembersByOrgRef.operationName = 'ListMembersByOrg';
exports.listMembersByOrgRef = listMembersByOrgRef;

exports.listMembersByOrg = function listMembersByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMembersByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgMember', inputVars);
}
getOrgMemberRef.operationName = 'GetOrgMember';
exports.getOrgMemberRef = getOrgMemberRef;

exports.getOrgMember = function getOrgMember(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgMemberRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrgOwnerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrgOwner', inputVars);
}
getOrgOwnerRef.operationName = 'GetOrgOwner';
exports.getOrgOwnerRef = getOrgOwnerRef;

exports.getOrgOwner = function getOrgOwner(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrgOwnerRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllThingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllThings');
}
listAllThingsRef.operationName = 'ListAllThings';
exports.listAllThingsRef = listAllThingsRef;

exports.listAllThings = function listAllThings(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllThingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllApiKeysRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeys');
}
listAllApiKeysRef.operationName = 'ListAllApiKeys';
exports.listAllApiKeysRef = listAllApiKeysRef;

exports.listAllApiKeys = function listAllApiKeys(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllApiKeysRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllApiKeyPermissionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllApiKeyPermissions');
}
listAllApiKeyPermissionsRef.operationName = 'ListAllApiKeyPermissions';
exports.listAllApiKeyPermissionsRef = listAllApiKeyPermissionsRef;

exports.listAllApiKeyPermissions = function listAllApiKeyPermissions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllApiKeyPermissionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllAuditLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllAuditLogs');
}
listAllAuditLogsRef.operationName = 'ListAllAuditLogs';
exports.listAllAuditLogsRef = listAllAuditLogsRef;

exports.listAllAuditLogs = function listAllAuditLogs(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllAuditLogsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllProductsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProducts', inputVars);
}
listAllProductsRef.operationName = 'ListAllProducts';
exports.listAllProductsRef = listAllProductsRef;

exports.listAllProducts = function listAllProducts(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listAllProductsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllProductsGlobalRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProductsGlobal');
}
listAllProductsGlobalRef.operationName = 'ListAllProductsGlobal';
exports.listAllProductsGlobalRef = listAllProductsGlobalRef;

exports.listAllProductsGlobal = function listAllProductsGlobal(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllProductsGlobalRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllProductBatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllProductBatches');
}
listAllProductBatchesRef.operationName = 'ListAllProductBatches';
exports.listAllProductBatchesRef = listAllProductBatchesRef;

exports.listAllProductBatches = function listAllProductBatches(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllProductBatchesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getProductBatchesByProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductBatchesByProduct', inputVars);
}
getProductBatchesByProductRef.operationName = 'GetProductBatchesByProduct';
exports.getProductBatchesByProductRef = getProductBatchesByProductRef;

exports.getProductBatchesByProduct = function getProductBatchesByProduct(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductBatchesByProductRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllInvoicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllInvoices');
}
listAllInvoicesRef.operationName = 'ListAllInvoices';
exports.listAllInvoicesRef = listAllInvoicesRef;

exports.listAllInvoices = function listAllInvoices(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllInvoicesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllTeamsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeams');
}
listAllTeamsRef.operationName = 'ListAllTeams';
exports.listAllTeamsRef = listAllTeamsRef;

exports.listAllTeams = function listAllTeams(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllTeamsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllTeamMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTeamMembers');
}
listAllTeamMembersRef.operationName = 'ListAllTeamMembers';
exports.listAllTeamMembersRef = listAllTeamMembersRef;

exports.listAllTeamMembers = function listAllTeamMembers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllTeamMembersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listInvoicesByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesByOrg', inputVars);
}
listInvoicesByOrgRef.operationName = 'ListInvoicesByOrg';
exports.listInvoicesByOrgRef = listInvoicesByOrgRef;

exports.listInvoicesByOrg = function listInvoicesByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listInvoicesByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listInvoicesBySellerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesBySeller', inputVars);
}
listInvoicesBySellerRef.operationName = 'ListInvoicesBySeller';
exports.listInvoicesBySellerRef = listInvoicesBySellerRef;

exports.listInvoicesBySeller = function listInvoicesBySeller(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listInvoicesBySellerRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPaymentsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPaymentsByOrg', inputVars);
}
listPaymentsByOrgRef.operationName = 'ListPaymentsByOrg';
exports.listPaymentsByOrgRef = listPaymentsByOrgRef;

exports.listPaymentsByOrg = function listPaymentsByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPaymentsByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPaymentsBySellerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPaymentsBySeller', inputVars);
}
listPaymentsBySellerRef.operationName = 'ListPaymentsBySeller';
exports.listPaymentsBySellerRef = listPaymentsBySellerRef;

exports.listPaymentsBySeller = function listPaymentsBySeller(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPaymentsBySellerRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getInvoiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInvoiceDetails', inputVars);
}
getInvoiceDetailsRef.operationName = 'GetInvoiceDetails';
exports.getInvoiceDetailsRef = getInvoiceDetailsRef;

exports.getInvoiceDetails = function getInvoiceDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInvoiceDetailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getOrganizationByStripeCustomerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrganizationByStripeCustomer', inputVars);
}
getOrganizationByStripeCustomerRef.operationName = 'GetOrganizationByStripeCustomer';
exports.getOrganizationByStripeCustomerRef = getOrganizationByStripeCustomerRef;

exports.getOrganizationByStripeCustomer = function getOrganizationByStripeCustomer(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getOrganizationByStripeCustomerRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listTeamsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamsByOrg', inputVars);
}
listTeamsByOrgRef.operationName = 'ListTeamsByOrg';
exports.listTeamsByOrgRef = listTeamsByOrgRef;

exports.listTeamsByOrg = function listTeamsByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listTeamsByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listTeamMembersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeamMembers', inputVars);
}
listTeamMembersRef.operationName = 'ListTeamMembers';
exports.listTeamMembersRef = listTeamMembersRef;

exports.listTeamMembers = function listTeamMembers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listTeamMembersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAuditLogsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditLogsByOrg', inputVars);
}
listAuditLogsByOrgRef.operationName = 'ListAuditLogsByOrg';
exports.listAuditLogsByOrgRef = listAuditLogsByOrgRef;

exports.listAuditLogsByOrg = function listAuditLogsByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listAuditLogsByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const checkVatNumberExistsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CheckVatNumberExists', inputVars);
}
checkVatNumberExistsRef.operationName = 'CheckVatNumberExists';
exports.checkVatNumberExistsRef = checkVatNumberExistsRef;

exports.checkVatNumberExists = function checkVatNumberExists(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(checkVatNumberExistsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getComputeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompute', inputVars);
}
getComputeRef.operationName = 'GetCompute';
exports.getComputeRef = getComputeRef;

exports.getCompute = function getCompute(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getComputeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listComputesByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListComputesByOrg', inputVars);
}
listComputesByOrgRef.operationName = 'ListComputesByOrg';
exports.listComputesByOrgRef = listComputesByOrgRef;

exports.listComputesByOrg = function listComputesByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listComputesByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getProductConsumeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductConsume', inputVars);
}
getProductConsumeRef.operationName = 'GetProductConsume';
exports.getProductConsumeRef = getProductConsumeRef;

exports.getProductConsume = function getProductConsume(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductConsumeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listProductConsumesByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductConsumesByOrg', inputVars);
}
listProductConsumesByOrgRef.operationName = 'ListProductConsumesByOrg';
exports.listProductConsumesByOrgRef = listProductConsumesByOrgRef;

exports.listProductConsumesByOrg = function listProductConsumesByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listProductConsumesByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPriceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPrice', inputVars);
}
getPriceRef.operationName = 'GetPrice';
exports.getPriceRef = getPriceRef;

exports.getPrice = function getPrice(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPriceRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listPricesByProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPricesByProduct', inputVars);
}
listPricesByProductRef.operationName = 'ListPricesByProduct';
exports.listPricesByProductRef = listPricesByProductRef;

exports.listPricesByProduct = function listPricesByProduct(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPricesByProductRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllPricesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPrices');
}
listAllPricesRef.operationName = 'ListAllPrices';
exports.listAllPricesRef = listAllPricesRef;

exports.listAllPrices = function listAllPrices(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllPricesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCheckoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCheckout', inputVars);
}
getCheckoutRef.operationName = 'GetCheckout';
exports.getCheckoutRef = getCheckoutRef;

exports.getCheckout = function getCheckout(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCheckoutRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCheckoutsByOrgRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCheckoutsByOrg', inputVars);
}
listCheckoutsByOrgRef.operationName = 'ListCheckoutsByOrg';
exports.listCheckoutsByOrgRef = listCheckoutsByOrgRef;

exports.listCheckoutsByOrg = function listCheckoutsByOrg(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCheckoutsByOrgRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listAllCheckoutsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllCheckouts');
}
listAllCheckoutsRef.operationName = 'ListAllCheckouts';
exports.listAllCheckoutsRef = listAllCheckoutsRef;

exports.listAllCheckouts = function listAllCheckouts(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllCheckoutsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayment', inputVars);
}
getPaymentRef.operationName = 'GetPayment';
exports.getPaymentRef = getPaymentRef;

exports.getPayment = function getPayment(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPaymentRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getProductDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProductDetails', inputVars);
}
getProductDetailsRef.operationName = 'GetProductDetails';
exports.getProductDetailsRef = getProductDetailsRef;

exports.getProductDetails = function getProductDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductDetailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
