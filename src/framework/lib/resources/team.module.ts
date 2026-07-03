// framework/src/lib/resources/team.module.ts
// Modulo "Gestione Team": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const teamModule = {
  name: "Gestione Team",
  icon: "UserCog",
  tableConfig: {
    key: "teamId",
    name: "teams",
    singular: "team",
    plural: "teams"
  },
  formFields: ["name", "description"],
  listFields: ["name", "description", "createdAt"],
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
