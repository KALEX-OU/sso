# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserClaimsContext*](#getuserclaimscontext)
  - [*GetOrganizationDetails*](#getorganizationdetails)
  - [*GetAuthCode*](#getauthcode)
  - [*GetPreRegistration*](#getpreregistration)
  - [*ListAllPreRegistrations*](#listallpreregistrations)
  - [*ListAllUsers*](#listallusers)
  - [*ListAllOrganizations*](#listallorganizations)
  - [*ListAllUserOrganizations*](#listalluserorganizations)
  - [*ListAllServiceSubscriptions*](#listallservicesubscriptions)
  - [*ListAllAuthCodes*](#listallauthcodes)
  - [*GetApiKey*](#getapikey)
  - [*GetApiKeyPermissions*](#getapikeypermissions)
  - [*GetThing*](#getthing)
  - [*GetThingByTokenHash*](#getthingbytokenhash)
  - [*ListThingsByOrg*](#listthingsbyorg)
  - [*ListApiKeysByOrg*](#listapikeysbyorg)
  - [*ListMembersByOrg*](#listmembersbyorg)
  - [*ListAllThings*](#listallthings)
  - [*ListAllApiKeys*](#listallapikeys)
  - [*ListAllApiKeyPermissions*](#listallapikeypermissions)
  - [*ListAllAuditLogs*](#listallauditlogs)
  - [*ListAllServices*](#listallservices)
  - [*ListAllProducts*](#listallproducts)
  - [*ListAllInvoices*](#listallinvoices)
  - [*ListAllTeams*](#listallteams)
  - [*ListAllTeamMembers*](#listallteammembers)
  - [*ListInvoicesByOrg*](#listinvoicesbyorg)
  - [*GetInvoiceDetails*](#getinvoicedetails)
  - [*GetServiceDetails*](#getservicedetails)
  - [*GetProductDetails*](#getproductdetails)
  - [*ListTeamsByOrg*](#listteamsbyorg)
  - [*ListTeamMembers*](#listteammembers)
  - [*ListAuditLogsByOrg*](#listauditlogsbyorg)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*CreateOrganization*](#createorganization)
  - [*AddUserToOrganization*](#addusertoorganization)
  - [*UpdateSubscriptionStatus*](#updatesubscriptionstatus)
  - [*UpdateOrganizationStripeConnect*](#updateorganizationstripeconnect)
  - [*CreateAuthCode*](#createauthcode)
  - [*DeleteAuthCode*](#deleteauthcode)
  - [*UpdateUserPreferences*](#updateuserpreferences)
  - [*UpdateOrganizationBilling*](#updateorganizationbilling)
  - [*UpsertPreRegistration*](#upsertpreregistration)
  - [*DeletePreRegistration*](#deletepreregistration)
  - [*ConfirmOrganization*](#confirmorganization)
  - [*DeleteUser*](#deleteuser)
  - [*DeleteOrganization*](#deleteorganization)
  - [*DeleteUserOrganization*](#deleteuserorganization)
  - [*DeleteServiceSubscription*](#deleteservicesubscription)
  - [*CreateApiKey*](#createapikey)
  - [*DeleteApiKey*](#deleteapikey)
  - [*UpsertApiKeyPermission*](#upsertapikeypermission)
  - [*CreateThing*](#creatething)
  - [*UpdateThing*](#updatething)
  - [*DeleteThing*](#deletething)
  - [*CreateAuditLog*](#createauditlog)
  - [*DeleteApiKeyPermission*](#deleteapikeypermission)
  - [*DeleteAuditLog*](#deleteauditlog)
  - [*CreateService*](#createservice)
  - [*DeleteService*](#deleteservice)
  - [*CreateProduct*](#createproduct)
  - [*DeleteProduct*](#deleteproduct)
  - [*CreateInvoice*](#createinvoice)
  - [*DeleteInvoice*](#deleteinvoice)
  - [*CreateTeam*](#createteam)
  - [*DeleteTeam*](#deleteteam)
  - [*AddUserToTeam*](#addusertoteam)
  - [*RemoveUserFromTeam*](#removeuserfromteam)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@kalex/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@kalex/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@kalex/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserClaimsContext
You can execute the `GetUserClaimsContext` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getUserClaimsContext(vars: GetUserClaimsContextVariables): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

interface GetUserClaimsContextRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
}
export const getUserClaimsContextRef: GetUserClaimsContextRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserClaimsContext(dc: DataConnect, vars: GetUserClaimsContextVariables): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

interface GetUserClaimsContextRef {
  ...
  (dc: DataConnect, vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
}
export const getUserClaimsContextRef: GetUserClaimsContextRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserClaimsContextRef:
```typescript
const name = getUserClaimsContextRef.operationName;
console.log(name);
```

### Variables
The `GetUserClaimsContext` query requires an argument of type `GetUserClaimsContextVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserClaimsContextVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetUserClaimsContext` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserClaimsContextData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
        isTest: boolean;
        viesValidated: boolean;
        country: string;
        vatNumber?: string | null;
        sdiCode?: string | null;
        officeCode?: string | null;
        cigCode?: string | null;
        cupCode?: string | null;
        stripeCustomerId?: string | null;
        stripeConnectAccountId?: string | null;
        stripeConnectOnboarded?: boolean | null;
        address?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        altitude?: number | null;
        metadata?: unknown | null;
        serviceSubscriptions_on_organization: ({
          service: {
            serviceId: string;
          } & Service_Key;
            status: string;
            tier?: string | null;
            expiresAt?: TimestampString | null;
        })[];
      } & Organization_Key;
    })[];
  } & User_Key;
}
```
### Using `GetUserClaimsContext`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserClaimsContext, GetUserClaimsContextVariables } from '@kalex/dataconnect';

// The `GetUserClaimsContext` query requires an argument of type `GetUserClaimsContextVariables`:
const getUserClaimsContextVars: GetUserClaimsContextVariables = {
  uid: ..., 
};

// Call the `getUserClaimsContext()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserClaimsContext(getUserClaimsContextVars);
// Variables can be defined inline as well.
const { data } = await getUserClaimsContext({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserClaimsContext(dataConnect, getUserClaimsContextVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserClaimsContext(getUserClaimsContextVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserClaimsContext`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserClaimsContextRef, GetUserClaimsContextVariables } from '@kalex/dataconnect';

// The `GetUserClaimsContext` query requires an argument of type `GetUserClaimsContextVariables`:
const getUserClaimsContextVars: GetUserClaimsContextVariables = {
  uid: ..., 
};

// Call the `getUserClaimsContextRef()` function to get a reference to the query.
const ref = getUserClaimsContextRef(getUserClaimsContextVars);
// Variables can be defined inline as well.
const ref = getUserClaimsContextRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserClaimsContextRef(dataConnect, getUserClaimsContextVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetOrganizationDetails
You can execute the `GetOrganizationDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getOrganizationDetails(vars: GetOrganizationDetailsVariables): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

interface GetOrganizationDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
}
export const getOrganizationDetailsRef: GetOrganizationDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrganizationDetails(dc: DataConnect, vars: GetOrganizationDetailsVariables): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

interface GetOrganizationDetailsRef {
  ...
  (dc: DataConnect, vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
}
export const getOrganizationDetailsRef: GetOrganizationDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrganizationDetailsRef:
```typescript
const name = getOrganizationDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetOrganizationDetails` query requires an argument of type `GetOrganizationDetailsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrganizationDetailsVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `GetOrganizationDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrganizationDetailsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrganizationDetailsData {
  organization?: {
    orgId: string;
    name: string;
    type: string;
    country: string;
    isTest: boolean;
    viesValidated: boolean;
    address?: string | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
  } & Organization_Key;
}
```
### Using `GetOrganizationDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrganizationDetails, GetOrganizationDetailsVariables } from '@kalex/dataconnect';

// The `GetOrganizationDetails` query requires an argument of type `GetOrganizationDetailsVariables`:
const getOrganizationDetailsVars: GetOrganizationDetailsVariables = {
  orgId: ..., 
};

// Call the `getOrganizationDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrganizationDetails(getOrganizationDetailsVars);
// Variables can be defined inline as well.
const { data } = await getOrganizationDetails({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrganizationDetails(dataConnect, getOrganizationDetailsVars);

console.log(data.organization);

// Or, you can use the `Promise` API.
getOrganizationDetails(getOrganizationDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.organization);
});
```

### Using `GetOrganizationDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrganizationDetailsRef, GetOrganizationDetailsVariables } from '@kalex/dataconnect';

// The `GetOrganizationDetails` query requires an argument of type `GetOrganizationDetailsVariables`:
const getOrganizationDetailsVars: GetOrganizationDetailsVariables = {
  orgId: ..., 
};

// Call the `getOrganizationDetailsRef()` function to get a reference to the query.
const ref = getOrganizationDetailsRef(getOrganizationDetailsVars);
// Variables can be defined inline as well.
const ref = getOrganizationDetailsRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrganizationDetailsRef(dataConnect, getOrganizationDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.organization);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.organization);
});
```

## GetAuthCode
You can execute the `GetAuthCode` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getAuthCode(vars: GetAuthCodeVariables): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

interface GetAuthCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
}
export const getAuthCodeRef: GetAuthCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAuthCode(dc: DataConnect, vars: GetAuthCodeVariables): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

interface GetAuthCodeRef {
  ...
  (dc: DataConnect, vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
}
export const getAuthCodeRef: GetAuthCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAuthCodeRef:
```typescript
const name = getAuthCodeRef.operationName;
console.log(name);
```

### Variables
The `GetAuthCode` query requires an argument of type `GetAuthCodeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAuthCodeVariables {
  code: string;
}
```
### Return Type
Recall that executing the `GetAuthCode` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAuthCodeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAuthCodeData {
  authCode?: {
    code: string;
    userUid: string;
    clientId: string;
    redirectUri: string;
    expiresAt: TimestampString;
  } & AuthCode_Key;
}
```
### Using `GetAuthCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAuthCode, GetAuthCodeVariables } from '@kalex/dataconnect';

// The `GetAuthCode` query requires an argument of type `GetAuthCodeVariables`:
const getAuthCodeVars: GetAuthCodeVariables = {
  code: ..., 
};

// Call the `getAuthCode()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAuthCode(getAuthCodeVars);
// Variables can be defined inline as well.
const { data } = await getAuthCode({ code: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAuthCode(dataConnect, getAuthCodeVars);

console.log(data.authCode);

// Or, you can use the `Promise` API.
getAuthCode(getAuthCodeVars).then((response) => {
  const data = response.data;
  console.log(data.authCode);
});
```

### Using `GetAuthCode`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAuthCodeRef, GetAuthCodeVariables } from '@kalex/dataconnect';

// The `GetAuthCode` query requires an argument of type `GetAuthCodeVariables`:
const getAuthCodeVars: GetAuthCodeVariables = {
  code: ..., 
};

// Call the `getAuthCodeRef()` function to get a reference to the query.
const ref = getAuthCodeRef(getAuthCodeVars);
// Variables can be defined inline as well.
const ref = getAuthCodeRef({ code: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAuthCodeRef(dataConnect, getAuthCodeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.authCode);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.authCode);
});
```

## GetPreRegistration
You can execute the `GetPreRegistration` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getPreRegistration(vars: GetPreRegistrationVariables): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

interface GetPreRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
}
export const getPreRegistrationRef: GetPreRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPreRegistration(dc: DataConnect, vars: GetPreRegistrationVariables): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

interface GetPreRegistrationRef {
  ...
  (dc: DataConnect, vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
}
export const getPreRegistrationRef: GetPreRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPreRegistrationRef:
```typescript
const name = getPreRegistrationRef.operationName;
console.log(name);
```

### Variables
The `GetPreRegistration` query requires an argument of type `GetPreRegistrationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPreRegistrationVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetPreRegistration` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPreRegistrationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    altitude?: number | null;
    metadata?: unknown | null;
  } & PreRegistration_Key;
}
```
### Using `GetPreRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPreRegistration, GetPreRegistrationVariables } from '@kalex/dataconnect';

// The `GetPreRegistration` query requires an argument of type `GetPreRegistrationVariables`:
const getPreRegistrationVars: GetPreRegistrationVariables = {
  email: ..., 
};

// Call the `getPreRegistration()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPreRegistration(getPreRegistrationVars);
// Variables can be defined inline as well.
const { data } = await getPreRegistration({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPreRegistration(dataConnect, getPreRegistrationVars);

console.log(data.preRegistration);

// Or, you can use the `Promise` API.
getPreRegistration(getPreRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.preRegistration);
});
```

### Using `GetPreRegistration`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPreRegistrationRef, GetPreRegistrationVariables } from '@kalex/dataconnect';

// The `GetPreRegistration` query requires an argument of type `GetPreRegistrationVariables`:
const getPreRegistrationVars: GetPreRegistrationVariables = {
  email: ..., 
};

// Call the `getPreRegistrationRef()` function to get a reference to the query.
const ref = getPreRegistrationRef(getPreRegistrationVars);
// Variables can be defined inline as well.
const ref = getPreRegistrationRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPreRegistrationRef(dataConnect, getPreRegistrationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.preRegistration);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.preRegistration);
});
```

## ListAllPreRegistrations
You can execute the `ListAllPreRegistrations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllPreRegistrations(): QueryPromise<ListAllPreRegistrationsData, undefined>;

interface ListAllPreRegistrationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPreRegistrationsData, undefined>;
}
export const listAllPreRegistrationsRef: ListAllPreRegistrationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllPreRegistrations(dc: DataConnect): QueryPromise<ListAllPreRegistrationsData, undefined>;

interface ListAllPreRegistrationsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllPreRegistrationsData, undefined>;
}
export const listAllPreRegistrationsRef: ListAllPreRegistrationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllPreRegistrationsRef:
```typescript
const name = listAllPreRegistrationsRef.operationName;
console.log(name);
```

### Variables
The `ListAllPreRegistrations` query has no variables.
### Return Type
Recall that executing the `ListAllPreRegistrations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllPreRegistrationsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllPreRegistrationsData {
  preRegistrations: ({
    email: string;
  } & PreRegistration_Key)[];
}
```
### Using `ListAllPreRegistrations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllPreRegistrations } from '@kalex/dataconnect';


// Call the `listAllPreRegistrations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllPreRegistrations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllPreRegistrations(dataConnect);

console.log(data.preRegistrations);

// Or, you can use the `Promise` API.
listAllPreRegistrations().then((response) => {
  const data = response.data;
  console.log(data.preRegistrations);
});
```

### Using `ListAllPreRegistrations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllPreRegistrationsRef } from '@kalex/dataconnect';


// Call the `listAllPreRegistrationsRef()` function to get a reference to the query.
const ref = listAllPreRegistrationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllPreRegistrationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.preRegistrations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.preRegistrations);
});
```

## ListAllUsers
You can execute the `ListAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllUsers(): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllUsers` query has no variables.
### Return Type
Recall that executing the `ListAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    uid: string;
    email: string;
  } & User_Key)[];
}
```
### Using `ListAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers } from '@kalex/dataconnect';


// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef } from '@kalex/dataconnect';


// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListAllOrganizations
You can execute the `ListAllOrganizations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllOrganizations(): QueryPromise<ListAllOrganizationsData, undefined>;

interface ListAllOrganizationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllOrganizationsData, undefined>;
}
export const listAllOrganizationsRef: ListAllOrganizationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllOrganizations(dc: DataConnect): QueryPromise<ListAllOrganizationsData, undefined>;

interface ListAllOrganizationsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllOrganizationsData, undefined>;
}
export const listAllOrganizationsRef: ListAllOrganizationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllOrganizationsRef:
```typescript
const name = listAllOrganizationsRef.operationName;
console.log(name);
```

### Variables
The `ListAllOrganizations` query has no variables.
### Return Type
Recall that executing the `ListAllOrganizations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllOrganizationsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllOrganizationsData {
  organizations: ({
    orgId: string;
    stripeCustomerId?: string | null;
  } & Organization_Key)[];
}
```
### Using `ListAllOrganizations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllOrganizations } from '@kalex/dataconnect';


// Call the `listAllOrganizations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllOrganizations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllOrganizations(dataConnect);

console.log(data.organizations);

// Or, you can use the `Promise` API.
listAllOrganizations().then((response) => {
  const data = response.data;
  console.log(data.organizations);
});
```

### Using `ListAllOrganizations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllOrganizationsRef } from '@kalex/dataconnect';


// Call the `listAllOrganizationsRef()` function to get a reference to the query.
const ref = listAllOrganizationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllOrganizationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.organizations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.organizations);
});
```

## ListAllUserOrganizations
You can execute the `ListAllUserOrganizations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllUserOrganizations(): QueryPromise<ListAllUserOrganizationsData, undefined>;

interface ListAllUserOrganizationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUserOrganizationsData, undefined>;
}
export const listAllUserOrganizationsRef: ListAllUserOrganizationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUserOrganizations(dc: DataConnect): QueryPromise<ListAllUserOrganizationsData, undefined>;

interface ListAllUserOrganizationsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUserOrganizationsData, undefined>;
}
export const listAllUserOrganizationsRef: ListAllUserOrganizationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUserOrganizationsRef:
```typescript
const name = listAllUserOrganizationsRef.operationName;
console.log(name);
```

### Variables
The `ListAllUserOrganizations` query has no variables.
### Return Type
Recall that executing the `ListAllUserOrganizations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUserOrganizationsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUserOrganizationsData {
  userOrganizations: ({
    user: {
      uid: string;
    } & User_Key;
      organization: {
        orgId: string;
      } & Organization_Key;
  })[];
}
```
### Using `ListAllUserOrganizations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUserOrganizations } from '@kalex/dataconnect';


// Call the `listAllUserOrganizations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUserOrganizations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUserOrganizations(dataConnect);

console.log(data.userOrganizations);

// Or, you can use the `Promise` API.
listAllUserOrganizations().then((response) => {
  const data = response.data;
  console.log(data.userOrganizations);
});
```

### Using `ListAllUserOrganizations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUserOrganizationsRef } from '@kalex/dataconnect';


// Call the `listAllUserOrganizationsRef()` function to get a reference to the query.
const ref = listAllUserOrganizationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUserOrganizationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userOrganizations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganizations);
});
```

## ListAllServiceSubscriptions
You can execute the `ListAllServiceSubscriptions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllServiceSubscriptions(): QueryPromise<ListAllServiceSubscriptionsData, undefined>;

interface ListAllServiceSubscriptionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServiceSubscriptionsData, undefined>;
}
export const listAllServiceSubscriptionsRef: ListAllServiceSubscriptionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllServiceSubscriptions(dc: DataConnect): QueryPromise<ListAllServiceSubscriptionsData, undefined>;

interface ListAllServiceSubscriptionsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllServiceSubscriptionsData, undefined>;
}
export const listAllServiceSubscriptionsRef: ListAllServiceSubscriptionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllServiceSubscriptionsRef:
```typescript
const name = listAllServiceSubscriptionsRef.operationName;
console.log(name);
```

### Variables
The `ListAllServiceSubscriptions` query has no variables.
### Return Type
Recall that executing the `ListAllServiceSubscriptions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllServiceSubscriptionsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllServiceSubscriptionsData {
  serviceSubscriptions: ({
    organization: {
      orgId: string;
    } & Organization_Key;
      service: {
        serviceId: string;
      } & Service_Key;
  })[];
}
```
### Using `ListAllServiceSubscriptions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllServiceSubscriptions } from '@kalex/dataconnect';


// Call the `listAllServiceSubscriptions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllServiceSubscriptions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllServiceSubscriptions(dataConnect);

console.log(data.serviceSubscriptions);

// Or, you can use the `Promise` API.
listAllServiceSubscriptions().then((response) => {
  const data = response.data;
  console.log(data.serviceSubscriptions);
});
```

### Using `ListAllServiceSubscriptions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllServiceSubscriptionsRef } from '@kalex/dataconnect';


// Call the `listAllServiceSubscriptionsRef()` function to get a reference to the query.
const ref = listAllServiceSubscriptionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllServiceSubscriptionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceSubscriptions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceSubscriptions);
});
```

## ListAllAuthCodes
You can execute the `ListAllAuthCodes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllAuthCodes(): QueryPromise<ListAllAuthCodesData, undefined>;

interface ListAllAuthCodesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuthCodesData, undefined>;
}
export const listAllAuthCodesRef: ListAllAuthCodesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllAuthCodes(dc: DataConnect): QueryPromise<ListAllAuthCodesData, undefined>;

interface ListAllAuthCodesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllAuthCodesData, undefined>;
}
export const listAllAuthCodesRef: ListAllAuthCodesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllAuthCodesRef:
```typescript
const name = listAllAuthCodesRef.operationName;
console.log(name);
```

### Variables
The `ListAllAuthCodes` query has no variables.
### Return Type
Recall that executing the `ListAllAuthCodes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllAuthCodesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllAuthCodesData {
  authCodes: ({
    code: string;
  } & AuthCode_Key)[];
}
```
### Using `ListAllAuthCodes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllAuthCodes } from '@kalex/dataconnect';


// Call the `listAllAuthCodes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllAuthCodes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllAuthCodes(dataConnect);

console.log(data.authCodes);

// Or, you can use the `Promise` API.
listAllAuthCodes().then((response) => {
  const data = response.data;
  console.log(data.authCodes);
});
```

### Using `ListAllAuthCodes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllAuthCodesRef } from '@kalex/dataconnect';


// Call the `listAllAuthCodesRef()` function to get a reference to the query.
const ref = listAllAuthCodesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllAuthCodesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.authCodes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.authCodes);
});
```

## GetApiKey
You can execute the `GetApiKey` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getApiKey(vars: GetApiKeyVariables): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

interface GetApiKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
}
export const getApiKeyRef: GetApiKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getApiKey(dc: DataConnect, vars: GetApiKeyVariables): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

interface GetApiKeyRef {
  ...
  (dc: DataConnect, vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
}
export const getApiKeyRef: GetApiKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getApiKeyRef:
```typescript
const name = getApiKeyRef.operationName;
console.log(name);
```

### Variables
The `GetApiKey` query requires an argument of type `GetApiKeyVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetApiKeyVariables {
  keyHash: string;
}
```
### Return Type
Recall that executing the `GetApiKey` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetApiKeyData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetApiKeyData {
  apiKey?: {
    keyHash: string;
    user?: {
      uid: string;
      email: string;
    } & User_Key;
      thing?: {
        thingId: string;
        name: string;
      } & Thing_Key;
        orgId: string;
        name: string;
        description?: string | null;
        ipWhitelist: unknown;
        isActive: boolean;
        expiresAt?: TimestampString | null;
        isTest: boolean;
        createdAt: TimestampString;
  } & ApiKey_Key;
}
```
### Using `GetApiKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getApiKey, GetApiKeyVariables } from '@kalex/dataconnect';

// The `GetApiKey` query requires an argument of type `GetApiKeyVariables`:
const getApiKeyVars: GetApiKeyVariables = {
  keyHash: ..., 
};

// Call the `getApiKey()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getApiKey(getApiKeyVars);
// Variables can be defined inline as well.
const { data } = await getApiKey({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getApiKey(dataConnect, getApiKeyVars);

console.log(data.apiKey);

// Or, you can use the `Promise` API.
getApiKey(getApiKeyVars).then((response) => {
  const data = response.data;
  console.log(data.apiKey);
});
```

### Using `GetApiKey`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getApiKeyRef, GetApiKeyVariables } from '@kalex/dataconnect';

// The `GetApiKey` query requires an argument of type `GetApiKeyVariables`:
const getApiKeyVars: GetApiKeyVariables = {
  keyHash: ..., 
};

// Call the `getApiKeyRef()` function to get a reference to the query.
const ref = getApiKeyRef(getApiKeyVars);
// Variables can be defined inline as well.
const ref = getApiKeyRef({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getApiKeyRef(dataConnect, getApiKeyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.apiKey);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKey);
});
```

## GetApiKeyPermissions
You can execute the `GetApiKeyPermissions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getApiKeyPermissions(vars: GetApiKeyPermissionsVariables): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

interface GetApiKeyPermissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
}
export const getApiKeyPermissionsRef: GetApiKeyPermissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getApiKeyPermissions(dc: DataConnect, vars: GetApiKeyPermissionsVariables): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

interface GetApiKeyPermissionsRef {
  ...
  (dc: DataConnect, vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
}
export const getApiKeyPermissionsRef: GetApiKeyPermissionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getApiKeyPermissionsRef:
```typescript
const name = getApiKeyPermissionsRef.operationName;
console.log(name);
```

### Variables
The `GetApiKeyPermissions` query requires an argument of type `GetApiKeyPermissionsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetApiKeyPermissionsVariables {
  keyHash: string;
}
```
### Return Type
Recall that executing the `GetApiKeyPermissions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetApiKeyPermissionsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    allowedFields: unknown;
  } & ApiKeyPermission_Key)[];
}
```
### Using `GetApiKeyPermissions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getApiKeyPermissions, GetApiKeyPermissionsVariables } from '@kalex/dataconnect';

// The `GetApiKeyPermissions` query requires an argument of type `GetApiKeyPermissionsVariables`:
const getApiKeyPermissionsVars: GetApiKeyPermissionsVariables = {
  keyHash: ..., 
};

// Call the `getApiKeyPermissions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getApiKeyPermissions(getApiKeyPermissionsVars);
// Variables can be defined inline as well.
const { data } = await getApiKeyPermissions({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getApiKeyPermissions(dataConnect, getApiKeyPermissionsVars);

console.log(data.apiKeyPermissions);

// Or, you can use the `Promise` API.
getApiKeyPermissions(getApiKeyPermissionsVars).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermissions);
});
```

### Using `GetApiKeyPermissions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getApiKeyPermissionsRef, GetApiKeyPermissionsVariables } from '@kalex/dataconnect';

// The `GetApiKeyPermissions` query requires an argument of type `GetApiKeyPermissionsVariables`:
const getApiKeyPermissionsVars: GetApiKeyPermissionsVariables = {
  keyHash: ..., 
};

// Call the `getApiKeyPermissionsRef()` function to get a reference to the query.
const ref = getApiKeyPermissionsRef(getApiKeyPermissionsVars);
// Variables can be defined inline as well.
const ref = getApiKeyPermissionsRef({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getApiKeyPermissionsRef(dataConnect, getApiKeyPermissionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.apiKeyPermissions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermissions);
});
```

## GetThing
You can execute the `GetThing` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getThing(vars: GetThingVariables): QueryPromise<GetThingData, GetThingVariables>;

interface GetThingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
}
export const getThingRef: GetThingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getThing(dc: DataConnect, vars: GetThingVariables): QueryPromise<GetThingData, GetThingVariables>;

interface GetThingRef {
  ...
  (dc: DataConnect, vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
}
export const getThingRef: GetThingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getThingRef:
```typescript
const name = getThingRef.operationName;
console.log(name);
```

### Variables
The `GetThing` query requires an argument of type `GetThingVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetThingVariables {
  thingId: string;
}
```
### Return Type
Recall that executing the `GetThing` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetThingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetThingData {
  thing?: {
    thingId: string;
    orgId: string;
    name: string;
    type: string;
    status: string;
    deviceTokenHash: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Thing_Key;
}
```
### Using `GetThing`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getThing, GetThingVariables } from '@kalex/dataconnect';

// The `GetThing` query requires an argument of type `GetThingVariables`:
const getThingVars: GetThingVariables = {
  thingId: ..., 
};

// Call the `getThing()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getThing(getThingVars);
// Variables can be defined inline as well.
const { data } = await getThing({ thingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getThing(dataConnect, getThingVars);

console.log(data.thing);

// Or, you can use the `Promise` API.
getThing(getThingVars).then((response) => {
  const data = response.data;
  console.log(data.thing);
});
```

### Using `GetThing`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getThingRef, GetThingVariables } from '@kalex/dataconnect';

// The `GetThing` query requires an argument of type `GetThingVariables`:
const getThingVars: GetThingVariables = {
  thingId: ..., 
};

// Call the `getThingRef()` function to get a reference to the query.
const ref = getThingRef(getThingVars);
// Variables can be defined inline as well.
const ref = getThingRef({ thingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getThingRef(dataConnect, getThingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.thing);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.thing);
});
```

## GetThingByTokenHash
You can execute the `GetThingByTokenHash` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getThingByTokenHash(vars: GetThingByTokenHashVariables): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

interface GetThingByTokenHashRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
}
export const getThingByTokenHashRef: GetThingByTokenHashRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getThingByTokenHash(dc: DataConnect, vars: GetThingByTokenHashVariables): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

interface GetThingByTokenHashRef {
  ...
  (dc: DataConnect, vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
}
export const getThingByTokenHashRef: GetThingByTokenHashRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getThingByTokenHashRef:
```typescript
const name = getThingByTokenHashRef.operationName;
console.log(name);
```

### Variables
The `GetThingByTokenHash` query requires an argument of type `GetThingByTokenHashVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetThingByTokenHashVariables {
  deviceTokenHash: string;
}
```
### Return Type
Recall that executing the `GetThingByTokenHash` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetThingByTokenHashData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetThingByTokenHashData {
  things: ({
    thingId: string;
    orgId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Thing_Key)[];
}
```
### Using `GetThingByTokenHash`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getThingByTokenHash, GetThingByTokenHashVariables } from '@kalex/dataconnect';

// The `GetThingByTokenHash` query requires an argument of type `GetThingByTokenHashVariables`:
const getThingByTokenHashVars: GetThingByTokenHashVariables = {
  deviceTokenHash: ..., 
};

// Call the `getThingByTokenHash()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getThingByTokenHash(getThingByTokenHashVars);
// Variables can be defined inline as well.
const { data } = await getThingByTokenHash({ deviceTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getThingByTokenHash(dataConnect, getThingByTokenHashVars);

console.log(data.things);

// Or, you can use the `Promise` API.
getThingByTokenHash(getThingByTokenHashVars).then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

### Using `GetThingByTokenHash`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getThingByTokenHashRef, GetThingByTokenHashVariables } from '@kalex/dataconnect';

// The `GetThingByTokenHash` query requires an argument of type `GetThingByTokenHashVariables`:
const getThingByTokenHashVars: GetThingByTokenHashVariables = {
  deviceTokenHash: ..., 
};

// Call the `getThingByTokenHashRef()` function to get a reference to the query.
const ref = getThingByTokenHashRef(getThingByTokenHashVars);
// Variables can be defined inline as well.
const ref = getThingByTokenHashRef({ deviceTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getThingByTokenHashRef(dataConnect, getThingByTokenHashVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.things);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

## ListThingsByOrg
You can execute the `ListThingsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listThingsByOrg(vars: ListThingsByOrgVariables): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

interface ListThingsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
}
export const listThingsByOrgRef: ListThingsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listThingsByOrg(dc: DataConnect, vars: ListThingsByOrgVariables): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

interface ListThingsByOrgRef {
  ...
  (dc: DataConnect, vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
}
export const listThingsByOrgRef: ListThingsByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listThingsByOrgRef:
```typescript
const name = listThingsByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListThingsByOrg` query requires an argument of type `ListThingsByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListThingsByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListThingsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListThingsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListThingsByOrgData {
  things: ({
    thingId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Thing_Key)[];
}
```
### Using `ListThingsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listThingsByOrg, ListThingsByOrgVariables } from '@kalex/dataconnect';

// The `ListThingsByOrg` query requires an argument of type `ListThingsByOrgVariables`:
const listThingsByOrgVars: ListThingsByOrgVariables = {
  orgId: ..., 
};

// Call the `listThingsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listThingsByOrg(listThingsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listThingsByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listThingsByOrg(dataConnect, listThingsByOrgVars);

console.log(data.things);

// Or, you can use the `Promise` API.
listThingsByOrg(listThingsByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

### Using `ListThingsByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listThingsByOrgRef, ListThingsByOrgVariables } from '@kalex/dataconnect';

// The `ListThingsByOrg` query requires an argument of type `ListThingsByOrgVariables`:
const listThingsByOrgVars: ListThingsByOrgVariables = {
  orgId: ..., 
};

// Call the `listThingsByOrgRef()` function to get a reference to the query.
const ref = listThingsByOrgRef(listThingsByOrgVars);
// Variables can be defined inline as well.
const ref = listThingsByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listThingsByOrgRef(dataConnect, listThingsByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.things);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

## ListApiKeysByOrg
You can execute the `ListApiKeysByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listApiKeysByOrg(vars: ListApiKeysByOrgVariables): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

interface ListApiKeysByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
}
export const listApiKeysByOrgRef: ListApiKeysByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listApiKeysByOrg(dc: DataConnect, vars: ListApiKeysByOrgVariables): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

interface ListApiKeysByOrgRef {
  ...
  (dc: DataConnect, vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
}
export const listApiKeysByOrgRef: ListApiKeysByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listApiKeysByOrgRef:
```typescript
const name = listApiKeysByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListApiKeysByOrg` query requires an argument of type `ListApiKeysByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListApiKeysByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListApiKeysByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListApiKeysByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListApiKeysByOrgData {
  apiKeys: ({
    keyHash: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKey_Key)[];
}
```
### Using `ListApiKeysByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listApiKeysByOrg, ListApiKeysByOrgVariables } from '@kalex/dataconnect';

// The `ListApiKeysByOrg` query requires an argument of type `ListApiKeysByOrgVariables`:
const listApiKeysByOrgVars: ListApiKeysByOrgVariables = {
  orgId: ..., 
};

// Call the `listApiKeysByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listApiKeysByOrg(listApiKeysByOrgVars);
// Variables can be defined inline as well.
const { data } = await listApiKeysByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listApiKeysByOrg(dataConnect, listApiKeysByOrgVars);

console.log(data.apiKeys);

// Or, you can use the `Promise` API.
listApiKeysByOrg(listApiKeysByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.apiKeys);
});
```

### Using `ListApiKeysByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listApiKeysByOrgRef, ListApiKeysByOrgVariables } from '@kalex/dataconnect';

// The `ListApiKeysByOrg` query requires an argument of type `ListApiKeysByOrgVariables`:
const listApiKeysByOrgVars: ListApiKeysByOrgVariables = {
  orgId: ..., 
};

// Call the `listApiKeysByOrgRef()` function to get a reference to the query.
const ref = listApiKeysByOrgRef(listApiKeysByOrgVars);
// Variables can be defined inline as well.
const ref = listApiKeysByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listApiKeysByOrgRef(dataConnect, listApiKeysByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.apiKeys);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeys);
});
```

## ListMembersByOrg
You can execute the `ListMembersByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listMembersByOrg(vars: ListMembersByOrgVariables): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

interface ListMembersByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
}
export const listMembersByOrgRef: ListMembersByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMembersByOrg(dc: DataConnect, vars: ListMembersByOrgVariables): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

interface ListMembersByOrgRef {
  ...
  (dc: DataConnect, vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
}
export const listMembersByOrgRef: ListMembersByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMembersByOrgRef:
```typescript
const name = listMembersByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListMembersByOrg` query requires an argument of type `ListMembersByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMembersByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListMembersByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMembersByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMembersByOrgData {
  userOrganizations: ({
    role: string;
    joinedAt: TimestampString;
    user: {
      uid: string;
      email: string;
      fullName?: string | null;
      avatarUrl?: string | null;
    } & User_Key;
  })[];
}
```
### Using `ListMembersByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMembersByOrg, ListMembersByOrgVariables } from '@kalex/dataconnect';

// The `ListMembersByOrg` query requires an argument of type `ListMembersByOrgVariables`:
const listMembersByOrgVars: ListMembersByOrgVariables = {
  orgId: ..., 
};

// Call the `listMembersByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMembersByOrg(listMembersByOrgVars);
// Variables can be defined inline as well.
const { data } = await listMembersByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMembersByOrg(dataConnect, listMembersByOrgVars);

console.log(data.userOrganizations);

// Or, you can use the `Promise` API.
listMembersByOrg(listMembersByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganizations);
});
```

### Using `ListMembersByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMembersByOrgRef, ListMembersByOrgVariables } from '@kalex/dataconnect';

// The `ListMembersByOrg` query requires an argument of type `ListMembersByOrgVariables`:
const listMembersByOrgVars: ListMembersByOrgVariables = {
  orgId: ..., 
};

// Call the `listMembersByOrgRef()` function to get a reference to the query.
const ref = listMembersByOrgRef(listMembersByOrgVars);
// Variables can be defined inline as well.
const ref = listMembersByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMembersByOrgRef(dataConnect, listMembersByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userOrganizations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganizations);
});
```

## ListAllThings
You can execute the `ListAllThings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllThings(): QueryPromise<ListAllThingsData, undefined>;

interface ListAllThingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllThingsData, undefined>;
}
export const listAllThingsRef: ListAllThingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllThings(dc: DataConnect): QueryPromise<ListAllThingsData, undefined>;

interface ListAllThingsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllThingsData, undefined>;
}
export const listAllThingsRef: ListAllThingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllThingsRef:
```typescript
const name = listAllThingsRef.operationName;
console.log(name);
```

### Variables
The `ListAllThings` query has no variables.
### Return Type
Recall that executing the `ListAllThings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllThingsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllThingsData {
  things: ({
    thingId: string;
  } & Thing_Key)[];
}
```
### Using `ListAllThings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllThings } from '@kalex/dataconnect';


// Call the `listAllThings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllThings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllThings(dataConnect);

console.log(data.things);

// Or, you can use the `Promise` API.
listAllThings().then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

### Using `ListAllThings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllThingsRef } from '@kalex/dataconnect';


// Call the `listAllThingsRef()` function to get a reference to the query.
const ref = listAllThingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllThingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.things);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.things);
});
```

## ListAllApiKeys
You can execute the `ListAllApiKeys` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllApiKeys(): QueryPromise<ListAllApiKeysData, undefined>;

interface ListAllApiKeysRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeysData, undefined>;
}
export const listAllApiKeysRef: ListAllApiKeysRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllApiKeys(dc: DataConnect): QueryPromise<ListAllApiKeysData, undefined>;

interface ListAllApiKeysRef {
  ...
  (dc: DataConnect): QueryRef<ListAllApiKeysData, undefined>;
}
export const listAllApiKeysRef: ListAllApiKeysRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllApiKeysRef:
```typescript
const name = listAllApiKeysRef.operationName;
console.log(name);
```

### Variables
The `ListAllApiKeys` query has no variables.
### Return Type
Recall that executing the `ListAllApiKeys` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllApiKeysData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllApiKeysData {
  apiKeys: ({
    keyHash: string;
  } & ApiKey_Key)[];
}
```
### Using `ListAllApiKeys`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllApiKeys } from '@kalex/dataconnect';


// Call the `listAllApiKeys()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllApiKeys();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllApiKeys(dataConnect);

console.log(data.apiKeys);

// Or, you can use the `Promise` API.
listAllApiKeys().then((response) => {
  const data = response.data;
  console.log(data.apiKeys);
});
```

### Using `ListAllApiKeys`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllApiKeysRef } from '@kalex/dataconnect';


// Call the `listAllApiKeysRef()` function to get a reference to the query.
const ref = listAllApiKeysRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllApiKeysRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.apiKeys);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeys);
});
```

## ListAllApiKeyPermissions
You can execute the `ListAllApiKeyPermissions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllApiKeyPermissions(): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

interface ListAllApiKeyPermissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeyPermissionsData, undefined>;
}
export const listAllApiKeyPermissionsRef: ListAllApiKeyPermissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllApiKeyPermissions(dc: DataConnect): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

interface ListAllApiKeyPermissionsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllApiKeyPermissionsData, undefined>;
}
export const listAllApiKeyPermissionsRef: ListAllApiKeyPermissionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllApiKeyPermissionsRef:
```typescript
const name = listAllApiKeyPermissionsRef.operationName;
console.log(name);
```

### Variables
The `ListAllApiKeyPermissions` query has no variables.
### Return Type
Recall that executing the `ListAllApiKeyPermissions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllApiKeyPermissionsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllApiKeyPermissionsData {
  apiKeyPermissions: ({
    keyHash: string;
    moduleId: string;
  } & ApiKeyPermission_Key)[];
}
```
### Using `ListAllApiKeyPermissions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllApiKeyPermissions } from '@kalex/dataconnect';


// Call the `listAllApiKeyPermissions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllApiKeyPermissions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllApiKeyPermissions(dataConnect);

console.log(data.apiKeyPermissions);

// Or, you can use the `Promise` API.
listAllApiKeyPermissions().then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermissions);
});
```

### Using `ListAllApiKeyPermissions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllApiKeyPermissionsRef } from '@kalex/dataconnect';


// Call the `listAllApiKeyPermissionsRef()` function to get a reference to the query.
const ref = listAllApiKeyPermissionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllApiKeyPermissionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.apiKeyPermissions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermissions);
});
```

## ListAllAuditLogs
You can execute the `ListAllAuditLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllAuditLogs(): QueryPromise<ListAllAuditLogsData, undefined>;

interface ListAllAuditLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuditLogsData, undefined>;
}
export const listAllAuditLogsRef: ListAllAuditLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllAuditLogs(dc: DataConnect): QueryPromise<ListAllAuditLogsData, undefined>;

interface ListAllAuditLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllAuditLogsData, undefined>;
}
export const listAllAuditLogsRef: ListAllAuditLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllAuditLogsRef:
```typescript
const name = listAllAuditLogsRef.operationName;
console.log(name);
```

### Variables
The `ListAllAuditLogs` query has no variables.
### Return Type
Recall that executing the `ListAllAuditLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllAuditLogsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllAuditLogsData {
  auditLogs: ({
    logId: string;
  } & AuditLog_Key)[];
}
```
### Using `ListAllAuditLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllAuditLogs } from '@kalex/dataconnect';


// Call the `listAllAuditLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllAuditLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllAuditLogs(dataConnect);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
listAllAuditLogs().then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

### Using `ListAllAuditLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllAuditLogsRef } from '@kalex/dataconnect';


// Call the `listAllAuditLogsRef()` function to get a reference to the query.
const ref = listAllAuditLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllAuditLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

## ListAllServices
You can execute the `ListAllServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllServices(): QueryPromise<ListAllServicesData, undefined>;

interface ListAllServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServicesData, undefined>;
}
export const listAllServicesRef: ListAllServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllServices(dc: DataConnect): QueryPromise<ListAllServicesData, undefined>;

interface ListAllServicesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllServicesData, undefined>;
}
export const listAllServicesRef: ListAllServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllServicesRef:
```typescript
const name = listAllServicesRef.operationName;
console.log(name);
```

### Variables
The `ListAllServices` query has no variables.
### Return Type
Recall that executing the `ListAllServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllServicesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllServicesData {
  services: ({
    serviceId: string;
    name: string;
    type: string;
    isActive: boolean;
  } & Service_Key)[];
}
```
### Using `ListAllServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllServices } from '@kalex/dataconnect';


// Call the `listAllServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
listAllServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `ListAllServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllServicesRef } from '@kalex/dataconnect';


// Call the `listAllServicesRef()` function to get a reference to the query.
const ref = listAllServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## ListAllProducts
You can execute the `ListAllProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllProducts(): QueryPromise<ListAllProductsData, undefined>;

interface ListAllProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProductsData, undefined>;
}
export const listAllProductsRef: ListAllProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllProducts(dc: DataConnect): QueryPromise<ListAllProductsData, undefined>;

interface ListAllProductsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllProductsData, undefined>;
}
export const listAllProductsRef: ListAllProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllProductsRef:
```typescript
const name = listAllProductsRef.operationName;
console.log(name);
```

