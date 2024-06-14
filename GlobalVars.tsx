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
  temperatureRange: [38, 45],
  hotDurationRange: [1, 30],
  coldDurationRange: [1, 30],
  numCycleRange: [1, 10],
  tryTimes: 15,
  heaterWaitingTime: 2500,

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

export async function readDataFromDevice(){
  BleManager.startNotification(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid2).then(() => {
    console.log('Started notification on ' + globalVals.CWid);
    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        // console.log(`Received ${value}`);
        eventEmitter.emit('Notify', value);
      }
    );

  }).catch((error) => {
    console.log('Notification error:', error);
  });
};


export function  connectToaster () {
  Toast.show(i18n.t('PleaseConnectBLE'), {
    type: "warning",
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
  return flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 5;
}


export function stopCurrentToaster () {
  Toast.show(i18n.t('PleaseStop'), {
    type: "warning",
    placement: "bottom",
    duration: 2000,
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
    });

    if (response.status === 201) {
      console.log('User added successfully');
    } else {
      console.log('Failed to add user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}