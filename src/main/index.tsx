import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BleButton from './BleButton';
import VisionCamera, {QrButton} from './QrButton';
import globalStyles from '../GlobalStyles';
import { eventEmitter, screenHeight, screenWidth, useBleStore } from '../Store';
import TimerCircle from './TimerCircle';
import HeaterPicker from './HeaterPicker';
import DrainPicker from './DrainPicker';
import InfoPanel from './InfoPanel';
import { useState, useRef, useEffect } from 'react';

function MainPage() {
    const cameraShown = useBleStore((state: any) => state.cameraShown);

    const [scrollEnabled, setScrollEnabled] = useState(false);
    // const containerRef = useRef<View | null>(null);

    useEffect(() => {
        // console.log(screenHeight);
        if (screenHeight > 670){
            setScrollEnabled(false);
        } else {
            setScrollEnabled(true);
        }
    }, []);

    // const onContentSizeChange = (contentWidth: any, contentHeight: number) => {
    //     // if (containerRef.current){
    //     //     containerRef.current.measure((width: any, height: number) => {
    //     //         setScrollEnabled(contentHeight > height);
    //     //     });
    //     // }
    //     console.log(contentHeight);
    //     if (contentHeight > 670){
    //         setScrollEnabled(false);
    //     }else{
    //         setScrollEnabled(true);
    //     }
    // };


    // const xValue = useRef(new Animated.Value(1)).current;
    const yValue = useRef(new Animated.Value(1)).current;
    const upValue = useRef(new Animated.Value(1)).current;
    const valueY = useRef(new Animated.Value(1)).current;

    // useEffect(() => {
    // // 监听事件
    // const listener = (active: boolean) => {
    //     if (active){
    //         Animated.parallel([
    //             Animated.timing(yValue, {
    //                 toValue: screenHeight,
    //                 duration: 300,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(upValue, {
    //                 toValue: -100,
    //                 duration: 300,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(valueY, {
    //                 toValue: 500,
    //                 duration: 300,
    //                 useNativeDriver: true,
    //             }),
    //             ]).start(() => {
    //             useBleStore.setState({cameraShown: true});
    //             });
    //         }else
    //             Animated.parallel([
    //                 Animated.timing(yValue, {
    //                     toValue: 0,
    //                     duration: 500,
    //                     useNativeDriver: true,
    //                 }),
    //                 Animated.timing(upValue, {
    //                     toValue: 0,
    //                     duration: 500,
    //                     useNativeDriver: true,
    //                 }),
    //                 Animated.timing(valueY, {
    //                     toValue: 0,
    //                     duration: 500,
    //                     useNativeDriver: true,
    //                 }),
    //                 ]).start(() => {
    //                 });
    //         }

    //     eventEmitter.on('triggerScanButtonAnimation', listener);

    //     return () => {
    //         eventEmitter.removeListener('triggerScanButtonAnimation');
    //     };
    //   }, []);


    return ( 
        // onContentSizeChange={onContentSizeChange}
        <ScrollView scrollEnabled={scrollEnabled}> 
        <View style={[globalStyles.fullPage]}>
            <View>
                <View style={{flexDirection:'row'}}>
                    <View style={[{width:'60%',top:5, left: 5}]}>
                        <BleButton />
                    </View>
                    <View style={[{width:'40%', top:5, right:5 }]}>
                        <QrButton />
                    </View>
                </View>
            </View>
            {
                cameraShown?
                <View style={[globalStyles.overlayView, {zIndex:10}]}>
                    <VisionCamera />
                </View>:null
            }
            <View>
            <View style={{alignItems:'center', padding:10}}>
                <TimerCircle />
            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <HeaterPicker />
                <DrainPicker  />
            </View>
            <InfoPanel />
            </View>
        </View>
        </ScrollView>
     );
}

export default MainPage;
