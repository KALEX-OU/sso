// framework/src/lib/resources.config.ts

import type * as LucideIcons from "lucide-react";
export type LucideIconName = keyof typeof LucideIcons;

const STRIPE_TAX_CODE_KEYS = [
  "txcd_10103000",
  "txcd_10102000",
  "txcd_10101000",
  "txcd_10104000",
  "txcd_20030000",
  "txcd_10503000",
  "txcd_00000000",
  "txcd_99999999"
] as const;

// ==========================================
// DEFINIZIONE SINGOLI MODULI (UNIFICATI)
// ==========================================

const dashboardModule = {
  name: "Dashboard Console",
  icon: "LayoutDashboard",
  fields: {
    orgName: {
      type: "String",
      encrypted: false,
      render: true,
      order: 1,
      label: "fields.orgName.label",
      placeholder: "fields.orgName.placeholder"
    },
    orgType: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.orgType.label",
      placeholder: "fields.orgType.placeholder"
    },
    onboardingStatus: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.onboardingStatus.label",
      placeholder: "fields.onboardingStatus.placeholder"
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["orgName", "orgType", "onboardingStatus"] },
    admin: { canCreate: false, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["orgName", "orgType", "onboardingStatus"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgName", "orgType"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgName", "orgType"] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;

const userModule = {
  name: "Gestione Utenti",
  icon: "Users",
  tableConfig: {
    key: "userId",
    name: "users",
    singular: "user",
    plural: "users"
  },
  fields: {
    userId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.userId.label",
      placeholder: "fields.userId.placeholder",
      graphql: { nullable: false }
    },
    email: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.email.label",
      placeholder: "fields.email.placeholder",
      validation: { required: true, email: true },
      graphql: { nullable: false, directive: "@unique" }
    },
    fullName: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.fullName.label",
      placeholder: "fields.fullName.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: true }
    },
    role: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.role.label",
      placeholder: "fields.role.placeholder",
      validation: { required: true },
      options: ["owner", "admin", "member", "viewer", "device"],
      graphql: { dbIgnore: true }
    },
    avatarUrl: {
      type: "String",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.avatarUrl.label",
      placeholder: "fields.avatarUrl.placeholder",
      graphql: { nullable: true }
    },
    mobile: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.mobile.label",
      placeholder: "fields.mobile.placeholder",
      graphql: { nullable: true }
    },
    locale: {
      type: "String",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.locale.label",
      placeholder: "fields.locale.placeholder",
      options: ["it", "en", "es"],
      graphql: { nullable: false, directive: '@default(value: "en")' }
    },
    theme: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.theme.label",
      placeholder: "fields.theme.placeholder",
      options: ["light", "dark"],
      graphql: { nullable: false, directive: '@default(value: "dark")' }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
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
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["userId", "email", "fullName", "role", "avatarUrl", "mobile", "locale", "theme", "metadata", "createdAt"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["userId", "email", "fullName", "role", "avatarUrl", "mobile", "locale", "theme", "metadata", "createdAt"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["userId", "fullName", "email", "avatarUrl", "mobile"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["userId", "fullName", "email", "avatarUrl", "mobile"] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;

const teamModule = {
  name: "Gestione Team",
  icon: "UserCog",
  tableConfig: {
    key: "teamId",
    name: "teams",
    singular: "team",
    plural: "teams"
  },
  fields: {
    teamId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.teamId.label",
      placeholder: "fields.teamId.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "uuidV4()")' }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 3,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true },
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
    rbac: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.rbac.label",
      placeholder: "fields.rbac.placeholder",
      graphql: { nullable: true }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 6,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    orgId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 7,
      label: "fields.orgId.label",
      placeholder: "fields.orgId.placeholder",
      graphql: { nullable: false }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 8,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      graphql: { nullable: false, directive: '@default(value: false)' }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 9,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["teamId", "name", "appId", "description", "rbac", "metadata", "orgId", "isTest", "createdAt"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["teamId", "name", "appId", "description", "rbac", "metadata", "orgId", "isTest", "createdAt"] },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["teamId", "name", "appId", "description"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["teamId", "name", "appId", "description"] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;

const subscriptionModule = {
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

const checkoutModule = {
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

const invoiceModule = {
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

const paymentModule = {
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

const computeModule = {
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

const productConsumeModule = {
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

const apikeyModule = {
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
      type: "String",
      encrypted: true,
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

const thingModule = {
  name: "Dispositivi Connessi (IoT)",
  icon: "Radio",
  tableConfig: {
    key: "thingId",
    name: "things",
    singular: "thing",
    plural: "things"
  },
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

const applicationModule = {
  name: "Gestione Applicazioni",
  icon: "AppWindow",
  tableConfig: {
    key: "appId",
    name: "applications",
    singular: "application",
    plural: "applications"
  },
  fields: {
    appId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.appId.label",
      placeholder: "fields.appId.placeholder",
      validation: { required: true, min: 3 },
      graphql: { nullable: false }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    description: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.description.label",
      placeholder: "fields.description.placeholder",
      graphql: { nullable: true }
    },
    isActive: {
      type: "Boolean",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.isActive.label",
      placeholder: "fields.isActive.placeholder",
      validation: { default: true },
      graphql: { nullable: false, directive: "@default(value: true)" }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["appId", "name", "description", "isActive", "createdAt"] },
    admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
    device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
  }
} as const;

const productModule = {
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

const productpriceModule = {
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

const organizationModule = {
  name: "Organizzazioni",
  icon: "Building",
  tableConfig: {
    key: "orgId",
    name: "organizations",
    singular: "organization",
    plural: "organizations"
  },
  fields: {
    orgId: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.orgId.label",
      placeholder: "fields.orgId.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "uuidV4()")' }
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: false }
    },
    type: {
      type: "String",
      encrypted: false,
      render: true,
      order: 3,
      label: "fields.type.label",
      placeholder: "fields.type.placeholder",
      validation: { required: true, enum: ["personal", "business", "government", "education"] },
      options: ["personal", "business", "government", "education"],
      graphql: { nullable: false, directive: '@default(value: "personal")' }
    },
    country: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      label: "fields.country.label",
      placeholder: "fields.country.placeholder",
      validation: { required: true, min: 2, max: 2, default: "IT" },
      graphql: { nullable: false, directive: '@default(value: "IT")' }
    },
    viesValidated: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.viesValidated.label",
      placeholder: "fields.viesValidated.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    vatNumber: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      label: "fields.vatNumber.label",
      placeholder: "fields.vatNumber.placeholder",
      validation: { format: "vat" },
      graphql: { nullable: true }
    },
    fiscalCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 7,
      label: "fields.fiscalCode.label",
      placeholder: "fields.fiscalCode.placeholder",
      validation: { format: "personal_id" },
      graphql: { nullable: true }
    },
    billingAddress: {
      type: "String",
      encrypted: false,
      render: true,
      order: 8,
      label: "fields.billingAddress.label",
      placeholder: "fields.billingAddress.placeholder",
      graphql: { nullable: true }
    },
    sdiCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 9,
      label: "fields.sdiCode.label",
      placeholder: "fields.sdiCode.placeholder",
      validation: { format: "sdi" },
      graphql: { nullable: true }
    },
    officeCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.officeCode.label",
      placeholder: "fields.officeCode.placeholder",
      validation: { min: 6, max: 6 },
      graphql: { nullable: true }
    },
    cigCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 11,
      label: "fields.cigCode.label",
      placeholder: "fields.cigCode.placeholder",
      graphql: { nullable: true }
    },
    cupCode: {
      type: "String",
      encrypted: false,
      render: true,
      order: 12,
      label: "fields.cupCode.label",
      placeholder: "fields.cupCode.placeholder",
      graphql: { nullable: true }
    },
    address: {
      type: "String",
      encrypted: false,
      render: true,
      order: 13,
      label: "fields.address.label",
      placeholder: "fields.address.placeholder",
      graphql: { nullable: true }
    },
    latitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 14,
      label: "fields.latitude.label",
      placeholder: "fields.latitude.placeholder",
      graphql: { nullable: true }
    },
    longitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 15,
      label: "fields.longitude.label",
      placeholder: "fields.longitude.placeholder",
      graphql: { nullable: true }
    },
    altitude: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 16,
      label: "fields.altitude.label",
      placeholder: "fields.altitude.placeholder",
      graphql: { nullable: true }
    },
    stripeCustomerId: {
      type: "String",
      encrypted: true,
      render: false,
      order: 17,
      label: "fields.stripeCustomerId.label",
      placeholder: "fields.stripeCustomerId.placeholder",
      graphql: { nullable: true, directive: "@unique" }
    },
    stripeConnectAccountId: {
      type: "String",
      encrypted: true,
      render: false,
      order: 18,
      label: "fields.stripeConnectAccountId.label",
      placeholder: "fields.stripeConnectAccountId.placeholder",
      graphql: { nullable: true, directive: "@unique" }
    },
    stripeConnectOnboarded: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 19,
      label: "fields.stripeConnectOnboarded.label",
      placeholder: "fields.stripeConnectOnboarded.placeholder",
      validation: { default: false },
      graphql: { nullable: true, directive: "@default(value: false)" }
    },
    isTest: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 20,
      label: "fields.isTest.label",
      placeholder: "fields.isTest.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: false)" }
    },
    confirmed: {
      type: "Boolean",
      encrypted: false,
      render: false,
      order: 21,
      label: "fields.confirmed.label",
      placeholder: "fields.confirmed.placeholder",
      validation: { default: false },
      graphql: { nullable: false, directive: "@default(value: true)" }
    },
    addressDetails: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 22,
      label: "fields.addressDetails.label",
      placeholder: "fields.addressDetails.placeholder",
      graphql: { nullable: true }
    },
    metadata: {
      type: "Any",
      encrypted: false,
      render: false,
      order: 23,
      label: "fields.metadata.label",
      placeholder: "fields.metadata.placeholder",
      graphql: { nullable: true }
    },
    createdAt: {
      type: "Timestamp",
      encrypted: false,
      render: false,
      order: 24,
      label: "fields.createdAt.label",
      placeholder: "fields.createdAt.placeholder",
      graphql: { nullable: false, directive: '@default(expr: "request.time")' }
    }
  },
  rolePolicies: {
    owner: {
      canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true,
      allowedFields: ["orgId", "name", "type", "country", "viesValidated", "vatNumber", "fiscalCode", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode", "address", "latitude", "longitude", "altitude", "stripeCustomerId", "stripeConnectAccountId", "stripeConnectOnboarded", "isTest", "confirmed", "addressDetails", "metadata", "createdAt"]
    },
    admin: {
      canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true,
      allowedFields: ["orgId", "name", "type", "country", "viesValidated", "vatNumber", "fiscalCode", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode", "address", "latitude", "longitude", "altitude", "stripeCustomerId", "stripeConnectAccountId", "stripeConnectOnboarded", "isTest", "confirmed", "addressDetails", "metadata", "createdAt"]
    },
    member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "type", "country", "address"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "type", "country"] },
    device: { canCreate: false, canRead: true, canList: false, canUpdate: false, canDelete: false, allowedFields: ["orgId", "name", "type", "country"] }
  }
} as const;

