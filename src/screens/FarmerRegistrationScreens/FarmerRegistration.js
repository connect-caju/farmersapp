/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Text, SafeAreaView, ScrollView, TextInput, View, Pressable } from 'react-native';
import React, {useState, useEffect, useCallback } from 'react';
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio,  } from 'native-base';
import { Icon, Button, CheckBox } from '@rneui/themed';
import AwesomeAlert from 'react-native-awesome-alerts';
import {  
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol } 
        from 'react-native-responsive-screen';
  
  import { 
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    useDimensionsChange,
  
  } from 'react-native-responsive-dimensions';
import { KeyboardAwareScrollView, useMaskedTextInput } from 'react-native-keyboard-tools';

import administrativePosts from '../../consts/administrativePosts';
import styles from './styles';
import IndividualModal from '../../components/Modals/IndividualModal'
import { fullYears, getFullYears, localeDateService, useDatepickerState } from '../../helpers/dates';
import CustomActivityIndicator from '../../components/ActivityIndicator/CustomActivityIndicator';
import validateIndividualFarmerData from '../../helpers/validateIndividualFarmerData';
import validateInstitutionFarmerData from '../../helpers/validateInstitutionFarmerData';
import validateGroupFarmerData from '../../helpers/validateGroupFarmerData';
import TickComponent from '../../components/LottieComponents/TickComponent';
import GroupModal from '../../components/Modals/GroupModal';
import InstitutionModal from '../../components/Modals/InstitutionModal';

import { generateUAID } from '../../helpers/generateUAID';
import DuplicatesAlert from '../../components/Alerts/DuplicatesAlert';
import { detectDuplicates } from '../../helpers/detectDuplicates';
import FarmerTypeRadioButtons from '../../components/RadioButton/FarmerTypeRadioButtons';
import SuccessAlert from '../../components/Alerts/SuccessAlert';


import IndividualFarmerForm from './IndividualFarmerForm';
import InstitutionFarmerForm from './InstitutionFarmerForm';
import GroupFarmerForm from './GroupFarmerForm';
import COLORS from '../../consts/colors';


import { realmContext } from '../../models/realmContext';
import { generateUniqueNumber } from '../../helpers/generateUniqueNumber';
const {useRealm} = realmContext;


