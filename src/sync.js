
/**
 *  To save and sync farmers' data, I have this.
 *  secrets.appID: 'connectcaju-app-iyoae'
 *  secrets.baseUrl: 'https://realm.mongodb.com'
 *  
 */

// 1. Farmer schema
export const Farmer = {
    name: 'Farmer',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        names: 'Name',  // embbeded document
        ufid: 'string', 
        isSprayingAgent: {type: 'bool', default: 'false', },
        gender: 'string',
        familySize: 'int',
        birthDate: 'date',
        birthPlace: 'Address',  // embbeded document
        address: 'Address',     // embbeded document
        category: { type: 'string', default: 'Não-categorizado' },
        contact: 'Contact?',  // embbeded document
        idDocument: 'IdDocument?',  // embbeded document
        image: { type: 'string', default: '' },
        farmlands: 'string[]',
        createdAt: { type: 'date', default: Date()},
        userDistrict: 'string?',
        userId: 'string',
    },
}

// Embedded Name schema
export const Name = {
    name: 'Name',
    embedded: true,
    properties: {
        surname: 'string',
        otherNames: 'string',
    },
};


// Embedded Address schema 
export const Address = {
    name: 'Address',
    embedded: true,
    properties: {
        province: 'string',
        district: { type: 'string', default: 'NA'},
        adminPost: { type: 'string', default: 'NA'},
        village: { type: 'string', default: 'NA'},
    }, 
};



// Embedded Contact schema
export const Contact = {
    name: 'Contact',
    embedded: true,
    properties: {
        primaryPhone: 'int?',
        secondaryPhone: 'int?',
        email: 'string?',
    },
};

// Embedded IdDocument schema
export const IdDocument= {
    name: 'IdDocument',
    embedded: true,
    properties: {
        docType: 'string?',
        docNumber: 'string?',
        nuit: { type: 'int?', default: 0},
    },
};



// 2. I wrapped my app as follow:
export default function AppWrapper() {
  
    return (
        <AppProvider id={secrets.appID} baseUrl={secrets.baseUrl}> 
        <UserProvider 
            fallback={<WelcomeScreen />}
        >
            <RealmProvider 
            sync={{
                flexible: true,
                onError: (_, error)=>{
                console.log('Error:', error);
                }
            }}
            fallback={<CustomActivityIndicator />}
            >
            <App />
            </RealmProvider>
        </UserProvider>
        </AppProvider>
    );
  }
  

// 3. I enabled subscription in the same component 
// where I queried the Farmers

import { realmContext } from '../../models/realmContext';
import { useUser } from '@realm/react';
import { useCallback } from 'react';
const { useRealm, useQuery } = realmContext; 
const farmerSubscriptionName = 'singleFarmers';

export default function FarmersScreen({ route, navigation }) {

    const realm = useRealm();
    const farmers = useQuery('Farmer');
    const user = useUser();

    useEffect(() => {
          realm.subscriptions.update(mutableSubs => {
            mutableSubs.removeByName(districtSingleFarmers);
            mutableSubs.add(
              realm.objects('Farmer').filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
              {name: districtSingleFarmers},
            );
          });
    }, [realm, user ]);

    // more code goes here

    return (
        <>
        {/* More UI code  */}
        </>
    )

}


// 4. To save a new farmer's data
export default function SingleFarmerModal() {

    const realm = useRealm();

    // create and save a new farmer's data
    const addFarmer = useCallback((farmerData, realm)=>{

        // extract the farmer's properties
        const {
            names, isSprayingAgent, ufid, gender, familySize,
            birthDate, birthPlace, address, contact,
            idDocument,
        } = farmerData;

        // write properties to the realm
        realm.write(async ()=>{
            const newFarmer = await realm.create('Farmer', {
                _id: uuidv4(),
                names,
                ufid,
                isSprayingAgent,
                gender,
                familySize,
                birthDate,
                birthPlace,
                address,
                contact,
                idDocument,
                userDistrict: customUserData?.userDistrict,
                userId: customUserData?.userId,  
            });
        })
    }, [realm, farmerData]);

    return (
        <>
        {/* More UI code */}
        </>
    )
}

