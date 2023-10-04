/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Asset schema is used to identify actors based on what they own
// What actors own and do classifies them (Farmer, Trader, Processor, Exporter, etc.)
export const Assets = {
    name: "Assets",
    embedded: true,
    properties: {
        category: "string?",
        subcategory: "string?",
        assetType: "string",
        assets: "string[]",
    },
};
