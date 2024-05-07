import { Text, StyleSheet, View,TouchableOpacity, Image, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { Component } from 'react'
import { eventEmitter, storage, connectToaster } from '../GlobalVars'
import i18n from '../locales';
import FastImage from 'react-native-fast-image';

interface ModesProps {
    navigation: any;
    title: string;
    totalRunTime: number;
    temperature: number;
    timeId: string;
    locked: boolean;
    automode: boolean;
    actionList: any[];
    BLEConnection: any;
}




function convertActionListToDescription(actionList: string | any[]) {
    let description = '';
  
    for (let i = 0; i < actionList.length; i++) {
      const [time, isHot] = actionList[i];
  
      if (isHot) {
        description += `${time}`+i18n.t('min')+i18n.t('Hot')+ ' ';
      } else {
        description += `${time}`+i18n.t('min')+i18n.t('Cold')+ ' ';
      }
      if (i % 2 == 1 && i != actionList.length - 1) {
        description += '\n';
      }
    }
    
    
    return description;
  }


export default class Modes extends Component<ModesProps, {}> {
    constructor(props: ModesProps) {
        super(props);
        // this.state = {
        //     BLEConnection: 0,
        // };
    }


    componentDidMount(): void {
        eventEmitter.on('Notify', (data: any) => {
            this.setState({ BLEConnection: true });
        });
        console.log('Mode Mounted')
        // eventEmitter.on('BLEConnection', (data: any) => {
        //     this.setState({ BLEConnection: data });
        // });
    }
    
    selectMode = () => {
        if (!this.props.BLEConnection) {
            connectToaster();
            return;
        }
        console.log('select: ', this.props.title);
        this.props.navigation.navigate('Play', {
            title: this.props.title,
            totalRunTime: this.props.totalRunTime,
            temperature: this.props.temperature,
            actionList: this.props.actionList,
            timeId: this.props.timeId,
            locked: this.props.locked,
            automode: this.props.automode,
        });
        eventEmitter.emit('ModeSelect', 
            {totalRunTime: this.props.totalRunTime,
            temperature: this.props.temperature,
            actionList: this.props.actionList,
            automode: this.props.automode,
        });
    }


  render() {
    return (
        <TouchableWithoutFeedback onLongPress={() => {
            if (this.props.locked) {
                Alert.alert(
                    i18n.t('DeleteMode'),
                    i18n.t('ModeLocked'),
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
                i18n.t('DeleteMode'),
                i18n.t('DeleteConfirm'),
                [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => {
                        storage.remove({
                            key: 'modes',
                            id: this.props.timeId,
                        });
                        eventEmitter.emit('refreshModes');
                    }
                },
                ],
                {cancelable: false},
            );
        }}>
            <View style={styles.panel}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <View style={styles.content}>
                    <View style={[styles.leftPanel]}>
                        <Text style={styles.contentText}>{i18n.t('TotalTime')+': '+this.props.totalRunTime+' '+i18n.t('min')}</Text>
                        <Text style={styles.contentText}>{i18n.t('TempRange')+': '+'~'+this.props.temperature+'\u2103'}</Text>
                        <Text style={styles.contentText}>{convertActionListToDescription(this.props.actionList)}</Text>
                    </View>
                    <View style={[styles.rightPanel]}>
                        <TouchableOpacity style={styles.startButton} onPress={() => {this.selectMode()}}>
                            <FastImage source={require('../assets/mode_start.png')} style={{width: '100%', height: '100%', alignSelf: 'center'}}/>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>0</Text> */}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5,
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
        fontSize: 16,
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
        // backgroundColor:'#EE6F57',
        height:100,
        width:100,
        borderRadius:100,
        marginRight: 40,
        alignContent:'center',
        justifyContent:'center',
      },
  });