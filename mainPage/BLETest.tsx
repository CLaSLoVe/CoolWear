import { View, Text, NativeModules, NativeEventEmitter } from 'react-native'
import React, {useState, useEffect} from 'react';
import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
  } from 'react-native-ble-manager';
const SECONDS_TO_SCAN_FOR = 1;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
    // enrich local contract with custom state properties needed by App.tsx
    interface Peripheral {
      connected?: boolean;
      connecting?: boolean;
    }
  }

