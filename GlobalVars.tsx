import { NativeEventEmitter, NativeModules, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { EventEmitter } from 'eventemitter3';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BleManager from 'react-native-ble-manager';
import { Toast } from 'react-native-toast-notifications';
import i18n from './locales';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import axios from 'axios';
import { AppState } from 'react-native';

// export const CWid = "F4:12:FA:F8:F1:FE";
// export const serviceid = "6e400020-b5a3-f393-e0a9-e50e24dcca9d";
// export const characteristicid = "6e400023-b5a3-f393-e0a9-e50e24dcca9d";
// export const characteristicid2 = "6e400021-b5a3-f393-e0a9-e50e24dcca9d";

export const globalVals = {
  // CWid: "F4:12:FA:F8:F1:FE",
  // CWid: "74:4D:BD:79:6E:C6",
  // CWid: "34:85:18:8D:36:3A",
  CWid: "",
  serviceid: "6e400020-b5a3-f393-e0a9-e50e24dcca9d",
  characteristicid: "6e400023-b5a3-f393-e0a9-e50e24dcca9d",
  characteristicid2: "6e400021-b5a3-f393-e0a9-e50e24dcca9d",
  temperatureRange: [38, 48],
  hotDurationRange: [1, 30],
  coldDurationRange: [1, 30],
  numCycleRange: [1, 10],
  tryTimes: 15,
  heaterWaitingTime: 2500,

  BLEConnected: false,

};

const BleManagerModule = NativeModules.BleManager;
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const storage = new Storage({
  size: 1000,

  storageBackend: AsyncStorage,

  defaultExpires: null,

  enableCache: true, 
});

export const eventEmitter = new EventEmitter();

export default class GlobalVars extends Component {
  render() {
    return (
      <View>
        <Text>GlobalVars</Text>
      </View>
    )
  }
}

export const globalStyles = StyleSheet.create({
  page: {
      marginTop: '10%',
      marginLeft: '5%',
      marginRight: '5%',
  },  
})

// export async function readDataFromDevice(){
//   BleManager.startNotification(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid2).then(() => {
//     console.log('Started notification on ' + globalVals.CWid);
//     bleManagerEmitter.addListener(
//       "BleManagerDidUpdateValueForCharacteristic",
//       ({ value, peripheral, characteristic, service }) => {
//         // console.log(`Received ${value}`);
//         eventEmitter.emit('Notify', value);
//       }
//     );

//   }).catch((error) => {
//     console.log('Notification error:', error);
//   });
// };

// export async function readDataFromDevice() {
//   try {
//     await BleManager.startNotification(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid2);
//     console.log('Started notification on ' + globalVals.CWid);

//     const handleUpdate = ({ value, peripheral, characteristic, service }: { value: any, peripheral: any, characteristic: any, service: any }) => {
//       eventEmitter.emit('Notify', value);
//     };

//     let subscription = bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleUpdate);

//     const handleAppStateChange = (nextAppState: string) => {
//       if (nextAppState === 'background') {
//         subscription.remove();
//         console.log('Stopped notification as app went to background');
//       } else if (nextAppState === 'active') {
//         subscription = bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleUpdate);
//         console.log('Resumed notification as app came to foreground');
//       }
//     };

//     const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       appStateSubscription.remove();
//       subscription.remove();
//     };

//   } catch (error) {
//     console.log('Notification error:', error);
//   }
// }

let appState = AppState.currentState;

export async function readDataFromDevice() {
  // Function to start the notification
  const startNotification = async () => {
    try {
      await BleManager.startNotification(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid2);
      console.log('Notification started');
    } catch (error) {
      console.log('Notification start error', error);
    }
  };

  // Function to stop the notification
  const stopNotification = async () => {
    try {
      await BleManager.stopNotification(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid2);
      console.log('Notification stopped');
    } catch (error) {
      console.log('Notification stop error', error);
    }
  };

  // Handle app state changes
  const handleAppStateChange = async (nextAppState: any) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, start notifications
      await startNotification();
    } else if (nextAppState.match(/inactive|background/)) {
      // App is going to the background, stop notifications
      await stopNotification();
    }
    appState = nextAppState;
  };

    const handleUpdate = ({ value, peripheral, characteristic, service }: { value: any, peripheral: any, characteristic: any, service: any }) => {
      eventEmitter.emit('Notify', value);
    };

  bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleUpdate);

  // Add the event listener
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  // Initial start notification
  await startNotification();

  // Cleanup function to remove the event listener
  return () => {
    subscription.remove();
  };
}



export function  connectToaster () {
  Toast.show(i18n.t('PleaseConnectBLE'), {
    type: "warning",
    placement: "bottom",
    duration: 2000,
    animationType: "zoom-in",
  });
}

export function  errorConnectionToaster () {
  Toast.show(i18n.t('ErrorConnection'), {
    type: "error",
    placement: "bottom",
    duration: 2000,
    animationType: "zoom-in",
  });
}

export function  startToaster () {
  Toast.show(i18n.t('StartFailed'), {
    type: "warning",
    placement: "bottom",
    duration: 2000,
    animationType: "zoom-in",
  });
}

export function isRunningFlag (flag:any) {
  return flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 5 || flag == 6 || flag == 9;
}



export function stopCurrentToaster () {
  Toast.show(i18n.t('PleaseStop'), {
    type: "warning",
    placement: "bottom",
    duration: 2000,
    animationType: "zoom-in",
  });
}


export function WaitToaster () {
  Toast.show(i18n.t('PleaseWait'), {
    type: "success",
    placement: "bottom",
    duration: 4000,
    animationType: "zoom-in",
  });
}


export function DontPressToaster () {
  Toast.show(i18n.t('PleaseDontContinousPress'), {
    type: "warning",
    placement: "bottom",
    duration: 4000,
    animationType: "zoom-in",
  });
}


export async function postToSQLAPI(action: string, time_remain: string) {

  const [deviceId, deviceName] = await Promise.all([
    DeviceInfo.getUniqueId(),
    DeviceInfo.getDevice(),
  ]);

  try {
    const response = await axios.post('http://159.75.239.186:5000/users', {
      userid: deviceId,
      deviceid: deviceName,
      action: action,
      time_remain: time_remain,
      cwid: globalVals.CWid,
    });

    if (response.status === 201) {
      // console.log('User added successfully');
    } else {
      console.log('Failed to add user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


export async function postToSQLAPIdevice(start_count: number, end_count: number) {

  try {
    const response = await axios.post('http://159.75.239.186:5000/devices', {
      cwid: globalVals.CWid,
      start_count: start_count,
      end_count: end_count,
    });

    if (response.status === 201) {
      // console.log('User added successfully');
    } else {
      console.log('Failed to add user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


export async function setPressure(pressure: number){
  try {
      await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x04, pressure, 0x00, 0x00, 0x00, 0x00]);
      console.log('设置压力为', pressure)
  } catch (error) {
      console.log(error)
  }
  console.log('设置ok', [0xa1, 0x04, pressure, 0x00, 0x00, 0x00, 0x00]);
}

export async function setTemperature(temperature: number){
  try {
    await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x03, temperature, 0x00, 0x00, 0x00, 0x00]);
    console.log('设置温度为', temperature);
  } catch (error) {
    console.log(error)
  };
  console.log('设置ok', [0xa1, 0x02, temperature, 0x00, 0x00, 0x00, 0x00]);
}