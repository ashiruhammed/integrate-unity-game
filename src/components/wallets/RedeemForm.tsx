import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useFormik} from "formik";
import * as yup from "yup";
import AdvancedTextInput from "../inputs/AdvancedTextInput";
import {RectButton} from "../RectButton";
import {fontPixel, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useQuery} from "@tanstack/react-query";
import {getUserPointsExchangeRate} from "../../action/action";
import Colors from "../../constants/Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useAppSelector} from "../../app/hooks";
import textInput from "../inputs/TextInput";
import * as SecureStore from "expo-secure-store";
import {currencyFormatter} from "../../helpers";


const formSchema = yup.object().shape({
    points: yup.number().required('Points amount is required'),


});


interface props {
    isLoading: boolean,
    redeemNow: (body: {}) => void,
    pointBalance: string,
    nearBalance: string,
}


const RedeemForm = ({isLoading, redeemNow, pointBalance, nearBalance}: props) => {


    const {isLoading: loadingRates, data} = useQuery(['getUserPointsExchangeRate'], getUserPointsExchangeRate)

    const [points, setPoints] = useState('');


    const [convertedPoints, setConvertedPoints] = useState('');
    const [defaultPointsConvertValue, setDefaultPointsConvertValue] = useState('');
    const [pointsVal, setPointsVal] = useState('');

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    // https://pro-api.coinmarketcap.com/v2/tools/price-conversion?CMC_PRO_API_KEY=c8d06b53-dfbe-4de8-9e0d-62fdb128cf8a&amount=300&symbol=Near

    const {
        resetForm,
        handleChange, handleSubmit, handleBlur,
        setFieldValue,
        isSubmitting,
        setSubmitting,
        values,
        errors,
        touched,
        isValid
    } = useFormik({
        validationSchema: formSchema,
        initialValues: {

            points: points,


        },
        onSubmit: (values) => {
            const {points} = values;
            const body = JSON.stringify({
                amount: points,
                "network": "near",
                "token": "near"
            })

            redeemNow(body)


        }
    });

   // let defaultPointsConvertValue = '0'
  //  let pointsVal = '0'
    useEffect(() => {
        if (data && data?.success) {
           setPointsVal(`${data?.data[1]?.value} ${data?.data[1]?.token}`)
            //defaultPointsConvertValue =

            setDefaultPointsConvertValue(`${data?.data[1]?.value * +points}`)
        } else {
            setDefaultPointsConvertValue('0')
            setPointsVal('0')
        }
    }, [data,points]);


    const maxAmount = () => {
        setPoints(pointBalance)
        setFieldValue('points', pointBalance)
    }
    return (
        <View style={styles.sheetContainer}>
            <AdvancedTextInput

                placeholder="0.00"
                label={"Amount"}
                keyboardType={"number-pad"}
                touched={touched.points}
                error={touched.points && errors.points}
                balanceText={`${pointBalance} Points`}
                onChangeText={(e) => {
                    handleChange('points')(e);
                    setPoints(e)
                }}
                defaultValue={points}
                actionMax={maxAmount}
                onBlur={(e) => {
                    handleBlur('points')(e);

                }}
                value={values.points}
            />

            <View style={styles.exchangeView}>
                <MaterialCommunityIcons name="swap-vertical-circle" size={45}
                                        color={theme == 'light' ? "rgba(0, 0, 0, 0.8)" : "rgba(227,227,227,0.8)"}/>
            </View>
            <AdvancedTextInput
                mainWallet
                editable={false}

                placeholder="0.00"
                label={"Amount"}
                defaultValue={defaultPointsConvertValue}
                keyboardType={"number-pad"}

                balanceText={`${nearBalance} CCD`}
                onChangeText={(e) => {
                    handleChange('walletAmount')(e);
                }}
                onBlur={(e) => {
                    handleBlur('walletAmount')(e);

                }}

            />

            <View style={styles.conversionRate}>
                <Text style={[styles.label, {
                    color: textColor
                }]}>
                    Redeem conversion rate:
                </Text>

                {
                    loadingRates ? <ActivityIndicator size="small" color={Colors.primaryColor}/>
                        :
                        <Text style={[styles.label, {
                            color: textColor
                        }]}>
                            1 Points = {pointsVal}
                        </Text>
                }
            </View>


            <TouchableOpacity disabled={isLoading || !isValid} style={[styles.redeemButton, {
                backgroundColor: isValid ? Colors.primaryColor : Colors.border
            }]} onPress={() => handleSubmit()}>
                {
                    isLoading ? <ActivityIndicator size="small" color={"#fff"}/> :

                        <Text style={styles.buttonText}>
                            Redeem

                        </Text>
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        marginTop: 20,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    exchangeView: {
        top: 60,
        zIndex: 1,
        position: 'absolute',
        borderRadius: 40,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        // backgroundColor:"rgba(0, 0, 0, 0.8)",
    },
    conversionRate: {
        flexDirection: "row",
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    redeemButton: {
        marginTop: 30,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',

    },
    label: {
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14)
    }
})

export default RedeemForm;
