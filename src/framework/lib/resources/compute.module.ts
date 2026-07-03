// framework/src/lib/resources/compute.module.ts
// Modulo "Compute & Serverless IoT": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const computeModule = {
  name: "Compute & Serverless IoT",
  icon: "Cpu",
  tableConfig: {
    key: "computeId",
    name: "computes",
    singular: "compute",
    plural: "computes"
  },
  fields: {
    computeId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.computeId.label",
      placeholder: "fields.computeId.placeholder",
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
    resourceType: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.resourceType.label",
      placeholder: "fields.resourceType.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    usage: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.usage.label",
      placeholder: "fields.usage.placeholder",
      validation: { required: true },
      graphql: { nullable: false, directive: '@default(value: 0.0)' }
    },
    status: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.status.label",
      placeholder: "fields.status.placeholder",
      validation: { default: "active" },
      graphql: { nullable: false, directive: '@default(value: "active")' }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 6,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 7,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 8,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["computeId", "orgId", "resourceType", "usage", "status", "isTest", "metadata", "createdAt"] },
    admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;
