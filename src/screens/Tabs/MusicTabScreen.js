import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, FlatList, TouchableOpacity, Image, ScrollView, Alert, AsyncStorage } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RBSheet from "react-native-raw-bottom-sheet";
import UserAvatar from 'react-native-user-avatar';
import moment from 'moment';
import _ from 'lodash';
import APIGatewayFetch from '../../APIGateway';
import { CommonStyle, defaultGray } from "../_styles";
import LoadingOverlay from '../../widgets/LoadingOverlay';
import { S3URL } from '../../Constants';
const statusBarHeight = getStatusBarHeight();
const euroSign = require('../../../assets/icons/icon_euro_sign.png');
const settings = require('../../../assets/icons/icon_settings.png');
const whiteLogo = require('../../../assets/icons/white_logo.png');
const backgroundImg = require('../../../assets/images/new_release_background.png');
const sample_track_icon = require('../../../assets/icons/icon_sample_track.png');
const spotIcon = require('../../../assets/icons/icon_spot.png');
const icon_filter = require('../../../assets/icons/icon_filter.png');
const icon_list_check = require('../../../assets/icons/icon_list_check.png');
const backgroundHeight = (Dimensions.get("window").height * 0.78);
const getStartButtonWidth = (Dimensions.get("window").width * 0.5);
const lastReleaseAvatarWidth = (Dimensions.get("window").width * 0.3);
const listAvatarWidth = (Dimensions.get("window").width * 0.213);

