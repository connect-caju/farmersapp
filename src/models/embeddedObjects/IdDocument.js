/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded IdDocument schema
export const IdDocument = {
    name: "IdDocument",
    embedded: true,
    properties: {
        docType: "string?",
        docNumber: "string?",
        nuit: { type: "int?", default: 0 },
    },
};