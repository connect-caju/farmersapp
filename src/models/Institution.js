/**
 *  Institution schema for those institutions that
 *  own cashew farmlands
 */

export const Institution = {
  name: "Institution",
  primaryKey: "_id",
  properties: {
    _id: "string",
    type: "string",
    private: { type: "bool", default: false },
    name: "string",
    identifier: "string?",
    address: "Address",
    manager: "Manager",
    nuit: { type: "int?", default: 0 },
    licence: { type: "string?", default: "" },
    image: { type: "string", default: "" },
    assets: "Assets[]",
    geolocation: "Coordinates?",

    userDistrict: "string?",
    userProvince: "string?",
    userId: "string",
    userName: "string?",

    status: { type: "string", default: "pending" },
    checkedBy: "string?",

    createdAt: { type: "date", default: () => new Date() },
    modifiedAt: { type: "date", default: () => new Date() },
    modifiedBy: "string?",
  },
}
