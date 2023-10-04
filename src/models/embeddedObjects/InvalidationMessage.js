/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

export const InvalidationMessage = {
    name: "InvalidationMessage",
    embedded: true,
    properties: {
        position: "int",
        message: "string",
        ownerName: "string",
        createdAt: { type: "date", default: () => new Date() },
    },
};