const projectsModule = {
  name: "Progetti",
  icon: "Folder",
  fields: {
    id: {
      type: "String",
      encrypted: false,
      render: false,
      order: 1,
      label: "fields.id.label",
      placeholder: "fields.id.placeholder"
    },
    name: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      label: "fields.name.label",
      placeholder: "fields.name.placeholder"
    },
    budget: {
      type: "Float",
      encrypted: true,
      render: true,
      order: 3,
      label: "fields.budget.label",
      placeholder: "fields.budget.placeholder"
    },
    location_lat: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 4,
      label: "fields.location_lat.label",
      placeholder: "fields.location_lat.placeholder"
    },
    location_lng: {
      type: "Float",
      encrypted: false,
      render: false,
      order: 5,
      label: "fields.location_lng.label",
      placeholder: "fields.location_lng.placeholder"
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["id", "name", "budget", "location_lat", "location_lng"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["id", "name", "budget", "location_lat", "location_lng"] },
    member: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["id", "name", "location_lat", "location_lng"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["id", "name"] }
  }
} as const;

const addressModule = {
  name: "Indirizzi",
  icon: "MapPin",
  fields: {
    street: {
      type: "String",
      encrypted: false,
      render: true,
      order: 1,
      label: "fields.street.label",
      placeholder: "fields.street.placeholder"
    },
    coordinates: {
      type: "String",
      encrypted: true,
      render: true,
      order: 2,
      label: "fields.coordinates.label",
      placeholder: "fields.coordinates.placeholder"
    }
  },
  rolePolicies: {
    owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["street", "coordinates"] },
    admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["street", "coordinates"] },
    member: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["street"] },
    viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["street"] }
  }
} as const;

