import { Text, StyleSheet, View, TouchableHighlight, ActivityIndicator, Dimensions, Easing, Image  } from 'react-native'
import React, { Component } from 'react'
import GlobalVars, { globalVals, connectToaster, startToaster, stopCurrentToaster, isRunningFlag } from '../GlobalVars';
import { eventEmitter } from '../GlobalVars';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BleManager from 'react-native-ble-manager';
import i18n from '../locales';
import FastImage from 'react-native-fast-image'
import { Toast } from 'react-native-toast-notifications';

const Full321 = 3000;
const oneSecond = 1000;

export default class ClockCircle extends Component<{}, {full_time:number, disabled:boolean, start_running: boolean, stop_running: boolean, timeRemaining:any, running_state:number, three_two_one:number, countingDown:boolean, curHotCold:number, cyclePercentage:number, heater:number, waiting:boolean}> {
  // timer: NodeJS.Timeout | undefined;
  screenWidth: number = 640;
  constructor(props: {}) {
    super(props);
    this.state = {
      full_time: 0,
      disabled: true, // 是否禁用按钮,true
      start_running: false,
      stop_running: false, 
      running_state: 0,  // 0: 停止 1: 运行 2: 暂停
      timeRemaining: 0, // 剩余时间
      curHotCold: 0, // 当前是热水还是冷水
      cyclePercentage: 0, // 当前周期百分比
      three_two_one: Full321, // 3 2 1 倒计时
      countingDown: false, // 是否正在倒计时
      heater: 0x00,
      waiting: false,
    };
  }

  // preLoadImages = async (imagePaths: any[]) => {
  //   imagePaths.forEach(async (path) => {
  //     await Image.prefetch(path);
  //   });
  // };

  componentWillUnmount(): void {
    
  }


  componentDidMount() {
    // const imagePaths = [
    //   '../assets/start.png',
    //   '../assets/pause.png',
    //   '../assets/stop.png'
    // ];
    
    // this.preLoadImages(imagePaths);

    this.setState({timeRemaining: this.state.full_time});    
    this.screenWidth = Dimensions.get('window').width;
    eventEmitter.on('Heater', (data: any) => {
      if (data){
        this.setState({ heater: 0x01 });
      } else {
        this.setState({ heater: 0x00 });
      };
      this.setState({ waiting: true });
      let timer = setInterval(() => {
        this.setState({ waiting: false });
        clearInterval(timer);
      }, globalVals.heaterWaitingTime);
    });
    eventEmitter.on('BLEConnection', (data: any) => {
      this.setState({ disabled: !data });
    });
    eventEmitter.on('ModeSelect', (data: any) => {
      if (this.state.running_state == 1){
        stopCurrentToaster();
        return
      }
      if (data.automode){
        this.manualMode(false, 0, false, 0, 0, 0);
        return
      }
      this.setState(
        { 
          full_time: data.totalRunTime*60, 
          timeRemaining: data.totalRunTime*60 
        },
        () => {
          let hotFirst = data.actionList[0][1];
          let numCycles = Math.floor(data.actionList.length/2);
          let coldTime = 0;
          let hotTime = 0;
          let temperature = data.temperature;
          if (data.actionList[0][1]){
            coldTime = data.actionList[1][0]
            hotTime = data.actionList[0][0]
          } else {
            hotTime = data.actionList[1][0]
            coldTime = data.actionList[0][0]
          }
          
          this.manualMode(true, numCycles, hotFirst, coldTime, hotTime, temperature)
        }
      );
    });
    eventEmitter.on('Notify', (data: any) => {
      console.log(data);
      this.setState({
        timeRemaining: data[1]*256 + data[2] + 1,
        curHotCold: data[8]>>4,
      });
      if (isRunningFlag(data[7])){
        if (data[8]%16 == 0){
          this.setState({running_state: 1,
            cyclePercentage: Math.round((data[10]*256+data[11])/(data[9]*60)*100),
            countingDown: false,
            three_two_one: Full321,
          });
          eventEmitter.emit('countingDown', false);
        }else{
          this.setState({running_state: 2});
        }
      } else {
        this.setState({running_state: 0,
          timeRemaining: data[1]*256 + data[2] + 1,
          cyclePercentage: 0
        });
      };
      // console.log(this.state.running_state);
    });
    // console.log(this.state.countingDown);
  }

