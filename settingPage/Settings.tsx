import { Text, StyleSheet, View, TouchableOpacity, Switch, TouchableOpacityComponent, TextInput, Alert, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { globalVals, globalStyles, storage, eventEmitter } from '../GlobalVars'
import {Picker} from '@react-native-picker/picker';
import { Image } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import Clipboard from '@react-native-clipboard/clipboard';
import i18n from '../locales/index';
import RNRestart from 'react-native-restart'; 


interface SettingProps {
    navigation: any;
}

interface CustomProps {
    title: string;
    navigateTo:string;
    navigation: any;
}


// 自定义页面细节
export class CustomPage extends Component<SettingProps, {temperature:number, hotDur:number, coldDur:number, pressure:number, modeHotCold:string, radioButtons:{ id: string; label: string }[], totalRunTime:number, numCycles:number, title:string, hotFirst: boolean}> {
    constructor(props: SettingProps) {
        super(props);
        this.state = {
            modeHotCold: '3',
            temperature: 48,
            hotDur: 2,
            coldDur: 3,
            pressure: 3,
            numCycles: 3,
            totalRunTime: 0,
            title: '',
            hotFirst: false,
            radioButtons: [
                { id: '1', label: i18n.t('Hot') },
                { id: '2', label: i18n.t('Cold') },
                { id: '3', label: i18n.t('Both') },
            ],
        };
    }
    

    reset = () => {
        this.setState({
            title: '',
            modeHotCold: '3',
            temperature: 48,
            hotDur: 2,
            coldDur:3,
            numCycles: 3,
        });
    }

    generatePickerItems = (a:number, b:number) => {
        const items = [];
        for (let i = a; i <= b; i++) {
          items.push(<Picker.Item style={{fontSize:15}} key={i} label={String(i)} value={i} />);
        }
        return items;
    };

    calcActionList = () => {
        let actionList = [];
        let hotDur = this.state.hotDur;
        let coldDur = this.state.coldDur;
        let numCycles = this.state.numCycles;
        let modeHotCold = this.state.modeHotCold;
        if (modeHotCold=='3'){
            for (let i = 0; i < numCycles; i++) {
                if (this.state.hotFirst){
                    actionList.push([hotDur, true]);
                    actionList.push([coldDur, false]);
                }
                else{
                    actionList.push([coldDur, false]);
                    actionList.push([hotDur, true]);
                }
            }
        }else if (modeHotCold=='1'){
            actionList.push([hotDur, true]);
        }else if (modeHotCold=='2'){
            actionList.push([coldDur, false]);
        };
        return actionList;
    }

    saveMode = () => {
        const currentDate = new Date();
        storage.save({
            key: 'modes',
            id: currentDate.toString(),
            data: {
                title:this.state.title? this.state.title: 'Custom Mode',
                totalRunTime: this.state.totalRunTime,
                temperature: this.state.temperature,
                pressure: this.state.pressure,
                actionList: this.calcActionList(),
                timeId: currentDate.toString(),
                locked: false,
                automode: false,
                hotFirst: this.state.hotFirst,
              },
          }).then(() => {
            this.props.navigation.navigate('SettingsScreen');
            this.props.navigation.navigate('Mode');
            eventEmitter.emit('refreshModes');
          });
    }

    calc_totalRunTime = () => {
        if (this.state.modeHotCold=='3'){
            this.setState({totalRunTime: (this.state.hotDur+this.state.coldDur)*this.state.numCycles});
        }else if (this.state.modeHotCold=='1'){
            this.setState({totalRunTime: this.state.hotDur*this.state.numCycles});
        }else if (this.state.modeHotCold=='2'){
            this.setState({totalRunTime: this.state.coldDur*this.state.numCycles});
        };
    }

    componentDidMount() {
        this.calc_totalRunTime();
        this.reset();
        
    }

    componentDidUpdate(prevProps:any, prevState:any, ) {
        if (this.state.modeHotCold !== prevState.modeHotCold || this.state.hotDur !== prevState.hotDur || this.state.coldDur !== prevState.coldDur || this.state.numCycles !== prevState.numCycles) {
            this.calc_totalRunTime();
        }
    }

  render() {
    let hotLine = (
    <View>
        <View style={[styles.settingLine]}>
            <Image source={require('../assets/hot.png')} style={{aspectRatio: 1, width: "12%", alignSelf: 'center'}} fadeDuration={100}/>
            <Text>  </Text>
            <View style={[styles.selectorBG]}>
                <Picker
                    mode='dropdown'
                    selectedValue={this.state.hotDur}
                    onValueChange={(itemValue, itemIndex) =>
                        {
                            this.setState({hotDur: itemValue});
                        }
                    }>
                    {this.generatePickerItems(globalVals.hotDurationRange[0], globalVals.hotDurationRange[1])}
                </Picker>
            </View> 
            <Text style={[styles.selectorText]}>{i18n.t("min")}</Text>
        </View>
        <View style={[styles.settingLine]}>
            <Text>            </Text>
                <View style={[styles.selectorBG]}>
                <Picker
                    mode='dropdown'
                    selectedValue={this.state.temperature}
                    onValueChange={(itemValue, itemIndex) =>
                        {
                            this.setState({temperature: itemValue});
                        }
                    }>
                    {this.generatePickerItems(globalVals.temperatureRange[0], globalVals.temperatureRange[1])}
                </Picker>
            </View> 
            <Text style={[styles.selectorText]}>{"\u2103"}</Text>
        </View>
    </View>
    );

    let coldLine = (
    <View>
        <View style={[styles.settingLine]}>
            <Image source={require('../assets/cold.png')} style={{aspectRatio: 1, width: "12%", alignSelf: 'center'}} fadeDuration={100}/>
            <Text>  </Text>
            <View style={[styles.selectorBG]}>
                <Picker
                    
                    mode='dropdown'
                    selectedValue={this.state.coldDur}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({coldDur: itemValue})}>
                    {this.generatePickerItems(globalVals.hotDurationRange[0], globalVals.hotDurationRange[1])}
                </Picker>
            </View> 
            <Text style={[styles.selectorText]}>{i18n.t("min")}</Text>
        </View>
        <View style={[styles.settingLine]}>
            {/* <Image source={require('../assets/compression.png')} style={{aspectRatio: 1, width: "12%", alignSelf: 'center'}} fadeDuration={100}/>
            <Text>  </Text> */}
            <Text>            </Text>
            <View style={[styles.selectorBG]}>
                <Picker
                    mode='dropdown'
                    selectedValue={this.state.pressure}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({pressure: itemValue})}>
                    <Picker.Item style={{fontSize:16}} label={i18n.t('P1')} value={1} />
                    <Picker.Item style={{fontSize:16}} label={i18n.t('P2')} value={2} />
                    <Picker.Item style={{fontSize:16}} label={i18n.t('P3')} value={3} />
                </Picker>
            </View>   
            <Text style={[styles.selectorText]}>{i18n.t("Pressure")}</Text>
        </View>
    </View>

);

    let content;
    switch (this.state.modeHotCold) {
        case '1':
        content = hotLine;
        break;
        case '2':
        content = coldLine;
        break;
        case '3':
        content = (
        <View>
            {
                this.state.hotFirst?
                <View>
                    {hotLine}
                    {coldLine}
                </View>:
                <View>
                    {coldLine}
                    {hotLine}
                </View>
            }
            
            
            <View style={[styles.settingLine]}>
                    <Text style={[styles.selectorText]}>{i18n.t("Conduct")}</Text>
                        <View style={[styles.selectorBG]}>
                            <Picker
                                mode='dropdown'
                                selectedValue={this.state.numCycles}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({numCycles: itemValue})
                                }>
                                {this.generatePickerItems(globalVals.numCycleRange[0], globalVals.numCycleRange[1])}
                            </Picker>
                        </View> 
                    <Text style={[styles.selectorText]}>{i18n.t("Cycles")}</Text>
                </View>
        </View>);
    }

    return (
        <ScrollView>
        <View style={[globalStyles.page]}>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("SettingsScreen")}}>
                <Text style={[styles.ButtonText]}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={[styles.ButtonText]}>{i18n.t("Customization")}</Text>
            <View style={[styles.panel]}>

                <View style={[styles.settingLine]}>
                    <Text style={[styles.selectorText]}>{i18n.t('Name')}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {this.setState({ title: text })}}
                        value={this.state.title}
                        placeholder={i18n.t('InputName')}
                    />
                </View>

                <View style={[styles.settingLine]}>
                    <RadioGroup 
                        layout='row'
                        containerStyle={{alignItems: 'flex-start', marginBottom: 10, marginTop: 10, width: '100%'}}
                        labelStyle={{fontSize: 20, color: 'black', }}
                        radioButtons={this.state.radioButtons} 
                        onPress={(selectWhat)=>{
                            this.setState({modeHotCold: selectWhat});
                            if (selectWhat!='3'){
                                this.setState({numCycles: 1});
                            }
                        }}
                        selectedId={this.state.modeHotCold}
                    />
                    
                    
                </View>
                    {this.state.modeHotCold=='3'?
                    <View  style={[styles.settingLine]}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#ff0000" }}
                            value={this.state.hotFirst}
                            onValueChange={(value) => {
                                this.setState({
                                    hotFirst: value,
                                });
                            }} />
                    <Text style={{fontSize: 20, color: 'black', }}>{i18n.t('HotFirst')}</Text>
                </View>:null
                    }
                
                {content}

               
                <View style={[styles.settingLine]}>

                    <Text style={[styles.selectorText]}>{i18n.t('TotalTime')+": "+String(this.state.totalRunTime)+" "+i18n.t('min')}</Text>
                    
                </View>


                

                <View style={[styles.settingCenter]}>
                    

                    <TouchableOpacity style={[exStyles.saveButton]} onPress={()=>{this.saveMode()}}>
                        <Text style={[styles.smallButtonText]}>{i18n.t('Save')}</Text>
                    </TouchableOpacity>
   
                    

                    <TouchableOpacity style={[exStyles.resetButton]} onPress={()=>{this.reset()}}>
                    
                        <Text style={[styles.smallButtonText]}>{i18n.t('Reset')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View> 
        </ScrollView>
    )
  }
}


