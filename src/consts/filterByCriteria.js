/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

import { farmerTypes } from "./farmerTypes";

export const filterByCriteria = [
    {
        criteriaType: "Comerciais",
        farmerType: farmerTypes.farmer,
        focusedOption: 1,
    },
    {
        criteriaType: "Familiares",
        farmerType: farmerTypes.farmer,
        focusedOption: 2,
    },
    {
        criteriaType: "Não categorizados",
        farmerType: farmerTypes.farmer,
        focusedOption: 3,
    },
    {
        criteriaType: "Pendentes",
        farmerType: farmerTypes.farmer,
        focusedOption: 4,
    },
    {
        criteriaType: "Validados",
        farmerType: farmerTypes.farmer,
        focusedOption: 5,
    },
    {
        criteriaType: "Cooperativas",
        farmerType: farmerTypes.group,
        focusedOption: 1,
    },
    {
        criteriaType: "Associações",
        farmerType: farmerTypes.group,
        focusedOption: 2,
    },
    {
        criteriaType: "Grupos de Produtores",
        farmerType: farmerTypes.group,
        focusedOption: 3,
    },
    {
        criteriaType: "Pendentes",
        farmerType: farmerTypes.group,
        focusedOption: 4,
    },
    {
        criteriaType: "Validados",
        farmerType: farmerTypes.group,
        focusedOption: 5,
    },
    {
        criteriaType: "Privados",
        farmerType: farmerTypes.institution,
        focusedOption: 1,
    },
    {
        criteriaType: "Públicos",
        farmerType: farmerTypes.institution,
        focusedOption: 2,
    },
    {
        criteriaType: "Pendentes",
        farmerType: farmerTypes.institution,
        focusedOption: 4,
    },
    {
        criteriaType: "Validados",
        farmerType: farmerTypes.institution,
        focusedOption: 5,
    },
];