### Variables
The `ListAllProducts` query has no variables.
### Return Type
Recall that executing the `ListAllProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllProductsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllProductsData {
  products: ({
    productId: string;
    name: string;
    type: string;
    sku?: string | null;
    price: number;
    isActive: boolean;
  } & Product_Key)[];
}
```
### Using `ListAllProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllProducts } from '@kalex/dataconnect';


// Call the `listAllProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllProducts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllProducts(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
listAllProducts().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListAllProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllProductsRef } from '@kalex/dataconnect';


// Call the `listAllProductsRef()` function to get a reference to the query.
const ref = listAllProductsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllProductsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListAllInvoices
You can execute the `ListAllInvoices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllInvoices(): QueryPromise<ListAllInvoicesData, undefined>;

interface ListAllInvoicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllInvoicesData, undefined>;
}
export const listAllInvoicesRef: ListAllInvoicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllInvoices(dc: DataConnect): QueryPromise<ListAllInvoicesData, undefined>;

interface ListAllInvoicesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllInvoicesData, undefined>;
}
export const listAllInvoicesRef: ListAllInvoicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllInvoicesRef:
```typescript
const name = listAllInvoicesRef.operationName;
console.log(name);
```

### Variables
The `ListAllInvoices` query has no variables.
### Return Type
Recall that executing the `ListAllInvoices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllInvoicesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllInvoicesData {
  invoices: ({
    invoiceId: string;
    amount: number;
    status: string;
  } & Invoice_Key)[];
}
```
### Using `ListAllInvoices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllInvoices } from '@kalex/dataconnect';


