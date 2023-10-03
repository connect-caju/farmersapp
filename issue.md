# ISSUE: UPDATING AN ARRAY OF EMBEDDED SCHEMA OBJECTS IN REALM 

## React Native SDK version: 
- 0.70.6

## Membership Embedded Schema
```
export const Membership = {
    name: 'Membership',
    embedded: true,
    properties: {
        subscriptionYear: 'int?',
        organizationId: 'string',
    }
}

```

## Member Schema
```
export const Member = {
    name: 'Member',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        name: 'string?',
        membership: 'Membership[]',
   
    },
   }

```

## Sample data:
 1. Initial case (the Atlas mongoDB database):
 ```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': []
 }
 ```

 2. After I have added a membership to this member
 ```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': [{'subscriptionYear': 2023, organizationId: '555743abbbcdcdcd908845' }]
 }
```

2. What happens if the member unsubscribes from an organization?
 The object referring to the membership of that organization is not removed from the array.
 Instead, it's nullified
  ```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': [{ organizationId: '' }]
 }

```

3. Expected result after the member has unsubscibed
```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': []
 }
```

4. What happens if them subscribes again? The first object still exist (nullified) and a new one is added

```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': [{ organizationId: '' }, {subscriptionYear: 2023, 'organizationId': '555743abbbcdcdcd908845', }]
 }

```

5. What happens if the member unsubscribes again ?
 The object referring to the membership of that organization is not removed from the array.
 Instead, it's nullified
```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': [{ organizationId: '' }, { organizationId: '' }]
 }

```

6. Expected result after the member has unsubscibed
```
 {
  '_id': 'ab3488fdbb8910004389943cf',
  'name': 'Mario Daniel',
  'membership': []
 }
```

## Code implementation

 ```
  const handleUnsubscribe = (realm, currentOrganization)=>{
  try {
   realm.write(()=>{
      const updatedMembership = member?.membership?.filter((memb)=>(memb?.organizationId !== currentOrganization?._id));
      member.membership = [];
      for (let i = 0; i < updatedMembership?.length; i++){
          member?.membership.push(updatedMembership[i]);
       }    
   })
  } catch (error) {
    console.log('The membership unsubscription failed');
   
  }
 }

 ```


    <!-- Previous react native version -->
    <!-- 
        "react-native": "0.70.6",
        "react": "18.1.0",
     -->