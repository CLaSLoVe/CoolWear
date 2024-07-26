import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { Component } from 'react'
// import Scanner from './Scanner'

import { eventEmitter, globalStyles, globalVals } from '../GlobalVars'
import i18n from '../locales'
import Heater from './Heater'
import ClockCircle from './ClockCircle'
import BLEButton from './BLEButton'
import VisionCamera from './VisionCamera'
// import ScanDevicesScreen from './BLEBackend'
export default class MainPage extends Component<{}, {showScanner:boolean}> {

  constructor(props: {}) {
    super(props);
    this.state = {
        showScanner: false,
    };
  }

  componentDidMount(): void {
    eventEmitter.on('QRScanned', (data) => {
      this.setState({showScanner: false});
    });
  }
  
  render() {
    return (
      <ScrollView>
        <View style={[globalStyles.page]}>
        <View style={[styles.page]}>
                <View style={[styles.page]}>
                    <View style={[styles.container]}>
                        <BLEButton />
                        <View style={{ width: '30%',}}>
                            <TouchableWithoutFeedback 
                            // disabled={(globalVals.BLEState!=1)}
                            onPress={() => {
                              this.setState({showScanner: true});
                              console.log(globalVals.BLEState);
                              }}>
                                <View style={[styles.buttonTouchable]}>
                                <Text style={[styles.whiteText]}>{i18n.t('ScanQR')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <ClockCircle />
                    <Heater />
                </View>
              </View> 
        </View> 
        {this.state.showScanner && (
                  <View style={[styles.absoluteFill]}>
                    <VisionCamera />
                  </View>
                )}
        
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: add a semi-transparent background
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
      backgroundColor:'darkblue',
      height:'100%',
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
      flex: 1,
      flexDirection: 'row', // 设置为水平布局
      justifyContent: 'space-between', // 设置子元素的对齐方式
    },
    page: {
      // flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
  },  
});