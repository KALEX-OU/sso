// framework/src/lib/resources/checkout.module.ts
// Modulo "Carrello e Checkout": campi, policy di ruolo e di contesto (estratto 1:1 dalla SSOT resources.config.ts).

export const checkoutModule = {
  name: "Carrello e Checkout",
  icon: "ShoppingCart",
  tableConfig: {
    key: "checkoutId",
    name: "checkouts",
    singular: "checkout",
    plural: "checkouts"
  },
  fields: {
    checkoutId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.checkoutId.label",
      placeholder: "fields.checkoutId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    buyerId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 2,
      label: "fields.buyerId.label",
      placeholder: "fields.buyerId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    sellerId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.sellerId.label",
      placeholder: "fields.sellerId.placeholder",
      graphql: { nullable: true }
    },
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 4,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    status: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.status.label",
      placeholder: "fields.status.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    mode: {
      type: "String",
      encrypted: false,
      render: false,
      order: 6,
      label: "fields.mode.label",
      placeholder: "fields.mode.placeholder",
      validation: { required: true, enum: ["subscription", "payment"] },
      graphql: { nullable: false }
    },
    items: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 7,
      label: "fields.items.label",
      placeholder: "fields.items.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    amount: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.amount.label",
      placeholder: "fields.amount.placeholder",
      validation: { required: true, min: 0 },
      graphql: { nullable: false }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
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
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
    admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  },
  contextPolicies: {
    buyer: {
      owner: { canCreate: true, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    },
    seller: {
      owner: { canCreate: false, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    }
  }
} as const;
