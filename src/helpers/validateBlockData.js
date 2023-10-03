const errorCoeffients = {
  area: 0.3,
  trees: 5,
  density: 0.5,
}

// get estimates for trees number, area, and density
const getThreshold = (trees, area, width, length) => {
  const estimatedArea = ((trees * width * length) / 10000).toFixed(2)
  const estimatedTrees = Math.ceil((area * 10000) / (width * length))
  const estimatedDensity = Math.ceil(Math.sqrt((area * 10000) / trees))

  if (
    estimatedTrees - errorCoeffients.trees <= trees &&
    estimatedTrees + errorCoeffients.trees >= trees &&
    estimatedArea - errorCoeffients.area <= area &&
    estimatedArea + errorCoeffients.area >= area &&
    estimatedDensity - errorCoeffients.density <= length &&
    estimatedDensity + errorCoeffients.density >= length &&
    estimatedDensity - errorCoeffients.density <= width &&
    estimatedDensity + errorCoeffients.density >= width
  ) {
    return { status: true }
  }
  console.log("----------------------")
  console.log(
    `estimatedDensity: ${estimatedDensity}; length: ${length} & width: ${width}`,
  )
  console.log(`estimatedTrees: ${estimatedTrees}; trees: ${trees}`)
  console.log(`estimatedArea: ${estimatedArea}; area: ${area}`)
  console.log("----------------------")

  return {
    status: false,
    area: `Para um total de ${trees} cajueiros e compasso de ${width} x ${length} metros, a área pode ser de ${estimatedArea} hectares`,
    trees: `Para uma área de ${area} hectares e compasso de ${width} x ${length} metros, o total de cajueiros pode ser de ${estimatedTrees}.`,
    density: `Para uma área de ${area} hectares e um total de ${trees} cajueiros, o compasso pode ser de ${estimatedDensity} x ${estimatedDensity} metros.`,
  }
}

const validateBlockData = (
  {
    plantingYear,
    blockTrees,
    usedArea,
    isDensityModeRegular,
    isDensityModeIrregular,
    densityLength,
    densityWidth,
    plantTypes,
    clones,
    remainingArea,

    sameTypeTreesList,
  },
  errors,
  setErrors,
) => {
  const retrievedPlantingYear = plantingYear ? parseInt(plantingYear) : ""
  const retrievedDensityMode = isDensityModeRegular
    ? "Regular"
    : isDensityModeIrregular
    ? "Irregular"
    : ""
  const retrievedTreesNumber = blockTrees ? parseInt(blockTrees) : ""
  const retrievedUsedArea = !usedArea
    ? ""
    : !isNaN(usedArea)
    ? Number(parseFloat(usedArea).toFixed(2))
    : ""
  const retrievedRemainingArea = !remainingArea
    ? 0
    : !isNaN(remainingArea)
    ? Number(remainingArea.toFixed(2))
    : 0
  const retrievedDensityLength = densityLength ? parseInt(densityLength) : 0
  const retrievedDensityWidth = densityWidth ? parseInt(densityWidth) : 0
  const retrievedPlantTypes = [...plantTypes]
  const retrievedClones = [...clones]
  const retrievedSameTypeTreesList = [...sameTypeTreesList].map((object) => {
    return {
      treeType: object?.treeType,
      trees: parseInt(object?.trees),
    }
  })

  if (!retrievedPlantingYear) {
    setErrors({ ...errors, plantingYear: "Selecciona ano de plantio" })
    return false
  }

  if (!retrievedUsedArea) {
    setErrors({ ...errors, usedArea: "Indica área." })
    return false
  }

  if (
    retrievedRemainingArea !== 0 &&
    retrievedRemainingArea < retrievedUsedArea
  ) {
    setErrors({
      ...errors,
      usedArea: "Área aproveitada é superior a área disponível.",
    })
    // console.log('some invalid data??');

    return false
  }

  if (!retrievedTreesNumber) {
    setErrors({ ...errors, blockTrees: "Indica número de cajueiros." })
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
    setErrors({ ...errors, density: "Indica comprimento e largura." })

    return false
  }

  if (
    retrievedDensityMode === "Regular" &&
    (retrievedDensityLength > 20 ||
      retrievedDensityWidth > 20 ||
      retrievedDensityLength < 5 ||
      retrievedDensityWidth < 5)
  ) {
    setErrors({ ...errors, density: "Comprimento e Largura inválidos." })

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
  }

  //  if ( retrievedDensityMode === 'Regular' && !getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).status) {
  //     setErrors({ ...errors,
  //         usedArea: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).area,
  //         blockTrees: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).trees,
  //         treeDensity: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).density,
  //     });
  //     return false;
  // }

  const sumOfTrees = retrievedSameTypeTreesList
    .map((object) => parseInt(object?.trees))
    .reduce((acc, el) => acc + el, 0)

  if (sumOfTrees !== retrievedTreesNumber) {
    setErrors({
      ...errors,
      sameTypeTrees:
        "A soma dos tipos de plantas não é igual ao total dos cajueiros deste bloco.",
    })

    return false
  }

  const farmlandData = {
    plantingYear: retrievedPlantingYear,
    density: {
      mode: retrievedDensityMode,
      length: retrievedDensityLength,
      width: retrievedDensityWidth,
    },
    trees: retrievedTreesNumber,
    usedArea: retrievedUsedArea,
    plantTypes: {
      plantType: retrievedPlantTypes,
      clones: retrievedClones,
    },
    sameTypeTrees: retrievedSameTypeTreesList,
  }

  return farmlandData
}

export default validateBlockData
