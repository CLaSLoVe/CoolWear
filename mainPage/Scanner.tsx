import { StyleSheet, Text, View, TouchableWithoutFeedback, Linking } from 'react-native'
import React, {Component} from 'react'
import {eventEmitter, storage, isRunningFlag} from "../GlobalVars";

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import ClockCircle from './ClockCircle'
import Heater from './Heater'
import BLEButton from './BLEButton';
import {Toast} from "react-native-toast-notifications";
import i18n from '../locales/index';

export default class ScanScreen extends Component<{}, {showScanner:boolean}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            showScanner: false,
        };
    }




    onSuccess = (e: { data: any; }) => {
        const prefix = "coolwear-";
        if (e.data.startsWith(prefix)) {
            Toast.show(i18n.t('IsCW'), {
                type: "success",
                placement: "bottom",
                duration: 2000,
                animationType: "zoom-in",
              });
            storage.save({
                key: 'settings',
                id: 'uuid',
                data: e.data.slice(prefix.length),
              }).then(() => {
                console.log('UUID saved: ', e.data);
                this.setState({showScanner: false}, () => {
                    eventEmitter.emit('QRScanned', e.data);
                });
              });
        }else{
            Toast.show(i18n.t('NotCW'), {
                type: "warning",
                placement: "bottom",
                duration: 2000,
                animationType: "zoom-in",
              });
              this.setState({showScanner: false});
        }
        
          

    };
  
    render() {
      return (
        <View>
            {this.state.showScanner ? 
                <View>
                    <QRCodeScanner
                    // containerStyle={[styles.overlayView]}
                    cameraStyle={[styles.overlayView]}
                    onRead={this.onSuccess}
                    bottomContent={
                        <TouchableWithoutFeedback style={styles.buttonTouchable} onPress={()=>{this.setState({showScanner: false})}}>
                        <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableWithoutFeedback>
                    }
                    />
                </View>:
                <View>
                    <View style={[styles.container]}>
                        <BLEButton />
                        <View style={{ width: '30%',}}>
                            <TouchableWithoutFeedback 
                            onPress={() => this.setState({showScanner: true})}>
                                <View style={[styles.buttonTouchable]}>
                                <Text style={[styles.whiteText]}>{i18n.t('ScanQR')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <ClockCircle />
                    <Heater />
                </View>
            }
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        backgroundColor:'darkblue',
        height:60,
        width: '90%',
        borderRadius:20,
        alignContent:'center',
        justifyContent:'center',
    },
    whiteText:{
        color:'white',
        fontSize:20,
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight:'bold',
    },
    overlayView: {
        top: '10%',
        width: '100%',
        height: '100%',

      },
      container: {
        // flex: 1,
        flexDirection: 'row', // 设置为水平布局
        justifyContent: 'space-between', // 设置子元素的对齐方式
      },
  });