/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

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
};
