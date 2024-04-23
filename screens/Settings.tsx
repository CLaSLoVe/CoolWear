import * as React from "react";
import { Text, StyleSheet, Image, Pressable, View } from "react-native";
import { FontFamily, FontSize, Color } from "../GlobalStyles";

const Setting = () => {
  return (
    <View style={styles.setting0}>
      <Text style={styles.clickToDisconnect}>CLICK TO DISCONNECT</Text>
      <Pressable style={styles.wrapper} onPress={() => {}}>
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={require("../assets/rectangle-1.png")}
        />
      </Pressable>
      <Image
        style={styles.setting0Child}
        resizeMode="cover"
        source={require("../assets/rectangle-2.png")}
      />
      <Pressable
        style={[styles.parent, styles.parentLayout]}
        onPress={() => {}}
      >
        <Image
          style={[styles.icon1, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/-1.png")}
        />
        <Text style={[styles.play, styles.playTypo]}>play</Text>
      </Pressable>
      <View style={[styles.group, styles.groupLayout]}>
        <Image
          style={[styles.icon2, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/-11.png")}
        />
        <Text style={[styles.setting, styles.groupLayout]}>setting</Text>
      </View>
      <Pressable
        style={[styles.modeParent, styles.modeLayout]}
        onPress={() => {}}
      >
        <Text style={[styles.mode, styles.modeLayout]}>mode</Text>
        <Image
          style={[styles.icon3, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/-12.png")}
        />
      </Pressable>
      <View style={[styles.setting0Item, styles.setting0Layout]} />
      <View style={[styles.setting0Inner, styles.setting0Layout]} />
      <Text style={[styles.customization, styles.englishTypo]}>
        Customization
      </Text>
      <Text style={[styles.language, styles.englishTypo]}>Language</Text>
      <Text style={[styles.userManual, styles.englishTypo]}>User Manual</Text>
      <Text
        style={[styles.helpFeedback, styles.englishTypo]}
      >{`Help & Feedback`}</Text>
      <Text style={styles.pleaseSendYour}>{`Please send your queries to:
22038367r@connect.polyu.hk

Thank you so much!`}</Text>
      <Pressable
        style={[styles.rectangleParent, styles.groupChildLayout]}
        onPress={() => {}}
      >
        <View style={[styles.groupChild, styles.groupChildLayout]} />
        <Image
          style={styles.groupItem}
          resizeMode="cover"
          source={require("../assets/polygon-1.png")}
        />
      </Pressable>
      <Text style={[styles.english, styles.englishTypo]}>English</Text>
      <Image
        style={[styles.vectorIcon, styles.vectorIconLayout]}
        resizeMode="cover"
        source={require("../assets/vector-1.png")}
      />
      <Image
        style={[styles.setting0Child1, styles.vectorIconLayout]}
        resizeMode="cover"
        source={require("../assets/vector-1.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentLayout: {
    height: 69,
    top: 654,
  },
  iconLayout: {
    height: 40,
    width: 40,
    top: 0,
    position: "absolute",
  },
  playTypo: {
    height: 22,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    top: 47,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: FontSize.size_xl,
  },
  groupLayout: {
    width: 69,
    position: "absolute",
  },
  modeLayout: {
    width: 56,
    position: "absolute",
  },
  setting0Layout: {
    backgroundColor: Color.colorWhitesmoke,
    height: 92,
    width: 324,
    left: 18,
    position: "absolute",
  },
  englishTypo: {
    height: 29,
    fontSize: FontSize.size_5xl,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    color: Color.colorDimgray,
    alignItems: "center",
    display: "flex",
    position: "absolute",
  },
  groupChildLayout: {
    height: 37,
    width: 164,
    position: "absolute",
  },
  vectorIconLayout: {
    height: 14,
    width: 7,
    left: 319,
    position: "absolute",
  },
  clickToDisconnect: {
    top: 56,
    left: 47,
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.colorWhite,
    width: 269,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: FontSize.size_xl,
    position: "absolute",
  },
  icon: {
    height: "100%",
    width: "100%",
  },
  wrapper: {
    top: 74,
    height: 92,
    width: 324,
    left: 18,
    position: "absolute",
  },
  setting0Child: {
    top: 365,
    height: 178,
    width: 324,
    left: 18,
    position: "absolute",
  },
  icon1: {
    left: 2,
  },
  play: {
    color: Color.colorDimgray,
    height: 22,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    top: 47,
    width: 44,
    position: "absolute",
  },
  parent: {
    left: 34,
    width: 44,
    position: "absolute",
  },
  icon2: {
    left: 15,
  },
  setting: {
    color: "#ee6f57",
    height: 22,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    top: 47,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: FontSize.size_xl,
    width: 69,
  },
  group: {
    left: 257,
    height: 69,
    top: 654,
  },
  mode: {
    height: 22,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    top: 47,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontSize: FontSize.size_xl,
    color: Color.colorDimgray,
  },
  icon3: {
    left: 8,
  },
  modeParent: {
    left: 146,
    height: 69,
    top: 654,
  },
  setting0Item: {
    top: 171,
  },
  setting0Inner: {
    top: 268,
  },
  customization: {
    top: 106,
    width: 192,
    height: 29,
    fontSize: FontSize.size_5xl,
    left: 37,
  },
  language: {
    top: 203,
    width: 122,
    fontSize: FontSize.size_5xl,
    height: 29,
    left: 37,
  },
  userManual: {
    top: 300,
    width: 192,
    height: 29,
    fontSize: FontSize.size_5xl,
    left: 37,
  },
  helpFeedback: {
    top: 397,
    width: 192,
    height: 29,
    fontSize: FontSize.size_5xl,
    left: 37,
  },
  pleaseSendYour: {
    top: 436,
    fontSize: 16,
    width: 286,
    height: 82,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    left: 37,
    color: Color.colorDimgray,
    position: "absolute",
  },
  groupChild: {
    borderRadius: 5,
    left: 0,
    width: 164,
    top: 0,
    backgroundColor: Color.colorWhite,
  },
  groupItem: {
    top: 11,
    left: 144,
    width: 17,
    height: 15,
    position: "absolute",
  },
  rectangleParent: {
    top: 200,
    left: 162,
  },
  english: {
    top: 204,
    left: 170,
    width: 130,
    fontSize: FontSize.size_5xl,
    height: 29,
  },
  vectorIcon: {
    top: 115,
  },
  setting0Child1: {
    top: 307,
  },
  setting0: {
    flex: 1,
    height: 740,
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.colorWhite,
  },
});

export default Setting;
