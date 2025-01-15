import { Text, View, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image, Button, Animated, Vibration } from 'react-native';
import globalStyles from '../GlobalStyles';
import { useEffect, useRef, useState } from 'react';
import { globalVars, useBleStore, useRunningStore } from '../Store';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { writeDataToDevice } from '../BlueToothHandler';
import { eventEmitter} from '../Store';
import { screenWidth, screenHeight } from '../Store';


const disabledTime = 2000;


function TimerCircle() {
    const [seconds, setSeconds] = useState(-1);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
    
        if (seconds > 0) {
            useRunningStore.setState({countingDown: true});
            interval = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } else if (seconds === 0) {  
            useRunningStore.setState({countingDown: false});
            if (runningState.runningState === 0) {
                console.log('Failed to start');
            }
        }
    
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [seconds]);

    const runningState = useRunningStore((state: any) => state);


    useEffect(() => {
        eventEmitter.on('startRun', handleStartButton);
    }, []);


    const handleStartButton = (mode:any=1) => {
        if (useBleStore.getState().bleState != 3){
            eventEmitter.emit('shakeBleButton');
            return;
        }

        if (buttonDisabled){
            console.log('Button disabled');
            return;
        }
        
        let heater = runningState.heaterButtonOn?0x01:0x00;

        switch (runningState.runningState) {
            case 0:// 目前停止，然后开始
                writeDataToDevice([0xa1, 0x01, mode, heater, 0x00, 0x00, 0x00])
                console.log('mode: ', mode, 'heater: ', heater, 'start');
                setSeconds(7);
                break;
            case 1:// 目前运行，然后暂停
                writeDataToDevice([0xa1, 0x06, 0x02, heater, 0x00, 0x00, 0x00])
                eventEmitter.emit('triggerActionButtonAnimation', true);
                break;
            case 2:// 目前暂停，然后继续
                writeDataToDevice([0xa1, 0x06, 0x03, heater, 0x00, 0x00, 0x00])
                eventEmitter.emit('triggerActionButtonAnimation', false);
                break;
            default:
                break;
        }
        setButtonDisabled(true);
        setTimeout(() => {
            setButtonDisabled(false);
        }, disabledTime);
    }

    const handleStopButton = () => {
        // 未连接
        if (useBleStore.getState().bleState != 3){
            eventEmitter.emit('shakeBleButton');
            return;
        }
        // 连续点击
        if (buttonDisabled){
            console.log('Button disabled');
            return;
        }
        // 停止中
        if (runningState.runningState == 0){
            return;
        }
        let heater = runningState.heaterButtonOn?0x01:0x00;
        writeDataToDevice([0xa1, 0x01, 0x00, heater, 0x00, 0x00, 0x00]);
        setButtonDisabled(true);
        setTimeout(() => {
            setButtonDisabled(false);
        }, disabledTime);
    }

    const startButton = () => {
        switch (runningState.runningState) {
            case 0:
                return <Image source={require('../../assets/start.png')} style={[styles.button]} />;
            case 1:
                return <Image source={require('../../assets/pause.png')} style={[styles.button]} />;
            case 2:
                return <Image source={require('../../assets/start.png')} style={[styles.button]} />;
            
            default:
                return <Image source={require('../../assets/start.png')} style={[styles.button]} />;
        }
    }

    const fill = runningState.fill;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const positionValue = useRef(new Animated.Value(1)).current;

    const startButtonRef = useRef<TouchableOpacity>(null);

    const [originalPosition, setOriginalPosition] = useState<number[]>([100, 100, 100, 100, 100, 100]);

    const handleLayout = () => {
        if (!startButtonRef.current) return;
        startButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setOriginalPosition([fx, fy, width, height, px, py]);
        // console.log(fx, fy, width, height, px, py);
        });
      };
    
    useEffect(() => {
        // 监听事件
        const listener = (active: boolean) => {
            // console.log(screenWidth*0.5,originalPosition[4],35);
            if (active){
                Animated.parallel([
                    Animated.timing(scaleValue, {
                      toValue: 0,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                    Animated.timing(positionValue, {
                      toValue: screenWidth*0.5-originalPosition[4]-50,
                      duration: 300,
                      useNativeDriver: true,
                    }),
                  ]).start(() => {
                    // scaleValue.setValue(1);
                    // positionValue.setValue(1);
                  });
                }else{
                    Animated.parallel([
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                        Animated.timing(positionValue, {
                          toValue: 0,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                      ]).start(() => {
                      });
                }
          
        };
    
        eventEmitter.on('triggerActionButtonAnimation', listener);

        return () => {
            eventEmitter.removeListener('triggerActionButtonAnimation');
        };
      }, []);

    const normalView = () => {
        return (
        <View style={{alignItems:"center"}}>
            <Text style={[styles.TitleText]}>
                {runningState.drainOn?'Draining':'Timer'}
            </Text>
            {/* <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{
                    eventEmitter.emit('triggerActionButtonAnimation', true);
                }}>
                    <View style={{height: 60, width: 60, backgroundColor: 'red'}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    eventEmitter.emit('triggerActionButtonAnimation', false);
                }}>
                    <View style={{height: 60, width: 60, backgroundColor: 'green'}} />
                </TouchableOpacity>
            </View> */}
            <Text style={[styles.NumberText]}>
                {
                    runningState.runningState==0?
                    '00:00':
                    String(Math.floor(runningState.timeRemaining / 60)).padStart(2, '0') + ':' + String(runningState.timeRemaining%60).padStart(2, '0')}
            </Text>
            <View style={{flexDirection:"row", padding:10, flex: 1,}}>
                <Animated.View style={{ transform: [{ translateX: positionValue }] }}>
                    <TouchableOpacity  
                    ref={startButtonRef} 
                     onLayout={handleLayout}
                    onPress={()=>{
                        handleStartButton();
                    }}>
                        {startButton()}
                    </TouchableOpacity>
                </Animated.View>
                {/* {runningState.runningState==2?
                null: */}
                <Animated.View style={ {transform: [{ scale: scaleValue }]} }>
                    <TouchableOpacity onPress={()=>{
                        handleStopButton();
                    }}>
                        <Image source={require('../../assets/stop.png')} style={[styles.button]} />
                    
                        
                    </TouchableOpacity>
                </Animated.View>
                {/* } */}
            </View>
        </View>
        )
    }

    return ( 
        <View>
            <AnimatedCircularProgress
                size={globalVars.deviceWidth*0.9}
                width={20}
                fill={fill}
                rotation={0}
                tintColor={runningState.drainOn?'#00ad3a':(runningState.curHotCold==1?'#ff0000':'#00e0ff')}
                duration={0}
                lineCap="round"
                backgroundColor="#3d5875" />
            <View style={styles.TextContainer}>
                {(seconds>0)?
                <View style={{alignItems:"center"}}>
                    <Text style={[styles.TitleText]}>Loading</Text>
                    <Text style={[styles.NumberText]}>
                        {String(seconds).padStart(2, '0')}
                    </Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>:
                normalView()}
            </View>
        </View>
     );
}

export default TimerCircle;


const styles = StyleSheet.create({
    TextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
        
    },
    button:{
        width: 70, 
        height: 70, 
        alignSelf: 'center', 
        marginHorizontal: 10,
    },
    TitleText: {
        fontSize: 40, 
        color: 'black', 
        fontFamily:'Courier'
    },
    NumberText: {
        fontSize: 70, 
        color: 'black', 
        fontFamily:'Courier'
    }
});