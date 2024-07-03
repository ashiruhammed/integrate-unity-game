import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AuthStackParamList, RootStackParamList} from "../../types";
import * as React from "react";
import RegisterScreen from "../screens/auth/RegisterScreen";
import PhoneNumber from "../screens/auth/PhoneNumber";
import SignUpInfo from "../screens/SignUpInfo";
import LoginNow from "../screens/auth/LoginNow";
import EmailConfirm from "../screens/auth/EmailConfirm";
import PhoneNumberConfirm from "../screens/auth/PhoneNumber";
import ForgotPassword from "../screens/auth/ForgotPassword";
import PasswordChange from "../screens/auth/PasswordChange";
import BiometricsLogin from "../screens/auth/BiometricsLogin";
import { storage } from "../helpers/storage";



const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {

    // Deserialize the JSON string into an object
    const jsonUser = storage.getString('userData') // { 'password': 'Marc', 'email': 21 }
    const fullName = storage.getString('fullName')
    const userObject = JSON.parse(jsonUser ? jsonUser : '{}')
    console.log(userObject)
    console.log({fullName})

    return(
        <AuthStackNav.Navigator initialRouteName='BiometricsLogin'  screenOptions={{
            headerShown: false,
            gestureEnabled:true,
            animation:'slide_from_left',

        }}>
            {
                userObject?.isBiometrics &&

            <AuthStackNav.Screen name="BiometricsLogin" component={BiometricsLogin}/>
            }
            <AuthStackNav.Screen name="LoginNow" component={LoginNow}/>
            <AuthStackNav.Screen name="RegisterScreen" component={RegisterScreen}/>
            <AuthStackNav.Screen name="PhoneNumberConfirm" component={PhoneNumberConfirm}/>

            <AuthStackNav.Screen name="EmailConfirm" component={EmailConfirm}/>
            <AuthStackNav.Screen name="ForgotPassword" component={ForgotPassword}/>
            <AuthStackNav.Screen name="PasswordChange" component={PasswordChange}/>



        </AuthStackNav.Navigator>
    )

}
