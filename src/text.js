const byDistrict = "byDistrict"
const byUserId = "byUserId"

export default function Component({ navigation }) {
  // some code here

  useEffect(() => {
    if (switched) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(byUserId)
        mutableSubs.add(
          realm
            .objects("Farmer")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: byDistrict },
        )
      })
    } else {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(byDistrict)
        mutableSubs.add(
          realm
            .objects("Farmer")
            .filtered(`userId == "${user?.customData?.userId}"`),
          { name: byUserId },
        )
      })
    }
  }, [switched, realm])
  // some code there
}
