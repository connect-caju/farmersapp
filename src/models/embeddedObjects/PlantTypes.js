/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded PlantTypes schema
export const PlantTypes = {
    name: "PlantTypes",
    embedded: true,
    properties: {
        plantType: "string[]",
        clones: "string[]",
    },
};