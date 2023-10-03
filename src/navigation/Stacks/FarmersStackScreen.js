/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import React from 'react';
import {createNativeStackNavigator } from '@react-navigation/native-stack';

import FarmersScreen from '../../screens/FarmersScreen/FarmersScreen';
import FarmerRegistration from '../../screens/FarmerRegistrationScreens/FarmerRegistration';
import FarmlandRegistration from '../../screens/FarmlandRegistrationScreens/FarmlandRegistration';
import FarmlandAreaAuditScreen from '../../screens/FarmlandAreaAuditScreen/FarmlandAreaAuditScreen';
import FarmerScreen from '../../screens/FarmerScreen/FarmerScreen';
import InstitutionScreen from '../../screens/InstitutionScreen/InstitutionScreen';
import GroupScreen from '../../screens/GroupScreen/GroupScreen';
import UserStat from '../../screens/UserStatScreen/UserStat';
import GeolocationScreen from '../../screens/GeolocationScreen/GeolocationScreen';
import MembershipScreen from '../../screens/MembershipScreen/MembershipScreen';
import GroupRepresentativeScreen from '../../screens/GroupRepresentantiveScreen/GroupRepresentativeScreen';
import GroupMembersScreen from '../../screens/GroupMembersScreen/GroupMembersScreen';
import FarmerGroupsScreen from '../../screens/FarmerGroupsScreen/FarmerGroupsScreen';
import FarmersListScreen from '../../screens/FarmersListScreen/FarmersListScreen';
import DuplicatesAlert from '../../components/Alerts/DuplicatesAlert';
import CameraScreen from '../../screens/CameraScreen/CameraScreen';
import ProfileScreen from '../../screens/ActorScreen/ProfileScreen';

const FarmersStack = createNativeStackNavigator();

export default function FarmersStackScreen() {
  return (
      <FarmersStack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#005000',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
              fontSize: 16,
              fontWeight: 'bold',
          },
          title: 'Produtores',
        }}
      >
        <FarmersStack.Screen name="Farmers" component={FarmersScreen} />
        <FarmersStack.Screen name="FarmerForm1" component={FarmerRegistration} />
        <FarmersStack.Screen name="FarmlandForm1" component={FarmlandRegistration} />
        <FarmersStack.Screen name="FarmlandAreaAudit" component={FarmlandAreaAuditScreen} />
        <FarmersStack.Screen name="Geolocation" component={GeolocationScreen} />  
        <FarmersStack.Screen name="UserStat" component={UserStat} />
        <FarmersStack.Screen name="Farmer" component={FarmerScreen} />
        <FarmersStack.Screen name="Group" component={GroupScreen} />
        <FarmersStack.Screen name="Institution" component={InstitutionScreen} />
        <FarmersStack.Screen name="Membership" component={MembershipScreen} />
        <FarmersStack.Screen name="GroupRepresentative" component={GroupRepresentativeScreen} />
        <FarmersStack.Screen name="GroupMembers" component={GroupMembersScreen} />
        <FarmersStack.Screen name="FarmerGroups" component={FarmerGroupsScreen} />
        <FarmersStack.Screen name="FarmersList" component={FarmersListScreen} />
        <FarmersStack.Screen name="Camera" component={CameraScreen} />
        <FarmersStack.Screen name="Profile" component={ProfileScreen} />
        {/* <FarmersStack.Screen name="Duplicates" component={DuplicatesAlert} /> */}

      </FarmersStack.Navigator>
  );
}
