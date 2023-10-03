export const InvalidationMotive = {
 name: 'InvalidationMotive',
 primaryKey: '_id',
 properties: {
     _id: 'string',
     resourceId: 'string',
     resourceName: 'string',
     messages: 'InvalidationMessage[]',
     createdAt: { type: 'date', default: ()=>new Date()},    
 },
}
