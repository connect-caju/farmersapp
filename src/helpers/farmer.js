        const farmer = {
            _id: uuidv4(), // unique id
            names: {
                surname: farmerData.names?.surname,
                otherNames: farmerData.names?.otherNames,
            },
            ufid: 
            generateUUID({
                surname: generateFormattedSurname(farmerData.names?.surname),
                birthDate: generateFormattedDate(farmerData.birthDate),
                birthAdminPost: generateFormattedAdminPost(farmerData.birthPlace?.birthAdminPost),
            }),
            isSprayingAgent: farmerData?.isSprayingAgent,
            gender: farmerData.gender,
            birthDate: new Date(farmerData.birthDate),
            address: {
                province: farmerData.address?.province,
                district: farmerData.address?.district,
                adminPost: farmerData.address?.adminPost,
                village: farmerData.address?.village,
            },
            birthPlace: {
                province: farmerData.birthPlace?.province,
                district: farmerData.birthPlace?.district,
                adminPost: farmerData.birthPlace?.adminPost,
                village: farmerData.birthPlace?.village,
            },
            contact: {
                primaryPhone: farmerData.contact?.primaryPhone,
                secondaryPhone: farmerData.contact?.secondaryPhone,
            },
            idDocument: {
                docType: farmerData.idDocument?.docType,
                docNumber: farmerData.idDocument?.docNumber,
                nuit: farmerData.idDocument?.nuit,
            }        
        }