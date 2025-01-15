import { Text, View, TouchableOpacity, Alert, ActivityIndicator, Animated, LayoutAnimation } from 'react-native';
import { 
    initializeBleManager,
    connectToNamedDevice,
    disconnectFromDevice,
} from '../BlueToothHandler';
import globalStyles from '../GlobalStyles';
import { useEffect, useRef, useState } from 'react';
import { globalVars, useBleStore, eventEmitter, screenWidth } from '../Store';

function BleButton() {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        initializeBleManager();

        const shakeAmp = 10;
        const shakeDuration = 30;

        const handleShakeEvent = () => {
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: shakeAmp, duration: shakeDuration, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -shakeAmp, duration: shakeDuration, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: shakeAmp, duration: shakeDuration, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -shakeAmp, duration: shakeDuration, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: shakeDuration, useNativeDriver: true })
            ]).start();
        };

        // Assuming you have a way to listen for the shake event
        const shakeListener = eventEmitter.addListener('shakeBleButton', handleShakeEvent);

        return () => {
            eventEmitter.removeListener('shakeBleButton');
        };}
    , []);

    const bleState = useBleStore((state: any) => state.bleState);

    const bleText = () => {
        switch (bleState) {
            case 0:
                return <Text style={[globalStyles.WhiteText]}>Connect</Text>;
            case 1:
            case 2:
                return <ActivityIndicator size="large" color="white" />
            case 3:
                return <Text style={[globalStyles.WhiteText]}>Disconnect</Text>;
            default:
                return <Text style={[globalStyles.WhiteText]}>Error</Text>;
        }
    
    }
                
    return ( 
        <View style={[
            ]}>
        <TouchableOpacity
            onPress={() => {
                if (bleState == 0){
                    connectToNamedDevice(globalVars.name);
                }else if (bleState == 3){
                    Alert.alert(
                        'Warning',
                        'Confirm Disconnect',
                        [  
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                },
                            {
                                text: 'OK',
                                onPress: async () => {
                                    await disconnectFromDevice(globalVars.uuid);
                                },
                            }
                        ])
                    }
            
            }}
            disabled={bleState == 1 || bleState == 2}
            >
            <Animated.View style={[globalStyles.BlueButton, { transform: [{ translateX: shakeAnim }] }]}>
                {bleText()}
            </Animated.View>
        </TouchableOpacity>
        </View>
     );
}

export default BleButton;