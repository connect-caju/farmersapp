/**
 *  SprayingProviders are farmers who assist others
 * in terms cashew trees treatmet from diseases and plagues
 */

export const SprayingServiceProvider = {
  name: "SprayingServiceProvider",
  primaryKey: "_id",
  properties: {
    _id: "string",
    actorId: "string",
    actorName: "string?",
    year: { type: "int", default: () => new Date().getFullYear() },
    beneficiaries: "SprayingServiceBeneficiary[]",
    isActive: { type: "bool", default: true }, // if true, then this farmer is an active spraying service provider
    //  status: 'string?', // active, inactive
    assets: "Assets[]",
    services: "SprayingService[]",

    status: { type: "string", default: "pending" }, // pending; active; inactive
    checkedBy: "string?",

    userDistrict: "string?",
    userProvince: "string?",
    userId: "string",
    userName: "string?",

    createdAt: { type: "date", default: () => new Date() },
    modifiedAt: { type: "date", default: () => new Date() },
  },
}
