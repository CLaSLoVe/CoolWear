import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Scanner from './Scanner'

import { globalStyles } from '../GlobalVars'
import i18n from '../locales'
// import ScanDevicesScreen from './BLEBackend'
export default class MainPage extends Component {
  
  render() {
    return (
      <ScrollView>
          <View style={[globalStyles.page]}>
          <Scanner />
          {/* <ScanDevicesScreen /> */}
          
        </View>
      </ScrollView>
    )
  }
}
