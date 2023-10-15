/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { ThemeProvider } from "@rneui/themed";
import { NativeBaseProvider } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { Provider as PaperProvider } from "react-native-paper";

import { pt, registerTranslation } from "react-native-paper-dates";
registerTranslation("pt", pt);

import Toast from "react-native-toast-message";

import AppTabs from "./navigation/Tabs/AppTabs";
import elementTheme from "./elementTheme";
import nbTheme from "./nbTheme";
import WelcomeScreen from "./screens/Fallback/WelcomeScreen";
import CustomActivityIndicator from "./components/ActivityIndicator/CustomActivityIndicator";
import { MenuProvider } from "react-native-popup-menu";
// import {enableLatestRenderer} from 'react-native-maps';

import { secrets } from "./secrets";
import { AppProvider, UserProvider } from "@realm/react";
import { realmContext } from "./models/realmContext";
const { RealmProvider } = realmContext;

import { toastConfig } from "./config/toastConfig";
import { syncConfig } from "./syncConfig";
import { useState } from "react";
import ClientResetModal from "./components/Modals/ClientResetModal";

export default function App() {
  const [isManualResetConfirmed, setIsManualResetConfirmed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);


  // dispaly manual client reset dialog
  const onSyncError = (error) => {
    if (error.name === "ClientReset") {
      setIsVisible(true);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#EBEBE4" />
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NativeBaseProvider theme={nbTheme}>
            <ThemeProvider theme={elementTheme}>
              <ApplicationProvider {...eva} theme={eva.light}>
                <MenuProvider>
                  <AppProvider id={secrets.appID} baseUrl={secrets.baseUrl}>
                    <UserProvider fallback={<WelcomeScreen />}>
                      <RealmProvider
                        sync={syncConfig(isManualResetConfirmed, onSyncError)}
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
      {isVisible && (
        <ClientResetModal
          isVisible={isVisible}
          isManualResetConfirmed={isManualResetConfirmed}
          setIsManualResetConfirmed={setIsManualResetConfirmed}
        />
      )}
      {/* 
        The Toast component is used here so to make it usable anywhere within the whole app
        The Toast component helps show in an toasting message that disappears by its own some seconds later.
    */}
      <Toast config={toastConfig} />
    </>
  );
}
