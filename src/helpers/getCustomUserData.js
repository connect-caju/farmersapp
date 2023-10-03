import { useApp, useUser } from "@realm/react"
import { secrets } from "../secrets"

export const getCustomUserData = async () => {
  const user = useUser()

  const mongo = user.mongoClient(secrets.serviceName)

  try {
    const collection = mongo
      .db(secrets.databaseName)
      .collection(secrets.userCollectionName)

    const userData = await collection.findOne({ userId: user.id })
    // console.log('userData', JSON.stringify(userData));

    return {
      name: userData?.name,
      email: userData?.email,
      userId: userData?.userId,
      district: userData?.userDistrict,
      province: userData?.userProvince,
    }
  } catch (error) {
    console.log("Failed to fetch user", { cause: error })
  }
}
