// framework/src/lib/resources/product-consume.module.ts
// Modulo "Consumo e Log Metriche": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const productConsumeModule = {
  name: "Consumo e Log Metriche",
  icon: "Activity",
  tableConfig: {
    key: "consumeId",
    name: "product_consumes",
    singular: "productConsume",
    plural: "productConsumes"
  },
  fields: {
    consumeId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.consumeId.label",
      placeholder: "fields.consumeId.placeholder",
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
      graphql: { dbName: "orgId", nullable: false }
    },
    productId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.productId.label",
      placeholder: "fields.productId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    quantity: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.quantity.label",
      placeholder: "fields.quantity.placeholder",
      validation: { required: true, min: 0 },
      graphql: { dbType: "Int", nullable: false }
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
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["consumeId", "orgId", "productId", "quantity", "status", "isTest", "metadata", "createdAt"] },
    admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;
