import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";




const validateInstitutionFarmerData = (
    {   
        isInstitutionPrivate,
        isInstitutionPublic,
        institutionType, 
        institutionName, 
        institutionAdminPost,
        institutionVillage,
        institutionProvince,
        institutionDistrict,
        institutionManagerName,
        institutionManagerPhone,
        institutionNuit,  
        isPrivateInstitution,
        institutionLicence,
    }, errors, setErrors,
    ) => {
    const retrievedIsInstitutionPrivate = isInstitutionPrivate;
    const retrievedIsInstitutionPublic = isInstitutionPublic;
    const retrievedInstitutionType = institutionType?.trim(); 
    const retrievedInstitutionName = capitalize(institutionName?.trim());
    const retrievedInstitutionAdminPost = institutionAdminPost?.trim();
    const retrievedInstitutionVillage = institutionVillage?.trim();
    const retrievedInstitutionProvince = institutionProvince?.trim();
    const retrievedInstitutionDistrict = institutionDistrict?.trim();
    const retrievedInstitutionManagerName = capitalize(institutionManagerName?.trim());
    const retrievedInstitutionManagerPhone = Number(parseInt(institutionManagerPhone)) ? Number(parseInt(institutionManagerPhone)) : 0;
    const retrievedInstitutionNuit = institutionNuit; 
    const retrievedIsPrivateInstitution = isPrivateInstitution;
    const retrievedInstitutionLicence = institutionLicence?.trim();   

    const asset = {
        category: categories.institution.category,
        subcategory: categories.institution.subcategories.production,
        assetType: assetTypes.farmland,
    }

    if ((!retrievedIsInstitutionPrivate && !retrievedIsInstitutionPublic) || (retrievedIsInstitutionPrivate && retrievedIsInstitutionPublic) ) {
        setErrors({
            ...errors,
            isPrivateInstitution: 'Indica tipo da instituição.'
        });

        return false;
    }


    if (!retrievedInstitutionType){
        setErrors({ ...errors,
            institutionType: 'Indica tipo de instituição .',
        });
        return false;
    }

    if (!retrievedInstitutionName){
        setErrors({ ...errors,
            institutionName: 'Indica nome da instituição.',
        });
        return false;
    }

    if (!retrievedInstitutionAdminPost){
        setErrors({ ...errors,
            institutionAdminPost: 'Indica Posto Administrativo.',
        });
        return false;
    }

    if ((!retrievedInstitutionManagerName) || (retrievedInstitutionManagerName?.split(' ').length <= 1)){
        setErrors({ ...errors,
            institutionManagerName: 'Indica nome completo',
        });
        return false;
    }

    if (retrievedInstitutionManagerPhone !== 0 && (
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

    const farmerData = {
        private: retrievedIsInstitutionPrivate ? true : false,
        type: retrievedInstitutionType, 
        name: retrievedInstitutionName,
        isPrivate: retrievedIsPrivateInstitution,
        assets: [asset],
        address: {
            province: retrievedInstitutionProvince,
            district: retrievedInstitutionDistrict,
            adminPost: retrievedInstitutionAdminPost,
            village: retrievedInstitutionVillage,
        },
        manager: {
            fullname: retrievedInstitutionManagerName,
            phone: retrievedInstitutionManagerPhone ? parseInt(retrievedInstitutionManagerPhone): 0,
        },
        nuit: retrievedInstitutionNuit ? parseInt(retrievedInstitutionNuit): 0,
        licence: retrievedInstitutionLicence ? retrievedInstitutionLicence : '',
    }
        
        return farmerData;

};

export default validateInstitutionFarmerData;