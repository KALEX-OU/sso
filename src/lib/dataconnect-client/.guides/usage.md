# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, createOrganization, addUserToOrganization, updateSubscriptionStatus, updateOrganizationStripeConnect, createAuthCode, deleteAuthCode, updateUserPreferences, updateOrganizationBilling, upsertPreRegistration } from '@kalex/dataconnect';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateOrganization:  For variables, look at type CreateOrganizationVars in ../index.d.ts
const { data } = await CreateOrganization(dataConnect, createOrganizationVars);

// Operation AddUserToOrganization:  For variables, look at type AddUserToOrganizationVars in ../index.d.ts
const { data } = await AddUserToOrganization(dataConnect, addUserToOrganizationVars);

// Operation UpdateSubscriptionStatus:  For variables, look at type UpdateSubscriptionStatusVars in ../index.d.ts
const { data } = await UpdateSubscriptionStatus(dataConnect, updateSubscriptionStatusVars);

// Operation UpdateOrganizationStripeConnect:  For variables, look at type UpdateOrganizationStripeConnectVars in ../index.d.ts
const { data } = await UpdateOrganizationStripeConnect(dataConnect, updateOrganizationStripeConnectVars);

// Operation CreateAuthCode:  For variables, look at type CreateAuthCodeVars in ../index.d.ts
const { data } = await CreateAuthCode(dataConnect, createAuthCodeVars);

// Operation DeleteAuthCode:  For variables, look at type DeleteAuthCodeVars in ../index.d.ts
const { data } = await DeleteAuthCode(dataConnect, deleteAuthCodeVars);

// Operation UpdateUserPreferences:  For variables, look at type UpdateUserPreferencesVars in ../index.d.ts
const { data } = await UpdateUserPreferences(dataConnect, updateUserPreferencesVars);

// Operation UpdateOrganizationBilling:  For variables, look at type UpdateOrganizationBillingVars in ../index.d.ts
const { data } = await UpdateOrganizationBilling(dataConnect, updateOrganizationBillingVars);

// Operation UpsertPreRegistration:  For variables, look at type UpsertPreRegistrationVars in ../index.d.ts
const { data } = await UpsertPreRegistration(dataConnect, upsertPreRegistrationVars);


```