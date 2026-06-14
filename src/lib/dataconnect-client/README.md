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
  confirmed: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrganization(createOrganizationVars);
// Variables can be defined inline as well.
const { data } = await createOrganization({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., confirmed: ..., metadata: ..., });

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
  confirmed: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganizationRef()` function to get a reference to the mutation.
const ref = createOrganizationRef(createOrganizationVars);
// Variables can be defined inline as well.
const ref = createOrganizationRef({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., confirmed: ..., metadata: ..., });

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
  metadata: ..., // optional
};

// Call the `upsertPreRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPreRegistration(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const { data } = await upsertPreRegistration({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., metadata: ..., });

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
  metadata: ..., // optional
};

// Call the `upsertPreRegistrationRef()` function to get a reference to the mutation.
const ref = upsertPreRegistrationRef(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const ref = upsertPreRegistrationRef({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., metadata: ..., });

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

