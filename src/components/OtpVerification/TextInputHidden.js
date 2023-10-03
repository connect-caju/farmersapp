import { TextInput } from "react-native"

export default function TextInputHidden({
  code,
  setCode,
  maximumLength,
  setIsPinReady,
}) {
  return (
    <TextInput
      style={{
        width: 300,
        borderColor: "#e5e5e5",
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
      }}
      maxLength={maximumLength}
    />
  )
}
