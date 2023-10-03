import { ceps } from "../consts/ceps"
// import { generateUniqueNumber } from './generateUniqueNumber';

export const generateUAID = ({ names, birthDate, birthPlace }) => {
  const fNameInitials = names.otherNames?.slice(0, 2).toLowerCase()
  const lNameInitials = names.surname?.slice(0, 2).toLowerCase()
  const date = new Date(birthDate).valueOf()

  // const dateDigits = JSON.stringify(date.slice(0,2) + date.slice(3,5) + date.slice(-2));
  let birthPlaceCode
  if (
    birthPlace?.province?.includes("Estrangeiro") ||
    birthPlace?.province === "Maputo" ||
    birthPlace?.district?.includes("Cidade")
  ) {
    birthPlaceCode = ceps[`${birthPlace?.district}`]
  } else if (birthPlace?.province?.includes("Cidade")) {
    birthPlaceCode = ceps[`${birthPlace?.province}`]
  } else {
    birthPlaceCode = ceps[`${birthPlace?.adminPost}`]
  }

  // generate for the farmer
  // const uniqueNumber = generateUniqueNumber(birthPlaceCode, 'farmer');

  // console.log('unique number:', uniqueNumber);

  return `${fNameInitials}.${date}.${birthPlaceCode}.${lNameInitials}`
}
