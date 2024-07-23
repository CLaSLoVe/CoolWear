import { Text, StyleSheet, View, ScrollView  } from 'react-native'
import React, { Component } from 'react'
import { eventEmitter, globalStyles, storage } from '../GlobalVars'
import Modes from './Modes'

export default class ModePage extends Component<{navigation:any}, {existModes:any, BLEConnection:boolean}> {
    constructor(props: { navigation: any }) {
        super(props);
        this.state = {
            existModes:[
                
            ],
            BLEConnection: false,
        }
    }

    componentDidMount(): void {
        this.refreshModes();
        eventEmitter.on('refreshModes', this.refreshModes);
        eventEmitter.on('BLEConnection', (data: any) => {
            this.setState({ BLEConnection: data });
        });
    }

    componentWillUnmount(): void {
        eventEmitter.removeListener('refreshModes', this.refreshModes);
        eventEmitter.removeListener('BLEConnection', this.refreshModes);
    }

    refreshModes = () => {
        storage.getAllDataForKey('modes').then((modes) => {
            this.setState({existModes: modes})
        })
    }


  render() {
    const { existModes } = this.state;
    // console.log('existModes: ', existModes)
    return (
        <ScrollView>
            <View style={[globalStyles.page]}>
            {existModes.map((item: { title: string; totalRunTime: number; temperature: number; pressure: number; actionList: any[]; description:string; locked:boolean; timeId:string; BLEConnection:boolean; automode:number}, index: React.Key | null | undefined) => (
                <Modes 
                    key={index}
                    title={item.title}
                    totalRunTime={item.totalRunTime}
                    temperature={item.temperature}
                    pressure={item.pressure}
                    actionList={item.actionList}
                    description={item.description}
                    timeId={item.timeId}
                    locked={item.locked}
                    automode={item.automode}
                    BLEConnection={this.state.BLEConnection}
                    navigation={this.props.navigation}
                />
            ))}
            </View>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})