// framework/src/lib/resources/user.module.ts
// Modulo "Gestione Utenti": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const userModule = {
  name: "Gestione Utenti",
  icon: "Users",
  tableConfig: {
    key: "userId",
    name: "users",
    singular: "user",
    plural: "users"
  },
  formFields: ["fullName", "email", "mobile", "locale", "theme", "avatarUrl"],
  listFields: ["fullName", "email", "role", "createdAt"],
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
      order: 3,
      colSpan: 1,
      label: "fields.email.label",
      placeholder: "fields.email.placeholder",
      validation: { required: true, email: true },
      graphql: { nullable: false, directive: "@unique" }
    },
    fullName: {
      type: "String",
      encrypted: false,
      render: true,
      order: 2,
      colSpan: 2,
      label: "fields.fullName.label",
      placeholder: "fields.fullName.placeholder",
      validation: { required: true, min: 1 },
      graphql: { nullable: true }
    },
    role: {
      type: "String",
      encrypted: false,
      render: true,
      order: 10,
      label: "fields.role.label",
      placeholder: "fields.role.placeholder",
      validation: { required: true },
      options: ["owner", "admin", "member", "viewer", "device"],
      graphql: { dbIgnore: true }
    },
    avatarUrl: {
      type: "String",
      encrypted: false,
      render: true,
      hidden: true,
      order: 9,
      colSpan: 2,
      label: "fields.avatarUrl.label",
      placeholder: "fields.avatarUrl.placeholder",
      graphql: { nullable: true }
    },
    mobile: {
      type: "String",
      encrypted: false,
      render: true,
      order: 4,
      colSpan: 1,
      label: "fields.mobile.label",
      placeholder: "fields.mobile.placeholder",
      graphql: { nullable: true }
    },
    locale: {
      type: "String",
      encrypted: false,
      render: true,
      order: 5,
      colSpan: 1,
      label: "fields.locale.label",
      placeholder: "fields.locale.placeholder",
      options: ["it", "en", "es"],
      graphql: { nullable: false, directive: '@default(value: "en")' }
    },
    theme: {
      type: "String",
      encrypted: false,
      render: true,
      order: 6,
      colSpan: 1,
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
