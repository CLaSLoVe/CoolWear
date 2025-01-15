import { Text, View } from 'react-native';
import { eventEmitter, RouterProps, storage } from '../Store';
import {CustomBase, HelpAndFeedBack} from './SettingLines';
import globalStyles from '../GlobalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';




const SettingsPage: React.FC<RouterProps> = ({ navigation}) => {


    const deleteAllModes = async () => {
        const modes = await storage.getAllDataForKey('modes');
        // console.log(modes);
        for (const mode of modes) {
          await storage.remove({
            key: 'modes',
            id: mode.timeId,
          });
        }
        eventEmitter.emit('refreshModes');
      };

    return ( 
        
        <View style={[globalStyles.panel]}>
            <CustomBase title={'Customization'} navigateTo={'CustomScreen'} navigation={navigation} />
            <CustomBase title={'Manual'} navigateTo={'ManualScreen'} navigation={navigation} />
            {/* <HelpAndFeedBack /> */}
            {/* <TouchableOpacity onPress={deleteAllModes}>
                <View style={{backgroundColor: 'red', padding: 10, margin: 10}}>
                    <Text style={{color: 'white'}}>Delete All Modes</Text>
                </View>
            </TouchableOpacity> */}
        </View>
        
     );
}
export default SettingsPage;