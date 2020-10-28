import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { CommonStyle, defaultGray } from '../_styles';

const halfOfWindows = Dimensions.get("window").width / 2;
const navigationBack = require('../../../assets/images/back_icon.png');
const icon_sample_platform = require('../../../assets/icons/icon_sample_platform.png');
const icon_filter = require('../../../assets/icons/icon_filter.png');
const icon_list_check = require('../../../assets/icons/icon_list_check.png');

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

class TopPlayListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        var clickRight = () => { };

        let params = navigation.state.params;

        if (params && params.clickRight) {
            clickRight = params.clickRight;
        }

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
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={myStyles.navigationRight}
                    onPress={clickRight}
                >
                    <Image source={icon_filter} style={myStyles.filterIcon} />
                </TouchableOpacity>
            ),
            headerStyle: CommonStyle.headerStyle
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedFilter: 'Last 28 days',
            menuFilterList: [
                {
                    "icon": "photo-camera",
                    "label": "Last 24 hours"
                },
                {
                    "icon": "photo",
                    "label": "Last 7 days"
                },
                {
                    "icon": "brush",
                    "label": "Last 28 days"
                },
                {
                    "icon": "mic",
                    "label": "Last trimester"
                },
                {
                    "icon": "mic1",
                    "label": "Last year"
                }
                ,
                {
                    "icon": "mic2",
                    "label": "All-time"
                }
            ],
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clickRight: this.clickNextButton
        })
    }

    clickNextButton = () => {
        this.filterMenu.open()
    }

    render() {
        let { selectedFilter, menuFilterList } = this.state;

        return (
            <View style={CommonStyle.full}>
                <View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 15 }]}>
                    <Text style={myStyles.titleText}>
                        {"Before You Wake Up"}
                    </Text>

                    <Text style={myStyles.your_top_songs_text}>
                        {"Playlists"}
                    </Text>

                    <View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentBetween, CommonStyle.marginTop_10]}>
                        <Text style={myStyles.period_sub_title}>
                            {selectedFilter}
                        </Text>
                        <Text style={myStyles.period_sub_title}>
                            {"STREAMS"}
                        </Text>
                    </View>
                </View>

                <ScrollView style={[CommonStyle.full, CommonStyle.marginTop_10, CommonStyle.paddingHorizontal_15]}>
                    {
                        data.map((item, index) => {
                            return (
                                <View style={[CommonStyle.flexDirectionRow, CommonStyle.marginTop_15]}>
                                    {
                                        <Image
                                            source={icon_sample_platform}
                                            style={myStyles.itemAvatar}
                                        />
                                    }
                                    <View style={[CommonStyle.full, CommonStyle.justifyContentCenter, { paddingLeft: 15 }]}>

                                        <Text style={CommonStyle.marginTop_5}>
                                            {
                                                item.title
                                            }
                                        </Text>

                                    </View>
                                    <View style={[CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>

                                        <Text style={CommonStyle.marginTop_5}>
                                            {
                                                item.streams
                                            }
                                        </Text>

                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <RBSheet
                    ref={ref => {
                        this.filterMenu = ref;
                    }}
                    height={330}
                >
                    <View style={myStyles.listContainer}>
                        <Text style={myStyles.listTitle}>Choose time period...</Text>
                        {menuFilterList.map(list => (
                            <TouchableOpacity
                                key={list.icon}
                                style={myStyles.listButton}
                                onPress={() => {
                                    this.setState({ selectedFilter: list.label }, () => {
                                        this.filterMenu.close()
                                    })
                                }}
                            >
                                {
                                    list.label == selectedFilter && (
                                        <Image source={icon_list_check} style={myStyles.listCheckedIcon} />
                                    )
                                }

                                {
                                    list.label != selectedFilter && (
                                        <View style={myStyles.listEmptyIcon} />
                                    )
                                }

                                {
                                    list.label == selectedFilter && (
                                        <Text style={[myStyles.listLabel, CommonStyle.colorDefault]}>{list.label}</Text>
                                    )
                                }

                                {
                                    list.label != selectedFilter && (
                                        <Text style={myStyles.listLabel}>{list.label}</Text>
                                    )
                                }


                            </TouchableOpacity>
                        ))}
                    </View>
                </RBSheet>
            </View>
        )
    }
}

export const myStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#707070'
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
        fontSize: 28,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: 'ProximaNova-Bold'
    },
    period_sub_title: {
        color: '#999999',
        fontSize: 12,
        marginTop: 5,
        textTransform: 'uppercase'
    },
    checkBoxIconContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    listContainer: {
        flex: 1,
        padding: 25
    },
    listTitle: {
        fontSize: 16,
        marginBottom: 20,
        color: "black"
    },
    listButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15
    },
    listLabel: {
        fontSize: 16,
        paddingLeft: 15
    },
    navigationRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        marginRight: 15
    },
    filterIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    listCheckedIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    listEmptyIcon: {
        width: 15,
        height: 15
    },
    itemAvatar: {
        width: Dimensions.get("window").width * 0.117,
        height: Dimensions.get("window").width * 0.117,
        resizeMode: 'contain'
    },
    titleText: {
        fontSize: 14, 
        color: 'black'
    }
});

export default TopPlayListScreen;