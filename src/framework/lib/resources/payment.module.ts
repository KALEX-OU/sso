// framework/src/lib/resources/payment.module.ts
// Modulo "Transazioni e Pagamenti": campi, policy di ruolo e di contesto (estratto 1:1 dalla SSOT resources.config.ts).

export const paymentModule = {
  name: "Transazioni e Pagamenti",
  icon: "DollarSign",
  tableConfig: {
    key: "paymentId",
    name: "payments",
    singular: "payment",
    plural: "payments"
  },
  fields: {
    paymentId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.paymentId.label",
      placeholder: "fields.paymentId.placeholder",
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
      graphql: { dbName: "buyerId", nullable: false }
    },
    sellerOrgId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.sellerOrgId.label",
      placeholder: "fields.sellerOrgId.placeholder",
      graphql: { dbName: "sellerId", nullable: true }
    },
    invoiceId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 4,
      label: "fields.invoiceId.label",
      placeholder: "fields.invoiceId.placeholder",
      graphql: { nullable: true }
    },
    amount: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.amount.label",
      placeholder: "fields.amount.placeholder",
      validation: { required: true, min: 0 },
      graphql: { nullable: false }
    },
    status: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.status.label",
      placeholder: "fields.status.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    currency: {
      type: "String",
      encrypted: false,
      render: false,
      order: 7,
      label: "fields.currency.label",
      placeholder: "fields.currency.placeholder",
      validation: { default: "EUR" },
      graphql: { nullable: false, directive: '@default(value: "EUR")' }
    },
    paymentMethodType: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.paymentMethodType.label",
      placeholder: "fields.paymentMethodType.placeholder",
      graphql: { nullable: true }
    },
    cardBrand: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.cardBrand.label",
      placeholder: "fields.cardBrand.placeholder",
      graphql: { nullable: true }
    },
    cardLast4: {
      type: "String",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.cardLast4.label",
      placeholder: "fields.cardLast4.placeholder",
      graphql: { nullable: true }
    },
    receiptUrl: {
      type: "String",
      encrypted: false,
      render: true,
      order: 11,
      label: "fields.receiptUrl.label",
      placeholder: "fields.receiptUrl.placeholder",
      graphql: { nullable: true }
    },
    stripeConnectAccountId: {
      type: "String",
      encrypted: true,
      render: false,
      order: 12,
      label: "fields.stripeConnectAccountId.label",
      placeholder: "fields.stripeConnectAccountId.placeholder",
      graphql: { nullable: true }
    },
    applicationFeeAmount: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.applicationFeeAmount.label",
      placeholder: "fields.applicationFeeAmount.placeholder",
      graphql: { nullable: true }
    },
    errorMessage: {
      type: "String",
      encrypted: false,
      render: true,
      order: 14,
      label: "fields.errorMessage.label",
      placeholder: "fields.errorMessage.placeholder",
      graphql: { nullable: true }
    },
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 15,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 16,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 17,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"] },
    admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  },
  contextPolicies: {
    buyer: {
      owner: { canCreate: true, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "appId", "createdAt"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "appId", "createdAt"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    },
    seller: {
      owner: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    }
  }
} as const;
