import * as React from 'react';
import { Button, Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator,  } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from "./mainPage";
import ModePage from "./modePage";
import SettingPage from './settingPage';
import {CustomPage} from './settingPage/Settings';
import {eventEmitter, storage, isRunningFlag} from "./GlobalVars";
import { useEffect, useLayoutEffect } from 'react';
import i18n, {resources} from './locales/index';
import { initReactI18next } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen'
import RNRestart from 'react-native-restart'; 
import { ToastProvider } from 'react-native-toast-notifications';
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import loadable from '@loadable/component'

// const ModePagePromise = import('./modePage')
// const ModePage = React.lazy(() => ModePagePromise);
// const ModePage = import('./modePage')

type Props = {
  navigation: any;
};

// type Props2 = {
//   navigation: any;
//   isBLEConnected: boolean;
// };

function CustomScreen({ navigation }: Props) {
  return (
    <CustomPage navigation={navigation}/>
  );
}

function HomeScreen({ navigation }: Props) {
  return (
    <MainPage />
  );
}

function ModeScreen({ navigation, }: Props) {
  return (
    <ModePage navigation={navigation}/>
  );
}

function SettingsScreen({ navigation }: Props) {
  return (
    <SettingPage navigation={navigation}/>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const ModeStack = createNativeStackNavigator();

function ModeStackScreen() {
  return (
    <ModeStack.Navigator screenOptions={{ headerShown: false, }}>
      <ModeStack.Screen name="ModeScreen" component={ModeScreen} />
    </ModeStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false, }}>
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingsStack.Screen name="CustomScreen" component={CustomScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [runningState, setRunningState] = React.useState(0);
  const [isLoaded, setLoaded] = React.useState(false);
  let timer: any
  
  useLayoutEffect(() => {

    
    storage.load({
      key: 'settings',
      id: 'firstRun',
    }).then((firstRun) => {
      if (firstRun) {
      // RNRestart.Restart();
      storage.save({
        key: 'settings',
        id: 'firstRun',
        data: false,
      });
      storage.save({
        key: 'settings',
        id: 'uuid',
        data: 'none',
      });
      }
    }
    ).catch((err) => {
      storage.save({
        key: 'settings',
        id: 'firstRun',
        data: true,
      }).then(() => {
        RNRestart.Restart();
      });
    });

    // storage.clearMap();
    SplashScreen.hide();   

    storage.load({
      key: 'settings',
      id: 'language',
    }).then((language) => {
      i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: language, // Default language
        interpolation: {
          escapeValue: false, // React already escapes values
        },
      }).then(() => {
        setLoaded(true);
      }
      );
    });

  }, []);

  useEffect(() => {    
    eventEmitter.on('Notify', (data) => {
      setRunningState(isRunningFlag(data[7])?1:0);
    });
    checkAndSetInitialData();
    return () => {

      timer && clearTimeout(timer);
    };
  }
  
  , []);

  // set initial data if not exist
  const checkAndSetInitialData = async () => {
    const mode1 = {
      title:'Hybrid Rapid Contrast Therapy',
      description: `1 min COLD 2 min HOT\n3 min COLD 2 min HOT\n4 min COLD 2 min HOT`,
      totalRunTime: 14,
      temperature: 40,
      pressure: 3,
      actionList: [[1, false], [2, true], [3, false], [2, true], [4, false], [2, true]],
      timeId: "init",
      locked: true,
      automode: 2,
    };
    const mode2 = {
      title:'Standard Rapid Contrast Therapy',
      description: `1 min COLD 2 min HOT\n5 Cycles`,
      totalRunTime: 15,
      temperature: 40,
      pressure: 3,
      actionList: [[1, false], [2, true], [1, false], [2, true], [1, false], [2, true], [1, false], [2, true], [1, false], [2, true], ],
      timeId: "init",
      locked: true,
      automode: 3,
    };
    const mode3 = {
      title:'Cold Therapy',
      description: '',
      totalRunTime: 10,
      temperature: 10,
      pressure: 3,
      actionList: [[1, false]],
      timeId: "init",
      locked: true,
      automode: 4,
    };
    // storage.load({
    //   key: 'modes',
    //   id: 'mode1',
    // })
    // .then(ret => {
    // })
    // .catch(err => {
    storage.save({
      key: 'modes',
      id: 'mode1',
      data: mode1,
    });
    storage.save({
      key: 'modes',
      id: 'mode2',
      data: mode2,
    });
    storage.save({
      key: 'modes',
      id: 'mode3',
      data: mode3,
    });
    // });
    storage.load({
      key: 'settings',
      id: 'language',
    })
    .then(ret => {
    })
    .catch(err => {
      storage.save({
        key: 'settings',
        id: 'language',
        data: 'en-US',
      });
    });
  
  };
  if (!isLoaded) {
    return null
  }

  return (
    // <GestureHandlerRootView>
    <ToastProvider offset={100}>
      <View>

      </View>
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 80,
          },
          lazy: false,
          tabBarLabelStyle: {
            fontSize: 16,
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name == 'Play') {
              return focused? <Image
                source={require('./assets/play_active.png')}
                style={{ width: 40, height: 40 }}
              />: <Image
              source={require('./assets/play.png')}
              style={{ width: 40, height: 40 }}
            />;
            } else if (route.name == 'Mode') {
              return focused? <Image
                source={require('./assets/mode_active.png')}
                style={{ width: 40, height: 40 }}
              />: <Image
              source={require('./assets/mode.png')}
              style={{ width: 40, height: 40 }}
            />;
            } else if (route.name == 'Settings') {
              return focused? <Image
                source={require('./assets/settings_active.png')}
                style={{ width: 40, height: 40 }}
              />: <Image
              source={require('./assets/settings.png')}
              style={{ width: 40, height: 40 }}
            />;
            }
            return ;
          },
        })}>
        <Tab.Screen name="Play" component={HomeStackScreen} options={{ 
          tabBarBadge: runningState? '' : undefined, 
          tabBarLabel: i18n.t('Home'),
          }} 
        />
        <Tab.Screen name="Mode" component={ModeStackScreen } options={{tabBarLabel: i18n.t('Mode')}}/>
        <Tab.Screen name="Settings" component={SettingsStackScreen} options={{tabBarLabel: i18n.t('Settings')}}/>
      </Tab.Navigator>
    </NavigationContainer>
    </ToastProvider>
    // </GestureHandlerRootView>
  );
}