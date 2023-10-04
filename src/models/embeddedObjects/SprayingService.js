/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// SprayingService schema is used to identiy farmers who
// pay spraying services to others
export const SprayingService = {
    name: "SprayingService",
    embedded: true,
    properties: {
        year: { type: "int", default: () => new Date().getFullYear() },
        beneficiaries: "string[]", // farmers id
    },
};