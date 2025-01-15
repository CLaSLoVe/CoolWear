import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalStyles from '../GlobalStyles';
import { useEffect, useState } from 'react';
import { globalVars, NavigateProps, useBleStore, useRunningStore } from '../Store';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { writeDataToDevice } from '../BlueToothHandler';




export const CustomBase: React.FC<NavigateProps> = ({navigation, navigateTo, title }) => {
    const handlePress = () => {
        navigation.navigate(navigateTo);
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBlockColor: 'lightgrey'
            }}>
                <Text style={styles.settingButtonText}>{title}</Text>
                <Text style={styles.ButtonHandler}>{'>'}</Text>
            </View>
        </TouchableOpacity>
    );
};




export function HelpAndFeedBack (){

    const handleLongPress = () => {
        // Clipboard.setString('22038367r@connect.polyu.hk');
        // Alert.alert('copied');
    };

    return (
        <TouchableOpacity onLongPress={handleLongPress}>
            <View style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Text style={styles.settingButtonText}>{'HelpFeedback'}</Text>
                <Text style={{ alignItems: 'flex-start', marginLeft: '5%' }}>{'FeedBack'}</Text>
            </View>
        </TouchableOpacity>
    );
};





const styles = StyleSheet.create({
    settingButtonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: '5%',
    },
    ButtonHandler: {
        fontSize: 20,
        color: 'black',
        marginRight: '5%',
    },
});