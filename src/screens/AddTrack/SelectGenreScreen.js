import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';

import { CommonStyle, defaultGray } from "../_styles";
import { GENRE } from '../../Constants';

const navigationBack = require('../../../assets/images/back_icon.png');

class SelectGenreScreen extends React.Component {
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
                    <Text style={CommonStyle.navigationBackText}>Release</Text>
                </TouchableOpacity>
            ),
            headerRight: null,
            headerStyle: CommonStyle.headerStyle
        };
    };

    constructor(props) {
        super(props);
        
        let selectedGenre = this.props.navigation.getParam("genre", '');
        
        this.state = {
            selectedGenre: selectedGenre
        }
    }

    componentDidMount() {
        
    }

    clickItem = (selected) => {
        global.refreshEmitter.emit("SELECTGENRE", {data: selected});

        this.setState({selectedGenre: selected});
    }

    render() {
        let { selectedGenre } = this.state;
        return (
            <View style={CommonStyle.container}>
                <ScrollView style={myStyles.scroll}>
                    <View>
                        <Text style={CommonStyle.commonTitle}>
                            {"Music Style/Genre"}
                        </Text>
                    </View>
                    <View style={CommonStyle.marginTop_20}>
                        {
                            GENRE.map((item, index) => {
                                return (
                                    <TouchableOpacity 
                                        activeOpacity={0.95}
                                        style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_15]}
                                        onPress={()=>{
                                            this.clickItem(item.value)
                                        }}
                                        key={index.toString()}
                                    >
                                        <View style={[CommonStyle.full, CommonStyle.marginLeft_0]}>
                                            <Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite]}>
                                                {item.label}
                                            </Text>
                                        </View>
                                        {
                                            selectedGenre == item.value && (
                                                <View style={CommonStyle.checkedIcon}></View>
                                            )
                                        }

                                        {
                                            selectedGenre != item.value && (
                                                <View style={CommonStyle.unCheckedIcon}></View>
                                            )
                                        }
                                    </TouchableOpacity>
                                )
                            })
                        }
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

export default SelectGenreScreen;