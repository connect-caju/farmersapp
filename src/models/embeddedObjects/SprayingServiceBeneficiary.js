/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// Embedded SprayingBeneficiaries
export const SprayingServiceBeneficiary = {
    name: "SprayingServiceBeneficiary",
    embedded: true,
    properties: {
      beneficiaryId: "string",
      beneficiaryName: "string",
      trees: { type: "int", default: 0 },
    },
  }