/**
 *  Farmland schema for each farmland that is to be registered
 */

export const Farmland = {
  name: "Farmland",
  primaryKey: "_id",
  properties: {
    _id: "string",
    farmerId: "string",
    description: "string?",
    consociatedCrops: "string[]",
    extremeCoordinates: "Coordinates[]",
    geolocation: "Coordinates?",
    auditedArea: "float?",
    totalArea: "float?",
    trees: "int?",
    blocks: "FarmlandBlock[]",
    ownerType: "string?", // Single, Group, or Institution
    createdAt: { type: "date", default: () => new Date() },
    modifiedAt: { type: "date", default: () => new Date() },
    modifiedBy: "string?",

    userDistrict: "string?",
    userProvince: "string?",
    userId: "string",
    userName: "string?",

    status: { type: "string", default: "pending" }, // pending, validated, or invalidated
    checkedBy: "string?", // name of the user who validated/invalidated this farmland

  },
}
