/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

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