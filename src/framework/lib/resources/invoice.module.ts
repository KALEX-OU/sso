// framework/src/lib/resources/invoice.module.ts
// Modulo "Fatture ed Acquisti": campi, policy di ruolo e di contesto (estratto 1:1 dalla SSOT resources.config.ts).

export const invoiceModule = {
  name: "Fatture ed Acquisti",
  icon: "FileText",
  tableConfig: {
    key: "invoiceId",
    name: "invoices",
    singular: "invoice",
    plural: "invoices"
  },
  fields: {
    invoiceId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.invoiceId.label",
      placeholder: "fields.invoiceId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    invoiceNumber: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.invoiceNumber.label",
      placeholder: "fields.invoiceNumber.placeholder",
      graphql: { nullable: true }
    },
    buyerId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.buyerId.label",
      placeholder: "fields.buyerId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    sellerId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 4,
      label: "fields.sellerId.label",
      placeholder: "fields.sellerId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    amount: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.amount.label",
      placeholder: "fields.amount.placeholder",
      validation: { required: true, min: 0 },
      graphql: { nullable: false }
    },
    currency: {
      type: "String",
      encrypted: false,
      render: false,
      order: 7,
      label: "fields.currency.label",
      placeholder: "fields.currency.placeholder",
      validation: { required: true, default: "EUR" },
      graphql: { nullable: false, directive: '@default(value: "EUR")' }
    },
    status: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.status.label",
      placeholder: "fields.status.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    pdfUrl: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.pdfUrl.label",
      placeholder: "fields.pdfUrl.placeholder",
      graphql: { nullable: true }
    },
    taxPercent: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.taxPercent.label",
      placeholder: "fields.taxPercent.placeholder",
      validation: { default: 0 },
      graphql: { nullable: true }
    },
    taxAmount: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 11,
      label: "fields.taxAmount.label",
      placeholder: "fields.taxAmount.placeholder",
      validation: { default: 0 },
      graphql: { nullable: true }
    },
    subtotal: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 12,
      label: "fields.subtotal.label",
      placeholder: "fields.subtotal.placeholder",
      graphql: { nullable: true }
    },
    subscriptionId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.subscriptionId.label",
      placeholder: "fields.subscriptionId.placeholder",
      graphql: { nullable: true }
    },
    checkoutId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.checkoutId.label",
      placeholder: "fields.checkoutId.placeholder",
      graphql: { nullable: true }
    },
    lineItems: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 15,
      label: "fields.lineItems.label",
      placeholder: "fields.lineItems.placeholder",
      graphql: { nullable: true }
    },
    dueDate: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 16,
      label: "fields.dueDate.label",
      placeholder: "fields.dueDate.placeholder",
      graphql: { nullable: true }
    },
    paidAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 17,
      label: "fields.paidAt.label",
      placeholder: "fields.paidAt.placeholder",
      graphql: { nullable: true }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 18,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 19,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 20,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
    admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  },
  contextPolicies: {
    buyer: {
      owner: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
      admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    },
    seller: {
      owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
      admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"] },
      member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
      device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
    }
  }
} as const;
