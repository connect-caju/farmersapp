import React from "react"
import { Box, Stack, Radio } from "native-base"
import COLORS from "../../consts/colors"

const FarmerTypeRadioButtons = ({ farmerType, setFarmerType }) => {
  return (
    <Box mb="8" alignItems={"center"}>
      <Radio.Group
        name="myRadioGroup"
        value={farmerType}
        defaultValue="Indivíduo"
        onChange={(nextValue) => setFarmerType(nextValue)}
      >
        <Stack
          direction={{
            base: "row",
            md: "column",
          }}
          alignItems={{
            base: "center",
            md: "center",
          }}
          space={2}
          w="100%"
        >
          <Radio
            _text={{
              fontFamily: "JosefinSans-Bold",
              color: COLORS.main,
              fontSize: 14,
            }}
            value="Indivíduo"
            my="1"
            colorScheme="emerald"
            size="sm"
          >
            Singular
          </Radio>
          <Radio
            _text={{
              fontFamily: "JosefinSans-Bold",
              color: COLORS.main,
              fontSize: 14,
            }}
            value="Instituição"
            my="1"
            mx="0"
            colorScheme="emerald"
            size="sm"
          >
            Institucional
          </Radio>
          <Radio
            _text={{
              fontFamily: "JosefinSans-Bold",
              color: COLORS.main,
              fontSize: 14,
            }}
            value="Grupo"
            my="1"
            mx="0"
            colorScheme="emerald"
            size="sm"
          >
            Agrupado
          </Radio>
        </Stack>
      </Radio.Group>
    </Box>
  )
}

export default FarmerTypeRadioButtons
