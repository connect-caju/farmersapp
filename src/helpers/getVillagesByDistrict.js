/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import villages from "../consts/villages";
import { getAdminPostsByDistrict } from "./getAdminPostsByDistrict";

// get all the villages of this district
export const getVillagesByDistrict = (district) => {
    const adminPosts = getAdminPostsByDistrict(district);
    let villagesByDistrict = [];
    adminPosts.forEach((adminPost) => {
        const villagesByAdminPost = villages[`${adminPost}`];
        villagesByDistrict = villagesByDistrict.concat(villagesByAdminPost);
    });

    return villagesByDistrict;
};
