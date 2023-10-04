/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded Contact schema
export const Contact = {
    name: "Contact",
    embedded: true,
    properties: {
        primaryPhone: "int?",
        secondaryPhone: "int?",
        email: "string?",
    },
};
