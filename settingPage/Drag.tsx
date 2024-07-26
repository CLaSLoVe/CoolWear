import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { globalVals, generatePickerItems } from "../GlobalVars";
import i18n from "../locales";
import { makeMutable, useSharedValue } from 'react-native-reanimated';

const NUM_ITEMS = 10;

const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
  return {
    key: `item-${index}`,
    hotDur: 1,
    coldDur: 1,
  };
});

const Drag = () => {
  const [data, setData] = useState(initialData);
  const [hotFirst, setHotFirst] = useState(true);
  

  const hotLine = (item: { hotDur: any }) => (
    <View>
      <View style={[styles.settingLine]}>
        <Image source={require('../assets/hot.png')} style={{ aspectRatio: 1, width: "12%", alignSelf: 'center' }} fadeDuration={100} />
        <Text>  </Text>
        <View style={[styles.selectorBG]}>
          <Picker
            mode='dropdown'
            selectedValue={item.hotDur}
            onValueChange={(itemValue, index) => {
              let newData = [...data];
              newData[index].hotDur = itemValue;
              setData(newData);
            }}>
            {generatePickerItems(globalVals.hotDurationRange[0], globalVals.hotDurationRange[1])}
          </Picker>
        </View>
        <Text style={[styles.selectorText]}>{i18n.t("min")}</Text>
      </View>
    </View>
  );

  const coldLine = (item: { coldDur: any }) => (
    <View>
      <View style={[styles.settingLine]}>
        <Image source={require('../assets/cold.png')} style={{ aspectRatio: 1, width: "12%", alignSelf: 'center' }} fadeDuration={100} />
        <Text>  </Text>
        <View style={[styles.selectorBG]}>
          <Picker
            mode='dropdown'
            selectedValue={item.coldDur}
            onValueChange={(itemValue, index) => {
              let newData = [...data];
              newData[index].coldDur = itemValue;
              setData(newData);
            }}>
            {generatePickerItems(globalVals.hotDurationRange[0], globalVals.hotDurationRange[1])}
          </Picker>
        </View>
        <Text style={[styles.selectorText]}>{i18n.t("min")}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <View style={[styles.timePanel]}>
        <View style={[styles.timePanelC]}>
          {
            hotFirst ?
              <View>
                {hotLine(item)}
                {coldLine(item)}
              </View> :
              <View>
                {coldLine(item)}
                {hotLine(item)}
              </View>
          }
          <View>
            <TouchableOpacity style={[styles.buttonAdd]}>
              <Text style={[styles.text]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonMinus]}>
              <Text style={[styles.text]}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.buttonDrag]}
          onLongPress={drag}>
          <Text style={[styles.selectorText]}>Long Press Here To Drag</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onDragEnd = (result: { data: any }) => {
    setData(result.data);
  };

  return (
    <View>
      <NestableScrollContainer>
        <NestableDraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={onDragEnd}
        />
      </NestableScrollContainer>
    </View>
  );
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
  timePanel: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  timePanelC: {
    flexDirection: 'row',
  },
  buttonAdd: {
    backgroundColor: 'darkblue',
    width: 60,
    height: 50,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  buttonMinus: {
    backgroundColor: 'orange',
    width: 60,
    height: 50,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  buttonDrag: {
    backgroundColor: 'lightgray',
    width: '70%',
    height: 50,
    borderRadius: 3,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  rowItem: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectorBG: {
    backgroundColor: '#F6F5F5',
    borderRadius: 8,
    width: 150,
  },
  settingLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Drag;