// 设置页面的基础组件
export class CustomBase extends Component<CustomProps, {}> {
    constructor(props: CustomProps) {
        super(props);
    }

  render() {
    return (
    <TouchableOpacity onPress={()=>{this.props.navigation.navigate(this.props.navigateTo)}}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:1, borderBlockColor:'lightgrey'}}>
            <Text style={[styles.settingButtonText]}>{this.props.title}</Text>
            <Text style={[styles.ButtonHandler]}>{">"}</Text>
        </View>
    </TouchableOpacity>
    )
  }
}


// 设置语言
export class SetLanguage extends Component<SettingProps, {language:string}> {
    constructor(props: SettingProps) {
        super(props);
        this.state = {
            language: 'en',
        };
    }

    componentDidMount(): void {
        storage.load({
            key: 'settings',
            id: 'language',
        }).then((ret) => {
            this.setState({language: ret});
        }).catch((err) => {
            this.setState({language: 'en'});
        });
        
    }

  render() {
    return (
    <View style={[styles.selectorBG2]}>
        <Picker
            mode='dropdown'
            selectedValue={this.state.language}
            onValueChange={(itemValue, itemIndex) =>
                {
                    this.setState({language: itemValue});
                    storage.save({
                        key: 'settings',
                        id: 'language',
                        data: itemValue,
                    }).then(() => {
                        console.log('Language changed to '+itemValue);
                        RNRestart.Restart();
                    });
                    // i18next.changeLanguage(itemValue);
                    // Alert.alert(
                    //     'Please restart the app to apply the language change.',)
                }
            }>
            <Picker.Item style={{fontSize:15}} label="English" value="en" />
            <Picker.Item style={{fontSize:15}} label="中文" value="zh" />
            
        </Picker>
    </View> 
    )
  }
}

