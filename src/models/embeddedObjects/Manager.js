/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded Manager schema
export const Manager = {
    name: "Manager",
    embedded: true,
    properties: {
        fullname: { type: "string" },
        phone: { type: "int?" },
    },
};
