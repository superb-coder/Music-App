import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper'
import { CommonStyle } from './_styles';

const backgroundImg = require('../../assets/images/g_background.png');
const backgroundHeight = (Dimensions.get("window").height * 0.78);
const getStartButtonWidth = (Dimensions.get("window").width * 0.5);
// import Auth from '../auth';
class GetStartScreen extends React.Component {
    static navigationOptions = {
        header: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            swipeIndex: 0
        }
    }

    UNSAFE_componentWillMount() { }

    componentDidMount() {

    }

    clickGetStartedButton = () => {
        let { swipeIndex } = this.state;

        if (swipeIndex != 3) {
            return;
        }

        this.props.navigation.navigate('HomeScreen');
    }

    swipeIndexChange = (index) => {
        this.setState({ swipeIndex: index });
    }

    render() {
        let { swipeIndex } = this.state;

        return (
            <View style={myStyles.container}>
                <View style={{ width: '100%', height: backgroundHeight + 25, position: 'relative' }}>
                    <Image
                        source={backgroundImg}
                        style={[myStyles.backgroundImage]}
                        resizeMode={"stretch"}
                    />
                    <View style={{ height: backgroundHeight + 25, position: 'absolute', left: 0, top: 0, right: 0, width: '100%' }}>
                        <Swiper
                            dotColor="transparent"
                            activeDotColor="transparent"
                            loop={false}
                            onIndexChanged={this.swipeIndexChange}
                        >
                            <View style={myStyles.slide1}>
                                <View style={myStyles.descriptionContainer}>
                                    <Text style={myStyles.descriptionText}>
                                        Welcome to {"\n"}The biggest{"\n"}Afromusic{"\n"}Mobile record{"\n"}Company.
                            </Text>
                                </View>
                            </View>
                            <View style={myStyles.slide1}>
                                <View style={myStyles.descriptionContainer}>
                                    <Text style={myStyles.descriptionText}>
                                        We distribute {"\n"}Your music{"\n"}Worldwide{"\n"}Make noise.
                            </Text>
                                </View>
                            </View>
                            <View style={myStyles.slide1}>
                                <View style={myStyles.descriptionContainer}>
                                    <Text style={myStyles.descriptionText}>
                                        We believe in {"\n"}Your talent.{"\n"}Tell now your{"\n"}Story.
                            </Text>
                                </View>
                            </View>
                            <View style={[myStyles.slide1]}>
                                <View style={[myStyles.descriptionContainer, CommonStyle.alignItemsCenter]}>
                                    <Text style={[myStyles.descriptionText, { paddingBottom: 100, textAlign: 'center', marginLeft: 0 }]}>
                                        Join the {"\n"}Jaiye Family.
                            </Text>

                                </View>
                                <View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter, { position: 'absolute', bottom: 0, width: '100%' }]}>
                                    <TouchableOpacity activeOpacity={0.6} style={myStyles.getStartButton} onPress={() => { this.clickGetStartedButton(); }}>
                                        <Text style={{ color: "white", fontFamily: 'ProximaNova-Bold', }}>GET STARTED</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </Swiper>
                    </View>
                </View>

                <View style={[CommonStyle.full, CommonStyle.justifyContentEnd]}>
                    <View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter, { marginBottom: 20 }]}>
                        {
                            [0, 1, 2, 3].map((item) => {

                                if (swipeIndex == item) {
                                    return (<View key={item.toString()} style={{ backgroundColor: '#da4400', width: 8, height: 8, borderRadius: 4, margin: 3, }} />);
                                } else {
                                    return (<View key={item.toString()} style={{ backgroundColor: '#d8d8d8', width: 8, height: 8, borderRadius: 4, margin: 3, }} />);
                                }
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export const myStyles = StyleSheet.create({
    container: {
        paddingBottom: 30,
        flex: 1
    },
    backgroundImage: {
        height: backgroundHeight,
        width: '100%',
    },
    slide1: {
        flex: 1,
    },
    descriptionContainer: {
        flex: 1,
        paddingLeft: 25,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    descriptionText: {
        color: 'white',
        fontSize: 38,
        lineHeight: 41.7,
        paddingBottom: 45,
        fontFamily: 'ProximaNova-Bold',
        justifyContent: 'center',
        marginLeft: -50
    },
    getStartButton: {
        width: getStartButtonWidth,
        backgroundColor: '#da4400',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: -25,
    }
});

export default GetStartScreen;