/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

import categories from "./categories";
import { farmerTypes } from "./farmerTypes";
import { groupTypes } from "./groupTypes";
import { resourceValidation } from "./resourceValidation";

/**
 * This array contains objects that are used to search and filter data
 * according to determined criteria:
 * 1. Resources are filtered by property such as 
 *  - status (pending, invalidated, validated)
 *  - subcategory (comercial, familiar, nao categorizado)
 *  - groupType (cooperativa, associacao, grupo de produtores)
 *  - institutionType (privada, publica)
 */
export const filterByCriteria = [
    {
        criteriaName: "Comerciais",
        criteriaType: "subcategory",
        searchKey: categories.farmer.subcategories.commercial,
        farmerType: farmerTypes.farmer,
        focusedOption: 1,
    },
    {
        criteriaName: "Familiares",
        criteriaType: "subcategory",
        searchKey: categories.farmer.subcategories.autosustentable,
        farmerType: farmerTypes.farmer,
        focusedOption: 2,
    },
    {
        criteriaName: "Não categorizados",
        criteriaType: "subcategory",
        searchKey: categories.farmer.subcategories.notSubcategorized,
        farmerType: farmerTypes.farmer,
        focusedOption: 3,
    },
    {
        criteriaName: "Pendentes",
        criteriaType: "status",
        searchKey: resourceValidation.status.pending,
        farmerType: farmerTypes.farmer,
        focusedOption: 4,
    },
    {
        criteriaName: "Validados",
        criteriaType: "status",
        searchKey: resourceValidation.status.validated,
        farmerType: farmerTypes.farmer,
        focusedOption: 5,
    },
    {
        criteriaName: "Cooperativas",
        criteriaType: "type",
        searchKey: groupTypes.cooperative,
        farmerType: farmerTypes.group,
        focusedOption: 1,
    },
    {
        criteriaName: "Associações",
        criteriaType: "type",
        searchKey: groupTypes.association,
        farmerType: farmerTypes.group,
        focusedOption: 2,
    },
    {
        criteriaName: "Grupos de Produtores",
        criteriaType: "type",
        searchKey: groupTypes.farmerGroup,
        farmerType: farmerTypes.group,
        focusedOption: 3,
    },
    {
        criteriaName: "Pendentes",
        criteriaType: "status",
        searchKey: resourceValidation.status.pending,
        farmerType: farmerTypes.group,
        focusedOption: 4,
    },
    {
        criteriaName: "Validados",
        criteriaType: "status",
        searchKey: resourceValidation.status.validated,
        farmerType: farmerTypes.group,
        focusedOption: 5,
    },
    {
        criteriaName: "Privados",
        criteriaType: "private",
        searchKey: true,
        farmerType: farmerTypes.institution,
        focusedOption: 1,
    },
    {
        criteriaName: "Públicos",
        criteriaType: "private",
        searchKey: false,
        farmerType: farmerTypes.institution,
        focusedOption: 2,
    },
    {
        criteriaName: "Pendentes",
        criteriaType: "status",
        farmerType: farmerTypes.institution,
        searchKey: resourceValidation.status.pending,
        focusedOption: 4,
    },
    {
        criteriaName: "Validados",
        criteriaType: "status",
        searchKey: resourceValidation.status.validated,
        farmerType: farmerTypes.institution,
        focusedOption: 5,
    },
];
