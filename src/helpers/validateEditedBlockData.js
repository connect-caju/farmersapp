const errorCoeffients = {
  area: 0.3,
  trees: 5,
  density: 0.5,
}

// get estimates for trees number, area, and density
const getThreshold = (trees, area, width, length) => {
  const estimatedArea = ((trees * width * length) / 10000).toFixed(2)
  const estimatedTrees = ((area * 10000) / (width * length)).toFixed(2)
  const estimatedDensity = Math.sqrt((area * 10000) / trees).toFixed(2)

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

// make sure the number of trees of the edited block doesn't result into
// the sum of blocks trees being greater than the total trees of the farmland
const areTotalTreesAndBlocksTreesConsistent = (
  resource,
  currentBlockTrees,
  blockId,
) => {
  // get the sum of all the block trees except the current block trees
  const blocksTrees = resource.blocks
    ?.filter((block) => block._id !== blockId)
    ?.map((block) => block.trees)
    ?.reduce((acc, el) => acc + el, 0)
  if (resource.trees < blocksTrees + currentBlockTrees) {
    return false
  } else {
    return true
  }
}

const validateEditedBlockData = (
  {
    plantingYear,
    oldPlantingYear,
    blockTrees,
    oldBlockTrees,
    usedArea,
    oldUsedArea,
    isDensityModeIrregular,
    isOldDensityModeIrregular,
    isDensityModeRegular,
    isOldDensityModeRegular,
    densityLength,
    oldDensityLength,
    densityWidth,
    oldDensityWidth,
    plantTypes,
    oldPlantTypes,
    clones,
    oldClones,
    sameTypeTreesList,
    oldSameTypeTreesList,
    remainingArea,
    oldRemainingArea,
  },
  errors,
  setErrors,
  dataToBeUpdated,
  resourceName,
  resource,
  blockId,
) => {
  const retrievedTreesNumber = blockTrees ? parseInt(blockTrees) : 0
  const retrievedOldTreesNumber = oldBlockTrees ? parseInt(oldBlockTrees) : 0

  if (dataToBeUpdated === "plantType") {
    const retrievedPlantTypes = [...plantTypes]
    const retrievedClones = [...clones]
    const retrievedSameTypeTreesList = [...sameTypeTreesList].map((object) => {
      return {
        treeType: object?.treeType,
        trees: parseInt(object?.trees),
      }
    })

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
      plantTypes: {
        plantType: retrievedPlantTypes,
        clones: retrievedClones,
      },
      sameTypeTrees: retrievedSameTypeTreesList,
    }

    return farmlandData
  }

  if (dataToBeUpdated === "blockData") {
    const retrievedPlantingYear = plantingYear ? parseInt(plantingYear) : ""
    const retrievedDensityMode = isDensityModeRegular
      ? "Regular"
      : isDensityModeIrregular
      ? "Irregular"
      : false
    const retrievedUsedArea = !usedArea
      ? ""
      : !isNaN(usedArea)
      ? Number(parseFloat(usedArea).toFixed(2))
      : ""
    const retrievedDensityLength = densityLength ? parseInt(densityLength) : 0
    const retrievedDensityWidth = densityWidth ? parseInt(densityWidth) : 0

    const retrievedOldPlantingYear = oldPlantingYear
      ? parseInt(oldPlantingYear)
      : ""
    const retrievedOldDensityMode = isOldDensityModeRegular
      ? "Regular"
      : isOldDensityModeIrregular
      ? "Irregular"
      : false
    const retrievedOldUsedArea = !oldUsedArea
      ? ""
      : !isNaN(oldUsedArea)
      ? Number(parseFloat(oldUsedArea).toFixed(2))
      : ""
    const retrievedOldDensityLength = oldDensityLength
      ? parseInt(oldDensityLength)
      : 0
    const retrievedOldDensityWidth = oldDensityWidth
      ? parseInt(oldDensityWidth)
      : 0

    if (
      retrievedPlantingYear === retrievedOldPlantingYear &&
      retrievedDensityMode === retrievedOldDensityMode &&
      retrievedUsedArea === retrievedOldUsedArea &&
      retrievedDensityLength === retrievedOldDensityLength &&
      retrievedDensityWidth === retrievedOldDensityWidth &&
      retrievedTreesNumber === retrievedOldTreesNumber
    ) {
      setErrors({
        ...errors,
        plantingYear: "O ano de plantio actual não deve ser igual ao anterior",
        density: "O compasso não pode ser igual ao anterior.",
        blockTrees:
          "O número de cajueiros actual não pode ser igual ao anterior.",
        usedArea: "A área actual não pode ser igual à anteior.",
      })

      return false
    }

    if (!retrievedPlantingYear) {
      setErrors({ ...errors, plantingYear: "Selecciona ano de plantio" })
      return false
    }

    if (!retrievedUsedArea) {
      setErrors({ ...errors, usedArea: "Indica área." })
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

    if (
      !areTotalTreesAndBlocksTreesConsistent(
        resource,
        retrievedTreesNumber,
        blockId,
      )
    ) {
      setErrors({
        ...errors,
        blockTrees:
          "A soma dos cajueiros dos blocos não pode ser superior ao total dos cajueiros do pomar.",
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
    }

    return farmlandData
  }

  //  if ( retrievedDensityMode === 'Regular' && !getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).status) {
  //     setErrors({ ...errors,
  //         usedArea: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).area,
  //         blockTrees: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).trees,
  //         treeDensity: getThreshold(retrievedTreesNumber, retrievedUsedArea, retrievedDensityWidth, retrievedDensityLength).density,
  //     });
  //     return false;
  // }
}

export default validateEditedBlockData