class MusicTabScreen extends React.Component {
    static navigationOptions = {
        header: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            releaseCount: 0,
            trackList: [],
            menuFilterList: [
                {
                    "icon": "photo-camera",
                    "label": "All"
                },
                {
                    "icon": "photo-camera",
                    "label": "Delivered"
                },
                {
                    "icon": "photo",
                    "label": "In review"
                },
                {
                    "icon": "mic",
                    "label": "To correct"
                },
                {
                    "icon": "brush",
                    "label": "Takedowns"
                },
                {
                    "icon": "mic",
                    "label": "Errors"
                }
            ],
            filteredTrackList: [],
            selectedFilter: 'All',
            isLoading: false,
            selectedTrack: null
        }
    }

    componentDidMount() {
        global.refreshEmitter.addListener('REFRESH_MUSIC_TAB', data => {
            this.loadTracks();
        })

        
        this.props.navigation.addListener("didFocus", () => {
            this.loadTracks();
        })

        this.loadTracks();
    }

    loadTracks = () => {
        this.setState({isLoading: true}, () => {
            let { selectedFilter } = this.state;
            Promise.all([
                AsyncStorage.getItem('@Auth:id'),
                AsyncStorage.getItem('@Auth:type')
            ]).then(([
                authId,
                type
            ]) => {
                const apiObj = new APIGatewayFetch();

                if (type != "label") {
                    apiObj.findAll({
                        "model": "ReleaseSubmitted",
                        "where": {
                            "artistId": authId
                        }
                    }).then((result) => {
                        let selectedTrack = null;

                        if (Array.isArray(result) && result.length > 0) {
                            if (result.length == 1) {
                                selectedTrack = result[0];
                            } else {
                                let index = 0;

                                for(let i = 1; i < result.length; i ++) {
                                    if (moment(result[index].physicalReleaseDate).format("YYYY-MM-DD HH:mm:ss") <= moment(result[i].physicalReleaseDate).format("YYYY-MM-DD HH:mm:ss")) {
                                        index = i;
                                    }
                                }

                                selectedTrack = result[index];
                            }
                        }

                        this.setState({trackList: result, selectedTrack}, () => {
                            this.changeFilter(selectedFilter)
                        });
                    }).finally(() => {
                        this.setState({isLoading: false});
                    });
                } else {
                    apiObj.findAll({
                        "model": "ReleaseSubmitted",
                        "where": {
                            "labelId": authId
                        }
                    }).then((result) => {
                        let selectedTrack = null;

                        if (Array.isArray(result) && result.length > 0) {
                            if (result.length == 1) {
                                selectedTrack = result[0];
                            } else {
                                let index = 0;

                                for(let i = 1; i < result.length; i ++) {
                                    if (moment(result[index].physicalReleaseDate).format("YYYY-MM-DD HH:mm:ss") <= moment(result[i].physicalReleaseDate).format("YYYY-MM-DD HH:mm:ss")) {
                                        index = i;
                                    }
                                }

                                selectedTrack = result[index];
                            }
                        }

                        this.setState({trackList: result, selectedTrack}, () => {
                            this.changeFilter(selectedFilter)
                        });
                    }).finally(() => {
                        this.setState({isLoading: false});
                    });
                }
            })
        })
    }

    clickNewRelease = () => {
        this.props.navigation.navigate("AddTrackScreen");
    }

    clickTrack = (item) => {
        this.props.navigation.navigate("TrackStatusScreen", { item });
    }

    toggleMenu = () => {
        this.filterMenu.open()
    }

    changeFilter = (label) => {
        let { trackList } = this.state;

        if (trackList.length == 0) {
            this.setState({filteredTrackList: trackList, selectedFilter: label}, () => {
                this.filterMenu.close()
            });

            return;
        }

        if (label == "All") {
            this.setState({filteredTrackList: trackList, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        } else if(label == "Delivered") {
            const filtered = _.filter(trackList, r=>r.status == 102 || r.status == 103);

            this.setState({filteredTrackList: filtered, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        } else if(label == "In review") {
            const filtered = _.filter(trackList, r=>r.status == 101);

            this.setState({filteredTrackList: filtered, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        } else if(label == "Takedowns") {
            const filtered = _.filter(trackList, r=>r.status == 105);

            this.setState({filteredTrackList: filtered, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        } else if(label == "To correct") {
            const filtered = _.filter(trackList, r=>r.status == 100);

            this.setState({filteredTrackList: filtered, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        } else {
            const filtered = _.filter(trackList, r=>r.status == 106);

            this.setState({filteredTrackList: filtered, selectedFilter: label}, () => {
                this.filterMenu.close()
            });
        }
    }

    render() {
        let { selectedTrack, trackList, selectedFilter, menuFilterList, filteredTrackList, isLoading } = this.state;

        return (
            <View style={[CommonStyle.container, CommonStyle.backgroundWhite]}>
                {
                    (trackList.length == 0) &&
                    <>
                        <ImageBackground
                            source={backgroundImg}
                            style={myStyles.backgroundImage}
                            resizeMode={"stretch"}
                        >
                            <View style={[CommonStyle.full, CommonStyle.paddingHorizontal_15]}>
                                <View style={myStyles.navigationContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("PaymentScreen")
                                        }}
                                    >
                                        <Image
                                            source={euroSign}
                                            style={CommonStyle.euroSignIcon}
                                        />
                                    </TouchableOpacity>

                                    <Image
                                        source={whiteLogo}
                                        style={CommonStyle.whiteLogo}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("SupportScreen");
                                        }}
                                    >
                                        <Image
                                            source={settings}
                                            style={CommonStyle.settingIcon}
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <Text style={[CommonStyle.fontBold, CommonStyle.colorWhite, myStyles.musicRightThereText]}>
                                {"Distribute your music right there."}
                            </Text>
                        </ImageBackground>
                        <View style={myStyles.newReleaseButton}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[CommonStyle.commonButton, myStyles.newReleaseTouchButton]}
                                onPress={this.clickNewRelease}
                            >
                                <Text style={myStyles.newReleaseButtonText}>
                                    + New Release
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }

                {
                    trackList.length > 0 &&
                    <>
                        <View style={ myStyles.bodyContainer }>
                            <View style={ myStyles.navigationFullContainer }>
                                <View style={myStyles.navigationContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("PaymentScreen")
                                        }}
                                    >
                                        <Image
                                            source={euroSign}
                                            style={CommonStyle.euroSignIcon}
                                        />
                                    </TouchableOpacity>

                                    <Image
                                        source={whiteLogo}
                                        style={CommonStyle.whiteLogo}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate("SupportScreen");
                                        }}
                                    >
                                        <Image
                                            source={settings}
                                            style={CommonStyle.settingIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[CommonStyle.paddingHorizontal_15, { backgroundColor: '#252525' }]}>
                                <View style={myStyles.selectedTrackContainer}>
                                    {/* <Image
                                        source={sample_track_icon}
                                        style={ myStyles.selectedTrackAvatar }
                                    /> */}
                                    <UserAvatar
                                        src={selectedTrack.cover ? `${S3URL}${selectedTrack.cover}` : 'https://img.icons8.com/material-rounded/344/stack-of-photos.png'}
                                        borderRadius={0}
                                        size={lastReleaseAvatarWidth}
                                        imageStyle={{borderRadius: 0}}
                                        style={[{ resizeMode: 'contain', borderRadius: 0  }]}
                                    />
                                    <View style={myStyles.selectedTrackTextContainer}>
                                        <Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_15, CommonStyle.fontSize_15, { fontWeight: '600' }]}>
                                            {selectedTrack ? selectedTrack.releaseTitle : ""}
                                        </Text>
                                        <Text style={[CommonStyle.marginTop_5, CommonStyle.fontSize_15, CommonStyle.marginTop_5, CommonStyle.colorDefaultGray]}>
                                            {"LATEST RELEASE - "}{selectedTrack ? (selectedTrack.typeReleasesubmitted == "album" ? "ALBUM" : "SINGLE" ) : ""}
                                        </Text>
                                        <Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.marginTop_5, CommonStyle.fontSize_17]}>
                                            {selectedTrack.totalStreams == null && "0 streams"} 
                                            {selectedTrack.totalStreams != null && `${selectedTrack.totalStreams} streams`} 
                                        </Text>
                                    </View>
                                </View>
                                <View style={myStyles.customBorder}></View>

                                <View style={{ paddingVertical: 15, }}>
                                    <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15, {  marginBottom: 10 }]}>
                                        {"ALL-TIME"}
                                    </Text>

                                    <View >
                                        <View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
                                            <View style={myStyles.item_container}>
                                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15, CommonStyle.fontBold]}>
                                                    10
                                                </Text>
                                            </View>
                                            <View style={myStyles.item_container}>
                                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15, CommonStyle.fontBold]}>
                                                    130,7k
                                                </Text>
                                            </View>
                                            <View style={myStyles.item_container}>
                                                <Image
                                                    style={CommonStyle.spotIcon}
                                                    source={spotIcon}
                                                />
                                            </View>
                                        </View>
                                        <View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_10]}>
                                            <View style={myStyles.item_container}>
                                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15]}>
                                                    {"releases"}
                                                </Text>
                                            </View>
                                            <View style={myStyles.item_container}>
                                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15]}>
                                                    {"streams"}
                                                </Text>
                                            </View>
                                            <View style={myStyles.item_container}>
                                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15]}>
                                                    {"best platform"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[CommonStyle.container, CommonStyle.backgroundWhite, { paddingTop: 15 }]}>
                                <TouchableOpacity activeOpacity={0.95} style={ myStyles.filterButtonContainer } onPress={this.toggleMenu}>
                                    <Image source={icon_filter} style={myStyles.filterIcon} />
                                </TouchableOpacity>
                                <View style={CommonStyle.full}>
                                    <ScrollView style={CommonStyle.paddingHorizontal_15}>
                                        {
                                            filteredTrackList.map((item) => {
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.95}
                                                        style={[
                                                            CommonStyle.full,
                                                            CommonStyle.flexDirectionRow,
                                                            CommonStyle.alignItemsCenter,
                                                            {
                                                                paddingBottom: 15
                                                            }
                                                        ]}
                                                        onPress={() => { this.clickTrack(item) }}
                                                    >
                                                        <View>
                                                            <UserAvatar
                                                                src={item.cover ? `${S3URL}${item.cover}` : 'https://img.icons8.com/material-rounded/344/stack-of-photos.png'}
                                                                borderRadius={0}
                                                                size={listAvatarWidth}
                                                                imageStyle={{borderRadius: 0}}
                                                                style={[{ resizeMode: 'contain', borderRadius: 0  }, item.status == 4 && { opacity: 0.5 }]}
                                                            />
                                                        </View>
                                                        <View style={[CommonStyle.full, { paddingLeft: 15 }]}>
                                                            <Text style={[CommonStyle.fontSize_12, item.status == 4 && CommonStyle.colorDefaultGray]}>
                                                                {item.releaseTitle}
                                                            </Text>
                                                            <Text style={[CommonStyle.marginTop_3, CommonStyle.fontSize_12, CommonStyle.colorDefaultGray, item.status == 4 && CommonStyle.colorDefaultGray]}>
                                                                {item.typeReleasesubmitted == null && "RELEASE - SINGLE"}
                                                                {item.typeReleasesubmitted == "single" && "RELEASE - SINGLE"}
                                                                {item.typeReleasesubmitted == "album" && "RELEASE - ALBUM"}
                                                            </Text>
                                                            <Text style={[CommonStyle.marginTop_3, CommonStyle.fontBold, CommonStyle.fontSize_13, item.status == 4 && CommonStyle.colorDefaultGray]}>
                                                                {item.totalStreams == null && "0 streams"} 
                                                                {item.totalStreams != null && `${item.totalStreams} streams`} 
                                                            </Text>
                                                            <View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_3]}>
                                                                <View style={[
                                                                    CommonStyle.backgroundDefault,
                                                                    { width: 6, height: 6, borderRadius: 6 },
                                                                    item.status == 1 && { backgroundColor: '#56CB82' },
                                                                    item.status == 3 && { backgroundColor: '#BB4F4B' },
                                                                    item.status == 4 && { backgroundColor: defaultGray },
                                                                ]}>

                                                                </View>
                                                                <Text style={[
                                                                    CommonStyle.fontSize_12,
                                                                    CommonStyle.colorBlack,
                                                                    { 
                                                                        marginLeft: 5 
                                                                    },
                                                                    (item.status == 102 || item.status == 103) && { color: '#56CB82' },
                                                                    item.status == 101 && CommonStyle.colorDefault,
                                                                    item.status == 100 && { color: '#BB4F4B' },
                                                                    item.status == 105 && CommonStyle.colorDefaultGray,
                                                                    item.status == 106 && { color: 'red' },
                                                                ]}>
                                                                    {(item.status == 102 || item.status == 103) && "Delivered"}
                                                                    {item.status == 101 && "In review"}
                                                                    {item.status == 100 && "To correct"}
                                                                    {item.status == 105 && "Takedown"}
                                                                    {item.status == 106 && "Errors"}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )

                                            })
                                        }
                                    </ScrollView>
                                    <View
                                        style={ myStyles.absolute_bottom_container }
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[CommonStyle.commonButton, myStyles.newReleaseTouchButton]}
                                            onPress={this.clickNewRelease}
                                        >
                                            <Text style={myStyles.newReleaseButtonText}>
                                                + New Release
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                }

                {
                    isLoading && <LoadingOverlay/>
                }

                <RBSheet
                    ref={ref => {
                        this.filterMenu = ref;
                    }}
                    height={330}
                >
                    <View style={myStyles.listContainer}>
                        <Text style={myStyles.listTitle}>Filter by...</Text>
                        {menuFilterList.map(list => (
                            <TouchableOpacity
                                key={list.icon}
                                style={myStyles.listButton}
                                onPress={() => {
                                    
                                    this.changeFilter(list.label);
                                }}
                            >
                                {
                                    list.label == selectedFilter && (
                                        <Image source={icon_list_check} style={ myStyles.listCheckIcon } />
                                    )
                                }

                                {
                                    list.label != selectedFilter && (
                                        <View style={{ width: 15, height: 15 }} />
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
    backgroundImage: {
        height: backgroundHeight,
        width: '100%',
        resizeMode: "cover",
        paddingTop: statusBarHeight
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    textTitle: {
        fontSize: 20,
        marginTop: 120
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 50
    },
    button: {
        width: 150,
        backgroundColor: "#4EB151",
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 3,
        margin: 10
    },
    buttonTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600"
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
    listIcon: {
        fontSize: 26,
        color: "#666",
        width: 60
    },
    listLabel: {
        fontSize: 16,
        paddingLeft: 15
    },
    gridContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
        marginBottom: 20
    },
    gridButtonContainer: {
        flexBasis: "25%",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    gridButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    gridIcon: {
        fontSize: 30,
        color: "white"
    },
    gridLabel: {
        fontSize: 14,
        paddingTop: 10,
        color: "#333"
    },
    dateHeaderContainer: {
        height: 45,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dateHeaderButton: {
        height: "100%",
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    dateHeaderButtonCancel: {
        fontSize: 18,
        color: "#666",
        fontWeight: "400"
    },
    dateHeaderButtonDone: {
        fontSize: 18,
        color: "#006BFF",
        fontWeight: "500"
    },
    inputContainer: {
        borderTopWidth: 1.5,
        borderTopColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        padding: 10
    },
    inputIcon: {
        fontSize: 24,
        color: "#666",
        marginHorizontal: 5
    },
    inputIconSend: {
        color: "#006BFF"
    },
    input: {
        flex: 1,
        height: 36,
        borderRadius: 36,
        paddingHorizontal: 10,
        backgroundColor: "#f1f1f1",
        marginHorizontal: 10
    },
    messageContainer: {
        flex: 1,
        padding: 25
    },
    messageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222"
    },
    message: {
        fontSize: 17,
        lineHeight: 24,
        marginVertical: 20
    },
    messageButtonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    messageButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#3385ff",
        marginLeft: 10
    },
    messageButtonText: {
        color: "#3385ff",
        fontSize: 16,
        fontWeight: "bold"
    },
    messageButtonRight: {
        backgroundColor: "#3385ff"
    },
    messageButtonTextRight: {
        color: "#fff"
    },
    item_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    absolute_bottom_container: {
        position: "absolute",
        width: '100%',
        height: 40,
        bottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    navigationContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    newReleaseButton: {
        flex: 1, 
        paddingHorizontal: 15, 
        justifyContent: 'center', 
        paddingTop: 15, 
        flexDirection: 'row'
    },
    newReleaseButtonText: {
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold'
    },
    newReleaseTouchButton: {
        backgroundColor: '#da4400',
        width: getStartButtonWidth
    },
    filterIcon: {
        width: 25, 
        height: 25, 
        resizeMode: 'contain'
    },
    filterButtonContainer: {
        justifyContent: 'flex-end', 
        flexDirection: 'row', 
        paddingHorizontal: 15
    },
    musicRightThereText: {
        fontSize: 35, 
        paddingBottom: 7, 
        textAlign: 'center', 
        paddingHorizontal: 15
    },
    bodyContainer: {
        flex: 1, 
        paddingTop: statusBarHeight, 
        backgroundColor: 'black'
    },
    customBorder: {
        height: 2, 
        width: '100%', 
        backgroundColor: '#da4400'
    },
    listCheckIcon: {
        width: 15, 
        height: 15, 
        resizeMode: 'contain'
    },
    navigationFullContainer: {
        backgroundColor: 'black', 
        paddingHorizontal: 15, 
        height: 60, 
        marginTop: 15
    },
    selectedTrackContainer: {
        paddingVertical: 30, 
        flexDirection: 'row', 
        height: lastReleaseAvatarWidth + 60
    },
    selectedTrackAvatar: {
        width: lastReleaseAvatarWidth, 
        height: lastReleaseAvatarWidth
    },
    selectedTrackTextContainer: {
        flex: 1, 
        paddingLeft: 15
    }
});

export default MusicTabScreen;