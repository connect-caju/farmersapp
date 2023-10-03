/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { Text, Pressable } from "react-native"
import React, { useState, useCallback } from "react"
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  //   Radio,
} from "native-base"
import { Icon, CheckBox } from "@rneui/themed"
// import { Datepicker  } from '@ui-kitten/components';
import { DatePickerModal } from "react-native-paper-dates"
import { pt, registerTranslation } from "react-native-paper-dates"
registerTranslation("pt", pt)
// import {
//   KeyboardAwareScrollView,
//   useMaskedTextInput,
// } from 'react-native-keyboard-tools';
import { SelectList } from "react-native-dropdown-select-list"
// import {Dropdown} from 'react-native-element-dropdown';

import { CustomInput } from "../../components/Inputs/CustomInput"
import administrativePosts from "../../consts/administrativePosts"
import provinces from "../../consts/provinces"
// import provinces2 from '../../consts/provinces2';

import districts from "../../consts/districts"
import villages from "../../consts/villages"
import idDocTypes from "../../consts/idDocTypes"
import CustomDivider from "../../components/Divider/CustomDivider"
import styles from "./styles"
// import {localeDateService} from '../../helpers/dates';
// import countries from '../../consts/countries';
import COLORS from "../../consts/colors"

// import {realmContext} from '../../models/realmContext';
import countries3 from "../../consts/countries3"
// const {useRealm} = realmContext;

