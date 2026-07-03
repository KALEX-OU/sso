// framework/src/lib/resources/thing.module.ts
// Modulo "Dispositivi Connessi (IoT)": campi, policy di ruolo e di contesto (estratto 1:1 dalla SSOT resources.config.ts).

export const thingModule = {
  name: "Dispositivi Connessi (IoT)",
  icon: "Radio",
  tableConfig: {
    key: "thingId",
    name: "things",
    singular: "thing",
    plural: "things"
  },
  formFields: ["name", "type", "metadata"],
  listFields: ["name", "type", "status", "createdAt"],
  fields: {
    thingId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.thingId.label",
      placeholder: "fields.thingId.placeholder",
      validation: { required: true },
      graphql: { nullable: false, directive: '@default(expr: "uuidV4()")' }
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
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      graphql: { nullable: false }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    type: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.type.label",
      placeholder: "fields.type.placeholder",
      validation: { required: true },
      options: ["sensor", "camera", "gateway", "controller"],
      graphql: { nullable: false }
    },
    status: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.status.label",
      placeholder: "fields.status.placeholder",
      graphql: { nullable: false, directive: '@default(value: "active")' }
    },
    deviceTokenHash: {
      type: "String",
      encrypted: true,
      render: false,
      order: 7,
      label: "fields.deviceTokenHash.label",
      placeholder: "fields.deviceTokenHash.placeholder",
      graphql: { nullable: false, directive: "@unique" }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 10,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["thingId", "orgId", "appId", "name", "type", "status", "metadata", "isTest", "createdAt"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["thingId", "orgId", "appId", "name", "type", "status", "metadata", "isTest", "createdAt"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status"] },
    device: { canCreate: false, canRead: true, canList: false, canUpdate: true, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"] }
  },
  contextPolicies: {
    buyer: {
      owner: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "name", "type", "status", "metadata"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "name", "type", "status", "metadata"] },
      member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "name", "type", "status"] },
      viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "name", "type", "status"] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    },
    seller: {
      owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata", "isTest", "createdAt"] },
      admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata", "isTest", "createdAt"] },
      member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"] },
      viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status"] },
      device: { canCreate: false, canRead: true, canList: false, canUpdate: true, canDelete: false, allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"] }
    }
  }
} as const;
