// framework/src/lib/resources/apikey.module.ts
// Modulo "Chiavi API": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const apikeyModule = {
  name: "Chiavi API",
  icon: "Key",
  tableConfig: {
    key: "keyHash",
    name: "api_keys",
    singular: "apiKey",
    plural: "apiKeys"
  },
  fields: {
    keyHash: {
      // Digest HMAC/SHA-256 della chiave (T3.3): NON va ri-cifrato (doppia cifratura inutile,
      // lookup per digest impossibile). Resta negli allowedFields perché è la PK usata dalla
      // UI per gestire/revocare la chiave — il digest non è la credenziale.
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.keyHash.label",
      placeholder: "fields.keyHash.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    orgId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 2,
      label: "fields.orgId.label",
      placeholder: "fields.orgId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    description: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.description.label",
      placeholder: "fields.description.placeholder",
      graphql: { nullable: true }
    },
    ipWhitelist: {
      type: "Any",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.ipWhitelist.label",
      placeholder: "fields.ipWhitelist.placeholder",
      graphql: { nullable: false }
    },
    isActive: {
      type: "Boolean",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.isActive.label",
      placeholder: "fields.isActive.placeholder",
      graphql: { nullable: false, directive: "@default(value: true)" }
    },
    expiresAt: {
      type: "Timestamp",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.expiresAt.label",
      placeholder: "fields.expiresAt.placeholder",
      graphql: { nullable: true }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 8,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    permissions: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 10,
      label: "fields.permissions.label",
      placeholder: "fields.permissions.placeholder",
      graphql: { dbIgnore: true, nullable: true }
    },
    userId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 11,
      label: "fields.userId.label",
      placeholder: "fields.userId.placeholder",
      graphql: { nullable: true }
    },
    thingId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 12,
      label: "fields.thingId.label",
      placeholder: "fields.thingId.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["keyHash", "orgId", "name", "description", "ipWhitelist", "isActive", "expiresAt", "isTest", "appId", "permissions", "userId", "thingId", "createdAt"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["keyHash", "orgId", "name", "description", "ipWhitelist", "isActive", "expiresAt", "isTest", "appId", "permissions", "userId", "thingId", "createdAt"] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;
