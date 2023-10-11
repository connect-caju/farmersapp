/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
import categories from "../consts/categories"

export default function getFarmerCategory(assetsArray) {
    return assetsArray.filter((asset) => asset.category === categories.farmer.category)[0]?.subcategory
}
