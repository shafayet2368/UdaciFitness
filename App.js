import React, { useEffect } from "react";
import { View, Platform, StatusBar } from "react-native";
import { purple, white, gray } from "./utils/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import AddEntry from "./components/AddEntry";
import History from "./components/History";
import EntryDetail from "./components/EntryDetail";

import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Live from "./components/Live";

import Constants from "expo-constants";

import { setLocalNotification } from "./utils/helpers";

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NavTab = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Platform.OS === "ios" ? purple : white,
        style: {
          height: 80,
          backgroundColor: Platform.OS === "ios" ? white : purple,
          shadowColor: "rgba(0,0,0,0.24)",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 6,
          shadowOpacity: 1,
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-bookmarks" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Entry"
        component={AddEntry}
        options={{
          tabBarLabel: "Add Entry",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={Live}
        options={{
          tabBarLabel: "Live",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-speedometer" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const NavStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={NavTab} />
    <Stack.Screen
      name="Entry Detail"
      component={EntryDetail}
      options={({ route }) => {
        const { entryId } = route.params;

        const year = entryId.slice(0, 4);
        const month = entryId.slice(5, 7);
        const day = entryId.slice(8);
        return {
          title: `${month}/${day}/${year}`,
          headerTintColor: white,
          headerStyle: {
            backgroundColor: purple,
          },
        };
      }}
    />
  </Stack.Navigator>
);

export default function App() {
  useEffect(() => {
    setLocalNotification();
  }, []);
  return (
    <Provider store={createStore(reducer)}>
      <View style={{ flex: 1 }}>
        <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
        <NavigationContainer>
          <NavStack />
        </NavigationContainer>
      </View>
    </Provider>
  );
}
