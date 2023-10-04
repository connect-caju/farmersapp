/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded Coordinates schema
export const Coordinates = {
    name: "Coordinates",
    embedded: true,
    properties: {
        position: "int?",
        latitude: "double?",
        longitude: "double?",
    },
};