export default function FarmerRegistration({ route, navigation }) {
    const [gender, setGender] = useState('');
    const [familySize, setFamilySize] = useState('');

    // address
    const [selectedAddressAdminPosts, setSelectedAddressAdminPosts] = useState([]);
    const [addressAdminPost, setAddressAdminPost] = useState('');
    const [addressVillage, setAddressVillage] = useState('');

    // birth place
    const [birthProvince, setBirthProvince] = useState('');
    const [birthDistrict, setBirthDistrict] = useState('');
    const [birthAdminPost, setBirthAdminPost] = useState('');

    // handle modal view
    const [modalVisible, setModalVisible] = useState(false);
    const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

    const [errorAlert, setErrorAlert] = useState(false);
    // const [duplicatesAlert, setDuplicatesAlert] = useState(false);

    const localePickerState = useDatepickerState();
    const [birthDate, setBirthDate] = useState(null);

    const [docType, setDocType] = useState('');
    const [docNumber, setDocNumber] = useState('');

    const [isSprayingAgent, setIsSprayingAgent] = useState(false);
    const [isNotSprayingAgent, setIsNotSprayingAgent] = useState(false);
    const [surname, setSurname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [primaryPhone, setPrimaryPhone] = useState(null);
    const [secondaryPhone, setSecondaryPhone] = useState(null);
    const [nuit, setNuit] = useState(null);
    const [isGroupMember, setIsGroupMember] = useState(false);
    const [isNotGroupMember, setIsNotGroupMember] = useState(false);

    const [errors, setErrors] = useState({});
    const [farmerData, setFarmerData] = useState({});

    const [farmerType, setFarmerType] = useState('')

    // Group states
    const [groupType, setGroupType] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupAdminPost, setGroupAdminPost] = useState('');
    const [groupVillage, setGroupVillage] = useState('');
    // const [groupManagerName, setGroupManagerName] = useState('');
    // const [groupManagerPhone, setGroupManagerPhone] = useState('');
    const [groupOperatingLicence, setGroupOperatingLicence] = useState('');
    const [groupNuit, setGroupNuit] = useState('');
    const [groupAffiliationYear, setGroupAffiliationYear] = useState('');
    const [groupMembersNumber, setGroupMembersNumber] = useState('');
    const [groupWomenNumber, setGroupWomenNumber] = useState('');
    const [groupGoals, setGroupGoals] = useState([]);
    const [groupCreationYear, setGroupCreationYear] = useState('');
    const [groupLegalStatus, setGroupLegalStatus] = useState('');
    const [isGroupActive, setIsGroupActive] = useState(false);
    const [isGroupInactive, setIsGroupInactive] = useState(false);


    // Instution states
    const [institutionType, setInstitutionType] = useState('');
    const [institutionName, setInstitutionName] = useState('');
    const [institutionManagerName, setInstitutionManagerName] = useState('');
    const [institutionManagerPhone, setInstitutionManagerPhone] = useState('');
    const [institutionAdminPost, setInstitutionAdminPost] = useState('');
    const [institutionVillage, setInstitutionVillage] = useState('');
    const [institutionNuit, setInstitutionNuit] = useState('')
    const [isPrivateInstitution, setIsPrivateInstitution] = useState(false);
    const [institutionLicence, setInstitutionLicence] = useState('');
    const [isInstitutionPublic, setIsInstitutionPublic] = useState(false);
    const [isInstitutionPrivate, setIsInstitutionPrivate] = useState(false);


    // -------------------------------------------------------------
    const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);
    const [loadinButton, setLoadingButton] = useState(false);
    const [isCoordinatesModalVisible, setIsCoordinatesModalVisible] = useState(false);


    // farmers suspected duplicates
    const [suspectedDuplicates, setSuspectedDuplicates] = useState([]);

    const [farmerItem, setFarmerItem] = useState({});

    const customUserData = route.params.customUserData;

    const realm = useRealm();

    const [actor, setActor] = useState();   
    const [actorCategory, setActorCategory] = useState();



    const addFarmer = (farmerType, realm, isAllowed=false)=>{
        let farmerData;
        let retrievedFarmerData;




        if (farmerType === "Indivíduo"){



            farmerData = {
               isSprayingAgent,
               isNotSprayingAgent,
               surname,   
               otherNames, 
               gender,
               familySize,
               birthDate, 
               birthProvince,
               birthDistrict,
               birthAdminPost,
               addressProvince : customUserData?.userProvince,
               addressDistrict: customUserData?.userDistrict,
               addressAdminPost,
               addressVillage,
               primaryPhone, 
               secondaryPhone,
               docType, 
               docNumber, 
               nuit,
               isGroupMember,
               isNotGroupMember,
           }
            if (!validateIndividualFarmerData(farmerData, errors, setErrors)) {
                setErrorAlert(true)
                return ;
            }
            retrievedFarmerData = validateIndividualFarmerData(farmerData, errors, setErrors);

            // generate actor identifier
            let identifier = generateUniqueNumber(retrievedFarmerData.address, 'Indivíduo');
            let foundIdentierMatches = realm.objects('Actor').filtered(`identifier == $0`, identifier);

            // keep checking until no match is found
            while (foundIdentierMatches?.length > 0){
                identifier = generateUniqueNumber(retrievedFarmerData.address, 'Indivíduo');
                foundIdentierMatches = realm.objects('Actor').filtered(`identifier == $0`, identifier);
            };

            retrievedFarmerData['identifier'] = identifier;

            setFarmerData(retrievedFarmerData);
            
            // not allowed if the user decided to proceed
            // on with registration after the alert on suspecious duplicates
            if (!isAllowed){

                const uaidData = {
                    names: retrievedFarmerData.names,
                    birthDate: retrievedFarmerData.birthDate,
                    birthPlace: retrievedFarmerData.birthPlace,
                    address: retrievedFarmerData.address,
                }

                // const otherNames = retrievedFarmerData.names.otherNames.substr(0, 2);
                // const username = retrievedFarmerData.names.surname.substr(0, 2);
                // const birthDate = retrievedFarmerData.birthDate;
                // const birthPlace = retrievedFarmerData.birthPlace;
                
                const uaid = generateUAID(uaidData);
                let suspected = realm.objects('Actor').filtered(`uaid == $0`, uaid);
                // let foundSuspects = realm.objects('Actor').filtered(`otherNames`)
                
                // get more evidence on the duplication attempt
                suspected = detectDuplicates(retrievedFarmerData, suspected);
                if (suspected.length > 0) {
                    setSuspectedDuplicates(suspected);
                    // setDuplicatesAlert(true);
                    setIsDuplicateModalVisible(true);
                    return ;
                }
            }



        }
        else if (farmerType === "Instituição"){
            farmerData = {
                isInstitutionPrivate,
                isInstitutionPublic,
                institutionType,
                institutionName,
                institutionAdminPost,
                institutionProvince : customUserData?.userProvince,
                institutionDistrict: customUserData?.userDistrict,
                institutionVillage,
                institutionManagerName,
                institutionManagerPhone,
                institutionNuit,
                isPrivateInstitution,
                institutionLicence,
            }
            if (!validateInstitutionFarmerData(farmerData, errors, setErrors)) {
                setErrorAlert(true)
                return ;
            }
            retrievedFarmerData = validateInstitutionFarmerData(farmerData, errors, setErrors);

            // generate actor identifier
            let identifier = generateUniqueNumber(retrievedFarmerData.address, 'Instituição');
            let foundIdentierMatches = realm.objects('Institution').filtered(`identifier == $0`, identifier);

            // keep checking until no match is found
            while (foundIdentierMatches?.length > 0){
                identifier = generateUniqueNumber(retrievedFarmerData.address, 'Instituição');
                foundIdentierMatches = realm.objects('Institution').filtered(`identifier == $0`, identifier);
            };

            retrievedFarmerData['identifier'] = identifier;

            setFarmerData(retrievedFarmerData);

            setFarmerData(retrievedFarmerData)
        }
        else if (farmerType === "Grupo") {
            farmerData = {
                isGroupActive,
                isGroupInactive,
                groupType,
                groupName,
                groupGoals,
                groupMembersNumber,
                groupWomenNumber,
                groupLegalStatus,
                groupCreationYear,
                groupAffiliationYear,
                groupOperatingLicence,
                groupNuit,
                groupProvince : customUserData?.userProvince,
                groupDistrict: customUserData?.userDistrict,
                groupAdminPost,
                groupVillage,
                // groupManagerName,
                // groupManagerPhone,
            }
            if (!validateGroupFarmerData(farmerData, errors, setErrors, farmerType)) {
                setErrorAlert(true)
                return ;
            }
            retrievedFarmerData = validateGroupFarmerData(farmerData, errors, setErrors, farmerType);

            // generate actor identifier
            let identifier = generateUniqueNumber(retrievedFarmerData.address, 'Grupo');
            let foundIdentierMatches = realm.objects('Group').filtered(`identifier == $0`, identifier);

            // keep checking until no match is found
            while (foundIdentierMatches?.length > 0){
                identifier = generateUniqueNumber(retrievedFarmerData.address, 'Grupo');
                foundIdentierMatches = realm.objects('Group').filtered(`identifier == $0`, identifier);
            };
            retrievedFarmerData['identifier'] = identifier;

            setFarmerData(retrievedFarmerData)

        }
        setModalVisible(true);
    }


    useEffect(()=>{

        if (customUserData && customUserData.userDistrict) {
            const { userDistrict } = customUserData;
            setSelectedAddressAdminPosts(administrativePosts[userDistrict]);
        }
        if (!birthProvince) {
            setBirthDistrict('');
            setBirthAdminPost('');
        }
        if (!birthDistrict) {
            setBirthAdminPost('');
        }

    }, [customUserData, birthProvince, birthDistrict, birthAdminPost]);

    useEffect(()=>{
        setLoadingActivityIndicator(true);
        // if (duplicatesAlert){
        //     setIsDuplicateModalVisible(true);
        // }
    }, [navigation, farmerType])
 

    // if (duplicatesAlert) {

        // return (
        //     <Center flex={1} px="3">
                // <DuplicatesAlert 
                    // setDuplicatesAlert={setDuplicatesAlert}
                    // suspectedDuplicates={suspectedDuplicates}
                    // setFarmerType={setFarmerType}
                    // setModalVisible={setModalVisible}
                    // addFarmer={addFarmer}
                    // farmerData={farmerData}
                    // realm={realm}
                    // customUserData={customUserData}
                    // setModalVisible={setModalVisible}
                    
                // />
            // </Center>
        // )
    // }
        
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView
        decelerationRate={'normal'}
        fadingEdgeLength={2}
        keyboardDismissMode = 'on-drag'
        keyboardShouldPersistTaps = 'handled'
        // contentInsetAdjustmentBehavior = 'always'
      > */}
        <KeyboardAwareScrollView
            decelerationRate={'normal'}
            fadingEdgeLength={2}
            keyboardDismissMode = 'on-drag'
            keyboardShouldPersistTaps = 'handled'
        >

        

        {/* Data collecting form description */}
     <Box>
        <Box 
        bg="#EBEBE4" 
        w="100%" 
        p="3" 

        style={{
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderColor: '#EBEBE4',
            }}
            >
            <Stack>
                
            </Stack>

            <AwesomeAlert
                show={errorAlert}
                showProgress={false}
                title="Dados Obrigatórios"
                message="Os campos obrigatórios devem ser BEM preenchidos!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="   OK   "
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setErrorAlert(false);
                }}
            />

            <Box mb="2">
                <Stack direction="row">
                    <Box>
                        <Pressable
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={()=>navigation.goBack()}
                        >
                            <Icon 
                                name="arrow-back-ios" 
                                color={COLORS.main}
                                size={wp('8%')}
                            /> 
                            {/* <Text
                                style={{
                                    color: COLORS.main,
                                    fontFamily: 'JosefinSans-Bold',
                                    marginLeft: -10,
                                }}
                            >
                                Voltar
                            </Text> */}

                        </Pressable>
                    </Box>
                    <Box w="100%" alignItems={'center'} pt="1" pb="6">
                        <Text 
                            style={{ 
                                textAlign: 'center', 
                                fontFamily: 'JosefinSans-Bold', 
                                fontSize: 16,
                                color: COLORS.main,  
                            }}
                        >
                            Produtor
                        </Text>
                    </Box>
                    <Box w="10%">

                    </Box>
                </Stack>
                <Stack direction="row" pt="4">
                    <Box w="80%">
                        <Text style={styles.headerText}>
                            Registo
                        </Text>
                    </Box>
                    <Center w="20%">
                        <Icon name="person-add" size={40} color="grey" />
                    </Center>
                </Stack>
                <Text style={styles.description}>
                    Seleccione o tipo de produtor que pretendes registar
                </Text>
            </Box>

            {/* Radio Buttons allowing to choose the farmerType */}
            <FarmerTypeRadioButtons
                farmerType={farmerType}
                setFarmerType={setFarmerType}
            />
        </Box>
    </Box>      
        {/* Data collecting form  */}
    {
        loadingActivitiyIndicator  && (
            <CustomActivityIndicator 
                loadingActivitiyIndicator={loadingActivitiyIndicator}
                setLoadingActivityIndicator={setLoadingActivityIndicator}
            />
        )
    }

