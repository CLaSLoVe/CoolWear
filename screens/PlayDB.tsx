import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Button, Alert } from "react-native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";



const PlayDB = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  return (
    <View style={styles.playDB}>
      <Button
        title={isConnected ? "CLICK TO DISCONNECT" : "CONNECT BLUETOOTH"}
        onPress={() => 
          setIsConnected(!isConnected)
        }
      />
    </View>
  );
};


const styles = StyleSheet.create({
  playDB: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  bleButtonNormal: {
    marginTop: 100,
    marginLeft: 20,
  },
  playDBChildTypo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
  playDBParent: {
    marginTop: 20,
    marginLeft: 20,
  },
  playDBIcon: {
    width: 40,
    height: 40,
  },
  playDBItem: {
    marginTop: 20,
    marginLeft: 20,
    width: 350,
    height: 1,
    backgroundColor: Color.colorDimgray,
  },
  playDBInner: {
    marginTop: 20,
    marginLeft: 20,
    width: 350,
    height: 1,
    backgroundColor: Color.colorDimgray,
  },
  playDBTypo: {
    marginTop: 20,
    marginLeft: 20,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
  playDBTypo1: {
    marginTop: 20,
    marginLeft: 20,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
  playDBTypo2: {
    marginTop: 20,
    marginLeft: 20,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
  playDBTypo3: {
    marginTop: 20,
    marginLeft: 20,
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
});

export default PlayDB;
