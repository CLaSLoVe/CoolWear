import { Text, View, TouchableOpacity, StyleSheet,} from 'react-native';
import globalStyles from '../GlobalStyles';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { eventEmitter, globalVars, screenHeight, screenWidth, storage, useBleStore } from '../Store';
import { connectToNamedDevice } from '../BlueToothHandler';




function VisionCamera() {
    const [permission, setPermission] = useState<'authorized' | 'denied' | 'not-determined' | null>(null);
    const [device, setDevice] = useState<CameraDevice | null>(null);

    const cameraDevice = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isCameraActive, setIsCameraActive] = useState(true);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes:any) => {
            if (isCameraActive){
                setIsCameraActive(false);
                useBleStore.setState({cameraShown: false});
                onSuccess(codes[0]);
            }
        }
    });

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            setPermission(status ? 'authorized' : 'denied');
        })();
    }, [requestPermission]);

    useEffect(() => {
        if (permission === 'authorized') {
            setDevice(cameraDevice || null); // Ensure device is CameraDevice or null
        }
    }, [permission, cameraDevice]);

    if (permission === 'not-determined' || permission === null) {
        return (
            <View style={globalStyles.fullPage}>
                <Text style={globalStyles.WhiteText}>{'RequestingPermission'}</Text>
            </View>
        );
    }

    if (permission === 'denied') {
        return (
            <View style={globalStyles.fullPage}>
                <Text style={globalStyles.WhiteText}>{'PermissionDenied'}</Text>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={globalStyles.fullPage}>
                <Text style={globalStyles.WhiteText}>{'NoCamera'}</Text>
            </View>
        );
    }


    const onSuccess = (e: {value:any}) => {
        const prefix = "coolwear-";
        if (e.value.startsWith(prefix)) {
            globalVars.name = 'CoolWear_'+e.value.slice(-5).replace(':', '');
            storage.save({
                key: 'ble',
                id: 'name',
                data: globalVars.name,
            });
            console.log('Scanned:', globalVars.name);
            connectToNamedDevice(globalVars.name)
        }
    }


    const cancelScan = () => {
        setIsCameraActive(false);
        useBleStore.setState({cameraShown: false}, );
        console.log('cancel scan');
        eventEmitter.emit('triggerScanButtonAnimation', false);
    }

    const activateScan = () => {
        setIsCameraActive(true);
        console.log('activate scan');
    }

    return (
        <View style={[globalStyles.fullPage]}>
            <Camera
                style={styles.cameraView}
                device={device}
                isActive={isCameraActive}
                codeScanner={codeScanner}
                enableZoomGesture={true}
            />
            <View style={{alignItems:'center'}}>
                <Text style={[globalStyles.BlackText]}>{'Pinch to Zoom'}</Text>
            </View>
            <TouchableOpacity onPress={cancelScan}>
                <View style={[globalStyles.BlueButton]}>
                <Text style={[globalStyles.WhiteText]}>{'Cancel Scan'}</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
}

export function QrButton() {


    return (         
        <View style={[
            ]}>
            <TouchableOpacity 
                onPress={() => {
                    useBleStore.setState({cameraShown: true});
                }}>
                <View style={[globalStyles.BlueButton]}>
                    <Text style={[globalStyles.WhiteText]}>Scan</Text>
                </View>
            </TouchableOpacity>
        </View>

     );
}

export default VisionCamera;


const styles = StyleSheet.create({
    absoluteFill: {
      ...StyleSheet.absoluteFillObject,
    //   backgroundColor: 'white'
    },
    cameraView: {
        width: screenWidth,
        height: screenHeight*0.6,
    },

  });