{/* {
   !loadingActivitiyIndicator && ( */}
<Box
    alignItems={'center'}
>

{
    farmerType === "Indivíduo" && (
        <IndividualFarmerForm 
            gender={gender}
            setGender={setGender}
            familySize={familySize}
            setFamilySize={setFamilySize}
            selectedAddressAdminPosts={selectedAddressAdminPosts}
            setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
            addressVillage={addressVillage}
            setAddressVillage={setAddressVillage}
            addressAdminPost={addressAdminPost}
            setAddressAdminPost={setAddressAdminPost}
            birthProvince={birthProvince}
            setBirthProvince={setBirthProvince}
            birthDistrict={birthDistrict}
            setBirthDistrict={setBirthDistrict}
            birthAdminPost={birthAdminPost}
            setBirthAdminPost={setBirthAdminPost}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            errorAlert={errorAlert}
            setErrorAlert={setErrorAlert}
            setModalVisible={setModalVisible}
            // setDuplicatesAlert={setDuplicatesAlert}
            docType={docType}
            setDocType={setDocType}
            docNumber={docNumber}
            setDocNumber={setDocNumber}
            isSprayingAgent={isSprayingAgent}
            isNotSprayingAgent={isNotSprayingAgent}
            setIsSprayingAgent={setIsSprayingAgent}
            setIsNotSprayingAgent={setIsNotSprayingAgent}
            surname={surname}
            setSurname={setSurname}
            otherNames={otherNames}
            setOtherNames={setOtherNames}
            primaryPhone={primaryPhone}
            setPrimaryPhone={setPrimaryPhone}
            secondaryPhone={secondaryPhone}
            setSecondaryPhone={setSecondaryPhone}
            nuit={nuit}
            setNuit={setNuit}
            isGroupMember={isGroupMember}
            isNotGroupMember={isNotGroupMember}
            setIsGroupMember={setIsGroupMember}
            setIsNotGroupMember={setIsNotGroupMember}
            errors={errors}
            setErrors={setErrors} 
        />
)}

