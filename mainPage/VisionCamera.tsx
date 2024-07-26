import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Camera, CameraDevice, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import i18n from '../locales/index';

import { Toast } from 'react-native-toast-notifications';
import { eventEmitter, storage } from '../GlobalVars';


const { width, height } = Dimensions.get('window');




export default function VisionCamera() {
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
                onSuccess(codes[0]);
            }
        }
    })



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
            <View style={styles.overlayView}>
                <Text style={styles.whiteText}>{i18n.t('RequestingPermission')}</Text>
            </View>
        );
    }

    if (permission === 'denied') {
        return (
            <View style={styles.overlayView}>
                <Text style={styles.whiteText}>{i18n.t('PermissionDenied')}</Text>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={styles.overlayView}>
                <Text style={styles.whiteText}>{i18n.t('NoCamera')}</Text>
            </View>
        );
    }


    const onSuccess = (e: {value:any}) => {
        const prefix = "coolwear-";
        
        if (e.value.startsWith(prefix)) {
            Toast.show(i18n.t('IsCW'), {
                type: "success",
                placement: "bottom",
                duration: 5000,
                animationType: "zoom-in",
              });
            storage.save({
                key: 'settings',
                id: 'uuid',
                data: e.value.slice(prefix.length),
              }).then(() => {
                console.log('UUID saved: ', e.value);
                eventEmitter.emit('QRScanned', true);
              });
        }else{
            Toast.show(i18n.t('NotCW'), {
                type: "warning",
                placement: "bottom",
                duration: 2000,
                animationType: "zoom-in",
              });
              eventEmitter.emit('QRScanned', false);
        }
    }



    const cancelScan = () => {
        setIsCameraActive(false);
        eventEmitter.emit('QRScanned', false);
        console.log('cancel scan');
    }

    const activateScan = () => {
        setIsCameraActive(true);
        console.log('activate scan');
    }

    return (
        <View style={[styles.overlayView]}>
            <Camera
                style={styles.absoluteFill}
                device={device}
                isActive={isCameraActive}
                codeScanner={codeScanner}
            />
            <TouchableOpacity onPress={cancelScan}>
                <View style={[styles.buttonTouchable]}>
                <Text style={[styles.whiteText]}>{i18n.t('CancelScan')}</Text>
                </View>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={activateScan}>
                <View style={[styles.buttonTouchable]}>
                <Text style={[styles.whiteText]}>Activate</Text>
                </View>
            </TouchableOpacity> */}

        </View>
    );
}

const styles = StyleSheet.create({
    absoluteFill: {
        width: width,
        height: height*0.6,
    },
    whiteText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
    overlayView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTouchable: {
        backgroundColor:'orange',
        marginVertical:20,
        height:height*0.07,
        width: width*0.5,
        borderRadius:20,
        alignContent:'center',
        justifyContent:'center',
    },
});