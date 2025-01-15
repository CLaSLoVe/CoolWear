import { Text, View, Switch } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { useBleStore, useRunningStore, buttonDisabledStore } from '../Store';
import { writeDataToDevice } from '../BlueToothHandler';

const disabledTime = 1000;


export default function HeaterPicker() {
    const runningState = useRunningStore((state: any) => state);
    const bleState = useBleStore((state: any) => state);
    const buttonDisabled = buttonDisabledStore((state: any) => state.disabled);
    const setButtonDisabled = buttonDisabledStore((state: any) => state.setButtonDisabled);
    const [localHeaterOn, setLocalHeaterOn] = useState(runningState.heaterButtonOn);

    useEffect(() => {
        setLocalHeaterOn(runningState.heaterButtonOn);
    }, [runningState.heaterButtonOn]);

    const handleValueChange = (value: any) => {
        if (value == localHeaterOn) {
            return;
        }
        let onH = value ? 0x01 : 0x00;
        let onD = runningState.drainButtonOn ? 0x01 : 0x00;
        setLocalHeaterOn(value);

        // setTimeout(() => {
        //     if (runningState.heaterButtonOn !== value) {
        //         setLocalHeaterOn(runningState.heaterButtonOn);
        //     }
        // }, 3000);

        writeDataToDevice([0xa1, 0x02, onD, onH, 0x00, 0x00, 0x00]);
        console.log('Heater button pressed');
        setButtonDisabled();
        
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center", marginRight:20 }}>
            <Switch
                trackColor={{ false: "#767577", true: "#ff0000" }}
                value={localHeaterOn}
                disabled={buttonDisabled || bleState.bleState != 3 || runningState.runningState != 0 || runningState.countingDown}
                onValueChange={handleValueChange}
            />
            <View style={{ justifyContent: "center" }}>
                <Text style={[globalStyles.BlackText, { padding: 10 }]}>Heater</Text>
            </View>
        </View>
    );
}