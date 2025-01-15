import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    BlueButton: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        height: 60,
        // width: '90%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    WhiteText: {
        color: 'white',
        fontSize: 20,
    },
    BlackText: {
        color: 'black',
        fontSize: 20,
    },
    overlayView: {
        position: 'absolute', // Ensures the overlay
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
  
    },
    fullPage: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    panel: {
        backgroundColor: 'white',
        borderRadius: 8,
        // elevation: 5,
        padding: 16,
        margin: 16,
        justifyContent: 'center',
        gap: 20,

    },
});

export default globalStyles;