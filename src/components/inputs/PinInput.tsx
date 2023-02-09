import React, {useRef, useState} from 'react';

import {Text, TextStyle, View, StyleSheet,ViewProps, ViewStyle, I18nManager, TextInput} from 'react-native';


const styles = StyleSheet.create({
    containerDefault: {},
    cellDefault: {
        borderColor: 'gray',
        borderWidth: 1,
    },
    cellFocusedDefault: {
        borderColor: 'black',
        borderWidth: 2,
    },
    textStyleDefault: {
        color: 'gray',
        fontSize: 24,
    },
    textStyleFocusedDefault: {
        color: 'black',
    },
});

interface inputProps {
    value:string,
    codeLength:number, cellSize?:number,
    cellSpacing?:number,
    placeholder?:string,
    password:boolean,
    mask:string,
    autoFocus:boolean,
    containerStyle?:ViewStyle,
    cellStyle?:ViewStyle,
    cellStyleFocused?:ViewStyle,
    cellStyleFilled?:ViewProps,
    textStyle?:TextStyle,
    textStyleFocused?:TextStyle,
    keyboardType:string,
    animationFocused?:string|{},
    animated?:boolean,
    restrictToNumbers:boolean,
    testID?:string|number,
    editable:boolean,
    MaskDelay?:number,
    inputProps?:{},
    disableFullscreenUI?:boolean,
    onTextChange: (code: string) => void,
    onFulfill?: (code: string) => void,
    onBackspace?:() => void,
    onFocus?:() => void,
    onBlur?:() => void,
}

const defaultProps:inputProps = {
    onTextChange(code: string): void {
    },
    value: '',
    codeLength: 4,
    cellSize: 48,
    cellSpacing: 4,
    placeholder: '',
    password: false,
    mask: '*',
    MaskDelay: 200,
    keyboardType: 'numeric',
    autoFocus: false,
    restrictToNumbers: false,
    containerStyle: styles.containerDefault,
    cellStyle: styles.cellDefault,
    cellStyleFocused: styles.cellFocusedDefault,
    textStyle: styles.textStyleDefault,
    textStyleFocused: styles.textStyleFocusedDefault,
    animationFocused: 'pulse',
    animated: true,
    editable: true,
    inputProps: {},
    disableFullscreenUI: true
};



const PinInput = ({password, codeLength,
                      onBlur,
                      cellSize,
                      cellSpacing,
                      cellStyle,
                      MaskDelay,
                      cellStyleFocused,
                      cellStyleFilled,
                      placeholder,
                      mask,
                      containerStyle,
                      editable,
                      inputProps,
                      onTextChange,
                      onFocus,onBackspace,
                      textStyle,
                      textStyleFocused,
                      disableFullscreenUI,
                      autoFocus,
                      value,onFulfill,restrictToNumbers}:inputProps ) => {


    const [maskDelay, setMaskDelay] = useState(false);
    const [focused, setFocused] = useState(false);

    const ref = useRef(null);
    const inputRef = useRef(null);





    const _inputCode = (code: string) => {


        if (restrictToNumbers) {
            code = (code.match(/[0-9]/g) || []).join("");
        }

        if (onTextChange) {
            onTextChange(code);
        }
        if (code.length === codeLength && onFulfill) {
            onFulfill(code);
        }

        // handle password mask
        const maskDelay = password &&
            code.length > value.length; // only when input new char
        setMaskDelay(maskDelay);

          if (maskDelay) { // mask password after delay
             //  clearTimeout(maskTimeout);
       const  maskTimeout = setTimeout(() => {
                       setMaskDelay( true );
                   },
                   MaskDelay
               );
              clearTimeout(maskTimeout);
           }
    };

    const _keyPress = (event) => {
        if (event.nativeEvent.key === 'Backspace') {

            if (value === '' && onBackspace) {
                onBackspace();
            }
        }
    };

    const _onFocused = () => {
        setFocused(true)
        if (typeof onFocus === 'function') {
            onFocus();
        }
    };

    const _onBlurred = () => {
        setFocused(false)
        if (typeof onBlur === 'function') {
            onBlur();
        }
    };

    return (
        <View

            style={[{
                alignItems: 'stretch', flexDirection: 'row', justifyContent: 'center', position: 'relative',
                width: cellSize * codeLength + cellSpacing * (codeLength - 1),
                height: cellSize,
            },
                containerStyle,
            ]}>
            <View style={{
                position: 'absolute', margin: 0, height: '100%',
                flexDirection: I18nManager.isRTL ? 'row-reverse': 'row',
                alignItems: 'center',
            }}>
            {
                Array.apply(null, Array(codeLength)).map((_, idx) => {
                    const cellFocused = focused && idx === value.length;
                    const filled = idx < value.length;
                    const last = (idx === value.length - 1);
                    const showMask = filled && (password && (!maskDelay || !last));
                    const isPlaceholderText = typeof placeholder === 'string';
                    const isMaskText = typeof mask === 'string';
                    const pinCodeChar = value.charAt(idx);

                    let cellText = null;
                    if (filled || placeholder !== null) {
                        if (showMask && isMaskText) {
                            cellText = mask;
                        } else if(!filled && isPlaceholderText) {
                            cellText = placeholder;
                        } else if (pinCodeChar) {
                            cellText = pinCodeChar;
                        }
                    }

                    const placeholderComponent = !isPlaceholderText ? placeholder : null;
                    const maskComponent = (showMask && !isMaskText) ? mask : null;
                    const isCellText = typeof cellText === 'string';

                    return (
                        <View
                            key={idx}
                            style={[
                                {

                                    width: cellSize,
                                    height: cellSize,
                                    marginLeft: cellSpacing / 2,
                                    marginRight: cellSpacing / 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                },

                                cellStyle,
                                cellFocused ? cellStyleFocused : {},
                                filled ? cellStyleFilled : {},
                            ]}
                        >
                            {isCellText && !maskComponent && <Text style={[textStyle, cellFocused ? textStyleFocused : {}]}>
                                {cellText}
                            </Text>}

                            {(!isCellText && !maskComponent) && placeholderComponent}
                            {isCellText && maskComponent}
                        </View>
                    );
                })
            }
        </View>
            <TextInput

                disableFullscreenUI={disableFullscreenUI}
                value={value}
                ref={inputRef}
                onChangeText={_inputCode}
                onKeyPress={_keyPress}
                onFocus={() => _onFocused()}
                onBlur={() => _onBlurred()}
                spellCheck={false}
                autoFocus={autoFocus}
                keyboardType={'number-pad'}
                numberOfLines={1}
                caretHidden
                maxLength={codeLength}
                selection={{
                    start: value.length,
                    end: value.length,
                }}
                style={{

                    flex: 1,
                    opacity: 0,
                    textAlign: 'center',
                }}
                editable={editable}
                {...inputProps} />
        </View>


    )
};

PinInput.defaultProps = defaultProps;







export default PinInput;
