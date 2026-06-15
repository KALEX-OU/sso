# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getUserClaimsContext, getOrganizationDetails, getAuthCode, getPreRegistration, listAllPreRegistrations, listAllUsers, listAllOrganizations, listAllUserOrganizations, listAllServiceSubscriptions, listAllAuthCodes } from '@kalex/dataconnect';


// Operation GetUserClaimsContext:  For variables, look at type GetUserClaimsContextVars in ../index.d.ts
const { data } = await GetUserClaimsContext(dataConnect, getUserClaimsContextVars);

// Operation GetOrganizationDetails:  For variables, look at type GetOrganizationDetailsVars in ../index.d.ts
const { data } = await GetOrganizationDetails(dataConnect, getOrganizationDetailsVars);

// Operation GetAuthCode:  For variables, look at type GetAuthCodeVars in ../index.d.ts
const { data } = await GetAuthCode(dataConnect, getAuthCodeVars);

// Operation GetPreRegistration:  For variables, look at type GetPreRegistrationVars in ../index.d.ts
const { data } = await GetPreRegistration(dataConnect, getPreRegistrationVars);

// Operation ListAllPreRegistrations: 
const { data } = await ListAllPreRegistrations(dataConnect);

// Operation ListAllUsers: 
const { data } = await ListAllUsers(dataConnect);

// Operation ListAllOrganizations: 
const { data } = await ListAllOrganizations(dataConnect);

// Operation ListAllUserOrganizations: 
const { data } = await ListAllUserOrganizations(dataConnect);

// Operation ListAllServiceSubscriptions: 
const { data } = await ListAllServiceSubscriptions(dataConnect);

// Operation ListAllAuthCodes: 
const { data } = await ListAllAuthCodes(dataConnect);


```