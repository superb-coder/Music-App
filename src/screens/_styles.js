import { StyleSheet, Platform, Dimensions } from 'react-native';

export const CommonStyle = StyleSheet.create({
    commonTitle: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'ProximaNova-Bold'
    },
    commonButtonContainer: {
        height: 50,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commonButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    labelInput: {
        color: '#999999',
        paddingLeft: 0,
        marginLeft: 0
    },
    formInput: {
        borderBottomWidth: 1,
        marginLeft: 0,
        borderColor: '#999999',
        padding: 0,
        color: 'white',
        marginBottom: 1
    },
    input: {
        borderWidth: 0,
        paddingLeft: 0,
        marginLeft: 0,
        color: 'white',
        fontSize: 18,
        height: 32
    },
    headerStyle: {
        backgroundColor: '#000000',
        shadowRadius: 0,
        shadowOffset: {
            height: 0
        },
        shadowColor: 'transparent'
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#252525'
    },
    navigationBackContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    navigationBackIcon: {
        height: 20,
        marginLeft: 3
    },
    navigationBackText: {
        color: '#da4400',
        fontSize: 18,
        marginLeft: -8
    },
    customHeaderStyle: {
        backgroundColor: '#000000',
        shadowRadius: 0,
        shadowOffset: {
            height: 0
        },
        shadowColor: 'transparent'
    },
    smallComment: {
        fontSize: 13,
        color: 'white',
        lineHeight: 20
    },
    horizontalCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    veticalCenter: {
        flex: 1,
        alignItems: 'center'
    },
    fullCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orignalPadding: {
        paddingHorizontal: 15
    },
    full: {
        flex: 1
    },
    colorWhite: {
        color: 'white'
    },
    colorBlack: {
        color: 'black'
    },
    fontBold: {
        fontWeight: 'bold'
    },
    commonButton: {
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 6
    },
    fontSize_25: {
        fontSize: 25
    },
    fontSize_24: {
        fontSize: 24
    },
    fontSize_23: {
        fontSize: 23
    },
    fontSize_22: {
        fontSize: 22
    },
    fontSize_21: {
        fontSize: 21
    },
    fontSize_20: {
        fontSize: 20
    },
    fontSize_19: {
        fontSize: 19
    },
    fontSize_18: {
        fontSize: 18
    },
    fontSize_17: {
        fontSize: 17
    },
    fontSize_16: {
        fontSize: 16
    },
    fontSize_15: {
        fontSize: 15
    },
    fontSize_14: {
        fontSize: 14
    },
    fontSize_13: {
        fontSize: 13
    },
    fontSize_12: {
        fontSize: 12
    },
    add_track_component_container: {
        backgroundColor: '#121212',
        padding: 15
    },
    checkedIcon: {
        borderWidth: 2,
        borderColor: '#BC3B00',
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: '#da4400'
    },
    unCheckedIcon: {
        borderWidth: 2,
        borderColor: '#BC3B00',
        width: 20,
        height: 20,
        borderRadius: 20,
    },
    checkBoxText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 16
    },
    euroSignIcon: {
        width: 18,
        height: 27,
        resizeMode: 'contain'
    },
    settingIcon: {
        width: 27,
        height: 27,
        resizeMode: 'contain'
    },
    whiteLogo: {
        width: 80,
        height: 50,
        resizeMode: 'contain'
    },
    spotIcon: {
        width: 20, height: 20, resizeMode: 'contain'
    },
    marginTop_1: {
        marginTop: 1,
    },
    marginTop_2: {
        marginTop: 2,
    },
    marginTop_3: {
        marginTop: 3,
    },
    marginTop_4: {
        marginTop: 4,
    },
    marginTop_5: {
        marginTop: 5,
    },
    marginTop_6: {
        marginTop: 6,
    },
    marginTop_7: {
        marginTop: 7,
    },
    marginTop_8: {
        marginTop: 8,
    },
    marginTop_9: {
        marginTop: 9,
    },
    marginTop_10: {
        marginTop: 10,
    },
    marginTop_11: {
        marginTop: 11,
    },
    marginTop_12: {
        marginTop: 12,
    },
    marginTop_13: {
        marginTop: 13,
    },
    marginTop_14: {
        marginTop: 14,
    },
    marginTop_15: {
        marginTop: 15,
    },
    marginTop_16: {
        marginTop: 16,
    },
    marginTop_17: {
        marginTop: 17,
    },
    marginTop_18: {
        marginTop: 18,
    },
    marginTop_19: {
        marginTop: 19,
    },
    marginTop_20: {
        marginTop: 20,
    },
    marginTop_21: {
        marginTop: 21,
    },
    marginTop_22: {
        marginTop: 22,
    },
    marginTop_23: {
        marginTop: 23,
    },
    marginTop_24: {
        marginTop: 24,
    },
    marginTop_25: {
        marginTop: 25,
    },
    marginTop_26: {
        marginTop: 26,
    },
    marginTop_27: {
        marginTop: 27,
    },
    marginTop_28: {
        marginTop: 28,
    },
    marginTop_29: {
        marginTop: 29,
    },
    marginTop_30: {
        marginTop: 30,
    },
    marginTop_31: {
        marginTop: 31,
    },
    marginTop_32: {
        marginTop: 32,
    },
    marginTop_33: {
        marginTop: 33,
    },
    marginTop_34: {
        marginTop: 34,
    },
    marginTop_35: {
        marginTop: 35,
    },
    marginTop_36: {
        marginTop: 36,
    },
    marginTop_37: {
        marginTop: 37,
    },
    marginTop_38: {
        marginTop: 38,
    },
    marginTop_39: {
        marginTop: 39,
    },
    marginTop_40: {
        marginTop: 40,
    },
    marginTop_41: {
        marginTop: 41,
    },
    marginTop_42: {
        marginTop: 42,
    },
    marginTop_43: {
        marginTop: 43,
    },
    marginTop_44: {
        marginTop: 44,
    },
    marginTop_45: {
        marginTop: 45,
    },
    marginTop_46: {
        marginTop: 46,
    },
    marginTop_47: {
        marginTop: 47,
    },
    marginTop_48: {
        marginTop: 48,
    },
    marginTop_49: {
        marginTop: 49,
    },
    marginTop_50: {
        marginTop: 50,
    },
    horizontalContainer: {
        flex: 1, 
        flexDirection: 'row'
    },
    flexDirectionRow: {
        flexDirection: 'row'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    alignItemsEnd: {
        alignItems: 'flex-end'
    }, 
    justifyContentCenter: {
        justifyContent: 'center'
    },  
    justifyContentEnd: {
        justifyContent: 'flex-end'
    },
    justifyContentStart: {
        justifyContent: 'flex-start'
    },
    defaultFontSize: {
        fontSize: 18
    },
    positionAbsolute: {
        position: 'absolute'
    },
    positionRelative: {
        position: 'relative'
    },
    backgroundBlack: {
        backgroundColor: 'black'
    },
    backgroundWhite: {
        backgroundColor: 'white'
    },
    justifyContentBetween: {
        justifyContent: 'space-between'
    },
    paddingHorizontal_15: {
        paddingHorizontal: 15
    },
    colorDefaultGray: {
        color: '#999999'
    },
    colorDefault: {
        color: '#da4400'
    },
    backgroundDefault: {
        backgroundColor: '#da4400'
    },
    commonPadding: {
        padding: 15
    },
    marginLeft_0: {
        marginLeft: 0,
    },
    marginLeft_1: {
        marginLeft: 1,
    },
    marginLeft_2: {
        marginLeft: 2,
    },
    marginLeft_3: {
        marginLeft: 3,
    },
    marginLeft_4: {
        marginLeft: 4,
    },
    marginLeft_5: {
        marginLeft: 5,
    },
    marginLeft_6: {
        marginLeft: 6,
    },
    marginLeft_7: {
        marginLeft: 7,
    },
    marginLeft_8: {
        marginLeft: 8,
    },
    marginLeft_9: {
        marginLeft: 9,
    },
    marginLeft_10: {
        marginLeft: 10,
    },
    marginLeft_11: {
        marginLeft: 11,
    },
    marginLeft_12: {
        marginLeft: 12,
    },
    marginLeft_13: {
        marginLeft: 13,
    },
    marginLeft_14: {
        marginLeft: 14,
    },
    marginLeft_15: {
        marginLeft: 15,
    },
});

export const defaultGray = '#999999';