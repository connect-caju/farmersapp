import { roles } from "../consts/roles";
import { capitalize } from "./capitalize";
import BcryptReactNative from "bcrypt-react-native"; 


const validateUserData = async (
    {   
        name, 
        email, 
        password, 
        passwordConfirm, 
        phone,
        role,
        userDistrict,
        userProvince,
        coop,  
    }, errors, setErrors,
    ) => {

    const retrievedName = capitalize(name?.trim());
    const retrievedEmail = email.trim();
    const retrievedPassword = password?.trim();
    const retrievedPasswordConfirm = passwordConfirm?.trim();
    const retrievedRole = role?.trim();
    const retrievedPhone = phone?.trim();
    const retrievedUserDistrict = userDistrict?.trim();
    const retrievedUserProvince = userProvince?.trim();
    const retrievedCoop = coop?.trim();

      
        
        if ((!retrievedName) || (retrievedName?.split(' ')?.length <= 1)) {
            setErrors({ ...errors,
                name: 'Nome não completo.'
            });
            return false;
        } 

        if (!retrievedEmail || !retrievedEmail?.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
            setErrors({ ...errors,
                email: 'Endereço electrónico inválido.'
            });
            return false;
        }

        if (!(retrievedPassword.includes(retrievedPasswordConfirm) && retrievedPasswordConfirm.includes(retrievedPassword))) {
            setErrors({ ...errors,
                password: 'Senhas não iguais.',
                passwordConfirm: 'Senhas não iguais.'
            });
            return false;
        }
        else if (retrievedPassword?.length < 6) {
            setErrors({ ...errors,
                password: 'Pelo menos 6 caracteres.',
            });
            return false;
        }

        if (!retrievedPhone || retrievedPhone === 0) {
            setErrors({ ...errors,
                phone: 'Número de telefone.',
            });
            return false;            
        }
        else if ( retrievedPhone &&
            (!Number.isInteger(parseInt(retrievedPhone))  || 
            retrievedPhone?.toString().length !== 9       ||
            parseInt(retrievedPhone.toString()[0]) !== 8 ||
            [2,3,4,5,6,7].indexOf(parseInt(retrievedPhone?.toString()[1])) < 0)
            ) {      
            setErrors({ ...errors,
                phone: 'Número de telefone inválido.',
            });
            return false;                   
        }

        if (!retrievedUserProvince) {
             setErrors({ ...errors,
                userProvince: 'Indica a província',
            });
            return false;                
        }

        if (!retrievedUserDistrict && !retrievedRole.includes(roles.provincialManager)) {
             setErrors({ ...errors,
                userDistrict: 'Indica o distrito',
            });
            return false;               
        }

        if (!retrievedCoop && retrievedRole?.includes('AMPCM') && retrievedUserDistrict) {
            setErrors({
                ...errors, 
                coop: 'Indica a sua cooperativa',
            });
            return false;
        }

        let hashedPassword = retrievedPassword;

        try {
            const salt = await BcryptReactNative.getSalt(10);
            hashedPassword= await BcryptReactNative.hash(salt, retrievedPassword);

            
        } catch (error) {
            console.log("Could not encrypt password:", { cause: error })
        }

        return {
            name: retrievedName,
            email: retrievedEmail,
            password: hashedPassword,
            phone: retrievedPhone ? parseInt(retrievedPhone) : 0,
            role: retrievedRole,
            userProvince: retrievedUserProvince,
            userDistrict: retrievedUserDistrict ? retrievedUserDistrict : 'NA',
            coop: retrievedCoop ? retrievedCoop : '',
        };     
};

export default validateUserData;