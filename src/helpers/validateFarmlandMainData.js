const validateFarmlandMainData = (
  { description, consociatedCrops, otherConsociatedCrops, trees, totalArea },
  errors,
  setErrors,
) => {
  const retrievedFarmlandDescription = description?.trim()
  const retrievedTreesNumber = trees ? parseInt(trees) : ""
  const retrievedTotalArea = totalArea ? parseFloat(totalArea) : ""

  let retrievedConsociatedCrops
  //  chech if there are other crops that the user typed
  // if there some, concat them with the ones that were selected
  if (
    consociatedCrops?.find((crop) => crop === "Outras") &&
    otherConsociatedCrops?.length > 0
  ) {
    let allCrops = consociatedCrops.filter((crop) => crop !== "Outras")
    retrievedConsociatedCrops = allCrops.concat(otherConsociatedCrops)
  } else if (
    consociatedCrops?.find((crop) => crop === "Outras") &&
    otherConsociatedCrops?.length == 0
  ) {
    setErrors({
      ...errors,
      newCrop: "Indica outra cultura",
    })
    return false
  } else {
    retrievedConsociatedCrops = [...consociatedCrops]
  }

  if (!retrievedFarmlandDescription) {
    setErrors({ ...errors, description: "Descreva a localização deste pomar." })
    return false
  }

  if (retrievedConsociatedCrops.length === 0) {
    setErrors({
      ...errors,
      consociatedCrops: "Selecciona culturas consociadas.",
    })
    return false
  } else if (
    retrievedConsociatedCrops.find((crop) => crop.includes("Nenhuma")) &&
    retrievedConsociatedCrops.length > 1
  ) {
    setErrors({
      ...errors,
      consociatedCrops: "Culturas seleccionadas inválidas.",
    })
    return false
  }

  if (!retrievedTreesNumber) {
    setErrors({ ...errors, trees: "Indica número de cajueiros." })
    return false
  }

  if (!retrievedTotalArea) {
    setErrors({ ...errors, declaredArea: "Área total." })
    return false
  }

  const farmlandMainData = {
    description: retrievedFarmlandDescription,
    consociatedCrops: [...retrievedConsociatedCrops],
    trees: retrievedTreesNumber,
    totalArea: retrievedTotalArea,
  }

  return farmlandMainData
}

export default validateFarmlandMainData
