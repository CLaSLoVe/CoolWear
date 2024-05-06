import { Text, StyleSheet, View, Switch } from 'react-native'
import React, { Component } from 'react'
import { eventEmitter, globalVals } from '../GlobalVars';
import BleManager from 'react-native-ble-manager';
import { Image } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import i18n from '../locales';
import EventEmitter from 'eventemitter3';

export default class Heater extends Component<{}, { heater: boolean, coldTemperature: number, hotTemperature: number, compressionState:number, running_state:number}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            heater: false,
            coldTemperature: 0, // 冷水温度
            hotTemperature: 0, // 热水温度
            compressionState: 0, // 压缩机状态
            running_state: 0, // 运行状态
        };
    }

    componentDidMount(): void {
        eventEmitter.on('Notify', (data: any) => {
            this.setState({
                coldTemperature: Math.floor((data[3] * 256 + data[4]) / 10),
                hotTemperature: Math.floor((data[5] * 256 + data[6]) / 10),
                running_state: data[7],
            });
            if (data[12] == 0) {
                this.setState({ heater: false });
            } else {
                this.setState({ heater: true });
            }
        });
    }

    setHeaterDrainage = async (heater: boolean=false, drainage:boolean=false) => {
        let success = false;
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
        while (!success) {
            try {
                await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x02, onD, onH, 0x00, 0x00, 0x00]);
                success = true;
            } catch (error) {
                console.log(error)
            }
        }
        console.log('Set Heater Success');
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{width: '28%'}}></View>
                <View style={{}}>
                    <View style={[styles.heaterBar]}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#ff0000" }}
                            value={this.state.heater}
                            disabled={this.state.running_state != 0}
                            onValueChange={(value) => {
                                this.setState({ heater: value });
                                this.setHeaterDrainage(value);
                                eventEmitter.emit('Heater', value);
                            }} />
                        <Text style={[styles.h5]}>Heater</Text>
                    </View>
                    <View style={[styles.temperature]}>

                        <Image source={require('../assets/hot.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                        <Text style={[styles.temperatureFont]}>{this.state.coldTemperature}</Text>   
                        <Text style={[styles.OC]}>{'\u2103'}</Text>  
                    </View>
                    <View style={[styles.temperature]}>

                        <Image source={require('../assets/cold.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                        <Text style={[styles.temperatureFont]}>{this.state.hotTemperature}</Text>
                        <Text style={[styles.OC]}>{'\u2103'}</Text>  
                    </View>
                    <View style={[styles.temperature]}>
                        <Image source={require('../assets/compression.png')} style={{aspectRatio: 1, width: "20%", alignSelf: 'center'}} fadeDuration={100}/>
                        <View style={{width: 130}}>
                            <Picker
                                mode='dropdown'
                                selectedValue={this.state.compressionState}
                                onValueChange={(itemValue, itemIndex) =>
                                    {
                                        this.setState({compressionState: itemValue});
                                    }
                                }>
                                <Picker.Item style={{fontSize:22}} label={i18n.t('low')} value={0} />
                                <Picker.Item style={{fontSize:22}} label={i18n.t('mid')} value={1} />
                                <Picker.Item style={{fontSize:22}} label={i18n.t('high')} value={2} />
                                
                            </Picker>
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
        // marginTop: 30,
    },
    h5: {
        fontSize: 24,
    },
    temperature: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 3,
    },
    temperatureFont: {
        marginLeft: 10,
        fontSize: 32,
        minWidth: 80,
        alignItems: 'center'
    },
    OC: {
        fontSize: 32,
    }
})