{/* Group data collecting form */}

{
farmerType === "Instituição" && (
    <InstitutionFarmerForm 
        institutionType={institutionType}
        setInstitutionType={setInstitutionType}
        institutionName={institutionName}
        setInstitutionName={setInstitutionName}
        institutionManagerName={institutionManagerName}
        setInstitutionManagerName={setInstitutionManagerName}
        institutionManagerPhone={institutionManagerPhone}
        setInstitutionManagerPhone={setInstitutionManagerPhone}
        institutionAdminPost={institutionAdminPost}
        setInstitutionAdminPost={setInstitutionAdminPost}
        institutionVillage={institutionVillage}
        setInstitutionVillage={setInstitutionVillage}
        institutionNuit={institutionNuit}
        setInstitutionNuit={setInstitutionNuit}
        isPrivateInstitution={isPrivateInstitution}
        setIsPrivateInstitution={setIsPrivateInstitution}
        institutionLicence={institutionLicence}
        setInstitutionLicence={setInstitutionLicence}
        errors={errors}
        setErrors={setErrors}
        // setAddressAdminPosts={setAddressAdminPosts}
        addressAdminPost={addressAdminPost}
        selectedAddressAdminPosts={selectedAddressAdminPosts}
        setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}

        isInstitutionPrivate={isInstitutionPrivate}
        isInstitutionPublic={isInstitutionPublic}
        setIsInstitutionPrivate={setIsInstitutionPrivate}
        setIsInstitutionPublic={setIsInstitutionPublic}

    />
)}


