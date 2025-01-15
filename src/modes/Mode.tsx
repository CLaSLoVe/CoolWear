import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { storage, useBleStore, useRunningStore } from '../Store';
import { eventEmitter } from '../Store';
import globalStyles from '../GlobalStyles';
import { writeDataToDevice } from '../BlueToothHandler';



interface ModesProps {
    navigation: any;
    title: string;
    totalRunTime: number;
    temperature: number;
    description: string;
    pressure: number;
    timeId: string;
    isPreset: boolean;
    automode: number;
    actionList: any[];
}


function convertActionListToDescription(actionList: string | any[], loop: boolean = false) {
    let description = '';
    let n = actionList.length;
    if (loop){
        n = Math.min(2, actionList.length);
    }
    for (let i = 0; i < n; i++) {
      const [time, isHot] = actionList[i];
  
      if (isHot) {
        description += `${time} `+('min')+(' HOT')+ ' ';
      } else {
        description += `${time} `+('min')+(' COLD')+ ' ';
      }
      if (i % 2 == 1 && i != n - 1) {
        description += '\n';
      }
    }
    if (loop){
        description += '\n';
        description += Math.max(actionList.length >> 1, 1)+' Cycles'
    }
    
    return description;
  }



const Modes = (props: ModesProps) => {
  const bleState = useBleStore((state: any) => state);
  const runningState = useRunningStore((state: any) => state);

  async function runMode (on:boolean, numCycles:number, hotFirst:boolean, coldDur:number, hotDur:number, temperature:number, isSingle:boolean, selectMode:number=1){
    if (bleState.bleState != 3  || runningState.runningState != 0 ){
        return;
    }
    await writeDataToDevice([0xa1, 0x03, temperature, 0x00, 0x00, 0x00, 0x00]);
    if (isSingle){
        await writeDataToDevice([0xa2, 0x02, on?0x01:0x00, hotFirst?0x01:0x00, hotFirst?hotDur:coldDur, 0x00, 0x00]);
    }else{
        await writeDataToDevice([0xa2, 0x01, on?0x01:0x00, hotFirst?0x01:0x00, numCycles, coldDur, hotDur]);
    }
    
    eventEmitter.emit('startRun', selectMode);


  }

  const selectMode = () => {
    if (bleState.bleState != 3  || runningState.runningState != 0) {
      return;
    }
    console.log('select: ', props.title);
    props.navigation.navigate('Home');
    writeDataToDevice([0xa1, 0x04, props.pressure-1, 0x00, 0x00, 0x00, 0x00]);
    if (props.automode){
        runMode(false, 0, false, 0, 0, 0, false, props.automode);
        return
    }
    let hotFirst = props.actionList[0][1];
    let numCycles = Math.floor(props.actionList.length/2);
    let coldTime = 0;
    let hotTime = 0;
    let temperature = props.temperature;
    let isSingle = false;
    if (props.actionList.length == 1){
        isSingle = true;
        coldTime = props.actionList[0][0];
        hotTime = props.actionList[0][0];
    }else{
        if (props.actionList[0][1]){
            coldTime = props.actionList[1][0]
            hotTime = props.actionList[0][0]
        } else {
            hotTime = props.actionList[1][0]
            coldTime = props.actionList[0][0]
        }
    }
    runMode(true, numCycles, hotFirst, coldTime, hotTime, temperature, isSingle);
  };

  const num2Pressure = (num: number) => {
    switch (num) {
        case 1:
            return 'Low';
        case 2:
            return 'Medium';
        case 3:
            return 'High';
        default:
            return 'Unknown';
        }
    }

  return (
    <TouchableWithoutFeedback onLongPress={() => {
        if (props.isPreset) {
            Alert.alert(
                'Warning',
                ('Mode Locked, Cannot Delete'),
                [
                    {
                        text: 'OK',
                        onPress: () => {},
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
            return;
        }
        Alert.alert(
            'Warning',
            ('Delete Confirm'),
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => {
                    storage.remove({
                        key: 'modes',
                        id: props.timeId,
                    });
                    console.log('delete: ', props.title);
                    eventEmitter.emit('refreshModes');
                }
            },
            ],
            {cancelable: false},
        );
    }}>
        <View style={styles.panel}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{props.title}</Text>
            </View>
            <View style={styles.content}>
                <View style={[styles.leftPanel]}>
                    <Text style={styles.contentText}>{('Total Time')+': '+props.totalRunTime+' '+('min')}</Text>
                    <Text style={styles.contentText}>{('Temp Range')+': '+'~'+props.temperature+'\u2103'}</Text>
                    {props.isPreset?
                    <Text style={styles.contentText}>{props.description}</Text>
                    :<Text style={styles.contentText}>{convertActionListToDescription(props.actionList, true)}</Text>}
                    <Text style={styles.contentText}>{
                        props.pressure?
                        ('Pressure')+': '+(num2Pressure(props.pressure)):
                        ''
                    }</Text>
                </View>
                <View style={[styles.rightPanel]}>
                    <TouchableOpacity style={styles.startButton} onPress={() => {selectMode()}}>
                        <Image source={require('../../assets/mode_start.png')} style={{width: '80%', height: '80%', alignSelf: 'center'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
)
}


export default Modes;


const styles = StyleSheet.create({
    panel: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        // elevation: 5,
    },
    titleContainer: {
        backgroundColor: '#EE6F57',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        backgroundColor: '#F6F5F5',
        borderRadius: 8,
        flexDirection: 'row',
    },
    contentText: {
        marginLeft: 16,
        fontSize: 12,
        color: 'black',
    },
    leftPanel: {
        flex: 6,
        paddingTop: 8,
        paddingBottom: 8,
    },
    rightPanel: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    startButton:{
        height:100,
        width:100,
        borderRadius:100,
        marginRight: '10%',
        alignContent:'center',
        justifyContent:'center',
      },
  });