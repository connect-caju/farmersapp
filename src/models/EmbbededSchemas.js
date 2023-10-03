/**
 *  This file contains embbeded schemas:
 *  The project models contain embbeded schemas that are found in this file
 */

// Embedded Name schema
export const Name = {
  name: "Name",
  embedded: true,
  properties: {
    surname: "string",
    otherNames: "string",
  },
}

// Embedded Address schema
export const Address = {
  name: "Address",
  embedded: true,
  properties: {
    province: "string",
    district: { type: "string", default: "NA" },
    adminPost: { type: "string", default: "NA" },
    village: { type: "string", default: "NA" },
  },
}

// Embedded Members schema
export const Members = {
  name: "Members",
  embedded: true,
  properties: {
    total: { type: "int?", default: 0 },
    women: { type: "int?", default: 0 },
  },
}

// Embedded Manager schema
export const Manager = {
  name: "Manager",
  embedded: true,
  properties: {
    fullname: { type: "string" },
    phone: { type: "int?" },
  },
}

// Embedded Contact schema
export const Contact = {
  name: "Contact",
  embedded: true,
  properties: {
    primaryPhone: "int?",
    secondaryPhone: "int?",
    email: "string?",
  },
}

// Embedded IdDocument schema
export const IdDocument = {
  name: "IdDocument",
  embedded: true,
  properties: {
    docType: "string?",
    docNumber: "string?",
    nuit: { type: "int?", default: 0 },
  },
}

// Embedded Density schema
export const Density = {
  name: "Density",
  embedded: true,
  properties: {
    mode: "string", // Regular ; Irregular
    length: { type: "int?", default: 0 },
    width: { type: "int?", default: 0 },
  },
}

// Embedded PlantTypes schema
export const PlantTypes = {
  name: "PlantTypes",
  embedded: true,
  properties: {
    plantType: "string[]",
    clones: "string[]",
  },
}

// Embedded Coordinates schema
export const Coordinates = {
  name: "Coordinates",
  embedded: true,
  properties: {
    position: "int?",
    latitude: "double?",
    longitude: "double?",
  },
}

// Embedded SprayingBeneficiaries
export const SprayingServiceBeneficiary = {
  name: "SprayingServiceBeneficiary",
  embedded: true,
  properties: {
    beneficiaryId: "string",
    beneficiaryName: "string",
    trees: { type: "int", default: 0 },
  },
}

export const SameTypeTrees = {
  name: "SameTypeTrees",
  embedded: true,
  properties: {
    treeType: "string?",
    trees: "int?",
  },
}

export const FarmlandBlock = {
  name: "FarmlandBlock",
  embedded: true,
  properties: {
    _id: "string",
    plantingYear: "int",
    density: "Density",
    trees: "int",
    usedArea: "float?",
    plantTypes: "PlantTypes",
    sameTypeTrees: "SameTypeTrees[]",

    userName: "string?",

    createdAt: { type: "date", default: () => new Date() },
    modifiedAt: { type: "date", default: () => new Date() },
  },
}

export const InvalidationMessage = {
  name: "InvalidationMessage",
  embedded: true,
  properties: {
    position: "int",
    message: "string",
    ownerName: "string",
    createdAt: { type: "date", default: () => new Date() },
  },
}

// Asset schema is used to identify actors based on what they own
// What actors own and do classifies them (Farmer, Trader, Processor, Exporter, etc.)
export const Assets = {
  name: "Assets",
  embedded: true,
  properties: {
    category: "string?",
    subcategory: "string?",
    assetType: "string",
    assets: "string[]",
  },
}

// SprayingService schema is used to identiy farmers who
// pay spraying services to others
export const SprayingService = {
  name: "SprayingService",
  embedded: true,
  properties: {
    year: { type: "int", default: () => new Date().getFullYear() },
    beneficiaries: "string[]", // farmers id
  },
}

export const Membership = {
  name: "Membership",
  embedded: true,
  properties: {
    subscriptionYear: "int?",
    unsubscriptionYear: "int?",
    organizationId: "string",
  },
}
