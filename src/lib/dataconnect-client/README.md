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
  - [*ListAllSubscriptions*](#listallsubscriptions)
  - [*GetSubscription*](#getsubscription)
  - [*ListAllAuthCodes*](#listallauthcodes)
  - [*GetApiKey*](#getapikey)
  - [*GetApiKeyPermissions*](#getapikeypermissions)
  - [*GetThing*](#getthing)
  - [*GetThingByTokenHash*](#getthingbytokenhash)
  - [*ListThingsByOrg*](#listthingsbyorg)
  - [*ListApiKeysByOrg*](#listapikeysbyorg)
  - [*ListMembersByOrg*](#listmembersbyorg)
  - [*GetOrgMember*](#getorgmember)
  - [*GetOrgOwner*](#getorgowner)
  - [*ListAllThings*](#listallthings)
  - [*ListAllApiKeys*](#listallapikeys)
  - [*ListAllApiKeyPermissions*](#listallapikeypermissions)
  - [*ListAllAuditLogs*](#listallauditlogs)
  - [*ListAllProducts*](#listallproducts)
  - [*ListAllProductsGlobal*](#listallproductsglobal)
  - [*ListAllProductBatches*](#listallproductbatches)
  - [*GetProductBatchesByProduct*](#getproductbatchesbyproduct)
  - [*ListAllInvoices*](#listallinvoices)
  - [*ListAllTeams*](#listallteams)
  - [*ListAllTeamMembers*](#listallteammembers)
  - [*ListInvoicesByOrg*](#listinvoicesbyorg)
  - [*ListInvoicesBySeller*](#listinvoicesbyseller)
  - [*ListPaymentsByOrg*](#listpaymentsbyorg)
  - [*ListPaymentsBySeller*](#listpaymentsbyseller)
  - [*GetInvoiceDetails*](#getinvoicedetails)
  - [*GetOrganizationByStripeCustomer*](#getorganizationbystripecustomer)
  - [*ListTeamsByOrg*](#listteamsbyorg)
  - [*ListTeamMembers*](#listteammembers)
  - [*ListAuditLogsByOrg*](#listauditlogsbyorg)
  - [*CheckVatNumberExists*](#checkvatnumberexists)
  - [*GetCompute*](#getcompute)
  - [*ListComputesByOrg*](#listcomputesbyorg)
  - [*GetProductConsume*](#getproductconsume)
  - [*ListProductConsumesByOrg*](#listproductconsumesbyorg)
  - [*GetPrice*](#getprice)
  - [*ListPricesByProduct*](#listpricesbyproduct)
  - [*ListAllPrices*](#listallprices)
  - [*GetCheckout*](#getcheckout)
  - [*ListCheckoutsByOrg*](#listcheckoutsbyorg)
  - [*ListAllCheckouts*](#listallcheckouts)
  - [*GetPayment*](#getpayment)
  - [*GetProductDetails*](#getproductdetails)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*CreateOrganization*](#createorganization)
  - [*AddUserToOrganization*](#addusertoorganization)
  - [*CreateOrgWithOwner*](#createorgwithowner)
  - [*CreateMemberWithUser*](#creatememberwithuser)
  - [*MigrateInviteeMembership*](#migrateinviteemembership)
  - [*UpdateUserOrganization*](#updateuserorganization)
  - [*UpdateSubscriptionStatus*](#updatesubscriptionstatus)
  - [*UpdateOrganizationStripeConnect*](#updateorganizationstripeconnect)
  - [*UpdateOrganizationStripeCustomer*](#updateorganizationstripecustomer)
  - [*CreateAuthCode*](#createauthcode)
  - [*DeleteAuthCode*](#deleteauthcode)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*UpdateUserMetadata*](#updateusermetadata)
  - [*UpdateOrganizationBilling*](#updateorganizationbilling)
  - [*UpdateOrganizationVies*](#updateorganizationvies)
  - [*UpdateOrganizationApps*](#updateorganizationapps)
  - [*UpsertPreRegistration*](#upsertpreregistration)
  - [*DeletePreRegistration*](#deletepreregistration)
  - [*ConfirmOrganization*](#confirmorganization)
  - [*DeleteUser*](#deleteuser)
  - [*UpdateOrganizationVatHash*](#updateorganizationvathash)
  - [*DeleteOrganization*](#deleteorganization)
  - [*DeleteUserOrganization*](#deleteuserorganization)
  - [*DeleteSubscription*](#deletesubscription)
  - [*CreateApiKey*](#createapikey)
  - [*DeleteApiKey*](#deleteapikey)
  - [*SetApiKeyPermission*](#setapikeypermission)
  - [*CreateThing*](#creatething)
  - [*UpdateThing*](#updatething)
  - [*DeleteThing*](#deletething)
  - [*CreateAuditLog*](#createauditlog)
  - [*DeleteApiKeyPermission*](#deleteapikeypermission)
  - [*DeleteAuditLog*](#deleteauditlog)
  - [*CreateProduct*](#createproduct)
  - [*DeleteProduct*](#deleteproduct)
  - [*CreateProductBatch*](#createproductbatch)
  - [*DeleteProductBatch*](#deleteproductbatch)
  - [*CreateInvoice*](#createinvoice)
  - [*UpdateInvoiceStatus*](#updateinvoicestatus)
  - [*DeleteInvoice*](#deleteinvoice)
  - [*CreatePayment*](#createpayment)
  - [*UpdatePaymentStatus*](#updatepaymentstatus)
  - [*DeletePayment*](#deletepayment)
  - [*CreateTeam*](#createteam)
  - [*UpdateTeam*](#updateteam)
  - [*DeleteTeam*](#deleteteam)
  - [*AddUserToTeam*](#addusertoteam)
  - [*RemoveUserFromTeam*](#removeuserfromteam)
  - [*CreateCompute*](#createcompute)
  - [*UpdateCompute*](#updatecompute)
  - [*DeleteCompute*](#deletecompute)
  - [*CreatePrice*](#createprice)
  - [*UpdatePrice*](#updateprice)
  - [*DeletePrice*](#deleteprice)
  - [*CreateCheckout*](#createcheckout)
  - [*UpdateCheckout*](#updatecheckout)
  - [*DeleteCheckout*](#deletecheckout)
  - [*CreateProductConsume*](#createproductconsume)
  - [*UpdateProductConsume*](#updateproductconsume)
  - [*DeleteProductConsume*](#deleteproductconsume)

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
getUserClaimsContext(vars: GetUserClaimsContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

interface GetUserClaimsContextRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserClaimsContextVariables): QueryRef<GetUserClaimsContextData, GetUserClaimsContextVariables>;
}
export const getUserClaimsContextRef: GetUserClaimsContextRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserClaimsContext(dc: DataConnect, vars: GetUserClaimsContextVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserClaimsContextData, GetUserClaimsContextVariables>;

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
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserClaimsContext` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserClaimsContextData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserClaimsContextData {
  user?: {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    mobile?: string | null;
    locale: string;
    theme: string;
    metadata?: unknown | null;
    teamMembers_on_user: ({
      team: {
        teamId: string;
        name: string;
        rbac?: unknown | null;
        organization: {
          orgId: string;
        } & Organizations_Key;
      } & Teams_Key;
    })[];
    userOrganizations_on_user: ({
      role: string;
      rbac?: unknown | null;
      organization: {
        orgId: string;
        name: string;
        type: string;
        confirmed: boolean;
        isTest: boolean;
        viesValidated: boolean;
        country: string;
        vatNumber?: string | null;
        fiscalCode?: string | null;
        billingAddress?: string | null;
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
        addressDetails?: unknown | null;
        metadata?: unknown | null;
        apps?: unknown | null;
        createdAt: TimestampString;
        subscriptions_on_buyer: ({
          subscriptionId: string;
          buyerId: string;
          sellerId?: string | null;
          appId: string;
          status: string;
          items: unknown;
          expiresAt?: TimestampString | null;
          updatedAt: TimestampString;
        } & Subscriptions_Key)[];
      } & Organizations_Key;
    })[];
  } & Users_Key;
}
```
### Using `GetUserClaimsContext`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserClaimsContext, GetUserClaimsContextVariables } from '@kalex/dataconnect';

// The `GetUserClaimsContext` query requires an argument of type `GetUserClaimsContextVariables`:
const getUserClaimsContextVars: GetUserClaimsContextVariables = {
  userId: ..., 
};

// Call the `getUserClaimsContext()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserClaimsContext(getUserClaimsContextVars);
// Variables can be defined inline as well.
const { data } = await getUserClaimsContext({ userId: ..., });

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
  userId: ..., 
};

// Call the `getUserClaimsContextRef()` function to get a reference to the query.
const ref = getUserClaimsContextRef(getUserClaimsContextVars);
// Variables can be defined inline as well.
const ref = getUserClaimsContextRef({ userId: ..., });

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
getOrganizationDetails(vars: GetOrganizationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

interface GetOrganizationDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationDetailsVariables): QueryRef<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;
}
export const getOrganizationDetailsRef: GetOrganizationDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrganizationDetails(dc: DataConnect, vars: GetOrganizationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationDetailsData, GetOrganizationDetailsVariables>;

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
    vatNumber?: string | null;
    fiscalCode?: string | null;
    billingAddress?: string | null;
    sdiCode?: string | null;
    officeCode?: string | null;
    cigCode?: string | null;
    cupCode?: string | null;
    isTest: boolean;
    viesValidated: boolean;
    address?: string | null;
    addressDetails?: unknown | null;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
    confirmed: boolean;
    metadata?: unknown | null;
    createdAt: TimestampString;
    subscriptions_on_buyer: ({
      subscriptionId: string;
      buyerId: string;
      sellerId?: string | null;
      appId: string;
      status: string;
      items: unknown;
      expiresAt?: TimestampString | null;
      updatedAt: TimestampString;
    } & Subscriptions_Key)[];
  } & Organizations_Key;
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
getAuthCode(vars: GetAuthCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

interface GetAuthCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthCodeVariables): QueryRef<GetAuthCodeData, GetAuthCodeVariables>;
}
export const getAuthCodeRef: GetAuthCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAuthCode(dc: DataConnect, vars: GetAuthCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthCodeData, GetAuthCodeVariables>;

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
    userId: string;
    clientId: string;
    redirectUri: string;
    expiresAt: TimestampString;
  } & AuthCodes_Key;
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
getPreRegistration(vars: GetPreRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

interface GetPreRegistrationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPreRegistrationVariables): QueryRef<GetPreRegistrationData, GetPreRegistrationVariables>;
}
export const getPreRegistrationRef: GetPreRegistrationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPreRegistration(dc: DataConnect, vars: GetPreRegistrationVariables, options?: ExecuteQueryOptions): QueryPromise<GetPreRegistrationData, GetPreRegistrationVariables>;

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
    fiscalCode?: string | null;
    sdiCode?: string | null;
    officeCode?: string | null;
    cigCode?: string | null;
    cupCode?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    altitude?: number | null;
    addressDetails?: unknown | null;
    metadata?: unknown | null;
  } & PreRegistrations_Key;
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
listAllPreRegistrations(options?: ExecuteQueryOptions): QueryPromise<ListAllPreRegistrationsData, undefined>;

interface ListAllPreRegistrationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPreRegistrationsData, undefined>;
}
export const listAllPreRegistrationsRef: ListAllPreRegistrationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllPreRegistrations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllPreRegistrationsData, undefined>;

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
  } & PreRegistrations_Key)[];
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
listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

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
    userId: string;
    email: string;
  } & Users_Key)[];
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
listAllOrganizations(options?: ExecuteQueryOptions): QueryPromise<ListAllOrganizationsData, undefined>;

interface ListAllOrganizationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllOrganizationsData, undefined>;
}
export const listAllOrganizationsRef: ListAllOrganizationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllOrganizationsData, undefined>;

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
  } & Organizations_Key)[];
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
listAllUserOrganizations(options?: ExecuteQueryOptions): QueryPromise<ListAllUserOrganizationsData, undefined>;

interface ListAllUserOrganizationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUserOrganizationsData, undefined>;
}
export const listAllUserOrganizationsRef: ListAllUserOrganizationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUserOrganizations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUserOrganizationsData, undefined>;

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
      userId: string;
    } & Users_Key;
    organization: {
      orgId: string;
    } & Organizations_Key;
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

## ListAllSubscriptions
You can execute the `ListAllSubscriptions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllSubscriptions(options?: ExecuteQueryOptions): QueryPromise<ListAllSubscriptionsData, undefined>;

interface ListAllSubscriptionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSubscriptionsData, undefined>;
}
export const listAllSubscriptionsRef: ListAllSubscriptionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllSubscriptions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSubscriptionsData, undefined>;

interface ListAllSubscriptionsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllSubscriptionsData, undefined>;
}
export const listAllSubscriptionsRef: ListAllSubscriptionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllSubscriptionsRef:
```typescript
const name = listAllSubscriptionsRef.operationName;
console.log(name);
```

### Variables
The `ListAllSubscriptions` query has no variables.
### Return Type
Recall that executing the `ListAllSubscriptions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllSubscriptionsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllSubscriptionsData {
  subscriptions: ({
    subscriptionId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    status: string;
    items: unknown;
  } & Subscriptions_Key)[];
}
```
### Using `ListAllSubscriptions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllSubscriptions } from '@kalex/dataconnect';


// Call the `listAllSubscriptions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllSubscriptions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllSubscriptions(dataConnect);

console.log(data.subscriptions);

// Or, you can use the `Promise` API.
listAllSubscriptions().then((response) => {
  const data = response.data;
  console.log(data.subscriptions);
});
```

### Using `ListAllSubscriptions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllSubscriptionsRef } from '@kalex/dataconnect';


// Call the `listAllSubscriptionsRef()` function to get a reference to the query.
const ref = listAllSubscriptionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllSubscriptionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.subscriptions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.subscriptions);
});
```

## GetSubscription
You can execute the `GetSubscription` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getSubscription(vars: GetSubscriptionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSubscriptionData, GetSubscriptionVariables>;

interface GetSubscriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSubscriptionVariables): QueryRef<GetSubscriptionData, GetSubscriptionVariables>;
}
export const getSubscriptionRef: GetSubscriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSubscription(dc: DataConnect, vars: GetSubscriptionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSubscriptionData, GetSubscriptionVariables>;

interface GetSubscriptionRef {
  ...
  (dc: DataConnect, vars: GetSubscriptionVariables): QueryRef<GetSubscriptionData, GetSubscriptionVariables>;
}
export const getSubscriptionRef: GetSubscriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSubscriptionRef:
```typescript
const name = getSubscriptionRef.operationName;
console.log(name);
```

### Variables
The `GetSubscription` query requires an argument of type `GetSubscriptionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSubscriptionVariables {
  subscriptionId: string;
}
```
### Return Type
Recall that executing the `GetSubscription` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSubscriptionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSubscriptionData {
  subscription?: {
    subscriptionId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    status: string;
    items: unknown;
    cancelAtPeriodEnd?: boolean | null;
    currentPeriodStart?: TimestampString | null;
    currentPeriodEnd?: TimestampString | null;
    trialStart?: TimestampString | null;
    trialEnd?: TimestampString | null;
    metadata?: unknown | null;
    expiresAt?: TimestampString | null;
    updatedAt: TimestampString;
  } & Subscriptions_Key;
}
```
### Using `GetSubscription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSubscription, GetSubscriptionVariables } from '@kalex/dataconnect';

// The `GetSubscription` query requires an argument of type `GetSubscriptionVariables`:
const getSubscriptionVars: GetSubscriptionVariables = {
  subscriptionId: ..., 
};

// Call the `getSubscription()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSubscription(getSubscriptionVars);
// Variables can be defined inline as well.
const { data } = await getSubscription({ subscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSubscription(dataConnect, getSubscriptionVars);

console.log(data.subscription);

// Or, you can use the `Promise` API.
getSubscription(getSubscriptionVars).then((response) => {
  const data = response.data;
  console.log(data.subscription);
});
```

### Using `GetSubscription`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSubscriptionRef, GetSubscriptionVariables } from '@kalex/dataconnect';

// The `GetSubscription` query requires an argument of type `GetSubscriptionVariables`:
const getSubscriptionVars: GetSubscriptionVariables = {
  subscriptionId: ..., 
};

// Call the `getSubscriptionRef()` function to get a reference to the query.
const ref = getSubscriptionRef(getSubscriptionVars);
// Variables can be defined inline as well.
const ref = getSubscriptionRef({ subscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSubscriptionRef(dataConnect, getSubscriptionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.subscription);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.subscription);
});
```

## ListAllAuthCodes
You can execute the `ListAllAuthCodes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllAuthCodes(options?: ExecuteQueryOptions): QueryPromise<ListAllAuthCodesData, undefined>;

interface ListAllAuthCodesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuthCodesData, undefined>;
}
export const listAllAuthCodesRef: ListAllAuthCodesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllAuthCodes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAuthCodesData, undefined>;

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
  } & AuthCodes_Key)[];
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
getApiKey(vars: GetApiKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

interface GetApiKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyVariables): QueryRef<GetApiKeyData, GetApiKeyVariables>;
}
export const getApiKeyRef: GetApiKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getApiKey(dc: DataConnect, vars: GetApiKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyData, GetApiKeyVariables>;

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
      userId: string;
      email: string;
      userOrganizations_on_user: ({
        role: string;
        organization: {
          orgId: string;
        } & Organizations_Key;
      })[];
    } & Users_Key;
    thing?: {
      thingId: string;
      name: string;
    } & Things_Key;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    ipWhitelist: unknown;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKeys_Key;
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
getApiKeyPermissions(vars: GetApiKeyPermissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

interface GetApiKeyPermissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApiKeyPermissionsVariables): QueryRef<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;
}
export const getApiKeyPermissionsRef: GetApiKeyPermissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getApiKeyPermissions(dc: DataConnect, vars: GetApiKeyPermissionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetApiKeyPermissionsData, GetApiKeyPermissionsVariables>;

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
    canList: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    allowedFields: unknown;
  } & ApiKeyPermissions_Key)[];
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
getThing(vars: GetThingVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingData, GetThingVariables>;

interface GetThingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingVariables): QueryRef<GetThingData, GetThingVariables>;
}
export const getThingRef: GetThingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getThing(dc: DataConnect, vars: GetThingVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingData, GetThingVariables>;

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
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    type: string;
    status: string;
    deviceTokenHash: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key;
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
getThingByTokenHash(vars: GetThingByTokenHashVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

interface GetThingByTokenHashRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetThingByTokenHashVariables): QueryRef<GetThingByTokenHashData, GetThingByTokenHashVariables>;
}
export const getThingByTokenHashRef: GetThingByTokenHashRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getThingByTokenHash(dc: DataConnect, vars: GetThingByTokenHashVariables, options?: ExecuteQueryOptions): QueryPromise<GetThingByTokenHashData, GetThingByTokenHashVariables>;

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
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key)[];
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
listThingsByOrg(vars: ListThingsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

interface ListThingsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListThingsByOrgVariables): QueryRef<ListThingsByOrgData, ListThingsByOrgVariables>;
}
export const listThingsByOrgRef: ListThingsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listThingsByOrg(dc: DataConnect, vars: ListThingsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListThingsByOrgData, ListThingsByOrgVariables>;

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
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListThingsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListThingsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListThingsByOrgData {
  things: ({
    thingId: string;
    appId: string;
    name: string;
    type: string;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Things_Key)[];
}
```
### Using `ListThingsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listThingsByOrg, ListThingsByOrgVariables } from '@kalex/dataconnect';

// The `ListThingsByOrg` query requires an argument of type `ListThingsByOrgVariables`:
const listThingsByOrgVars: ListThingsByOrgVariables = {
  orgId: ..., 
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listThingsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listThingsByOrg(listThingsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listThingsByOrg({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listThingsByOrgRef()` function to get a reference to the query.
const ref = listThingsByOrgRef(listThingsByOrgVars);
// Variables can be defined inline as well.
const ref = listThingsByOrgRef({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
listApiKeysByOrg(vars: ListApiKeysByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

interface ListApiKeysByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListApiKeysByOrgVariables): QueryRef<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;
}
export const listApiKeysByOrgRef: ListApiKeysByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listApiKeysByOrg(dc: DataConnect, vars: ListApiKeysByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListApiKeysByOrgData, ListApiKeysByOrgVariables>;

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
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListApiKeysByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListApiKeysByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListApiKeysByOrgData {
  apiKeys: ({
    keyHash: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    user?: {
      userId: string;
      email: string;
    } & Users_Key;
    appId: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    expiresAt?: TimestampString | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ApiKeys_Key)[];
}
```
### Using `ListApiKeysByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listApiKeysByOrg, ListApiKeysByOrgVariables } from '@kalex/dataconnect';

// The `ListApiKeysByOrg` query requires an argument of type `ListApiKeysByOrgVariables`:
const listApiKeysByOrgVars: ListApiKeysByOrgVariables = {
  orgId: ..., 
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listApiKeysByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listApiKeysByOrg(listApiKeysByOrgVars);
// Variables can be defined inline as well.
const { data } = await listApiKeysByOrg({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listApiKeysByOrgRef()` function to get a reference to the query.
const ref = listApiKeysByOrgRef(listApiKeysByOrgVars);
// Variables can be defined inline as well.
const ref = listApiKeysByOrgRef({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
listMembersByOrg(vars: ListMembersByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

interface ListMembersByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMembersByOrgVariables): QueryRef<ListMembersByOrgData, ListMembersByOrgVariables>;
}
export const listMembersByOrgRef: ListMembersByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMembersByOrg(dc: DataConnect, vars: ListMembersByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListMembersByOrgData, ListMembersByOrgVariables>;

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
    rbac?: unknown | null;
    joinedAt: TimestampString;
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
      metadata?: unknown | null;
      locale: string;
      teamMembers_on_user: ({
        team: {
          teamId: string;
          name: string;
        } & Teams_Key;
      })[];
    } & Users_Key;
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

## GetOrgMember
You can execute the `GetOrgMember` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getOrgMember(vars: GetOrgMemberVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgMemberData, GetOrgMemberVariables>;

interface GetOrgMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgMemberVariables): QueryRef<GetOrgMemberData, GetOrgMemberVariables>;
}
export const getOrgMemberRef: GetOrgMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgMember(dc: DataConnect, vars: GetOrgMemberVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgMemberData, GetOrgMemberVariables>;

interface GetOrgMemberRef {
  ...
  (dc: DataConnect, vars: GetOrgMemberVariables): QueryRef<GetOrgMemberData, GetOrgMemberVariables>;
}
export const getOrgMemberRef: GetOrgMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgMemberRef:
```typescript
const name = getOrgMemberRef.operationName;
console.log(name);
```

### Variables
The `GetOrgMember` query requires an argument of type `GetOrgMemberVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgMemberVariables {
  orgId: string;
  userId: string;
}
```
### Return Type
Recall that executing the `GetOrgMember` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgMemberData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgMemberData {
  userOrganization?: {
    role: string;
    rbac?: unknown | null;
    joinedAt: TimestampString;
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
      metadata?: unknown | null;
      locale: string;
      teamMembers_on_user: ({
        team: {
          teamId: string;
          name: string;
        } & Teams_Key;
      })[];
    } & Users_Key;
  };
}
```
### Using `GetOrgMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgMember, GetOrgMemberVariables } from '@kalex/dataconnect';

// The `GetOrgMember` query requires an argument of type `GetOrgMemberVariables`:
const getOrgMemberVars: GetOrgMemberVariables = {
  orgId: ..., 
  userId: ..., 
};

// Call the `getOrgMember()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgMember(getOrgMemberVars);
// Variables can be defined inline as well.
const { data } = await getOrgMember({ orgId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgMember(dataConnect, getOrgMemberVars);

console.log(data.userOrganization);

// Or, you can use the `Promise` API.
getOrgMember(getOrgMemberVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization);
});
```

### Using `GetOrgMember`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgMemberRef, GetOrgMemberVariables } from '@kalex/dataconnect';

// The `GetOrgMember` query requires an argument of type `GetOrgMemberVariables`:
const getOrgMemberVars: GetOrgMemberVariables = {
  orgId: ..., 
  userId: ..., 
};

// Call the `getOrgMemberRef()` function to get a reference to the query.
const ref = getOrgMemberRef(getOrgMemberVars);
// Variables can be defined inline as well.
const ref = getOrgMemberRef({ orgId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgMemberRef(dataConnect, getOrgMemberVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userOrganization);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization);
});
```

## GetOrgOwner
You can execute the `GetOrgOwner` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getOrgOwner(vars: GetOrgOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgOwnerData, GetOrgOwnerVariables>;

interface GetOrgOwnerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrgOwnerVariables): QueryRef<GetOrgOwnerData, GetOrgOwnerVariables>;
}
export const getOrgOwnerRef: GetOrgOwnerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrgOwner(dc: DataConnect, vars: GetOrgOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrgOwnerData, GetOrgOwnerVariables>;

interface GetOrgOwnerRef {
  ...
  (dc: DataConnect, vars: GetOrgOwnerVariables): QueryRef<GetOrgOwnerData, GetOrgOwnerVariables>;
}
export const getOrgOwnerRef: GetOrgOwnerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrgOwnerRef:
```typescript
const name = getOrgOwnerRef.operationName;
console.log(name);
```

### Variables
The `GetOrgOwner` query requires an argument of type `GetOrgOwnerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrgOwnerVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `GetOrgOwner` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrgOwnerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrgOwnerData {
  userOrganizations: ({
    role: string;
    user: {
      userId: string;
      email: string;
      fullName: string;
      locale: string;
    } & Users_Key;
  })[];
}
```
### Using `GetOrgOwner`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrgOwner, GetOrgOwnerVariables } from '@kalex/dataconnect';

// The `GetOrgOwner` query requires an argument of type `GetOrgOwnerVariables`:
const getOrgOwnerVars: GetOrgOwnerVariables = {
  orgId: ..., 
};

// Call the `getOrgOwner()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrgOwner(getOrgOwnerVars);
// Variables can be defined inline as well.
const { data } = await getOrgOwner({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrgOwner(dataConnect, getOrgOwnerVars);

console.log(data.userOrganizations);

// Or, you can use the `Promise` API.
getOrgOwner(getOrgOwnerVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganizations);
});
```

### Using `GetOrgOwner`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrgOwnerRef, GetOrgOwnerVariables } from '@kalex/dataconnect';

// The `GetOrgOwner` query requires an argument of type `GetOrgOwnerVariables`:
const getOrgOwnerVars: GetOrgOwnerVariables = {
  orgId: ..., 
};

// Call the `getOrgOwnerRef()` function to get a reference to the query.
const ref = getOrgOwnerRef(getOrgOwnerVars);
// Variables can be defined inline as well.
const ref = getOrgOwnerRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrgOwnerRef(dataConnect, getOrgOwnerVars);

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
listAllThings(options?: ExecuteQueryOptions): QueryPromise<ListAllThingsData, undefined>;

interface ListAllThingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllThingsData, undefined>;
}
export const listAllThingsRef: ListAllThingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllThings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllThingsData, undefined>;

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
  } & Things_Key)[];
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
listAllApiKeys(options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeysData, undefined>;

interface ListAllApiKeysRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeysData, undefined>;
}
export const listAllApiKeysRef: ListAllApiKeysRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllApiKeys(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeysData, undefined>;

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
  } & ApiKeys_Key)[];
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
listAllApiKeyPermissions(options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

interface ListAllApiKeyPermissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllApiKeyPermissionsData, undefined>;
}
export const listAllApiKeyPermissionsRef: ListAllApiKeyPermissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllApiKeyPermissions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllApiKeyPermissionsData, undefined>;

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
  } & ApiKeyPermissions_Key)[];
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
listAllAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListAllAuditLogsData, undefined>;

interface ListAllAuditLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAuditLogsData, undefined>;
}
export const listAllAuditLogsRef: ListAllAuditLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAuditLogsData, undefined>;

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
    orgId: string;
    userId: string;
  } & AuditLogs_Key)[];
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

## ListAllProducts
You can execute the `ListAllProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllProducts(vars: ListAllProductsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsData, ListAllProductsVariables>;

interface ListAllProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAllProductsVariables): QueryRef<ListAllProductsData, ListAllProductsVariables>;
}
export const listAllProductsRef: ListAllProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllProducts(dc: DataConnect, vars: ListAllProductsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsData, ListAllProductsVariables>;

interface ListAllProductsRef {
  ...
  (dc: DataConnect, vars: ListAllProductsVariables): QueryRef<ListAllProductsData, ListAllProductsVariables>;
}
export const listAllProductsRef: ListAllProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllProductsRef:
```typescript
const name = listAllProductsRef.operationName;
console.log(name);
```

### Variables
The `ListAllProducts` query requires an argument of type `ListAllProductsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAllProductsVariables {
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListAllProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllProductsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllProductsData {
  products: ({
    productId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
    createdAt: TimestampString;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    productBatches_on_product: ({
      batchId: string;
      productId: string;
      batchNumber: string;
      expirationDate?: TimestampString | null;
      productionDate?: TimestampString | null;
      stockStatus: unknown;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductBatches_Key)[];
    productConsumes_on_product: ({
      consumeId: string;
      orgId: string;
      productId: string;
      quantity: number;
      status: string;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductConsumes_Key)[];
  } & Products_Key)[];
}
```
### Using `ListAllProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllProducts, ListAllProductsVariables } from '@kalex/dataconnect';

// The `ListAllProducts` query requires an argument of type `ListAllProductsVariables`:
const listAllProductsVars: ListAllProductsVariables = {
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllProducts(listAllProductsVars);
// Variables can be defined inline as well.
const { data } = await listAllProducts({ appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllProducts(dataConnect, listAllProductsVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listAllProducts(listAllProductsVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListAllProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllProductsRef, ListAllProductsVariables } from '@kalex/dataconnect';

// The `ListAllProducts` query requires an argument of type `ListAllProductsVariables`:
const listAllProductsVars: ListAllProductsVariables = {
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllProductsRef()` function to get a reference to the query.
const ref = listAllProductsRef(listAllProductsVars);
// Variables can be defined inline as well.
const ref = listAllProductsRef({ appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllProductsRef(dataConnect, listAllProductsVars);

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

## ListAllProductsGlobal
You can execute the `ListAllProductsGlobal` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllProductsGlobal(vars?: ListAllProductsGlobalVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsGlobalData, ListAllProductsGlobalVariables>;

interface ListAllProductsGlobalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAllProductsGlobalVariables): QueryRef<ListAllProductsGlobalData, ListAllProductsGlobalVariables>;
}
export const listAllProductsGlobalRef: ListAllProductsGlobalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllProductsGlobal(dc: DataConnect, vars?: ListAllProductsGlobalVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllProductsGlobalData, ListAllProductsGlobalVariables>;

interface ListAllProductsGlobalRef {
  ...
  (dc: DataConnect, vars?: ListAllProductsGlobalVariables): QueryRef<ListAllProductsGlobalData, ListAllProductsGlobalVariables>;
}
export const listAllProductsGlobalRef: ListAllProductsGlobalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllProductsGlobalRef:
```typescript
const name = listAllProductsGlobalRef.operationName;
console.log(name);
```

### Variables
The `ListAllProductsGlobal` query has an optional argument of type `ListAllProductsGlobalVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAllProductsGlobalVariables {
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListAllProductsGlobal` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllProductsGlobalData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllProductsGlobalData {
  products: ({
    productId: string;
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    descriptionEmbedding?: unknown | null;
    createdAt: TimestampString;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    productBatches_on_product: ({
      batchId: string;
      productId: string;
      batchNumber: string;
      expirationDate?: TimestampString | null;
      productionDate?: TimestampString | null;
      stockStatus: unknown;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductBatches_Key)[];
    productConsumes_on_product: ({
      consumeId: string;
      orgId: string;
      productId: string;
      quantity: number;
      status: string;
      metadata?: unknown | null;
      isTest: boolean;
      createdAt: TimestampString;
    } & ProductConsumes_Key)[];
  } & Products_Key)[];
}
```
### Using `ListAllProductsGlobal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllProductsGlobal, ListAllProductsGlobalVariables } from '@kalex/dataconnect';

// The `ListAllProductsGlobal` query has an optional argument of type `ListAllProductsGlobalVariables`:
const listAllProductsGlobalVars: ListAllProductsGlobalVariables = {
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllProductsGlobal()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllProductsGlobal(listAllProductsGlobalVars);
// Variables can be defined inline as well.
const { data } = await listAllProductsGlobal({ limit: ..., beforeCreatedAt: ..., beforeId: ..., });
// Since all variables are optional for this query, you can omit the `ListAllProductsGlobalVariables` argument.
const { data } = await listAllProductsGlobal();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllProductsGlobal(dataConnect, listAllProductsGlobalVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listAllProductsGlobal(listAllProductsGlobalVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListAllProductsGlobal`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllProductsGlobalRef, ListAllProductsGlobalVariables } from '@kalex/dataconnect';

// The `ListAllProductsGlobal` query has an optional argument of type `ListAllProductsGlobalVariables`:
const listAllProductsGlobalVars: ListAllProductsGlobalVariables = {
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllProductsGlobalRef()` function to get a reference to the query.
const ref = listAllProductsGlobalRef(listAllProductsGlobalVars);
// Variables can be defined inline as well.
const ref = listAllProductsGlobalRef({ limit: ..., beforeCreatedAt: ..., beforeId: ..., });
// Since all variables are optional for this query, you can omit the `ListAllProductsGlobalVariables` argument.
const ref = listAllProductsGlobalRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllProductsGlobalRef(dataConnect, listAllProductsGlobalVars);

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

## ListAllProductBatches
You can execute the `ListAllProductBatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllProductBatches(options?: ExecuteQueryOptions): QueryPromise<ListAllProductBatchesData, undefined>;

interface ListAllProductBatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllProductBatchesData, undefined>;
}
export const listAllProductBatchesRef: ListAllProductBatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllProductBatches(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllProductBatchesData, undefined>;

interface ListAllProductBatchesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllProductBatchesData, undefined>;
}
export const listAllProductBatchesRef: ListAllProductBatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllProductBatchesRef:
```typescript
const name = listAllProductBatchesRef.operationName;
console.log(name);
```

### Variables
The `ListAllProductBatches` query has no variables.
### Return Type
Recall that executing the `ListAllProductBatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllProductBatchesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllProductBatchesData {
  productBatches: ({
    batchId: string;
    product: {
      productId: string;
      sku?: string | null;
    } & Products_Key;
    batchNumber: string;
    expirationDate?: TimestampString | null;
    productionDate?: TimestampString | null;
    stockStatus: unknown;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductBatches_Key)[];
}
```
### Using `ListAllProductBatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllProductBatches } from '@kalex/dataconnect';


// Call the `listAllProductBatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllProductBatches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllProductBatches(dataConnect);

console.log(data.productBatches);

// Or, you can use the `Promise` API.
listAllProductBatches().then((response) => {
  const data = response.data;
  console.log(data.productBatches);
});
```

### Using `ListAllProductBatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllProductBatchesRef } from '@kalex/dataconnect';


// Call the `listAllProductBatchesRef()` function to get a reference to the query.
const ref = listAllProductBatchesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllProductBatchesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productBatches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productBatches);
});
```

## GetProductBatchesByProduct
You can execute the `GetProductBatchesByProduct` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getProductBatchesByProduct(vars: GetProductBatchesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;

interface GetProductBatchesByProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductBatchesByProductVariables): QueryRef<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;
}
export const getProductBatchesByProductRef: GetProductBatchesByProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductBatchesByProduct(dc: DataConnect, vars: GetProductBatchesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;

interface GetProductBatchesByProductRef {
  ...
  (dc: DataConnect, vars: GetProductBatchesByProductVariables): QueryRef<GetProductBatchesByProductData, GetProductBatchesByProductVariables>;
}
export const getProductBatchesByProductRef: GetProductBatchesByProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductBatchesByProductRef:
```typescript
const name = getProductBatchesByProductRef.operationName;
console.log(name);
```

### Variables
The `GetProductBatchesByProduct` query requires an argument of type `GetProductBatchesByProductVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductBatchesByProductVariables {
  productId: string;
}
```
### Return Type
Recall that executing the `GetProductBatchesByProduct` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductBatchesByProductData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductBatchesByProductData {
  productBatches: ({
    batchId: string;
    batchNumber: string;
    expirationDate?: TimestampString | null;
    productionDate?: TimestampString | null;
    stockStatus: unknown;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductBatches_Key)[];
}
```
### Using `GetProductBatchesByProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductBatchesByProduct, GetProductBatchesByProductVariables } from '@kalex/dataconnect';

// The `GetProductBatchesByProduct` query requires an argument of type `GetProductBatchesByProductVariables`:
const getProductBatchesByProductVars: GetProductBatchesByProductVariables = {
  productId: ..., 
};

// Call the `getProductBatchesByProduct()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductBatchesByProduct(getProductBatchesByProductVars);
// Variables can be defined inline as well.
const { data } = await getProductBatchesByProduct({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductBatchesByProduct(dataConnect, getProductBatchesByProductVars);

console.log(data.productBatches);

// Or, you can use the `Promise` API.
getProductBatchesByProduct(getProductBatchesByProductVars).then((response) => {
  const data = response.data;
  console.log(data.productBatches);
});
```

### Using `GetProductBatchesByProduct`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductBatchesByProductRef, GetProductBatchesByProductVariables } from '@kalex/dataconnect';

// The `GetProductBatchesByProduct` query requires an argument of type `GetProductBatchesByProductVariables`:
const getProductBatchesByProductVars: GetProductBatchesByProductVariables = {
  productId: ..., 
};

// Call the `getProductBatchesByProductRef()` function to get a reference to the query.
const ref = getProductBatchesByProductRef(getProductBatchesByProductVars);
// Variables can be defined inline as well.
const ref = getProductBatchesByProductRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductBatchesByProductRef(dataConnect, getProductBatchesByProductVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productBatches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productBatches);
});
```

## ListAllInvoices
You can execute the `ListAllInvoices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllInvoices(options?: ExecuteQueryOptions): QueryPromise<ListAllInvoicesData, undefined>;

interface ListAllInvoicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllInvoicesData, undefined>;
}
export const listAllInvoicesRef: ListAllInvoicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllInvoices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllInvoicesData, undefined>;

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
    appId: string;
  } & Invoices_Key)[];
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
listAllTeams(options?: ExecuteQueryOptions): QueryPromise<ListAllTeamsData, undefined>;

interface ListAllTeamsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamsData, undefined>;
}
export const listAllTeamsRef: ListAllTeamsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllTeams(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTeamsData, undefined>;

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
    name: string;
    description?: string | null;
    rbac?: unknown | null;
    metadata?: unknown | null;
    organization: {
      orgId: string;
    } & Organizations_Key;
  } & Teams_Key)[];
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
listAllTeamMembers(options?: ExecuteQueryOptions): QueryPromise<ListAllTeamMembersData, undefined>;

interface ListAllTeamMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTeamMembersData, undefined>;
}
export const listAllTeamMembersRef: ListAllTeamMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllTeamMembers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTeamMembersData, undefined>;

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
      userId: string;
    } & Users_Key;
    team: {
      teamId: string;
    } & Teams_Key;
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
listInvoicesByOrg(vars: ListInvoicesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

interface ListInvoicesByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesByOrgVariables): QueryRef<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;
}
export const listInvoicesByOrgRef: ListInvoicesByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInvoicesByOrg(dc: DataConnect, vars: ListInvoicesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesByOrgData, ListInvoicesByOrgVariables>;

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
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListInvoicesByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInvoicesByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInvoicesByOrgData {
  invoices: ({
    invoiceId: string;
    invoiceNumber?: string | null;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
  } & Invoices_Key)[];
}
```
### Using `ListInvoicesByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInvoicesByOrg, ListInvoicesByOrgVariables } from '@kalex/dataconnect';

// The `ListInvoicesByOrg` query requires an argument of type `ListInvoicesByOrgVariables`:
const listInvoicesByOrgVars: ListInvoicesByOrgVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listInvoicesByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInvoicesByOrg(listInvoicesByOrgVars);
// Variables can be defined inline as well.
const { data } = await listInvoicesByOrg({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listInvoicesByOrgRef()` function to get a reference to the query.
const ref = listInvoicesByOrgRef(listInvoicesByOrgVars);
// Variables can be defined inline as well.
const ref = listInvoicesByOrgRef({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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

## ListInvoicesBySeller
You can execute the `ListInvoicesBySeller` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listInvoicesBySeller(vars: ListInvoicesBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;

interface ListInvoicesBySellerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
}
export const listInvoicesBySellerRef: ListInvoicesBySellerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInvoicesBySeller(dc: DataConnect, vars: ListInvoicesBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;

interface ListInvoicesBySellerRef {
  ...
  (dc: DataConnect, vars: ListInvoicesBySellerVariables): QueryRef<ListInvoicesBySellerData, ListInvoicesBySellerVariables>;
}
export const listInvoicesBySellerRef: ListInvoicesBySellerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInvoicesBySellerRef:
```typescript
const name = listInvoicesBySellerRef.operationName;
console.log(name);
```

### Variables
The `ListInvoicesBySeller` query requires an argument of type `ListInvoicesBySellerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListInvoicesBySellerVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListInvoicesBySeller` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInvoicesBySellerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInvoicesBySellerData {
  invoices: ({
    invoiceId: string;
    invoiceNumber?: string | null;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    dueDate?: TimestampString | null;
    paidAt?: TimestampString | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
  } & Invoices_Key)[];
}
```
### Using `ListInvoicesBySeller`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInvoicesBySeller, ListInvoicesBySellerVariables } from '@kalex/dataconnect';

// The `ListInvoicesBySeller` query requires an argument of type `ListInvoicesBySellerVariables`:
const listInvoicesBySellerVars: ListInvoicesBySellerVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listInvoicesBySeller()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInvoicesBySeller(listInvoicesBySellerVars);
// Variables can be defined inline as well.
const { data } = await listInvoicesBySeller({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInvoicesBySeller(dataConnect, listInvoicesBySellerVars);

console.log(data.invoices);

// Or, you can use the `Promise` API.
listInvoicesBySeller(listInvoicesBySellerVars).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `ListInvoicesBySeller`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInvoicesBySellerRef, ListInvoicesBySellerVariables } from '@kalex/dataconnect';

// The `ListInvoicesBySeller` query requires an argument of type `ListInvoicesBySellerVariables`:
const listInvoicesBySellerVars: ListInvoicesBySellerVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listInvoicesBySellerRef()` function to get a reference to the query.
const ref = listInvoicesBySellerRef(listInvoicesBySellerVars);
// Variables can be defined inline as well.
const ref = listInvoicesBySellerRef({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInvoicesBySellerRef(dataConnect, listInvoicesBySellerVars);

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

## ListPaymentsByOrg
You can execute the `ListPaymentsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listPaymentsByOrg(vars: ListPaymentsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;

interface ListPaymentsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPaymentsByOrgVariables): QueryRef<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;
}
export const listPaymentsByOrgRef: ListPaymentsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPaymentsByOrg(dc: DataConnect, vars: ListPaymentsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;

interface ListPaymentsByOrgRef {
  ...
  (dc: DataConnect, vars: ListPaymentsByOrgVariables): QueryRef<ListPaymentsByOrgData, ListPaymentsByOrgVariables>;
}
export const listPaymentsByOrgRef: ListPaymentsByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPaymentsByOrgRef:
```typescript
const name = listPaymentsByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListPaymentsByOrg` query requires an argument of type `ListPaymentsByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPaymentsByOrgVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListPaymentsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPaymentsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPaymentsByOrgData {
  payments: ({
    paymentId: string;
    appId: string;
    buyer: {
      orgId: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
    } & Organizations_Key;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key)[];
}
```
### Using `ListPaymentsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPaymentsByOrg, ListPaymentsByOrgVariables } from '@kalex/dataconnect';

// The `ListPaymentsByOrg` query requires an argument of type `ListPaymentsByOrgVariables`:
const listPaymentsByOrgVars: ListPaymentsByOrgVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPaymentsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPaymentsByOrg(listPaymentsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listPaymentsByOrg({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPaymentsByOrg(dataConnect, listPaymentsByOrgVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
listPaymentsByOrg(listPaymentsByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `ListPaymentsByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPaymentsByOrgRef, ListPaymentsByOrgVariables } from '@kalex/dataconnect';

// The `ListPaymentsByOrg` query requires an argument of type `ListPaymentsByOrgVariables`:
const listPaymentsByOrgVars: ListPaymentsByOrgVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPaymentsByOrgRef()` function to get a reference to the query.
const ref = listPaymentsByOrgRef(listPaymentsByOrgVars);
// Variables can be defined inline as well.
const ref = listPaymentsByOrgRef({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPaymentsByOrgRef(dataConnect, listPaymentsByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## ListPaymentsBySeller
You can execute the `ListPaymentsBySeller` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listPaymentsBySeller(vars: ListPaymentsBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;

interface ListPaymentsBySellerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPaymentsBySellerVariables): QueryRef<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;
}
export const listPaymentsBySellerRef: ListPaymentsBySellerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPaymentsBySeller(dc: DataConnect, vars: ListPaymentsBySellerVariables, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;

interface ListPaymentsBySellerRef {
  ...
  (dc: DataConnect, vars: ListPaymentsBySellerVariables): QueryRef<ListPaymentsBySellerData, ListPaymentsBySellerVariables>;
}
export const listPaymentsBySellerRef: ListPaymentsBySellerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPaymentsBySellerRef:
```typescript
const name = listPaymentsBySellerRef.operationName;
console.log(name);
```

### Variables
The `ListPaymentsBySeller` query requires an argument of type `ListPaymentsBySellerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPaymentsBySellerVariables {
  sellerOrgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListPaymentsBySeller` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPaymentsBySellerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPaymentsBySellerData {
  payments: ({
    paymentId: string;
    appId: string;
    buyer: {
      orgId: string;
    } & Organizations_Key;
    seller?: {
      orgId: string;
    } & Organizations_Key;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key)[];
}
```
### Using `ListPaymentsBySeller`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPaymentsBySeller, ListPaymentsBySellerVariables } from '@kalex/dataconnect';

// The `ListPaymentsBySeller` query requires an argument of type `ListPaymentsBySellerVariables`:
const listPaymentsBySellerVars: ListPaymentsBySellerVariables = {
  sellerOrgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPaymentsBySeller()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPaymentsBySeller(listPaymentsBySellerVars);
// Variables can be defined inline as well.
const { data } = await listPaymentsBySeller({ sellerOrgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPaymentsBySeller(dataConnect, listPaymentsBySellerVars);

console.log(data.payments);

// Or, you can use the `Promise` API.
listPaymentsBySeller(listPaymentsBySellerVars).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `ListPaymentsBySeller`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPaymentsBySellerRef, ListPaymentsBySellerVariables } from '@kalex/dataconnect';

// The `ListPaymentsBySeller` query requires an argument of type `ListPaymentsBySellerVariables`:
const listPaymentsBySellerVars: ListPaymentsBySellerVariables = {
  sellerOrgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPaymentsBySellerRef()` function to get a reference to the query.
const ref = listPaymentsBySellerRef(listPaymentsBySellerVars);
// Variables can be defined inline as well.
const ref = listPaymentsBySellerRef({ sellerOrgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPaymentsBySellerRef(dataConnect, listPaymentsBySellerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetInvoiceDetails
You can execute the `GetInvoiceDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getInvoiceDetails(vars: GetInvoiceDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetInvoiceDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

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
    appId: string;
    buyer: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    seller: {
      orgId: string;
      name: string;
    } & Organizations_Key;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string | null;
    taxPercent?: number | null;
    taxAmount?: number | null;
    subtotal?: number | null;
    subscriptionId?: string | null;
    checkoutId?: string | null;
    lineItems?: unknown | null;
    createdAt: TimestampString;
    metadata?: unknown | null;
    isTest: boolean;
  } & Invoices_Key;
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

## GetOrganizationByStripeCustomer
You can execute the `GetOrganizationByStripeCustomer` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getOrganizationByStripeCustomer(vars: GetOrganizationByStripeCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;

interface GetOrganizationByStripeCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
}
export const getOrganizationByStripeCustomerRef: GetOrganizationByStripeCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getOrganizationByStripeCustomer(dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;

interface GetOrganizationByStripeCustomerRef {
  ...
  (dc: DataConnect, vars: GetOrganizationByStripeCustomerVariables): QueryRef<GetOrganizationByStripeCustomerData, GetOrganizationByStripeCustomerVariables>;
}
export const getOrganizationByStripeCustomerRef: GetOrganizationByStripeCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getOrganizationByStripeCustomerRef:
```typescript
const name = getOrganizationByStripeCustomerRef.operationName;
console.log(name);
```

### Variables
The `GetOrganizationByStripeCustomer` query requires an argument of type `GetOrganizationByStripeCustomerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetOrganizationByStripeCustomerVariables {
  stripeCustomerId: string;
}
```
### Return Type
Recall that executing the `GetOrganizationByStripeCustomer` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetOrganizationByStripeCustomerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetOrganizationByStripeCustomerData {
  organizations: ({
    orgId: string;
    name: string;
    type: string;
    country: string;
    stripeCustomerId?: string | null;
    stripeConnectAccountId?: string | null;
    stripeConnectOnboarded?: boolean | null;
  } & Organizations_Key)[];
}
```
### Using `GetOrganizationByStripeCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getOrganizationByStripeCustomer, GetOrganizationByStripeCustomerVariables } from '@kalex/dataconnect';

// The `GetOrganizationByStripeCustomer` query requires an argument of type `GetOrganizationByStripeCustomerVariables`:
const getOrganizationByStripeCustomerVars: GetOrganizationByStripeCustomerVariables = {
  stripeCustomerId: ..., 
};

// Call the `getOrganizationByStripeCustomer()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getOrganizationByStripeCustomer(getOrganizationByStripeCustomerVars);
// Variables can be defined inline as well.
const { data } = await getOrganizationByStripeCustomer({ stripeCustomerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getOrganizationByStripeCustomer(dataConnect, getOrganizationByStripeCustomerVars);

console.log(data.organizations);

// Or, you can use the `Promise` API.
getOrganizationByStripeCustomer(getOrganizationByStripeCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.organizations);
});
```

### Using `GetOrganizationByStripeCustomer`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getOrganizationByStripeCustomerRef, GetOrganizationByStripeCustomerVariables } from '@kalex/dataconnect';

// The `GetOrganizationByStripeCustomer` query requires an argument of type `GetOrganizationByStripeCustomerVariables`:
const getOrganizationByStripeCustomerVars: GetOrganizationByStripeCustomerVariables = {
  stripeCustomerId: ..., 
};

// Call the `getOrganizationByStripeCustomerRef()` function to get a reference to the query.
const ref = getOrganizationByStripeCustomerRef(getOrganizationByStripeCustomerVars);
// Variables can be defined inline as well.
const ref = getOrganizationByStripeCustomerRef({ stripeCustomerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getOrganizationByStripeCustomerRef(dataConnect, getOrganizationByStripeCustomerVars);

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

## ListTeamsByOrg
You can execute the `ListTeamsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listTeamsByOrg(vars: ListTeamsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

interface ListTeamsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamsByOrgVariables): QueryRef<ListTeamsByOrgData, ListTeamsByOrgVariables>;
}
export const listTeamsByOrgRef: ListTeamsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeamsByOrg(dc: DataConnect, vars: ListTeamsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamsByOrgData, ListTeamsByOrgVariables>;

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
  appId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListTeamsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTeamsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTeamsByOrgData {
  teams: ({
    teamId: string;
    appId: string;
    name: string;
    description?: string | null;
    rbac?: unknown | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Teams_Key)[];
}
```
### Using `ListTeamsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTeamsByOrg, ListTeamsByOrgVariables } from '@kalex/dataconnect';

// The `ListTeamsByOrg` query requires an argument of type `ListTeamsByOrgVariables`:
const listTeamsByOrgVars: ListTeamsByOrgVariables = {
  orgId: ..., 
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listTeamsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTeamsByOrg(listTeamsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listTeamsByOrg({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
  appId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listTeamsByOrgRef()` function to get a reference to the query.
const ref = listTeamsByOrgRef(listTeamsByOrgVars);
// Variables can be defined inline as well.
const ref = listTeamsByOrgRef({ orgId: ..., appId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

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
listTeamMembers(vars: ListTeamMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

interface ListTeamMembersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTeamMembersVariables): QueryRef<ListTeamMembersData, ListTeamMembersVariables>;
}
export const listTeamMembersRef: ListTeamMembersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeamMembers(dc: DataConnect, vars: ListTeamMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeamMembersData, ListTeamMembersVariables>;

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
      userId: string;
      email: string;
      fullName: string;
      avatarUrl?: string | null;
    } & Users_Key;
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
listAuditLogsByOrg(vars: ListAuditLogsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

interface ListAuditLogsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAuditLogsByOrgVariables): QueryRef<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;
}
export const listAuditLogsByOrgRef: ListAuditLogsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAuditLogsByOrg(dc: DataConnect, vars: ListAuditLogsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsByOrgData, ListAuditLogsByOrgVariables>;

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
  appId: string;
}
```
### Return Type
Recall that executing the `ListAuditLogsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAuditLogsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAuditLogsByOrgData {
  auditLogs: ({
    logId: string;
    appId: string;
  } & AuditLogs_Key)[];
}
```
### Using `ListAuditLogsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAuditLogsByOrg, ListAuditLogsByOrgVariables } from '@kalex/dataconnect';

// The `ListAuditLogsByOrg` query requires an argument of type `ListAuditLogsByOrgVariables`:
const listAuditLogsByOrgVars: ListAuditLogsByOrgVariables = {
  orgId: ..., 
  appId: ..., 
};

// Call the `listAuditLogsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAuditLogsByOrg(listAuditLogsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listAuditLogsByOrg({ orgId: ..., appId: ..., });

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
  appId: ..., 
};

// Call the `listAuditLogsByOrgRef()` function to get a reference to the query.
const ref = listAuditLogsByOrgRef(listAuditLogsByOrgVars);
// Variables can be defined inline as well.
const ref = listAuditLogsByOrgRef({ orgId: ..., appId: ..., });

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

## CheckVatNumberExists
You can execute the `CheckVatNumberExists` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
checkVatNumberExists(vars: CheckVatNumberExistsVariables, options?: ExecuteQueryOptions): QueryPromise<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;

interface CheckVatNumberExistsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CheckVatNumberExistsVariables): QueryRef<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;
}
export const checkVatNumberExistsRef: CheckVatNumberExistsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
checkVatNumberExists(dc: DataConnect, vars: CheckVatNumberExistsVariables, options?: ExecuteQueryOptions): QueryPromise<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;

interface CheckVatNumberExistsRef {
  ...
  (dc: DataConnect, vars: CheckVatNumberExistsVariables): QueryRef<CheckVatNumberExistsData, CheckVatNumberExistsVariables>;
}
export const checkVatNumberExistsRef: CheckVatNumberExistsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the checkVatNumberExistsRef:
```typescript
const name = checkVatNumberExistsRef.operationName;
console.log(name);
```

### Variables
The `CheckVatNumberExists` query requires an argument of type `CheckVatNumberExistsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CheckVatNumberExistsVariables {
  vatNumberHash: string;
}
```
### Return Type
Recall that executing the `CheckVatNumberExists` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CheckVatNumberExistsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CheckVatNumberExistsData {
  organizations: ({
    orgId: string;
    name: string;
  } & Organizations_Key)[];
}
```
### Using `CheckVatNumberExists`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, checkVatNumberExists, CheckVatNumberExistsVariables } from '@kalex/dataconnect';

// The `CheckVatNumberExists` query requires an argument of type `CheckVatNumberExistsVariables`:
const checkVatNumberExistsVars: CheckVatNumberExistsVariables = {
  vatNumberHash: ..., 
};

// Call the `checkVatNumberExists()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await checkVatNumberExists(checkVatNumberExistsVars);
// Variables can be defined inline as well.
const { data } = await checkVatNumberExists({ vatNumberHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await checkVatNumberExists(dataConnect, checkVatNumberExistsVars);

console.log(data.organizations);

// Or, you can use the `Promise` API.
checkVatNumberExists(checkVatNumberExistsVars).then((response) => {
  const data = response.data;
  console.log(data.organizations);
});
```

### Using `CheckVatNumberExists`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, checkVatNumberExistsRef, CheckVatNumberExistsVariables } from '@kalex/dataconnect';

// The `CheckVatNumberExists` query requires an argument of type `CheckVatNumberExistsVariables`:
const checkVatNumberExistsVars: CheckVatNumberExistsVariables = {
  vatNumberHash: ..., 
};

// Call the `checkVatNumberExistsRef()` function to get a reference to the query.
const ref = checkVatNumberExistsRef(checkVatNumberExistsVars);
// Variables can be defined inline as well.
const ref = checkVatNumberExistsRef({ vatNumberHash: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = checkVatNumberExistsRef(dataConnect, checkVatNumberExistsVars);

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

## GetCompute
You can execute the `GetCompute` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getCompute(vars: GetComputeVariables, options?: ExecuteQueryOptions): QueryPromise<GetComputeData, GetComputeVariables>;

interface GetComputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComputeVariables): QueryRef<GetComputeData, GetComputeVariables>;
}
export const getComputeRef: GetComputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompute(dc: DataConnect, vars: GetComputeVariables, options?: ExecuteQueryOptions): QueryPromise<GetComputeData, GetComputeVariables>;

interface GetComputeRef {
  ...
  (dc: DataConnect, vars: GetComputeVariables): QueryRef<GetComputeData, GetComputeVariables>;
}
export const getComputeRef: GetComputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComputeRef:
```typescript
const name = getComputeRef.operationName;
console.log(name);
```

### Variables
The `GetCompute` query requires an argument of type `GetComputeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComputeVariables {
  computeId: string;
}
```
### Return Type
Recall that executing the `GetCompute` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComputeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComputeData {
  compute?: {
    computeId: string;
    orgId: string;
    resourceType: string;
    usage: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Computes_Key;
}
```
### Using `GetCompute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompute, GetComputeVariables } from '@kalex/dataconnect';

// The `GetCompute` query requires an argument of type `GetComputeVariables`:
const getComputeVars: GetComputeVariables = {
  computeId: ..., 
};

// Call the `getCompute()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompute(getComputeVars);
// Variables can be defined inline as well.
const { data } = await getCompute({ computeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompute(dataConnect, getComputeVars);

console.log(data.compute);

// Or, you can use the `Promise` API.
getCompute(getComputeVars).then((response) => {
  const data = response.data;
  console.log(data.compute);
});
```

### Using `GetCompute`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComputeRef, GetComputeVariables } from '@kalex/dataconnect';

// The `GetCompute` query requires an argument of type `GetComputeVariables`:
const getComputeVars: GetComputeVariables = {
  computeId: ..., 
};

// Call the `getComputeRef()` function to get a reference to the query.
const ref = getComputeRef(getComputeVars);
// Variables can be defined inline as well.
const ref = getComputeRef({ computeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComputeRef(dataConnect, getComputeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.compute);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.compute);
});
```

## ListComputesByOrg
You can execute the `ListComputesByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listComputesByOrg(vars: ListComputesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListComputesByOrgData, ListComputesByOrgVariables>;

interface ListComputesByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListComputesByOrgVariables): QueryRef<ListComputesByOrgData, ListComputesByOrgVariables>;
}
export const listComputesByOrgRef: ListComputesByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listComputesByOrg(dc: DataConnect, vars: ListComputesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListComputesByOrgData, ListComputesByOrgVariables>;

interface ListComputesByOrgRef {
  ...
  (dc: DataConnect, vars: ListComputesByOrgVariables): QueryRef<ListComputesByOrgData, ListComputesByOrgVariables>;
}
export const listComputesByOrgRef: ListComputesByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listComputesByOrgRef:
```typescript
const name = listComputesByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListComputesByOrg` query requires an argument of type `ListComputesByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListComputesByOrgVariables {
  orgId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListComputesByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListComputesByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListComputesByOrgData {
  computes: ({
    computeId: string;
    orgId: string;
    resourceType: string;
    usage: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Computes_Key)[];
}
```
### Using `ListComputesByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listComputesByOrg, ListComputesByOrgVariables } from '@kalex/dataconnect';

// The `ListComputesByOrg` query requires an argument of type `ListComputesByOrgVariables`:
const listComputesByOrgVars: ListComputesByOrgVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listComputesByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listComputesByOrg(listComputesByOrgVars);
// Variables can be defined inline as well.
const { data } = await listComputesByOrg({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listComputesByOrg(dataConnect, listComputesByOrgVars);

console.log(data.computes);

// Or, you can use the `Promise` API.
listComputesByOrg(listComputesByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.computes);
});
```

### Using `ListComputesByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listComputesByOrgRef, ListComputesByOrgVariables } from '@kalex/dataconnect';

// The `ListComputesByOrg` query requires an argument of type `ListComputesByOrgVariables`:
const listComputesByOrgVars: ListComputesByOrgVariables = {
  orgId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listComputesByOrgRef()` function to get a reference to the query.
const ref = listComputesByOrgRef(listComputesByOrgVars);
// Variables can be defined inline as well.
const ref = listComputesByOrgRef({ orgId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listComputesByOrgRef(dataConnect, listComputesByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.computes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.computes);
});
```

## GetProductConsume
You can execute the `GetProductConsume` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getProductConsume(vars: GetProductConsumeVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductConsumeData, GetProductConsumeVariables>;

interface GetProductConsumeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductConsumeVariables): QueryRef<GetProductConsumeData, GetProductConsumeVariables>;
}
export const getProductConsumeRef: GetProductConsumeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductConsume(dc: DataConnect, vars: GetProductConsumeVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductConsumeData, GetProductConsumeVariables>;

interface GetProductConsumeRef {
  ...
  (dc: DataConnect, vars: GetProductConsumeVariables): QueryRef<GetProductConsumeData, GetProductConsumeVariables>;
}
export const getProductConsumeRef: GetProductConsumeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductConsumeRef:
```typescript
const name = getProductConsumeRef.operationName;
console.log(name);
```

### Variables
The `GetProductConsume` query requires an argument of type `GetProductConsumeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductConsumeVariables {
  consumeId: string;
}
```
### Return Type
Recall that executing the `GetProductConsume` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductConsumeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductConsumeData {
  productConsume?: {
    consumeId: string;
    orgId: string;
    productId: string;
    quantity: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductConsumes_Key;
}
```
### Using `GetProductConsume`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProductConsume, GetProductConsumeVariables } from '@kalex/dataconnect';

// The `GetProductConsume` query requires an argument of type `GetProductConsumeVariables`:
const getProductConsumeVars: GetProductConsumeVariables = {
  consumeId: ..., 
};

// Call the `getProductConsume()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProductConsume(getProductConsumeVars);
// Variables can be defined inline as well.
const { data } = await getProductConsume({ consumeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProductConsume(dataConnect, getProductConsumeVars);

console.log(data.productConsume);

// Or, you can use the `Promise` API.
getProductConsume(getProductConsumeVars).then((response) => {
  const data = response.data;
  console.log(data.productConsume);
});
```

### Using `GetProductConsume`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductConsumeRef, GetProductConsumeVariables } from '@kalex/dataconnect';

// The `GetProductConsume` query requires an argument of type `GetProductConsumeVariables`:
const getProductConsumeVars: GetProductConsumeVariables = {
  consumeId: ..., 
};

// Call the `getProductConsumeRef()` function to get a reference to the query.
const ref = getProductConsumeRef(getProductConsumeVars);
// Variables can be defined inline as well.
const ref = getProductConsumeRef({ consumeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductConsumeRef(dataConnect, getProductConsumeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productConsume);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productConsume);
});
```

## ListProductConsumesByOrg
You can execute the `ListProductConsumesByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listProductConsumesByOrg(vars: ListProductConsumesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;

interface ListProductConsumesByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductConsumesByOrgVariables): QueryRef<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;
}
export const listProductConsumesByOrgRef: ListProductConsumesByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductConsumesByOrg(dc: DataConnect, vars: ListProductConsumesByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;

interface ListProductConsumesByOrgRef {
  ...
  (dc: DataConnect, vars: ListProductConsumesByOrgVariables): QueryRef<ListProductConsumesByOrgData, ListProductConsumesByOrgVariables>;
}
export const listProductConsumesByOrgRef: ListProductConsumesByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductConsumesByOrgRef:
```typescript
const name = listProductConsumesByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListProductConsumesByOrg` query requires an argument of type `ListProductConsumesByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProductConsumesByOrgVariables {
  orgId: string;
}
```
### Return Type
Recall that executing the `ListProductConsumesByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductConsumesByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductConsumesByOrgData {
  productConsumes: ({
    consumeId: string;
    orgId: string;
    productId: string;
    quantity: number;
    status: string;
    metadata?: unknown | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & ProductConsumes_Key)[];
}
```
### Using `ListProductConsumesByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductConsumesByOrg, ListProductConsumesByOrgVariables } from '@kalex/dataconnect';

// The `ListProductConsumesByOrg` query requires an argument of type `ListProductConsumesByOrgVariables`:
const listProductConsumesByOrgVars: ListProductConsumesByOrgVariables = {
  orgId: ..., 
};

// Call the `listProductConsumesByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductConsumesByOrg(listProductConsumesByOrgVars);
// Variables can be defined inline as well.
const { data } = await listProductConsumesByOrg({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductConsumesByOrg(dataConnect, listProductConsumesByOrgVars);

console.log(data.productConsumes);

// Or, you can use the `Promise` API.
listProductConsumesByOrg(listProductConsumesByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.productConsumes);
});
```

### Using `ListProductConsumesByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductConsumesByOrgRef, ListProductConsumesByOrgVariables } from '@kalex/dataconnect';

// The `ListProductConsumesByOrg` query requires an argument of type `ListProductConsumesByOrgVariables`:
const listProductConsumesByOrgVars: ListProductConsumesByOrgVariables = {
  orgId: ..., 
};

// Call the `listProductConsumesByOrgRef()` function to get a reference to the query.
const ref = listProductConsumesByOrgRef(listProductConsumesByOrgVars);
// Variables can be defined inline as well.
const ref = listProductConsumesByOrgRef({ orgId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductConsumesByOrgRef(dataConnect, listProductConsumesByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productConsumes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productConsumes);
});
```

## GetPrice
You can execute the `GetPrice` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getPrice(vars: GetPriceVariables, options?: ExecuteQueryOptions): QueryPromise<GetPriceData, GetPriceVariables>;

interface GetPriceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPriceVariables): QueryRef<GetPriceData, GetPriceVariables>;
}
export const getPriceRef: GetPriceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPrice(dc: DataConnect, vars: GetPriceVariables, options?: ExecuteQueryOptions): QueryPromise<GetPriceData, GetPriceVariables>;

interface GetPriceRef {
  ...
  (dc: DataConnect, vars: GetPriceVariables): QueryRef<GetPriceData, GetPriceVariables>;
}
export const getPriceRef: GetPriceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPriceRef:
```typescript
const name = getPriceRef.operationName;
console.log(name);
```

### Variables
The `GetPrice` query requires an argument of type `GetPriceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPriceVariables {
  priceId: string;
}
```
### Return Type
Recall that executing the `GetPrice` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPriceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPriceData {
  price?: {
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    billingScheme?: string | null;
    recurringInterval?: string | null;
    recurringUsageType?: string | null;
    tier?: string | null;
    isActive: boolean;
    isTest: boolean;
    taxBehavior?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Prices_Key;
}
```
### Using `GetPrice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPrice, GetPriceVariables } from '@kalex/dataconnect';

// The `GetPrice` query requires an argument of type `GetPriceVariables`:
const getPriceVars: GetPriceVariables = {
  priceId: ..., 
};

// Call the `getPrice()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPrice(getPriceVars);
// Variables can be defined inline as well.
const { data } = await getPrice({ priceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPrice(dataConnect, getPriceVars);

console.log(data.price);

// Or, you can use the `Promise` API.
getPrice(getPriceVars).then((response) => {
  const data = response.data;
  console.log(data.price);
});
```

### Using `GetPrice`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPriceRef, GetPriceVariables } from '@kalex/dataconnect';

// The `GetPrice` query requires an argument of type `GetPriceVariables`:
const getPriceVars: GetPriceVariables = {
  priceId: ..., 
};

// Call the `getPriceRef()` function to get a reference to the query.
const ref = getPriceRef(getPriceVars);
// Variables can be defined inline as well.
const ref = getPriceRef({ priceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPriceRef(dataConnect, getPriceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.price);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.price);
});
```

## ListPricesByProduct
You can execute the `ListPricesByProduct` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listPricesByProduct(vars: ListPricesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<ListPricesByProductData, ListPricesByProductVariables>;

interface ListPricesByProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPricesByProductVariables): QueryRef<ListPricesByProductData, ListPricesByProductVariables>;
}
export const listPricesByProductRef: ListPricesByProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPricesByProduct(dc: DataConnect, vars: ListPricesByProductVariables, options?: ExecuteQueryOptions): QueryPromise<ListPricesByProductData, ListPricesByProductVariables>;

interface ListPricesByProductRef {
  ...
  (dc: DataConnect, vars: ListPricesByProductVariables): QueryRef<ListPricesByProductData, ListPricesByProductVariables>;
}
export const listPricesByProductRef: ListPricesByProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPricesByProductRef:
```typescript
const name = listPricesByProductRef.operationName;
console.log(name);
```

### Variables
The `ListPricesByProduct` query requires an argument of type `ListPricesByProductVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPricesByProductVariables {
  productId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListPricesByProduct` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPricesByProductData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPricesByProductData {
  prices: ({
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    isActive: boolean;
    tier?: string | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Prices_Key)[];
}
```
### Using `ListPricesByProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPricesByProduct, ListPricesByProductVariables } from '@kalex/dataconnect';

// The `ListPricesByProduct` query requires an argument of type `ListPricesByProductVariables`:
const listPricesByProductVars: ListPricesByProductVariables = {
  productId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPricesByProduct()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPricesByProduct(listPricesByProductVars);
// Variables can be defined inline as well.
const { data } = await listPricesByProduct({ productId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPricesByProduct(dataConnect, listPricesByProductVars);

console.log(data.prices);

// Or, you can use the `Promise` API.
listPricesByProduct(listPricesByProductVars).then((response) => {
  const data = response.data;
  console.log(data.prices);
});
```

### Using `ListPricesByProduct`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPricesByProductRef, ListPricesByProductVariables } from '@kalex/dataconnect';

// The `ListPricesByProduct` query requires an argument of type `ListPricesByProductVariables`:
const listPricesByProductVars: ListPricesByProductVariables = {
  productId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listPricesByProductRef()` function to get a reference to the query.
const ref = listPricesByProductRef(listPricesByProductVars);
// Variables can be defined inline as well.
const ref = listPricesByProductRef({ productId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPricesByProductRef(dataConnect, listPricesByProductVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.prices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.prices);
});
```

## ListAllPrices
You can execute the `ListAllPrices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllPrices(vars?: ListAllPricesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllPricesData, ListAllPricesVariables>;

interface ListAllPricesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAllPricesVariables): QueryRef<ListAllPricesData, ListAllPricesVariables>;
}
export const listAllPricesRef: ListAllPricesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllPrices(dc: DataConnect, vars?: ListAllPricesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllPricesData, ListAllPricesVariables>;

interface ListAllPricesRef {
  ...
  (dc: DataConnect, vars?: ListAllPricesVariables): QueryRef<ListAllPricesData, ListAllPricesVariables>;
}
export const listAllPricesRef: ListAllPricesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllPricesRef:
```typescript
const name = listAllPricesRef.operationName;
console.log(name);
```

### Variables
The `ListAllPrices` query has an optional argument of type `ListAllPricesVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAllPricesVariables {
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListAllPrices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllPricesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllPricesData {
  prices: ({
    priceId: string;
    productId: string;
    amount: number;
    currency: string;
    type: string;
    isActive: boolean;
    tier?: string | null;
    isTest: boolean;
    createdAt: TimestampString;
  } & Prices_Key)[];
}
```
### Using `ListAllPrices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllPrices, ListAllPricesVariables } from '@kalex/dataconnect';

// The `ListAllPrices` query has an optional argument of type `ListAllPricesVariables`:
const listAllPricesVars: ListAllPricesVariables = {
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllPrices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllPrices(listAllPricesVars);
// Variables can be defined inline as well.
const { data } = await listAllPrices({ limit: ..., beforeCreatedAt: ..., beforeId: ..., });
// Since all variables are optional for this query, you can omit the `ListAllPricesVariables` argument.
const { data } = await listAllPrices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllPrices(dataConnect, listAllPricesVars);

console.log(data.prices);

// Or, you can use the `Promise` API.
listAllPrices(listAllPricesVars).then((response) => {
  const data = response.data;
  console.log(data.prices);
});
```

### Using `ListAllPrices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllPricesRef, ListAllPricesVariables } from '@kalex/dataconnect';

// The `ListAllPrices` query has an optional argument of type `ListAllPricesVariables`:
const listAllPricesVars: ListAllPricesVariables = {
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listAllPricesRef()` function to get a reference to the query.
const ref = listAllPricesRef(listAllPricesVars);
// Variables can be defined inline as well.
const ref = listAllPricesRef({ limit: ..., beforeCreatedAt: ..., beforeId: ..., });
// Since all variables are optional for this query, you can omit the `ListAllPricesVariables` argument.
const ref = listAllPricesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllPricesRef(dataConnect, listAllPricesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.prices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.prices);
});
```

## GetCheckout
You can execute the `GetCheckout` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getCheckout(vars: GetCheckoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetCheckoutData, GetCheckoutVariables>;

interface GetCheckoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCheckoutVariables): QueryRef<GetCheckoutData, GetCheckoutVariables>;
}
export const getCheckoutRef: GetCheckoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCheckout(dc: DataConnect, vars: GetCheckoutVariables, options?: ExecuteQueryOptions): QueryPromise<GetCheckoutData, GetCheckoutVariables>;

interface GetCheckoutRef {
  ...
  (dc: DataConnect, vars: GetCheckoutVariables): QueryRef<GetCheckoutData, GetCheckoutVariables>;
}
export const getCheckoutRef: GetCheckoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCheckoutRef:
```typescript
const name = getCheckoutRef.operationName;
console.log(name);
```

### Variables
The `GetCheckout` query requires an argument of type `GetCheckoutVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCheckoutVariables {
  checkoutId: string;
}
```
### Return Type
Recall that executing the `GetCheckout` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCheckoutData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCheckoutData {
  checkout?: {
    checkoutId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    status: string;
    mode: string;
    items: unknown;
    amount: number;
    isTest: boolean;
    createdAt: TimestampString;
  } & Checkouts_Key;
}
```
### Using `GetCheckout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCheckout, GetCheckoutVariables } from '@kalex/dataconnect';

// The `GetCheckout` query requires an argument of type `GetCheckoutVariables`:
const getCheckoutVars: GetCheckoutVariables = {
  checkoutId: ..., 
};

// Call the `getCheckout()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCheckout(getCheckoutVars);
// Variables can be defined inline as well.
const { data } = await getCheckout({ checkoutId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCheckout(dataConnect, getCheckoutVars);

console.log(data.checkout);

// Or, you can use the `Promise` API.
getCheckout(getCheckoutVars).then((response) => {
  const data = response.data;
  console.log(data.checkout);
});
```

### Using `GetCheckout`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCheckoutRef, GetCheckoutVariables } from '@kalex/dataconnect';

// The `GetCheckout` query requires an argument of type `GetCheckoutVariables`:
const getCheckoutVars: GetCheckoutVariables = {
  checkoutId: ..., 
};

// Call the `getCheckoutRef()` function to get a reference to the query.
const ref = getCheckoutRef(getCheckoutVars);
// Variables can be defined inline as well.
const ref = getCheckoutRef({ checkoutId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCheckoutRef(dataConnect, getCheckoutVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.checkout);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.checkout);
});
```

## ListCheckoutsByOrg
You can execute the `ListCheckoutsByOrg` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listCheckoutsByOrg(vars: ListCheckoutsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;

interface ListCheckoutsByOrgRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCheckoutsByOrgVariables): QueryRef<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;
}
export const listCheckoutsByOrgRef: ListCheckoutsByOrgRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCheckoutsByOrg(dc: DataConnect, vars: ListCheckoutsByOrgVariables, options?: ExecuteQueryOptions): QueryPromise<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;

interface ListCheckoutsByOrgRef {
  ...
  (dc: DataConnect, vars: ListCheckoutsByOrgVariables): QueryRef<ListCheckoutsByOrgData, ListCheckoutsByOrgVariables>;
}
export const listCheckoutsByOrgRef: ListCheckoutsByOrgRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCheckoutsByOrgRef:
```typescript
const name = listCheckoutsByOrgRef.operationName;
console.log(name);
```

### Variables
The `ListCheckoutsByOrg` query requires an argument of type `ListCheckoutsByOrgVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCheckoutsByOrgVariables {
  buyerId: string;
  limit?: number;
  beforeCreatedAt?: TimestampString;
  beforeId?: string;
}
```
### Return Type
Recall that executing the `ListCheckoutsByOrg` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCheckoutsByOrgData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCheckoutsByOrgData {
  checkouts: ({
    checkoutId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    status: string;
    mode: string;
    amount: number;
    isTest: boolean;
    createdAt: TimestampString;
  } & Checkouts_Key)[];
}
```
### Using `ListCheckoutsByOrg`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCheckoutsByOrg, ListCheckoutsByOrgVariables } from '@kalex/dataconnect';

// The `ListCheckoutsByOrg` query requires an argument of type `ListCheckoutsByOrgVariables`:
const listCheckoutsByOrgVars: ListCheckoutsByOrgVariables = {
  buyerId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listCheckoutsByOrg()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCheckoutsByOrg(listCheckoutsByOrgVars);
// Variables can be defined inline as well.
const { data } = await listCheckoutsByOrg({ buyerId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCheckoutsByOrg(dataConnect, listCheckoutsByOrgVars);

console.log(data.checkouts);

// Or, you can use the `Promise` API.
listCheckoutsByOrg(listCheckoutsByOrgVars).then((response) => {
  const data = response.data;
  console.log(data.checkouts);
});
```

### Using `ListCheckoutsByOrg`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCheckoutsByOrgRef, ListCheckoutsByOrgVariables } from '@kalex/dataconnect';

// The `ListCheckoutsByOrg` query requires an argument of type `ListCheckoutsByOrgVariables`:
const listCheckoutsByOrgVars: ListCheckoutsByOrgVariables = {
  buyerId: ..., 
  limit: ..., // optional
  beforeCreatedAt: ..., // optional
  beforeId: ..., // optional
};

// Call the `listCheckoutsByOrgRef()` function to get a reference to the query.
const ref = listCheckoutsByOrgRef(listCheckoutsByOrgVars);
// Variables can be defined inline as well.
const ref = listCheckoutsByOrgRef({ buyerId: ..., limit: ..., beforeCreatedAt: ..., beforeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCheckoutsByOrgRef(dataConnect, listCheckoutsByOrgVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.checkouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.checkouts);
});
```

## ListAllCheckouts
You can execute the `ListAllCheckouts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
listAllCheckouts(options?: ExecuteQueryOptions): QueryPromise<ListAllCheckoutsData, undefined>;

interface ListAllCheckoutsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCheckoutsData, undefined>;
}
export const listAllCheckoutsRef: ListAllCheckoutsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllCheckouts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllCheckoutsData, undefined>;

interface ListAllCheckoutsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllCheckoutsData, undefined>;
}
export const listAllCheckoutsRef: ListAllCheckoutsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllCheckoutsRef:
```typescript
const name = listAllCheckoutsRef.operationName;
console.log(name);
```

### Variables
The `ListAllCheckouts` query has no variables.
### Return Type
Recall that executing the `ListAllCheckouts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllCheckoutsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllCheckoutsData {
  checkouts: ({
    checkoutId: string;
    buyerId: string;
    status: string;
    mode: string;
    amount: number;
  } & Checkouts_Key)[];
}
```
### Using `ListAllCheckouts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllCheckouts } from '@kalex/dataconnect';


// Call the `listAllCheckouts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllCheckouts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllCheckouts(dataConnect);

console.log(data.checkouts);

// Or, you can use the `Promise` API.
listAllCheckouts().then((response) => {
  const data = response.data;
  console.log(data.checkouts);
});
```

### Using `ListAllCheckouts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllCheckoutsRef } from '@kalex/dataconnect';


// Call the `listAllCheckoutsRef()` function to get a reference to the query.
const ref = listAllCheckoutsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllCheckoutsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.checkouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.checkouts);
});
```

## GetPayment
You can execute the `GetPayment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getPayment(vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface GetPaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
}
export const getPaymentRef: GetPaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayment(dc: DataConnect, vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface GetPaymentRef {
  ...
  (dc: DataConnect, vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
}
export const getPaymentRef: GetPaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPaymentRef:
```typescript
const name = getPaymentRef.operationName;
console.log(name);
```

### Variables
The `GetPayment` query requires an argument of type `GetPaymentVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPaymentVariables {
  paymentId: string;
}
```
### Return Type
Recall that executing the `GetPayment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPaymentData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPaymentData {
  payment?: {
    paymentId: string;
    buyerId: string;
    sellerId?: string | null;
    appId: string;
    invoiceId?: string | null;
    invoice?: {
      invoiceId: string;
      invoiceNumber?: string | null;
      status: string;
    } & Invoices_Key;
    amount: number;
    currency: string;
    status: string;
    paymentMethodType?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    receiptUrl?: string | null;
    stripeConnectAccountId?: string | null;
    applicationFeeAmount?: number | null;
    errorMessage?: string | null;
    metadata?: unknown | null;
    createdAt: TimestampString;
  } & Payments_Key;
}
```
### Using `GetPayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayment, GetPaymentVariables } from '@kalex/dataconnect';

// The `GetPayment` query requires an argument of type `GetPaymentVariables`:
const getPaymentVars: GetPaymentVariables = {
  paymentId: ..., 
};

// Call the `getPayment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayment(getPaymentVars);
// Variables can be defined inline as well.
const { data } = await getPayment({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayment(dataConnect, getPaymentVars);

console.log(data.payment);

// Or, you can use the `Promise` API.
getPayment(getPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

### Using `GetPayment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPaymentRef, GetPaymentVariables } from '@kalex/dataconnect';

// The `GetPayment` query requires an argument of type `GetPaymentVariables`:
const getPaymentVars: GetPaymentVariables = {
  paymentId: ..., 
};

// Call the `getPaymentRef()` function to get a reference to the query.
const ref = getPaymentRef(getPaymentVars);
// Variables can be defined inline as well.
const ref = getPaymentRef({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPaymentRef(dataConnect, getPaymentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

## GetProductDetails
You can execute the `GetProductDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
getProductDetails(vars: GetProductDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

interface GetProductDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductDetailsVariables): QueryRef<GetProductDetailsData, GetProductDetailsVariables>;
}
export const getProductDetailsRef: GetProductDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProductDetails(dc: DataConnect, vars: GetProductDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductDetailsData, GetProductDetailsVariables>;

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
    organization: {
      orgId: string;
    } & Organizations_Key;
    appId: string;
    name: string;
    description?: string | null;
    mode: string;
    type: string;
    route: string;
    sku?: string | null;
    isActive: boolean;
    isTest: boolean;
    metadata?: unknown | null;
    variants?: unknown | null;
    bom?: unknown | null;
    relatedProducts?: unknown | null;
    options?: unknown | null;
    taxBehavior: string;
    aiSummary?: string | null;
    prices_on_product: ({
      priceId: string;
      productId: string;
      amount: number;
      currency: string;
      type: string;
      billingScheme?: string | null;
      recurringInterval?: string | null;
      recurringUsageType?: string | null;
      tier?: string | null;
      isActive: boolean;
      isTest: boolean;
      taxBehavior?: string | null;
      metadata?: unknown | null;
      createdAt: TimestampString;
    } & Prices_Key)[];
    createdAt: TimestampString;
  } & Products_Key;
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
  userId: string;
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
  user_upsert: Users_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@kalex/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  userId: ..., 
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
const { data } = await upsertUser({ userId: ..., email: ..., fullName: ..., avatarUrl: ..., mobile: ..., locale: ..., theme: ..., metadata: ..., });

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
  userId: ..., 
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
const ref = upsertUserRef({ userId: ..., email: ..., fullName: ..., avatarUrl: ..., mobile: ..., locale: ..., theme: ..., metadata: ..., });

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
  vatNumberHash?: string | null;
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
  addressDetails?: unknown | null;
  confirmed?: boolean | null;
  viesValidated?: boolean | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrganizationData {
  organization_upsert: Organizations_Key;
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
  vatNumberHash: ..., // optional
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
  addressDetails: ..., // optional
  confirmed: ..., // optional
  viesValidated: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrganization(createOrganizationVars);
// Variables can be defined inline as well.
const { data } = await createOrganization({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., vatNumberHash: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., confirmed: ..., viesValidated: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrganization(dataConnect, createOrganizationVars);

console.log(data.organization_upsert);

// Or, you can use the `Promise` API.
createOrganization(createOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.organization_upsert);
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
  vatNumberHash: ..., // optional
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
  addressDetails: ..., // optional
  confirmed: ..., // optional
  viesValidated: ..., // optional
  metadata: ..., // optional
};

// Call the `createOrganizationRef()` function to get a reference to the mutation.
const ref = createOrganizationRef(createOrganizationVars);
// Variables can be defined inline as well.
const ref = createOrganizationRef({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., vatNumberHash: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., confirmed: ..., viesValidated: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrganizationRef(dataConnect, createOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_upsert);
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
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}
```
### Return Type
Recall that executing the `AddUserToOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddUserToOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddUserToOrganizationData {
  userOrganization_upsert: UserOrganizations_Key;
}
```
### Using `AddUserToOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addUserToOrganization, AddUserToOrganizationVariables } from '@kalex/dataconnect';

// The `AddUserToOrganization` mutation requires an argument of type `AddUserToOrganizationVariables`:
const addUserToOrganizationVars: AddUserToOrganizationVariables = {
  userId: ..., 
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `addUserToOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addUserToOrganization(addUserToOrganizationVars);
// Variables can be defined inline as well.
const { data } = await addUserToOrganization({ userId: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addUserToOrganization(dataConnect, addUserToOrganizationVars);

console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
addUserToOrganization(addUserToOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_upsert);
});
```

### Using `AddUserToOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addUserToOrganizationRef, AddUserToOrganizationVariables } from '@kalex/dataconnect';

// The `AddUserToOrganization` mutation requires an argument of type `AddUserToOrganizationVariables`:
const addUserToOrganizationVars: AddUserToOrganizationVariables = {
  userId: ..., 
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `addUserToOrganizationRef()` function to get a reference to the mutation.
const ref = addUserToOrganizationRef(addUserToOrganizationVars);
// Variables can be defined inline as well.
const ref = addUserToOrganizationRef({ userId: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addUserToOrganizationRef(dataConnect, addUserToOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_upsert);
});
```

## CreateOrgWithOwner
You can execute the `CreateOrgWithOwner` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createOrgWithOwner(vars: CreateOrgWithOwnerVariables): MutationPromise<CreateOrgWithOwnerData, CreateOrgWithOwnerVariables>;

interface CreateOrgWithOwnerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrgWithOwnerVariables): MutationRef<CreateOrgWithOwnerData, CreateOrgWithOwnerVariables>;
}
export const createOrgWithOwnerRef: CreateOrgWithOwnerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createOrgWithOwner(dc: DataConnect, vars: CreateOrgWithOwnerVariables): MutationPromise<CreateOrgWithOwnerData, CreateOrgWithOwnerVariables>;

interface CreateOrgWithOwnerRef {
  ...
  (dc: DataConnect, vars: CreateOrgWithOwnerVariables): MutationRef<CreateOrgWithOwnerData, CreateOrgWithOwnerVariables>;
}
export const createOrgWithOwnerRef: CreateOrgWithOwnerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createOrgWithOwnerRef:
```typescript
const name = createOrgWithOwnerRef.operationName;
console.log(name);
```

### Variables
The `CreateOrgWithOwner` mutation requires an argument of type `CreateOrgWithOwnerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateOrgWithOwnerVariables {
  orgId: string;
  name: string;
  stripeCustomerId?: string | null;
  type?: string | null;
  country?: string | null;
  vatNumber?: string | null;
  vatNumberHash?: string | null;
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
  addressDetails?: unknown | null;
  confirmed?: boolean | null;
  viesValidated?: boolean | null;
  metadata?: unknown | null;
  ownerId: string;
  ownerRbac?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateOrgWithOwner` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateOrgWithOwnerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateOrgWithOwnerData {
  organization_upsert: Organizations_Key;
  userOrganization_upsert: UserOrganizations_Key;
}
```
### Using `CreateOrgWithOwner`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createOrgWithOwner, CreateOrgWithOwnerVariables } from '@kalex/dataconnect';

// The `CreateOrgWithOwner` mutation requires an argument of type `CreateOrgWithOwnerVariables`:
const createOrgWithOwnerVars: CreateOrgWithOwnerVariables = {
  orgId: ..., 
  name: ..., 
  stripeCustomerId: ..., // optional
  type: ..., // optional
  country: ..., // optional
  vatNumber: ..., // optional
  vatNumberHash: ..., // optional
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
  addressDetails: ..., // optional
  confirmed: ..., // optional
  viesValidated: ..., // optional
  metadata: ..., // optional
  ownerId: ..., 
  ownerRbac: ..., // optional
};

// Call the `createOrgWithOwner()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createOrgWithOwner(createOrgWithOwnerVars);
// Variables can be defined inline as well.
const { data } = await createOrgWithOwner({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., vatNumberHash: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., confirmed: ..., viesValidated: ..., metadata: ..., ownerId: ..., ownerRbac: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createOrgWithOwner(dataConnect, createOrgWithOwnerVars);

console.log(data.organization_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
createOrgWithOwner(createOrgWithOwnerVars).then((response) => {
  const data = response.data;
  console.log(data.organization_upsert);
  console.log(data.userOrganization_upsert);
});
```

### Using `CreateOrgWithOwner`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createOrgWithOwnerRef, CreateOrgWithOwnerVariables } from '@kalex/dataconnect';

// The `CreateOrgWithOwner` mutation requires an argument of type `CreateOrgWithOwnerVariables`:
const createOrgWithOwnerVars: CreateOrgWithOwnerVariables = {
  orgId: ..., 
  name: ..., 
  stripeCustomerId: ..., // optional
  type: ..., // optional
  country: ..., // optional
  vatNumber: ..., // optional
  vatNumberHash: ..., // optional
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
  addressDetails: ..., // optional
  confirmed: ..., // optional
  viesValidated: ..., // optional
  metadata: ..., // optional
  ownerId: ..., 
  ownerRbac: ..., // optional
};

// Call the `createOrgWithOwnerRef()` function to get a reference to the mutation.
const ref = createOrgWithOwnerRef(createOrgWithOwnerVars);
// Variables can be defined inline as well.
const ref = createOrgWithOwnerRef({ orgId: ..., name: ..., stripeCustomerId: ..., type: ..., country: ..., vatNumber: ..., vatNumberHash: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., confirmed: ..., viesValidated: ..., metadata: ..., ownerId: ..., ownerRbac: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createOrgWithOwnerRef(dataConnect, createOrgWithOwnerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.organization_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.organization_upsert);
  console.log(data.userOrganization_upsert);
});
```

## CreateMemberWithUser
You can execute the `CreateMemberWithUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createMemberWithUser(vars: CreateMemberWithUserVariables): MutationPromise<CreateMemberWithUserData, CreateMemberWithUserVariables>;

interface CreateMemberWithUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMemberWithUserVariables): MutationRef<CreateMemberWithUserData, CreateMemberWithUserVariables>;
}
export const createMemberWithUserRef: CreateMemberWithUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMemberWithUser(dc: DataConnect, vars: CreateMemberWithUserVariables): MutationPromise<CreateMemberWithUserData, CreateMemberWithUserVariables>;

interface CreateMemberWithUserRef {
  ...
  (dc: DataConnect, vars: CreateMemberWithUserVariables): MutationRef<CreateMemberWithUserData, CreateMemberWithUserVariables>;
}
export const createMemberWithUserRef: CreateMemberWithUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMemberWithUserRef:
```typescript
const name = createMemberWithUserRef.operationName;
console.log(name);
```

### Variables
The `CreateMemberWithUser` mutation requires an argument of type `CreateMemberWithUserVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMemberWithUserVariables {
  userId: string;
  email: string;
  fullName?: string | null;
  userMetadata?: unknown | null;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateMemberWithUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMemberWithUserData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMemberWithUserData {
  user_upsert: Users_Key;
  userOrganization_upsert: UserOrganizations_Key;
}
```
### Using `CreateMemberWithUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMemberWithUser, CreateMemberWithUserVariables } from '@kalex/dataconnect';

// The `CreateMemberWithUser` mutation requires an argument of type `CreateMemberWithUserVariables`:
const createMemberWithUserVars: CreateMemberWithUserVariables = {
  userId: ..., 
  email: ..., 
  fullName: ..., // optional
  userMetadata: ..., // optional
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `createMemberWithUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMemberWithUser(createMemberWithUserVars);
// Variables can be defined inline as well.
const { data } = await createMemberWithUser({ userId: ..., email: ..., fullName: ..., userMetadata: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMemberWithUser(dataConnect, createMemberWithUserVars);

console.log(data.user_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
createMemberWithUser(createMemberWithUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.userOrganization_upsert);
});
```

### Using `CreateMemberWithUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMemberWithUserRef, CreateMemberWithUserVariables } from '@kalex/dataconnect';

// The `CreateMemberWithUser` mutation requires an argument of type `CreateMemberWithUserVariables`:
const createMemberWithUserVars: CreateMemberWithUserVariables = {
  userId: ..., 
  email: ..., 
  fullName: ..., // optional
  userMetadata: ..., // optional
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `createMemberWithUserRef()` function to get a reference to the mutation.
const ref = createMemberWithUserRef(createMemberWithUserVars);
// Variables can be defined inline as well.
const ref = createMemberWithUserRef({ userId: ..., email: ..., fullName: ..., userMetadata: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMemberWithUserRef(dataConnect, createMemberWithUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
  console.log(data.userOrganization_upsert);
});
```

## MigrateInviteeMembership
You can execute the `MigrateInviteeMembership` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
migrateInviteeMembership(vars: MigrateInviteeMembershipVariables): MutationPromise<MigrateInviteeMembershipData, MigrateInviteeMembershipVariables>;

interface MigrateInviteeMembershipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MigrateInviteeMembershipVariables): MutationRef<MigrateInviteeMembershipData, MigrateInviteeMembershipVariables>;
}
export const migrateInviteeMembershipRef: MigrateInviteeMembershipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
migrateInviteeMembership(dc: DataConnect, vars: MigrateInviteeMembershipVariables): MutationPromise<MigrateInviteeMembershipData, MigrateInviteeMembershipVariables>;

interface MigrateInviteeMembershipRef {
  ...
  (dc: DataConnect, vars: MigrateInviteeMembershipVariables): MutationRef<MigrateInviteeMembershipData, MigrateInviteeMembershipVariables>;
}
export const migrateInviteeMembershipRef: MigrateInviteeMembershipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the migrateInviteeMembershipRef:
```typescript
const name = migrateInviteeMembershipRef.operationName;
console.log(name);
```

### Variables
The `MigrateInviteeMembership` mutation requires an argument of type `MigrateInviteeMembershipVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MigrateInviteeMembershipVariables {
  tempUserId: string;
  orgId: string;
  realUserId: string;
  email: string;
  fullName?: string | null;
  userMetadata?: unknown | null;
  role: string;
  rbac?: unknown | null;
}
```
### Return Type
Recall that executing the `MigrateInviteeMembership` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MigrateInviteeMembershipData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MigrateInviteeMembershipData {
  userOrganization_delete?: UserOrganizations_Key | null;
  user_upsert: Users_Key;
  userOrganization_upsert: UserOrganizations_Key;
}
```
### Using `MigrateInviteeMembership`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, migrateInviteeMembership, MigrateInviteeMembershipVariables } from '@kalex/dataconnect';

// The `MigrateInviteeMembership` mutation requires an argument of type `MigrateInviteeMembershipVariables`:
const migrateInviteeMembershipVars: MigrateInviteeMembershipVariables = {
  tempUserId: ..., 
  orgId: ..., 
  realUserId: ..., 
  email: ..., 
  fullName: ..., // optional
  userMetadata: ..., // optional
  role: ..., 
  rbac: ..., // optional
};

// Call the `migrateInviteeMembership()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await migrateInviteeMembership(migrateInviteeMembershipVars);
// Variables can be defined inline as well.
const { data } = await migrateInviteeMembership({ tempUserId: ..., orgId: ..., realUserId: ..., email: ..., fullName: ..., userMetadata: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await migrateInviteeMembership(dataConnect, migrateInviteeMembershipVars);

console.log(data.userOrganization_delete);
console.log(data.user_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
migrateInviteeMembership(migrateInviteeMembershipVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_delete);
  console.log(data.user_upsert);
  console.log(data.userOrganization_upsert);
});
```

### Using `MigrateInviteeMembership`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, migrateInviteeMembershipRef, MigrateInviteeMembershipVariables } from '@kalex/dataconnect';

// The `MigrateInviteeMembership` mutation requires an argument of type `MigrateInviteeMembershipVariables`:
const migrateInviteeMembershipVars: MigrateInviteeMembershipVariables = {
  tempUserId: ..., 
  orgId: ..., 
  realUserId: ..., 
  email: ..., 
  fullName: ..., // optional
  userMetadata: ..., // optional
  role: ..., 
  rbac: ..., // optional
};

// Call the `migrateInviteeMembershipRef()` function to get a reference to the mutation.
const ref = migrateInviteeMembershipRef(migrateInviteeMembershipVars);
// Variables can be defined inline as well.
const ref = migrateInviteeMembershipRef({ tempUserId: ..., orgId: ..., realUserId: ..., email: ..., fullName: ..., userMetadata: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = migrateInviteeMembershipRef(dataConnect, migrateInviteeMembershipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userOrganization_delete);
console.log(data.user_upsert);
console.log(data.userOrganization_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_delete);
  console.log(data.user_upsert);
  console.log(data.userOrganization_upsert);
});
```

## UpdateUserOrganization
You can execute the `UpdateUserOrganization` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateUserOrganization(vars: UpdateUserOrganizationVariables): MutationPromise<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;

interface UpdateUserOrganizationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserOrganizationVariables): MutationRef<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;
}
export const updateUserOrganizationRef: UpdateUserOrganizationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserOrganization(dc: DataConnect, vars: UpdateUserOrganizationVariables): MutationPromise<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;

interface UpdateUserOrganizationRef {
  ...
  (dc: DataConnect, vars: UpdateUserOrganizationVariables): MutationRef<UpdateUserOrganizationData, UpdateUserOrganizationVariables>;
}
export const updateUserOrganizationRef: UpdateUserOrganizationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserOrganizationRef:
```typescript
const name = updateUserOrganizationRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserOrganization` mutation requires an argument of type `UpdateUserOrganizationVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserOrganizationVariables {
  userId: string;
  orgId: string;
  role: string;
  rbac?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateUserOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserOrganizationData {
  userOrganization_update?: UserOrganizations_Key | null;
}
```
### Using `UpdateUserOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserOrganization, UpdateUserOrganizationVariables } from '@kalex/dataconnect';

// The `UpdateUserOrganization` mutation requires an argument of type `UpdateUserOrganizationVariables`:
const updateUserOrganizationVars: UpdateUserOrganizationVariables = {
  userId: ..., 
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `updateUserOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserOrganization(updateUserOrganizationVars);
// Variables can be defined inline as well.
const { data } = await updateUserOrganization({ userId: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserOrganization(dataConnect, updateUserOrganizationVars);

console.log(data.userOrganization_update);

// Or, you can use the `Promise` API.
updateUserOrganization(updateUserOrganizationVars).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_update);
});
```

### Using `UpdateUserOrganization`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserOrganizationRef, UpdateUserOrganizationVariables } from '@kalex/dataconnect';

// The `UpdateUserOrganization` mutation requires an argument of type `UpdateUserOrganizationVariables`:
const updateUserOrganizationVars: UpdateUserOrganizationVariables = {
  userId: ..., 
  orgId: ..., 
  role: ..., 
  rbac: ..., // optional
};

// Call the `updateUserOrganizationRef()` function to get a reference to the mutation.
const ref = updateUserOrganizationRef(updateUserOrganizationVars);
// Variables can be defined inline as well.
const ref = updateUserOrganizationRef({ userId: ..., orgId: ..., role: ..., rbac: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserOrganizationRef(dataConnect, updateUserOrganizationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userOrganization_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userOrganization_update);
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
  subscriptionId: string;
  buyerId: string;
  sellerId?: string | null;
  appId: string;
  status: string;
  items: unknown;
  cancelAtPeriodEnd?: boolean | null;
  currentPeriodStart?: TimestampString | null;
  currentPeriodEnd?: TimestampString | null;
  trialStart?: TimestampString | null;
  trialEnd?: TimestampString | null;
  metadata?: unknown | null;
  expiresAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateSubscriptionStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSubscriptionStatusData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSubscriptionStatusData {
  subscription_upsert: Subscriptions_Key;
}
```
### Using `UpdateSubscriptionStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSubscriptionStatus, UpdateSubscriptionStatusVariables } from '@kalex/dataconnect';

// The `UpdateSubscriptionStatus` mutation requires an argument of type `UpdateSubscriptionStatusVariables`:
const updateSubscriptionStatusVars: UpdateSubscriptionStatusVariables = {
  subscriptionId: ..., 
  buyerId: ..., 
  sellerId: ..., // optional
  appId: ..., 
  status: ..., 
  items: ..., 
  cancelAtPeriodEnd: ..., // optional
  currentPeriodStart: ..., // optional
  currentPeriodEnd: ..., // optional
  trialStart: ..., // optional
  trialEnd: ..., // optional
  metadata: ..., // optional
  expiresAt: ..., // optional
};

// Call the `updateSubscriptionStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSubscriptionStatus(updateSubscriptionStatusVars);
// Variables can be defined inline as well.
const { data } = await updateSubscriptionStatus({ subscriptionId: ..., buyerId: ..., sellerId: ..., appId: ..., status: ..., items: ..., cancelAtPeriodEnd: ..., currentPeriodStart: ..., currentPeriodEnd: ..., trialStart: ..., trialEnd: ..., metadata: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSubscriptionStatus(dataConnect, updateSubscriptionStatusVars);

console.log(data.subscription_upsert);

// Or, you can use the `Promise` API.
updateSubscriptionStatus(updateSubscriptionStatusVars).then((response) => {
  const data = response.data;
  console.log(data.subscription_upsert);
});
```

### Using `UpdateSubscriptionStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSubscriptionStatusRef, UpdateSubscriptionStatusVariables } from '@kalex/dataconnect';

// The `UpdateSubscriptionStatus` mutation requires an argument of type `UpdateSubscriptionStatusVariables`:
const updateSubscriptionStatusVars: UpdateSubscriptionStatusVariables = {
  subscriptionId: ..., 
  buyerId: ..., 
  sellerId: ..., // optional
  appId: ..., 
  status: ..., 
  items: ..., 
  cancelAtPeriodEnd: ..., // optional
  currentPeriodStart: ..., // optional
  currentPeriodEnd: ..., // optional
  trialStart: ..., // optional
  trialEnd: ..., // optional
  metadata: ..., // optional
  expiresAt: ..., // optional
};

// Call the `updateSubscriptionStatusRef()` function to get a reference to the mutation.
const ref = updateSubscriptionStatusRef(updateSubscriptionStatusVars);
// Variables can be defined inline as well.
const ref = updateSubscriptionStatusRef({ subscriptionId: ..., buyerId: ..., sellerId: ..., appId: ..., status: ..., items: ..., cancelAtPeriodEnd: ..., currentPeriodStart: ..., currentPeriodEnd: ..., trialStart: ..., trialEnd: ..., metadata: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSubscriptionStatusRef(dataConnect, updateSubscriptionStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.subscription_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.subscription_upsert);
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
  stripeConnectAccountId?: string | null;
  stripeConnectOnboarded: boolean;
}
```
### Return Type
Recall that executing the `UpdateOrganizationStripeConnect` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationStripeConnectData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationStripeConnectData {
  organization_update?: Organizations_Key | null;
}
```
### Using `UpdateOrganizationStripeConnect`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationStripeConnect, UpdateOrganizationStripeConnectVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationStripeConnect` mutation requires an argument of type `UpdateOrganizationStripeConnectVariables`:
const updateOrganizationStripeConnectVars: UpdateOrganizationStripeConnectVariables = {
  orgId: ..., 
  stripeConnectAccountId: ..., // optional
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
  stripeConnectAccountId: ..., // optional
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

## UpdateOrganizationStripeCustomer
You can execute the `UpdateOrganizationStripeCustomer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationStripeCustomer(vars: UpdateOrganizationStripeCustomerVariables): MutationPromise<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;

interface UpdateOrganizationStripeCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationStripeCustomerVariables): MutationRef<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;
}
export const updateOrganizationStripeCustomerRef: UpdateOrganizationStripeCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationStripeCustomer(dc: DataConnect, vars: UpdateOrganizationStripeCustomerVariables): MutationPromise<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;

interface UpdateOrganizationStripeCustomerRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationStripeCustomerVariables): MutationRef<UpdateOrganizationStripeCustomerData, UpdateOrganizationStripeCustomerVariables>;
}
export const updateOrganizationStripeCustomerRef: UpdateOrganizationStripeCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationStripeCustomerRef:
```typescript
const name = updateOrganizationStripeCustomerRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationStripeCustomer` mutation requires an argument of type `UpdateOrganizationStripeCustomerVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrganizationStripeCustomerVariables {
  orgId: string;
  stripeCustomerId?: string | null;
}
```
### Return Type
Recall that executing the `UpdateOrganizationStripeCustomer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationStripeCustomerData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationStripeCustomerData {
  organization_update?: Organizations_Key | null;
}
```
### Using `UpdateOrganizationStripeCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationStripeCustomer, UpdateOrganizationStripeCustomerVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationStripeCustomer` mutation requires an argument of type `UpdateOrganizationStripeCustomerVariables`:
const updateOrganizationStripeCustomerVars: UpdateOrganizationStripeCustomerVariables = {
  orgId: ..., 
  stripeCustomerId: ..., // optional
};

// Call the `updateOrganizationStripeCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationStripeCustomer(updateOrganizationStripeCustomerVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationStripeCustomer({ orgId: ..., stripeCustomerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationStripeCustomer(dataConnect, updateOrganizationStripeCustomerVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationStripeCustomer(updateOrganizationStripeCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationStripeCustomer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationStripeCustomerRef, UpdateOrganizationStripeCustomerVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationStripeCustomer` mutation requires an argument of type `UpdateOrganizationStripeCustomerVariables`:
const updateOrganizationStripeCustomerVars: UpdateOrganizationStripeCustomerVariables = {
  orgId: ..., 
  stripeCustomerId: ..., // optional
};

// Call the `updateOrganizationStripeCustomerRef()` function to get a reference to the mutation.
const ref = updateOrganizationStripeCustomerRef(updateOrganizationStripeCustomerVars);
// Variables can be defined inline as well.
const ref = updateOrganizationStripeCustomerRef({ orgId: ..., stripeCustomerId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationStripeCustomerRef(dataConnect, updateOrganizationStripeCustomerVars);

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
  userId: string;
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
  authCode_insert: AuthCodes_Key;
}
```
### Using `CreateAuthCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuthCode, CreateAuthCodeVariables } from '@kalex/dataconnect';

// The `CreateAuthCode` mutation requires an argument of type `CreateAuthCodeVariables`:
const createAuthCodeVars: CreateAuthCodeVariables = {
  code: ..., 
  userId: ..., 
  clientId: ..., 
  redirectUri: ..., 
  expiresAt: ..., 
};

// Call the `createAuthCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuthCode(createAuthCodeVars);
// Variables can be defined inline as well.
const { data } = await createAuthCode({ code: ..., userId: ..., clientId: ..., redirectUri: ..., expiresAt: ..., });

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
  userId: ..., 
  clientId: ..., 
  redirectUri: ..., 
  expiresAt: ..., 
};

// Call the `createAuthCodeRef()` function to get a reference to the mutation.
const ref = createAuthCodeRef(createAuthCodeVars);
// Variables can be defined inline as well.
const ref = createAuthCodeRef({ code: ..., userId: ..., clientId: ..., redirectUri: ..., expiresAt: ..., });

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
  authCode_delete?: AuthCodes_Key | null;
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

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  userId: string;
  fullName?: string | null;
  locale?: string | null;
  theme?: string | null;
  avatarUrl?: string | null;
  mobile?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_update?: Users_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@kalex/dataconnect';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  userId: ..., 
  fullName: ..., // optional
  locale: ..., // optional
  theme: ..., // optional
  avatarUrl: ..., // optional
  mobile: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ userId: ..., fullName: ..., locale: ..., theme: ..., avatarUrl: ..., mobile: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@kalex/dataconnect';

// The `UpdateUserProfile` mutation requires an argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  userId: ..., 
  fullName: ..., // optional
  locale: ..., // optional
  theme: ..., // optional
  avatarUrl: ..., // optional
  mobile: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ userId: ..., fullName: ..., locale: ..., theme: ..., avatarUrl: ..., mobile: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

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

## UpdateUserMetadata
You can execute the `UpdateUserMetadata` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateUserMetadata(vars: UpdateUserMetadataVariables): MutationPromise<UpdateUserMetadataData, UpdateUserMetadataVariables>;

interface UpdateUserMetadataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserMetadataVariables): MutationRef<UpdateUserMetadataData, UpdateUserMetadataVariables>;
}
export const updateUserMetadataRef: UpdateUserMetadataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserMetadata(dc: DataConnect, vars: UpdateUserMetadataVariables): MutationPromise<UpdateUserMetadataData, UpdateUserMetadataVariables>;

interface UpdateUserMetadataRef {
  ...
  (dc: DataConnect, vars: UpdateUserMetadataVariables): MutationRef<UpdateUserMetadataData, UpdateUserMetadataVariables>;
}
export const updateUserMetadataRef: UpdateUserMetadataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserMetadataRef:
```typescript
const name = updateUserMetadataRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserMetadata` mutation requires an argument of type `UpdateUserMetadataVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserMetadataVariables {
  userId: string;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateUserMetadata` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserMetadataData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserMetadataData {
  user_update?: Users_Key | null;
}
```
### Using `UpdateUserMetadata`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserMetadata, UpdateUserMetadataVariables } from '@kalex/dataconnect';

// The `UpdateUserMetadata` mutation requires an argument of type `UpdateUserMetadataVariables`:
const updateUserMetadataVars: UpdateUserMetadataVariables = {
  userId: ..., 
  metadata: ..., // optional
};

// Call the `updateUserMetadata()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserMetadata(updateUserMetadataVars);
// Variables can be defined inline as well.
const { data } = await updateUserMetadata({ userId: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserMetadata(dataConnect, updateUserMetadataVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserMetadata(updateUserMetadataVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserMetadata`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserMetadataRef, UpdateUserMetadataVariables } from '@kalex/dataconnect';

// The `UpdateUserMetadata` mutation requires an argument of type `UpdateUserMetadataVariables`:
const updateUserMetadataVars: UpdateUserMetadataVariables = {
  userId: ..., 
  metadata: ..., // optional
};

// Call the `updateUserMetadataRef()` function to get a reference to the mutation.
const ref = updateUserMetadataRef(updateUserMetadataVars);
// Variables can be defined inline as well.
const ref = updateUserMetadataRef({ userId: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserMetadataRef(dataConnect, updateUserMetadataVars);

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
  name?: string | null;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  addressDetails?: unknown | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateOrganizationBilling` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationBillingData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationBillingData {
  organization_update?: Organizations_Key | null;
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
  name: ..., // optional
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  addressDetails: ..., // optional
  metadata: ..., // optional
};

// Call the `updateOrganizationBilling()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationBilling(updateOrganizationBillingVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationBilling({ orgId: ..., type: ..., name: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., addressDetails: ..., metadata: ..., });

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
  name: ..., // optional
  vatNumber: ..., // optional
  fiscalCode: ..., // optional
  billingAddress: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  addressDetails: ..., // optional
  metadata: ..., // optional
};

// Call the `updateOrganizationBillingRef()` function to get a reference to the mutation.
const ref = updateOrganizationBillingRef(updateOrganizationBillingVars);
// Variables can be defined inline as well.
const ref = updateOrganizationBillingRef({ orgId: ..., type: ..., name: ..., vatNumber: ..., fiscalCode: ..., billingAddress: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., addressDetails: ..., metadata: ..., });

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

## UpdateOrganizationVies
You can execute the `UpdateOrganizationVies` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationVies(vars: UpdateOrganizationViesVariables): MutationPromise<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;

interface UpdateOrganizationViesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationViesVariables): MutationRef<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;
}
export const updateOrganizationViesRef: UpdateOrganizationViesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationVies(dc: DataConnect, vars: UpdateOrganizationViesVariables): MutationPromise<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;

interface UpdateOrganizationViesRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationViesVariables): MutationRef<UpdateOrganizationViesData, UpdateOrganizationViesVariables>;
}
export const updateOrganizationViesRef: UpdateOrganizationViesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationViesRef:
```typescript
const name = updateOrganizationViesRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationVies` mutation requires an argument of type `UpdateOrganizationViesVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrganizationViesVariables {
  orgId: string;
  viesValidated: boolean;
}
```
### Return Type
Recall that executing the `UpdateOrganizationVies` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationViesData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationViesData {
  organization_update?: Organizations_Key | null;
}
```
### Using `UpdateOrganizationVies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationVies, UpdateOrganizationViesVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationVies` mutation requires an argument of type `UpdateOrganizationViesVariables`:
const updateOrganizationViesVars: UpdateOrganizationViesVariables = {
  orgId: ..., 
  viesValidated: ..., 
};

// Call the `updateOrganizationVies()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationVies(updateOrganizationViesVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationVies({ orgId: ..., viesValidated: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationVies(dataConnect, updateOrganizationViesVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationVies(updateOrganizationViesVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationVies`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationViesRef, UpdateOrganizationViesVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationVies` mutation requires an argument of type `UpdateOrganizationViesVariables`:
const updateOrganizationViesVars: UpdateOrganizationViesVariables = {
  orgId: ..., 
  viesValidated: ..., 
};

// Call the `updateOrganizationViesRef()` function to get a reference to the mutation.
const ref = updateOrganizationViesRef(updateOrganizationViesVars);
// Variables can be defined inline as well.
const ref = updateOrganizationViesRef({ orgId: ..., viesValidated: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationViesRef(dataConnect, updateOrganizationViesVars);

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

## UpdateOrganizationApps
You can execute the `UpdateOrganizationApps` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationApps(vars: UpdateOrganizationAppsVariables): MutationPromise<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;

interface UpdateOrganizationAppsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationAppsVariables): MutationRef<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;
}
export const updateOrganizationAppsRef: UpdateOrganizationAppsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationApps(dc: DataConnect, vars: UpdateOrganizationAppsVariables): MutationPromise<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;

interface UpdateOrganizationAppsRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationAppsVariables): MutationRef<UpdateOrganizationAppsData, UpdateOrganizationAppsVariables>;
}
export const updateOrganizationAppsRef: UpdateOrganizationAppsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationAppsRef:
```typescript
const name = updateOrganizationAppsRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationApps` mutation requires an argument of type `UpdateOrganizationAppsVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrganizationAppsVariables {
  orgId: string;
  apps?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateOrganizationApps` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationAppsData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationAppsData {
  organization_update?: Organizations_Key | null;
}
```
### Using `UpdateOrganizationApps`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationApps, UpdateOrganizationAppsVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationApps` mutation requires an argument of type `UpdateOrganizationAppsVariables`:
const updateOrganizationAppsVars: UpdateOrganizationAppsVariables = {
  orgId: ..., 
  apps: ..., // optional
};

// Call the `updateOrganizationApps()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationApps(updateOrganizationAppsVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationApps({ orgId: ..., apps: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationApps(dataConnect, updateOrganizationAppsVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationApps(updateOrganizationAppsVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationApps`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationAppsRef, UpdateOrganizationAppsVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationApps` mutation requires an argument of type `UpdateOrganizationAppsVariables`:
const updateOrganizationAppsVars: UpdateOrganizationAppsVariables = {
  orgId: ..., 
  apps: ..., // optional
};

// Call the `updateOrganizationAppsRef()` function to get a reference to the mutation.
const ref = updateOrganizationAppsRef(updateOrganizationAppsVars);
// Variables can be defined inline as well.
const ref = updateOrganizationAppsRef({ orgId: ..., apps: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationAppsRef(dataConnect, updateOrganizationAppsVars);

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
  fiscalCode?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  addressDetails?: unknown | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpsertPreRegistration` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPreRegistrationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPreRegistrationData {
  preRegistration_upsert: PreRegistrations_Key;
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
  fiscalCode: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  addressDetails: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertPreRegistration()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPreRegistration(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const { data } = await upsertPreRegistration({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., fiscalCode: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., metadata: ..., });

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
  fiscalCode: ..., // optional
  sdiCode: ..., // optional
  officeCode: ..., // optional
  cigCode: ..., // optional
  cupCode: ..., // optional
  address: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  altitude: ..., // optional
  addressDetails: ..., // optional
  metadata: ..., // optional
};

// Call the `upsertPreRegistrationRef()` function to get a reference to the mutation.
const ref = upsertPreRegistrationRef(upsertPreRegistrationVars);
// Variables can be defined inline as well.
const ref = upsertPreRegistrationRef({ email: ..., type: ..., companyName: ..., country: ..., vatNumber: ..., fiscalCode: ..., sdiCode: ..., officeCode: ..., cigCode: ..., cupCode: ..., address: ..., latitude: ..., longitude: ..., altitude: ..., addressDetails: ..., metadata: ..., });

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
  preRegistration_delete?: PreRegistrations_Key | null;
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
  organization_update?: Organizations_Key | null;
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
  userId: string;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: Users_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@kalex/dataconnect';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  userId: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ userId: ..., });

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
  userId: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ userId: ..., });

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

## UpdateOrganizationVatHash
You can execute the `UpdateOrganizationVatHash` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateOrganizationVatHash(vars: UpdateOrganizationVatHashVariables): MutationPromise<UpdateOrganizationVatHashData, UpdateOrganizationVatHashVariables>;

interface UpdateOrganizationVatHashRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrganizationVatHashVariables): MutationRef<UpdateOrganizationVatHashData, UpdateOrganizationVatHashVariables>;
}
export const updateOrganizationVatHashRef: UpdateOrganizationVatHashRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOrganizationVatHash(dc: DataConnect, vars: UpdateOrganizationVatHashVariables): MutationPromise<UpdateOrganizationVatHashData, UpdateOrganizationVatHashVariables>;

interface UpdateOrganizationVatHashRef {
  ...
  (dc: DataConnect, vars: UpdateOrganizationVatHashVariables): MutationRef<UpdateOrganizationVatHashData, UpdateOrganizationVatHashVariables>;
}
export const updateOrganizationVatHashRef: UpdateOrganizationVatHashRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOrganizationVatHashRef:
```typescript
const name = updateOrganizationVatHashRef.operationName;
console.log(name);
```

### Variables
The `UpdateOrganizationVatHash` mutation requires an argument of type `UpdateOrganizationVatHashVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOrganizationVatHashVariables {
  orgId: string;
  vatNumberHash?: string | null;
}
```
### Return Type
Recall that executing the `UpdateOrganizationVatHash` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOrganizationVatHashData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOrganizationVatHashData {
  organization_update?: Organizations_Key | null;
}
```
### Using `UpdateOrganizationVatHash`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationVatHash, UpdateOrganizationVatHashVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationVatHash` mutation requires an argument of type `UpdateOrganizationVatHashVariables`:
const updateOrganizationVatHashVars: UpdateOrganizationVatHashVariables = {
  orgId: ..., 
  vatNumberHash: ..., // optional
};

// Call the `updateOrganizationVatHash()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOrganizationVatHash(updateOrganizationVatHashVars);
// Variables can be defined inline as well.
const { data } = await updateOrganizationVatHash({ orgId: ..., vatNumberHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOrganizationVatHash(dataConnect, updateOrganizationVatHashVars);

console.log(data.organization_update);

// Or, you can use the `Promise` API.
updateOrganizationVatHash(updateOrganizationVatHashVars).then((response) => {
  const data = response.data;
  console.log(data.organization_update);
});
```

### Using `UpdateOrganizationVatHash`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOrganizationVatHashRef, UpdateOrganizationVatHashVariables } from '@kalex/dataconnect';

// The `UpdateOrganizationVatHash` mutation requires an argument of type `UpdateOrganizationVatHashVariables`:
const updateOrganizationVatHashVars: UpdateOrganizationVatHashVariables = {
  orgId: ..., 
  vatNumberHash: ..., // optional
};

// Call the `updateOrganizationVatHashRef()` function to get a reference to the mutation.
const ref = updateOrganizationVatHashRef(updateOrganizationVatHashVars);
// Variables can be defined inline as well.
const ref = updateOrganizationVatHashRef({ orgId: ..., vatNumberHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOrganizationVatHashRef(dataConnect, updateOrganizationVatHashVars);

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
  organization_delete?: Organizations_Key | null;
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
  userId: string;
  orgId: string;
}
```
### Return Type
Recall that executing the `DeleteUserOrganization` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserOrganizationData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserOrganizationData {
  userOrganization_delete?: UserOrganizations_Key | null;
}
```
### Using `DeleteUserOrganization`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserOrganization, DeleteUserOrganizationVariables } from '@kalex/dataconnect';

// The `DeleteUserOrganization` mutation requires an argument of type `DeleteUserOrganizationVariables`:
const deleteUserOrganizationVars: DeleteUserOrganizationVariables = {
  userId: ..., 
  orgId: ..., 
};

// Call the `deleteUserOrganization()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserOrganization(deleteUserOrganizationVars);
// Variables can be defined inline as well.
const { data } = await deleteUserOrganization({ userId: ..., orgId: ..., });

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
  userId: ..., 
  orgId: ..., 
};

// Call the `deleteUserOrganizationRef()` function to get a reference to the mutation.
const ref = deleteUserOrganizationRef(deleteUserOrganizationVars);
// Variables can be defined inline as well.
const ref = deleteUserOrganizationRef({ userId: ..., orgId: ..., });

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

## DeleteSubscription
You can execute the `DeleteSubscription` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteSubscription(vars: DeleteSubscriptionVariables): MutationPromise<DeleteSubscriptionData, DeleteSubscriptionVariables>;

interface DeleteSubscriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSubscriptionVariables): MutationRef<DeleteSubscriptionData, DeleteSubscriptionVariables>;
}
export const deleteSubscriptionRef: DeleteSubscriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSubscription(dc: DataConnect, vars: DeleteSubscriptionVariables): MutationPromise<DeleteSubscriptionData, DeleteSubscriptionVariables>;

interface DeleteSubscriptionRef {
  ...
  (dc: DataConnect, vars: DeleteSubscriptionVariables): MutationRef<DeleteSubscriptionData, DeleteSubscriptionVariables>;
}
export const deleteSubscriptionRef: DeleteSubscriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSubscriptionRef:
```typescript
const name = deleteSubscriptionRef.operationName;
console.log(name);
```

### Variables
The `DeleteSubscription` mutation requires an argument of type `DeleteSubscriptionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSubscriptionVariables {
  subscriptionId: string;
}
```
### Return Type
Recall that executing the `DeleteSubscription` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSubscriptionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSubscriptionData {
  subscription_delete?: Subscriptions_Key | null;
}
```
### Using `DeleteSubscription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSubscription, DeleteSubscriptionVariables } from '@kalex/dataconnect';

// The `DeleteSubscription` mutation requires an argument of type `DeleteSubscriptionVariables`:
const deleteSubscriptionVars: DeleteSubscriptionVariables = {
  subscriptionId: ..., 
};

// Call the `deleteSubscription()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSubscription(deleteSubscriptionVars);
// Variables can be defined inline as well.
const { data } = await deleteSubscription({ subscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSubscription(dataConnect, deleteSubscriptionVars);

console.log(data.subscription_delete);

// Or, you can use the `Promise` API.
deleteSubscription(deleteSubscriptionVars).then((response) => {
  const data = response.data;
  console.log(data.subscription_delete);
});
```

### Using `DeleteSubscription`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSubscriptionRef, DeleteSubscriptionVariables } from '@kalex/dataconnect';

// The `DeleteSubscription` mutation requires an argument of type `DeleteSubscriptionVariables`:
const deleteSubscriptionVars: DeleteSubscriptionVariables = {
  subscriptionId: ..., 
};

// Call the `deleteSubscriptionRef()` function to get a reference to the mutation.
const ref = deleteSubscriptionRef(deleteSubscriptionVars);
// Variables can be defined inline as well.
const ref = deleteSubscriptionRef({ subscriptionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSubscriptionRef(dataConnect, deleteSubscriptionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.subscription_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.subscription_delete);
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
  userId?: string | null;
  thingId?: string | null;
  orgId: string;
  appId: string;
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
  apiKey_upsert: ApiKeys_Key;
}
```
### Using `CreateApiKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createApiKey, CreateApiKeyVariables } from '@kalex/dataconnect';

// The `CreateApiKey` mutation requires an argument of type `CreateApiKeyVariables`:
const createApiKeyVars: CreateApiKeyVariables = {
  keyHash: ..., 
  userId: ..., // optional
  thingId: ..., // optional
  orgId: ..., 
  appId: ..., 
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
const { data } = await createApiKey({ keyHash: ..., userId: ..., thingId: ..., orgId: ..., appId: ..., name: ..., description: ..., ipWhitelist: ..., isActive: ..., expiresAt: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createApiKey(dataConnect, createApiKeyVars);

console.log(data.apiKey_upsert);

// Or, you can use the `Promise` API.
createApiKey(createApiKeyVars).then((response) => {
  const data = response.data;
  console.log(data.apiKey_upsert);
});
```

### Using `CreateApiKey`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createApiKeyRef, CreateApiKeyVariables } from '@kalex/dataconnect';

// The `CreateApiKey` mutation requires an argument of type `CreateApiKeyVariables`:
const createApiKeyVars: CreateApiKeyVariables = {
  keyHash: ..., 
  userId: ..., // optional
  thingId: ..., // optional
  orgId: ..., 
  appId: ..., 
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
const ref = createApiKeyRef({ keyHash: ..., userId: ..., thingId: ..., orgId: ..., appId: ..., name: ..., description: ..., ipWhitelist: ..., isActive: ..., expiresAt: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createApiKeyRef(dataConnect, createApiKeyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.apiKey_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.apiKey_upsert);
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
  apiKey_delete?: ApiKeys_Key | null;
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

## SetApiKeyPermission
You can execute the `SetApiKeyPermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
setApiKeyPermission(vars: SetApiKeyPermissionVariables): MutationPromise<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;

interface SetApiKeyPermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetApiKeyPermissionVariables): MutationRef<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;
}
export const setApiKeyPermissionRef: SetApiKeyPermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setApiKeyPermission(dc: DataConnect, vars: SetApiKeyPermissionVariables): MutationPromise<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;

interface SetApiKeyPermissionRef {
  ...
  (dc: DataConnect, vars: SetApiKeyPermissionVariables): MutationRef<SetApiKeyPermissionData, SetApiKeyPermissionVariables>;
}
export const setApiKeyPermissionRef: SetApiKeyPermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setApiKeyPermissionRef:
```typescript
const name = setApiKeyPermissionRef.operationName;
console.log(name);
```

### Variables
The `SetApiKeyPermission` mutation requires an argument of type `SetApiKeyPermissionVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetApiKeyPermissionVariables {
  keyHash: string;
  moduleId: string;
  canCreate: boolean;
  canRead: boolean;
  canList: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  allowedFields: unknown;
}
```
### Return Type
Recall that executing the `SetApiKeyPermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetApiKeyPermissionData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetApiKeyPermissionData {
  apiKeyPermission_upsert: ApiKeyPermissions_Key;
}
```
### Using `SetApiKeyPermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setApiKeyPermission, SetApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `SetApiKeyPermission` mutation requires an argument of type `SetApiKeyPermissionVariables`:
const setApiKeyPermissionVars: SetApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
  canCreate: ..., 
  canRead: ..., 
  canList: ..., 
  canUpdate: ..., 
  canDelete: ..., 
  allowedFields: ..., 
};

// Call the `setApiKeyPermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setApiKeyPermission(setApiKeyPermissionVars);
// Variables can be defined inline as well.
const { data } = await setApiKeyPermission({ keyHash: ..., moduleId: ..., canCreate: ..., canRead: ..., canList: ..., canUpdate: ..., canDelete: ..., allowedFields: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setApiKeyPermission(dataConnect, setApiKeyPermissionVars);

console.log(data.apiKeyPermission_upsert);

// Or, you can use the `Promise` API.
setApiKeyPermission(setApiKeyPermissionVars).then((response) => {
  const data = response.data;
  console.log(data.apiKeyPermission_upsert);
});
```

### Using `SetApiKeyPermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setApiKeyPermissionRef, SetApiKeyPermissionVariables } from '@kalex/dataconnect';

// The `SetApiKeyPermission` mutation requires an argument of type `SetApiKeyPermissionVariables`:
const setApiKeyPermissionVars: SetApiKeyPermissionVariables = {
  keyHash: ..., 
  moduleId: ..., 
  canCreate: ..., 
  canRead: ..., 
  canList: ..., 
  canUpdate: ..., 
  canDelete: ..., 
  allowedFields: ..., 
};

// Call the `setApiKeyPermissionRef()` function to get a reference to the mutation.
const ref = setApiKeyPermissionRef(setApiKeyPermissionVars);
// Variables can be defined inline as well.
const ref = setApiKeyPermissionRef({ keyHash: ..., moduleId: ..., canCreate: ..., canRead: ..., canList: ..., canUpdate: ..., canDelete: ..., allowedFields: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setApiKeyPermissionRef(dataConnect, setApiKeyPermissionVars);

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
  appId: string;
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
  thing_insert: Things_Key;
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
  appId: ..., 
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
const { data } = await createThing({ thingId: ..., orgId: ..., appId: ..., name: ..., type: ..., status: ..., deviceTokenHash: ..., metadata: ..., isTest: ..., });

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
  appId: ..., 
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
const ref = createThingRef({ thingId: ..., orgId: ..., appId: ..., name: ..., type: ..., status: ..., deviceTokenHash: ..., metadata: ..., isTest: ..., });

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
  thing_update?: Things_Key | null;
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
  thing_delete?: Things_Key | null;
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
  appId?: string | null;
  userId: string;
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
  auditLog_insert: AuditLogs_Key;
}
```
### Using `CreateAuditLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuditLog, CreateAuditLogVariables } from '@kalex/dataconnect';

// The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`:
const createAuditLogVars: CreateAuditLogVariables = {
  orgId: ..., 
  appId: ..., // optional
  userId: ..., 
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
const { data } = await createAuditLog({ orgId: ..., appId: ..., userId: ..., authType: ..., method: ..., endpoint: ..., ipAddress: ..., userAgent: ..., responseCode: ..., metadata: ..., });

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
  appId: ..., // optional
  userId: ..., 
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
const ref = createAuditLogRef({ orgId: ..., appId: ..., userId: ..., authType: ..., method: ..., endpoint: ..., ipAddress: ..., userAgent: ..., responseCode: ..., metadata: ..., });

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
  apiKeyPermission_delete?: ApiKeyPermissions_Key | null;
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
  auditLog_delete?: AuditLogs_Key | null;
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
  orgId: string;
  appId: string;
  name: string;
  description?: string | null;
  mode: string;
  type: string;
  route?: string | null;
  sku?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  metadata?: unknown | null;
  variants?: unknown | null;
  bom?: unknown | null;
  relatedProducts?: unknown | null;
  options?: unknown | null;
  taxBehavior?: string | null;
  aiSummary?: string | null;
  descriptionEmbedding?: unknown | null;
}
```
### Return Type
Recall that executing the `CreateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductData {
  product_upsert: Products_Key;
}
```
### Using `CreateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProduct, CreateProductVariables } from '@kalex/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  productId: ..., 
  orgId: ..., 
  appId: ..., 
  name: ..., 
  description: ..., // optional
  mode: ..., 
  type: ..., 
  route: ..., // optional
  sku: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
  metadata: ..., // optional
  variants: ..., // optional
  bom: ..., // optional
  relatedProducts: ..., // optional
  options: ..., // optional
  taxBehavior: ..., // optional
  aiSummary: ..., // optional
  descriptionEmbedding: ..., // optional
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ productId: ..., orgId: ..., appId: ..., name: ..., description: ..., mode: ..., type: ..., route: ..., sku: ..., isActive: ..., isTest: ..., metadata: ..., variants: ..., bom: ..., relatedProducts: ..., options: ..., taxBehavior: ..., aiSummary: ..., descriptionEmbedding: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProduct(dataConnect, createProductVars);

console.log(data.product_upsert);

// Or, you can use the `Promise` API.
createProduct(createProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_upsert);
});
```

### Using `CreateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductRef, CreateProductVariables } from '@kalex/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  productId: ..., 
  orgId: ..., 
  appId: ..., 
  name: ..., 
  description: ..., // optional
  mode: ..., 
  type: ..., 
  route: ..., // optional
  sku: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
  metadata: ..., // optional
  variants: ..., // optional
  bom: ..., // optional
  relatedProducts: ..., // optional
  options: ..., // optional
  taxBehavior: ..., // optional
  aiSummary: ..., // optional
  descriptionEmbedding: ..., // optional
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ productId: ..., orgId: ..., appId: ..., name: ..., description: ..., mode: ..., type: ..., route: ..., sku: ..., isActive: ..., isTest: ..., metadata: ..., variants: ..., bom: ..., relatedProducts: ..., options: ..., taxBehavior: ..., aiSummary: ..., descriptionEmbedding: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductRef(dataConnect, createProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_upsert);
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
  product_delete?: Products_Key | null;
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

## CreateProductBatch
You can execute the `CreateProductBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createProductBatch(vars: CreateProductBatchVariables): MutationPromise<CreateProductBatchData, CreateProductBatchVariables>;

interface CreateProductBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductBatchVariables): MutationRef<CreateProductBatchData, CreateProductBatchVariables>;
}
export const createProductBatchRef: CreateProductBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProductBatch(dc: DataConnect, vars: CreateProductBatchVariables): MutationPromise<CreateProductBatchData, CreateProductBatchVariables>;

interface CreateProductBatchRef {
  ...
  (dc: DataConnect, vars: CreateProductBatchVariables): MutationRef<CreateProductBatchData, CreateProductBatchVariables>;
}
export const createProductBatchRef: CreateProductBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductBatchRef:
```typescript
const name = createProductBatchRef.operationName;
console.log(name);
```

### Variables
The `CreateProductBatch` mutation requires an argument of type `CreateProductBatchVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductBatchVariables {
  batchId: string;
  productId: string;
  batchNumber: string;
  expirationDate?: TimestampString | null;
  productionDate?: TimestampString | null;
  stockStatus: unknown;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateProductBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductBatchData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductBatchData {
  productBatch_insert: ProductBatches_Key;
}
```
### Using `CreateProductBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProductBatch, CreateProductBatchVariables } from '@kalex/dataconnect';

// The `CreateProductBatch` mutation requires an argument of type `CreateProductBatchVariables`:
const createProductBatchVars: CreateProductBatchVariables = {
  batchId: ..., 
  productId: ..., 
  batchNumber: ..., 
  expirationDate: ..., // optional
  productionDate: ..., // optional
  stockStatus: ..., 
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createProductBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProductBatch(createProductBatchVars);
// Variables can be defined inline as well.
const { data } = await createProductBatch({ batchId: ..., productId: ..., batchNumber: ..., expirationDate: ..., productionDate: ..., stockStatus: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProductBatch(dataConnect, createProductBatchVars);

console.log(data.productBatch_insert);

// Or, you can use the `Promise` API.
createProductBatch(createProductBatchVars).then((response) => {
  const data = response.data;
  console.log(data.productBatch_insert);
});
```

### Using `CreateProductBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductBatchRef, CreateProductBatchVariables } from '@kalex/dataconnect';

// The `CreateProductBatch` mutation requires an argument of type `CreateProductBatchVariables`:
const createProductBatchVars: CreateProductBatchVariables = {
  batchId: ..., 
  productId: ..., 
  batchNumber: ..., 
  expirationDate: ..., // optional
  productionDate: ..., // optional
  stockStatus: ..., 
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createProductBatchRef()` function to get a reference to the mutation.
const ref = createProductBatchRef(createProductBatchVars);
// Variables can be defined inline as well.
const ref = createProductBatchRef({ batchId: ..., productId: ..., batchNumber: ..., expirationDate: ..., productionDate: ..., stockStatus: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductBatchRef(dataConnect, createProductBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productBatch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productBatch_insert);
});
```

## DeleteProductBatch
You can execute the `DeleteProductBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteProductBatch(vars: DeleteProductBatchVariables): MutationPromise<DeleteProductBatchData, DeleteProductBatchVariables>;

interface DeleteProductBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductBatchVariables): MutationRef<DeleteProductBatchData, DeleteProductBatchVariables>;
}
export const deleteProductBatchRef: DeleteProductBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProductBatch(dc: DataConnect, vars: DeleteProductBatchVariables): MutationPromise<DeleteProductBatchData, DeleteProductBatchVariables>;

interface DeleteProductBatchRef {
  ...
  (dc: DataConnect, vars: DeleteProductBatchVariables): MutationRef<DeleteProductBatchData, DeleteProductBatchVariables>;
}
export const deleteProductBatchRef: DeleteProductBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductBatchRef:
```typescript
const name = deleteProductBatchRef.operationName;
console.log(name);
```

### Variables
The `DeleteProductBatch` mutation requires an argument of type `DeleteProductBatchVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductBatchVariables {
  batchId: string;
}
```
### Return Type
Recall that executing the `DeleteProductBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductBatchData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductBatchData {
  productBatch_delete?: ProductBatches_Key | null;
}
```
### Using `DeleteProductBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProductBatch, DeleteProductBatchVariables } from '@kalex/dataconnect';

// The `DeleteProductBatch` mutation requires an argument of type `DeleteProductBatchVariables`:
const deleteProductBatchVars: DeleteProductBatchVariables = {
  batchId: ..., 
};

// Call the `deleteProductBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProductBatch(deleteProductBatchVars);
// Variables can be defined inline as well.
const { data } = await deleteProductBatch({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProductBatch(dataConnect, deleteProductBatchVars);

console.log(data.productBatch_delete);

// Or, you can use the `Promise` API.
deleteProductBatch(deleteProductBatchVars).then((response) => {
  const data = response.data;
  console.log(data.productBatch_delete);
});
```

### Using `DeleteProductBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductBatchRef, DeleteProductBatchVariables } from '@kalex/dataconnect';

// The `DeleteProductBatch` mutation requires an argument of type `DeleteProductBatchVariables`:
const deleteProductBatchVars: DeleteProductBatchVariables = {
  batchId: ..., 
};

// Call the `deleteProductBatchRef()` function to get a reference to the mutation.
const ref = deleteProductBatchRef(deleteProductBatchVars);
// Variables can be defined inline as well.
const ref = deleteProductBatchRef({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductBatchRef(dataConnect, deleteProductBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productBatch_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productBatch_delete);
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
  invoiceNumber?: string | null;
  buyerId: string;
  sellerId: string;
  appId: string;
  amount: number;
  currency?: string | null;
  status: string;
  pdfUrl?: string | null;
  taxPercent?: number | null;
  taxAmount?: number | null;
  subtotal?: number | null;
  subscriptionId?: string | null;
  checkoutId?: string | null;
  lineItems?: unknown | null;
  dueDate?: TimestampString | null;
  paidAt?: TimestampString | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateInvoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInvoiceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInvoiceData {
  invoice_upsert: Invoices_Key;
}
```
### Using `CreateInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInvoice, CreateInvoiceVariables } from '@kalex/dataconnect';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  invoiceId: ..., 
  invoiceNumber: ..., // optional
  buyerId: ..., 
  sellerId: ..., 
  appId: ..., 
  amount: ..., 
  currency: ..., // optional
  status: ..., 
  pdfUrl: ..., // optional
  taxPercent: ..., // optional
  taxAmount: ..., // optional
  subtotal: ..., // optional
  subscriptionId: ..., // optional
  checkoutId: ..., // optional
  lineItems: ..., // optional
  dueDate: ..., // optional
  paidAt: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createInvoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInvoice(createInvoiceVars);
// Variables can be defined inline as well.
const { data } = await createInvoice({ invoiceId: ..., invoiceNumber: ..., buyerId: ..., sellerId: ..., appId: ..., amount: ..., currency: ..., status: ..., pdfUrl: ..., taxPercent: ..., taxAmount: ..., subtotal: ..., subscriptionId: ..., checkoutId: ..., lineItems: ..., dueDate: ..., paidAt: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInvoice(dataConnect, createInvoiceVars);

console.log(data.invoice_upsert);

// Or, you can use the `Promise` API.
createInvoice(createInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_upsert);
});
```

### Using `CreateInvoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInvoiceRef, CreateInvoiceVariables } from '@kalex/dataconnect';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  invoiceId: ..., 
  invoiceNumber: ..., // optional
  buyerId: ..., 
  sellerId: ..., 
  appId: ..., 
  amount: ..., 
  currency: ..., // optional
  status: ..., 
  pdfUrl: ..., // optional
  taxPercent: ..., // optional
  taxAmount: ..., // optional
  subtotal: ..., // optional
  subscriptionId: ..., // optional
  checkoutId: ..., // optional
  lineItems: ..., // optional
  dueDate: ..., // optional
  paidAt: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createInvoiceRef()` function to get a reference to the mutation.
const ref = createInvoiceRef(createInvoiceVars);
// Variables can be defined inline as well.
const ref = createInvoiceRef({ invoiceId: ..., invoiceNumber: ..., buyerId: ..., sellerId: ..., appId: ..., amount: ..., currency: ..., status: ..., pdfUrl: ..., taxPercent: ..., taxAmount: ..., subtotal: ..., subscriptionId: ..., checkoutId: ..., lineItems: ..., dueDate: ..., paidAt: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInvoiceRef(dataConnect, createInvoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_upsert);
});
```

## UpdateInvoiceStatus
You can execute the `UpdateInvoiceStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInvoiceStatusRef:
```typescript
const name = updateInvoiceStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInvoiceStatusVariables {
  invoiceId: string;
  status: string;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateInvoiceStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInvoiceStatusData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInvoiceStatusData {
  invoice_update?: Invoices_Key | null;
}
```
### Using `UpdateInvoiceStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatus, UpdateInvoiceStatusVariables } from '@kalex/dataconnect';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  invoiceId: ..., 
  status: ..., 
  metadata: ..., // optional
};

// Call the `updateInvoiceStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInvoiceStatus(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const { data } = await updateInvoiceStatus({ invoiceId: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInvoiceStatus(dataConnect, updateInvoiceStatusVars);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
updateInvoiceStatus(updateInvoiceStatusVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
});
```

### Using `UpdateInvoiceStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatusRef, UpdateInvoiceStatusVariables } from '@kalex/dataconnect';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  invoiceId: ..., 
  status: ..., 
  metadata: ..., // optional
};

// Call the `updateInvoiceStatusRef()` function to get a reference to the mutation.
const ref = updateInvoiceStatusRef(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const ref = updateInvoiceStatusRef({ invoiceId: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInvoiceStatusRef(dataConnect, updateInvoiceStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
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
  invoice_delete?: Invoices_Key | null;
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

## CreatePayment
You can execute the `CreatePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPaymentRef:
```typescript
const name = createPaymentRef.operationName;
console.log(name);
```

### Variables
The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePaymentVariables {
  paymentId: string;
  orgId: string;
  sellerOrgId?: string | null;
  invoiceId?: string | null;
  amount: number;
  currency?: string | null;
  status: string;
  paymentMethodType?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  receiptUrl?: string | null;
  stripeConnectAccountId?: string | null;
  applicationFeeAmount?: number | null;
  errorMessage?: string | null;
  metadata?: unknown | null;
  appId: string;
}
```
### Return Type
Recall that executing the `CreatePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePaymentData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePaymentData {
  payment_upsert: Payments_Key;
}
```
### Using `CreatePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayment, CreatePaymentVariables } from '@kalex/dataconnect';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  paymentId: ..., 
  orgId: ..., 
  sellerOrgId: ..., // optional
  invoiceId: ..., // optional
  amount: ..., 
  currency: ..., // optional
  status: ..., 
  paymentMethodType: ..., // optional
  cardBrand: ..., // optional
  cardLast4: ..., // optional
  receiptUrl: ..., // optional
  stripeConnectAccountId: ..., // optional
  applicationFeeAmount: ..., // optional
  errorMessage: ..., // optional
  metadata: ..., // optional
  appId: ..., 
};

// Call the `createPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayment(createPaymentVars);
// Variables can be defined inline as well.
const { data } = await createPayment({ paymentId: ..., orgId: ..., sellerOrgId: ..., invoiceId: ..., amount: ..., currency: ..., status: ..., paymentMethodType: ..., cardBrand: ..., cardLast4: ..., receiptUrl: ..., stripeConnectAccountId: ..., applicationFeeAmount: ..., errorMessage: ..., metadata: ..., appId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayment(dataConnect, createPaymentVars);

console.log(data.payment_upsert);

// Or, you can use the `Promise` API.
createPayment(createPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_upsert);
});
```

### Using `CreatePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPaymentRef, CreatePaymentVariables } from '@kalex/dataconnect';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  paymentId: ..., 
  orgId: ..., 
  sellerOrgId: ..., // optional
  invoiceId: ..., // optional
  amount: ..., 
  currency: ..., // optional
  status: ..., 
  paymentMethodType: ..., // optional
  cardBrand: ..., // optional
  cardLast4: ..., // optional
  receiptUrl: ..., // optional
  stripeConnectAccountId: ..., // optional
  applicationFeeAmount: ..., // optional
  errorMessage: ..., // optional
  metadata: ..., // optional
  appId: ..., 
};

// Call the `createPaymentRef()` function to get a reference to the mutation.
const ref = createPaymentRef(createPaymentVars);
// Variables can be defined inline as well.
const ref = createPaymentRef({ paymentId: ..., orgId: ..., sellerOrgId: ..., invoiceId: ..., amount: ..., currency: ..., status: ..., paymentMethodType: ..., cardBrand: ..., cardLast4: ..., receiptUrl: ..., stripeConnectAccountId: ..., applicationFeeAmount: ..., errorMessage: ..., metadata: ..., appId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPaymentRef(dataConnect, createPaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_upsert);
});
```

## UpdatePaymentStatus
You can execute the `UpdatePaymentStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updatePaymentStatus(vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface UpdatePaymentStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePaymentStatus(dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationPromise<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;

interface UpdatePaymentStatusRef {
  ...
  (dc: DataConnect, vars: UpdatePaymentStatusVariables): MutationRef<UpdatePaymentStatusData, UpdatePaymentStatusVariables>;
}
export const updatePaymentStatusRef: UpdatePaymentStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePaymentStatusRef:
```typescript
const name = updatePaymentStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePaymentStatusVariables {
  paymentId: string;
  status: string;
  errorMessage?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdatePaymentStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePaymentStatusData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePaymentStatusData {
  payment_update?: Payments_Key | null;
}
```
### Using `UpdatePaymentStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePaymentStatus, UpdatePaymentStatusVariables } from '@kalex/dataconnect';

// The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`:
const updatePaymentStatusVars: UpdatePaymentStatusVariables = {
  paymentId: ..., 
  status: ..., 
  errorMessage: ..., // optional
  metadata: ..., // optional
};

// Call the `updatePaymentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePaymentStatus(updatePaymentStatusVars);
// Variables can be defined inline as well.
const { data } = await updatePaymentStatus({ paymentId: ..., status: ..., errorMessage: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePaymentStatus(dataConnect, updatePaymentStatusVars);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
updatePaymentStatus(updatePaymentStatusVars).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

### Using `UpdatePaymentStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePaymentStatusRef, UpdatePaymentStatusVariables } from '@kalex/dataconnect';

// The `UpdatePaymentStatus` mutation requires an argument of type `UpdatePaymentStatusVariables`:
const updatePaymentStatusVars: UpdatePaymentStatusVariables = {
  paymentId: ..., 
  status: ..., 
  errorMessage: ..., // optional
  metadata: ..., // optional
};

// Call the `updatePaymentStatusRef()` function to get a reference to the mutation.
const ref = updatePaymentStatusRef(updatePaymentStatusVars);
// Variables can be defined inline as well.
const ref = updatePaymentStatusRef({ paymentId: ..., status: ..., errorMessage: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePaymentStatusRef(dataConnect, updatePaymentStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

## DeletePayment
You can execute the `DeletePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deletePayment(vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface DeletePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
}
export const deletePaymentRef: DeletePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePayment(dc: DataConnect, vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface DeletePaymentRef {
  ...
  (dc: DataConnect, vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
}
export const deletePaymentRef: DeletePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePaymentRef:
```typescript
const name = deletePaymentRef.operationName;
console.log(name);
```

### Variables
The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePaymentVariables {
  paymentId: string;
}
```
### Return Type
Recall that executing the `DeletePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePaymentData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePaymentData {
  payment_delete?: Payments_Key | null;
}
```
### Using `DeletePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePayment, DeletePaymentVariables } from '@kalex/dataconnect';

// The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`:
const deletePaymentVars: DeletePaymentVariables = {
  paymentId: ..., 
};

// Call the `deletePayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePayment(deletePaymentVars);
// Variables can be defined inline as well.
const { data } = await deletePayment({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePayment(dataConnect, deletePaymentVars);

console.log(data.payment_delete);

// Or, you can use the `Promise` API.
deletePayment(deletePaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_delete);
});
```

### Using `DeletePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePaymentRef, DeletePaymentVariables } from '@kalex/dataconnect';

// The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`:
const deletePaymentVars: DeletePaymentVariables = {
  paymentId: ..., 
};

// Call the `deletePaymentRef()` function to get a reference to the mutation.
const ref = deletePaymentRef(deletePaymentVars);
// Variables can be defined inline as well.
const ref = deletePaymentRef({ paymentId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePaymentRef(dataConnect, deletePaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_delete);
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
  appId: string;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTeamData {
  team_upsert: Teams_Key;
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
  appId: ..., 
  name: ..., 
  description: ..., // optional
  rbac: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTeam(createTeamVars);
// Variables can be defined inline as well.
const { data } = await createTeam({ teamId: ..., orgId: ..., appId: ..., name: ..., description: ..., rbac: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTeam(dataConnect, createTeamVars);

console.log(data.team_upsert);

// Or, you can use the `Promise` API.
createTeam(createTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_upsert);
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
  appId: ..., 
  name: ..., 
  description: ..., // optional
  rbac: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createTeamRef()` function to get a reference to the mutation.
const ref = createTeamRef(createTeamVars);
// Variables can be defined inline as well.
const ref = createTeamRef({ teamId: ..., orgId: ..., appId: ..., name: ..., description: ..., rbac: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTeamRef(dataConnect, createTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_upsert);
});
```

## UpdateTeam
You can execute the `UpdateTeam` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateTeam(vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface UpdateTeamRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
}
export const updateTeamRef: UpdateTeamRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTeam(dc: DataConnect, vars: UpdateTeamVariables): MutationPromise<UpdateTeamData, UpdateTeamVariables>;

interface UpdateTeamRef {
  ...
  (dc: DataConnect, vars: UpdateTeamVariables): MutationRef<UpdateTeamData, UpdateTeamVariables>;
}
export const updateTeamRef: UpdateTeamRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTeamRef:
```typescript
const name = updateTeamRef.operationName;
console.log(name);
```

### Variables
The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTeamVariables {
  teamId: string;
  name: string;
  description?: string | null;
  rbac?: unknown | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTeamData {
  team_update?: Teams_Key | null;
}
```
### Using `UpdateTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTeam, UpdateTeamVariables } from '@kalex/dataconnect';

// The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`:
const updateTeamVars: UpdateTeamVariables = {
  teamId: ..., 
  name: ..., 
  description: ..., // optional
  rbac: ..., // optional
  metadata: ..., // optional
};

// Call the `updateTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTeam(updateTeamVars);
// Variables can be defined inline as well.
const { data } = await updateTeam({ teamId: ..., name: ..., description: ..., rbac: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTeam(dataConnect, updateTeamVars);

console.log(data.team_update);

// Or, you can use the `Promise` API.
updateTeam(updateTeamVars).then((response) => {
  const data = response.data;
  console.log(data.team_update);
});
```

### Using `UpdateTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTeamRef, UpdateTeamVariables } from '@kalex/dataconnect';

// The `UpdateTeam` mutation requires an argument of type `UpdateTeamVariables`:
const updateTeamVars: UpdateTeamVariables = {
  teamId: ..., 
  name: ..., 
  description: ..., // optional
  rbac: ..., // optional
  metadata: ..., // optional
};

// Call the `updateTeamRef()` function to get a reference to the mutation.
const ref = updateTeamRef(updateTeamVars);
// Variables can be defined inline as well.
const ref = updateTeamRef({ teamId: ..., name: ..., description: ..., rbac: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTeamRef(dataConnect, updateTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.team_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.team_update);
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
  team_delete?: Teams_Key | null;
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
  userId: string;
  teamId: string;
}
```
### Return Type
Recall that executing the `AddUserToTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddUserToTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddUserToTeamData {
  teamMember_upsert: TeamMembers_Key;
}
```
### Using `AddUserToTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addUserToTeam, AddUserToTeamVariables } from '@kalex/dataconnect';

// The `AddUserToTeam` mutation requires an argument of type `AddUserToTeamVariables`:
const addUserToTeamVars: AddUserToTeamVariables = {
  userId: ..., 
  teamId: ..., 
};

// Call the `addUserToTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addUserToTeam(addUserToTeamVars);
// Variables can be defined inline as well.
const { data } = await addUserToTeam({ userId: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addUserToTeam(dataConnect, addUserToTeamVars);

console.log(data.teamMember_upsert);

// Or, you can use the `Promise` API.
addUserToTeam(addUserToTeamVars).then((response) => {
  const data = response.data;
  console.log(data.teamMember_upsert);
});
```

### Using `AddUserToTeam`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addUserToTeamRef, AddUserToTeamVariables } from '@kalex/dataconnect';

// The `AddUserToTeam` mutation requires an argument of type `AddUserToTeamVariables`:
const addUserToTeamVars: AddUserToTeamVariables = {
  userId: ..., 
  teamId: ..., 
};

// Call the `addUserToTeamRef()` function to get a reference to the mutation.
const ref = addUserToTeamRef(addUserToTeamVars);
// Variables can be defined inline as well.
const ref = addUserToTeamRef({ userId: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addUserToTeamRef(dataConnect, addUserToTeamVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.teamMember_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.teamMember_upsert);
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
  userId: string;
  teamId: string;
}
```
### Return Type
Recall that executing the `RemoveUserFromTeam` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveUserFromTeamData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveUserFromTeamData {
  teamMember_delete?: TeamMembers_Key | null;
}
```
### Using `RemoveUserFromTeam`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeUserFromTeam, RemoveUserFromTeamVariables } from '@kalex/dataconnect';

// The `RemoveUserFromTeam` mutation requires an argument of type `RemoveUserFromTeamVariables`:
const removeUserFromTeamVars: RemoveUserFromTeamVariables = {
  userId: ..., 
  teamId: ..., 
};

// Call the `removeUserFromTeam()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeUserFromTeam(removeUserFromTeamVars);
// Variables can be defined inline as well.
const { data } = await removeUserFromTeam({ userId: ..., teamId: ..., });

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
  userId: ..., 
  teamId: ..., 
};

// Call the `removeUserFromTeamRef()` function to get a reference to the mutation.
const ref = removeUserFromTeamRef(removeUserFromTeamVars);
// Variables can be defined inline as well.
const ref = removeUserFromTeamRef({ userId: ..., teamId: ..., });

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

## CreateCompute
You can execute the `CreateCompute` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createCompute(vars: CreateComputeVariables): MutationPromise<CreateComputeData, CreateComputeVariables>;

interface CreateComputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComputeVariables): MutationRef<CreateComputeData, CreateComputeVariables>;
}
export const createComputeRef: CreateComputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCompute(dc: DataConnect, vars: CreateComputeVariables): MutationPromise<CreateComputeData, CreateComputeVariables>;

interface CreateComputeRef {
  ...
  (dc: DataConnect, vars: CreateComputeVariables): MutationRef<CreateComputeData, CreateComputeVariables>;
}
export const createComputeRef: CreateComputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createComputeRef:
```typescript
const name = createComputeRef.operationName;
console.log(name);
```

### Variables
The `CreateCompute` mutation requires an argument of type `CreateComputeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateComputeVariables {
  computeId: string;
  orgId: string;
  resourceType: string;
  usage?: number | null;
  status?: string | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateCompute` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateComputeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateComputeData {
  compute_upsert: Computes_Key;
}
```
### Using `CreateCompute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCompute, CreateComputeVariables } from '@kalex/dataconnect';

// The `CreateCompute` mutation requires an argument of type `CreateComputeVariables`:
const createComputeVars: CreateComputeVariables = {
  computeId: ..., 
  orgId: ..., 
  resourceType: ..., 
  usage: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createCompute()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCompute(createComputeVars);
// Variables can be defined inline as well.
const { data } = await createCompute({ computeId: ..., orgId: ..., resourceType: ..., usage: ..., status: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCompute(dataConnect, createComputeVars);

console.log(data.compute_upsert);

// Or, you can use the `Promise` API.
createCompute(createComputeVars).then((response) => {
  const data = response.data;
  console.log(data.compute_upsert);
});
```

### Using `CreateCompute`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createComputeRef, CreateComputeVariables } from '@kalex/dataconnect';

// The `CreateCompute` mutation requires an argument of type `CreateComputeVariables`:
const createComputeVars: CreateComputeVariables = {
  computeId: ..., 
  orgId: ..., 
  resourceType: ..., 
  usage: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createComputeRef()` function to get a reference to the mutation.
const ref = createComputeRef(createComputeVars);
// Variables can be defined inline as well.
const ref = createComputeRef({ computeId: ..., orgId: ..., resourceType: ..., usage: ..., status: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createComputeRef(dataConnect, createComputeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.compute_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.compute_upsert);
});
```

## UpdateCompute
You can execute the `UpdateCompute` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateCompute(vars: UpdateComputeVariables): MutationPromise<UpdateComputeData, UpdateComputeVariables>;

interface UpdateComputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateComputeVariables): MutationRef<UpdateComputeData, UpdateComputeVariables>;
}
export const updateComputeRef: UpdateComputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCompute(dc: DataConnect, vars: UpdateComputeVariables): MutationPromise<UpdateComputeData, UpdateComputeVariables>;

interface UpdateComputeRef {
  ...
  (dc: DataConnect, vars: UpdateComputeVariables): MutationRef<UpdateComputeData, UpdateComputeVariables>;
}
export const updateComputeRef: UpdateComputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateComputeRef:
```typescript
const name = updateComputeRef.operationName;
console.log(name);
```

### Variables
The `UpdateCompute` mutation requires an argument of type `UpdateComputeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateComputeVariables {
  computeId: string;
  usage?: number | null;
  status?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateCompute` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateComputeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateComputeData {
  compute_update?: Computes_Key | null;
}
```
### Using `UpdateCompute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCompute, UpdateComputeVariables } from '@kalex/dataconnect';

// The `UpdateCompute` mutation requires an argument of type `UpdateComputeVariables`:
const updateComputeVars: UpdateComputeVariables = {
  computeId: ..., 
  usage: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateCompute()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCompute(updateComputeVars);
// Variables can be defined inline as well.
const { data } = await updateCompute({ computeId: ..., usage: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCompute(dataConnect, updateComputeVars);

console.log(data.compute_update);

// Or, you can use the `Promise` API.
updateCompute(updateComputeVars).then((response) => {
  const data = response.data;
  console.log(data.compute_update);
});
```

### Using `UpdateCompute`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateComputeRef, UpdateComputeVariables } from '@kalex/dataconnect';

// The `UpdateCompute` mutation requires an argument of type `UpdateComputeVariables`:
const updateComputeVars: UpdateComputeVariables = {
  computeId: ..., 
  usage: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateComputeRef()` function to get a reference to the mutation.
const ref = updateComputeRef(updateComputeVars);
// Variables can be defined inline as well.
const ref = updateComputeRef({ computeId: ..., usage: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateComputeRef(dataConnect, updateComputeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.compute_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.compute_update);
});
```

## DeleteCompute
You can execute the `DeleteCompute` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteCompute(vars: DeleteComputeVariables): MutationPromise<DeleteComputeData, DeleteComputeVariables>;

interface DeleteComputeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteComputeVariables): MutationRef<DeleteComputeData, DeleteComputeVariables>;
}
export const deleteComputeRef: DeleteComputeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCompute(dc: DataConnect, vars: DeleteComputeVariables): MutationPromise<DeleteComputeData, DeleteComputeVariables>;

interface DeleteComputeRef {
  ...
  (dc: DataConnect, vars: DeleteComputeVariables): MutationRef<DeleteComputeData, DeleteComputeVariables>;
}
export const deleteComputeRef: DeleteComputeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteComputeRef:
```typescript
const name = deleteComputeRef.operationName;
console.log(name);
```

### Variables
The `DeleteCompute` mutation requires an argument of type `DeleteComputeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteComputeVariables {
  computeId: string;
}
```
### Return Type
Recall that executing the `DeleteCompute` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteComputeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteComputeData {
  compute_delete?: Computes_Key | null;
}
```
### Using `DeleteCompute`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCompute, DeleteComputeVariables } from '@kalex/dataconnect';

// The `DeleteCompute` mutation requires an argument of type `DeleteComputeVariables`:
const deleteComputeVars: DeleteComputeVariables = {
  computeId: ..., 
};

// Call the `deleteCompute()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCompute(deleteComputeVars);
// Variables can be defined inline as well.
const { data } = await deleteCompute({ computeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCompute(dataConnect, deleteComputeVars);

console.log(data.compute_delete);

// Or, you can use the `Promise` API.
deleteCompute(deleteComputeVars).then((response) => {
  const data = response.data;
  console.log(data.compute_delete);
});
```

### Using `DeleteCompute`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteComputeRef, DeleteComputeVariables } from '@kalex/dataconnect';

// The `DeleteCompute` mutation requires an argument of type `DeleteComputeVariables`:
const deleteComputeVars: DeleteComputeVariables = {
  computeId: ..., 
};

// Call the `deleteComputeRef()` function to get a reference to the mutation.
const ref = deleteComputeRef(deleteComputeVars);
// Variables can be defined inline as well.
const ref = deleteComputeRef({ computeId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteComputeRef(dataConnect, deleteComputeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.compute_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.compute_delete);
});
```

## CreatePrice
You can execute the `CreatePrice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createPrice(vars: CreatePriceVariables): MutationPromise<CreatePriceData, CreatePriceVariables>;

interface CreatePriceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePriceVariables): MutationRef<CreatePriceData, CreatePriceVariables>;
}
export const createPriceRef: CreatePriceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPrice(dc: DataConnect, vars: CreatePriceVariables): MutationPromise<CreatePriceData, CreatePriceVariables>;

interface CreatePriceRef {
  ...
  (dc: DataConnect, vars: CreatePriceVariables): MutationRef<CreatePriceData, CreatePriceVariables>;
}
export const createPriceRef: CreatePriceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPriceRef:
```typescript
const name = createPriceRef.operationName;
console.log(name);
```

### Variables
The `CreatePrice` mutation requires an argument of type `CreatePriceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePriceVariables {
  priceId: string;
  productId: string;
  amount: number;
  currency?: string | null;
  type: string;
  billingScheme?: string | null;
  recurringInterval?: string | null;
  recurringUsageType?: string | null;
  tier?: string | null;
  isActive?: boolean | null;
  isTest?: boolean | null;
  taxBehavior?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `CreatePrice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePriceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePriceData {
  price_upsert: Prices_Key;
}
```
### Using `CreatePrice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPrice, CreatePriceVariables } from '@kalex/dataconnect';

// The `CreatePrice` mutation requires an argument of type `CreatePriceVariables`:
const createPriceVars: CreatePriceVariables = {
  priceId: ..., 
  productId: ..., 
  amount: ..., 
  currency: ..., // optional
  type: ..., 
  billingScheme: ..., // optional
  recurringInterval: ..., // optional
  recurringUsageType: ..., // optional
  tier: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
  taxBehavior: ..., // optional
  metadata: ..., // optional
};

// Call the `createPrice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPrice(createPriceVars);
// Variables can be defined inline as well.
const { data } = await createPrice({ priceId: ..., productId: ..., amount: ..., currency: ..., type: ..., billingScheme: ..., recurringInterval: ..., recurringUsageType: ..., tier: ..., isActive: ..., isTest: ..., taxBehavior: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPrice(dataConnect, createPriceVars);

console.log(data.price_upsert);

// Or, you can use the `Promise` API.
createPrice(createPriceVars).then((response) => {
  const data = response.data;
  console.log(data.price_upsert);
});
```

### Using `CreatePrice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPriceRef, CreatePriceVariables } from '@kalex/dataconnect';

// The `CreatePrice` mutation requires an argument of type `CreatePriceVariables`:
const createPriceVars: CreatePriceVariables = {
  priceId: ..., 
  productId: ..., 
  amount: ..., 
  currency: ..., // optional
  type: ..., 
  billingScheme: ..., // optional
  recurringInterval: ..., // optional
  recurringUsageType: ..., // optional
  tier: ..., // optional
  isActive: ..., // optional
  isTest: ..., // optional
  taxBehavior: ..., // optional
  metadata: ..., // optional
};

// Call the `createPriceRef()` function to get a reference to the mutation.
const ref = createPriceRef(createPriceVars);
// Variables can be defined inline as well.
const ref = createPriceRef({ priceId: ..., productId: ..., amount: ..., currency: ..., type: ..., billingScheme: ..., recurringInterval: ..., recurringUsageType: ..., tier: ..., isActive: ..., isTest: ..., taxBehavior: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPriceRef(dataConnect, createPriceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.price_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.price_upsert);
});
```

## UpdatePrice
You can execute the `UpdatePrice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updatePrice(vars: UpdatePriceVariables): MutationPromise<UpdatePriceData, UpdatePriceVariables>;

interface UpdatePriceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePriceVariables): MutationRef<UpdatePriceData, UpdatePriceVariables>;
}
export const updatePriceRef: UpdatePriceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePrice(dc: DataConnect, vars: UpdatePriceVariables): MutationPromise<UpdatePriceData, UpdatePriceVariables>;

interface UpdatePriceRef {
  ...
  (dc: DataConnect, vars: UpdatePriceVariables): MutationRef<UpdatePriceData, UpdatePriceVariables>;
}
export const updatePriceRef: UpdatePriceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePriceRef:
```typescript
const name = updatePriceRef.operationName;
console.log(name);
```

### Variables
The `UpdatePrice` mutation requires an argument of type `UpdatePriceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePriceVariables {
  priceId: string;
  isActive?: boolean | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdatePrice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePriceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePriceData {
  price_update?: Prices_Key | null;
}
```
### Using `UpdatePrice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePrice, UpdatePriceVariables } from '@kalex/dataconnect';

// The `UpdatePrice` mutation requires an argument of type `UpdatePriceVariables`:
const updatePriceVars: UpdatePriceVariables = {
  priceId: ..., 
  isActive: ..., // optional
  metadata: ..., // optional
};

// Call the `updatePrice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePrice(updatePriceVars);
// Variables can be defined inline as well.
const { data } = await updatePrice({ priceId: ..., isActive: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePrice(dataConnect, updatePriceVars);

console.log(data.price_update);

// Or, you can use the `Promise` API.
updatePrice(updatePriceVars).then((response) => {
  const data = response.data;
  console.log(data.price_update);
});
```

### Using `UpdatePrice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePriceRef, UpdatePriceVariables } from '@kalex/dataconnect';

// The `UpdatePrice` mutation requires an argument of type `UpdatePriceVariables`:
const updatePriceVars: UpdatePriceVariables = {
  priceId: ..., 
  isActive: ..., // optional
  metadata: ..., // optional
};

// Call the `updatePriceRef()` function to get a reference to the mutation.
const ref = updatePriceRef(updatePriceVars);
// Variables can be defined inline as well.
const ref = updatePriceRef({ priceId: ..., isActive: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePriceRef(dataConnect, updatePriceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.price_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.price_update);
});
```

## DeletePrice
You can execute the `DeletePrice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deletePrice(vars: DeletePriceVariables): MutationPromise<DeletePriceData, DeletePriceVariables>;

interface DeletePriceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePriceVariables): MutationRef<DeletePriceData, DeletePriceVariables>;
}
export const deletePriceRef: DeletePriceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePrice(dc: DataConnect, vars: DeletePriceVariables): MutationPromise<DeletePriceData, DeletePriceVariables>;

interface DeletePriceRef {
  ...
  (dc: DataConnect, vars: DeletePriceVariables): MutationRef<DeletePriceData, DeletePriceVariables>;
}
export const deletePriceRef: DeletePriceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePriceRef:
```typescript
const name = deletePriceRef.operationName;
console.log(name);
```

### Variables
The `DeletePrice` mutation requires an argument of type `DeletePriceVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePriceVariables {
  priceId: string;
}
```
### Return Type
Recall that executing the `DeletePrice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePriceData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePriceData {
  price_delete?: Prices_Key | null;
}
```
### Using `DeletePrice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePrice, DeletePriceVariables } from '@kalex/dataconnect';

// The `DeletePrice` mutation requires an argument of type `DeletePriceVariables`:
const deletePriceVars: DeletePriceVariables = {
  priceId: ..., 
};

// Call the `deletePrice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePrice(deletePriceVars);
// Variables can be defined inline as well.
const { data } = await deletePrice({ priceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePrice(dataConnect, deletePriceVars);

console.log(data.price_delete);

// Or, you can use the `Promise` API.
deletePrice(deletePriceVars).then((response) => {
  const data = response.data;
  console.log(data.price_delete);
});
```

### Using `DeletePrice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePriceRef, DeletePriceVariables } from '@kalex/dataconnect';

// The `DeletePrice` mutation requires an argument of type `DeletePriceVariables`:
const deletePriceVars: DeletePriceVariables = {
  priceId: ..., 
};

// Call the `deletePriceRef()` function to get a reference to the mutation.
const ref = deletePriceRef(deletePriceVars);
// Variables can be defined inline as well.
const ref = deletePriceRef({ priceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePriceRef(dataConnect, deletePriceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.price_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.price_delete);
});
```

## CreateCheckout
You can execute the `CreateCheckout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createCheckout(vars: CreateCheckoutVariables): MutationPromise<CreateCheckoutData, CreateCheckoutVariables>;

interface CreateCheckoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCheckoutVariables): MutationRef<CreateCheckoutData, CreateCheckoutVariables>;
}
export const createCheckoutRef: CreateCheckoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCheckout(dc: DataConnect, vars: CreateCheckoutVariables): MutationPromise<CreateCheckoutData, CreateCheckoutVariables>;

interface CreateCheckoutRef {
  ...
  (dc: DataConnect, vars: CreateCheckoutVariables): MutationRef<CreateCheckoutData, CreateCheckoutVariables>;
}
export const createCheckoutRef: CreateCheckoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCheckoutRef:
```typescript
const name = createCheckoutRef.operationName;
console.log(name);
```

### Variables
The `CreateCheckout` mutation requires an argument of type `CreateCheckoutVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCheckoutVariables {
  checkoutId: string;
  buyerId: string;
  sellerId?: string | null;
  appId: string;
  status: string;
  mode: string;
  items: unknown;
  amount: number;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateCheckout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCheckoutData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCheckoutData {
  checkout_upsert: Checkouts_Key;
}
```
### Using `CreateCheckout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCheckout, CreateCheckoutVariables } from '@kalex/dataconnect';

// The `CreateCheckout` mutation requires an argument of type `CreateCheckoutVariables`:
const createCheckoutVars: CreateCheckoutVariables = {
  checkoutId: ..., 
  buyerId: ..., 
  sellerId: ..., // optional
  appId: ..., 
  status: ..., 
  mode: ..., 
  items: ..., 
  amount: ..., 
  isTest: ..., // optional
};

// Call the `createCheckout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCheckout(createCheckoutVars);
// Variables can be defined inline as well.
const { data } = await createCheckout({ checkoutId: ..., buyerId: ..., sellerId: ..., appId: ..., status: ..., mode: ..., items: ..., amount: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCheckout(dataConnect, createCheckoutVars);

console.log(data.checkout_upsert);

// Or, you can use the `Promise` API.
createCheckout(createCheckoutVars).then((response) => {
  const data = response.data;
  console.log(data.checkout_upsert);
});
```

### Using `CreateCheckout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCheckoutRef, CreateCheckoutVariables } from '@kalex/dataconnect';

// The `CreateCheckout` mutation requires an argument of type `CreateCheckoutVariables`:
const createCheckoutVars: CreateCheckoutVariables = {
  checkoutId: ..., 
  buyerId: ..., 
  sellerId: ..., // optional
  appId: ..., 
  status: ..., 
  mode: ..., 
  items: ..., 
  amount: ..., 
  isTest: ..., // optional
};

// Call the `createCheckoutRef()` function to get a reference to the mutation.
const ref = createCheckoutRef(createCheckoutVars);
// Variables can be defined inline as well.
const ref = createCheckoutRef({ checkoutId: ..., buyerId: ..., sellerId: ..., appId: ..., status: ..., mode: ..., items: ..., amount: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCheckoutRef(dataConnect, createCheckoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.checkout_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.checkout_upsert);
});
```

## UpdateCheckout
You can execute the `UpdateCheckout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateCheckout(vars: UpdateCheckoutVariables): MutationPromise<UpdateCheckoutData, UpdateCheckoutVariables>;

interface UpdateCheckoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCheckoutVariables): MutationRef<UpdateCheckoutData, UpdateCheckoutVariables>;
}
export const updateCheckoutRef: UpdateCheckoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCheckout(dc: DataConnect, vars: UpdateCheckoutVariables): MutationPromise<UpdateCheckoutData, UpdateCheckoutVariables>;

interface UpdateCheckoutRef {
  ...
  (dc: DataConnect, vars: UpdateCheckoutVariables): MutationRef<UpdateCheckoutData, UpdateCheckoutVariables>;
}
export const updateCheckoutRef: UpdateCheckoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCheckoutRef:
```typescript
const name = updateCheckoutRef.operationName;
console.log(name);
```

### Variables
The `UpdateCheckout` mutation requires an argument of type `UpdateCheckoutVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCheckoutVariables {
  checkoutId: string;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateCheckout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCheckoutData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCheckoutData {
  checkout_update?: Checkouts_Key | null;
}
```
### Using `UpdateCheckout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCheckout, UpdateCheckoutVariables } from '@kalex/dataconnect';

// The `UpdateCheckout` mutation requires an argument of type `UpdateCheckoutVariables`:
const updateCheckoutVars: UpdateCheckoutVariables = {
  checkoutId: ..., 
  status: ..., 
};

// Call the `updateCheckout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCheckout(updateCheckoutVars);
// Variables can be defined inline as well.
const { data } = await updateCheckout({ checkoutId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCheckout(dataConnect, updateCheckoutVars);

console.log(data.checkout_update);

// Or, you can use the `Promise` API.
updateCheckout(updateCheckoutVars).then((response) => {
  const data = response.data;
  console.log(data.checkout_update);
});
```

### Using `UpdateCheckout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCheckoutRef, UpdateCheckoutVariables } from '@kalex/dataconnect';

// The `UpdateCheckout` mutation requires an argument of type `UpdateCheckoutVariables`:
const updateCheckoutVars: UpdateCheckoutVariables = {
  checkoutId: ..., 
  status: ..., 
};

// Call the `updateCheckoutRef()` function to get a reference to the mutation.
const ref = updateCheckoutRef(updateCheckoutVars);
// Variables can be defined inline as well.
const ref = updateCheckoutRef({ checkoutId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCheckoutRef(dataConnect, updateCheckoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.checkout_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.checkout_update);
});
```

## DeleteCheckout
You can execute the `DeleteCheckout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteCheckout(vars: DeleteCheckoutVariables): MutationPromise<DeleteCheckoutData, DeleteCheckoutVariables>;

interface DeleteCheckoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCheckoutVariables): MutationRef<DeleteCheckoutData, DeleteCheckoutVariables>;
}
export const deleteCheckoutRef: DeleteCheckoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCheckout(dc: DataConnect, vars: DeleteCheckoutVariables): MutationPromise<DeleteCheckoutData, DeleteCheckoutVariables>;

interface DeleteCheckoutRef {
  ...
  (dc: DataConnect, vars: DeleteCheckoutVariables): MutationRef<DeleteCheckoutData, DeleteCheckoutVariables>;
}
export const deleteCheckoutRef: DeleteCheckoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCheckoutRef:
```typescript
const name = deleteCheckoutRef.operationName;
console.log(name);
```

### Variables
The `DeleteCheckout` mutation requires an argument of type `DeleteCheckoutVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCheckoutVariables {
  checkoutId: string;
}
```
### Return Type
Recall that executing the `DeleteCheckout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCheckoutData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCheckoutData {
  checkout_delete?: Checkouts_Key | null;
}
```
### Using `DeleteCheckout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCheckout, DeleteCheckoutVariables } from '@kalex/dataconnect';

// The `DeleteCheckout` mutation requires an argument of type `DeleteCheckoutVariables`:
const deleteCheckoutVars: DeleteCheckoutVariables = {
  checkoutId: ..., 
};

// Call the `deleteCheckout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCheckout(deleteCheckoutVars);
// Variables can be defined inline as well.
const { data } = await deleteCheckout({ checkoutId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCheckout(dataConnect, deleteCheckoutVars);

console.log(data.checkout_delete);

// Or, you can use the `Promise` API.
deleteCheckout(deleteCheckoutVars).then((response) => {
  const data = response.data;
  console.log(data.checkout_delete);
});
```

### Using `DeleteCheckout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCheckoutRef, DeleteCheckoutVariables } from '@kalex/dataconnect';

// The `DeleteCheckout` mutation requires an argument of type `DeleteCheckoutVariables`:
const deleteCheckoutVars: DeleteCheckoutVariables = {
  checkoutId: ..., 
};

// Call the `deleteCheckoutRef()` function to get a reference to the mutation.
const ref = deleteCheckoutRef(deleteCheckoutVars);
// Variables can be defined inline as well.
const ref = deleteCheckoutRef({ checkoutId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCheckoutRef(dataConnect, deleteCheckoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.checkout_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.checkout_delete);
});
```

## CreateProductConsume
You can execute the `CreateProductConsume` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
createProductConsume(vars: CreateProductConsumeVariables): MutationPromise<CreateProductConsumeData, CreateProductConsumeVariables>;

interface CreateProductConsumeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductConsumeVariables): MutationRef<CreateProductConsumeData, CreateProductConsumeVariables>;
}
export const createProductConsumeRef: CreateProductConsumeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProductConsume(dc: DataConnect, vars: CreateProductConsumeVariables): MutationPromise<CreateProductConsumeData, CreateProductConsumeVariables>;

interface CreateProductConsumeRef {
  ...
  (dc: DataConnect, vars: CreateProductConsumeVariables): MutationRef<CreateProductConsumeData, CreateProductConsumeVariables>;
}
export const createProductConsumeRef: CreateProductConsumeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductConsumeRef:
```typescript
const name = createProductConsumeRef.operationName;
console.log(name);
```

### Variables
The `CreateProductConsume` mutation requires an argument of type `CreateProductConsumeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductConsumeVariables {
  consumeId: string;
  orgId: string;
  productId: string;
  quantity: number;
  status?: string | null;
  metadata?: unknown | null;
  isTest?: boolean | null;
}
```
### Return Type
Recall that executing the `CreateProductConsume` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductConsumeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductConsumeData {
  productConsume_upsert: ProductConsumes_Key;
}
```
### Using `CreateProductConsume`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProductConsume, CreateProductConsumeVariables } from '@kalex/dataconnect';

// The `CreateProductConsume` mutation requires an argument of type `CreateProductConsumeVariables`:
const createProductConsumeVars: CreateProductConsumeVariables = {
  consumeId: ..., 
  orgId: ..., 
  productId: ..., 
  quantity: ..., 
  status: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createProductConsume()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProductConsume(createProductConsumeVars);
// Variables can be defined inline as well.
const { data } = await createProductConsume({ consumeId: ..., orgId: ..., productId: ..., quantity: ..., status: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProductConsume(dataConnect, createProductConsumeVars);

console.log(data.productConsume_upsert);

// Or, you can use the `Promise` API.
createProductConsume(createProductConsumeVars).then((response) => {
  const data = response.data;
  console.log(data.productConsume_upsert);
});
```

### Using `CreateProductConsume`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductConsumeRef, CreateProductConsumeVariables } from '@kalex/dataconnect';

// The `CreateProductConsume` mutation requires an argument of type `CreateProductConsumeVariables`:
const createProductConsumeVars: CreateProductConsumeVariables = {
  consumeId: ..., 
  orgId: ..., 
  productId: ..., 
  quantity: ..., 
  status: ..., // optional
  metadata: ..., // optional
  isTest: ..., // optional
};

// Call the `createProductConsumeRef()` function to get a reference to the mutation.
const ref = createProductConsumeRef(createProductConsumeVars);
// Variables can be defined inline as well.
const ref = createProductConsumeRef({ consumeId: ..., orgId: ..., productId: ..., quantity: ..., status: ..., metadata: ..., isTest: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductConsumeRef(dataConnect, createProductConsumeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productConsume_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productConsume_upsert);
});
```

## UpdateProductConsume
You can execute the `UpdateProductConsume` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
updateProductConsume(vars: UpdateProductConsumeVariables): MutationPromise<UpdateProductConsumeData, UpdateProductConsumeVariables>;

interface UpdateProductConsumeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductConsumeVariables): MutationRef<UpdateProductConsumeData, UpdateProductConsumeVariables>;
}
export const updateProductConsumeRef: UpdateProductConsumeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductConsume(dc: DataConnect, vars: UpdateProductConsumeVariables): MutationPromise<UpdateProductConsumeData, UpdateProductConsumeVariables>;

interface UpdateProductConsumeRef {
  ...
  (dc: DataConnect, vars: UpdateProductConsumeVariables): MutationRef<UpdateProductConsumeData, UpdateProductConsumeVariables>;
}
export const updateProductConsumeRef: UpdateProductConsumeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductConsumeRef:
```typescript
const name = updateProductConsumeRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductConsume` mutation requires an argument of type `UpdateProductConsumeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductConsumeVariables {
  consumeId: string;
  quantity?: number | null;
  status?: string | null;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `UpdateProductConsume` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductConsumeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductConsumeData {
  productConsume_update?: ProductConsumes_Key | null;
}
```
### Using `UpdateProductConsume`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductConsume, UpdateProductConsumeVariables } from '@kalex/dataconnect';

// The `UpdateProductConsume` mutation requires an argument of type `UpdateProductConsumeVariables`:
const updateProductConsumeVars: UpdateProductConsumeVariables = {
  consumeId: ..., 
  quantity: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateProductConsume()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductConsume(updateProductConsumeVars);
// Variables can be defined inline as well.
const { data } = await updateProductConsume({ consumeId: ..., quantity: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductConsume(dataConnect, updateProductConsumeVars);

console.log(data.productConsume_update);

// Or, you can use the `Promise` API.
updateProductConsume(updateProductConsumeVars).then((response) => {
  const data = response.data;
  console.log(data.productConsume_update);
});
```

### Using `UpdateProductConsume`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductConsumeRef, UpdateProductConsumeVariables } from '@kalex/dataconnect';

// The `UpdateProductConsume` mutation requires an argument of type `UpdateProductConsumeVariables`:
const updateProductConsumeVars: UpdateProductConsumeVariables = {
  consumeId: ..., 
  quantity: ..., // optional
  status: ..., // optional
  metadata: ..., // optional
};

// Call the `updateProductConsumeRef()` function to get a reference to the mutation.
const ref = updateProductConsumeRef(updateProductConsumeVars);
// Variables can be defined inline as well.
const ref = updateProductConsumeRef({ consumeId: ..., quantity: ..., status: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductConsumeRef(dataConnect, updateProductConsumeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productConsume_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productConsume_update);
});
```

## DeleteProductConsume
You can execute the `DeleteProductConsume` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-client/index.d.ts](./index.d.ts):
```typescript
deleteProductConsume(vars: DeleteProductConsumeVariables): MutationPromise<DeleteProductConsumeData, DeleteProductConsumeVariables>;

interface DeleteProductConsumeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductConsumeVariables): MutationRef<DeleteProductConsumeData, DeleteProductConsumeVariables>;
}
export const deleteProductConsumeRef: DeleteProductConsumeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProductConsume(dc: DataConnect, vars: DeleteProductConsumeVariables): MutationPromise<DeleteProductConsumeData, DeleteProductConsumeVariables>;

interface DeleteProductConsumeRef {
  ...
  (dc: DataConnect, vars: DeleteProductConsumeVariables): MutationRef<DeleteProductConsumeData, DeleteProductConsumeVariables>;
}
export const deleteProductConsumeRef: DeleteProductConsumeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductConsumeRef:
```typescript
const name = deleteProductConsumeRef.operationName;
console.log(name);
```

### Variables
The `DeleteProductConsume` mutation requires an argument of type `DeleteProductConsumeVariables`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductConsumeVariables {
  consumeId: string;
}
```
### Return Type
Recall that executing the `DeleteProductConsume` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductConsumeData`, which is defined in [dataconnect-client/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductConsumeData {
  productConsume_delete?: ProductConsumes_Key | null;
}
```
### Using `DeleteProductConsume`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProductConsume, DeleteProductConsumeVariables } from '@kalex/dataconnect';

// The `DeleteProductConsume` mutation requires an argument of type `DeleteProductConsumeVariables`:
const deleteProductConsumeVars: DeleteProductConsumeVariables = {
  consumeId: ..., 
};

// Call the `deleteProductConsume()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProductConsume(deleteProductConsumeVars);
// Variables can be defined inline as well.
const { data } = await deleteProductConsume({ consumeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProductConsume(dataConnect, deleteProductConsumeVars);

console.log(data.productConsume_delete);

// Or, you can use the `Promise` API.
deleteProductConsume(deleteProductConsumeVars).then((response) => {
  const data = response.data;
  console.log(data.productConsume_delete);
});
```

### Using `DeleteProductConsume`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductConsumeRef, DeleteProductConsumeVariables } from '@kalex/dataconnect';

// The `DeleteProductConsume` mutation requires an argument of type `DeleteProductConsumeVariables`:
const deleteProductConsumeVars: DeleteProductConsumeVariables = {
  consumeId: ..., 
};

// Call the `deleteProductConsumeRef()` function to get a reference to the mutation.
const ref = deleteProductConsumeRef(deleteProductConsumeVars);
// Variables can be defined inline as well.
const ref = deleteProductConsumeRef({ consumeId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductConsumeRef(dataConnect, deleteProductConsumeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productConsume_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productConsume_delete);
});
```

