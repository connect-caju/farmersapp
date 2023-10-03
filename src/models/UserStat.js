
// ProvincialStats
export const UserStat = {
    name: 'UserStat',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        userName: 'string',
        userId: 'string',
        userDistrict: 'string',
        userProvince: 'string',
        userRole: 'string?',
        targetFarmers: {type: 'int', default: 0 },
        targetFarmlands: {type: 'int', default: 0 },
        registeredFarmers: {type: 'int', default: 0 },
        registeredFarmlands: {type: 'int', default: 0 },
        modifiedBy: 'string?',
        modifiedAt: {type: 'date', default: ()=> new Date()},
        createdAt: {type: 'date', default: ()=> new Date()},
    },
};