// 帮助与反馈
export class HelpAndFeedBack extends Component<SettingProps, {}> {
    constructor(props: SettingProps) {
        super(props);
    }

  render() {
    return (
        <TouchableOpacity onLongPress={()=>{
            Clipboard.setString('22038367r@connect.polyu.hk');
            Alert.alert(i18n.t('CopyEmail'));
        }}>
            <View style = {{alignItems:'flex-start', justifyContent: 'space-between'}}>
                <Text style={[styles.settingButtonText]}>{i18n.t('HelpFeedback')}</Text>
                <Text style = {{alignItems:'flex-start', marginLeft:'5%'}}>{i18n.t('FeedBack')}</Text>
            </View>
        </TouchableOpacity>
    )
  }
}


// 设置页面总体
export default class Settings extends Component<SettingProps, {}> {
    constructor(props: SettingProps) {
        super(props);
    }


  render() { 
    return (
    <View style={[styles.panel]}>
        <CustomBase title={i18n.t("Customization")} navigateTo={"CustomScreen"} navigation={this.props.navigation}/>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:1, borderBlockColor:'lightgrey'}}>
            <Text style={[styles.settingButtonText]}>{i18n.t('Language')}</Text>
            <SetLanguage navigation={this.props.navigation}/>
        </View>
        <CustomBase title={i18n.t("UserManual")} navigateTo={"Settings"} navigation={this.props.navigation}/>
        <HelpAndFeedBack navigation={this.props.navigation}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        padding: 16,
        marginBottom: 16,
        justifyContent: 'space-evenly',
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 3,
        borderColor: 'gray',
        // paddingHorizontal: 10,
      },
    Button:{
        margin: 12,
        // padding: 8,
        marginLeft: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width:"100%",
        height: 50,
    },
    squreButton:{
        borderRadius: 8,
        width: "40%",
        aspectRatio: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonText:{
        color: 'black',
        fontSize: 30,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    settingButtonText:{
        color: 'black',
        fontSize: 30,
        alignSelf: 'flex-start',
        padding: 5,
    },
    ButtonHandler:{
        color: 'black',
        fontSize: 30,
        alignSelf: 'center',
    },
    selectorBG:{
        backgroundColor: '#F6F5F5',
        borderRadius: 8,
        width: 150,
    },
    selectorBGPressure:{
        backgroundColor: '#F6F5F5',
        borderRadius: 8,
        width: 110,
    },
    selectorBG2:{
        backgroundColor: '#F6F5F5',
        borderRadius: 8,
        width: 150,
        height: 50,
        alignSelf: 'center',
    },
    selectorText:{
        color: 'black',
        fontSize: 16,
        alignSelf: 'center',
    },
    settingLine:{
        flexDirection:"row", 
        marginBottom:"5%",
    },
    settingCenter:{
        flexDirection:"row", 
        marginBottom:"5%",
        marginHorizontal: '20%',
        justifyContent: 'space-between',

    },
    smallButtonText:{
        color: 'white',
        fontSize: 20,
    },
    divider: {
        height: 100, // 分隔线的高度
        backgroundColor: '#ffff', // 分隔线的颜色
        marginVertical: 10, // 分隔线上下的间距
        width: '100%',
      },
})

const exStyles = StyleSheet.create({
    ButtonTop:{
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        ...styles.Button,
    },
    ButtonBottom:{
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        ...styles.Button,
    },
    saveButton:{
        ...styles.squreButton,
        backgroundColor: '#1F3C88',
    },
    resetButton:{
        ...styles.squreButton,
        backgroundColor: '#EE6F57',
    },

})