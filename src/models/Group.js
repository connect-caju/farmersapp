/**
 *  Group schema for those groups of individuals who
 *  own common cashew farmlands
 */

export const Group = {
    name: 'Group',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        type: 'string',
        name: 'string',
        identifier: 'string?', 
        creationYear: 'int?',
        affiliationYear: 'int?',
        legalStatus: 'string?',
        operationalStatus: { type: 'bool', default: false},
        address: 'Address',
        numberOfMembers: 'Members',
        members: 'string[]',
        // manager: 'Manager',
        manager: 'string?', // actor _id (the manager is a registered actor)

        licence: 'string?',
        nuit: { type: 'int?', default: 0}, 
        image: { type: 'string', default: '' },
        assets: 'Assets[]',
        geolocation: 'Coordinates?',

        // user info (user who creates data resource)
        userDistrict: 'string?',
        userProvince: 'string?',
        userId: 'string',
        userName: 'string?',

        // validation properties (pending, invalidated, validated)
        status: { type: 'string', default: 'pending'},
        checkedBy: 'string?',

        // dates (creation and modification dates)
        createdAt: { type: 'date', default: ()=>new Date()},
        modifiedAt: { type: 'date', default: ()=>new Date()},
        modifiedBy: 'string?',
    },
}
