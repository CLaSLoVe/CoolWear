import { NativeModules, NativeEventEmitter, AppState, Vibration } from 'react-native';
import BleManager from 'react-native-ble-manager';

import {eventEmitter, globalVars, useBleStore, useRunningStore} from './Store';
import { useEffect } from 'react';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
let appState = AppState.currentState;

let subscription: any;

const initializeBleManager = () => {
    BleManager.start({ showAlert: false });
    console.log('BleManager initialized');
};

const scanForDevices = () => {
    const getState = useBleStore.getState as () => { bleState: number };
    return new Promise<void>((resolve, reject) => {
        
        useBleStore.setState({bleState: 1});
        BleManager.scan([], 5, true)
            .then(() => {
                console.log('Scanning ', globalVars.name);
                const handleStopScan = () => {
                    

                    // 如果没有找到设备，就把状态改为0
                    if (getState().bleState == 1) {
                        useBleStore.setState({bleState: 0});
                        console.log('Not found');
                    }
                    resolve();
                    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
                };
                bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
            })
            .catch((error) => {
                console.error('Scan error:', error);
                reject(error);
            });
    });
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




const connectToDevice = async (deviceId: string) => {
    try {
        const connectedDevice = await BleManager.connect(deviceId).then(() => {
            console.log('Connected to device:', deviceId);
            subscription = AppState.addEventListener('change', handleAppStateChange);
        });

        const peripheralInfo = await BleManager.retrieveServices(deviceId);
        console.log('Peripheral info:', peripheralInfo);

        bleManagerEmitter.removeAllListeners('BleManagerStopScan');
        
        return true;
    } catch (error) {
        console.error('Connection error:', error);
        return false;
    }
};

const handleDiscoverPeripheral = (peripheral: any) => {
    // console.log('Got BLE peripheral', peripheral);
};



const connectToNamedDevice = async (deviceName: any) => {
    
    return new Promise((resolve, reject) => {
        bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            () => {
                useBleStore.setState({bleState: 0});
                console.log('Disconnected Detected.');
                subscription.remove();

                bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
                bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
            });



        const handleDiscoverPeripheral = async (peripheral: { name: any; id: any; localName: any}) => {
            // console.log('Got BLE peripheral', peripheral.name);
            if (peripheral.name == deviceName || peripheral.localName === deviceName) { 
                // console.log('Found device:', peripheral);
                BleManager.stopScan();
                bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
                useBleStore.setState({bleState: 2});
                globalVars.uuid = peripheral.id;
                const connected = await connectToDevice(peripheral.id);
                if (connected) {
                    
                    // await BleManager.write(peripheral.id, globalVars.serviceid, globalVars.characteristicid, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
                    // console.log('Wrote to device:', peripheral.id);
                    useBleStore.setState({bleState: 3});
                    readDataFromDevice();
                    resolve(true);
                } else {
                    reject(new Error('Failed to connect to device'));
                }
            }
        };

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

        scanForDevices().catch((error) => {
            console.error('Error during scan:', error);
            reject(error);
        });
    });
};


const disconnectFromDevice = async (uuid: string) => {
    try {
        await BleManager.disconnect(uuid);
        console.log('Disconnected from device:', uuid);
        useBleStore.setState({bleState: 0});

        return true;
    } catch (error) {
        console.error('Disconnection error:', error, uuid);
        return false;
    }
}

const startNotification = async () => {
    try {
      await BleManager.startNotification(globalVars.uuid, globalVars.serviceid, globalVars.characteristicid2);
      console.log('Notification started');
    } catch (error) {
      console.log('Notification start error', error);
    }
  };

  // Function to stop the notification
  const stopNotification = async () => {
    try {
      await BleManager.stopNotification(globalVars.uuid, globalVars.serviceid, globalVars.characteristicid2);
      console.log('Notification stopped');
    } catch (error) {
      console.log('Notification stop error', error);
    }
  };

function isRunningFlag (flag:any) {
    return flag == 1 || flag == 2 || flag == 3 || flag == 4 || flag == 5 || flag == 6 || flag == 9;
}

function getRunningState (value:any) {
    let state = 0
    if(isRunningFlag(value[7])){
        if (value[8]%16 == 0){
            state = 1;
        }
        else{
            state = 2;
        }
    }
    return state;
}

function getFill(value:any) {
    let stageTime = 0;
    let remainTime = value[10]*256+value[11]
    if (value[7]==9){
        stageTime = 20;
    }else{
        stageTime = value[9]*60;
    }
    if (getRunningState(value) == 0){
        return 0;
    }else{
        return Math.floor(remainTime/stageTime*100);
    }
}

// 获取数据函数
export async function readDataFromDevice() {
    let previousFinish = -1;
    const handleUpdate = ({ value, peripheral, characteristic, service }: { value: any, peripheral: any, characteristic: any, service: any }) => {
        console.log('Received:', value);

        
        useRunningStore.setState({
            timeRemaining: value[1]*256 + value[2],
            curHotCold: value[8]>>4,
            completedCycles: value[16]*256+value[17],
            heaterButtonOn: value[12] % 16 == 1,
            drainButtonOn: value[12] >> 4 == 1,
            drainOn: value[7]==9,
            runningState: getRunningState(value),
            fill:getFill(value),
            coldTemperature: Math.floor((value[3] * 256 + value[4]) / 10),
            hotTemperature: Math.floor((value[5] * 256 + value[6]) / 10),
            compressionState: value[13]+1,
            currentFinish: value[16]*256+value[17],
        });
        if (previousFinish < 0){
            previousFinish = value[16]*256+value[17];
        } else if (previousFinish != value[16]*256+value[17]){
            previousFinish = value[16]*256+value[17];
            Vibration.vibrate(1000);
        }

    };
  
    bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleUpdate);
  
    // Add the event listener
    
  
    // Initial start notification
    await startNotification();
  
    // Cleanup function to remove the event listener
    return () => {
        
        subscription.remove();
        disconnectFromDevice(globalVars.uuid);
        bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
    };
}


async function writeDataToDevice(data: any) {
    await BleManager.write(globalVars.uuid, globalVars.serviceid, globalVars.characteristicid, data)
        .then(() => {
            console.log('Wrote:', data);
        })
        .catch((error) => {
            
            console.error('Write error:', error, data);
        });
}






export {
    initializeBleManager,
    scanForDevices,
    connectToDevice,
    connectToNamedDevice,
    disconnectFromDevice,
    writeDataToDevice,
};