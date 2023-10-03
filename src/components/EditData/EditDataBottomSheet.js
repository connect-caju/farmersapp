import React, { useCallback, useImperativeHandle } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Divider, Icon } from "@rneui/base"

import COLORS from "../../consts/colors"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
import { bottomSheetFlags } from "../../consts/bottomSheetFlags"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faHome, faIdCard } from "@fortawesome/free-solid-svg-icons"
import { useNavigation } from "@react-navigation/native"
import EditFarmerDetails from "../EditFarmerDetails/EditFarmerDetails"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

const EditDataBottomSheet = React.forwardRef(
  (
    {
      dataToBeUpdated,
      isOverlayVisible,
      setIsOverlayVisible,
      isConfirmDataVisible,
      setIsConfirmDataVisible,
      // farmerId,
      farmersIDs,
      bottomSheetFlag,
      setBottomSheetFlag,
      farmer,
      resourceName,
    },
    ref,
  ) => {
    const navigation = useNavigation()
    const translateY = useSharedValue(0)
    const context = useSharedValue({ y: 0 })
    const active = useSharedValue(false)

    const removeFlag = () => {
      if (bottomSheetFlag !== "") {
        setBottomSheetFlag("")
      }
    }

    const scrollTo = useCallback(
      (destination) => {
        "worklet"
        if (destination === 0) {
          active.value = false
        } else {
          active.value = true
        }

        active.value = destination !== 0

        translateY.value = withSpring(destination, { damping: 50 })
      },
      [bottomSheetFlag, active],
    )

    const isActive = () => {
      return active.value
    }

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ])

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value }
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          scrollTo(0)
          translateY.value = withSpring(0, { damping: 50 })
          runOnJS(removeFlag)()
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y)
          translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 })
        }
      })

    useEffect(() => {
      scrollTo(0)
    }, [])

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP,
      )

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      }
    })

    useEffect(() => {}, [bottomSheetFlag])

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />

          <View
            style={{
              padding: 8,
              // width: '100%',
              justifyContent: "center",
            }}
          >
            {bottomSheetFlag === bottomSheetFlags.farmerDetails && (
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              ></View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: COLORS.ghostwhite,
    position: "absolute",
    top: SCREEN_HEIGHT,
    zIndex: 1,
    borderRadius: 25,
  },
  line: {
    width: 60,
    height: 8,
    backgroundColor: COLORS.grey,
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 8,
  },
})

export default EditDataBottomSheet
