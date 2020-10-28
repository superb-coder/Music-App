import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import moment from 'moment';
import Dialog from "react-native-dialog";

import { CommonStyle, defaultGray } from "../_styles";
import CustomDatePicker from '../../widgets/CustomDatePicker';

const navigationBack = require('../../../assets/images/back_icon.png');
const arrow_right = require('../../../assets/images/right_arrow.png');
const halfOfWindows = Dimensions.get("window").width / 2;
const windowsWidth = Dimensions.get("window").width;

class AlbumReleaseSettingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => (
                <Text style={CommonStyle.headerText}>
                    {"Release"}
                </Text>
            ),
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
            headerRight: null,
            headerStyle: CommonStyle.headerStyle
        };
    };

    constructor(props) {
        super(props);

        let trackAvatar = this.props.navigation.getParam("trackAvatar", null);
        let releaseTitle = this.props.navigation.getParam("releaseTitle", '');
        let lyricsLanguage = this.props.navigation.getParam("lyricsLanguage", '');
        let primaryGenre = this.props.navigation.getParam("primaryGenre", '');
        let isMixTap = this.props.navigation.getParam("isMixTap", false);
        let physicalReleaseDate = moment(new Date()).format("YYYY-MM-DD");
        let labelId = this.props.navigation.getParam("labelId", '');
        let firstName = this.props.navigation.getParam("firstName", '');
        let lastName = this.props.navigation.getParam("lastName", '');
        let cover = this.props.navigation.getParam("cover", '');
        let username = this.props.navigation.getParam("username", '');
        let mail = this.props.navigation.getParam("mail", '');
        let type = this.props.navigation.getParam("type", 'artist');
        let tracks = this.props.navigation.getParam("tracks", []);

        this.state = {
            trackAvatar: trackAvatar,
            physicalReleaseDate: physicalReleaseDate,
            trackType: '',
            releaseTitle: releaseTitle,
            isMixTap: isMixTap,
            showDatePicker: false,
            lyricsLanguage: lyricsLanguage,
            primaryGenre: primaryGenre,
            labelId: labelId,
            firstName: firstName,
            lastName: lastName,
            cover: cover,
            username: username,
            mail: mail,
            errorDialog: false,
            dialogTitle: '',
            dialogDescription: '',
            type,
            tracks
        }
    }

    componentDidMount() {}

    clickNext = () => {
        let { 
            trackAvatar, 
            releaseTitle, 
            isMixTap, 
            lyricsLanguage, 
            primaryGenre, 
            physicalReleaseDate,
            labelId,
            firstName,
            lastName,
            cover,
            username,
            mail,
            trackType,
            type,
            tracks
        } = this.state;

        this.props.navigation.navigate("AlbumReleaseCompleteScreen", {
            trackAvatar, 
            releaseTitle, 
            isMixTap, 
            lyricsLanguage, 
            primaryGenre, 
            physicalReleaseDate,
            labelId,
            firstName,
            lastName,
            cover,
            username,
            mail,
            trackType,
            type,
            tracks
        });
    }

    render() {
        let { trackAvatar, physicalReleaseDate, trackType, releaseTitle, isMixTap, showDatePicker } = this.state;
        return (
            <View style={CommonStyle.container}>
                <View style={myStyles.scroll}>
                    <View
                        style={myStyles.infoContainer}
                    >
                        <View style={myStyles.avatarContainer}>
                            {
                                trackAvatar && (
                                    <Image
                                        style={myStyles.avatarImage}
                                        source={trackAvatar ? trackAvatar : null}
                                    />
                                )
                            }

                            <Text style={myStyles.releaseTitle}>
                                {releaseTitle}
                            </Text>
                            <Text style={myStyles.userTitle}>
                                {"Kolokolo ft. Jackson R."}
                            </Text>
                            <Text style={myStyles.mixTapeTitle}>
                                {isMixTap ? "ALBUM/EP/MIXTAPE" : "SINGLE"}
                            </Text>
                        </View>
                    </View>
                    <View style={myStyles.releaseDateContainer}>
                        <Text style={myStyles.releaseDateText}>
                            {"Release Date"}
                        </Text>
                        <View style={myStyles.itemTouchContainer}>
                            <TouchableOpacity
                                activeOpacity={0.95}
                                style={[CommonStyle.flexDirectionRow, CommonStyle.marginTop_10, CommonStyle.full, { paddingBottom: 2 }]}
                                onPress={() => { this.setState({ showDatePicker: true }) }}>
                                <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18]}>
                                    {moment(physicalReleaseDate).format("DD/MM/YYYY")}
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={myStyles.continueButtonContainer}>
                        <TouchableOpacity
                            style={myStyles.continueButton}
                            activeOpacity={0.95}
                            onPress={this.clickNext}
                        >
                            <Text style={myStyles.continueButtonText}>
                                {"Continue"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {showDatePicker && (
                    <CustomDatePicker
                        date={physicalReleaseDate}
                        onClose={date => {
                            if (date) {
                                this.setState({ showDatePicker: false, physicalReleaseDate: date });
                            } else {
                                this.setState({ showDatePicker: false });
                            }
                        }}
                        onChange={d => {
                            this.setState({ physicalReleaseDate: moment(d) });
                        }}
                    />
                )}
            </View>
        )
    }
}

export const myStyles = StyleSheet.create({
    scroll: {
        flex: 1,
        paddingBottom: 15
    },
    checkBoxIconContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    continueButton: {
        width: halfOfWindows,
        height: 40,
        backgroundColor: '#DA4400',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    continueButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        bottom: 60,
        width: '100%'
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    originalCoverRemixText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: '#da4400'
    },
    originalCoverRemixContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrowRight: {
        width: 12,
        height: 25,
        resizeMode: 'contain'
    },
    releaseDateContainer: {
        paddingTop: 25,
        paddingHorizontal: 15
    },
    releaseDateText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    itemTouchContainer: {
        flexDirection: 'row',
        borderBottomColor: defaultGray,
        borderBottomWidth: 1
    },
    releaseTitle: {
        color: 'white',
        fontSize: 15,
        marginTop: 15
    },
    avatarImage: {
        width: halfOfWindows,
        height: halfOfWindows,
        resizeMode: 'contain',
        borderRadius: 3,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: 'white',
    },
    avatarContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowsWidth
    },
    mixTapeTitle: {
        color: defaultGray,
        fontSize: 15,
        marginTop: 5
    },
    userTitle: {
        color: defaultGray,
        fontSize: 15,
        marginTop: 5
    },
    infoContainer: {
        width: windowsWidth,
        paddingLeft: 15,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AlbumReleaseSettingScreen;