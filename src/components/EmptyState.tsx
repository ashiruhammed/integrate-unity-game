import React from "react";

import { Text, View, StyleSheet,Image } from "react-native";
import Animated, { Easing, FadeInDown, FadeOutDown } from "react-native-reanimated";
import { fontPixel, heightPixel, widthPixel } from "../helpers/normalize";
import { useNavigation } from "@react-navigation/native";
import {Fonts} from "../constants/Fonts";



interface props {
  message:string
}
const EmptyState = ({message}:props) => {
  const navigation = useNavigation()
  return (
    <Animated.View

      key={message} entering={FadeInDown
    }

      exiting={FadeOutDown}
      style={styles.emptyCardBody}>

     {/* <View style={styles.glassmorphism}>
        <Image

          source={require("../../assets/images/file-broken.png")}
          style={{
            width: widthPixel(100),
            height:"50%",
            resizeMode: 'cover'
          }
          }
        />
      </View>*/}


      <Text style={styles.emptyCardText}>
        {message}
      </Text>


    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyCardBody: {
    minHeight:heightPixel(150),
    width: '100%',
    alignItems:'center',
    justifyContent:"center",
  },
  emptyCardText: {
    width:"70%",
    textAlign: 'center',
    fontSize: fontPixel(16),
    color: "#062638",
    lineHeight: heightPixel(20),
    fontFamily: Fonts.quicksandMedium
  },
  glassmorphism: {
    width: '100%',
    height: heightPixel(150),
    alignItems:'center',
    justifyContent:"center",

  },
  buttonText: {
    color: "#fff",
    fontFamily: Fonts.quicksandSemiBold,
    fontSize: fontPixel(16)
  },
  addCardBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,

  },
});

export default EmptyState;
