/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { StatusBar, View, Text, } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ThemeProvider, ListItem, Avatar, Icon, } from '@rneui/themed';
import {NativeBaseProvider, Box, Center, Pressable, Stack } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as eva from '@eva-design/eva';
import { ApplicationProvider,  } from '@ui-kitten/components';
import { Provider as PaperProvider } from 'react-native-paper';

import { pt, registerTranslation } from 'react-native-paper-dates'
registerTranslation('pt', pt);

import Toast from 'react-native-toast-message';


import AppTabs from './navigation/Tabs/AppTabs';
import elementTheme from './elementTheme';
import nbTheme from './nbTheme';
import WelcomeScreen from './screens/Fallback/WelcomeScreen';
import CustomActivityIndicator from './components/ActivityIndicator/CustomActivityIndicator';
import { MenuProvider } from 'react-native-popup-menu';
// import {enableLatestRenderer} from 'react-native-maps';


import { secrets } from './secrets';
import { AppProvider, UserProvider } from '@realm/react';
import { realmContext } from './models/realmContext';
const { RealmProvider} = realmContext;

import { toastConfig } from './config/toastConfig';





export default function App() {

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#EBEBE4" />
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, }}>
      <NativeBaseProvider theme={nbTheme}>
        <ThemeProvider theme={elementTheme}>   
          <ApplicationProvider {...eva} theme={eva.light}>
            <MenuProvider>
          
            <AppProvider
              id={secrets.appID} 
              baseUrl={secrets.baseUrl}
            >
              <UserProvider 
                fallback={<WelcomeScreen />}
              >
                <RealmProvider 
                  sync={{
                    flexible: true,
                    existingRealmFileBehavior: {
                      type: 'openImmediately',
                      timeOut: 1000,
                      timeOutBehavior: 'openLocalRealm',
                    },
                    onError: (_, error)=>{
                      console.log('Error:', error);
                    }
                  }}
                  fallback={<CustomActivityIndicator />}
                >
                  <PaperProvider>
                    <AppTabs />
                  </PaperProvider>
                </RealmProvider>
              </UserProvider>
            </AppProvider>
            </MenuProvider>

          </ApplicationProvider>
        </ThemeProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
    </SafeAreaProvider>
    {/* 
        The Toast component is used here so to make it usable anywhere within the whole app
        The Toast component helps show in an toasting message that disappears by its own some seconds later.
    */}
    <Toast 
      config={toastConfig}
    /> 
    </>
  );
}
