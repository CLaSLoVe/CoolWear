import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './src/main';
import ModePage from './src/modes';
import SettingsPage from './src/settings';
import Customization from './src/settings/Customization';
import Manual from './src/settings/Manual';

const Stack = createStackNavigator();

type Props = {
  navigation: any;
};

function CustomScreen({ navigation }: Props) {
  return (
    <Customization navigation={navigation} />
  );
}

function ManualScreen({ navigation }: Props) {
  return (
    <Manual navigation={navigation} />
  );
}


function HomeScreen({ navigation }: Props) {
  return (
    <MainPage />
  );
}

function ModesScreen({ navigation, }: Props) {
  return (
    <ModePage navigation={navigation} />
  );
}

function SettingsScreen({ navigation }: Props) {
  return (
    <SettingsPage navigation={navigation} />
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator  screenOptions={({ route }) => ({
          headerShown: true,
          tabBarStyle: {
            height: 80,
          },
          lazy: false,
          tabBarLabelStyle: {
            fontSize: 16,
          }
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Modes" component={ModesScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function SettingsStack() {
  return (


    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'SettingsScreen' }} />
      <Stack.Screen name="CustomScreen" component={CustomScreen} options={{ title: 'CustomScreen' }} />
      <Stack.Screen name="ManualScreen" component={ManualScreen} options={{ title: 'ManualScreen' }} />
    </Stack.Navigator>

  );
}


