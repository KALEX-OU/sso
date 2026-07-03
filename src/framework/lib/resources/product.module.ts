// framework/src/lib/resources/product.module.ts
// Modulo "Catalogo Prodotti e Servizi": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

import { STRIPE_TAX_CODE_KEYS } from "./shared";

export const productModule = {
  name: "Catalogo Prodotti e Servizi",
  icon: "Package",
  tableConfig: {
    key: "productId",
    name: "products",
    singular: "product",
    plural: "products"
  },
  fields: {
    productId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.productId.label",
      placeholder: "fields.productId.placeholder",
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
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true, default: "sso" },
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
    description: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      label: "fields.description.label",
      placeholder: "fields.description.placeholder",
      graphql: { nullable: true }
    },
    mode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.mode.label",
      placeholder: "fields.mode.placeholder",
      validation: { required: true, enum: ["service", "product"] },
      graphql: { nullable: false }
    },
    type: {
      type: "String",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.type.label",
      placeholder: "fields.type.placeholder",
      validation: { required: true, enum: STRIPE_TAX_CODE_KEYS },
      graphql: { nullable: false }
    },
    route: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.route.label",
      placeholder: "fields.route.placeholder",
      validation: { required: true, enum: ["subscription", "payment", "consume"] },
      graphql: { nullable: true }
    },
    sku: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.sku.label",
      placeholder: "fields.sku.placeholder",
      graphql: { nullable: true, directive: "@unique" }
    },
    isActive: {
      type: "Boolean",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.isActive.label",
      placeholder: "fields.isActive.placeholder",
      validation: { default: true },
      graphql: { nullable: false, directive: "@default(value: true)" }
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
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 12,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    variants: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 13,
      label: "fields.variants.label",
      placeholder: "fields.variants.placeholder",
      graphql: { nullable: true }
    },
    bom: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.bom.label",
      placeholder: "fields.bom.placeholder",
      graphql: { nullable: true }
    },
    relatedProducts: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 15,
      label: "fields.relatedProducts.label",
      placeholder: "fields.relatedProducts.placeholder",
      graphql: { nullable: true }
    },
    options: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 16,
      label: "fields.options.label",
      placeholder: "fields.options.placeholder",
      graphql: { nullable: true }
    },
    taxBehavior: {
      type: "String",
      encrypted: false,
      render: true,
      order: 17,
      label: "fields.taxBehavior.label",
      placeholder: "fields.taxBehavior.placeholder",
      validation: { required: true, enum: ["exclusive", "inclusive", "unspecified"], default: "exclusive" },
      graphql: { nullable: true, directive: '@default(value: "exclusive")' }
    },
    aiSummary: {
      type: "String",
      encrypted: false,
      render: false,
      order: 18,
      label: "fields.aiSummary.label",
      placeholder: "fields.aiSummary.placeholder",
      graphql: { nullable: true }
    },
    descriptionEmbedding: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 19,
      label: "fields.descriptionEmbedding.label",
      placeholder: "fields.descriptionEmbedding.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 20,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    },
    prices: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 21,
      label: "fields.prices.label",
      placeholder: "fields.prices.placeholder",
      graphql: { dbIgnore: true, nullable: true }
    },
    batches: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 22,
      label: "fields.batches.label",
      placeholder: "fields.batches.placeholder",
      graphql: { dbIgnore: true, nullable: true }
    },
    consumes: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 23,
      label: "fields.consumes.label",
      placeholder: "fields.consumes.placeholder",
      graphql: { dbIgnore: true, nullable: true }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "metadata", "variants", "bom", "relatedProducts", "options", "taxBehavior", "aiSummary", "descriptionEmbedding", "createdAt", "prices", "batches", "consumes"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "metadata", "variants", "bom", "relatedProducts", "options", "taxBehavior", "aiSummary", "descriptionEmbedding", "createdAt", "prices", "batches", "consumes"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "variants", "options", "taxBehavior", "createdAt", "prices", "batches", "consumes"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "createdAt", "prices", "batches", "consumes"] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;
