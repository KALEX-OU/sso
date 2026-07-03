// framework/src/lib/resources/subscription.module.ts
// Modulo "Piani e Abbonamenti": campi, policy di ruolo e di contesto (estratto 1:1 dalla SSOT resources.config.ts).

export const subscriptionModule = {
  name: "Piani e Abbonamenti",
  icon: "CreditCard",
  tableConfig: {
    key: "subscriptionId",
    name: "subscriptions",
    singular: "subscription",
    plural: "subscriptions"
  },
  fields: {
    subscriptionId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.subscriptionId.label",
      placeholder: "fields.subscriptionId.placeholder",
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
    items: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 6,
      label: "fields.items.label",
      placeholder: "fields.items.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    cancelAtPeriodEnd: {
      type: "Boolean",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.cancelAtPeriodEnd.label",
      placeholder: "fields.cancelAtPeriodEnd.placeholder",
      graphql: { nullable: true }
    },
    currentPeriodStart: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 8,
      label: "fields.currentPeriodStart.label",
      placeholder: "fields.currentPeriodStart.placeholder",
      graphql: { nullable: true }
    },
    currentPeriodEnd: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.currentPeriodEnd.label",
      placeholder: "fields.currentPeriodEnd.placeholder",
      graphql: { nullable: true }
    },
    trialStart: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 10,
      label: "fields.trialStart.label",
      placeholder: "fields.trialStart.placeholder",
      graphql: { nullable: true }
    },
    trialEnd: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 11,
      label: "fields.trialEnd.label",
      placeholder: "fields.trialEnd.placeholder",
      graphql: { nullable: true }
    },
    expiresAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 12,
      label: "fields.expiresAt.label",
      placeholder: "fields.expiresAt.placeholder",
      graphql: { nullable: true }
    },
    updatedAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.updatedAt.label",
      placeholder: "fields.updatedAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
    admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  },
  contextPolicies: {
    buyer: {
      owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    },
    seller: {
      owner: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    }
  }
} as const;
