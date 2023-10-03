const validateFarmlandData = (
  {
    plantingYear,
    description,
    consociatedCrops,
    trees,
    // declaredArea,
    usedArea,
    totalArea,
    densityMode,
    densityLength,
    densityWidth,
    plantTypes,
    clones,
    // farmer,
  },
  errors,
  setErrors,
) => {
  const retrievedPlantingYear = plantingYear ? parseInt(plantingYear) : ""
  const retrievedFarmlandDescription = description?.trim()
  const retrievedConsociatedCrops = [...consociatedCrops]
  const retrievedTreesNumber = trees ? parseInt(trees) : ""
  const retrievedUsedArea = usedArea ? parseFloat(usedArea) : ""
  const retrievedTotalArea = !totalArea
    ? ""
    : !isNaN(totalArea)
    ? Number(parseFloat(totalArea).toFixed(2))
    : ""
  const retrievedDensityMode = densityMode?.trim()
  const retrievedDensityLength = densityLength ? parseInt(densityLength) : 0
  const retrievedDensityWidth = densityWidth ? parseInt(densityWidth) : 0
  const retrievedPlantTypes = [...plantTypes]
  const retrievedClones = [...clones]
  // const retrievedFarmerId = farmer._id;

  if (!retrievedPlantingYear) {
    setErrors({ ...errors, plantingYear: "Selecciona ano de plantio" })
    return false
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

  if (!retrievedUsedArea) {
    setErrors({ ...errors, declaredArea: "Área aproveitada." })
    return false
  }

  if (!retrievedTotalArea) {
    setErrors({ ...errors, declaredArea: "Área total." })
    return false
  }

  if (!retrievedDensityMode) {
    setErrors({ ...errors, densityMode: "Indica o compasso" })
    return false
  }

  if (
    retrievedDensityMode === "Regular" &&
    (retrievedDensityLength === "" || retrievedDensityWidth === "")
  ) {
    setErrors({ ...errors, densityMode: "Indica comprimento e largura." })
    return false
  }

  if (
    retrievedDensityMode === "Regular" &&
    (retrievedDensityLength > 20 ||
      retrievedDensityWidth > 20 ||
      retrievedDensityLength < 5 ||
      retrievedDensityWidth < 5)
  ) {
    setErrors({ ...errors, densityMode: "Comprimento e Largura inválidos." })
    return false
  }

  if (retrievedPlantTypes?.length === 0) {
    setErrors({ ...errors, plantTypes: "Selecciona o tipo de plantas." })
    return false
  } else if (
    retrievedPlantTypes.some((el) => el.includes("enxert")) &&
    retrievedClones?.length === 0
  ) {
    setErrors({ ...errors, clones: "Selecciona clones." })
    return false
  } else if (
    retrievedPlantTypes.some((el) => el.includes("enxert")) &&
    retrievedClones?.length > 1 &&
    retrievedClones.find((clone) => clone.includes("Desconhecido"))
  ) {
    setErrors({ ...errors, clones: "Clones seleccionados inválidos." })
    return false
  }

  const farmlandData = {
    plantingYear: retrievedPlantingYear,
    description: retrievedFarmlandDescription,
    consociatedCrops: [...retrievedConsociatedCrops],
    density: {
      mode: retrievedDensityMode,
      length: retrievedDensityLength,
      width: retrievedDensityWidth,
    },
    trees: retrievedTreesNumber,
    usedArea: retrievedUsedArea,
    totalArea: retrievedTotalArea,
    plantTypes: {
      plantType: retrievedPlantTypes,
      clones: retrievedClones,
    },
    // farmer: retrievedFarmerId,
  }

  return farmlandData
}

export default validateFarmlandData
