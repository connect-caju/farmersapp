/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import administrativePosts from "../consts/administrativePosts";

export const getAdminPostsByDistrict = (district) => {
    return administrativePosts[`${district}`];
};