// ==========================================
// REGISTRO GLOBAL DEGLI ELEMENTI (SSOT)
// ==========================================

export const MODULE_REGISTRY = {
  dashboard: dashboardModule,
  user: userModule,
  team: teamModule,
  subscription: subscriptionModule,
  checkout: checkoutModule,
  invoice: invoiceModule,
  payment: paymentModule,
  compute: computeModule,
  product_consume: productConsumeModule,
  apikey: apikeyModule,
  thing: thingModule,
  application: applicationModule,
  product: productModule,
  productprice: productpriceModule,
  organization: organizationModule,
  projects: projectsModule,
  address: addressModule
} as const;

export const APPLICATION_REGISTRY = {
  sso: {
    name: "KALEX SSO Console",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["dashboard", "user", "team", "subscription", "checkout", "invoice", "payment", "compute", "product_consume", "apikey", "thing", "application", "product", "productprice"] as const
  },
  user: {
    name: "KALEX Users",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["user"] as const
  },
  team: {
    name: "KALEX Organization Teams",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["team"] as const
  },
  organization: {
    name: "KALEX Organizations",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["organization"] as const
  },
  thing: {
    name: "KALEX Thing (IoT)",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["thing"] as const
  },
  apikey: {
    name: "KALEX API Keys",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["apikey"] as const
  },
  crm: {
    name: "KALEX CRM",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["projects"] as const
  },
  geolocation: {
    name: "KALEX Geolocation",
    enabled: true,
    supportedOrgRoles: ["admin"] as const,
    modules: ["address"] as const
  },
  web: {
    name: "KALEX Web Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  etics: {
    name: "KALEX ETICS Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  stand: {
    name: "KALEX Stand Portal",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  },
  drone: {
    name: "KALEX Drone Flight Planner",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard", "thing"] as const
  },
  photogrammetry: {
    name: "KALEX Photogrammetry Processor",
    enabled: true,
    supportedOrgRoles: ["buyer", "seller", "both"] as const,
    modules: ["dashboard"] as const
  }
} as const;

