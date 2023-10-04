/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */


// Embedded Density schema
export const Density = {
    name: "Density",
    embedded: true,
    properties: {
        mode: "string", // Regular ; Irregular
        length: { type: "int?", default: 0 },
        width: { type: "int?", default: 0 },
    },
};
