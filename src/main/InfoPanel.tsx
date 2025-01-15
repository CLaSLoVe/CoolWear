import { Text, View, Switch, Image, StyleSheet } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { buttonDisabledStore, useBleStore, useRunningStore } from '../Store';
import { writeDataToDevice } from '../BlueToothHandler';
import { Picker } from '@react-native-picker/picker';
import { combine } from 'zustand/middleware';


function InfoPanel() {
    const runningState = useRunningStore((state: any) => state);
    const bleState = useBleStore((state: any) => state);
    const [localPressureOn, setLocalPressureOn] = useState(runningState.compressionState);
    useEffect(() => {
        setLocalPressureOn(runningState.compressionState);
    }, [runningState.compressionState]);

    const handleValueChange = (value: any) => {
        if (value == localPressureOn){
            return;
        }
        setLocalPressureOn(value);
        // console.log(value, runningState.compressionState, localPressureOn);
        writeDataToDevice([0xa1, 0x04, value-1, 0x00, 0x00, 0x00, 0x00]);
        console.log('Pressure button pressed');
    }

    return ( 
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center', height: 180}}>
            <View style={{width:'50%'}}>
                <View style={[styles.container]}>
                    <Image source={require('../../assets/hot.png')} style={[styles.icon]} />
                    <Text style={[styles.text]} numberOfLines={1} adjustsFontSizeToFit>{runningState.hotTemperature}</Text>
                    <Text style={[styles.oC]}>{'\u2103'}</Text>  
                </View>
                <View style={[styles.container]}>
                    <Image source={require('../../assets/cold.png')} style={[styles.icon]} />
                    <Text style={[styles.text]} numberOfLines={1} adjustsFontSizeToFit>{runningState.coldTemperature}</Text>
                    <Text style={[styles.oC]}>{'\u2103'}</Text>  
                </View>
            </View>
            <View style={[{width:'50%', flexDirection:'row', alignItems:'center', justifyContent:'center'}]}>
                <Image source={require('../../assets/compression.png')} style={[styles.icon]} />
                <Picker
                    style={{width: '50%'}}
                    mode='dropdown'
                    selectedValue={localPressureOn}
                    onValueChange={(itemValue, itemIndex) =>
                        {
                            handleValueChange(itemValue);
                        }
                    }>
                    <Picker.Item style={{fontSize:22}} label={'Low'} value={1} />
                    <Picker.Item style={{fontSize:22}} label={"Medium"} value={2} />
                    <Picker.Item style={{fontSize:22}} label={'High'} value={3} />
                    
                </Picker>
                {(runningState.runningState==0 && bleState.bleState==3 && !runningState.countingDown)?null:(
                    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' }} />
                )}
            </View>
        </View>
     );
}

export default InfoPanel;


const styles = StyleSheet.create({
    icon:{
        height: 50, width: 50, alignSelf: 'center'
    },
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // width: "50%"
        padding: 10,
    },
    text:{
        fontSize: 30,
        marginHorizontal: 20,
        minWidth: '30%',
        maxWidth: '30%',
        textAlign: "right"
    },
    oC:{
        fontSize: 20,
    }
});