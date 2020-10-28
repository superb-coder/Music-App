import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import { CommonStyle, defaultGray } from "../_styles";

const navigationBack = require('../../../assets/images/back_icon.png');
const avatar1 = require('../../../assets/images/avatar1.png');
const avatar2 = require('../../../assets/images/avatar2.png');
const avatar3 = require('../../../assets/images/avatar3.png');

class SelectAuthorScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        var clickBack = () => { };

        let params = navigation.state.params;

        if (params && params.clickBack) {
            clickBack = params.clickBack;
        }
        return {
            headerTitle: () => null,
            headerLeft: () => (
                <TouchableOpacity
                    onPress={clickBack}
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
            headerRight: null,
            headerStyle: CommonStyle.headerStyle
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            authorFirstName: '',
            authorLastName: ''
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clickBack: this.clickBackButton
        })
    }

    clickBackButton = () => {
        let {authorFirstName, authorLastName} = this.state;

        if (authorFirstName.trim() == '' || authorLastName.trim() == '') {
            this.props.navigation.goBack();

            return;
        }

        const data = {
            authorFirstName,
            authorLastName
        };

        global.refreshEmitter.emit("ADD_AUTHOR", {data: data});

        this.props.navigation.goBack();
    }

    render() {
        let { authorFirstName, authorLastName } = this.state;
        return (
            <View style={CommonStyle.container}>
                <ScrollView style={myStyles.scroll}>
                    <View>
                        <Text style={CommonStyle.commonTitle}>
                            {"Author"}
                        </Text>
                    </View>
                    
                    <View style={CommonStyle.marginTop_5}>
                        <Text style={CommonStyle.smallComment}>{"Add the real name of authors who wrote the song for you."}</Text>
                    </View>

                    <View style={CommonStyle.marginTop_20}>
                        <FloatingLabel
                            labelStyle={CommonStyle.labelInput}
                            inputStyle={CommonStyle.input}
                            style={CommonStyle.formInput}
                            value={authorFirstName}
                            onChangeText={
                                text=> this.setState({authorFirstName: text})
                            }
                            >
                                First Name / Prénom
                        </FloatingLabel>
                    </View>
                    <View style={CommonStyle.marginTop_20}>
                        <FloatingLabel
                            labelStyle={CommonStyle.labelInput}
                            inputStyle={CommonStyle.input}
                            style={CommonStyle.formInput}
                            value={authorLastName}
                            onChangeText={
                                text=> this.setState({authorLastName: text})
                            }
                            >
                                Last Name / Nom de Famille
                        </FloatingLabel>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export const myStyles = StyleSheet.create({
    scroll: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    checkBoxIconContainer: {
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        flexDirection: 'row'
    },
});

export default SelectAuthorScreen;