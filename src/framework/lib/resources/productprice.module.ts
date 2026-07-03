// framework/src/lib/resources/productprice.module.ts
// Modulo "Listini Prezzo": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const productpriceModule = {
  name: "Listini Prezzo",
  icon: "Tag",
  tableConfig: {
    key: "priceId",
    name: "prices",
    singular: "price",
    plural: "prices"
  },
  fields: {
    priceId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.priceId.label",
      placeholder: "fields.priceId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    productId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 2,
      label: "fields.productId.label",
      placeholder: "fields.productId.placeholder",
      validation: { required: true },
      graphql: { nullable: false }
    },
    amount: {
      type: "Float",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.amount.label",
      placeholder: "fields.amount.placeholder",
      validation: { required: true, min: 0 },
      graphql: { nullable: false }
    },
    currency: {
      type: "String",
      encrypted: false,
      render: false,
      order: 4,
      label: "fields.currency.label",
      placeholder: "fields.currency.placeholder",
      validation: { default: "EUR" },
      graphql: { nullable: false, directive: '@default(value: "EUR")' }
    },
    type: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.type.label",
      placeholder: "fields.type.placeholder",
      validation: { required: true, enum: ["one_time", "recurring"] },
      graphql: { nullable: false }
    },
    billingScheme: {
      type: "String",
      encrypted: false,
      render: false,
      order: 6,
      label: "fields.billingScheme.label",
      placeholder: "fields.billingScheme.placeholder",
      validation: { default: "per_unit" },
      graphql: { nullable: true, directive: '@default(value: "per_unit")' }
    },
    recurringInterval: {
      type: "String",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.recurringInterval.label",
      placeholder: "fields.recurringInterval.placeholder",
      graphql: { nullable: true }
    },
    recurringUsageType: {
      type: "String",
      encrypted: false,
      render: false,
      order: 8,
      label: "fields.recurringUsageType.label",
      placeholder: "fields.recurringUsageType.placeholder",
      graphql: { nullable: true }
    },
    tier: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.tier.label",
      placeholder: "fields.tier.placeholder",
      validation: { enum: ["personal", "business", "government", "education"] },
      graphql: { nullable: true }
    },
    isActive: {
      type: "Boolean",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.isActive.label",
      placeholder: "fields.isActive.placeholder",
      validation: { default: true },
      graphql: { nullable: false, directive: '@default(value: true)' }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 11,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    taxBehavior: {
      type: "String",
      encrypted: false,
      render: true,
      order: 12,
      label: "fields.taxBehavior.label",
      placeholder: "fields.taxBehavior.placeholder",
      validation: { default: "exclusive" },
      graphql: { nullable: true, directive: '@default(value: "exclusive")' }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "metadata", "createdAt"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "metadata", "createdAt"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "createdAt"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "createdAt"] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;