// Call the `listAllInvoices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllInvoices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllInvoices(dataConnect);

console.log(data.invoices);

// Or, you can use the `Promise` API.
listAllInvoices().then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `ListAllInvoices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllInvoicesRef } from '@kalex/dataconnect';


// Call the `listAllInvoicesRef()` function to get a reference to the query.
const ref = listAllInvoicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllInvoicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

## ListAllTeams
You can execute the `ListAllTeams` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllTeams(): QueryPromise<ListAllTeamsData, undefined>;

interface ListAllTeamsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamsData, undefined>;
}
export const listAllTeamsRef: ListAllTeamsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllTeams(dc: DataConnect): QueryPromise<ListAllTeamsData, undefined>;

interface ListAllTeamsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllTeamsData, undefined>;
}
export const listAllTeamsRef: ListAllTeamsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllTeamsRef:
```typescript
const name = listAllTeamsRef.operationName;
console.log(name);
```

### Variables
The `ListAllTeams` query has no variables.
### Return Type
Recall that executing the `ListAllTeams` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllTeamsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllTeamsData {
  teams: ({
    teamId: string;
    organization: {
      orgId: string;
    } & Organization_Key;
  } & Team_Key)[];
}
```
### Using `ListAllTeams`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllTeams } from '@kalex/dataconnect';


// Call the `listAllTeams()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllTeams();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllTeams(dataConnect);

console.log(data.teams);

// Or, you can use the `Promise` API.
listAllTeams().then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

### Using `ListAllTeams`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllTeamsRef } from '@kalex/dataconnect';


// Call the `listAllTeamsRef()` function to get a reference to the query.
const ref = listAllTeamsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllTeamsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.teams);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

## ListAllTeamMembers
You can execute the `ListAllTeamMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllTeamMembers(): QueryPromise<ListAllTeamMembersData, undefined>;

interface ListAllTeamMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamMembersData, undefined>;
}
export const listAllTeamMembersRef: ListAllTeamMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllTeamMembers(dc: DataConnect): QueryPromise<ListAllTeamMembersData, undefined>;

interface ListAllTeamMembersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllTeamMembersData, undefined>;
}
export const listAllTeamMembersRef: ListAllTeamMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllTeamMembersRef:
```typescript
const name = listAllTeamMembersRef.operationName;
console.log(name);
```

### Variables
The `ListAllTeamMembers` query has no variables.
### Return Type
Recall that executing the `ListAllTeamMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllTeamMembersData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllTeamMembersData {
  teamMembers: ({
    user: {
      uid: string;
    } & User_Key;
      team: {
        teamId: string;
      } & Team_Key;
  })[];
}
```
### Using `ListAllTeamMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllTeamMembers } from '@kalex/dataconnect';


// Call the `listAllTeamMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllTeamMembers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllTeamMembers(dataConnect);

console.log(data.teamMembers);

// Or, you can use the `Promise` API.
listAllTeamMembers().then((response) => {
  const data = response.data;
  console.log(data.teamMembers);
});
```

### Using `ListAllTeamMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllTeamMembersRef } from '@kalex/dataconnect';


// Call the `listAllTeamMembersRef()` function to get a reference to the query.
const ref = listAllTeamMembersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllTeamMembersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.teamMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMembers);
});
```

## ListInvoicesByOrg
You can execute the `ListInvoicesByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listInvoicesByOrg(vars: ListInvoicesByOrgVariables): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

interface ListInvoicesByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
}
export const listInvoicesByOrgRef: ListInvoicesByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInvoicesByOrg(dc: DataConnect, vars: ListInvoicesByOrgVariables): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

interface ListInvoicesByOrgRef {
  ...
  (dc: DataConnect, vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
}
export const listInvoicesByOrgRef: ListInvoicesByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInvoicesByOrgRef:
```typescript
const name = listInvoicesByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListInvoicesByOrg` query requires an argument of type `ListInvoicesByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListInvoicesByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListInvoicesByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInvoicesByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInvoicesByOrgData {
  invoices: ({
    invoiceId: string;
    amount: number;
    status: string;
    pdfUrl?: string | null;
    createdAt: TimestampString;
  } & Invoice_Key)[];
}
```
### Using `ListInvoicesByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInvoicesByOrg, ListInvoicesByOrgVariables } from '@kalex/dataconnect';

// The `ListInvoicesByOrg` query requires an argument of type `ListInvoicesByOrgVariables`:
const listInvoicesByOrgVars: ListInvoicesByOrgVariables = {
  orgId: ..., 
};

// Call the `listInvoicesByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInvoicesByOrg(listInvoicesByOrgVars);
// Variables can be defined inline as well.
const { data } = await listInvoicesByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInvoicesByOrg(dataConnect, listInvoicesByOrgVars);

console.log(data.invoices);

// Or, you can use the `Promise` API.
listInvoicesByOrg(listInvoicesByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `ListInvoicesByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInvoicesByOrgRef, ListInvoicesByOrgVariables } from '@kalex/dataconnect';

// The `ListInvoicesByOrg` query requires an argument of type `ListInvoicesByOrgVariables`:
const listInvoicesByOrgVars: ListInvoicesByOrgVariables = {
  orgId: ..., 
};

// Call the `listInvoicesByOrgRef()` function to get a reference to the query.
const ref = listInvoicesByOrgRef(listInvoicesByOrgVars);
// Variables can be defined inline as well.
const ref = listInvoicesByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInvoicesByOrgRef(dataConnect, listInvoicesByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

## GetInvoiceDetails
You can execute the `GetInvoiceDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getInvoiceDetails(vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetInvoiceDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetInvoiceDetailsRef {
  ...
  (dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInvoiceDetailsRef:
```typescript
const name = getInvoiceDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInvoiceDetailsVariables {
  invoiceId: string;
}
```
### Return Type
Recall that executing the `GetInvoiceDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInvoiceDetailsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInvoiceDetailsData {
  invoice?: {
    invoiceId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organization_Key;
      seller: {
        orgId: string;
        name: string;
      } & Organization_Key;
        amount: number;
        status: string;
        pdfUrl?: string | null;
        products?: unknown | null;
        services?: unknown | null;
        createdAt: TimestampString;
  } & Invoice_Key;
}
```
### Using `GetInvoiceDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInvoiceDetails, GetInvoiceDetailsVariables } from '@kalex/dataconnect';

// The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`:
const getInvoiceDetailsVars: GetInvoiceDetailsVariables = {
  invoiceId: ..., 
};

// Call the `getInvoiceDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInvoiceDetails(getInvoiceDetailsVars);
// Variables can be defined inline as well.
const { data } = await getInvoiceDetails({ invoiceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInvoiceDetails(dataConnect, getInvoiceDetailsVars);

console.log(data.invoice);

// Or, you can use the `Promise` API.
getInvoiceDetails(getInvoiceDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.invoice);
});
```

### Using `GetInvoiceDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInvoiceDetailsRef, GetInvoiceDetailsVariables } from '@kalex/dataconnect';

// The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`:
const getInvoiceDetailsVars: GetInvoiceDetailsVariables = {
  invoiceId: ..., 
};

// Call the `getInvoiceDetailsRef()` function to get a reference to the query.
const ref = getInvoiceDetailsRef(getInvoiceDetailsVars);
// Variables can be defined inline as well.
const ref = getInvoiceDetailsRef({ invoiceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInvoiceDetailsRef(dataConnect, getInvoiceDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoice);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice);
});
```

## GetServiceDetails
You can execute the `GetServiceDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getServiceDetails(vars: GetServiceDetailsVariables): QueryPromise<GetServiceDetailsData, GetServiceDetailsVariables>;

interface GetServiceDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceDetailsVariables): QueryRef<GetServiceDetailsData, GetServiceDetailsVariables>;
}
export const getServiceDetailsRef: GetServiceDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceDetails(dc: DataConnect, vars: GetServiceDetailsVariables): QueryPromise<GetServiceDetailsData, GetServiceDetailsVariables>;

interface GetServiceDetailsRef {
  ...
  (dc: DataConnect, vars: GetServiceDetailsVariables): QueryRef<GetServiceDetailsData, GetServiceDetailsVariables>;
}
export const getServiceDetailsRef: GetServiceDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceDetailsRef:
```typescript
const name = getServiceDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetServiceDetails` query requires an argument of type `GetServiceDetailsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceDetailsVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `GetServiceDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceDetailsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceDetailsData {
  service?: {
    serviceId: string;
    name: string;
    description?: string | null;
    type: string;
    priceModel?: string | null;
    priceText?: string | null;
    isActive: boolean;
    isTest: boolean;
    createdAt: TimestampString;
  } & Service_Key;
}
```
### Using `GetServiceDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceDetails, GetServiceDetailsVariables } from '@kalex/dataconnect';

