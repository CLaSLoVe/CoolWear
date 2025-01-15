import { Text, View, Switch, Alert, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { useBleStore, useRunningStore, buttonDisabledStore, RouterProps, eventEmitter, storage, globalVars } from '../Store';
import { writeDataToDevice } from '../BlueToothHandler';
import { Picker } from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';

function  generatePickerItems (a:number, b:number){
    const items = [];
    for (let i = a; i <= b; i++) {
      items.push(<Picker.Item style={{fontSize:15}} key={i} label={String(i)} value={i} />);
    }
    return items;
  };

const Customization: React.FC<RouterProps> = ({ navigation}) => {
  const [state, setState] = useState({
    temperature: 48,
    hotDur: 2,
    coldDur: 3,
    pressure: 3,
    modeHotCold: 3,
    numCycles: 3,
    totalRunTime: 0,
    title: '',
    hotFirst: false,
    radioButtons: [
      { id: '1', label: ('Hot') },
      { id: '2', label: ('Cold') },
      { id: '3', label: ('Both') },
    ],
  });

//   const scrollViewRef = useScrollStore((state: any) => state.scrollViewRef);

  const scrollToBottom = () => {
    //   scrollViewRef.current.scrollToEnd({ animated: false });
    //   console.log('scroll to bottom');
      };

  const reset = () => {
    setState(prevState => ({
      ...prevState,
      title: '',
      modeHotCold: 3,
      temperature: 48,
      hotDur: 2,
      coldDur: 3,
      numCycles: 3,
    }));
  };

  const calcActionList = () => {
    let actionList = [];
    const { hotDur, coldDur, numCycles, modeHotCold, hotFirst } = state;
    if (modeHotCold === 3) {
      for (let i = 0; i < numCycles; i++) {
        if (hotFirst) {
          actionList.push([hotDur, true]);
          actionList.push([coldDur, false]);
        } else {
          actionList.push([coldDur, false]);
          actionList.push([hotDur, true]);
        }
      }
    } else if (modeHotCold === 1) {
      actionList.push([hotDur, true]);
    } else if (modeHotCold === 2) {
      actionList.push([coldDur, false]);
    }
    return actionList;
  };

  const saveMode = () => {
    const currentDate = new Date();
    storage.save({
      key: 'modes',
      id: currentDate.toString(),
      data: {
        title: state.title ? state.title : 'Custom Mode',
        totalRunTime: state.totalRunTime,
        temperature: state.temperature,
        pressure: state.pressure,
        actionList: calcActionList(),
        timeId: currentDate.toString(),
        isPreset: false,
        automode: false,
        hotFirst: state.hotFirst,
      },
    }).then(() => {
        eventEmitter.emit('refreshModes');
        navigation.navigate('SettingsScreen');
        navigation.navigate('Modes');
        
        scrollToBottom();
    });
  };

  const calcTotalRunTime = () => {
    const { hotDur, coldDur, numCycles, modeHotCold } = state;
    let totalRunTime = 0;
    if (modeHotCold === 3) {
      totalRunTime = (hotDur + coldDur) * numCycles;
    } else if (modeHotCold === 1) {
      totalRunTime = hotDur * numCycles;
    } else if (modeHotCold === 2) {
      totalRunTime = coldDur * numCycles;
    }
    // console.log(hotDur+coldDur, numCycles, totalRunTime);
    setState(prevState => ({ ...prevState, totalRunTime }));
  };

  useEffect(() => {
    calcTotalRunTime();
    reset();
  }, []);

  useEffect(() => {
    calcTotalRunTime();
  }, [state.modeHotCold, state.hotDur, state.coldDur, state.numCycles]);

  const handleValueChange = (key: string, value: number | boolean) => {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    setState(prevState => ({ ...prevState, [key]: value }));
  };

  const tempLine = (
    <View style={[styles.settingLine]}>
      <Text style={[globalStyles.BlackText]}>Temperature</Text>
      <View style={[styles.selectorBG]}>
        <Picker
        style={styles.picker}
          mode='dropdown'
          selectedValue={state.temperature}
          onValueChange={(itemValue: number) => {

            if (itemValue ==state.temperature){
                return;
            }
            if (itemValue > 48) {
              Alert.alert(
                'Warning',
                ('High temperature may cause burns, are you sure to continue?'),
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                  },
                  {
                    text: 'Confirmed',
                    onPress: () => handleValueChange('temperature', itemValue),
                  },
                ],
              );
            } else {
              handleValueChange('temperature', itemValue);
            }
          }}
        >
          {generatePickerItems(globalVars.temperatureRange[0], globalVars.temperatureRange[1])}
        </Picker>

        
      </View>
      <Text style={[styles.selectorText]}>{"\u2103"}</Text>
    </View>
  );

  const hotLine = (
    <View>
      <View style={[styles.settingLine]}>
        <Image source={require('../../assets/hot.png')} style={{ aspectRatio: 1, width: "12%", alignSelf: 'center' }} fadeDuration={100} />
        <Text style={[globalStyles.BlackText]}>Time</Text>
        <View style={[styles.selectorBG]}>
          <Picker
          style={styles.picker}
            mode='dropdown'
            numberOfLines={1}
            selectedValue={state.hotDur}
            onValueChange={(itemValue: number) => {
                if (itemValue ==state.hotDur){
                    return;
                }
                handleValueChange('hotDur', itemValue)
            }}
          >
            {generatePickerItems(globalVars.hotDurationRange[0], globalVars.hotDurationRange[1])}
          </Picker>
        </View>
        <Text style={[styles.selectorText]}>{("min")}</Text>
      </View>
    </View>
  );

  const coldLine = (
    <View>
      <View style={[styles.settingLine]}>
        <Image source={require('../../assets/cold.png')} style={{ aspectRatio: 1, width: "12%", alignSelf: 'center' }} fadeDuration={100} />
        <Text style={[globalStyles.BlackText]}>Time</Text>
        <View style={[styles.selectorBG]}>
          <Picker
          style={styles.picker}
            mode='dropdown'
            selectedValue={state.coldDur}
            onValueChange={(itemValue: number) => {
                if (itemValue ==state.coldDur){
                    return;
                }
                handleValueChange('coldDur', itemValue)}}
          >
            {generatePickerItems(globalVars.hotDurationRange[0], globalVars.hotDurationRange[1])}
          </Picker>
        </View>
        <Text style={[styles.selectorText]}>{("min")}</Text>
      </View>
    </View>
  );

  const pressureLine = (
    <View style={[styles.settingLine]}>
      <Text style={[globalStyles.BlackText]}>{("Pressure")}</Text>
      <View style={[styles.selectorBG]}>
        <Picker
        style={styles.picker}
          mode='dropdown'
          selectedValue={state.pressure}
          onValueChange={(itemValue: any) => {
            if (itemValue ==state.pressure){
                return;
            }   
            handleValueChange('pressure', itemValue)}}
        >
          <Picker.Item style={{ fontSize: 16 }} label={('Low')} value={1} />
          <Picker.Item style={{ fontSize: 16 }} label={('Medium')} value={2} />
          <Picker.Item style={{ fontSize: 16 }} label={('High')} value={3} />
        </Picker>
      </View>
      
    </View>
  );

  const PanelHotCold = (
    state.hotFirst ?
      <View>
        {hotLine}
        {coldLine}
      </View> :
      <View>
        {coldLine}
        {hotLine}
      </View>
  );

  const NumCycleLine = (
    <View style={[styles.settingLine]}>
      <Text style={[globalStyles.BlackText]}>{('Cycles')}</Text>
      <View style={[styles.selectorBG]}>
        <Picker
        style={styles.picker}
          mode='dropdown'
          selectedValue={state.numCycles}
          onValueChange={(itemValue: any) =>{
            if (itemValue == state.numCycles){
                return;
            }
            handleValueChange('numCycles', itemValue)}}
        >
          {generatePickerItems(globalVars.numCycleRange[0], globalVars.numCycleRange[1])}
        </Picker>
      </View>
      
    </View>
  );

  let content;
  switch (state.modeHotCold) {
    case 1:
      content = (
        <View>
          {hotLine}
          {tempLine}
        </View>
      );
      break;

    case 2:
      content = (
        <View>
          {coldLine}
        </View>
      );
      break;

    case 3:
      content = (
        <View>
          {PanelHotCold}
          {tempLine}
          {NumCycleLine}
        </View>
      );
      break;
  }

  return (
    <ScrollView>
      <View>
        <TouchableOpacity onPress={() => { navigation.navigate("SettingsScreen") }}>
          <Text style={[globalStyles.BlackText,{fontSize:20}]}>{"\n  < Back"}</Text>
        </TouchableOpacity>
        {/* <Text style={[globalStyles.BlackText]}>{("Customization")}</Text> */}
        <View style={[globalStyles.panel]}>

          <View style={[]}>
            <Text style={[globalStyles.BlackText]}>{('Name')}</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text: any) => handleValueChange('title', text)}
              value={state.title}
              placeholder={('InputName')}
            />
          </View>

          <View style={[styles.settingLine]}>
            <RadioGroup
              layout='row'
              containerStyle={{ alignItems: 'flex-start', marginBottom: 10, marginTop: 10, width: '100%' }}
              labelStyle={{ fontSize: 20, color: 'black' }}
              radioButtons={state.radioButtons}
              onPress={(selectWhat: any) => {
                reset();
                handleValueChange('modeHotCold', selectWhat);
                if (selectWhat !== '3') {
                  handleValueChange('numCycles', 1);
                } else {
                  handleValueChange('numCycles', 3);
                }
              }}
              selectedId={(state.modeHotCold).toString()}
            />
          </View>

          {state.modeHotCold === 3 ?
            <View>
              <View style={[styles.settingLine]}>
                <Switch
                  trackColor={{ false: "#767577", true: "#ff0000" }}
                  value={state.hotFirst}
                  onValueChange={(value) => {
                    if (value == state.hotFirst){
                        return;
                    }
                    handleValueChange('hotFirst', value)}}
                />
                <Text style={{ fontSize: 20, color: 'black' }}>{('Hot First')}</Text>
              </View>
              {pressureLine}
            </View> : pressureLine
          }

          {content}

          <View style={[styles.settingLine]}>
            <Text style={[globalStyles.BlackText]}>{('Total Time') + ": " + String(state.totalRunTime) + " " + ('min')}</Text>
          </View>

          <View style={[styles.settingLine, {justifyContent:'center'}]}>
            <TouchableOpacity style={[styles.squreButton, {backgroundColor: '#EE6F57',}]} onPress={() => { saveMode() }}>
              <Text style={[globalStyles.BlackText]}>{('Save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.squreButton, {backgroundColor: '#1F3C88',}]} onPress={() => { reset() }}>
              <Text style={[globalStyles.WhiteText]}>{('Reset')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


export default Customization;

const styles = StyleSheet.create({
    settingLine:{

        flexDirection:"row", 
        marginBottom: 5,
        alignItems: 'center',
        // height: 80,
        
        overflow: 'hidden',
    },
    squreButton:{
        borderRadius: 8,
        width: "40%",
        aspectRatio: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    selectorText:{
        color: 'black',
        fontSize: 16,
        alignSelf: 'center',
    },
    selectorBG:{
        backgroundColor: '#F6F5F5',
        borderRadius: 8,
        width: 150,
        justifyContent: 'flex-end',
        marginVertical: 10,
    },
    picker: {
        height: 50, // Adjust height to reduce space
        justifyContent: 'center',
      },
});