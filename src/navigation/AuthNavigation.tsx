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



const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
    return(
        <AuthStackNav.Navigator initialRouteName='SignInScreen'  screenOptions={{
            headerShown: false,
            gestureEnabled:true,
            animation:'slide_from_left',

        }}>
            <AuthStackNav.Screen name="RegisterScreen" component={RegisterScreen}/>
            <AuthStackNav.Screen name="PhoneNumberConfirm" component={PhoneNumberConfirm}/>
            <AuthStackNav.Screen name="LoginNow" component={LoginNow}/>
            <AuthStackNav.Screen name="EmailConfirm" component={EmailConfirm}/>
            <AuthStackNav.Screen name="ForgotPassword" component={ForgotPassword}/>
            <AuthStackNav.Screen name="PasswordChange" component={PasswordChange}/>



        </AuthStackNav.Navigator>
    )

}