{
    farmerType === "Grupo" && (
    <GroupFarmerForm 
        groupType={groupType}
        setGroupType={setGroupType}
        groupName={groupName}
        setGroupName={setGroupName}
        groupAdminPost={groupAdminPost}
        setGroupAdminPost={setGroupAdminPost}
        groupVillage={groupVillage}
        setGroupVillage={setGroupVillage}
        // groupManagerName={groupManagerName}
        // setGroupManagerName={setGroupManagerName}
        // groupManagerPhone={groupManagerPhone}
        // setGroupManagerPhone={setGroupManagerPhone}
        groupOperatingLicence={groupOperatingLicence}
        setGroupOperatingLicence={setGroupOperatingLicence}
        groupNuit={groupNuit}
        setGroupNuit={setGroupNuit}
        groupAffiliationYear={groupAffiliationYear}
        setGroupAffiliationYear={setGroupAffiliationYear}
        groupMembersNumber={groupMembersNumber}
        setGroupMembersNumber={setGroupMembersNumber}
        groupWomenNumber={groupWomenNumber}
        setGroupWomenNumber={setGroupWomenNumber}
        errors={errors}
        setErrors={setErrors}
        selectedAddressAdminPosts={selectedAddressAdminPosts}
        setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
        addressAdminPost={addressAdminPost}
        groupGoals={groupGoals}
        setGroupGoals={setGroupGoals}
        groupCreationYear={groupCreationYear}
        setGroupCreationYear={setGroupCreationYear}
        setGroupLegalStatus={setGroupLegalStatus}
        groupLegalStatus={groupLegalStatus}
        isGroupActive={isGroupActive}
        setIsGroupActive={setIsGroupActive}
        isGroupInactive={isGroupInactive}
        setIsGroupInactive={setIsGroupInactive}

    />
)}


    <Center mb="15" w="94%" 
    // style={{ backgroundColor: 'red'}}
    >
        { farmerType !== '' ? 
            (
            <Button
                loading={loadinButton ? true : false}
                type="outline"
                containerStyle={{
                    width: '100%',
                }}
                title="Pré-visualizar dados"
                onPress={()=>addFarmer(farmerType, realm)}
            />
            )
            :
            <Box >
                <Center>
                    <TickComponent />
                </Center>
            </Box>
        }
    </Center>

    <Center flex={1} px="3">
    { 
    farmerType?.includes('Indiv') && (
        <IndividualModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            farmerData={farmerData}
            farmerType={farmerType}
            setFarmerType={setFarmerType}

            setSurname={setSurname}
            setOtherNames={setOtherNames}
            setIsSprayingAgent={setIsSprayingAgent}
            setGender={setGender}
            setFamilySize={setFamilySize}
            setAddressVillage={setAddressVillage}
            setAddressAdminPost={setAddressAdminPost}
            setPrimaryPhone={setPrimaryPhone}
            setSecondaryPhone={setSecondaryPhone}
            setBirthProvince={setBirthProvince}
            setBirthDistrict={setBirthDistrict} 
            setBirthAdminPost={setBirthAdminPost}
            setBirthDate={setBirthDate}
            setDocType={setDocType}
            setDocNumber={setDocNumber}
            setNuit={setNuit}
            setIsGroupMember={setIsGroupMember}
            isGroupMember={isGroupMember}

            setFarmerItem={setFarmerItem}
            farmerItem={farmerItem}
            setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}            
        
            customUserData={customUserData}

            setActor={setActor}
            actor={actor}
            actorCategory={actorCategory}
            setActorCategory={setActorCategory}
        
        />
    )
    }
    {
        farmerType?.includes('Grup') && (
            <GroupModal 
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                farmerData={farmerData}
                farmerType={farmerType}
                setFarmerType={setFarmerType}

                setGroupType={setGroupType}
                setGroupName={setGroupName}
                setGroupAffiliationYear={setGroupAffiliationYear} 
                setGroupAdminPost={setGroupAdminPost}
                setGroupVillage={setGroupVillage}
                // setGroupManagerName={setGroupManagerName}
                // setGroupManagerPhone={setGroupManagerPhone}
                setGroupOperatingLicence={setGroupOperatingLicence}
                setGroupNuit={setGroupNuit}
                setGroupMembersNumber={setGroupMembersNumber}
                setGroupWomenNumber={setGroupWomenNumber}

                setFarmerItem={setFarmerItem}
                farmerItem={farmerItem}
                setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}                

                customUserData={customUserData}

                />
        )
    }
    {
        farmerType?.includes('Instit') && (
            <InstitutionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                farmerData={farmerData}
                farmerType={farmerType}
                setFarmerType={setFarmerType}
                
                setInstitutionType={setInstitutionType} 
                setInstitutionName={setInstitutionName}
                setInstitutionAdminPost={setInstitutionAdminPost}
                setInstitutionVillage={setInstitutionVillage}
                setInstitutionManagerName={setInstitutionManagerName}
                setInstitutionManagerPhone={setInstitutionManagerPhone}
                setInstitutionNuit={setInstitutionNuit}
                setIsPrivateInstitution={setIsPrivateInstitution}  

                setFarmerItem={setFarmerItem}
                farmerItem={farmerItem}
                setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}                
     
                customUserData={customUserData}
     

                />

                )
            }
    </Center>
    <Box>
        <SuccessAlert
            isCoordinatesModalVisible={isCoordinatesModalVisible}
            setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
            farmerItem={farmerItem}
            flag={'farmer'}
            
        />
        <DuplicatesAlert 
            suspectedDuplicates={suspectedDuplicates} 
            setModalVisible={setModalVisible}
            isDuplicateModalVisible={isDuplicateModalVisible}
            setIsDuplicateModalVisible={setIsDuplicateModalVisible}
        />
      </Box>
    </Box>
    {/* </ScrollView> */}
    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