// ==========================================
// PONTE DI RETROCOMPATIBILITÀ (RESOURCE_REGISTRY)
// ==========================================

export const RESOURCE_REGISTRY = {
  sso: {
    name: APPLICATION_REGISTRY.sso.name,
    enabled: APPLICATION_REGISTRY.sso.enabled,
    modules: {
      dashboard: dashboardModule,
      user: userModule,
      team: teamModule,
      subscription: subscriptionModule,
      checkout: checkoutModule,
      invoice: invoiceModule,
      payment: paymentModule,
      compute: computeModule,
      product_consume: productConsumeModule,
      apikey: apikeyModule,
      thing: thingModule,
      application: applicationModule,
      product: productModule,
      productprice: productpriceModule
    }
  },
  user: {
    name: APPLICATION_REGISTRY.user.name,
    enabled: APPLICATION_REGISTRY.user.enabled,
    modules: {
      user: userModule
    }
  },
  team: {
    name: APPLICATION_REGISTRY.team.name,
    enabled: APPLICATION_REGISTRY.team.enabled,
    modules: {
      team: teamModule
    }
  },
  organization: {
    name: APPLICATION_REGISTRY.organization.name,
    enabled: APPLICATION_REGISTRY.organization.enabled,
    modules: {
      organization: organizationModule
    }
  },
  thing: {
    name: APPLICATION_REGISTRY.thing.name,
    enabled: APPLICATION_REGISTRY.thing.enabled,
    modules: {
      thing: thingModule
    }
  },
  apikey: {
    name: APPLICATION_REGISTRY.apikey.name,
    enabled: APPLICATION_REGISTRY.apikey.enabled,
    modules: {
      apikey: apikeyModule
    }
  },
  crm: {
    name: APPLICATION_REGISTRY.crm.name,
    enabled: APPLICATION_REGISTRY.crm.enabled,
    modules: {
      projects: projectsModule
    }
  },
  geolocation: {
    name: APPLICATION_REGISTRY.geolocation.name,
    enabled: APPLICATION_REGISTRY.geolocation.enabled,
    modules: {
      address: addressModule
    }
  },
  web: {
    name: APPLICATION_REGISTRY.web.name,
    enabled: APPLICATION_REGISTRY.web.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  etics: {
    name: APPLICATION_REGISTRY.etics.name,
    enabled: APPLICATION_REGISTRY.etics.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  stand: {
    name: APPLICATION_REGISTRY.stand.name,
    enabled: APPLICATION_REGISTRY.stand.enabled,
    modules: {
      dashboard: dashboardModule
    }
  },
  drone: {
    name: APPLICATION_REGISTRY.drone.name,
    enabled: APPLICATION_REGISTRY.drone.enabled,
    modules: {
      dashboard: dashboardModule,
      thing: thingModule
    }
  },
  photogrammetry: {
    name: APPLICATION_REGISTRY.photogrammetry.name,
    enabled: APPLICATION_REGISTRY.photogrammetry.enabled,
    modules: {
      dashboard: dashboardModule
    }
  }
} as const;

export type AppIds = keyof typeof RESOURCE_REGISTRY;
export type ModuleIds<A extends AppIds> = keyof typeof RESOURCE_REGISTRY[A]["modules"];

export interface SecurityPolicy {
  readonly canCreate: boolean;
  readonly canRead: boolean;
  readonly canUpdate: boolean;
  readonly canDelete: boolean;
  readonly canList: boolean;
  readonly allowedFields: readonly string[];
}

export interface FieldValidation {
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly email?: boolean;
  readonly enum?: readonly string[] | string[];
  readonly format?: "vat" | "personal_id" | "sdi";
  readonly positive?: boolean;
  readonly default?: unknown;
}

export interface FieldConfig {
  readonly type: "String" | "Boolean" | "Float" | "Timestamp" | "Any";
  readonly encrypted?: boolean;
  readonly render?: boolean;
  readonly order?: number;
  readonly label?: string;
  readonly placeholder?: string;
  readonly options?: readonly string[] | string[];
  readonly validation?: FieldValidation;
  readonly graphql?: {
    readonly nullable?: boolean;
    readonly directive?: string;
    readonly relation?: string;
    readonly dbName?: string;
    readonly dbType?: string;
    readonly dbIgnore?: boolean;
  };
}

export interface AppInfo {
  readonly id: AppIds;
  readonly name: string;
  readonly enabled: boolean;
}

export interface ModuleInfo {
  readonly id: keyof typeof MODULE_REGISTRY;
  readonly name: string;
  readonly icon?: LucideIconName;
  readonly fields: Record<string, FieldConfig>;
  readonly rolePolicies: Record<string, SecurityPolicy>;
}

// ==========================================
// METODI HELPER SSOT (SINGLE SOURCE OF TRUTH)
// ==========================================

export function listApplications(): AppInfo[] {
  return Object.entries(RESOURCE_REGISTRY).map(([id, app]) => ({
    id: id as AppIds,
    name: app.name,
    enabled: app.enabled
  }));
}

export function listModules(): ModuleInfo[] {
  return Object.entries(MODULE_REGISTRY).map(([id, mod]) => ({
    id: id as keyof typeof MODULE_REGISTRY,
    name: mod.name,
    icon: "icon" in mod ? (mod as { icon: LucideIconName }).icon : undefined,
    fields: mod.fields as Record<string, FieldConfig>,
    rolePolicies: mod.rolePolicies as Record<string, SecurityPolicy>
  }));
}

export function listAppModules(appId: AppIds): string[] {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return [];
  return Object.keys(app.modules);
}

export function getApplicationInfo(appId: AppIds): { readonly name: string; readonly enabled: boolean } | null {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return null;
  return {
    name: app.name,
    enabled: app.enabled
  };
}

export function getModuleInfo(moduleId: keyof typeof MODULE_REGISTRY): ModuleInfo | null {
  const mod = MODULE_REGISTRY[moduleId];
  if (!mod) return null;
  return {
    id: moduleId,
    name: mod.name,
    icon: "icon" in mod ? (mod as { icon: LucideIconName }).icon : undefined,
    fields: mod.fields as Record<string, FieldConfig>,
    rolePolicies: mod.rolePolicies as Record<string, SecurityPolicy>
  };
}

export function hasModule(appId: AppIds, moduleId: string): boolean {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return false;
  return moduleId in app.modules;
}

interface PolicyRule {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canList: boolean;
  allowedFields: readonly string[];
}

type RolePolicyMap = Record<string, PolicyRule>;

interface ContextPolicyMap {
  buyer?: RolePolicyMap;
  seller?: RolePolicyMap;
}

export function getModulePolicyForContext(
  moduleId: keyof typeof MODULE_REGISTRY,
  userRole: "owner" | "admin" | "member" | "viewer" | "device",
  orgRole?: "buyer" | "seller" | "both"
): SecurityPolicy | null {
  const mod = MODULE_REGISTRY[moduleId];
  if (!mod) return null;

  // Se l'utente è "owner", ha sempre il bypass completo di lettura/scrittura
  if (userRole === "owner") {
    return {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canList: true,
      allowedFields: Object.keys(mod.fields)
    };
  }

  // 1. Se è specificato un ruolo organizzativo ed esiste contextPolicies
  if (orgRole && "contextPolicies" in mod) {
    const contextPolicies = mod.contextPolicies as unknown as ContextPolicyMap;
    
    if (orgRole === "both") {
      // In caso di "both", uniamo i permessi di buyer e seller (OR logico)
      const buyerPolicy = contextPolicies.buyer?.[userRole];
      const sellerPolicy = contextPolicies.seller?.[userRole];
      if (buyerPolicy && sellerPolicy) {
        return {
          canCreate: buyerPolicy.canCreate || sellerPolicy.canCreate,
          canRead: buyerPolicy.canRead || sellerPolicy.canRead,
          canUpdate: buyerPolicy.canUpdate || sellerPolicy.canUpdate,
          canDelete: buyerPolicy.canDelete || sellerPolicy.canDelete,
          canList: buyerPolicy.canList || sellerPolicy.canList,
          allowedFields: Array.from(new Set([...buyerPolicy.allowedFields, ...sellerPolicy.allowedFields]))
        };
      }
    } else {
      const context = contextPolicies[orgRole];
      if (context && userRole in context) {
        return context[userRole];
      }
    }
  }

  // 2. Fallback alle rolePolicies piatte
  if ("rolePolicies" in mod) {
    const rolePolicies = mod.rolePolicies as unknown as RolePolicyMap;
    if (userRole in rolePolicies) {
      return rolePolicies[userRole];
    }
  }

  return null;
}

export function getVisibleModulesForSidebar(
  appId: AppIds,
  userRole: "owner" | "admin" | "member" | "viewer" | "device",
  orgRole?: "buyer" | "seller" | "both"
): string[] {
  const app = RESOURCE_REGISTRY[appId];
  if (!app) return [];

  if (userRole === "owner") {
    return Object.keys(app.modules);
  }

  return Object.keys(app.modules).filter((moduleId) => {
    const policy = getModulePolicyForContext(
      moduleId as keyof typeof MODULE_REGISTRY,
      userRole,
      orgRole
    );
    return policy ? (policy.canRead || policy.canList) : false;
  });
}
