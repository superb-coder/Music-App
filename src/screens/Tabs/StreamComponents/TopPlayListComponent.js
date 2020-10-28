import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from 'react-native';
import { CommonStyle, defaultGray } from '../../_styles';

const halfOfWindows = Dimensions.get("window").width / 2;
const thirdOfWindows = Dimensions.get("window").width * 0.3;

const icon_sample_platform = require('../../../../assets/icons/icon_sample_platform.png');
const arrow_right = require('../../../../assets/images/right_arrow.png');
const data = [
    {
        title: "Discover Weekly",
        streams: "4.7k"
    },
    {
        title: "Your Daily Mix",
        streams: "210"
    },
    {
        title: "Radio",
        streams: "200"
    }
]

class TopPlayListComponent extends React.Component {
    render() {
        return (
            <View style={myStyles.container}>
                <Text style={myStyles.your_top_songs_text}>
                    {"Top playlists"}
                </Text>

                <Text style={myStyles.period_sub_title}>
                    {"LAST 28 DAYS"}
                </Text>

                {
                    data.map((item, index) => {
                        return (
                            <View style={myStyles.itemContainer}>
                                {
                                    <Image
                                        source={icon_sample_platform}
                                        style={myStyles.trackAvatar}
                                    />
                                }
                                <View style={myStyles.itemSubContainer}>
                                    <Text >
                                        {
                                            index > 10 ? index + 1 : `0${index + 1}`
                                        }
                                    </Text>
                                    <Text style={{ marginTop: 5 }}>
                                        {
                                            item.title
                                        }
                                    </Text>
                                    <Text style={myStyles.streamText}>
                                        {item.streams} {"streams"}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={myStyles.seeAllButton}
                    onPress={() => {
                        if (this.props.clickSeeAll) {
                            this.props.clickSeeAll()
                        }
                    }}
                >
                    <Text>
                        See all
                    </Text>
                    <Image
                        source={arrow_right}
                        style={myStyles.arrowRightImage}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export const myStyles = StyleSheet.create({
    container: {
        marginTop: 10
    },
    scroll: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    add_track_button: {
        width: halfOfWindows,
        backgroundColor: 'black',
        height: 40,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 7
    },
    your_top_songs_text: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold'
    },
    period_sub_title: {
        color: '#999999',
        fontSize: 12,
        marginTop: 15
    },
    itemContainer: {
        marginTop: 15,
        flexDirection: 'row'
    },
    trackAvatar: {
        width: Dimensions.get("window").width * 0.23,
        height: Dimensions.get("window").width * 0.23,
        resizeMode: 'contain'
    },
    itemSubContainer: {
        flex: 1,
        paddingLeft: 15
    },
    seeAllButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15
    },
    arrowRightImage: {
        width: 12, 
        height: 14, 
        resizeMode: 'contain'
    },
    streamText: {
        color: '#999999', 
        marginTop: 5
    }
});

export default TopPlayListComponent;