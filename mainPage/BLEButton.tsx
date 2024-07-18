import { Text, StyleSheet, View, TouchableWithoutFeedback, ActivityIndicator, Alert, PermissionsAndroid, Platform, } from 'react-native'
import React, { Component } from 'react'
import { globalVals, eventEmitter, readDataFromDevice, storage } from '../GlobalVars';
import i18n from '../locales/index';

import {Toast} from "react-native-toast-notifications";


import { NativeEventEmitter, NativeModules } from 'react-native';

import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
} from 'react-native-ble-manager';
import Scanner from './Scanner';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default class BLEButton extends Component<{}, {bleState: number, disabled: boolean, data: number[]}> {
    constructor(props: {}) {
        super(props);
        this.state = {
          bleState: 0, // 0: disconnected, 1: connecting, 2: connected
          disabled: false, 
          data: [0],
        };
    }

    handlerDisconnect: any;

    componentDidMount() {
        BleManager.start({showAlert: false})
        this.handleAndroidPermissions();
        // eventEmitter.on('QRScanned', (data) => {
        //   this.handlePress();
        // });
        console.log('BleManager Started');
        storage.load({
          key: 'settings',
          id: 'uuid',
        }).then((ret: any) => {
          if (ret == 'none'){
            this.setState({disabled: true})
          } else {
            globalVals.CWid = ret;
            console.log('UUID loaded: ', ret);
          }

          this.handlerDisconnect = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            this.setDisconnect
          );


        });
      };

      componentWillUnmount() {
        this.setDisconnect();
        this.handlerDisconnect.remove();
      }
    
    handleDisconnect = () => {
        Alert.alert(
            '',
            i18n.t('ConfirmDisconnect'),
            [  
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                  },
                {
                    text: 'OK',
                    onPress: async () => {
                        await this.setDisconnect();
                        
                        // 防止卡死
                        setTimeout(() => {
                            this.setState({ disabled: false });
                          }, 1000);
                    },
                },
            ],

        );
    }

    setDisconnect = async() => {
      await BleManager.disconnect(globalVals.CWid);
      this.setState({ bleState: 0});
      console.log('BLE Disconnected');
      eventEmitter.emit('BLEConnection', false);
    }


    handlePress = async () => {
      if (this.state.bleState == 0){
          console.log('BLE Connecting')
          this.setState({ bleState: 1 });
          this.handleBLEconnect();
      } else if (this.state.bleState == 2){
          this.handleDisconnect();
      }
    };



    handleAndroidPermissions = () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
          PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]).then(result => {
            if (result) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permissions android 12+',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permissions android 12+',
              );
            }
          });
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(checkResult => {
            if (checkResult) {
              console.debug(
                '[handleAndroidPermissions] runtime permission Android <12 already OK',
              );
            } else {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ).then(requestResult => {
                if (requestResult) {
                  console.debug(
                    '[handleAndroidPermissions] User accepts runtime permission android <12',
                  );
                } else {
                  console.error(
                    '[handleAndroidPermissions] User refuses runtime permission android <12',
                  );
                }
              });
            }
          });
        }
      };

     connectWithTimeout = async (timeout = 5000) => {
        const connectPromise = BleManager.connect(globalVals.CWid);
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout'));
          }, timeout);
        });
        return Promise.race([connectPromise, timeoutPromise]);
      };
    
    handleBLEconnect = async () => {
      try {
        await this.connectWithTimeout();
      } catch (error) {
        console.log('connect error');
        Toast.show(i18n.t('BLEError'), {
          type: "warning",
          placement: "bottom",
          duration: 2000,
          animationType: "zoom-in",
        });
        this.setState({ bleState: 0 });
        return;
      }
        let success = false;
        while (!success){
          try {
            await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
            console.log('connect char success')
            success = true;
          } catch (error) {
            // console.log('.')
          }
        }
        readDataFromDevice();
        this.setState({ bleState: 2 });
        console.log('BLE Connected');
        eventEmitter.emit('BLEConnection', true);
    }
    
  render() {
    const {bleState} = this.state;
    return (
      <View style={{ width: '70%',}}>
        {
          this.state.disabled?
          <TouchableWithoutFeedback onPress={() => {this.handlePress()}} disabled={this.state.disabled}>
            <View style={[styles.bleButton]}>
                <Text style={[styles.whiteText]}>
                    {i18n.t('PleaseScanQR') }
                </Text>
            </View>
          </TouchableWithoutFeedback>:
          <TouchableWithoutFeedback onPress={() => {this.handlePress()}} disabled={this.state.disabled}>
            <View style={[styles.bleButton]}>
                {   bleState==0 ? (
                        <Text style={[styles.whiteText]}>
                            {i18n.t('ConnectBLE') }
                        </Text>
                    ) : bleState==1 ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : bleState==2 ? (
                        <View>
                            <Text style={[styles.whiteText]}>
                            {i18n.t('ConnectedBLE') }
                                
                            </Text>
                            <Text style={[styles.whiteTextSmall]}>
                            {i18n.t('DisconnectBLE') }
                                
                            </Text>
                        </View>
                    ) : null
                }
                </View>
        </TouchableWithoutFeedback>
        }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        // marginVertical:20,
    },
    whiteText:{
        color:'white',
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
    },
    whiteTextSmall:{
        color:'white',
        fontSize:15,
        textAlign:'center',
        textAlignVertical:'center',
    },
    bleButton:{
        backgroundColor:'darkblue',
        height:60,
        width: '90%',
        borderRadius:20,
        alignContent:'center',
        justifyContent:'center',
    },
    deadButton:{
      backgroundColor:'lightblue',
      height:60,
      width: '90%',
      borderRadius:20,
      alignContent:'center',
      justifyContent:'center',
  }
})

function bytesToString(bytes: string | any[]) {
  return bytes;
}



