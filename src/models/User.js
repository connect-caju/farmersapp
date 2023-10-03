/**
 *  User schema (custom user data)
 */
 import { BSON } from "realm"

export const User = {
    name: 'User',
    primaryKey: '_id',
    properties: {
        _id: { type: 'objectId', default: ()=> new BSON.ObjectId()  },
        userId: 'string',
        name: 'string',
        email: 'string',
        password: 'string',
        phone: 'int?',
        nuit: { type: 'int?', default: 0},
        image: 'string?',
        role: 'string?',
        userProvince: 'string?',
        userDistrict: 'string?',
        lastLoginAt: {type: 'date', default: ()=>new Date()},
        createdAt: { type: 'date', default: ()=>new Date() },
    }
}




