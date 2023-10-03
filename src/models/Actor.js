/**
 *  Farmer schema for each individual farmer that owns
 *  cashew farmland
 */

export const Actor = {
    name: 'Actor',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        names: 'Name',
        uaid: 'string', //uaid: unique actor id  => <Firstname first 2 characters>.<birthDate in milliseconds>.<birthPlace CEP>.<Lastname first 2 characters>
        identifier: 'string?',
        gender: 'string',
        familySize: 'int',
        birthDate: 'date',
        birthPlace: 'Address',
        address: 'Address',
        geolocation: 'Coordinates?',
        assets: 'Assets[]',
        contact: 'Contact?',
        idDocument: 'IdDocument?',
        image: { type: 'string', default: '' },

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

