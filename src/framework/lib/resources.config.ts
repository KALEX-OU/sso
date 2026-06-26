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

export const RESOURCE_REGISTRY = {
  sso: {
    name: "KALEX SSO Console",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard Console",
        fields: {
          orgName: { type: "String", isSensitive: false },
          orgType: { type: "String", isSensitive: false },
          onboardingStatus: { type: "String", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["orgName", "orgType", "onboardingStatus"]  },
          admin: { canCreate: false, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["orgName", "orgType", "onboardingStatus"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgName", "orgType"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["orgName", "orgType"]  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      user: {
        name: "Gestione Utenti",
        fields: {
          email: { type: "String", isSensitive: false },
          fullName: { type: "String", isSensitive: false },
          role: { type: "String", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["email", "fullName", "role"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["email", "fullName", "role"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["fullName", "role"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["fullName", "role"]  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      team: {
        name: "Gestione Team",
        fields: {
          name: { type: "String", isSensitive: false },
          teamId: { type: "String", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "teamId"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "teamId"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["name", "teamId"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["name", "teamId"]  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },

      subscription: {
        name: "Abbonamenti Unificati",
        fields: {
          subscriptionId: { type: "String", isSensitive: false, validation: { required: true } },
          buyerId: { type: "String", isSensitive: false, validation: { required: true } },
          sellerId: { type: "String", isSensitive: false },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          status: { type: "String", isSensitive: false, validation: { required: true } },
          items: { type: "Any", isSensitive: false, validation: { required: true } },
          cancelAtPeriodEnd: { type: "Boolean", isSensitive: false },
          currentPeriodStart: { type: "Timestamp", isSensitive: false },
          currentPeriodEnd: { type: "Timestamp", isSensitive: false },
          trialStart: { type: "Timestamp", isSensitive: false },
          trialEnd: { type: "Timestamp", isSensitive: false },
          expiresAt: { type: "Timestamp", isSensitive: false },
          updatedAt: { type: "Timestamp", isSensitive: false },
          metadata: { type: "Any", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
          admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["subscriptionId", "buyerId", "sellerId", "appId", "status", "items", "cancelAtPeriodEnd", "currentPeriodStart", "currentPeriodEnd", "trialStart", "trialEnd", "expiresAt", "updatedAt", "metadata"] },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      },
      checkout: {
        name: "Ordini / Checkout",
        fields: {
          checkoutId: { type: "String", isSensitive: false, validation: { required: true } },
          buyerId: { type: "String", isSensitive: false, validation: { required: true } },
          sellerId: { type: "String", isSensitive: false },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          status: { type: "String", isSensitive: false, validation: { required: true } },
          mode: { type: "String", isSensitive: false, validation: { required: true, enum: ["subscription", "payment"] } },
          items: { type: "Any", isSensitive: false, validation: { required: true } },
          amount: { type: "Float", isSensitive: false, validation: { required: true, min: 0 } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
          admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["checkoutId", "buyerId", "sellerId", "appId", "status", "mode", "items", "amount", "isTest", "createdAt"] },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      },
      invoice: {
        name: "Fatturazione",
        fields: {
          invoiceId: { type: "String", isSensitive: false, validation: { required: true } },
          invoiceNumber: { type: "String", isSensitive: false },
          buyerId: { type: "String", isSensitive: false, validation: { required: true } },
          sellerId: { type: "String", isSensitive: false, validation: { required: true } },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          amount: { type: "Float", isSensitive: false, validation: { required: true, min: 0 } },
          currency: { type: "String", isSensitive: false, validation: { required: true, default: "EUR" } },
          status: { type: "String", isSensitive: false, validation: { required: true } },
          pdfUrl: { type: "String", isSensitive: false },
          taxPercent: { type: "Float", isSensitive: false, validation: { default: 0 } },
          taxAmount: { type: "Float", isSensitive: false, validation: { default: 0 } },
          subtotal: { type: "Float", isSensitive: false },
          subscriptionId: { type: "String", isSensitive: false },
          checkoutId: { type: "String", isSensitive: false },
          lineItems: { type: "Any", isSensitive: false },
          dueDate: { type: "Timestamp", isSensitive: false },
          paidAt: { type: "Timestamp", isSensitive: false },
          metadata: { type: "Any", isSensitive: false },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"]  },
          admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["invoiceId", "invoiceNumber", "buyerId", "sellerId", "amount", "currency", "status", "pdfUrl", "appId", "taxPercent", "taxAmount", "subtotal", "subscriptionId", "checkoutId", "lineItems", "dueDate", "paidAt", "metadata", "isTest", "createdAt"]  },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      payment: {
        name: "Gestione Pagamenti",
        fields: {
          paymentId: { type: "String", isSensitive: false, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          sellerOrgId: { type: "String", isSensitive: false },
          invoiceId: { type: "String", isSensitive: false },
          amount: { type: "Float", isSensitive: false, validation: { required: true, min: 0 } },
          status: { type: "String", isSensitive: false, validation: { required: true } },
          currency: { type: "String", isSensitive: false, validation: { default: "EUR" } },
          paymentMethodType: { type: "String", isSensitive: false },
          cardBrand: { type: "String", isSensitive: false },
          cardLast4: { type: "String", isSensitive: false },
          receiptUrl: { type: "String", isSensitive: false },
          stripeConnectAccountId: { type: "String", isSensitive: false },
          applicationFeeAmount: { type: "Float", isSensitive: false },
          errorMessage: { type: "String", isSensitive: false },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          createdAt: { type: "Timestamp", isSensitive: false },
          metadata: { type: "Any", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"]  },
          admin: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["paymentId", "orgId", "sellerOrgId", "invoiceId", "amount", "status", "currency", "paymentMethodType", "cardBrand", "cardLast4", "receiptUrl", "stripeConnectAccountId", "applicationFeeAmount", "errorMessage", "appId", "createdAt", "metadata"]  },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      compute: {
        name: "Risorse a Consumo",
        fields: {
          computeId: { type: "String", isSensitive: false, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          resourceType: { type: "String", isSensitive: false, validation: { required: true } },
          usage: { type: "Float", isSensitive: false, validation: { required: true } },
          status: { type: "String", isSensitive: false, validation: { default: "active" } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          metadata: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["computeId", "orgId", "resourceType", "usage", "status", "isTest", "metadata", "createdAt"]  },
          admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      product_consume: {
        name: "Consumo Prodotti",
        fields: {
          consumeId: { type: "String", isSensitive: false, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          productId: { type: "String", isSensitive: false, validation: { required: true } },
          quantity: { type: "Float", isSensitive: false, validation: { required: true, min: 0 } },
          status: { type: "String", isSensitive: false, validation: { default: "active" } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          metadata: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["consumeId", "orgId", "productId", "quantity", "status", "isTest", "metadata", "createdAt"] },
          admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      },
      apikey: {
        name: "Gestione Chiavi API",
        fields: {
          name: { type: "String", isSensitive: false },
          keyHash: { type: "String", isSensitive: true },
          ipWhitelist: { type: "Any", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "keyHash", "ipWhitelist"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "keyHash", "ipWhitelist"]  },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      thing: {
        name: "Dispositivi IoT Thing",
        fields: {
          name: { type: "String", isSensitive: false },
          thingId: { type: "String", isSensitive: false },
          type: { type: "String", isSensitive: false },
          status: { type: "String", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "thingId", "type", "status"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["name", "thingId", "type", "status"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["name", "thingId", "type", "status"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["name", "thingId", "type", "status"]  },
          device: { canCreate: false, canRead: true, canList: false, canUpdate: true, canDelete: false, allowedFields: ["name", "thingId", "type", "status"]  }
        }
      },
      application: {
        name: "Gestione Applicazioni",
        fields: {
          appId: { type: "String", isSensitive: false, validation: { required: true, min: 3 } },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          description: { type: "String", isSensitive: false },
          isActive: { type: "Boolean", isSensitive: false, validation: { default: true } }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["appId", "name", "description", "isActive"]  },
          admin: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          member: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          viewer: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      },
      product: {
        name: "Catalogo Prodotti e Servizi",
        fields: {
          productId: { type: "String", isSensitive: false, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          appId: { type: "String", isSensitive: false, validation: { required: true, default: "sso" } },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          description: { type: "String", isSensitive: false },
          mode: { type: "String", isSensitive: false, validation: { required: true, enum: ["service", "product"] } },
          type: { type: "String", isSensitive: false, validation: { required: true, enum: STRIPE_TAX_CODE_KEYS } },
          route: { type: "String", isSensitive: false, validation: { required: true, enum: ["subscription", "payment", "consume"] } },
          sku: { type: "String", isSensitive: false },
          isActive: { type: "Boolean", isSensitive: false, validation: { default: true } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          metadata: { type: "Any", isSensitive: false },
          variants: { type: "Any", isSensitive: false },
          bom: { type: "Any", isSensitive: false },
          relatedProducts: { type: "Any", isSensitive: false },
          options: { type: "Any", isSensitive: false },
          taxBehavior: { type: "String", isSensitive: false, validation: { required: true, enum: ["exclusive", "inclusive", "unspecified"], default: "exclusive" } },
          aiSummary: { type: "String", isSensitive: false },
          descriptionEmbedding: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false },
          prices: { type: "Any", isSensitive: false },
          batches: { type: "Any", isSensitive: false },
          consumes: { type: "Any", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "metadata", "variants", "bom", "relatedProducts", "options", "taxBehavior", "aiSummary", "descriptionEmbedding", "createdAt", "prices", "batches", "consumes"] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "metadata", "variants", "bom", "relatedProducts", "options", "taxBehavior", "aiSummary", "descriptionEmbedding", "createdAt", "prices", "batches", "consumes"] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "variants", "options", "taxBehavior", "createdAt", "prices", "batches", "consumes"] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["productId", "orgId", "appId", "name", "description", "mode", "type", "route", "sku", "isActive", "isTest", "createdAt", "prices", "batches", "consumes"] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      },
      productprice: {
        name: "Listini Prezzo",
        fields: {
          priceId: { type: "String", isSensitive: false, validation: { required: true } },
          productId: { type: "String", isSensitive: false, validation: { required: true } },
          amount: { type: "Float", isSensitive: false, validation: { required: true, min: 0 } },
          currency: { type: "String", isSensitive: false, validation: { default: "EUR" } },
          type: { type: "String", isSensitive: false, validation: { required: true, enum: ["one_time", "recurring"] } },
          billingScheme: { type: "String", isSensitive: false, validation: { default: "per_unit" } },
          recurringInterval: { type: "String", isSensitive: false },
          recurringUsageType: { type: "String", isSensitive: false },
          tier: { type: "String", isSensitive: false, validation: { enum: ["personal", "business", "government", "education"] } },
          isActive: { type: "Boolean", isSensitive: false, validation: { default: true } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          taxBehavior: { type: "String", isSensitive: false, validation: { default: "exclusive" } },
          metadata: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "metadata", "createdAt"] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "metadata", "createdAt"] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "createdAt"] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["priceId", "productId", "amount", "currency", "type", "billingScheme", "recurringInterval", "recurringUsageType", "tier", "isActive", "isTest", "taxBehavior", "createdAt"] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      },
    }
  },
  user: {
    name: "KALEX Users",
    enabled: true,
    modules: {
      user: {
        name: "Utenti",
        fields: {
          uid: { type: "String", isSensitive: false, validation: { required: true } },
          fullName: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          email: { type: "String", isSensitive: false, validation: { required: true, email: true } },
          role: { type: "String", isSensitive: false, validation: { required: true } }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["uid", "fullName", "email", "role"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["uid", "fullName", "email", "role"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["uid", "fullName", "email"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["uid", "fullName", "email"]  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      }
    }
  },
  team: {
    name: "KALEX Organization Teams",
    enabled: true,
    modules: {
      team: {
        name: "Teams",
        fields: {
          teamId: { type: "String", isSensitive: false },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          description: { type: "String", isSensitive: false },
          rbac: { type: "Any", isSensitive: false },
          metadata: { type: "Any", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["teamId", "name", "appId", "description", "rbac", "metadata"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["teamId", "name", "appId", "description", "rbac", "metadata"]  },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["teamId", "name", "appId", "description"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["teamId", "name", "appId", "description"]  },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: []  }
        }
      }
    }
  },
  organization: {
    name: "KALEX Organizations",
    enabled: true,
    modules: {
      organization: {
        name: "Organizzazioni",
        fields: {
          orgId: { type: "String", isSensitive: false },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          type: { type: "String", isSensitive: false, validation: { required: true, enum: ["personal", "business", "government", "education"] } },
          country: { type: "String", isSensitive: false, validation: { required: true, min: 2, max: 2, default: "IT" } },
          viesValidated: { type: "Boolean", isSensitive: false, validation: { default: false } },
          vatNumber: { type: "String", isSensitive: false, validation: { format: "vat" } },
          fiscalCode: { type: "String", isSensitive: false, validation: { format: "personal_id" } },
          billingAddress: { type: "String", isSensitive: false },
          sdiCode: { type: "String", isSensitive: false, validation: { format: "sdi" } },
          officeCode: { type: "String", isSensitive: false, validation: { min: 6, max: 6 } },
          cigCode: { type: "String", isSensitive: false },
          cupCode: { type: "String", isSensitive: false },
          address: { type: "String", isSensitive: false },
          latitude: { type: "Float", isSensitive: false },
          longitude: { type: "Float", isSensitive: false },
          altitude: { type: "Float", isSensitive: false },
          stripeCustomerId: { type: "String", isSensitive: true },
          stripeConnectAccountId: { type: "String", isSensitive: true },
          stripeConnectOnboarded: { type: "Boolean", isSensitive: false, validation: { default: false } },
          isTest: { type: "Boolean", isSensitive: false, validation: { default: false } },
          confirmed: { type: "Boolean", isSensitive: false, validation: { default: false } },
          addressDetails: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: true,
            allowedFields: [
              "orgId",
              "name",
              "type",
              "country",
              "viesValidated",
              "vatNumber",
              "fiscalCode",
              "billingAddress",
              "sdiCode",
              "officeCode",
              "cigCode",
              "cupCode",
              "address",
              "latitude",
              "longitude",
              "altitude",
              "stripeCustomerId",
              "stripeConnectAccountId",
              "stripeConnectOnboarded",
              "isTest",
              "confirmed",
              "addressDetails",
              "createdAt"
            ]
           },
          admin: { canCreate: false,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: false,
            allowedFields: [
              "orgId",
              "name",
              "type",
              "country",
              "viesValidated",
              "vatNumber",
              "fiscalCode",
              "billingAddress",
              "sdiCode",
              "officeCode",
              "cigCode",
              "cupCode",
              "address",
              "latitude",
              "longitude",
              "altitude",
              "stripeConnectOnboarded",
              "isTest",
              "confirmed",
              "addressDetails",
              "createdAt"
            ]
           },
          member: { canCreate: false,
            canRead: true, canList: true,
            canUpdate: false,
            canDelete: false,
            allowedFields: ["orgId", "name", "type", "country", "address"]
           },
          viewer: { canCreate: false,
            canRead: true, canList: true,
            canUpdate: false,
            canDelete: false,
            allowedFields: ["orgId", "name", "type", "country"]
           },
          device: { canCreate: false,
            canRead: true, canList: false,
            canUpdate: false,
            canDelete: false,
            allowedFields: ["orgId", "name", "type", "country"]
           }
        }
      }
    }
  },
  thing: {
    name: "KALEX Thing (IoT)",
    enabled: true,
    modules: {
      thing: {
        name: "Dispositivi",
        fields: {
          thingId: { type: "String", isSensitive: false, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          type: { type: "String", isSensitive: false, validation: { required: true } },
          status: { type: "String", isSensitive: false },
          deviceTokenHash: { type: "String", isSensitive: true },
          metadata: { type: "Any", isSensitive: false },
          isTest: { type: "Boolean", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: true,
            allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata", "isTest", "createdAt"]
           },
          admin: { canCreate: true,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: true,
            allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata", "isTest", "createdAt"]
           },
          member: { canCreate: false,
            canRead: true, canList: true,
            canUpdate: false,
            canDelete: false,
            allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"]
           },
          viewer: { canCreate: false,
            canRead: true, canList: true,
            canUpdate: false,
            canDelete: false,
            allowedFields: ["thingId", "orgId", "name", "type", "status"]
           },
          device: { canCreate: false,
            canRead: true, canList: false,
            canUpdate: true,
            canDelete: false,
            allowedFields: ["thingId", "orgId", "name", "type", "status", "metadata"]
           }
        }
      }
    }
  },
  apikey: {
    name: "KALEX API Keys",
    enabled: true,
    modules: {
      apikey: {
        name: "Chiavi API",
        fields: {
          keyHash: { type: "String", isSensitive: true, validation: { required: true } },
          orgId: { type: "String", isSensitive: false, validation: { required: true } },
          name: { type: "String", isSensitive: false, validation: { required: true, min: 1 } },
          description: { type: "String", isSensitive: false },
          ipWhitelist: { type: "Any", isSensitive: false },
          isActive: { type: "Boolean", isSensitive: false },
          expiresAt: { type: "Timestamp", isSensitive: false },
          isTest: { type: "Boolean", isSensitive: false },
          appId: { type: "String", isSensitive: false, validation: { required: true } },
          permissions: { type: "Any", isSensitive: false },
          createdAt: { type: "Timestamp", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: true,
            allowedFields: ["keyHash", "orgId", "name", "description", "ipWhitelist", "isActive", "expiresAt", "isTest", "appId", "permissions", "createdAt"]
           },
          admin: { canCreate: true,
            canRead: true, canList: true,
            canUpdate: true,
            canDelete: true,
            allowedFields: ["keyHash", "orgId", "name", "description", "ipWhitelist", "isActive", "expiresAt", "isTest", "appId", "permissions", "createdAt"]
           },
          member: { canCreate: false,
            canRead: false, canList: false,
            canUpdate: false,
            canDelete: false,
            allowedFields: []
           },
          viewer: { canCreate: false,
            canRead: false, canList: false,
            canUpdate: false,
            canDelete: false,
            allowedFields: []
           },
          device: { canCreate: false,
            canRead: false, canList: false,
            canUpdate: false,
            canDelete: false,
            allowedFields: []
           }
        }
      }
    }
  },
  crm: {
    name: "KALEX CRM",
    enabled: true,
    modules: {
      projects: {
        name: "Progetti",
        fields: {
          id: { type: "String", isSensitive: false },
          name: { type: "String", isSensitive: false },
          budget: { type: "Float", isSensitive: true },
          location_lat: { type: "Float", isSensitive: false },
          location_lng: { type: "Float", isSensitive: false }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["id", "name", "budget", "location_lat", "location_lng"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["id", "name", "budget", "location_lat", "location_lng"]  },
          member: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["id", "name", "location_lat", "location_lng"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["id", "name"]  }
        }
      }
    }
  },
  geolocation: {
    name: "KALEX Geolocation",
    enabled: true,
    modules: {
      address: {
        name: "Indirizzi",
        fields: {
          street: { type: "String", isSensitive: false },
          coordinates: { type: "String", isSensitive: true }
        },
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["street", "coordinates"]  },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: ["street", "coordinates"]  },
          member: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: false, allowedFields: ["street"]  },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: ["street"]  }
        }
      }
    }
  },
  web: {
    name: "KALEX Web Portal",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard Web",
        fields: {},
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      }
    }
  },
  etics: {
    name: "KALEX ETICS Portal",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard ETICS",
        fields: {},
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      }
    }
  },
  stand: {
    name: "KALEX Stand Portal",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard Stand",
        fields: {},
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      }
    }
  },
  drone: {
    name: "KALEX Drone Flight Planner",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard Drone",
        fields: {},
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      }
    }
  },
  photogrammetry: {
    name: "KALEX Photogrammetry Processor",
    enabled: true,
    modules: {
      dashboard: {
        name: "Dashboard Photogrammetry",
        fields: {},
        rolePolicies: {
          owner: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          admin: { canCreate: true, canRead: true, canList: true, canUpdate: true, canDelete: true, allowedFields: [] },
          member: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          viewer: { canCreate: false, canRead: true, canList: true, canUpdate: false, canDelete: false, allowedFields: [] },
          device: { canCreate: false, canRead: false, canList: false, canUpdate: false, canDelete: false, allowedFields: [] }
        }
      }
    }
  }
} as const;

export type AppIds = keyof typeof RESOURCE_REGISTRY;
export type ModuleIds<A extends AppIds> = keyof typeof RESOURCE_REGISTRY[A]["modules"];

export interface SecurityPolicy {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canList: boolean;
  allowedFields: string[];
}
