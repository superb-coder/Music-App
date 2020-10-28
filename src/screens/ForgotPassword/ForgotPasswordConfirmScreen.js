import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";

import AWSCognito from '../../Auth/AWSCongito';
import LoadingOverlay from '../../widgets/LoadingOverlay';
import { CommonStyle } from "../_styles";

const navigationBack = require('../../../assets/images/back_icon.png');
const nextButtonWidth = Dimensions.get("window").width / 2;

class ForgotPasswordConfirmScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        
        return {
            headerTitle: () => null,
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={CommonStyle.navigationBackContainer}
                >
                    <Image
                        source={navigationBack}
                        style={CommonStyle.navigationBackIcon}
                        resizeMode="contain"
                    />
                    
                    <Text style={CommonStyle.navigationBackText}>Back</Text>
                </TouchableOpacity>
            ),
            headerRight: () => null,
            headerStyle: CommonStyle.headerStyle
        };
    };

    constructor(props) {
        super(props);

        let email = this.props.navigation.getParam("email", "");

        this.state = {
            email: email,
            code: '',
            password: '',
            confirmPassword: '',
            modalVisible: false,
            isLoading: false,
            dialogTitle: '',
            dialogDescription: ''
        }
    }

    UNSAFE_componentWillMount() {

    }

    clickSubmit = () => {
        let { email, code, password, confirmPassword } = this.state;

        if (code == '') {
            this.setState({dialogTitle: 'Error', dialogDescription: 'Please enter code(check your email)', modalVisible: true});

            return;
        }

        if (password == '') {
            this.setState({dialogTitle: 'Error', dialogDescription: 'Please enter new password', modalVisible: true});

            return;
        }

        if (password.length < 8 || password.match(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})"))) {
            this.setState({dialogTitle: 'Error', dialogDescription: "Must contain minimum 8 characters, atleast contains one uppercase, one lowercase, one number and one special case character from '!@#$%^&*'", modalVisible: true});

            return;
        }

        if (confirmPassword == '') {
            this.setState({dialogTitle: 'Error', dialogDescription: 'Please enter confirm password', modalVisible: true});

            return;
        }

        if (password != confirmPassword) {
            this.setState({dialogTitle: 'Error', dialogDescription: "Passwords does not match", modalVisible: true});

            return;
        }



        const awsCognito = new AWSCognito();

        this.setState({isLoading: true}, () => {
            awsCognito.forgotPasswordSubmit({
                username: email,
                code: code,
                newPassword: password
            }).then((resSignIn) => {
                this.setState({isLoading: false});

                if (resSignIn && resSignIn.code) {
                    this.setState({dialogTitle: 'Error', dialogDescription: resSignIn.message, modalVisible: true});
                } else {
                    this.setState({dialogTitle: 'Success', dialogDescription: "Your password has been changed successfully.", modalVisible: true});
                }
            })
        })
        

        // this.setState({ modalVisible: true })
    }

    render() {
        let { email, modalVisible, isLoading, code, password, confirmPassword, dialogTitle, dialogDescription } = this.state;

        return (
            <View style={CommonStyle.container}>
                <ScrollView style={myStyles.scroll}>
                    <View>
                        <Text style={CommonStyle.commonTitle}>
                            {"Set New Password"}
                        </Text>
                    </View>
                    <View style={CommonStyle.marginTop_15}>
                        <Text style={CommonStyle.smallComment}>{"Please setup new password for your account."}</Text>
                    </View>
                    <View style={CommonStyle.marginTop_25}>
                        <FloatingLabel
                            labelStyle={CommonStyle.labelInput}
                            inputStyle={CommonStyle.input}
                            style={CommonStyle.formInput}
                            value={code}
                            onChangeText={(text) => {
                                this.setState({ code: text });
                            }}
                        >
                            Code
                        </FloatingLabel>
                    </View>

                    <View style={CommonStyle.marginTop_15}>
                        <FloatingLabel
                            labelStyle={CommonStyle.labelInput}
                            inputStyle={CommonStyle.input}
                            style={CommonStyle.formInput}
                            value={password}
                            password={true}
                            onChangeText={(text) => {
                                this.setState({ password: text });
                            }}
                        >
                            Password
                        </FloatingLabel>
                    </View>
                    <View style={CommonStyle.marginTop_15}>
                        <FloatingLabel
                            labelStyle={CommonStyle.labelInput}
                            inputStyle={CommonStyle.input}
                            style={CommonStyle.formInput}
                            value={confirmPassword}
                            password={true}
                            onChangeText={(text) => {
                                this.setState({ confirmPassword: text });
                            }}
                        >
                            Confirm password
                        </FloatingLabel>
                    </View>

                    <View style={[CommonStyle.marginTop_25, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
                        <TouchableOpacity
                            style={[CommonStyle.commonButtonContainer, myStyles.nextContainer]}
                            onPress={this.clickSubmit}
                        >
                            <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_19]}>
                                {"Submit"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                {
                    modalVisible &&
                    (
                        <BlurView
                            style={myStyles.blueView}
                            blurType="dark"
                            blurAmount={7}
                            reducedTransparencyFallbackColor="#252525"
                        />
                    )
                }
                <Dialog.Container blurStyle={{backgroundColor: '#454545'}} contentStyle={{ backgroundColor: '#454545'}}  visible={modalVisible}>
                    <Dialog.Title style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{dialogTitle}</Dialog.Title>
                    <Dialog.Description style={[CommonStyle.colorWhite, CommonStyle.fontSize_13, {fontWeight: '600'}]}>
                        {dialogDescription}
                    </Dialog.Description>
                    <Dialog.Button label="OK" color={'#4696FF'} onPress={()=> {
                        let {dialogTitle} = this.state;

                        if (dialogTitle == 'Success') {
                            this.setState({ modalVisible: false }, () => {
                                this.props.navigation.navigate("SignInScreen")
                            });
                        } else {
                            this.setState({ modalVisible: false });
                        }
                        
                    }} />
                </Dialog.Container>
                {
                    isLoading && <LoadingOverlay loading={isLoading} />
                }
            </View>
        );
    }
}

export const myStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252525'
    },
    scroll: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    nextContainer: {
        backgroundColor: "#da4400",
        width: nextButtonWidth,
        height: 40,
        borderRadius: 40
    },
    blueView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

export default ForgotPasswordConfirmScreen;