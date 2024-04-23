import { Text, StyleSheet, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import Settings from './Settings'
import { globalStyles } from '../GlobalVars'


export default class SettingPage extends Component<{navigation:any},{}> {
    constructor(props: { navigation: any }) {
        super(props);
    }

  render() {
    return (
        <ScrollView>
            <View style={[globalStyles.page]}>
                <Settings navigation={this.props.navigation}/>
            </View>
        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})