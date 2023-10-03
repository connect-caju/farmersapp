

import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { groupAffiliationStatus } from "../consts/groupAffiliationStatus";
import { containsNonNumeric } from "./containsNonNumeric";

/**
 * 
 * @param {*} farmerData 
 * @param {*} errors 
 * @param {*} setErrors 
 * @returns false if invalid data found, farmerdata if no invalid data found
 * 
 * This function sanitizes, and validates all the farmer data before they
 * are persisted. 
 * Invalid data trigger errorMessages to the respective input component
 * in the form.
 */

const validateGroupEditedData = (
    {   

        groupName, groupType, groupGoals,
        oldGroupName, oldGroupType, oldGroupGoals,

        groupAffiliationYear, groupCreationYear,
        groupLegalStatus, groupOperatingLicence,
        oldGroupAffiliationYear, oldGroupCreationYear,
        oldGroupLegalStatus, oldGroupOperatingLicence, 
        groupNuit, oldGroupNuit,

        isGroupActive, isGroupInactive, isOldGroupActive,
        isOldGroupInactive, groupMembersNumber, oldGroupMembersNumber,
        groupWomenNumber, oldGroupWomenNumber,
        // groupManagerName, oldGroupManagerName,
        // groupManagerPhone, oldGroupManagerPhone,
    }, errors, setErrors, dataToBeUpdated, resourceName,
    ) => {
    if (dataToBeUpdated === 'groupType' && resourceName === 'Group') {
        const retrievedGroupType = groupType ? groupType?.trim() : '';
        const retrievedGroupName = groupName ? groupName?.trim() : '';
        const retrievedGroupGoals = groupGoals?.length > 0 ? groupGoals : [];
        
        const retrievedOldGroupType =  oldGroupType ? oldGroupType?.trim() : '';
        const retrievedOldGroupName = oldGroupName ? oldGroupName?.trim() : '';
        const retrievedOldGroupGoals = oldGroupGoals?.length > 0 ? oldGroupGoals : [];

        if (
            (retrievedGroupType === retrievedOldGroupType)
            &&
            (retrievedGroupName === retrievedOldGroupName)
            &&
            (
                (retrievedGroupGoals?.length === retrievedOldGroupGoals?.length)
                &&
                (retrievedGroupGoals.every((el, index) => el === retrievedOldGroupGoals[index]))
            )
        ){
            setErrors({
                ...errors,
                groupType: 'O tipo do grupo actual não deve ser igual ao anterior.',
                groupName: 'O nome do grupo actual não deve ser igual ao anterior.',
                groupGoals: 'A  finalidade do grupo actual não deve ser igual à anterior.'
            });
            return false;
        }

        if (!retrievedGroupType){
            setErrors({ ...errors,
                groupType: 'Indica tipo de grupo.',
            });
            return false;
        }
    
        if (!retrievedGroupName){
            setErrors({ ...errors,
                groupName: 'Indica nome de grupo.',
            });
            return false;
        }
    

        if (retrievedGroupGoals?.length === 0){
            setErrors({
                ...errors,
                groupGoals: 'Indica a finalidade do grupo.'
            });
            return false;
        }

        return {
            name: retrievedGroupName,
            type: retrievedGroupType,
            goals: retrievedGroupGoals,
        }
    
    }

    if (dataToBeUpdated === 'groupIdentity' && resourceName === 'Group') {

        const retrievedGroupAffiliationYear = groupAffiliationYear ? Number(parseInt(groupAffiliationYear)) : 0;
        const retrievedGroupLegalStatus = groupLegalStatus?.trim();
        const retrievedGroupNuit = groupNuit ? Number(parseInt(groupNuit)) : 0 ;
        const retrievedGroupCreationYear = groupCreationYear ? Number(parseInt(groupCreationYear)) : 0;
        const retrievedGroupOperatingLicence = groupOperatingLicence.trim(); 

        const retrievedOldGroupAffiliationYear = oldGroupAffiliationYear ? Number(parseInt(oldGroupAffiliationYear)) : 0;
        const retrievedOldGroupLegalStatus = oldGroupLegalStatus?.trim();
        const retrievedOldGroupNuit = oldGroupNuit ? Number(parseInt(oldGroupNuit)) : 0;
        const retrievedOldGroupCreationYear = oldGroupCreationYear ? Number(parseInt(oldGroupCreationYear)) : 0;
        const retrievedOldGroupOperatingLicence = oldGroupOperatingLicence?.trim(); 
        
        if (
            (retrievedGroupAffiliationYear === retrievedOldGroupAffiliationYear)
            &&
            (retrievedGroupLegalStatus === retrievedOldGroupLegalStatus)
            &&
            (retrievedGroupNuit === retrievedOldGroupNuit)
            &&
            (retrievedGroupCreationYear === retrievedOldGroupCreationYear)
            &&
            (retrievedGroupOperatingLicence === retrievedOldGroupOperatingLicence)
        ){
            setErrors({
                ...errors,
                groupLegalStatus: 'A situação legal actual não deve ser igual à anterior.',
                groupAffiliationYear: 'O ano de legalização actual não deve ser igual ao anterior.',
                groupCreationYear: 'O ano de criação actual não deve ser igual ao anterior.',
                groupNuit: 'O NUIT actual não deve ser igual ao anterior.',
                groupOperatingLicence: 'O alvará actual não deve ser igual ao anterior.'

            });

            return false;
        }

        if (!retrievedGroupLegalStatus) {
            setErrors({
                ...errors, 
                groupLegalStatus: 'Indica a situação Legal'
            });
            return false;
        }

        if (!retrievedGroupCreationYear){
            setErrors({ ...errors,
                groupCreationYear: 'Indica ano de criação.',
            });
            return false;
        }
    

        if (retrievedGroupLegalStatus === groupAffiliationStatus.affiliated){
            if (!retrievedGroupAffiliationYear){
                setErrors({
                    ...errors,
                    groupAffiliationYear: 'Indica ano de legalização.'
                });
    
                return false;
            }
    
            if (retrievedGroupCreationYear > retrievedGroupAffiliationYear) {
                setErrors({
                    ...errors,
                    groupCreationYear: 'Ano de criação posterior ao ano de legalização',
                    // groupAffiYear: 'Ano de criação superior a ano de legalização'
                });
    
                return false;
            }
    
            if (!retrievedGroupOperatingLicence) {
                setErrors({
                    ...errors,
                    groupOperatingLicence: 'Indica o alvará.'
                });
                return false;
            }
    
            if (!retrievedGroupNuit) {
                setErrors({
                    ...errors,
                    groupNuit: 'Indica o NUIT.'
                });
                return false;
            }
        }

        if (retrievedGroupNuit &&
            (
            !Number.isInteger(parseInt(retrievedGroupNuit))  || 
            retrievedGroupNuit?.toString().length !== 9   
             || containsNonNumeric(retrievedGroupNuit))
            ){
            setErrors({ ...errors,
                groupNuit: 'NUIT inválido.',
            });
            return false;
        }
    
        return {
            legalStatus: retrievedGroupLegalStatus,
            creationYear: retrievedGroupCreationYear,
            affiliationYear: retrievedGroupAffiliationYear,
            licence: retrievedGroupOperatingLicence,
            nuit: retrievedGroupNuit,
        }

    }


    if(dataToBeUpdated === 'groupMembers' && resourceName === 'Group') {
        const retrievedIsGroupActive = isGroupActive ? Boolean(isGroupActive): false;
        const retrievedIsGroupInactive = isGroupInactive ? Boolean(isGroupInactive) : false;
        const retrievedIsOldGroupActive = isOldGroupActive ? Boolean(isOldGroupActive) : isOldGroupActive;
        const retrievedIsOldGroupInactive = isOldGroupInactive ? Boolean(isOldGroupInactive) : isOldGroupInactive;

        const retrievedGroupMembersNumber = groupMembersNumber ? Number(parseInt(groupMembersNumber)) : 0;
        const retrievedGroupWomenNumber = groupWomenNumber ? Number(parseInt(groupWomenNumber)) : 0;

        const retrievedOldGroupMembersNumber = oldGroupMembersNumber ? Number(parseInt(oldGroupMembersNumber)) : 0;
        const retrievedOldGroupWomenNumber = oldGroupWomenNumber ? Number(parseInt(oldGroupWomenNumber)) : 0;
    
        if (
            (retrievedIsGroupActive?.toString() === retrievedIsOldGroupActive?.toString())
            &&
            (retrievedIsGroupInactive?.toString() === retrievedIsOldGroupInactive?.toString())
            && 
            (retrievedGroupMembersNumber === retrievedOldGroupMembersNumber)
            &&
            (retrievedGroupWomenNumber === retrievedOldGroupWomenNumber) 
        ){
            setErrors({
                ...errors,
                operationalStatus: 'O estado de funciomento actual não deve ser igual ao do anterior.',
                groupWomenNumber: 'O total das mulheres actual não deve ser igual ao anterior.',
                groupMembersNumber: 'O total dos membros actual não deve ser igual ao do anterior.',
            });
            return false;
        };

        if (!retrievedGroupMembersNumber && retrievedGroupMembersNumber !== 0){
            setErrors({ ...errors,
                groupMembersNumber: 'Número total de membros.',
            });
            return false;
        }

        if (!retrievedGroupWomenNumber && retrievedGroupWomenNumber !== 0){
            setErrors({ ...errors,
                groupWomenNumber: 'Número total de mulheres.',
            });
            return false;
        }
        else if (parseInt(retrievedGroupWomenNumber) > parseInt(retrievedGroupMembersNumber)) {
            setErrors({ ...errors,
                groupWomenNumber: 'Número de mulheres superior ao total.',
            });
            return false;        
        }


        return {
            operationalStatus: retrievedIsGroupActive ? retrievedIsGroupActive : false,
            // isGroupInactive: retrievedIsGroupInactive,
            total: retrievedGroupMembersNumber,
            women: retrievedGroupWomenNumber,
        }

    }

    // sanitizing recieved data
    // if (dataToBeUpdated === 'groupManager' && resourceName === 'Group') {

    //     const retrievedGroupManagerName = groupManagerName ? capitalize(groupManagerName?.trim()) : '';
    //     const retrievedGroupManagerPhone = groupManagerPhone ? Number(parseInt(groupManagerPhone)) : 0;

    //     const retrievedOldGroupManagerName = oldGroupManagerName ? capitalize(oldGroupManagerName?.trim()) : '';
    //     const retrievedOldGroupManagerPhone = oldGroupManagerPhone ? Number(parseInt(oldGroupManagerPhone)) : 0;

    //     if ((retrievedGroupManagerName === retrievedOldGroupManagerName) 
    //         &&
    //         (retrievedGroupManagerPhone === retrievedOldGroupManagerPhone)
    //     ){
    //         setErrors({
    //             ...errors,
    //             groupManagerName: 'O nome do responsável actual não deve ser igual ao do anterior.',
    //             groupManagerPhone: 'O Número de telefone actual não deve ser igual ao anterior.'
    //         });
    //         return false;
    //     }

    //     if (!retrievedGroupManagerName && retrievedOldGroupManagerName) {
    //         setErrors({
    //             ...errors,
    //             groupManagerName: 'Indica um novo nome ou mantenha o anterior.'
    //         });
    //         return false;
    //     } 

    //     if (!retrievedGroupManagerPhone && retrievedOldGroupManagerPhone) {
    //         setErrors({
    //             ...errors,
    //             groupManagerPhone: 'Indica um novo número ou mantenha o anterior.'
    //         });
    //         return false;
    //     } 

    //     if ( retrievedGroupManagerPhone && (
    //         !Number.isInteger(parseInt(retrievedGroupManagerPhone))  || 
    //         retrievedGroupManagerPhone?.toString().length !== 9       ||
    //         parseInt(retrievedGroupManagerPhone.toString()[0]) !== 8 ||
    //         [2,3,4,5,6,7].indexOf(parseInt(retrievedGroupManagerPhone?.toString()[1])) < 0 )
    //         ) {      
    //         setErrors({ ...errors,
    //             groupManagerPhone: 'Número de telefone inválido.',
    //         });
    //         return false;                   
    //     }

    //     return {
    //         fullname: retrievedGroupManagerName,
    //         phone: retrievedGroupManagerPhone,
    //     };
    
    // }




};

export default validateGroupEditedData;