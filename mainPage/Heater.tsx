import { Text, StyleSheet, View, Switch } from 'react-native'
import React, { Component } from 'react'

export default class Heater extends Component<{}, {heater:boolean}> {
    constructor(props: {}) {
        super(props);
        this.state = {
          heater: false,
        };
    }
  render() {
    return (
        <View>
            <View style={[styles.heaterBar]}>
                <Switch 
                trackColor={{ false: "#767577", true: "#ff0000" }}
                value={this.state.heater}
                onValueChange={(value) => {
                    this.setState({heater: value});
                }}/>
                <Text style={[styles.h5]}>Heater</Text>
            </View>
            
        </View>
    )
  }
}

const styles = StyleSheet.create({
    heaterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    h5: {
        fontSize: 24,
    },
})