// The `GetServiceDetails` query requires an argument of type `GetServiceDetailsVariables`:
const getServiceDetailsVars: GetServiceDetailsVariables = {
  serviceId: ..., 
};

// Call the `getServiceDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceDetails(getServiceDetailsVars);
// Variables can be defined inline as well.
const { data } = await getServiceDetails({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceDetails(dataConnect, getServiceDetailsVars);

console.log(data.service);

// Or, you can use the `Promise` API.
getServiceDetails(getServiceDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

### Using `GetServiceDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceDetailsRef, GetServiceDetailsVariables } from '@kalex/dataconnect';

// The `GetServiceDetails` query requires an argument of type `GetServiceDetailsVariables`:
const getServiceDetailsVars: GetServiceDetailsVariables = {
  serviceId: ..., 
};

// Call the `getServiceDetailsRef()` function to get a reference to the query.
const ref = getServiceDetailsRef(getServiceDetailsVars);
// Variables can be defined inline as well.
const ref = getServiceDetailsRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceDetailsRef(dataConnect, getServiceDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.service);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

## GetProductDetails
You can execute the `GetProductDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getProductDetails(vars: GetProductDetailsVariables): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

interface GetProductDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
}
export const getProductDetailsRef: GetProductDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

interface GetProductDetailsRef {
  ...
  (dc: DataConnect, vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
}
export const getProductDetailsRef: GetProductDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductDetailsRef:
```typescript
const name = getProductDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetProductDetails` query requires an argument of type `GetProductDetailsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductDetailsVariables {
  productId: string;
}
```
### Return Type
Recall that executing the `GetProductDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductDetailsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductDetailsData {
  product?: {
    productId: string;
    name: string;
    description?: string | null;
    type: string;
    sku?: string | null;
    price: number;
    isActive: boolean;
    isTest: boolean;
    createdAt: TimestampString;
  } & Product_Key;
}
```
### Using `GetProductDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductDetails, GetProductDetailsVariables } from '@kalex/dataconnect';

// The `GetProductDetails` query requires an argument of type `GetProductDetailsVariables`:
const getProductDetailsVars: GetProductDetailsVariables = {
  productId: ..., 
};

// Call the `getProductDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductDetails(getProductDetailsVars);
// Variables can be defined inline as well.
const { data } = await getProductDetails({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductDetails(dataConnect, getProductDetailsVars);

console.log(data.product);

// Or, you can use the `Promise` API.
getProductDetails(getProductDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

### Using `GetProductDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductDetailsRef, GetProductDetailsVariables } from '@kalex/dataconnect';

// The `GetProductDetails` query requires an argument of type `GetProductDetailsVariables`:
const getProductDetailsVars: GetProductDetailsVariables = {
  productId: ..., 
};

// Call the `getProductDetailsRef()` function to get a reference to the query.
const ref = getProductDetailsRef(getProductDetailsVars);
// Variables can be defined inline as well.
const ref = getProductDetailsRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductDetailsRef(dataConnect, getProductDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.product);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

## ListTeamsByOrg
You can execute the `ListTeamsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listTeamsByOrg(vars: ListTeamsByOrgVariables): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

interface ListTeamsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
}
export const listTeamsByOrgRef: ListTeamsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeamsByOrg(dc: DataConnect, vars: ListTeamsByOrgVariables): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

interface ListTeamsByOrgRef {
  ...
  (dc: DataConnect, vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
}
export const listTeamsByOrgRef: ListTeamsByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTeamsByOrgRef:
```typescript
const name = listTeamsByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListTeamsByOrg` query requires an argument of type `ListTeamsByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTeamsByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListTeamsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTeamsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTeamsByOrgData {
  teams: ({
    teamId: string;
    name: string;
    createdAt: TimestampString;
  } & Team_Key)[];
}
```
### Using `ListTeamsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTeamsByOrg, ListTeamsByOrgVariables } from '@kalex/dataconnect';

// The `ListTeamsByOrg` query requires an argument of type `ListTeamsByOrgVariables`:
const listTeamsByOrgVars: ListTeamsByOrgVariables = {
  orgId: ..., 
};

// Call the `listTeamsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTeamsByOrg(listTeamsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listTeamsByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTeamsByOrg(dataConnect, listTeamsByOrgVars);

console.log(data.teams);

// Or, you can use the `Promise` API.
listTeamsByOrg(listTeamsByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

### Using `ListTeamsByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTeamsByOrgRef, ListTeamsByOrgVariables } from '@kalex/dataconnect';

// The `ListTeamsByOrg` query requires an argument of type `ListTeamsByOrgVariables`:
const listTeamsByOrgVars: ListTeamsByOrgVariables = {
  orgId: ..., 
};

// Call the `listTeamsByOrgRef()` function to get a reference to the query.
const ref = listTeamsByOrgRef(listTeamsByOrgVars);
// Variables can be defined inline as well.
const ref = listTeamsByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTeamsByOrgRef(dataConnect, listTeamsByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.teams);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

## ListTeamMembers
You can execute the `ListTeamMembers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listTeamMembers(vars: ListTeamMembersVariables): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

interface ListTeamMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
}
export const listTeamMembersRef: ListTeamMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeamMembers(dc: DataConnect, vars: ListTeamMembersVariables): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

interface ListTeamMembersRef {
  ...
  (dc: DataConnect, vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
}
export const listTeamMembersRef: ListTeamMembersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTeamMembersRef:
```typescript
const name = listTeamMembersRef.operationName;
console.log(name);
```

### Variables
The `ListTeamMembers` query requires an argument of type `ListTeamMembersVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTeamMembersVariables {
  teamId: string;
}
```
### Return Type
Recall that executing the `ListTeamMembers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTeamMembersData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTeamMembersData {
  teamMembers: ({
    joinedAt: TimestampString;
    user: {
      uid: string;
      email: string;
      fullName?: string | null;
      avatarUrl?: string | null;
    } & User_Key;
  })[];
}
```
### Using `ListTeamMembers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTeamMembers, ListTeamMembersVariables } from '@kalex/dataconnect';

// The `ListTeamMembers` query requires an argument of type `ListTeamMembersVariables`:
const listTeamMembersVars: ListTeamMembersVariables = {
  teamId: ..., 
};

// Call the `listTeamMembers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTeamMembers(listTeamMembersVars);
// Variables can be defined inline as well.
const { data } = await listTeamMembers({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTeamMembers(dataConnect, listTeamMembersVars);

console.log(data.teamMembers);

// Or, you can use the `Promise` API.
listTeamMembers(listTeamMembersVars).then((response) => {
  const data = response.data;
  console.log(data.teamMembers);
});
```

### Using `ListTeamMembers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTeamMembersRef, ListTeamMembersVariables } from '@kalex/dataconnect';

// The `ListTeamMembers` query requires an argument of type `ListTeamMembersVariables`:
const listTeamMembersVars: ListTeamMembersVariables = {
  teamId: ..., 
};

// Call the `listTeamMembersRef()` function to get a reference to the query.
const ref = listTeamMembersRef(listTeamMembersVars);
// Variables can be defined inline as well.
const ref = listTeamMembersRef({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTeamMembersRef(dataConnect, listTeamMembersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.teamMembers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMembers);
});
```

## ListAuditLogsByOrg
You can execute the `ListAuditLogsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAuditLogsByOrg(vars: ListAuditLogsByOrgVariables): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

interface ListAuditLogsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
}
export const listAuditLogsByOrgRef: ListAuditLogsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAuditLogsByOrg(dc: DataConnect, vars: ListAuditLogsByOrgVariables): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

interface ListAuditLogsByOrgRef {
  ...
  (dc: DataConnect, vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
}
export const listAuditLogsByOrgRef: ListAuditLogsByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAuditLogsByOrgRef:
```typescript
const name = listAuditLogsByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListAuditLogsByOrg` query requires an argument of type `ListAuditLogsByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAuditLogsByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListAuditLogsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAuditLogsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAuditLogsByOrgData {
  auditLogs: ({
    logId: string;
  } & AuditLog_Key)[];
}
```
### Using `ListAuditLogsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAuditLogsByOrg, ListAuditLogsByOrgVariables } from '@kalex/dataconnect';

// The `ListAuditLogsByOrg` query requires an argument of type `ListAuditLogsByOrgVariables`:
const listAuditLogsByOrgVars: ListAuditLogsByOrgVariables = {
  orgId: ..., 
};

// Call the `listAuditLogsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAuditLogsByOrg(listAuditLogsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listAuditLogsByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAuditLogsByOrg(dataConnect, listAuditLogsByOrgVars);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
listAuditLogsByOrg(listAuditLogsByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

### Using `ListAuditLogsByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAuditLogsByOrgRef, ListAuditLogsByOrgVariables } from '@kalex/dataconnect';

// The `ListAuditLogsByOrg` query requires an argument of type `ListAuditLogsByOrgVariables`:
const listAuditLogsByOrgVars: ListAuditLogsByOrgVariables = {
  orgId: ..., 
};

// Call the `listAuditLogsByOrgRef()` function to get a reference to the query.
const ref = listAuditLogsByOrgRef(listAuditLogsByOrgVars);
// Variables can be defined inline as well.
const ref = listAuditLogsByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAuditLogsByOrgRef(dataConnect, listAuditLogsByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@kalex/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  uid: ..., 
  email: ..., 
  fullName: ..., // optional
  avatarUrl: ..., // optional
  mobile: ..., // optional
  locale: ..., // optional
  theme: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ uid: ..., email: ..., fullName: ..., avatarUrl: ..., mobile: ..., locale: ..., theme: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@kalex/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  uid: ..., 
  email: ..., 
  fullName: ..., // optional
  avatarUrl: ..., // optional
  mobile: ..., // optional
  locale: ..., // optional
  theme: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ uid: ..., email: ..., fullName: ..., avatarUrl: ..., mobile: ..., locale: ..., theme: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateOrganization
You can execute the `CreateOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createOrganization(vars: CreateOrganizationVariables): MutationPromise<CreateOrganizationData, CreateOrganizationVariables>;

interface CreateOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrganizationVariables): MutationRef<CreateOrganizationData, CreateOrganizationVariables>;
}
export const createOrganizationRef: CreateOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrganization(dc: DataConnect, vars: CreateOrganizationVariables): MutationPromise<CreateOrganizationData, CreateOrganizationVariables>;

interface CreateOrganizationRef {
  ...
  (dc: DataConnect, vars: CreateOrganizationVariables): MutationRef<CreateOrganizationData, CreateOrganizationVariables>;
}
export const createOrganizationRef: CreateOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrganizationRef:
```typescript
const name = createOrganizationRef.operationName;
console.log(name);
```

### Variables
The `CreateOrganization` mutation requires an argument of type `CreateOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  confirmed?: boolean | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrganizationData {
  organization_insert: Organization_Key;
}
```
### Using `CreateOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrganization, CreateOrganizationVariables } from '@kalex/dataconnect';

// The `CreateOrganization` mutation requires an argument of type `CreateOrganizationVariables`:
const createOrganizationVars: CreateOrganizationVariables = {
  orgId: ..., 
  name: ..., 
  stripeCustomerId: ..., // optional
  type: ..., // optional
  country: ..., // optional
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  confirmed: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrganization(createOrganizationVars);
// Variables can be defined inline as well.
const { data } = await createOrganization({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., confirmed: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrganization(dataConnect, createOrganizationVars);

console.log(data.organization_insert);

// Or, you can use the `Promise` API.
createOrganization(createOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.organization_insert);
});
```

### Using `CreateOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrganizationRef, CreateOrganizationVariables } from '@kalex/dataconnect';

// The `CreateOrganization` mutation requires an argument of type `CreateOrganizationVariables`:
const createOrganizationVars: CreateOrganizationVariables = {
  orgId: ..., 
  name: ..., 
  stripeCustomerId: ..., // optional
  type: ..., // optional
  country: ..., // optional
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  confirmed: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganizationRef()` function to get a reference to the mutation.
const ref = createOrganizationRef(createOrganizationVars);
// Variables can be defined inline as well.
const ref = createOrganizationRef({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., confirmed: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrganizationRef(dataConnect, createOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_insert);
});
```

## AddUserToOrganization
You can execute the `AddUserToOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
addUserToOrganization(vars: AddUserToOrganizationVariables): MutationPromise<AddUserToOrganizationData, AddUserToOrganizationVariables>;

interface AddUserToOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserToOrganizationVariables): MutationRef<AddUserToOrganizationData, AddUserToOrganizationVariables>;
}
export const addUserToOrganizationRef: AddUserToOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addUserToOrganization(dc: DataConnect, vars: AddUserToOrganizationVariables): MutationPromise<AddUserToOrganizationData, AddUserToOrganizationVariables>;

interface AddUserToOrganizationRef {
  ...
  (dc: DataConnect, vars: AddUserToOrganizationVariables): MutationRef<AddUserToOrganizationData, AddUserToOrganizationVariables>;
}
export const addUserToOrganizationRef: AddUserToOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addUserToOrganizationRef:
```typescript
const name = addUserToOrganizationRef.operationName;
console.log(name);
```

### Variables
The `AddUserToOrganization` mutation requires an argument of type `AddUserToOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddUserToOrganizationVariables {
  uid: string;
  orgId: string;
  role: string;
}
```
### Return Type
Recall that executing the `AddUserToOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddUserToOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddUserToOrganizationData {
  userOrganization_insert: UserOrganization_Key;
}
```
### Using `AddUserToOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addUserToOrganization, AddUserToOrganizationVariables } from '@kalex/dataconnect';

// The `AddUserToOrganization` mutation requires an argument of type `AddUserToOrganizationVariables`:
const addUserToOrganizationVars: AddUserToOrganizationVariables = {
  uid: ..., 
  orgId: ..., 
  role: ..., 
};

// Call the `addUserToOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addUserToOrganization(addUserToOrganizationVars);
// Variables can be defined inline as well.
const { data } = await addUserToOrganization({ uid: ..., orgId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addUserToOrganization(dataConnect, addUserToOrganizationVars);

console.log(data.userOrganization_insert);

// Or, you can use the `Promise` API.
addUserToOrganization(addUserToOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_insert);
});
```

### Using `AddUserToOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addUserToOrganizationRef, AddUserToOrganizationVariables } from '@kalex/dataconnect';

// The `AddUserToOrganization` mutation requires an argument of type `AddUserToOrganizationVariables`:
const addUserToOrganizationVars: AddUserToOrganizationVariables = {
  uid: ..., 
  orgId: ..., 
  role: ..., 
};

// Call the `addUserToOrganizationRef()` function to get a reference to the mutation.
const ref = addUserToOrganizationRef(addUserToOrganizationVars);
// Variables can be defined inline as well.
const ref = addUserToOrganizationRef({ uid: ..., orgId: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addUserToOrganizationRef(dataConnect, addUserToOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userOrganization_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_insert);
});
```

## UpdateSubscriptionStatus
You can execute the `UpdateSubscriptionStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateSubscriptionStatus(vars: UpdateSubscriptionStatusVariables): MutationPromise<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;

interface UpdateSubscriptionStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSubscriptionStatusVariables): MutationRef<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;
}
export const updateSubscriptionStatusRef: UpdateSubscriptionStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSubscriptionStatus(dc: DataConnect, vars: UpdateSubscriptionStatusVariables): MutationPromise<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;

interface UpdateSubscriptionStatusRef {
  ...
  (dc: DataConnect, vars: UpdateSubscriptionStatusVariables): MutationRef<UpdateSubscriptionStatusData, UpdateSubscriptionStatusVariables>;
}
export const updateSubscriptionStatusRef: UpdateSubscriptionStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSubscriptionStatusRef:
```typescript
const name = updateSubscriptionStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateSubscriptionStatus` mutation requires an argument of type `UpdateSubscriptionStatusVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSubscriptionStatusVariables {
  orgId: string;
  serviceId: string;
  status: string;
  tier?: string | null;
  expiresAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateSubscriptionStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSubscriptionStatusData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSubscriptionStatusData {
  serviceSubscription_upsert: ServiceSubscription_Key;
}
```
### Using `UpdateSubscriptionStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSubscriptionStatus, UpdateSubscriptionStatusVariables } from '@kalex/dataconnect';

// The `UpdateSubscriptionStatus` mutation requires an argument of type `UpdateSubscriptionStatusVariables`:
const updateSubscriptionStatusVars: UpdateSubscriptionStatusVariables = {
  orgId: ..., 
  serviceId: ..., 
  status: ..., 
  tier: ..., // optional
  expiresAt: ..., // optional
};

// Call the `updateSubscriptionStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSubscriptionStatus(updateSubscriptionStatusVars);
// Variables can be defined inline as well.
const { data } = await updateSubscriptionStatus({ orgId: ..., serviceId: ..., status: ..., tier: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSubscriptionStatus(dataConnect, updateSubscriptionStatusVars);

console.log(data.serviceSubscription_upsert);

// Or, you can use the `Promise` API.
updateSubscriptionStatus(updateSubscriptionStatusVars).then((response) => {
  const data = response.data;
  console.log(data.serviceSubscription_upsert);
});
```

### Using `UpdateSubscriptionStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSubscriptionStatusRef, UpdateSubscriptionStatusVariables } from '@kalex/dataconnect';

// The `UpdateSubscriptionStatus` mutation requires an argument of type `UpdateSubscriptionStatusVariables`:
const updateSubscriptionStatusVars: UpdateSubscriptionStatusVariables = {
  orgId: ..., 
  serviceId: ..., 
  status: ..., 
  tier: ..., // optional
  expiresAt: ..., // optional
};

// Call the `updateSubscriptionStatusRef()` function to get a reference to the mutation.
const ref = updateSubscriptionStatusRef(updateSubscriptionStatusVars);
// Variables can be defined inline as well.
const ref = updateSubscriptionStatusRef({ orgId: ..., serviceId: ..., status: ..., tier: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSubscriptionStatusRef(dataConnect, updateSubscriptionStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceSubscription_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceSubscription_upsert);
});
```

## UpdateOrganizationStripeConnect
You can execute the `UpdateOrganizationStripeConnect` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationStripeConnect(vars: UpdateOrganizationStripeConnectVariables): MutationPromise<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;

interface UpdateOrganizationStripeConnectRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationStripeConnectVariables): MutationRef<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;
}
export const updateOrganizationStripeConnectRef: UpdateOrganizationStripeConnectRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationStripeConnect(dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables): MutationPromise<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;

interface UpdateOrganizationStripeConnectRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationStripeConnectVariables): MutationRef<UpdateOrganizationStripeConnectData, UpdateOrganizationStripeConnectVariables>;
}
export const updateOrganizationStripeConnectRef: UpdateOrganizationStripeConnectRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationStripeConnectRef:
```typescript
const name = updateOrganizationStripeConnectRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationStripeConnect` mutation requires an argument of type `UpdateOrganizationStripeConnectVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrganizationStripeConnectVariables {
  orgId: string;
  stripeConnectAccountId: string;
  stripeConnectOnboarded: boolean;
}
```
### Return Type
Recall that executing the `UpdateOrganizationStripeConnect` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationStripeConnectData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationStripeConnectData {
  organization_update?: Organization_Key | null;
}
```
### Using `UpdateOrganizationStripeConnect`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationStripeConnect, UpdateOrganizationStripeConnectVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationStripeConnect` mutation requires an argument of type `UpdateOrganizationStripeConnectVariables`:
const updateOrganizationStripeConnectVars: UpdateOrganizationStripeConnectVariables = {
  orgId: ..., 
  stripeConnectAccountId: ..., 
  stripeConnectOnboarded: ..., 
};

// Call the `updateOrganizationStripeConnect()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationStripeConnect(updateOrganizationStripeConnectVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationStripeConnect({ orgId: ..., stripeConnectAccountId: ..., stripeConnectOnboarded: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationStripeConnect(dataConnect, updateOrganizationStripeConnectVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationStripeConnect(updateOrganizationStripeConnectVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationStripeConnect`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationStripeConnectRef, UpdateOrganizationStripeConnectVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationStripeConnect` mutation requires an argument of type `UpdateOrganizationStripeConnectVariables`:
const updateOrganizationStripeConnectVars: UpdateOrganizationStripeConnectVariables = {
  orgId: ..., 
  stripeConnectAccountId: ..., 
  stripeConnectOnboarded: ..., 
};

// Call the `updateOrganizationStripeConnectRef()` function to get a reference to the mutation.
const ref = updateOrganizationStripeConnectRef(updateOrganizationStripeConnectVars);
// Variables can be defined inline as well.
const ref = updateOrganizationStripeConnectRef({ orgId: ..., stripeConnectAccountId: ..., stripeConnectOnboarded: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationStripeConnectRef(dataConnect, updateOrganizationStripeConnectVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

## CreateAuthCode
You can execute the `CreateAuthCode` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createAuthCode(vars: CreateAuthCodeVariables): MutationPromise<CreateAuthCodeData, CreateAuthCodeVariables>;

interface CreateAuthCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuthCodeVariables): MutationRef<CreateAuthCodeData, CreateAuthCodeVariables>;
}
export const createAuthCodeRef: CreateAuthCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAuthCode(dc: DataConnect, vars: CreateAuthCodeVariables): MutationPromise<CreateAuthCodeData, CreateAuthCodeVariables>;

interface CreateAuthCodeRef {
  ...
  (dc: DataConnect, vars: CreateAuthCodeVariables): MutationRef<CreateAuthCodeData, CreateAuthCodeVariables>;
}
export const createAuthCodeRef: CreateAuthCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAuthCodeRef:
```typescript
const name = createAuthCodeRef.operationName;
console.log(name);
```

### Variables
The `CreateAuthCode` mutation requires an argument of type `CreateAuthCodeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAuthCodeVariables {
  code: string;
  userUid: string;
  clientId: string;
  redirectUri: string;
  expiresAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateAuthCode` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAuthCodeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAuthCodeData {
  authCode_insert: AuthCode_Key;
}
```
### Using `CreateAuthCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuthCode, CreateAuthCodeVariables } from '@kalex/dataconnect';

// The `CreateAuthCode` mutation requires an argument of type `CreateAuthCodeVariables`:
const createAuthCodeVars: CreateAuthCodeVariables = {
  code: ..., 
  userUid: ..., 
  clientId: ..., 
  redirectUri: ..., 
  expiresAt: ..., 
};

// Call the `createAuthCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuthCode(createAuthCodeVars);
// Variables can be defined inline as well.
const { data } = await createAuthCode({ code: ..., userUid: ..., clientId: ..., redirectUri: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAuthCode(dataConnect, createAuthCodeVars);

console.log(data.authCode_insert);

// Or, you can use the `Promise` API.
createAuthCode(createAuthCodeVars).then((response) => {
  const data = response.data;
  console.log(data.authCode_insert);
});
```

### Using `CreateAuthCode`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAuthCodeRef, CreateAuthCodeVariables } from '@kalex/dataconnect';

// The `CreateAuthCode` mutation requires an argument of type `CreateAuthCodeVariables`:
const createAuthCodeVars: CreateAuthCodeVariables = {
  code: ..., 
  userUid: ..., 
  clientId: ..., 
  redirectUri: ..., 
  expiresAt: ..., 
};

// Call the `createAuthCodeRef()` function to get a reference to the mutation.
const ref = createAuthCodeRef(createAuthCodeVars);
// Variables can be defined inline as well.
const ref = createAuthCodeRef({ code: ..., userUid: ..., clientId: ..., redirectUri: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAuthCodeRef(dataConnect, createAuthCodeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.authCode_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.authCode_insert);
});
```

## DeleteAuthCode
You can execute the `DeleteAuthCode` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteAuthCode(vars: DeleteAuthCodeVariables): MutationPromise<DeleteAuthCodeData, DeleteAuthCodeVariables>;

interface DeleteAuthCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuthCodeVariables): MutationRef<DeleteAuthCodeData, DeleteAuthCodeVariables>;
}
export const deleteAuthCodeRef: DeleteAuthCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAuthCode(dc: DataConnect, vars: DeleteAuthCodeVariables): MutationPromise<DeleteAuthCodeData, DeleteAuthCodeVariables>;

interface DeleteAuthCodeRef {
  ...
  (dc: DataConnect, vars: DeleteAuthCodeVariables): MutationRef<DeleteAuthCodeData, DeleteAuthCodeVariables>;
}
export const deleteAuthCodeRef: DeleteAuthCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAuthCodeRef:
```typescript
const name = deleteAuthCodeRef.operationName;
console.log(name);
```

### Variables
The `DeleteAuthCode` mutation requires an argument of type `DeleteAuthCodeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAuthCodeVariables {
  code: string;
}
```
### Return Type
Recall that executing the `DeleteAuthCode` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAuthCodeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAuthCodeData {
  authCode_delete?: AuthCode_Key | null;
}
```
### Using `DeleteAuthCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAuthCode, DeleteAuthCodeVariables } from '@kalex/dataconnect';

// The `DeleteAuthCode` mutation requires an argument of type `DeleteAuthCodeVariables`:
const deleteAuthCodeVars: DeleteAuthCodeVariables = {
  code: ..., 
};

// Call the `deleteAuthCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAuthCode(deleteAuthCodeVars);
// Variables can be defined inline as well.
const { data } = await deleteAuthCode({ code: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAuthCode(dataConnect, deleteAuthCodeVars);

console.log(data.authCode_delete);

// Or, you can use the `Promise` API.
deleteAuthCode(deleteAuthCodeVars).then((response) => {
  const data = response.data;
  console.log(data.authCode_delete);
});
```

### Using `DeleteAuthCode`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAuthCodeRef, DeleteAuthCodeVariables } from '@kalex/dataconnect';

// The `DeleteAuthCode` mutation requires an argument of type `DeleteAuthCodeVariables`:
const deleteAuthCodeVars: DeleteAuthCodeVariables = {
  code: ..., 
};

// Call the `deleteAuthCodeRef()` function to get a reference to the mutation.
const ref = deleteAuthCodeRef(deleteAuthCodeVars);
// Variables can be defined inline as well.
const ref = deleteAuthCodeRef({ code: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAuthCodeRef(dataConnect, deleteAuthCodeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.authCode_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.authCode_delete);
});
```

## UpdateUserPreferences
You can execute the `UpdateUserPreferences` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateUserPreferences(vars: UpdateUserPreferencesVariables): MutationPromise<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;

interface UpdateUserPreferencesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserPreferencesVariables): MutationRef<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;
}
export const updateUserPreferencesRef: UpdateUserPreferencesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserPreferences(dc: DataConnect, vars: UpdateUserPreferencesVariables): MutationPromise<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;

interface UpdateUserPreferencesRef {
  ...
  (dc: DataConnect, vars: UpdateUserPreferencesVariables): MutationRef<UpdateUserPreferencesData, UpdateUserPreferencesVariables>;
}
export const updateUserPreferencesRef: UpdateUserPreferencesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserPreferencesRef:
```typescript
const name = updateUserPreferencesRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserPreferences` mutation requires an argument of type `UpdateUserPreferencesVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserPreferencesVariables {
  uid: string;
  locale: string;
  theme: string;
}
```
### Return Type
Recall that executing the `UpdateUserPreferences` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserPreferencesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserPreferencesData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserPreferences`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserPreferences, UpdateUserPreferencesVariables } from '@kalex/dataconnect';

// The `UpdateUserPreferences` mutation requires an argument of type `UpdateUserPreferencesVariables`:
const updateUserPreferencesVars: UpdateUserPreferencesVariables = {
  uid: ..., 
  locale: ..., 
  theme: ..., 
};

// Call the `updateUserPreferences()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserPreferences(updateUserPreferencesVars);
// Variables can be defined inline as well.
const { data } = await updateUserPreferences({ uid: ..., locale: ..., theme: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserPreferences(dataConnect, updateUserPreferencesVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserPreferences(updateUserPreferencesVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserPreferences`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserPreferencesRef, UpdateUserPreferencesVariables } from '@kalex/dataconnect';

// The `UpdateUserPreferences` mutation requires an argument of type `UpdateUserPreferencesVariables`:
const updateUserPreferencesVars: UpdateUserPreferencesVariables = {
  uid: ..., 
  locale: ..., 
  theme: ..., 
};

// Call the `updateUserPreferencesRef()` function to get a reference to the mutation.
const ref = updateUserPreferencesRef(updateUserPreferencesVars);
// Variables can be defined inline as well.
const ref = updateUserPreferencesRef({ uid: ..., locale: ..., theme: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserPreferencesRef(dataConnect, updateUserPreferencesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateOrganizationBilling
You can execute the `UpdateOrganizationBilling` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationBilling(vars: UpdateOrganizationBillingVariables): MutationPromise<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;

interface UpdateOrganizationBillingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationBillingVariables): MutationRef<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;
}
export const updateOrganizationBillingRef: UpdateOrganizationBillingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationBilling(dc: DataConnect, vars: UpdateOrganizationBillingVariables): MutationPromise<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;

interface UpdateOrganizationBillingRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationBillingVariables): MutationRef<UpdateOrganizationBillingData, UpdateOrganizationBillingVariables>;
}
export const updateOrganizationBillingRef: UpdateOrganizationBillingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationBillingRef:
```typescript
const name = updateOrganizationBillingRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationBilling` mutation requires an argument of type `UpdateOrganizationBillingVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateOrganizationBilling` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationBillingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationBillingData {
  organization_update?: Organization_Key | null;
}
```
### Using `UpdateOrganizationBilling`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationBilling, UpdateOrganizationBillingVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationBilling` mutation requires an argument of type `UpdateOrganizationBillingVariables`:
const updateOrganizationBillingVars: UpdateOrganizationBillingVariables = {
  orgId: ..., 
  type: ..., 
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
};

// Call the `updateOrganizationBilling()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationBilling(updateOrganizationBillingVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationBilling({ orgId: ..., type: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationBilling(dataConnect, updateOrganizationBillingVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationBilling(updateOrganizationBillingVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationBilling`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationBillingRef, UpdateOrganizationBillingVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationBilling` mutation requires an argument of type `UpdateOrganizationBillingVariables`:
const updateOrganizationBillingVars: UpdateOrganizationBillingVariables = {
  orgId: ..., 
  type: ..., 
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
};

// Call the `updateOrganizationBillingRef()` function to get a reference to the mutation.
const ref = updateOrganizationBillingRef(updateOrganizationBillingVars);
// Variables can be defined inline as well.
const ref = updateOrganizationBillingRef({ orgId: ..., type: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationBillingRef(dataConnect, updateOrganizationBillingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

## UpsertPreRegistration
You can execute the `UpsertPreRegistration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
upsertPreRegistration(vars: UpsertPreRegistrationVariables): MutationPromise<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;

interface UpsertPreRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPreRegistrationVariables): MutationRef<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;
}
export const upsertPreRegistrationRef: UpsertPreRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPreRegistration(dc: DataConnect, vars: UpsertPreRegistrationVariables): MutationPromise<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;

interface UpsertPreRegistrationRef {
  ...
  (dc: DataConnect, vars: UpsertPreRegistrationVariables): MutationRef<UpsertPreRegistrationData, UpsertPreRegistrationVariables>;
}
export const upsertPreRegistrationRef: UpsertPreRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPreRegistrationRef:
```typescript
const name = upsertPreRegistrationRef.operationName;
console.log(name);
```

### Variables
The `UpsertPreRegistration` mutation requires an argument of type `UpsertPreRegistrationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpsertPreRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPreRegistrationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPreRegistrationData {
  preRegistration_upsert: PreRegistration_Key;
}
```
### Using `UpsertPreRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPreRegistration, UpsertPreRegistrationVariables } from '@kalex/dataconnect';

// The `UpsertPreRegistration` mutation requires an argument of type `UpsertPreRegistrationVariables`:
const upsertPreRegistrationVars: UpsertPreRegistrationVariables = {
  email: ..., 
  type: ..., 
  companyName: ..., 
  country: ..., // optional
  vatNumber: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertPreRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPreRegistration(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const { data } = await upsertPreRegistration({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPreRegistration(dataConnect, upsertPreRegistrationVars);

console.log(data.preRegistration_upsert);

// Or, you can use the `Promise` API.
upsertPreRegistration(upsertPreRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.preRegistration_upsert);
});
```

### Using `UpsertPreRegistration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPreRegistrationRef, UpsertPreRegistrationVariables } from '@kalex/dataconnect';

// The `UpsertPreRegistration` mutation requires an argument of type `UpsertPreRegistrationVariables`:
const upsertPreRegistrationVars: UpsertPreRegistrationVariables = {
  email: ..., 
  type: ..., 
  companyName: ..., 
  country: ..., // optional
  vatNumber: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertPreRegistrationRef()` function to get a reference to the mutation.
const ref = upsertPreRegistrationRef(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const ref = upsertPreRegistrationRef({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPreRegistrationRef(dataConnect, upsertPreRegistrationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.preRegistration_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.preRegistration_upsert);
});
```

## DeletePreRegistration
You can execute the `DeletePreRegistration` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deletePreRegistration(vars: DeletePreRegistrationVariables): MutationPromise<DeletePreRegistrationData, DeletePreRegistrationVariables>;

interface DeletePreRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePreRegistrationVariables): MutationRef<DeletePreRegistrationData, DeletePreRegistrationVariables>;
}
export const deletePreRegistrationRef: DeletePreRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePreRegistration(dc: DataConnect, vars: DeletePreRegistrationVariables): MutationPromise<DeletePreRegistrationData, DeletePreRegistrationVariables>;

interface DeletePreRegistrationRef {
  ...
  (dc: DataConnect, vars: DeletePreRegistrationVariables): MutationRef<DeletePreRegistrationData, DeletePreRegistrationVariables>;
}
export const deletePreRegistrationRef: DeletePreRegistrationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePreRegistrationRef:
```typescript
const name = deletePreRegistrationRef.operationName;
console.log(name);
```

### Variables
The `DeletePreRegistration` mutation requires an argument of type `DeletePreRegistrationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePreRegistrationVariables {
  email: string;
}
```
### Return Type
Recall that executing the `DeletePreRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePreRegistrationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePreRegistrationData {
  preRegistration_delete?: PreRegistration_Key | null;
}
```
### Using `DeletePreRegistration`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePreRegistration, DeletePreRegistrationVariables } from '@kalex/dataconnect';

// The `DeletePreRegistration` mutation requires an argument of type `DeletePreRegistrationVariables`:
const deletePreRegistrationVars: DeletePreRegistrationVariables = {
  email: ..., 
};

// Call the `deletePreRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePreRegistration(deletePreRegistrationVars);
// Variables can be defined inline as well.
const { data } = await deletePreRegistration({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePreRegistration(dataConnect, deletePreRegistrationVars);

console.log(data.preRegistration_delete);

// Or, you can use the `Promise` API.
deletePreRegistration(deletePreRegistrationVars).then((response) => {
  const data = response.data;
  console.log(data.preRegistration_delete);
});
```

### Using `DeletePreRegistration`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePreRegistrationRef, DeletePreRegistrationVariables } from '@kalex/dataconnect';

// The `DeletePreRegistration` mutation requires an argument of type `DeletePreRegistrationVariables`:
const deletePreRegistrationVars: DeletePreRegistrationVariables = {
  email: ..., 
};

// Call the `deletePreRegistrationRef()` function to get a reference to the mutation.
const ref = deletePreRegistrationRef(deletePreRegistrationVars);
// Variables can be defined inline as well.
const ref = deletePreRegistrationRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePreRegistrationRef(dataConnect, deletePreRegistrationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.preRegistration_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.preRegistration_delete);
});
```

## ConfirmOrganization
You can execute the `ConfirmOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
confirmOrganization(vars: ConfirmOrganizationVariables): MutationPromise<ConfirmOrganizationData, ConfirmOrganizationVariables>;

interface ConfirmOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ConfirmOrganizationVariables): MutationRef<ConfirmOrganizationData, ConfirmOrganizationVariables>;
}
export const confirmOrganizationRef: ConfirmOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
confirmOrganization(dc: DataConnect, vars: ConfirmOrganizationVariables): MutationPromise<ConfirmOrganizationData, ConfirmOrganizationVariables>;

interface ConfirmOrganizationRef {
  ...
  (dc: DataConnect, vars: ConfirmOrganizationVariables): MutationRef<ConfirmOrganizationData, ConfirmOrganizationVariables>;
}
export const confirmOrganizationRef: ConfirmOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the confirmOrganizationRef:
```typescript
const name = confirmOrganizationRef.operationName;
console.log(name);
```

### Variables
The `ConfirmOrganization` mutation requires an argument of type `ConfirmOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ConfirmOrganizationVariables {
  orgId: string;
  confirmed: boolean;
}
```
### Return Type
Recall that executing the `ConfirmOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ConfirmOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ConfirmOrganizationData {
  organization_update?: Organization_Key | null;
}
```
### Using `ConfirmOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, confirmOrganization, ConfirmOrganizationVariables } from '@kalex/dataconnect';

// The `ConfirmOrganization` mutation requires an argument of type `ConfirmOrganizationVariables`:
const confirmOrganizationVars: ConfirmOrganizationVariables = {
  orgId: ..., 
  confirmed: ..., 
};

// Call the `confirmOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await confirmOrganization(confirmOrganizationVars);
// Variables can be defined inline as well.
const { data } = await confirmOrganization({ orgId: ..., confirmed: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await confirmOrganization(dataConnect, confirmOrganizationVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
confirmOrganization(confirmOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `ConfirmOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, confirmOrganizationRef, ConfirmOrganizationVariables } from '@kalex/dataconnect';

// The `ConfirmOrganization` mutation requires an argument of type `ConfirmOrganizationVariables`:
const confirmOrganizationVars: ConfirmOrganizationVariables = {
  orgId: ..., 
  confirmed: ..., 
};

// Call the `confirmOrganizationRef()` function to get a reference to the mutation.
const ref = confirmOrganizationRef(confirmOrganizationVars);
// Variables can be defined inline as well.
const ref = confirmOrganizationRef({ orgId: ..., confirmed: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = confirmOrganizationRef(dataConnect, confirmOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@kalex/dataconnect';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  uid: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@kalex/dataconnect';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  uid: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## DeleteOrganization
You can execute the `DeleteOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteOrganization(vars: DeleteOrganizationVariables): MutationPromise<DeleteOrganizationData, DeleteOrganizationVariables>;

interface DeleteOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrganizationVariables): MutationRef<DeleteOrganizationData, DeleteOrganizationVariables>;
}
export const deleteOrganizationRef: DeleteOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteOrganization(dc: DataConnect, vars: DeleteOrganizationVariables): MutationPromise<DeleteOrganizationData, DeleteOrganizationVariables>;

interface DeleteOrganizationRef {
  ...
  (dc: DataConnect, vars: DeleteOrganizationVariables): MutationRef<DeleteOrganizationData, DeleteOrganizationVariables>;
}
export const deleteOrganizationRef: DeleteOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteOrganizationRef:
```typescript
const name = deleteOrganizationRef.operationName;
console.log(name);
```

### Variables
The `DeleteOrganization` mutation requires an argument of type `DeleteOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteOrganizationVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `DeleteOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteOrganizationData {
  organization_delete?: Organization_Key | null;
}
```
### Using `DeleteOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteOrganization, DeleteOrganizationVariables } from '@kalex/dataconnect';

// The `DeleteOrganization` mutation requires an argument of type `DeleteOrganizationVariables`:
const deleteOrganizationVars: DeleteOrganizationVariables = {
  orgId: ..., 
};

// Call the `deleteOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteOrganization(deleteOrganizationVars);
// Variables can be defined inline as well.
const { data } = await deleteOrganization({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteOrganization(dataConnect, deleteOrganizationVars);

console.log(data.organization_delete);

// Or, you can use the `Promise` API.
deleteOrganization(deleteOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.organization_delete);
});
```

### Using `DeleteOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteOrganizationRef, DeleteOrganizationVariables } from '@kalex/dataconnect';

// The `DeleteOrganization` mutation requires an argument of type `DeleteOrganizationVariables`:
const deleteOrganizationVars: DeleteOrganizationVariables = {
  orgId: ..., 
};

// Call the `deleteOrganizationRef()` function to get a reference to the mutation.
const ref = deleteOrganizationRef(deleteOrganizationVars);
// Variables can be defined inline as well.
const ref = deleteOrganizationRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteOrganizationRef(dataConnect, deleteOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_delete);
});
```

## DeleteUserOrganization
You can execute the `DeleteUserOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteUserOrganization(vars: DeleteUserOrganizationVariables): MutationPromise<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;

interface DeleteUserOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserOrganizationVariables): MutationRef<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;
}
export const deleteUserOrganizationRef: DeleteUserOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserOrganization(dc: DataConnect, vars: DeleteUserOrganizationVariables): MutationPromise<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;

interface DeleteUserOrganizationRef {
  ...
  (dc: DataConnect, vars: DeleteUserOrganizationVariables): MutationRef<DeleteUserOrganizationData, DeleteUserOrganizationVariables>;
}
export const deleteUserOrganizationRef: DeleteUserOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserOrganizationRef:
```typescript
const name = deleteUserOrganizationRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserOrganization` mutation requires an argument of type `DeleteUserOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserOrganizationVariables {
  uid: string;
  orgId: string;
}
```
### Return Type
Recall that executing the `DeleteUserOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserOrganizationData {
  userOrganization_delete?: UserOrganization_Key | null;
}
```
### Using `DeleteUserOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserOrganization, DeleteUserOrganizationVariables } from '@kalex/dataconnect';

// The `DeleteUserOrganization` mutation requires an argument of type `DeleteUserOrganizationVariables`:
const deleteUserOrganizationVars: DeleteUserOrganizationVariables = {
  uid: ..., 
  orgId: ..., 
};

// Call the `deleteUserOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserOrganization(deleteUserOrganizationVars);
// Variables can be defined inline as well.
const { data } = await deleteUserOrganization({ uid: ..., orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserOrganization(dataConnect, deleteUserOrganizationVars);

console.log(data.userOrganization_delete);

// Or, you can use the `Promise` API.
deleteUserOrganization(deleteUserOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_delete);
});
```

### Using `DeleteUserOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserOrganizationRef, DeleteUserOrganizationVariables } from '@kalex/dataconnect';

// The `DeleteUserOrganization` mutation requires an argument of type `DeleteUserOrganizationVariables`:
const deleteUserOrganizationVars: DeleteUserOrganizationVariables = {
  uid: ..., 
  orgId: ..., 
};

// Call the `deleteUserOrganizationRef()` function to get a reference to the mutation.
const ref = deleteUserOrganizationRef(deleteUserOrganizationVars);
// Variables can be defined inline as well.
const ref = deleteUserOrganizationRef({ uid: ..., orgId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserOrganizationRef(dataConnect, deleteUserOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userOrganization_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_delete);
});
```

## DeleteServiceSubscription
You can execute the `DeleteServiceSubscription` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteServiceSubscription(vars: DeleteServiceSubscriptionVariables): MutationPromise<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;

interface DeleteServiceSubscriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceSubscriptionVariables): MutationRef<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;
}
export const deleteServiceSubscriptionRef: DeleteServiceSubscriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServiceSubscription(dc: DataConnect, vars: DeleteServiceSubscriptionVariables): MutationPromise<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;

interface DeleteServiceSubscriptionRef {
  ...
  (dc: DataConnect, vars: DeleteServiceSubscriptionVariables): MutationRef<DeleteServiceSubscriptionData, DeleteServiceSubscriptionVariables>;
}
export const deleteServiceSubscriptionRef: DeleteServiceSubscriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceSubscriptionRef:
```typescript
const name = deleteServiceSubscriptionRef.operationName;
console.log(name);
```

### Variables
The `DeleteServiceSubscription` mutation requires an argument of type `DeleteServiceSubscriptionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceSubscriptionVariables {
  orgId: string;
  serviceId: string;
}
```
### Return Type
Recall that executing the `DeleteServiceSubscription` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceSubscriptionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceSubscriptionData {
  serviceSubscription_delete?: ServiceSubscription_Key | null;
}
```
### Using `DeleteServiceSubscription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServiceSubscription, DeleteServiceSubscriptionVariables } from '@kalex/dataconnect';

// The `DeleteServiceSubscription` mutation requires an argument of type `DeleteServiceSubscriptionVariables`:
const deleteServiceSubscriptionVars: DeleteServiceSubscriptionVariables = {
  orgId: ..., 
  serviceId: ..., 
};

// Call the `deleteServiceSubscription()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServiceSubscription(deleteServiceSubscriptionVars);
// Variables can be defined inline as well.
const { data } = await deleteServiceSubscription({ orgId: ..., serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServiceSubscription(dataConnect, deleteServiceSubscriptionVars);

console.log(data.serviceSubscription_delete);

// Or, you can use the `Promise` API.
deleteServiceSubscription(deleteServiceSubscriptionVars).then((response) => {
  const data = response.data;
  console.log(data.serviceSubscription_delete);
});
```

### Using `DeleteServiceSubscription`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceSubscriptionRef, DeleteServiceSubscriptionVariables } from '@kalex/dataconnect';

// The `DeleteServiceSubscription` mutation requires an argument of type `DeleteServiceSubscriptionVariables`:
const deleteServiceSubscriptionVars: DeleteServiceSubscriptionVariables = {
  orgId: ..., 
  serviceId: ..., 
};

// Call the `deleteServiceSubscriptionRef()` function to get a reference to the mutation.
const ref = deleteServiceSubscriptionRef(deleteServiceSubscriptionVars);
// Variables can be defined inline as well.
const ref = deleteServiceSubscriptionRef({ orgId: ..., serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceSubscriptionRef(dataConnect, deleteServiceSubscriptionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceSubscription_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceSubscription_delete);
});
```

## CreateApiKey
You can execute the `CreateApiKey` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createApiKey(vars: CreateApiKeyVariables): MutationPromise<CreateApiKeyData, CreateApiKeyVariables>;

interface CreateApiKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApiKeyVariables): MutationRef<CreateApiKeyData, CreateApiKeyVariables>;
}
export const createApiKeyRef: CreateApiKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createApiKey(dc: DataConnect, vars: CreateApiKeyVariables): MutationPromise<CreateApiKeyData, CreateApiKeyVariables>;

interface CreateApiKeyRef {
  ...
  (dc: DataConnect, vars: CreateApiKeyVariables): MutationRef<CreateApiKeyData, CreateApiKeyVariables>;
}
export const createApiKeyRef: CreateApiKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createApiKeyRef:
```typescript
const name = createApiKeyRef.operationName;
console.log(name);
```

### Variables
The `CreateApiKey` mutation requires an argument of type `CreateApiKeyVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateApiKeyVariables {
  keyHash: string;
  userUid?: string | null;
  thingId?: string | null;
  orgId: string;
  name: string;
  description?: string | null;
  ipWhitelist: unknown;
  isActive?: boolean | null;
  expiresAt?: TimestampString | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateApiKey` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateApiKeyData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateApiKeyData {
  apiKey_insert: ApiKey_Key;
}
```
### Using `CreateApiKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createApiKey, CreateApiKeyVariables } from '@kalex/dataconnect';

// The `CreateApiKey` mutation requires an argument of type `CreateApiKeyVariables`:
const createApiKeyVars: CreateApiKeyVariables = {
  keyHash: ..., 
  userUid: ..., // optional
  thingId: ..., // optional
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  ipWhitelist: ..., 
  isActive: ..., // optional
  expiresAt: ..., // optional
  isTest: ..., // optional
};

// Call the `createApiKey()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createApiKey(createApiKeyVars);
// Variables can be defined inline as well.
const { data } = await createApiKey({ keyHash: ..., userUid: ..., thingId: ..., orgId: ..., name: ..., description: ..., ipWhitelist: ..., isActive: ..., expiresAt: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createApiKey(dataConnect, createApiKeyVars);

console.log(data.apiKey_insert);

// Or, you can use the `Promise` API.
createApiKey(createApiKeyVars).then((response) => {
  const data = response.data;
  console.log(data.apiKey_insert);
});
```

### Using `CreateApiKey`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createApiKeyRef, CreateApiKeyVariables } from '@kalex/dataconnect';

// The `CreateApiKey` mutation requires an argument of type `CreateApiKeyVariables`:
const createApiKeyVars: CreateApiKeyVariables = {
  keyHash: ..., 
  userUid: ..., // optional
  thingId: ..., // optional
  orgId: ..., 
  name: ..., 
  description: ..., // optional
  ipWhitelist: ..., 
  isActive: ..., // optional
  expiresAt: ..., // optional
  isTest: ..., // optional
};

// Call the `createApiKeyRef()` function to get a reference to the mutation.
const ref = createApiKeyRef(createApiKeyVars);
// Variables can be defined inline as well.
const ref = createApiKeyRef({ keyHash: ..., userUid: ..., thingId: ..., orgId: ..., name: ..., description: ..., ipWhitelist: ..., isActive: ..., expiresAt: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createApiKeyRef(dataConnect, createApiKeyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.apiKey_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKey_insert);
});
```

## DeleteApiKey
You can execute the `DeleteApiKey` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteApiKey(vars: DeleteApiKeyVariables): MutationPromise<DeleteApiKeyData, DeleteApiKeyVariables>;

interface DeleteApiKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApiKeyVariables): MutationRef<DeleteApiKeyData, DeleteApiKeyVariables>;
}
export const deleteApiKeyRef: DeleteApiKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteApiKey(dc: DataConnect, vars: DeleteApiKeyVariables): MutationPromise<DeleteApiKeyData, DeleteApiKeyVariables>;

interface DeleteApiKeyRef {
  ...
  (dc: DataConnect, vars: DeleteApiKeyVariables): MutationRef<DeleteApiKeyData, DeleteApiKeyVariables>;
}
export const deleteApiKeyRef: DeleteApiKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteApiKeyRef:
```typescript
const name = deleteApiKeyRef.operationName;
console.log(name);
```

### Variables
The `DeleteApiKey` mutation requires an argument of type `DeleteApiKeyVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteApiKeyVariables {
  keyHash: string;
}
```
### Return Type
Recall that executing the `DeleteApiKey` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteApiKeyData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteApiKeyData {
  apiKey_delete?: ApiKey_Key | null;
}
```
### Using `DeleteApiKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteApiKey, DeleteApiKeyVariables } from '@kalex/dataconnect';

// The `DeleteApiKey` mutation requires an argument of type `DeleteApiKeyVariables`:
const deleteApiKeyVars: DeleteApiKeyVariables = {
  keyHash: ..., 
};

// Call the `deleteApiKey()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteApiKey(deleteApiKeyVars);
// Variables can be defined inline as well.
const { data } = await deleteApiKey({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteApiKey(dataConnect, deleteApiKeyVars);

console.log(data.apiKey_delete);

// Or, you can use the `Promise` API.
deleteApiKey(deleteApiKeyVars).then((response) => {
  const data = response.data;
  console.log(data.apiKey_delete);
});
```

### Using `DeleteApiKey`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteApiKeyRef, DeleteApiKeyVariables } from '@kalex/dataconnect';

// The `DeleteApiKey` mutation requires an argument of type `DeleteApiKeyVariables`:
const deleteApiKeyVars: DeleteApiKeyVariables = {
  keyHash: ..., 
};

// Call the `deleteApiKeyRef()` function to get a reference to the mutation.
const ref = deleteApiKeyRef(deleteApiKeyVars);
// Variables can be defined inline as well.
const ref = deleteApiKeyRef({ keyHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteApiKeyRef(dataConnect, deleteApiKeyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.apiKey_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKey_delete);
});
```

## UpsertApiKeyPermission
You can execute the `UpsertApiKeyPermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
upsertApiKeyPermission(vars: UpsertApiKeyPermissionVariables): MutationPromise<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;

interface UpsertApiKeyPermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertApiKeyPermissionVariables): MutationRef<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;
}
export const upsertApiKeyPermissionRef: UpsertApiKeyPermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertApiKeyPermission(dc: DataConnect, vars: UpsertApiKeyPermissionVariables): MutationPromise<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;

interface UpsertApiKeyPermissionRef {
  ...
  (dc: DataConnect, vars: UpsertApiKeyPermissionVariables): MutationRef<UpsertApiKeyPermissionData, UpsertApiKeyPermissionVariables>;
}
export const upsertApiKeyPermissionRef: UpsertApiKeyPermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertApiKeyPermissionRef:
```typescript
const name = upsertApiKeyPermissionRef.operationName;
console.log(name);
```

### Variables
The `UpsertApiKeyPermission` mutation requires an argument of type `UpsertApiKeyPermissionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: unknown;
}
```
### Return Type
Recall that executing the `UpsertApiKeyPermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertApiKeyPermissionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertApiKeyPermissionData {
  apiKeyPermission_upsert: ApiKeyPermission_Key;
}
```
### Using `UpsertApiKeyPermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertApiKeyPermission, UpsertApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `UpsertApiKeyPermission` mutation requires an argument of type `UpsertApiKeyPermissionVariables`:
const upsertApiKeyPermissionVars: UpsertApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
  canCreate: ..., 
  canRead: ..., 
  canUpdate: ..., 
  canDelete: ..., 
  allowedFields: ..., 
};

// Call the `upsertApiKeyPermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertApiKeyPermission(upsertApiKeyPermissionVars);
// Variables can be defined inline as well.
const { data } = await upsertApiKeyPermission({ keyHash: ..., moduleId: ..., canCreate: ..., canRead: ..., canUpdate: ..., canDelete: ..., allowedFields: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertApiKeyPermission(dataConnect, upsertApiKeyPermissionVars);

console.log(data.apiKeyPermission_upsert);

// Or, you can use the `Promise` API.
upsertApiKeyPermission(upsertApiKeyPermissionVars).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermission_upsert);
});
```

### Using `UpsertApiKeyPermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertApiKeyPermissionRef, UpsertApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `UpsertApiKeyPermission` mutation requires an argument of type `UpsertApiKeyPermissionVariables`:
const upsertApiKeyPermissionVars: UpsertApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
  canCreate: ..., 
  canRead: ..., 
  canUpdate: ..., 
  canDelete: ..., 
  allowedFields: ..., 
};

// Call the `upsertApiKeyPermissionRef()` function to get a reference to the mutation.
const ref = upsertApiKeyPermissionRef(upsertApiKeyPermissionVars);
// Variables can be defined inline as well.
const ref = upsertApiKeyPermissionRef({ keyHash: ..., moduleId: ..., canCreate: ..., canRead: ..., canUpdate: ..., canDelete: ..., allowedFields: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertApiKeyPermissionRef(dataConnect, upsertApiKeyPermissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.apiKeyPermission_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermission_upsert);
});
```

## CreateThing
You can execute the `CreateThing` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createThing(vars: CreateThingVariables): MutationPromise<CreateThingData, CreateThingVariables>;

interface CreateThingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateThingVariables): MutationRef<CreateThingData, CreateThingVariables>;
}
export const createThingRef: CreateThingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createThing(dc: DataConnect, vars: CreateThingVariables): MutationPromise<CreateThingData, CreateThingVariables>;

interface CreateThingRef {
  ...
  (dc: DataConnect, vars: CreateThingVariables): MutationRef<CreateThingData, CreateThingVariables>;
}
export const createThingRef: CreateThingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createThingRef:
```typescript
const name = createThingRef.operationName;
console.log(name);
```

### Variables
The `CreateThing` mutation requires an argument of type `CreateThingVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateThingVariables {
  thingId: string;
  orgId: string;
  name: string;
  type: string;
  status?: string | null;
  deviceTokenHash: string;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateThing` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateThingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateThingData {
  thing_insert: Thing_Key;
}
```
### Using `CreateThing`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createThing, CreateThingVariables } from '@kalex/dataconnect';

// The `CreateThing` mutation requires an argument of type `CreateThingVariables`:
const createThingVars: CreateThingVariables = {
  thingId: ..., 
  orgId: ..., 
  name: ..., 
  type: ..., 
  status: ..., // optional
  deviceTokenHash: ..., 
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createThing()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createThing(createThingVars);
// Variables can be defined inline as well.
const { data } = await createThing({ thingId: ..., orgId: ..., name: ..., type: ..., status: ..., deviceTokenHash: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createThing(dataConnect, createThingVars);

console.log(data.thing_insert);

// Or, you can use the `Promise` API.
createThing(createThingVars).then((response) => {
  const data = response.data;
  console.log(data.thing_insert);
});
```

### Using `CreateThing`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createThingRef, CreateThingVariables } from '@kalex/dataconnect';

// The `CreateThing` mutation requires an argument of type `CreateThingVariables`:
const createThingVars: CreateThingVariables = {
  thingId: ..., 
  orgId: ..., 
  name: ..., 
  type: ..., 
  status: ..., // optional
  deviceTokenHash: ..., 
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createThingRef()` function to get a reference to the mutation.
const ref = createThingRef(createThingVars);
// Variables can be defined inline as well.
const ref = createThingRef({ thingId: ..., orgId: ..., name: ..., type: ..., status: ..., deviceTokenHash: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createThingRef(dataConnect, createThingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.thing_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.thing_insert);
});
```

## UpdateThing
You can execute the `UpdateThing` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateThing(vars: UpdateThingVariables): MutationPromise<UpdateThingData, UpdateThingVariables>;

interface UpdateThingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateThingVariables): MutationRef<UpdateThingData, UpdateThingVariables>;
}
export const updateThingRef: UpdateThingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateThing(dc: DataConnect, vars: UpdateThingVariables): MutationPromise<UpdateThingData, UpdateThingVariables>;

interface UpdateThingRef {
  ...
  (dc: DataConnect, vars: UpdateThingVariables): MutationRef<UpdateThingData, UpdateThingVariables>;
}
export const updateThingRef: UpdateThingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateThingRef:
```typescript
const name = updateThingRef.operationName;
console.log(name);
```

### Variables
The `UpdateThing` mutation requires an argument of type `UpdateThingVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateThingVariables {
  thingId: string;
  name?: string | null;
  type?: string | null;
  status?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateThing` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateThingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateThingData {
  thing_update?: Thing_Key | null;
}
```
### Using `UpdateThing`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateThing, UpdateThingVariables } from '@kalex/dataconnect';

// The `UpdateThing` mutation requires an argument of type `UpdateThingVariables`:
const updateThingVars: UpdateThingVariables = {
  thingId: ..., 
  name: ..., // optional
  type: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateThing()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateThing(updateThingVars);
// Variables can be defined inline as well.
const { data } = await updateThing({ thingId: ..., name: ..., type: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateThing(dataConnect, updateThingVars);

console.log(data.thing_update);

// Or, you can use the `Promise` API.
updateThing(updateThingVars).then((response) => {
  const data = response.data;
  console.log(data.thing_update);
});
```

### Using `UpdateThing`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateThingRef, UpdateThingVariables } from '@kalex/dataconnect';

// The `UpdateThing` mutation requires an argument of type `UpdateThingVariables`:
const updateThingVars: UpdateThingVariables = {
  thingId: ..., 
  name: ..., // optional
  type: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateThingRef()` function to get a reference to the mutation.
const ref = updateThingRef(updateThingVars);
// Variables can be defined inline as well.
const ref = updateThingRef({ thingId: ..., name: ..., type: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateThingRef(dataConnect, updateThingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.thing_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.thing_update);
});
```

## DeleteThing
You can execute the `DeleteThing` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteThing(vars: DeleteThingVariables): MutationPromise<DeleteThingData, DeleteThingVariables>;

interface DeleteThingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteThingVariables): MutationRef<DeleteThingData, DeleteThingVariables>;
}
export const deleteThingRef: DeleteThingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteThing(dc: DataConnect, vars: DeleteThingVariables): MutationPromise<DeleteThingData, DeleteThingVariables>;

interface DeleteThingRef {
  ...
  (dc: DataConnect, vars: DeleteThingVariables): MutationRef<DeleteThingData, DeleteThingVariables>;
}
export const deleteThingRef: DeleteThingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteThingRef:
```typescript
const name = deleteThingRef.operationName;
console.log(name);
```

### Variables
The `DeleteThing` mutation requires an argument of type `DeleteThingVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteThingVariables {
  thingId: string;
}
```
### Return Type
Recall that executing the `DeleteThing` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteThingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteThingData {
  thing_delete?: Thing_Key | null;
}
```
### Using `DeleteThing`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteThing, DeleteThingVariables } from '@kalex/dataconnect';

// The `DeleteThing` mutation requires an argument of type `DeleteThingVariables`:
const deleteThingVars: DeleteThingVariables = {
  thingId: ..., 
};

// Call the `deleteThing()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteThing(deleteThingVars);
// Variables can be defined inline as well.
const { data } = await deleteThing({ thingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteThing(dataConnect, deleteThingVars);

console.log(data.thing_delete);

// Or, you can use the `Promise` API.
deleteThing(deleteThingVars).then((response) => {
  const data = response.data;
  console.log(data.thing_delete);
});
```

### Using `DeleteThing`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteThingRef, DeleteThingVariables } from '@kalex/dataconnect';

// The `DeleteThing` mutation requires an argument of type `DeleteThingVariables`:
const deleteThingVars: DeleteThingVariables = {
  thingId: ..., 
};

// Call the `deleteThingRef()` function to get a reference to the mutation.
const ref = deleteThingRef(deleteThingVars);
// Variables can be defined inline as well.
const ref = deleteThingRef({ thingId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteThingRef(dataConnect, deleteThingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.thing_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.thing_delete);
});
```

## CreateAuditLog
You can execute the `CreateAuditLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createAuditLog(vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface CreateAuditLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
}
export const createAuditLogRef: CreateAuditLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAuditLog(dc: DataConnect, vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface CreateAuditLogRef {
  ...
  (dc: DataConnect, vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
}
export const createAuditLogRef: CreateAuditLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAuditLogRef:
```typescript
const name = createAuditLogRef.operationName;
console.log(name);
```

### Variables
The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAuditLogVariables {
  orgId: string;
  uid: string;
  authType: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  userAgent?: string | null;
  responseCode: number;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateAuditLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAuditLogData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAuditLogData {
  auditLog_insert: AuditLog_Key;
}
```
### Using `CreateAuditLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuditLog, CreateAuditLogVariables } from '@kalex/dataconnect';

// The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`:
const createAuditLogVars: CreateAuditLogVariables = {
  orgId: ..., 
  uid: ..., 
  authType: ..., 
  method: ..., 
  endpoint: ..., 
  ipAddress: ..., 
  userAgent: ..., // optional
  responseCode: ..., 
  metadata: ..., // optional
};

// Call the `createAuditLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuditLog(createAuditLogVars);
// Variables can be defined inline as well.
const { data } = await createAuditLog({ orgId: ..., uid: ..., authType: ..., method: ..., endpoint: ..., ipAddress: ..., userAgent: ..., responseCode: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAuditLog(dataConnect, createAuditLogVars);

console.log(data.auditLog_insert);

// Or, you can use the `Promise` API.
createAuditLog(createAuditLogVars).then((response) => {
  const data = response.data;
  console.log(data.auditLog_insert);
});
```

### Using `CreateAuditLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAuditLogRef, CreateAuditLogVariables } from '@kalex/dataconnect';

// The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`:
const createAuditLogVars: CreateAuditLogVariables = {
  orgId: ..., 
  uid: ..., 
  authType: ..., 
  method: ..., 
  endpoint: ..., 
  ipAddress: ..., 
  userAgent: ..., // optional
  responseCode: ..., 
  metadata: ..., // optional
};

// Call the `createAuditLogRef()` function to get a reference to the mutation.
const ref = createAuditLogRef(createAuditLogVars);
// Variables can be defined inline as well.
const ref = createAuditLogRef({ orgId: ..., uid: ..., authType: ..., method: ..., endpoint: ..., ipAddress: ..., userAgent: ..., responseCode: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAuditLogRef(dataConnect, createAuditLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLog_insert);
});
```

## DeleteApiKeyPermission
You can execute the `DeleteApiKeyPermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteApiKeyPermission(vars: DeleteApiKeyPermissionVariables): MutationPromise<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;

interface DeleteApiKeyPermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApiKeyPermissionVariables): MutationRef<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;
}
export const deleteApiKeyPermissionRef: DeleteApiKeyPermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteApiKeyPermission(dc: DataConnect, vars: DeleteApiKeyPermissionVariables): MutationPromise<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;

interface DeleteApiKeyPermissionRef {
  ...
  (dc: DataConnect, vars: DeleteApiKeyPermissionVariables): MutationRef<DeleteApiKeyPermissionData, DeleteApiKeyPermissionVariables>;
}
export const deleteApiKeyPermissionRef: DeleteApiKeyPermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteApiKeyPermissionRef:
```typescript
const name = deleteApiKeyPermissionRef.operationName;
console.log(name);
```

### Variables
The `DeleteApiKeyPermission` mutation requires an argument of type `DeleteApiKeyPermissionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
}
```
### Return Type
Recall that executing the `DeleteApiKeyPermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteApiKeyPermissionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteApiKeyPermissionData {
  apiKeyPermission_delete?: ApiKeyPermission_Key | null;
}
```
### Using `DeleteApiKeyPermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteApiKeyPermission, DeleteApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `DeleteApiKeyPermission` mutation requires an argument of type `DeleteApiKeyPermissionVariables`:
const deleteApiKeyPermissionVars: DeleteApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
};

// Call the `deleteApiKeyPermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteApiKeyPermission(deleteApiKeyPermissionVars);
// Variables can be defined inline as well.
const { data } = await deleteApiKeyPermission({ keyHash: ..., moduleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteApiKeyPermission(dataConnect, deleteApiKeyPermissionVars);

console.log(data.apiKeyPermission_delete);

// Or, you can use the `Promise` API.
deleteApiKeyPermission(deleteApiKeyPermissionVars).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermission_delete);
});
```

### Using `DeleteApiKeyPermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteApiKeyPermissionRef, DeleteApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `DeleteApiKeyPermission` mutation requires an argument of type `DeleteApiKeyPermissionVariables`:
const deleteApiKeyPermissionVars: DeleteApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
};

// Call the `deleteApiKeyPermissionRef()` function to get a reference to the mutation.
const ref = deleteApiKeyPermissionRef(deleteApiKeyPermissionVars);
// Variables can be defined inline as well.
const ref = deleteApiKeyPermissionRef({ keyHash: ..., moduleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteApiKeyPermissionRef(dataConnect, deleteApiKeyPermissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.apiKeyPermission_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermission_delete);
});
```

## DeleteAuditLog
You can execute the `DeleteAuditLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteAuditLog(vars: DeleteAuditLogVariables): MutationPromise<DeleteAuditLogData, DeleteAuditLogVariables>;

interface DeleteAuditLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditLogVariables): MutationRef<DeleteAuditLogData, DeleteAuditLogVariables>;
}
export const deleteAuditLogRef: DeleteAuditLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAuditLog(dc: DataConnect, vars: DeleteAuditLogVariables): MutationPromise<DeleteAuditLogData, DeleteAuditLogVariables>;

interface DeleteAuditLogRef {
  ...
  (dc: DataConnect, vars: DeleteAuditLogVariables): MutationRef<DeleteAuditLogData, DeleteAuditLogVariables>;
}
export const deleteAuditLogRef: DeleteAuditLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAuditLogRef:
```typescript
const name = deleteAuditLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteAuditLog` mutation requires an argument of type `DeleteAuditLogVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAuditLogVariables {
  logId: string;
}
```
### Return Type
Recall that executing the `DeleteAuditLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAuditLogData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAuditLogData {
  auditLog_delete?: AuditLog_Key | null;
}
```
### Using `DeleteAuditLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAuditLog, DeleteAuditLogVariables } from '@kalex/dataconnect';

// The `DeleteAuditLog` mutation requires an argument of type `DeleteAuditLogVariables`:
const deleteAuditLogVars: DeleteAuditLogVariables = {
  logId: ..., 
};

// Call the `deleteAuditLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAuditLog(deleteAuditLogVars);
// Variables can be defined inline as well.
const { data } = await deleteAuditLog({ logId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAuditLog(dataConnect, deleteAuditLogVars);

console.log(data.auditLog_delete);

// Or, you can use the `Promise` API.
deleteAuditLog(deleteAuditLogVars).then((response) => {
  const data = response.data;
  console.log(data.auditLog_delete);
});
```

### Using `DeleteAuditLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAuditLogRef, DeleteAuditLogVariables } from '@kalex/dataconnect';

// The `DeleteAuditLog` mutation requires an argument of type `DeleteAuditLogVariables`:
const deleteAuditLogVars: DeleteAuditLogVariables = {
  logId: ..., 
};

// Call the `deleteAuditLogRef()` function to get a reference to the mutation.
const ref = deleteAuditLogRef(deleteAuditLogVars);
// Variables can be defined inline as well.
const ref = deleteAuditLogRef({ logId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAuditLogRef(dataConnect, deleteAuditLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLog_delete);
});
```

## CreateService
You can execute the `CreateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRef:
```typescript
const name = createServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateService` mutation requires an argument of type `CreateServiceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceVariables {
  serviceId: string;
  name: string;
  description?: string | null;
  type: string;
  priceModel?: string | null;
  priceText?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceData {
  service_insert: Service_Key;
}
```
### Using `CreateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createService, CreateServiceVariables } from '@kalex/dataconnect';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  serviceId: ..., 
  name: ..., 
  description: ..., // optional
  type: ..., 
  priceModel: ..., // optional
  priceText: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
};

// Call the `createService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createService(createServiceVars);
// Variables can be defined inline as well.
const { data } = await createService({ serviceId: ..., name: ..., description: ..., type: ..., priceModel: ..., priceText: ..., isActive: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createService(dataConnect, createServiceVars);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
createService(createServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

### Using `CreateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRef, CreateServiceVariables } from '@kalex/dataconnect';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  serviceId: ..., 
  name: ..., 
  description: ..., // optional
  type: ..., 
  priceModel: ..., // optional
  priceText: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
};

// Call the `createServiceRef()` function to get a reference to the mutation.
const ref = createServiceRef(createServiceVars);
// Variables can be defined inline as well.
const ref = createServiceRef({ serviceId: ..., name: ..., description: ..., type: ..., priceModel: ..., priceText: ..., isActive: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRef(dataConnect, createServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

## DeleteService
You can execute the `DeleteService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteService(vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface DeleteServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
}
export const deleteServiceRef: DeleteServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteService(dc: DataConnect, vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface DeleteServiceRef {
  ...
  (dc: DataConnect, vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
}
export const deleteServiceRef: DeleteServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceRef:
```typescript
const name = deleteServiceRef.operationName;
console.log(name);
```

### Variables
The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceVariables {
  serviceId: string;
}
```
### Return Type
Recall that executing the `DeleteService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceData {
  service_delete?: Service_Key | null;
}
```
### Using `DeleteService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteService, DeleteServiceVariables } from '@kalex/dataconnect';

// The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`:
const deleteServiceVars: DeleteServiceVariables = {
  serviceId: ..., 
};

// Call the `deleteService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteService(deleteServiceVars);
// Variables can be defined inline as well.
const { data } = await deleteService({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteService(dataConnect, deleteServiceVars);

console.log(data.service_delete);

// Or, you can use the `Promise` API.
deleteService(deleteServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_delete);
});
```

### Using `DeleteService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRef, DeleteServiceVariables } from '@kalex/dataconnect';

// The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`:
const deleteServiceVars: DeleteServiceVariables = {
  serviceId: ..., 
};

// Call the `deleteServiceRef()` function to get a reference to the mutation.
const ref = deleteServiceRef(deleteServiceVars);
// Variables can be defined inline as well.
const ref = deleteServiceRef({ serviceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceRef(dataConnect, deleteServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_delete);
});
```

## CreateProduct
You can execute the `CreateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductRef:
```typescript
const name = createProductRef.operationName;
console.log(name);
```

### Variables
The `CreateProduct` mutation requires an argument of type `CreateProductVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductVariables {
  productId: string;
  name: string;
  description?: string | null;
  type: string;
  sku?: string | null;
  price: number;
  isActive?: boolean | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductData {
  product_insert: Product_Key;
}
```
### Using `CreateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProduct, CreateProductVariables } from '@kalex/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  productId: ..., 
  name: ..., 
  description: ..., // optional
  type: ..., 
  sku: ..., // optional
  price: ..., 
  isActive: ..., // optional
  isTest: ..., // optional
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ productId: ..., name: ..., description: ..., type: ..., sku: ..., price: ..., isActive: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProduct(dataConnect, createProductVars);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProduct(createProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductRef, CreateProductVariables } from '@kalex/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  productId: ..., 
  name: ..., 
  description: ..., // optional
  type: ..., 
  sku: ..., // optional
  price: ..., 
  isActive: ..., // optional
  isTest: ..., // optional
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ productId: ..., name: ..., description: ..., type: ..., sku: ..., price: ..., isActive: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductRef(dataConnect, createProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## DeleteProduct
You can execute the `DeleteProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductRef:
```typescript
const name = deleteProductRef.operationName;
console.log(name);
```

### Variables
The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductVariables {
  productId: string;
}
```
### Return Type
Recall that executing the `DeleteProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductData {
  product_delete?: Product_Key | null;
}
```
### Using `DeleteProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProduct, DeleteProductVariables } from '@kalex/dataconnect';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  productId: ..., 
};

// Call the `deleteProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProduct(deleteProductVars);
// Variables can be defined inline as well.
const { data } = await deleteProduct({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProduct(dataConnect, deleteProductVars);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
deleteProduct(deleteProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

### Using `DeleteProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductRef, DeleteProductVariables } from '@kalex/dataconnect';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  productId: ..., 
};

// Call the `deleteProductRef()` function to get a reference to the mutation.
const ref = deleteProductRef(deleteProductVars);
// Variables can be defined inline as well.
const ref = deleteProductRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductRef(dataConnect, deleteProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

## CreateInvoice
You can execute the `CreateInvoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInvoiceRef:
```typescript
const name = createInvoiceRef.operationName;
console.log(name);
```

### Variables
The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInvoiceVariables {
  invoiceId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: string;
  pdfUrl?: string | null;
  products?: unknown | null;
  services?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateInvoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInvoiceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}
```
### Using `CreateInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInvoice, CreateInvoiceVariables } from '@kalex/dataconnect';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  invoiceId: ..., 
  buyerId: ..., 
  sellerId: ..., 
  amount: ..., 
  status: ..., 
  pdfUrl: ..., // optional
  products: ..., // optional
  services: ..., // optional
  isTest: ..., // optional
};

// Call the `createInvoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInvoice(createInvoiceVars);
// Variables can be defined inline as well.
const { data } = await createInvoice({ invoiceId: ..., buyerId: ..., sellerId: ..., amount: ..., status: ..., pdfUrl: ..., products: ..., services: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInvoice(dataConnect, createInvoiceVars);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
createInvoice(createInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

### Using `CreateInvoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInvoiceRef, CreateInvoiceVariables } from '@kalex/dataconnect';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  invoiceId: ..., 
  buyerId: ..., 
  sellerId: ..., 
  amount: ..., 
  status: ..., 
  pdfUrl: ..., // optional
  products: ..., // optional
  services: ..., // optional
  isTest: ..., // optional
};

// Call the `createInvoiceRef()` function to get a reference to the mutation.
const ref = createInvoiceRef(createInvoiceVars);
// Variables can be defined inline as well.
const ref = createInvoiceRef({ invoiceId: ..., buyerId: ..., sellerId: ..., amount: ..., status: ..., pdfUrl: ..., products: ..., services: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInvoiceRef(dataConnect, createInvoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

## DeleteInvoice
You can execute the `DeleteInvoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteInvoice(vars: DeleteInvoiceVariables): MutationPromise<DeleteInvoiceData, DeleteInvoiceVariables>;

interface DeleteInvoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInvoiceVariables): MutationRef<DeleteInvoiceData, DeleteInvoiceVariables>;
}
export const deleteInvoiceRef: DeleteInvoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteInvoice(dc: DataConnect, vars: DeleteInvoiceVariables): MutationPromise<DeleteInvoiceData, DeleteInvoiceVariables>;

interface DeleteInvoiceRef {
  ...
  (dc: DataConnect, vars: DeleteInvoiceVariables): MutationRef<DeleteInvoiceData, DeleteInvoiceVariables>;
}
export const deleteInvoiceRef: DeleteInvoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteInvoiceRef:
```typescript
const name = deleteInvoiceRef.operationName;
console.log(name);
```

### Variables
The `DeleteInvoice` mutation requires an argument of type `DeleteInvoiceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteInvoiceVariables {
  invoiceId: string;
}
```
### Return Type
Recall that executing the `DeleteInvoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteInvoiceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteInvoiceData {
  invoice_delete?: Invoice_Key | null;
}
```
### Using `DeleteInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteInvoice, DeleteInvoiceVariables } from '@kalex/dataconnect';

// The `DeleteInvoice` mutation requires an argument of type `DeleteInvoiceVariables`:
const deleteInvoiceVars: DeleteInvoiceVariables = {
  invoiceId: ..., 
};

// Call the `deleteInvoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteInvoice(deleteInvoiceVars);
// Variables can be defined inline as well.
const { data } = await deleteInvoice({ invoiceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteInvoice(dataConnect, deleteInvoiceVars);

console.log(data.invoice_delete);

// Or, you can use the `Promise` API.
deleteInvoice(deleteInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_delete);
});
```

### Using `DeleteInvoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteInvoiceRef, DeleteInvoiceVariables } from '@kalex/dataconnect';

// The `DeleteInvoice` mutation requires an argument of type `DeleteInvoiceVariables`:
const deleteInvoiceVars: DeleteInvoiceVariables = {
  invoiceId: ..., 
};

// Call the `deleteInvoiceRef()` function to get a reference to the mutation.
const ref = deleteInvoiceRef(deleteInvoiceVars);
// Variables can be defined inline as well.
const ref = deleteInvoiceRef({ invoiceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteInvoiceRef(dataConnect, deleteInvoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_delete);
});
```

## CreateTeam
You can execute the `CreateTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createTeam(vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface CreateTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
}
export const createTeamRef: CreateTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTeam(dc: DataConnect, vars: CreateTeamVariables): MutationPromise<CreateTeamData, CreateTeamVariables>;

interface CreateTeamRef {
  ...
  (dc: DataConnect, vars: CreateTeamVariables): MutationRef<CreateTeamData, CreateTeamVariables>;
}
export const createTeamRef: CreateTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTeamRef:
```typescript
const name = createTeamRef.operationName;
console.log(name);
```

### Variables
The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTeamVariables {
  teamId: string;
  orgId: string;
  name: string;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTeamData {
  team_insert: Team_Key;
}
```
### Using `CreateTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTeam, CreateTeamVariables } from '@kalex/dataconnect';

// The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`:
const createTeamVars: CreateTeamVariables = {
  teamId: ..., 
  orgId: ..., 
  name: ..., 
  isTest: ..., // optional
};

// Call the `createTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTeam(createTeamVars);
// Variables can be defined inline as well.
const { data } = await createTeam({ teamId: ..., orgId: ..., name: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTeam(dataConnect, createTeamVars);

console.log(data.team_insert);

// Or, you can use the `Promise` API.
createTeam(createTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_insert);
});
```

### Using `CreateTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTeamRef, CreateTeamVariables } from '@kalex/dataconnect';

// The `CreateTeam` mutation requires an argument of type `CreateTeamVariables`:
const createTeamVars: CreateTeamVariables = {
  teamId: ..., 
  orgId: ..., 
  name: ..., 
  isTest: ..., // optional
};

// Call the `createTeamRef()` function to get a reference to the mutation.
const ref = createTeamRef(createTeamVars);
// Variables can be defined inline as well.
const ref = createTeamRef({ teamId: ..., orgId: ..., name: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTeamRef(dataConnect, createTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_insert);
});
```

## DeleteTeam
You can execute the `DeleteTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteTeam(vars: DeleteTeamVariables): MutationPromise<DeleteTeamData, DeleteTeamVariables>;

interface DeleteTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTeamVariables): MutationRef<DeleteTeamData, DeleteTeamVariables>;
}
export const deleteTeamRef: DeleteTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTeam(dc: DataConnect, vars: DeleteTeamVariables): MutationPromise<DeleteTeamData, DeleteTeamVariables>;

interface DeleteTeamRef {
  ...
  (dc: DataConnect, vars: DeleteTeamVariables): MutationRef<DeleteTeamData, DeleteTeamVariables>;
}
export const deleteTeamRef: DeleteTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTeamRef:
```typescript
const name = deleteTeamRef.operationName;
console.log(name);
```

### Variables
The `DeleteTeam` mutation requires an argument of type `DeleteTeamVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTeamVariables {
  teamId: string;
}
```
### Return Type
Recall that executing the `DeleteTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTeamData {
  team_delete?: Team_Key | null;
}
```
### Using `DeleteTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTeam, DeleteTeamVariables } from '@kalex/dataconnect';

// The `DeleteTeam` mutation requires an argument of type `DeleteTeamVariables`:
const deleteTeamVars: DeleteTeamVariables = {
  teamId: ..., 
};

// Call the `deleteTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTeam(deleteTeamVars);
// Variables can be defined inline as well.
const { data } = await deleteTeam({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTeam(dataConnect, deleteTeamVars);

console.log(data.team_delete);

// Or, you can use the `Promise` API.
deleteTeam(deleteTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_delete);
});
```

### Using `DeleteTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTeamRef, DeleteTeamVariables } from '@kalex/dataconnect';

// The `DeleteTeam` mutation requires an argument of type `DeleteTeamVariables`:
const deleteTeamVars: DeleteTeamVariables = {
  teamId: ..., 
};

// Call the `deleteTeamRef()` function to get a reference to the mutation.
const ref = deleteTeamRef(deleteTeamVars);
// Variables can be defined inline as well.
const ref = deleteTeamRef({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTeamRef(dataConnect, deleteTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_delete);
});
```

## AddUserToTeam
You can execute the `AddUserToTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
addUserToTeam(vars: AddUserToTeamVariables): MutationPromise<AddUserToTeamData, AddUserToTeamVariables>;

interface AddUserToTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserToTeamVariables): MutationRef<AddUserToTeamData, AddUserToTeamVariables>;
}
export const addUserToTeamRef: AddUserToTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addUserToTeam(dc: DataConnect, vars: AddUserToTeamVariables): MutationPromise<AddUserToTeamData, AddUserToTeamVariables>;

interface AddUserToTeamRef {
  ...
  (dc: DataConnect, vars: AddUserToTeamVariables): MutationRef<AddUserToTeamData, AddUserToTeamVariables>;
}
export const addUserToTeamRef: AddUserToTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addUserToTeamRef:
```typescript
const name = addUserToTeamRef.operationName;
console.log(name);
```

### Variables
The `AddUserToTeam` mutation requires an argument of type `AddUserToTeamVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddUserToTeamVariables {
  uid: string;
  teamId: string;
}
```
### Return Type
Recall that executing the `AddUserToTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddUserToTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddUserToTeamData {
  teamMember_insert: TeamMember_Key;
}
```
### Using `AddUserToTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addUserToTeam, AddUserToTeamVariables } from '@kalex/dataconnect';

// The `AddUserToTeam` mutation requires an argument of type `AddUserToTeamVariables`:
const addUserToTeamVars: AddUserToTeamVariables = {
  uid: ..., 
  teamId: ..., 
};

// Call the `addUserToTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addUserToTeam(addUserToTeamVars);
// Variables can be defined inline as well.
const { data } = await addUserToTeam({ uid: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addUserToTeam(dataConnect, addUserToTeamVars);

console.log(data.teamMember_insert);

// Or, you can use the `Promise` API.
addUserToTeam(addUserToTeamVars).then((response) => {
  const data = response.data;
  console.log(data.teamMember_insert);
});
```

### Using `AddUserToTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addUserToTeamRef, AddUserToTeamVariables } from '@kalex/dataconnect';

// The `AddUserToTeam` mutation requires an argument of type `AddUserToTeamVariables`:
const addUserToTeamVars: AddUserToTeamVariables = {
  uid: ..., 
  teamId: ..., 
};

// Call the `addUserToTeamRef()` function to get a reference to the mutation.
const ref = addUserToTeamRef(addUserToTeamVars);
// Variables can be defined inline as well.
const ref = addUserToTeamRef({ uid: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addUserToTeamRef(dataConnect, addUserToTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamMember_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMember_insert);
});
```

## RemoveUserFromTeam
You can execute the `RemoveUserFromTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
removeUserFromTeam(vars: RemoveUserFromTeamVariables): MutationPromise<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;

interface RemoveUserFromTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveUserFromTeamVariables): MutationRef<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;
}
export const removeUserFromTeamRef: RemoveUserFromTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeUserFromTeam(dc: DataConnect, vars: RemoveUserFromTeamVariables): MutationPromise<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;

interface RemoveUserFromTeamRef {
  ...
  (dc: DataConnect, vars: RemoveUserFromTeamVariables): MutationRef<RemoveUserFromTeamData, RemoveUserFromTeamVariables>;
}
export const removeUserFromTeamRef: RemoveUserFromTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeUserFromTeamRef:
```typescript
const name = removeUserFromTeamRef.operationName;
console.log(name);
```

### Variables
The `RemoveUserFromTeam` mutation requires an argument of type `RemoveUserFromTeamVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveUserFromTeamVariables {
  uid: string;
  teamId: string;
}
```
### Return Type
Recall that executing the `RemoveUserFromTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveUserFromTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveUserFromTeamData {
  teamMember_delete?: TeamMember_Key | null;
}
```
### Using `RemoveUserFromTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeUserFromTeam, RemoveUserFromTeamVariables } from '@kalex/dataconnect';

// The `RemoveUserFromTeam` mutation requires an argument of type `RemoveUserFromTeamVariables`:
const removeUserFromTeamVars: RemoveUserFromTeamVariables = {
  uid: ..., 
  teamId: ..., 
};

// Call the `removeUserFromTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeUserFromTeam(removeUserFromTeamVars);
// Variables can be defined inline as well.
const { data } = await removeUserFromTeam({ uid: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeUserFromTeam(dataConnect, removeUserFromTeamVars);

console.log(data.teamMember_delete);

// Or, you can use the `Promise` API.
removeUserFromTeam(removeUserFromTeamVars).then((response) => {
  const data = response.data;
  console.log(data.teamMember_delete);
});
```

### Using `RemoveUserFromTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeUserFromTeamRef, RemoveUserFromTeamVariables } from '@kalex/dataconnect';

// The `RemoveUserFromTeam` mutation requires an argument of type `RemoveUserFromTeamVariables`:
const removeUserFromTeamVars: RemoveUserFromTeamVariables = {
  uid: ..., 
  teamId: ..., 
};

// Call the `removeUserFromTeamRef()` function to get a reference to the mutation.
const ref = removeUserFromTeamRef(removeUserFromTeamVars);
// Variables can be defined inline as well.
const ref = removeUserFromTeamRef({ uid: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeUserFromTeamRef(dataConnect, removeUserFromTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamMember_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMember_delete);
});
```

