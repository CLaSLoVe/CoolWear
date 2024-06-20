import { Text, StyleSheet, View, Switch } from 'react-native'
import React, { Component } from 'react'
import { eventEmitter, globalVals, isRunningFlag } from '../GlobalVars';
import BleManager from 'react-native-ble-manager';
import { Image } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import i18n from '../locales';
import EventEmitter from 'eventemitter3';

export default class Heater extends Component<{}, { heater: boolean, drainage:boolean, coldTemperature: number, hotTemperature: number, compressionState:number, running_state:number, isBLEConnected:boolean, countingDown:boolean, disabledHeater:boolean}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            heater: false,
            drainage: false,
            coldTemperature: 0, // 冷水温度
            hotTemperature: 0, // 热水温度
            compressionState: 1, // 压缩机状态
            running_state: 0, // 运行状态
            isBLEConnected: false, // 是否连接蓝牙
            countingDown: false,
            disabledHeater: false,
        };
    }

    componentDidMount(): void {
        eventEmitter.on('Notify', (data: any) => {
            this.setState({
                coldTemperature: Math.floor((data[3] * 256 + data[4]) / 10),
                hotTemperature: Math.floor((data[5] * 256 + data[6]) / 10),
                running_state: (isRunningFlag(data[7]))?1:0,
                compressionState: data[13]+1,
            });
            if (data[12] == 0) {
                this.setState({ heater: false,
                    drainage: false,
                 });
            } else {
                if (data[12] >> 4) {
                    this.setState({ drainage: true });
                }else{
                    this.setState({ drainage: false });
                }
                if (data[12] % 16) {
                    this.setState({ heater: true });
                }else{
                    this.setState({ heater: false });
                }
            }
        });
        eventEmitter.on('BLEConnection', (data: any) => {
            this.setState({ isBLEConnected: data });
        });
        eventEmitter.on('countingDown', (data: any) => {
            this.setState({ countingDown: data });
        });
    }

    setHeaterDrainage = async (heater: boolean=false, drainage:boolean=false) => {
        // let success = false;
        let onH
        if (heater) {
            onH = 0x01;
        } else {
            onH = 0x00;
        };
        let onD
        if (drainage) {
            onD = 0x01;
        } else {
            onD = 0x00;
        };
        // while (!success) {
        try {
            await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x02, onD, onH, 0x00, 0x00, 0x00]);
            // success = true;
        } catch (error) {
            console.log(error)
        }
        // }
        console.log('设置按钮', [0xa1, 0x02, onD, onH, 0x00, 0x00, 0x00]);
    }

    setPressure = async (pressure: number) => {
        console.log('设置压力', pressure)
        try {
            await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x04, pressure, 0x00, 0x00, 0x00, 0x00]);
            // success = true;
        } catch (error) {
            console.log(error)
        }
        console.log('设置ok', [0xa1, 0x04, pressure, 0x00, 0x00, 0x00, 0x00]);
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent:"center"}}>
                    <View style={[styles.heaterBar]}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#ff0000" }}
                            value={this.state.heater}
                            disabled={this.state.running_state != 0 || !this.state.isBLEConnected || this.state.countingDown || this.state.disabledHeater}
                            onValueChange={(value) => {
                                this.setState({
                                    heater: value,
                                    disabledHeater: true,
                                },()=>{
                                    this.setHeaterDrainage(this.state.heater, this.state.drainage);
                                    eventEmitter.emit('Heater', value);
                                });
                                let timer = setTimeout(() => {
                                    this.setState({disabledHeater: false});
                                    clearTimeout(timer);
                                }, globalVals.heaterWaitingTime);
                                
                            }} />
                        <Text style={[styles.h5]}>{i18n.t('Heater')}</Text>
                    </View>
                    <View style={[styles.heaterBar]}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#ff0000" }}
                            value={this.state.drainage}
                            disabled={this.state.running_state != 0 || !this.state.isBLEConnected || this.state.countingDown}
                            onValueChange={(value) => {
                                this.setState({
                                    drainage: value,
                                }, ()=>{
                                    this.setHeaterDrainage(this.state.heater, this.state.drainage);
                                    eventEmitter.emit('Drainage', value);
                                });
                                
                            }} />
                        <Text style={[styles.h5]}>{i18n.t('Drainage')}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    
                    <View style={{width: '28%'}}></View>
                    <View style={{}}>
                        
                        <View style={[styles.temperature]}>

                            <Image source={require('../assets/hot.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                            <Text style={[styles.temperatureFont]}>{this.state.hotTemperature/10}</Text>
                            <Text style={[styles.OC]}>{'\u2103'}</Text>  
                        </View>
                        <View style={[styles.temperature]}>

                            <Image source={require('../assets/cold.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                            <Text style={[styles.temperatureFont]}>{this.state.coldTemperature/10}</Text>   
                            <Text style={[styles.OC]}>{'\u2103'}</Text>  
                        </View>
                        <View style={[styles.temperature]}>
                            <Image source={require('../assets/compression.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                            <View style={{width: 130}}>
                                <Picker
                                    enabled={!(this.state.running_state != 0 || !this.state.isBLEConnected || this.state.countingDown)}
                                    // mode='dropdown'
                                    selectedValue={this.state.compressionState}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {
                                            this.setState({compressionState: itemValue});
                                            this.setPressure(itemValue-1);
                                            console.log('itemValue', itemValue)
                                        }
                                    }>
                                    <Picker.Item style={{fontSize:22}} label={i18n.t('low')} value={1} />
                                    <Picker.Item style={{fontSize:22}} label={i18n.t('mid')} value={2} />
                                    <Picker.Item style={{fontSize:22}} label={i18n.t('high')} value={3} />
                                    
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heaterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
    },
    h5: {
        fontSize: 24,
    },
    temperature: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 3,
        height: 50,
        marginBottom: 10,
    },
    temperatureFont: {
        marginLeft: 10,
        fontSize: 32,
        minWidth: 80,
        alignItems: 'center',
        color: 'black',
    },
    OC: {
        fontSize: 32,
    }
})