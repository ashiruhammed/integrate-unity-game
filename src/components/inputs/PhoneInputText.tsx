/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useCallback, useEffect, useState} from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    TextInput as RNTextInput,
    TextInputProps
} from 'react-native'
import PropTypes from 'prop-types'
import {
    Input,
    Button,
    Overlay,
    ListItem,
    SearchBar,
    Icon,
} from 'react-native-elements'
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {AntDesign, Entypo} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import {useAppSelector} from "../../app/hooks";

interface Props extends TextInputProps {
    onChangeText: (text: string, code: string) => void,
    errorMessage: string,
    placeholder: string,
    inputBg?: string,
    error?: string;
    inputHeight?: number;
    borderRadius?: number;
    inputWrapHeight?: number;
    label?: string;
    isWidth?: null | string | number,
    touched?: boolean;
    password?: boolean;
    leftIcon?: boolean | React.ReactNode;
    icon?: boolean | React.ReactNode;
    rightIcon?: boolean | React.ReactNode;
    focus?: boolean;
    rightText?: boolean;
    rightBtnText?: string;
    rightAction?: () => void;
    value: string;
    action?: () => void;
    onChangePhoneNumber?: (code: string) => void;
    passState?: boolean
    labelColor?: boolean

}

const FullPhoneNumber = ({
                             onChangePhoneNumber,
                             onChangeText,
                             errorMessage = '',
                             rightIcon,
                             inputBg,
                             rightAction,
                             rightBtnText,
                             icon,
                             borderRadius,
                             inputWrapHeight,
                             leftIcon,
                             isWidth,
                             rightText,
                             inputHeight,
                             label,
                             password,
                             placeholder,
                             error,
                             touched,
                             focus,
                             value,
                             action,
                             passState,
                             labelColor, ...props
                         }: Props) => {
    let validationColor, validationLabelColor, validationDarkColor, validationLabelDarkColor;
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    validationColor = !touched ? Colors.border : focus ? Colors.light.text : error ? Colors.errorRed : Colors.light.text
    validationLabelColor = !touched ? Colors.light.text : focus ? Colors.light.text : error ? Colors.errorRed : Colors.light.text
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background

    validationDarkColor = !touched ? Colors.dark.borderColor : focus ? "#eee" : error ? Colors.errorRed : Colors.light.text
    validationLabelDarkColor = !touched ? Colors.dark.text : focus ? Colors.dark.text : error ? Colors.errorRed : Colors.dark.text
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    let phoneUtil = null


    const [list, setList] = useState([]);
    const [con, setCon] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [code, setCode] = useState('+234');
    const [emoji, setEmoji] = useState('🇳🇬');

    useEffect(() => {
        const countries = require('../../constants/countries.json')
        setCon(countries['countries'])
        const cons = countries['countries']
        setList(cons)

    }, [])

    const selectCountry = () => {
        setIsVisible(true)
    }
    const closeOverlay = () => setIsVisible(false)

    const selectedCountry = (item: { emoji: any; phone: any }) => {
        setIsVisible(false)
        setEmoji(item.emoji)
        setCode(item.phone)

    }
    const keyExtractor = useCallback((item, index) => index.toString(), [],);

    const renderItem = useCallback(({item}: any) => (
        /*    <ListItem
                containerStyle={{

                }}
                title={item.name}
                subtitle={item.phone}
                leftAvatar={{title: item.emoji}}
                onPress={() => selectedCountry(item)}
                bottomDivider
            />*/

        <TouchableOpacity onPress={() => selectedCountry(item)} style={[styles.listItem, {
            borderBottomColor: borderColor
        }]}>
            <Text style={[styles.codeText, {
                color: textColor
            }]}>
                {item.emoji}
            </Text>
            <Text style={[styles.codeText, {
                marginLeft: 10,
                color: textColor
            }]}>
                {item.name} ({item.phone})
            </Text>
        </TouchableOpacity>
    ), [])

    let filterCountry: any[] = []


    const updateSearch = (search: string) => {
        const listC = con.filter(item => {
            const itemName = item.name.toLowerCase()
            const itemCode = item.phone.toLowerCase()
            const textData = search.toLowerCase()
            if (itemName.indexOf(textData) > -1 || itemCode.indexOf(textData) > -1)
                return true
        })
        setList(listC)
        setSearch(search)
    }

    const inputTextChange = (text: string) => {
        const number = code + text
        onChangeText(number, code)
    }


    return (
        <>
            <View style={[styles.inputWrap, {
                height: heightPixel(115),
                width: '100%',
                backgroundColor
            }]}>
                {
                    label && <View style={styles.labelWrap}>
                        <Text style={[
                            {color: theme == 'light' ? validationLabelColor : validationLabelDarkColor},
                            styles.label]}>
                            {label}
                        </Text>
                        {
                            rightText && <Text onPress={rightAction} style={[
                                {
                                    color: Colors.primaryColor,
                                },
                                styles.label]}>
                                {rightBtnText}
                            </Text>
                        }


                    </View>
                }
                <View style={[styles.ViewWrap, {
                    backgroundColor
                }]}>
                    <View style={styles.buttonViewStyle}>
                        <TouchableOpacity style={[styles.buttonStyle, {
                            borderColor: theme == 'light' ? validationColor : validationDarkColor,
                        }]} onPress={() => selectCountry()}>

                            <Entypo name="chevron-small-down" style={{}} size={20}
                                    color={theme == 'light' ? '#131313' : '#fff'}/>
                            <Text style={styles.buttonText}>
                                {emoji}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.inputViewStyle}>
                        <View style={[styles.inputContainer, {
                            borderRadius: 10,
                            borderColor: theme == 'light' ? validationColor : validationDarkColor,
                            height: heightPixel(56),
                        }]}>
                            <View style={styles.leftIcon}>
                                <Text style={styles.signTxt}>
                                    {code}
                                </Text>
                            </View>

                            <RNTextInput

                                {...props}
                                keyboardType={"phone-pad"}
                                placeholder={placeholder}
                                onChangeText={inputTextChange}
                                placeholderTextColor={"#9CA3AF"}
                                style={[styles.input, {
                                    width: '80%',
                                    color: theme == 'light' ? '#131313' : '#fff',
                                }]}/>
                        </View>
                    </View>
                </View>
                <View style={styles.errorContainer}>

                    {error && <Animated.Text
                        key={error} entering={FadeInDown}
                        exiting={FadeOutDown}
                        style={[styles.errorMessage, {
                            //left:isWidth ? 2 : 0,
                        }]}>
                        {error}
                    </Animated.Text>
                    }

                </View>
            </View>
            <Overlay
                fullScreen
                isVisible={isVisible}

                style={{
                    backgroundColor
                }
                }
                backdropStyle={{
                    backgroundColor
                }}
                onBackdropPress={closeOverlay}>
                <Animated.View key={isVisible + "isVisible"} entering={FadeInDown}
                               exiting={FadeOutDown} style={[styles.overlay, {
                    backgroundColor
                }]}>

                    <TouchableOpacity style={styles.dismiss} onPress={closeOverlay}>
                        <AntDesign name="close" size={24} color="#fff"/>
                    </TouchableOpacity>


                    <SearchBar
                        placeholder='Search by country or code '
                        onChangeText={updateSearch}
                        value={search}
                        containerStyle={styles.searchBarContainerStyle}
                        inputContainerStyle={styles.searchBarInputContainerStyle}
                        inputStyle={styles.searchBarInputStyle}
                    />
                    <FlatList
                        style={{
                            width: '100%',
                            paddingHorizontal: pixelSizeHorizontal(15),
                        }}
                        initialNumToRender={50}
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'
                        keyExtractor={keyExtractor}
                        data={list.filter(item =>
                            item.name == "Kenya" || item.name == "Nigeria" || item.name == "Uganda" || item.name == "South Africa"
                            || item.name == "United States" || item.name == "United Kingdom" || item.name == "Hong Kong"
                        )}
                        renderItem={renderItem}
                    />
                </Animated.View>
            </Overlay>
        </>
    )
}


