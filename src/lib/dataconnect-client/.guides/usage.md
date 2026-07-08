# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, createOrganization, addUserToOrganization, createOrgWithOwner, updateUserOrganization, updateSubscriptionStatus, updateOrganizationStripeConnect, updateOrganizationStripeCustomer, createAuthCode, deleteAuthCode } from '@kalex/dataconnect';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateOrganization:  For variables, look at type CreateOrganizationVars in ../index.d.ts
const { data } = await CreateOrganization(dataConnect, createOrganizationVars);

// Operation AddUserToOrganization:  For variables, look at type AddUserToOrganizationVars in ../index.d.ts
const { data } = await AddUserToOrganization(dataConnect, addUserToOrganizationVars);

// Operation CreateOrgWithOwner:  For variables, look at type CreateOrgWithOwnerVars in ../index.d.ts
const { data } = await CreateOrgWithOwner(dataConnect, createOrgWithOwnerVars);

// Operation UpdateUserOrganization:  For variables, look at type UpdateUserOrganizationVars in ../index.d.ts
const { data } = await UpdateUserOrganization(dataConnect, updateUserOrganizationVars);

// Operation UpdateSubscriptionStatus:  For variables, look at type UpdateSubscriptionStatusVars in ../index.d.ts
const { data } = await UpdateSubscriptionStatus(dataConnect, updateSubscriptionStatusVars);

// Operation UpdateOrganizationStripeConnect:  For variables, look at type UpdateOrganizationStripeConnectVars in ../index.d.ts
const { data } = await UpdateOrganizationStripeConnect(dataConnect, updateOrganizationStripeConnectVars);

// Operation UpdateOrganizationStripeCustomer:  For variables, look at type UpdateOrganizationStripeCustomerVars in ../index.d.ts
const { data } = await UpdateOrganizationStripeCustomer(dataConnect, updateOrganizationStripeCustomerVars);

// Operation CreateAuthCode:  For variables, look at type CreateAuthCodeVars in ../index.d.ts
const { data } = await CreateAuthCode(dataConnect, createAuthCodeVars);

// Operation DeleteAuthCode:  For variables, look at type DeleteAuthCodeVars in ../index.d.ts
const { data } = await DeleteAuthCode(dataConnect, deleteAuthCodeVars);


```