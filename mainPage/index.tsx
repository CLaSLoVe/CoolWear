import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import BLEButton from './BLEButton'
import ClockCircle from './ClockCircle'
import Heater from './Heater'
import { globalStyles } from '../GlobalVars'
import i18n from '../locales'

export default class MainPage extends Component {
  
  render() {
    return (
      <ScrollView>
          <View style={[globalStyles.page]}>
          <BLEButton />
          <ClockCircle />
          <Heater />
        </View>
      </ScrollView>
    )
  }
}