  manualMode = async(on:boolean, numCycles:number, hotFirst:boolean, coldDur:number, hotDur:number, temperature:number) => {
    let success = false;
    // while (!success){
    //   try {
    //     await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x03, temperature, 0x00, 0x00, 0x00, 0x00]);
    //     console.log('设置温度为', temperature);
    //     success = true;
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // success = false;
    while (!success){
      try {
        await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa2, 0x01, on?0x01:0x00, hotFirst?0x01:0x00, numCycles, coldDur, hotDur]);
        console.log('设置为手动模式');
        success = true;
        this.startCW();
      } catch (error) {
        console.log(error)
      }
    }
  }


  formatTime(time: number){
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  start_timer = () => {
    if (this.state.running_state == 2){
      // this.setState({running_state: 1});
      return;
    } else if (this.state.running_state == 1){
      // this.setState({running_state: 2});
      return;
    }
    // 倒计时 321
    this.setState({
      countingDown: true,
      three_two_one: Full321,
    });

    eventEmitter.emit('countingDown', true);
    let cdTimer = setInterval(() => {
      this.setState({three_two_one: this.state.three_two_one-oneSecond});
      // console.log(this.state.three_two_one);
      // 倒计时结束
      if (this.state.three_two_one <= 0){
        clearInterval(cdTimer);
        // this.setState({countingDown: false, three_two_one: Full321});
        // 开始计时
        // this.timer = setInterval(() => {
        //   if (this.state.timeRemaining <= 0){
        //     this.stop_timer();
        //     return;
        //   }
        //   this.setState({
        //     timeRemaining: this.state.timeRemaining-1
        //   });
        // }, 1000);
        // this.setState({running_state: 1});
      }
    }, oneSecond);
     
  }

  pause_timer = () => {
    // clearInterval(this.timer);
    // this.setState({running_state: 2});
    // eventEmitter.emit('timerRunning', false);
    // console.log('Paused')
  }

  stop_timer = () => {
    // clearInterval(this.timer);
    this.setState({ 
      cyclePercentage: 0
    },
    () => {
      this.setState({ timeRemaining: this.state.full_time, running_state: 0},
         () => {}
        );
    });
    // eventEmitter.emit('timerRunning', false);
    // console.log('Stopped')
  }



  startCW = async() =>{
    if (this.state.disabled){
      connectToaster();
      return;
    }

    // console.log('startCW');
    // 目前运行，然后暂停
    if (this.state.running_state == 1){
      this.setState({start_running: true});
      this.pause_timer();
      let success = false;
      while (!success){
        try {
          await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x01, 0x02, this.state.heater, 0x00, 0x00, 0x00]);
          console.log('目前运行，然后暂停');
          success = true;
        } catch (error) {
          console.log(error)
        }
      }
      this.setState({start_running: false});
      return;
    // 目前暂停，然后继续
    } else if (this.state.running_state == 2){
      this.setState({start_running: true});
      this.start_timer();
      let success = false;
      while (!success){
        try {
          await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x01, 0x03, this.state.heater, 0x00, 0x00, 0x00]);
          console.log('目前暂停，然后继续');
          success = true;
        } catch (error) {
          console.log(error)
        }
      }
      this.setState({start_running: false});
      return;
    }
    // 目前停止，然后开始
    this.setState({start_running: true});
    let success = globalVals.tryTimes;
    while (success>=0){
      try {
        await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x01, 0x01, this.state.heater, 0x00, 0x00, 0x00]);
        console.log('目前停止，然后开始');
        this.setState({start_running: false});
        break;
      } catch (error) {
        success -= 1;
        console.log(error);
        if (success <= 0){
          this.setState({start_running: false});
          startToaster();
          break;
        }
      }
    }
    
    
    this.start_timer();
  };

  stopCW = async() =>{
    if (this.state.disabled){
      connectToaster();
      return;
    }
    // console.log('stopCW');
    let success = globalVals.tryTimes;
    this.setState({stop_running: true});
    while (success>=0){
      try {
        await BleManager.write(globalVals.CWid, globalVals.serviceid, globalVals.characteristicid, [0xa1, 0x01, 0x00, this.state.heater, 0x00, 0x00, 0x00]);
        console.log('停止');
        this.setState({stop_running: false});
        break;
      } catch (error) {
        success -= 1;
        console.log(error,success);
        if (success <= 0){
          this.setState({stop_running: false});
          startToaster();
          break;
        }
      }
    }
    
    this.stop_timer();
  }

  render() {
    return (
      <View>
        <View>
          <View style={[styles.container]}>
            <View style={[styles.Circle]}>
                <AnimatedCircularProgress
                    size={this.screenWidth*0.8}
                    width={20}
                    fill={this.state.cyclePercentage}
                    rotation={0}
                    tintColor={this.state.curHotCold==1?'#ff0000':'#00e0ff'}
                    duration={0}
                    lineCap="round"
                    easing={Easing.linear}
                    backgroundColor="#3d5875" />
            </View>
            {this.state.waiting ?
            <View style={[styles.TextContainer]}>
              <ActivityIndicator size="large" color="white" /> 
            </View>:
            this.state.countingDown ?
            <View style={[styles.TextContainer]}>
              <Text style={[styles.CountDownText]}>{Math.floor(this.state.three_two_one / 1000)}</Text> 
            </View>:
            <View style={[styles.TextContainer]}>
              <Text style={[styles.h5]}>
              {i18n.t("TimeRemaining")}
              </Text>
              <Text style={[styles.TimerText]}>
                {this.state.running_state==0? '--' : this.formatTime(this.state.timeRemaining)}
              </Text>
              <View   style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'  }}>
                <TouchableHighlight onPress={() => this.startCW()} style={[styles.startButton]}>
                  {this.state.start_running ? <ActivityIndicator size="large" color="white" /> : 
                  this.state.running_state == 0 ? 
                  <FastImage source={require('../assets/start.png')} style={{width: '100%', height: '100%', alignSelf: 'center'}}/> : 
                  this.state.running_state == 1 ? 
                  <FastImage source={require('../assets/pause.png')} style={{width: '100%', height: '100%', alignSelf: 'center'}}/>  : 
                  <FastImage source={require('../assets/start.png')} style={{width: '100%', height: '100%', alignSelf: 'center'}}/>}
                </TouchableHighlight>
                <TouchableHighlight onPress={this.stopCW} style={[styles.stopButton]}>
                {this.state.stop_running ? <ActivityIndicator size="large" color="white" /> : 
                <FastImage source={require('../assets/stop.png')} style={{width: '100%', height: '100%', alignSelf: 'center'}}/>}
                </TouchableHighlight>
              </View>
            </View>
            }
          </View>
        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 30,
  },
  TextContainer: {
    flexDirection: 'column',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  startButton:{
    // backgroundColor:'orange',
    height:60,
    width:60,
    borderRadius:60,
    alignContent:'center',
    justifyContent:'center',
    marginRight: 20,
  },
  stopButton:{
    // backgroundColor:'skyblue',
    height:60,
    width:60,
    borderRadius:60,
    alignContent:'center',
    justifyContent:'center',
  },
  WarnText:{
    color:'red',
    fontSize:20,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
    height:80,
  },
  CountDownText:{
    color:'black',
    fontSize:128,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
  },
  TimerText:{
    color:'black',
    fontSize:64,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
  },
  h5:{
    color:'black',
    fontSize:24,
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight:'bold',
  },
  Circle:{
    height:320,
    width:'90%',
    alignContent:'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
})