export const generateFormattedSurname = (surname) => {
  if (String(surname)?.split(" ")?.length > 1) {
    return String(surname)?.split(" ").join(".")?.toLowerCase()
  }
  return surname?.toLowerCase()
}