export default function IndividualFarmerForm({
  route,
  navigation,
  gender,
  setGender,
  familySize,
  setFamilySize,
  selectedAddressAdminPosts,
  addressVillage,
  setAddressVillage,
  addressAdminPost,
  setAddressAdminPost,
  birthProvince,
  setBirthProvince,
  birthDistrict,
  setBirthDistrict,
  birthAdminPost,
  setBirthAdminPost,
  birthDate,
  setBirthDate,
  docType,
  setDocType,
  docNumber,
  setDocNumber,
  isSprayingAgent,
  setIsSprayingAgent,
  isNotSprayingAgent,
  setIsNotSprayingAgent,
  surname,
  setSurname,
  otherNames,
  setOtherNames,
  primaryPhone,
  setPrimaryPhone,
  secondaryPhone,
  setSecondaryPhone,
  nuit,
  setNuit,
  isGroupMember,
  setIsGroupMember,
  isNotGroupMember,
  setIsNotGroupMember,
  errors,
  setErrors,
}) {
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const onDismissSingle = useCallback(() => {
    setOpenDatePicker(false)
  }, [setOpenDatePicker])

  const onConfirmSingle = useCallback(
    (params) => {
      setOpenDatePicker(false)
      setBirthDate(params?.date)
    },
    [setOpenDatePicker, setBirthDate],
  )

  return (
    <Box px="3" my="6">
      <Box w="100%">
        <FormControl isRequired isInvalid={"isSprayingAgent" in errors}>
          <FormControl.Label>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "JosefinSans-Regular",
                color: errors?.isSprayingAgent ? COLORS.red : COLORS.grey,
                paddingLeft: 15,
              }}
            >
              É Provedor de Serviços de Pulverização?
            </Text>
          </FormControl.Label>

          <Stack direction="row" mx="3" w="100%">
            <Box w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: COLORS.ghostwhite,
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isSprayingAgent
                    ? COLORS.main
                    : errors?.isSprayingAgent
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Sim"
                checked={isSprayingAgent}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isSprayingAgent ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                onPress={() => {
                  setIsNotSprayingAgent(false)
                  setIsSprayingAgent(true)
                  setErrors({
                    ...errors,
                    isSprayingAgent: "",
                  })
                }}
              />
            </Box>
            <Box w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: COLORS.ghostwhite,
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isNotSprayingAgent
                    ? COLORS.main
                    : errors?.isSprayingAgent
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Não"
                checked={isNotSprayingAgent}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isSprayingAgent ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                onPress={() => {
                  setIsNotSprayingAgent(true)
                  setIsSprayingAgent(false)
                  setErrors({
                    ...errors,
                    isSprayingAgent: "",
                  })
                }}
              />
            </Box>
          </Stack>
          {"isSprayingAgent" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </Box>

      <Box w="100%" alignItems="center">
        <FormControl isRequired my="1" isInvalid={"surname" in errors}>
          <FormControl.Label>Apelido</FormControl.Label>
          <CustomInput
            width="100%"
            type="text"
            autoCapitalize="words"
            placeholder="Apelido"
            value={surname}
            onChangeText={(newSurname) => {
              setErrors((prev) => ({ ...prev, surname: "" }))
              setSurname(newSurname)
            }}
          />
          {"surname" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.surname}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
        <FormControl isRequired my="1" isInvalid={"otherNames" in errors}>
          <FormControl.Label>Outros Nomes</FormControl.Label>
          <CustomInput
            width="100%"
            type="text"
            autoCapitalize="words"
            placeholder="Outros nomes"
            value={otherNames}
            onChangeText={(newNames) => {
              setErrors((prev) => ({ ...prev, otherNames: "" }))
              setOtherNames(newNames)
            }}
          />
          {"otherNames" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.otherNames}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>

        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1">
            <FormControl isRequired my="1" isInvalid={"gender" in errors}>
              <FormControl.Label>Género</FormControl.Label>
              <Select
                selectedValue={gender}
                accessibilityLabel="Género"
                placeholder="Género"
                minHeight={55}
                _selectedItem={{
                  bg: "teal.600",
                  fontSize: "lg",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                dropdownCloseIcon={
                  gender ? (
                    <Icon
                      name="close"
                      size={20}
                      color="grey"
                      onPress={() => setGender("")}
                    />
                  ) : (
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  )
                }
                onValueChange={(newGender) => {
                  setErrors((prev) => ({ ...prev, gender: "" }))
                  setGender(newGender)
                }}
              >
                <Select.Item label="Masculino" value="Masculino" />
                <Select.Item label="Feminino" value="Feminino" />
                <Select.Item label="Outro" value="Outro" />
              </Select>
              {"gender" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.gender}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>

          <Box w="50%" px="1" pt="2">
            <FormControl isRequired isInvalid={"familySize" in errors}>
              <FormControl.Label>Agregado Familiar</FormControl.Label>
              <CustomInput
                width="100%"
                type="number"
                textAlign="center"
                placeholder="Agregado"
                value={familySize}
                keyboardType="numeric"
                onChangeText={(newSize) => {
                  setErrors((prev) => ({ ...prev, familySize: "" }))
                  setFamilySize(newSize)
                }}
              />
              {"familySize" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.familySize}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
        </Stack>

        <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} />

        <Center>
          <Text style={styles.formSectionDescription}>Endereço e Contacto</Text>
        </Center>

        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1">
            <FormControl
              isRequired
              my="3"
              isInvalid={"addressAdminPost" in errors}
            >
              <FormControl.Label>Posto Adm.</FormControl.Label>
              <Select
                selectedValue={addressAdminPost}
                accessibilityLabel="Escolha sua província"
                placeholder="Escolha sua província"
                minHeight={55}
                _selectedItem={{
                  bg: "teal.600",
                  fontSize: "lg",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownCloseIcon={
                  addressAdminPost ? (
                    <Icon
                      name="close"
                      size={20}
                      color="grey"
                      onPress={() => setAddressAdminPost("")}
                    />
                  ) : (
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  )
                }
                mt={1}
                onValueChange={(newAdminPost) => {
                  setErrors((prev) => ({ ...prev, addressAdminPost: "" }))
                  setAddressAdminPost(newAdminPost)
                }}
              >
                {selectedAddressAdminPosts?.map((adminPost, index) => (
                  <Select.Item
                    key={index}
                    label={adminPost}
                    value={adminPost}
                  />
                ))}
              </Select>
              {"addressAdminPost" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.addressAdminPost}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
          <Box w="50%" px="1">
            <FormControl isRequired my="3">
              <FormControl.Label>Localidade</FormControl.Label>
              <Select
                selectedValue={addressVillage}
                accessibilityLabel="Escolha uma localidade"
                placeholder="Escolha uma localidade"
                minHeight={55}
                _selectedItem={{
                  bg: "teal.600",
                  fontSize: "lg",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownCloseIcon={
                  addressVillage ? (
                    <Icon
                      name="close"
                      size={20}
                      color="grey"
                      onPress={() => setAddressVillage("")}
                    />
                  ) : (
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  )
                }
                mt={1}
                onValueChange={(newVillage) => setAddressVillage(newVillage)}
              >
                {villages[addressAdminPost]?.map((village, index) => (
                  <Select.Item key={index} label={village} value={village} />
                ))}
              </Select>
              <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
            </FormControl>
          </Box>
        </Stack>

        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1">
            <FormControl my="1" isInvalid={"primaryPhone" in errors}>
              <FormControl.Label>Telemóvel</FormControl.Label>
              <CustomInput
                width="100%"
                type="telephoneNumber"
                placeholder="Telemóvel"
                keyboardType="phone-pad"
                value={primaryPhone}
                onChangeText={(newPhone) => {
                  setErrors((prev) => ({ ...prev, primaryPhone: "" }))
                  setPrimaryPhone(newPhone)
                }}
                InputLeftElement={
                  <Icon name="phone" color="grey" size={20} type="material" />
                }
              />
              {"primaryPhone" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.primaryPhone}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
          <Box w="50%" px="1">
            <FormControl my="1" isInvalid={"secondaryPhone" in errors}>
              <FormControl.Label>Tel. Alternativo</FormControl.Label>
              <CustomInput
                width="100%"
                type="telephoneNumber"
                placeholder="Telemóvel"
                keyboardType="phone-pad"
                value={secondaryPhone}
                onChangeText={(newPhone) => {
                  setErrors((prev) => ({ ...prev, secondaryPhone: "" }))
                  setSecondaryPhone(newPhone)
                }}
                InputLeftElement={
                  <Icon name="phone" color="grey" size={20} type="material" />
                }
              />
              {"secondaryPhone" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.secondaryPhone}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
        </Stack>

        <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} />

        <Center>
          <Text style={styles.formSectionDescription}>Dados de Nascimento</Text>
        </Center>

        <Stack direction="row" mx="3" my="2" w="100%">
          <Box w="50%" px="1" pt="1">
            <FormControl isRequired isInvalid={"birthDate" in errors}>
              <FormControl.Label>Data de Nasc.</FormControl.Label>
              <Box>
                <Pressable onPress={() => setOpenDatePicker(true)}>
                  <Box
                    style={{
                      borderColor: COLORS.lightgrey,
                      borderWidth: 1,
                      borderRadius: 3,
                      height: 55,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "JosefinSans-Regular",
                        fontSize: 14,
                      }}
                    >
                      {birthDate
                        ? `${birthDate.getDate()}/${
                            birthDate.getMonth() + 1
                          }/${birthDate.getFullYear()}`
                        : "Data de nascimento"}
                    </Text>
                    <Icon name="date-range" size={30} color={COLORS.main} />
                  </Box>
                </Pressable>
              </Box>
              <DatePickerModal
                locale="pt"
                mode="single"
                visible={openDatePicker}
                onDismiss={onDismissSingle}
                onConfirm={onConfirmSingle}
                date={birthDate}
                saveLabel="Confirmar"
                uppercase={false}
                label="Data de Nascimento"
                startYear={1930}
                endYear={2012}
              />

              {/* <Datepicker
                        placeholder="Nascim."
                        min={new Date(1900, 0, 0)}
                        max={new Date(2010, 0, 0)}
                        size="large"

                        placement="top"
                        style={styles.datepicker}
                        date={birthDate}
                        dateService={localeDateService}
                        // {...localePickerState}
                        accessoryLeft={
                            !birthDate
                                &&  <Icon
                                        name="date-range"
                                        size={20}
                                        color={COLORS.main}
                                    />
                        }

                        accessoryRight={
                            birthDate
                                && <Icon
                                        name="close"
                                        size={20}
                                        color={COLORS.grey}
                                        onPress={()=>setBirthDate(null)}
                                    />

                        }

                        onSelect={nextDate => {
                            setErrors(prev=>({...prev, birthDate: null }))
                            setBirthDate(nextDate)
                    }}
                /> */}
              {"birthDate" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.birthDate}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>

          <Box w="50%" px="1">
            <FormControl isRequired isInvalid={"birthProvince" in errors}>
              <FormControl.Label>Província</FormControl.Label>

              <Select
                selectedValue={birthProvince}
                accessibilityLabel="Escolha uma província"
                placeholder="Escolha uma província"
                minHeight={55}
                _selectedItem={{
                  bg: "teal.600",
                  fontSize: "lg",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownCloseIcon={
                  birthProvince ? (
                    <Icon
                      name="close"
                      size={20}
                      color="grey"
                      onPress={() => setBirthProvince("")}
                    />
                  ) : (
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  )
                }
                mt={1}
                onValueChange={(newProvince) => {
                  setErrors((prev) => ({ ...prev, birthProvince: "" }))
                  setBirthProvince(newProvince)
                }}
              >
                {provinces?.map((province, index) => (
                  <Select.Item key={index} label={province} value={province} />
                ))}
              </Select>
              {"birthProvince" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.birthProvince}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
        </Stack>

        {!birthProvince?.includes("Cidade") &&
          !birthProvince?.includes("País Estrangeiro") && (
            <Stack direction="row" mx="3" my="2" w="100%">
              <Box w="50%" px="1">
                <FormControl
                  isRequired
                  my="1"
                  isInvalid={"birthDistrict" in errors}
                >
                  <FormControl.Label>
                    {birthProvince === "País Estrangeiro" ? "País" : "Distrito"}
                  </FormControl.Label>
                  <Select
                    selectedValue={birthDistrict}
                    accessibilityLabel="Escolha um distrito"
                    placeholder={
                      birthProvince?.includes("Estrangeiro")
                        ? "Escolha um país"
                        : "Escolha um distrito"
                    }
                    minHeight={55}
                    _selectedItem={{
                      bg: "teal.600",
                      fontSize: "lg",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    dropdownCloseIcon={
                      birthDistrict ? (
                        <Icon
                          name="close"
                          size={20}
                          color="grey"
                          onPress={() => setBirthDistrict("")}
                        />
                      ) : (
                        <Icon
                          // size={45}
                          name="arrow-drop-down"
                          color={COLORS.main}
                        />
                      )
                    }
                    mt={1}
                    onValueChange={(newDistrict) => {
                      setErrors((prev) => ({ ...prev, birthDistrict: "" }))
                      setBirthDistrict(newDistrict)
                    }}
                  >
                    {birthProvince === "País Estrangeiro"
                      ? countries3?.map((country, index) => (
                          <Select.Item
                            key={index}
                            label={country}
                            value={country}
                          />
                        ))
                      : districts[birthProvince]?.map((district, index) => (
                          <Select.Item
                            key={index}
                            label={district}
                            value={district}
                          />
                        ))}
                  </Select>

                  {"birthDistrict" in errors ? (
                    <FormControl.ErrorMessage
                      leftIcon={
                        <Icon name="error-outline" size={16} color="grey" />
                      }
                      _text={{ fontSize: "xs" }}
                    >
                      {errors?.birthDistrict}
                    </FormControl.ErrorMessage>
                  ) : (
                    <FormControl.HelperText />
                  )}
                </FormControl>
              </Box>
              <Box w="50%" px="1">
                {!birthProvince?.includes("Estrangeiro") &&
                  !birthDistrict?.includes("Cidade") &&
                  !birthProvince?.includes("Maputo") && (
                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"birthAdminPost" in errors}
                    >
                      <FormControl.Label>Posto Adm.</FormControl.Label>
                      <Select
                        selectedValue={birthProvince ? birthAdminPost : ""}
                        accessibilityLabel="Escolha um posto administrativo"
                        placeholder="Escolha um posto administrativo"
                        minHeight={55}
                        _selectedItem={{
                          bg: "teal.600",
                          fontSize: "lg",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        dropdownCloseIcon={
                          birthAdminPost ? (
                            <Icon
                              name="close"
                              size={20}
                              color="grey"
                              onPress={() => setBirthAdminPost("")}
                            />
                          ) : (
                            <Icon
                              // size={45}
                              name="arrow-drop-down"
                              color={COLORS.main}
                            />
                          )
                        }
                        mt={1}
                        onValueChange={(newAdminPost) => {
                          setErrors((prev) => ({ ...prev, birthAdminPost: "" }))
                          setBirthAdminPost(newAdminPost)
                        }}
                      >
                        {administrativePosts[birthDistrict]?.map(
                          (adminPost, index) => (
                            <Select.Item
                              key={index}
                              label={adminPost}
                              value={adminPost}
                            />
                          ),
                        )}
                      </Select>
                      {"birthAdminPost" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {errors?.birthAdminPost}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText />
                      )}
                    </FormControl>
                  )}
              </Box>
            </Stack>
          )}

        {birthProvince?.includes("País Estrangeiro") && (
          <Stack direction="row" mx="3" my="2" w="100%">
            <Box w="100%" px="1">
              <FormControl
                isRequired
                my="1"
                isInvalid={"birthDistrict" in errors}
              >
                <FormControl.Label>
                  {birthProvince === "País Estrangeiro" ? "País" : "Distrito"}
                </FormControl.Label>
                <SelectList
                  setSelected={(newDistrict) => {
                    setErrors((prev) => ({ ...prev, birthDistrict: "" }))
                    setBirthDistrict(newDistrict)
                  }}
                  data={countries3}
                  save="value"
                  placeholder="Seleccionar país"
                  searchPlaceholder="Procurar país"
                  maxHeight={400}
                  fontFamily="JosefinSans-Regular"
                  notFoundText="País não encontrado"
                  dropdownItemStyles={{}}
                  dropdownTextStyles={{
                    fontSize: 16,
                    color: COLORS.black,
                    padding: 5,
                  }}
                  arrowicon={
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  }
                  closeicon={
                    <Icon name="close" size={20} color={COLORS.grey} />
                  }
                  inputStyles={{
                    fontSize: 15,
                    color: birthDistrict ? COLORS.black : COLORS.grey,
                  }}
                  boxStyles={{
                    minHeight: 55,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                  }}
                />
                {/* <Select
                selectedValue={birthDistrict}
                accessibilityLabel="Escolha um distrito"
                placeholder={birthProvince?.includes('Estrangeiro') ? "Escolha um país" : "Escolha um distrito"}
                minHeight={55}
                _selectedItem={{
                    bg: 'teal.600',
                    fontSize: 'lg',
                    endIcon: <CheckIcon size="5" />,
                }}
              dropdownCloseIcon={birthDistrict
                ? <Icon name="close" size={20} color="grey" onPress={()=>setBirthDistrict('')} />
                : <Icon size={45} name="arrow-drop-down" color={COLORS.main} />
            }
            mt={1}
            onValueChange={newDistrict => {
                setErrors((prev)=>({...prev, birthDistrict: ''}));
                setBirthDistrict(newDistrict);
                }}
            >
            {   birthProvince === "País Estrangeiro"
                ? countries?.map((country, index)=>(
                    <Select.Item key={index} label={country} value={country} />
                ))
                :
                districts[birthProvince]?.map((district, index)=>(
                    <Select.Item key={index} label={district} value={district} />
                    ))
                }
            </Select> */}

                {"birthDistrict" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color={COLORS.red} />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.birthDistrict}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText />
                )}
              </FormControl>
            </Box>
            {/* <Box w="50%" px="1">

{
    (
        !birthProvince?.includes('Estrangeiro') &&
        !birthDistrict?.includes('Cidade') &&
        !birthProvince?.includes('Maputo')

    )
    &&
    (

        <FormControl isRequired my="1" isInvalid={'birthAdminPost' in errors}>
        <FormControl.Label>Posto Adm.</FormControl.Label>
            <Select
                selectedValue={birthProvince ? birthAdminPost: ''}
                accessibilityLabel="Escolha um posto administrativo"
                placeholder="Escolha um posto administrativo"
                minHeight={55}
                _selectedItem={{
                    bg: 'teal.600',
                    fontSize: 'lg',
                    endIcon: <CheckIcon size="5" />,
                }}
                dropdownCloseIcon={birthAdminPost
                    ? <Icon name="close" size={20} color="grey" onPress={()=>setBirthAdminPost('')} />
                    : <Icon size={45} name="arrow-drop-down" color={COLORS.main} />
                }
                mt={1}
            onValueChange={newAdminPost=> {
                setErrors((prev)=>({...prev, birthAdminPost: ''}));
                setBirthAdminPost(newAdminPost);
            }}
            >
            {
                administrativePosts[birthDistrict]?.map((adminPost, index)=>(
                    <Select.Item key={index} label={adminPost} value={adminPost} />
                    ))
                }
            </Select>
        {
            'birthAdminPost' in errors
            ? <FormControl.ErrorMessage
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.birthAdminPost}</FormControl.ErrorMessage>
            : <FormControl.HelperText />
        }
    </FormControl>
)
}
</Box> */}
          </Stack>
        )}

        <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} />

        <Center>
          <Text style={styles.formSectionDescription}>
            Documentos de Identificação
          </Text>
        </Center>

        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1">
            <FormControl my="2" isRequired isInvalid={"docType" in errors}>
              <FormControl.Label>Tipo</FormControl.Label>
              <Select
                selectedValue={docType}
                accessibilityLabel="Tipo de doc."
                placeholder="Tipo de documento"
                minHeight={55}
                _selectedItem={{
                  bg: "teal.600",
                  fontSize: "lg",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownCloseIcon={
                  docType ? (
                    <Icon
                      name="close"
                      size={20}
                      color="grey"
                      onPress={() => setDocType("")}
                    />
                  ) : (
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  )
                }
                mt={1}
                onValueChange={(newDocType) => {
                  setErrors((prev) => ({
                    ...prev,
                    docType: "",
                    docNumber: "",
                  }))
                  setDocType(newDocType)
                }}
              >
                {idDocTypes?.map((docType) => (
                  <Select.Item key={docType} label={docType} value={docType} />
                ))}
                {/* <Select.Item label="Bilhete de Identidade (BI)" value="Bilhete de Identidade" />
                    <Select.Item label="Passaporte" value="Passaporte" />
                    <Select.Item label="Carta de Condução" value="Carta de Condução" />
                    <Select.Item label="Cédula" value="Cédula" />
                    <Select.Item label="Cartão de Eleitor" value="Cartão de Eleitor" />
                    <Select.Item label="DIRE" value="DIRE" />
                    <Select.Item label="Cartão de Refugiado" value="Cartão de Refugiado" />
                    <Select.Item label="Não tem" value="Não tem" /> */}
              </Select>
              {"docType" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.docType}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
          <Box w="50%" px="1">
            <FormControl my="3" isInvalid={"docNumber" in errors}>
              <FormControl.Label>Número</FormControl.Label>
              <CustomInput
                width="100%"
                type="text"
                isDisabled={
                  docType === "Não tem" || docType === "" ? true : false
                }
                value={docNumber}
                placeholder="Número do Documento"
                onChangeText={(newDocNumber) => {
                  setErrors((prev) => ({ ...prev, docNumber: "" }))
                  setDocNumber(newDocNumber)
                }}
              />
              {"docNumber" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.docNumber}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
        </Stack>

        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1">
            <FormControl isInvalid={"nuit" in errors}>
              <FormControl.Label>NUIT</FormControl.Label>
              <CustomInput
                width="100%"
                type="number"
                placeholder="NUIT"
                value={nuit}
                keyboardType="numeric"
                onChangeText={(newNuit) => {
                  setErrors((prev) => ({ ...prev, nuit: "" }))
                  setNuit(newNuit)
                }}
              />
              {"nuit" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.nuit}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText />
              )}
            </FormControl>
          </Box>
          <Box w="50%" px="1" />
        </Stack>
      </Box>

      {/* Organization */}

      <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} />

      <Center>
        <Text style={styles.formSectionDescription}>Organização</Text>
      </Center>

      <Box w="100%" py="2">
        <FormControl isRequired isInvalid={"isGroupMember" in errors}>
          <FormControl.Label>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                color: errors?.isGroupMember ? COLORS.red : COLORS.grey,
                paddingLeft: 15,
                lineHeight: 25,
              }}
            >
              Pertence a alguma organização (Associação, Cooperativa, EMC, ou
              Grupo)?
            </Text>
          </FormControl.Label>

          <Stack direction="row" mx="3" w="100%">
            <Box w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: COLORS.ghostwhite,
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isGroupMember
                    ? COLORS.main
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Sim"
                checked={isGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                onPress={() => {
                  setIsNotGroupMember(false)
                  setIsGroupMember(true)
                  setErrors({
                    ...errors,
                    isGroupMember: "",
                  })
                }}
              />
            </Box>
            <Box w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: COLORS.ghostwhite,
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isNotGroupMember
                    ? COLORS.main
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Não"
                checked={isNotGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                onPress={() => {
                  setIsNotGroupMember(true)
                  setIsGroupMember(false)
                  setErrors({
                    ...errors,
                    isGroupMember: "",
                  })
                }}
              />
            </Box>
          </Stack>
          {"isGroupMember" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </Box>
    </Box>
  )
}
