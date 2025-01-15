import { ScrollView, Text, View } from 'react-native';
import { RouterProps, storage, setInitModes, eventEmitter } from '../Store';
import Mode from './Mode';
import { useEffect, useState } from 'react';
import globalStyles from '../GlobalStyles';


export function EndPar() {
    return (
      <ScrollView>
        <Text style={{ fontSize: 20, margin: 20 }}>Bottom of the page!</Text>
      </ScrollView>
    );
  }




const ModePar: React.FC<RouterProps> = ({ navigation}) => {

    const [existModes, setExistModes] = useState<any[]>([]);

    

    const refreshModes = () => {
        storage.getAllDataForKey('modes').then((modes) => {
            setExistModes(modes);
            // console.log(modes);
        })
    }

    // useEffect(() => {
        
    //     // refreshModes();
    // })

    useEffect(() => {
        setInitModes();
        refreshModes();
        eventEmitter.on('refreshModes', refreshModes);
    }
    ,[])

    // const scrollViewRef = useScrollStore((state: any) => state.scrollViewRef);
    return ( 
        <ScrollView
        // ref={scrollViewRef}
        >
        <View style={{margin:16,}}>
            {existModes.map((item: { title: string; totalRunTime: number; temperature: number; pressure: number; actionList: any[]; description:string; isPreset:boolean; timeId:string; automode:number}, index: React.Key | null | undefined) => (
                <Mode 
                    key={index}
                    title={item.title}
                    totalRunTime={item.totalRunTime}
                    temperature={item.temperature}
                    pressure={item.pressure}
                    actionList={item.actionList}
                    description={item.description}
                    timeId={item.timeId}
                    isPreset={item.isPreset}
                    automode={item.automode}
                    navigation={navigation}
                />
            ))}
        </View>
        </ScrollView>
     );
}


export default ModePar;


// export default function ModePage() {
//     return (
//         <Stack.Navigator initialRouteName="Home">
//           <Stack.Screen name="ModePar" component={ModePar} />
//           <Stack.Screen name="EndPar" component={EndPar} />
//         </Stack.Navigator>
//     );
//   }