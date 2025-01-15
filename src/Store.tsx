import { Dimensions } from 'react-native';
import { create } from 'zustand'

import { EventEmitter } from 'eventemitter3';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BleButton from './main/BleButton';
import { useRef } from 'react';
export const eventEmitter = new EventEmitter();

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;


export const storage = new Storage({
  size: 1000,

  storageBackend: AsyncStorage,

  defaultExpires: null,

  enableCache: true, 
});


storage.load({
  key: 'ble',
  id: 'name',
}).then((ret) => {
  globalVars.name = ret;
}
).catch(() => {
  storage.save({
    key: 'ble',
    id: 'name',
    data: 'CoolWear_F1FE',
  });
});




export interface RouterProps {
  navigation: any;
}

export interface NavigateProps {
  title: string;
  navigateTo:string;
  navigation: any;
}


export const globalVars = {
  deviceWidth: width,
  deviceHeight: height,
  name: "",
  uuid: "",
  serviceid: "6e400020-b5a3-f393-e0a9-e50e24dcca9d",
  characteristicid: "6e400023-b5a3-f393-e0a9-e50e24dcca9d",
  characteristicid2: "6e400021-b5a3-f393-e0a9-e50e24dcca9d",
  temperatureRange: [38, 52],
  hotDurationRange: [1, 30],
  coldDurationRange: [1, 30],
  numCycleRange: [1, 10],
  tryTimes: 15,
  heaterWaitingTime: 2500,
}

interface BleStore {
  bleState: number; // 0: disconnected, 1: scanning, 2: connecting, 3: connected
  cameraShown: boolean;
  setBleState: (newState: number) => void;
}

interface RunningStore {
  runningState: number; // 0: stopped, 1: running, 2: paused
  timeRemaining: number;
  curHotCold: number; // 1: cold, 2: hot
  curPressure: number; // 1: low, 2: medium, 3: high
  completedCycles: number;

  setRunningState: (newState: boolean) => void;
}


const useBleStore = create<BleStore>((set) => ({
  bleState: 0,
  cameraShown: false,
  setBleState: (newState: number) => set({ bleState: newState }),
}))


const useRunningStore = create((set) => ({
  runningState: 0,
  timeRemaining: 0,
  curHotCold: 0,
  completedCycles: 0,
  heaterButtonOn: false,
  drainButtonOn: false,
  drainOn: false,
  fill: 0,
  coldTemperature: 0,
  hotTemperature: 0,
  compressionState: 1,
  countingDown: false,
  currentFinish: -1,
  previousFinish: -1,
}))


const buttonDisabledStore = create((set) => ({
  disabled: false,
  setButtonDisabled: () => {
    set({ disabled: true });
      setTimeout(() => {
        set({ disabled: false });
      }, 1000);
  },
}))


const mode1 = {
  title:'Hybrid Rapid Contrast Therapy',
  description: `1 min COLD 2 min HOT\n3 min COLD 2 min HOT\n4 min COLD 2 min HOT`,
  totalRunTime: 14,
  temperature: 40,
  pressure: 3,
  actionList: [[1, false], [2, true], [3, false], [2, true], [4, false], [2, true]],
  timeId: "mode1",
  isPreset: true,
  automode: 2,
};
const mode2 = {
  title:'Standard Rapid Contrast Therapy',
  description: `1 min COLD 2 min HOT\n5 Cycles`,
  totalRunTime: 15,
  temperature: 40,
  pressure: 3,
  actionList: [[1, false], [2, true], [1, false], [2, true], [1, false], [2, true], [1, false], [2, true], [1, false], [2, true], ],
  timeId: "mode2",
  isPreset: true,
  automode: 3,
};
const mode3 = {
  title:'Cold Therapy',
  description: '',
  totalRunTime: 10,
  temperature: 10,
  pressure: 3,
  actionList: [[1, false]],
  timeId: "mode3",
  isPreset: true,
  automode: 4,
};



export async function setInitModes() {
  const modes = await storage.getAllDataForKey('modes');

  if (!modes.find((mode: any) => mode.id === 'mode1')) {
    storage.save({
      key: 'modes',
      id: 'mode1',
      data: mode1,
    });
  }
  if (!modes.find((mode: any) => mode.id === 'mode2')) {
    storage.save({
      key: 'modes',
      id: 'mode2',
      data: mode2,
    });
  }
  if (!modes.find((mode: any) => mode.id === 'mode3')) {
    storage.save({
      key: 'modes',
      id: 'mode3',
      data: mode3,
    });
  }
  eventEmitter.emit('refreshModes');
}


// const useAnimationStore = create((set) => ({
//   scanButtonRatio: 0.4,
//   setScanButtonRatio: (ratio: number) => set({ scanButtonRatio: ratio }),
//   BleButtonRatio: 0.6,
//   setBleButtonRatio: (ratio: number) => set({ BleButtonRatio: ratio }),
// }))

// const useScrollStore = create((set) => ({
//   scrollViewRef: useRef(null),
// }));

export { useBleStore, useRunningStore, buttonDisabledStore };