const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPixel(56),
        width: '100%',
        borderRadius: 10,
        marginRight: 10,

        borderWidth: 1,
    },
    inputContainer: {

        width: '100%',
        marginTop: 8,
        marginBottom: 10,
        borderWidth: 1,
        flexDirection: 'row',


    },
    buttonText: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text
    },
    buttonTitleStyle: {
        color: 'black',
        fontSize: 20,
        justifyContent: 'center',
    },
    buttonViewStyle: {width: '18%'},
    container: {

        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',

        // marginRight: 20,
    },
    inputWrap: {
        width: '100%',
        justifyContent: "flex-start",

    },
    ViewWrap: {
        justifyContent: 'flex-start',

        alignItems: 'center',

        flexDirection: 'row',

        // marginRight: 20,
    },
    iconContainerStyle: {height: 50, width: 50},
    inputStyle: {
        width: '95%',
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,

    },
    inputViewStyle: {
        alignItems: 'flex-start',
        width: '79%',
        justifyContent: 'center',
        marginLeft: 10,
    },
    searchBarContainerStyle: {
        backgroundColor: 'white',
        borderBottomColor: 'white',
        borderTopColor: 'white',
    },
    searchBarInputContainerStyle: {
        backgroundColor: 'white',
    },
    searchBarInputStyle: {
        color: 'black',
    },
    listItem: {
        width: '100%',
        height: heightPixel(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    codeText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text
    },
    dismiss: {
        zIndex: 1,
        position: 'absolute',
        bottom: 50,
        right: 30,
        height: 40,
        width: 40,
        backgroundColor: Colors.errorRed,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftIcon: {
        height: '100%',
        width: '15%',
        alignItems: 'center',
        justifyContent: "center"
    },
    signTxt: {
        textAlign: 'center',
        fontSize: fontPixel(15),
        color: "#D1D1D1",

        fontFamily: Fonts.quicksandMedium,

    },
    input: {
        fontSize: fontPixel(16),
        paddingHorizontal: pixelSizeHorizontal(10),
        fontFamily: Fonts.quicksandSemiBold,
        height: '100%',

    },
    errorContainer: {

        height: '20%',
        width: '100%',

        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    errorMessage: {
        position: 'relative',


        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold,
    },
    labelWrap: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    label: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    overlay: {
        flex: 1,
        marginTop: 40,
        width: '100%',
    }
})


export default FullPhoneNumber