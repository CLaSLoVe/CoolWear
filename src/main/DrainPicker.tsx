import { Text, View, Switch } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { buttonDisabledStore, useBleStore, useRunningStore } from '../Store';
import { writeDataToDevice } from '../BlueToothHandler';

const disabledTime = 1000;

export default function DrainPicker() {
    const runningState = useRunningStore((state: any) => state);
    const bleState = useBleStore((state: any) => state);
    const buttonDisabled = buttonDisabledStore((state: any) => state.disabled);
    const setButtonDisabled = buttonDisabledStore((state: any) => state.setButtonDisabled);
    const [localDrainOn, setLocalDrainOn] = useState(runningState.drainButtonOn);

    useEffect(() => {
        setLocalDrainOn(runningState.drainButtonOn);
    }, [runningState.drainButtonOn]);

    const handleValueChange = (value: any) => {
        if (value == localDrainOn){
            return;
        }
        let onD = value ? 0x01 : 0x00;
        let onH = runningState.heaterButtonOn ? 0x01 : 0x00;
        setLocalDrainOn(value);

        writeDataToDevice([0xa1, 0x02, onD, onH, 0x00, 0x00, 0x00]);
        console.log('Drain button pressed');
        setButtonDisabled();
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Switch
                trackColor={{ false: "#767577", true: "#00e0ff" }}
                value={localDrainOn}
                disabled={buttonDisabled || bleState.bleState !== 3 || runningState.runningState !== 0 || runningState.countingDown}
                onValueChange={handleValueChange}
            />
            <View style={{ justifyContent: "center" }}>
                <Text style={[globalStyles.BlackText, { padding: 10 }]}>Drainage</Text>
            </View>
        </View>
    );
}