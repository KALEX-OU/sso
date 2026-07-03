// framework/src/lib/resources/dashboard.module.ts
// Modulo "Dashboard Console": campi e policy di ruolo (estratto 1:1 dalla SSOT resources.config.ts).

export const dashboardModule = {
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
