import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Platform} from 'react-native';
import {useFormik} from "formik";
import * as yup from "yup";
import AdvancedTextInput from "../inputs/AdvancedTextInput";
import {RectButton} from "../RectButton";
import {fontPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useQuery} from "@tanstack/react-query";
import {getCCDWallet, getUserPointsExchangeRate, getUserWallets} from "../../action/action";
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

}


const RedeemForm = ({isLoading, redeemNow, pointBalance}: props) => {


    const {isLoading: loadingRates, data} = useQuery(['getUserPointsExchangeRate'], getUserPointsExchangeRate)

    const [points, setPoints] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);
    const [walletOption, setWalletOption] = useState('CCD')
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleOptionPress = (option: React.SetStateAction<string>) => {
        // Handle the selected option here
        setWalletOption(option);
        toggleModal();
    };


    const [convertedPoints, setConvertedPoints] = useState('');
    const [defaultPointsConvertValue, setDefaultPointsConvertValue] = useState('');
    const [pointsVal, setPointsVal] = useState('');

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const {data: ccdWallet} = useQuery(['getCCDWallet'], getCCDWallet)

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
                "network": data?.data.find((wallet: { token: string; }) => wallet.token == walletOption.toLowerCase()).network,
                "token": walletOption
            })

            redeemNow(body)


        }
    });

    // let defaultPointsConvertValue = '0'
    //  let pointsVal = '0'
 useEffect(() => {


        if (data && data?.data) {
            // console.log(data?.data.find((wallet: { token: string; }) => wallet.token == walletOption).value)
            if(ccdWallet?.data !== null) {
                setPointsVal(`${data?.data.find((wallet: {
                    token: string;
                }) => wallet.token == walletOption.toLowerCase()).value} ${data?.data.find((wallet: { token: string; }) => wallet.token == walletOption.toLowerCase())?.token}`)
                //defaultPointsConvertValue =
            }
            setDefaultPointsConvertValue(`${data?.data.find((wallet: {
                token: string;
            }) => wallet.token == walletOption.toLowerCase())?.value * +points}`)
        } else {
            setDefaultPointsConvertValue('0')
            setPointsVal('0')
        }

    }, [data, points, walletOption]);




    const maxAmount = () => {
        setPoints(pointBalance)
        setFieldValue('points', pointBalance)
    }
    return (
        <View style={styles.sheetContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => handleOptionPress('CCD')}>
                            <Text style={styles.option}>Concordium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleOptionPress('gate')}>
                            <Text style={styles.option}>Gate</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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

            <View style={[styles.exchangeView,{
                top:Platform.OS == 'android' ? 45 : 60,
            }]}>
                <MaterialCommunityIcons name="swap-vertical-circle" size={45}
                                        color={theme == 'light' ? "rgba(0, 0, 0, 0.8)" : "rgba(227,227,227,0.8)"}/>
            </View>
            <AdvancedTextInput
                walletOption={walletOption}
                mainWallet
                editable={false}
                actionSelectWallet={toggleModal}
                placeholder="0.00"
                label={"Amount"}

                defaultValue={defaultPointsConvertValue}
                keyboardType={"number-pad"}

                balanceText={`${walletOption == 'gate' ? ccdWallet?.data?.gateBalance : ccdWallet?.data?.ccdBalance}`}
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
    },


    modalOverlay: {
        flex: 1,
        paddingHorizontal: pixelSizeHorizontal(20),
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    modalContent: {
        marginBottom: 30,
        width: '100%',
        height: 120,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    option: {
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(16),
        paddingVertical: 10,
    },
})

export default RedeemForm;
