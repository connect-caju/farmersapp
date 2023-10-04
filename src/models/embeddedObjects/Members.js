/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded Members schema
export const Members = {
    name: "Members",
    embedded: true,
    properties: {
        total: { type: "int?", default: 0 },
        women: { type: "int?", default: 0 },
    },
};
