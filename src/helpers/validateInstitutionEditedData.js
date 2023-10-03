

import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
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



const validateInstitutionEditedData = (
    {   

        institutionNuit, oldInstitutionNuit,
        institutionLicence, oldInstitutionLicence,
        institutionManagerName, oldInstitutionManagerName,
        institutionManagerPhone, oldInstitutionManagerPhone,
    }, errors, setErrors, dataToBeUpdated, resourceName,
    ) => {


    // sanitizing recieved data
    if (dataToBeUpdated === 'institutionManager' && resourceName === 'Institution') {

        const retrievedInstitutionManagerName = institutionManagerName ? capitalize(institutionManagerName?.trim()) : '';
        const retrievedInstitutionManagerPhone = institutionManagerPhone ? Number(parseInt(institutionManagerPhone)) : 0;

        const retrievedOldInstitutionManagerName = oldInstitutionManagerName ? capitalize(oldInstitutionManagerName?.trim()) : '';
        const retrievedOldInstitutionManagerPhone = oldInstitutionManagerPhone ? Number(parseInt(oldInstitutionManagerPhone)) : 0;

        if ((retrievedInstitutionManagerName === retrievedOldInstitutionManagerName) 
            &&
            (retrievedInstitutionManagerPhone === retrievedOldInstitutionManagerPhone)
        ){
            setErrors({
                ...errors,
                institutionManagerName: 'O nome do responsável actual não deve ser igual ao do anterior.',
                institutionManagerPhone: 'O Número de telefone actual não deve ser igual ao anterior.'
            });
            return false;
        }

        if (!retrievedInstitutionManagerName && retrievedOldInstitutionManagerName) {
            setErrors({
                ...errors,
                institutionManagerName: 'Indica um novo nome ou mantenha o anterior.'
            });
            return false;
        } 

        if (!retrievedInstitutionManagerPhone && retrievedOldInstitutionManagerPhone) {
            setErrors({
                ...errors,
                institutionManagerPhone: 'Indica um novo número ou mantenha o anterior.'
            });
            return false;
        } 

        if ( retrievedInstitutionManagerPhone && (
            !Number.isInteger(parseInt(retrievedInstitutionManagerPhone))  || 
            retrievedInstitutionManagerPhone?.toString().length !== 9       ||
            parseInt(retrievedInstitutionManagerPhone.toString()[0]) !== 8 ||
            [2,3,4,5,6,7].indexOf(parseInt(retrievedInstitutionManagerPhone?.toString()[1])) < 0 )
            ) {      
            setErrors({ ...errors,
                institutionManagerPhone: 'Número de telefone inválido.',
            });
            return false;                   
        }

        return {
            fullname: retrievedInstitutionManagerName,
            phone: retrievedInstitutionManagerPhone,
        };
    
    }





    if ( dataToBeUpdated === 'institutionDocument' && resourceName === 'Institution') {

      const retrievedInstitutionNuit = institutionNuit ?  Number(parseInt(institutionNuit)) : 0;
      const retrievedInstitutionLicence = institutionLicence ? institutionLicence?.trim(): '';

      const retrievedOldInstitutionNuit = oldInstitutionNuit ? Number(parseInt(oldInstitutionNuit)) : 0;
      const retrievedOldInstitutionLicence = oldInstitutionLicence ? oldInstitutionLicence.trim() : '';

      if (
       (retrievedInstitutionNuit === retrievedOldInstitutionNuit) 
       &&
       (retrievedInstitutionLicence === retrievedOldInstitutionLicence)
      
      ) {
       setErrors({
        ...errors,
        institutionNuit: 'O NUIT actual não deve ser igual ao anterior',
        institutionLicence: 'O alvará actual não deve se igual ao anterior',
       });

       return false;
      }

    if (retrievedInstitutionNuit &&
        (
        !Number.isInteger(parseInt(retrievedInstitutionNuit))  || 
        retrievedInstitutionNuit?.toString().length !== 9   
         || containsNonNumeric(retrievedInstitutionNuit))
        ){
        setErrors({ ...errors,
            institutionNuit: 'NUIT inválido.',
        });
        return false;
    }

      if (!retrievedInstitutionNuit && retrievedOldInstitutionNuit) {
        setErrors({
            ...errors,
            institutionNuit: 'Indica um novo NUIT ou mantenha o anterior.'
        });
        return falase;
      }


      if (!retrievedInstitutionLicence && retrievedOldInstitutionLicence) {
        setErrors({
            ...errors,
            institutionNuit: 'Indica um novo alvará ou mantenha o anterior.'
        });
        return falase;
      }

      if (retrievedInstitutionNuit &&
        (
        !Number.isInteger(parseInt(retrievedInstitutionNuit))  || 
        retrievedInstitutionNuit?.toString().length !== 9   
        )
        ){
        setErrors({ ...errors,
            institutionNuit: 'NUIT inválido.',
        });
        return false;
    }

    return {
           nuit: retrievedInstitutionNuit ? retrievedInstitutionNuit : 0, 
           licence: retrievedInstitutionLicence ? retrievedInstitutionLicence : '', 
       }
      
      
     }

    //  if ( dataToBeUpdated === 'idDocument' && resourceName == 'Farmer') {
    //   const retrievedDocType = docType;
    //   const retrievedDocNumber = docNumber;
    //   const retrievedNuit = nuit; 

    //   const retrievedOldDocType = oldDocType;
    //   const retrievedOldDocNumber = oldDocNumber;
    //   const retrievedOldNuit = oldNuit; 

    //   if(
    //    (retrievedDocType === retrievedOldDocType) 
    //    &&
    //    (retrievedDocNumber === retrievedOldDocNumber)
    //    &&
    //    (retrievedNuit === retrievedOldNuit)
    //   )
    //   {
    //    setErrors({
    //     ...errors,
    //     docType: 'Os documentos actuais não devem ser iguais aos anteriores.',
    //     docNumber: 'Os documentos actuais não devem ser iguais aos anteriores.',
    //     nuit: 'Os documentos actuais não devem ser iguais aos anteriores.',
    //    });
    //    return false;
    //   }


    //   if (retrievedDocNumber && !retrievedDocType){
    //       setErrors({ ...errors,
    //           docType: 'Tipo de documento do produtor.',
    //       });
    //       return false;
    //   }
    //   else if (!retrievedDocNumber && retrievedDocType !== 'Não tem'){
    //       setErrors({ ...errors,
    //           docType: 'Número de documento do produtor.',
    //       });
    //       return false;        
    //   }
  
      
   
      
    //  }




};

export default validateInstitutionEditedData;