import { containsNonNumeric } from "./containsNonNumeric";

const validateFarmerData = (
    {   surname, 
        otherNames, 
        isSprayingAgent,
        isNotSprayingAgent,
        birthDate, 
        gender, 
        birthProvince,
        birthDistrict,
        birthAdminPost,
        birthVillage,
        // addressProvince,
        // addressDistrict,
        addressAdminPost,
        addressVillage,
        primaryPhone,
        secondaryPhone,
        docType, docNumber, nuit,  
    }, errors, setErrors,
    ) => {
    const retrievedSurname = surname?.trim(); 
    const retrievedOtherNames = otherNames?.trim();
    const retrievedBirthDate = birthDate;
    const retrievedGender = gender;
    const retrievedBirthProvince = birthProvince?.trim();
    const retrievedBirthDistrict = birthDistrict?.trim();
    const retrievedBirthAdminPost = birthAdminPost?.trim();
    const retrievedBirthVillage = birthVillage?.trim();
    // const retrievedAddressProvince = addressProvince?.trim();
    // const retrievedAddressDistrict = addressDistrict?.trim();
    const retrievedAddressAdminPost = addressAdminPost?.trim();
    const retrievedAddressVillage = addressVillage?.trim();
    const retrievedPrimaryPhone = primaryPhone;
    const retrievedSecondaryPhone = secondaryPhone;
    const retrievedDocType = docType;
    const retrievedDocNumber = docNumber;
    const retrievedNuit = nuit; 
    const retrievedIsSprayingAgent = Boolean(isSprayingAgent);
    const retrievedIsNotSprayingAgent = Boolean(isNotSprayingAgent);

    if (!retrievedIsSprayingAgent && !retrievedIsNotSprayingAgent) {
        setErrors({
            ...errors,
            isSprayingAgent: 'Indica se é ou não Provedor de Serviços de Pulverização'
        });
        return false;
    }
       
    if (!retrievedSurname){
        setErrors({ ...errors,
            surname: 'Apelido do produtor.',
        });
        return false;
    }
    else if (retrievedSurname?.split(' ').length > 1) { 
        setErrors({ ...errors,
            surname: 'Apenas 1 nome como apelido.',
        });
        return false;
    }

    if (!retrievedOtherNames){
        setErrors({ ...errors,
            otherNames: 'Outros nomes do produtor.',
        });
        return false;
    }

    if (!retrievedGender){
        setErrors({ ...errors,
            gender: 'Género do produtor.',
        });
        return false;
    }

    if (!retrievedBirthDate){
        setErrors({ ...errors,
            birthDate: 'Data de nascimento.',
        });
        return false;
    }

    if (!retrievedAddressAdminPost){
        setErrors({ ...errors,
            addressAdminPost: 'Posto Administrativo onde o produtor reside.',
        });
        return false;
    }

    if ( retrievedPrimaryPhone && (
        !Number.isInteger(parseInt(retrievedPrimaryPhone))  || 
        retrievedPrimaryPhone?.toString().length !== 9       ||
        parseInt(retrievedPrimaryPhone.toString()[0]) !== 8 ||
        [2,3,4,5,6,7].indexOf(parseInt(retrievedPrimaryPhone?.toString()[1])) < 0 )
        ) {      
        setErrors({ ...errors,
            primaryPhone: 'Número de telefone inválido.',
        });
        return false;                   
    }

    if (retrievedSecondaryPhone && 
        (
        !Number.isInteger(parseInt(retrievedSecondaryPhone))  || 
        retrievedSecondaryPhone?.toString().length !== 9       ||
        parseInt(retrievedSecondaryPhone?.toString()[0]) !== 8 ||
        [2,3,4,5,6,7].indexOf(parseInt(retrievedSecondaryPhone?.toString()[1])) < 0   
        )
    ){
        setErrors({ ...errors,
            secondaryPhone: 'Número de telefone inválido.',
        });
        return false;               
    }
    if (!retrievedBirthProvince){
        setErrors({ ...errors,
            birthProvince: 'Província onde o produtor nasceu.',
        });
        return false;
    }

    if (!retrievedBirthDistrict && !retrievedBirthProvince?.includes('Cidade')){
        const errorMessage = 
            (birthProvince === "País Estrangeiro") 
            ? "Indica país onde nasceu."
            : "Indica distrito onde nasceu!"

        setErrors({ ...errors,
            birthDistrict: errorMessage,
        });
        return false;
    }

    if (!retrievedBirthAdminPost && !retrievedBirthProvince?.includes('Cidade') && birthProvince !== "País Estrangeiro"){
        setErrors({ ...errors,
            birthAdminPost: 'Posto Administrativo onde nasceu.',
        });
        return false;
    }


    if (retrievedDocNumber && !retrievedDocType){
        setErrors({ ...errors,
            docType: 'Tipo de documento do produtor.',
        });
        return false;
    }
    else if (!retrievedDocNumber && retrievedDocType){
        setErrors({ ...errors,
            docType: 'Número de documento do produtor.',
        });
        return false;        
    }

    if (retrievedNuit &&
        (
        !Number.isInteger(parseInt(retrievedNuit))  || 
        retrievedNuit?.toString().length !== 9   
        ) || containsNonNumeric(retrievedNuit)
        ){
        setErrors({ ...errors,
            nuit: 'NUIT inválido.',
        });
        return false;
    }

    const farmerData = {
        names: {
            surname: retrievedSurname,   
            otherNames: retrievedOtherNames, 
        }, 
        birthDate: retrievedBirthDate, 
        gender: retrievedGender,
        birthPlace: {
            province: retrievedBirthProvince,
            district: retrievedBirthDistrict,
            adminPost: retrievedBirthAdminPost,
            village: retrievedBirthVillage,
        },
        address: {
            province: "retrievedAddressProvince",
            district: "retrievedAddressDistrict",
            adminPost: retrievedAddressAdminPost,
            village: retrievedAddressVillage,
        },
        contact: {
            primaryPhone: retrievedPrimaryPhone ? parseInt(retrievedPrimaryPhone): 0, 
            secondaryPhone: retrievedSecondaryPhone ? parseInt(retrievedSecondaryPhone): 0,
        },
        idDocument: {
            docType: retrievedDocType ? retrievedDocType : 'NA', 
            docNumber: retrievedDocNumber ? retrievedDocNumber : 'NA', 
            nuit: retrievedNuit ? parseInt(retrievedNuit) : 0,
        }
    }
        
        return farmerData;

};

export default validateFarmerData;