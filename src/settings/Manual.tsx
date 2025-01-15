import { Text, View, Switch } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { useBleStore, useRunningStore, buttonDisabledStore, RouterProps } from '../Store';
import { writeDataToDevice } from '../BlueToothHandler';



const Manual: React.FC<RouterProps> = ({ navigation}) => {
    return ( 
        <View></View>
     );
}

export default Manual;