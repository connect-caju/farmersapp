import React, { useCallback, useRef, useMemo } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

export default function CustomizedBottomSheet({}) {
  // hooks

  const sheetRef = useRef(null)
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], [])

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
    console.log("press: ", index)
  }, [])

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index)
  }, [])

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  // callbacks

  // render
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
      }}
    >
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView></BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
})
