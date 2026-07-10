// framework/src/lib/resources/organization.module.ts
// Modulo "Organizzazioni": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const organizationModule = {
  name: "Organizzazioni",
  icon: "Building",
  tableConfig: {
    key: "orgId",
    name: "organizations",
    singular: "organization",
    plural: "organizations"
  },
  formFields: ["name", "type", "country", "vatNumber", "fiscalCode", "address", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode"],
  listFields: ["name", "type", "country", "createdAt"],
  fields: {
    orgId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.orgId.label",
      placeholder: "fields.orgId.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "uuidV4()")' }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    // Slug del sottodominio white-label: <subdomain>.kalexs.com (§3-bis). @unique globale.
    // Il pattern del slug (lowercase, alfanumerico+trattini) è validato lato rotta (il registry
    // non supporta regex generiche). Nullable → più org possono non averlo (unique ammette NULL multipli).
    subdomain: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2.5,
      label: "fields.subdomain.label",
      placeholder: "fields.subdomain.placeholder",
      validation: { min: 3, max: 63 },
      graphql: { nullable: true, directive: "@unique" }
    },
    type: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.type.label",
      placeholder: "fields.type.placeholder",
      validation: { required: true, enum: ["personal", "business", "government", "education"] },
      options: ["personal", "business", "government", "education"],
      graphql: { nullable: false, directive: '@default(value: "personal")' }
    },
    country: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.country.label",
      placeholder: "fields.country.placeholder",
      validation: { required: true, min: 2, max: 2, default: "IT" },
      graphql: { nullable: false, directive: '@default(value: "IT")' }
    },
    viesValidated: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.viesValidated.label",
      placeholder: "fields.viesValidated.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    vatNumber: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.vatNumber.label",
      placeholder: "fields.vatNumber.placeholder",
      validation: { format: "vat" },
      graphql: { nullable: true }
    },
    // Hash deterministico (HMAC) della P.IVA per il controllo di UNICITÀ (P2-110): la colonna
    // `vatNumber` è cifrata a IV random → non confrontabile. Campo INTERNO: non renderizzato,
    // non in `allowedFields` (non esposto via FLS ai client).
    vatNumberHash: {
      type: "String",
      encrypted: false,
      render: false,
      order: 99,
      label: "fields.vatNumberHash.label",
      placeholder: "fields.vatNumberHash.placeholder",
      graphql: { nullable: true }
    },
    fiscalCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.fiscalCode.label",
      placeholder: "fields.fiscalCode.placeholder",
      validation: { format: "personal_id" },
      graphql: { nullable: true }
    },
    billingAddress: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.billingAddress.label",
      placeholder: "fields.billingAddress.placeholder",
      graphql: { nullable: true }
    },
    sdiCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.sdiCode.label",
      placeholder: "fields.sdiCode.placeholder",
      validation: { format: "sdi" },
      graphql: { nullable: true }
    },
    officeCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.officeCode.label",
      placeholder: "fields.officeCode.placeholder",
      validation: { min: 6, max: 6 },
      graphql: { nullable: true }
    },
    cigCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 11,
      label: "fields.cigCode.label",
      placeholder: "fields.cigCode.placeholder",
      graphql: { nullable: true }
    },
    cupCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 12,
      label: "fields.cupCode.label",
      placeholder: "fields.cupCode.placeholder",
      graphql: { nullable: true }
    },
    address: {
      type: "String",
      encrypted: false,
      render: true,
      order: 13,
      label: "fields.address.label",
      placeholder: "fields.address.placeholder",
      graphql: { nullable: true }
    },
    latitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.latitude.label",
      placeholder: "fields.latitude.placeholder",
      graphql: { nullable: true }
    },
    longitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 15,
      label: "fields.longitude.label",
      placeholder: "fields.longitude.placeholder",
      graphql: { nullable: true }
    },
    altitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 16,
      label: "fields.altitude.label",
      placeholder: "fields.altitude.placeholder",
      graphql: { nullable: true }
    },
    stripeCustomerId: {
      type: "String",
      encrypted: true,
      render: false,
      order: 17,
      label: "fields.stripeCustomerId.label",
      placeholder: "fields.stripeCustomerId.placeholder",
      graphql: { nullable: true, directive: "@unique" }
    },
    stripeConnectAccountId: {
      type: "String",
      encrypted: true,
      render: false,
      order: 18,
      label: "fields.stripeConnectAccountId.label",
      placeholder: "fields.stripeConnectAccountId.placeholder",
      graphql: { nullable: true, directive: "@unique" }
    },
    stripeConnectOnboarded: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 19,
      label: "fields.stripeConnectOnboarded.label",
      placeholder: "fields.stripeConnectOnboarded.placeholder",
      validation: { default: false },
      graphql: { nullable: true, directive: "@default(value: false)" }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 20,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    // Policy MFA (174): se true, TUTTI i membri dell'org devono avere il TOTP obbligatorio.
    // Configurabile da owner/admin; propagata nei claims (mfaReq) → enforcement api + gate frontend.
    mfaRequired: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 20.5,
      label: "fields.mfaRequired.label",
      placeholder: "fields.mfaRequired.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    confirmed: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 21,
      label: "fields.confirmed.label",
      placeholder: "fields.confirmed.placeholder",
      // Default FAIL-CLOSED coerente su validazione E colonna DB (T3.3): le org
      // government/education richiedono approvazione; l'onboarding passa comunque
      // sempre il valore esplicito, il default vale solo per insert fuori pipeline.
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    addressDetails: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 22,
      label: "fields.addressDetails.label",
      placeholder: "fields.addressDetails.placeholder",
      graphql: { nullable: true }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 23,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 24,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    },
    apps: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 25,
      label: "fields.apps.label",
      placeholder: "fields.apps.placeholder",
      graphql: { nullable: true }
    }
  },
  rolePolicies: {
    owner: {
      canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true,
      allowedFields: ["orgId", "name", "subdomain", "type", "country", "viesValidated", "vatNumber", "fiscalCode", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode", "address", "latitude", "longitude", "altitude", "stripeCustomerId", "stripeConnectAccountId", "stripeConnectOnboarded", "isTest", "mfaRequired", "confirmed", "addressDetails", "metadata", "createdAt", "apps"]
    },
    admin: {
      canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true,
      allowedFields: ["orgId", "name", "subdomain", "type", "country", "viesValidated", "vatNumber", "fiscalCode", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode", "address", "latitude", "longitude", "altitude", "stripeCustomerId", "stripeConnectAccountId", "stripeConnectOnboarded", "isTest", "mfaRequired", "confirmed", "addressDetails", "metadata", "createdAt", "apps"]
    },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "subdomain", "type", "country", "address", "mfaRequired"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "subdomain", "type", "country", "mfaRequired"] },
    device: { canCreate: false, canRead: true, canList: false, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "type", "country"] }
  }
} as const;
