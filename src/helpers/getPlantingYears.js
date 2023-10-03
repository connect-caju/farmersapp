export const getPlantingYears = (blocks) => {
  if (blocks?.length > 0) {
    return blocks
      ?.map((block) => {
        return block.plantingYear
      })
      .join("; ")
  } else {
    return "Desconhecido"
  }
}
