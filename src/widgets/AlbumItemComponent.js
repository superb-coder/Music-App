import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from 'react-native';
import { Switch } from 'react-native-switch';
import { CommonStyle } from '../screens/_styles';

const halfOfWindows = Dimensions.get("window").width / 2;
const arrow_right = require('../../assets/images/right_arrow.png');
const music_icon = require('../../assets/icons/music_icon.png');
const music_remove = require('../../assets/icons/music_remove.png');
class AlbumItemComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ marginBottom: 25 }}>
                <View style={myStyles.container}>
                    <View>
                        <TouchableOpacity style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}
                            onPress={() => {
                                if (this.props.clickTrack) {
                                    this.props.clickTrack(this.props.data.uuid);
                                }
                            }}
                        >
                            <View style={CommonStyle.full}>
                                <Text
                                    style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.fontBold]}
                                    numberOfLines={1}
                                >
                                    {(this.props.index + 1)}. {(this.props.releaseTitle != undefined && this.props.releaseTitle != "") ?  this.props.releaseTitle : "Untitled Track"}
                                </Text>
                            </View>
                            <View style={{ width: 12 }}>
                                <Image
                                    source={arrow_right}
                                    style={myStyles.arrow_right}
                                />
                            </View>
                        </TouchableOpacity>

                        {
                            !!this.props.audioFileName && (
                                <View style={[
                                    CommonStyle.marginTop_8,
                                    CommonStyle.flexDirectionRow,
                                    CommonStyle.alignItemsCenter
                                ]}>
                                    <View style={{ width: 10 }}>
                                        <Image
                                            source={music_icon}
                                            style={myStyles.arrow_right}
                                        />
                                    </View>
                                    <View style={CommonStyle.full}>
                                        <Text
                                            style={[CommonStyle.colorWhite, CommonStyle.fontBold, { paddingHorizontal: 5 }]}
                                            numberOfLines={1}
                                        >
                                            {this.props.audioFileName}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ width: 10 }}
                                        onPress={() => {
                                            if (this.props.removeAudio) {
                                                this.props.removeAudio(this.props.data.uuid);
                                            }
                                        }}
                                    >
                                        <Image
                                            source={music_remove}
                                            style={myStyles.arrow_right}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        {
                            !this.props.audioFileName && (
                                <Text style={[CommonStyle.marginTop_8, CommonStyle.colorDefaultGray]}>
                                    {"Add track information and upload the music track."}
                                </Text>
                            )
                        }

                        <View style={myStyles.switch_full_container}>
                            <TouchableOpacity
                                activeOpacity={0.95}
                                style={CommonStyle.full}
                                onPress={() => {
                                    if (this.props.explicitContentChanged) {
                                        this.props.explicitContentChanged(this.props.index, !this.props.explicitContent);
                                    }
                                }}
                            >
                                <Text style={myStyles.explicit_content}>
                                    {"Explicit content ?"}
                                </Text>
                            </TouchableOpacity>
                            <View style={[myStyles.switch_container, this.props.explicitContent && CommonStyle.backgroundDefault]}
                            >
                                <Switch
                                    value={this.props.explicitContent ? true : false}
                                    onValueChange={(val) => {
                                        if (this.props.explicitContentChanged) {
                                            this.props.explicitContentChanged(this.props.index, !this.props.explicitContent);
                                        }
                                    }}
                                    disabled={false}
                                    circleSize={15}
                                    circleBorderWidth={1}
                                    backgroundActive={'rgba(255, 255, 255, 0)'}
                                    backgroundInactive={'rgba(255, 255, 255, 0)'}
                                    circleActiveBorderColor={'#373737'}
                                    circleInactiveBorderColor={'#373737'}
                                    circleActiveColor={'#FFFFFF'}
                                    circleInActiveColor={'#FFFFFF'}
                                    changeValueImmediately={true}
                                    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    outerCircleStyle={{}} // style for outer animated circle
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                    switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                                    switchBorderRadius={15} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export const myStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    add_track_button: {
        width: halfOfWindows,
        backgroundColor: 'black',
        height: 40,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,

    },
    switch_container: {
        borderColor: '#e6e6e6',
        width: 39,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
    },
    explicit_content: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    switch_full_container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15
    },
    arrow_right: {
        width: 12,
        height: 30,
        resizeMode: 'contain'
    },
});

export default AlbumItemComponent;