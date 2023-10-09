/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import HomeStackScreen from "../Stacks/HomeStackScreen";
import FarmersStackScreen from "../Stacks/FarmersStackScreen";
import COLORS from "../../consts/colors";

// import { realmContext } from "../../models/realmContext";
// import { useRealm } from "@realm/react";
// const { RealmProvider } = realmContext;

const Tab = createBottomTabNavigator();


export default function AppTabs() {

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#EBEBE4" />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="HomeStack"
          shifting={true}
          labeled={false}
          screenOptions={() => ({
            headerShown: false,
            tabBarStyle: {
              // minHeight: hp('2%'),
              marginTop: 0,
            },
            tabBarIconStyle: {},
            tabBarActiveBackgroundColor: "#EBEBE4",
            tabBarInactiveBackgroundColor: "#EBEBE4",
            tabBarAllowFontScaling: true,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: "true",
            tabBarLabelStyle: {
              fontSize: responsiveFontSize(16),
              fontFamily: "JosefinSans-Bold",
            },
          })}
        >
          <Tab.Screen
            options={{
              tabBarIcon: (tabInfo) => (
                <Icon
                  name="home"
                  color={tabInfo.focused ? COLORS.main : COLORS.grey}
                  size={wp("10%")}
                />
              ),
              tabBarLabel: "Painel",
            }}
            name="HomeStack"
            component={HomeStackScreen}
          />
          <Tab.Screen
            options={({ route }) => ({
              tabBarIcon: (tabInfo) => (
                <Icon
                  name="people"
                  color={tabInfo.focused ? COLORS.main : COLORS.grey}
                  size={wp("10%")}
                />
              ),
              tabBarLabel: "Produtores",

              tabBarStyle: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
               
                if (routeName === "FarmersSearch") {
                  return { display: "none" };
                }
                return;
              })(route),

            })}
            name="FarmersStack"
            component={FarmersStackScreen}
          />
          {/* <Tab.Screen
            options={{
              tabBarIcon: (tabInfo)=><Icon 
                        name="search" 
                        color={tabInfo.focused ? COLORS.main: COLORS.grey} 
                        size={50} />,
              tabBarLabel: 'Pesquisa',
            }}
            name="Search"
            component={SearchScreen}
           /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
