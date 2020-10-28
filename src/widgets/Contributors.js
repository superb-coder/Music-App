import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, FlatList } from "react-native";
import { CommonStyle, defaultGray } from "../screens/_styles";
import UserAvatar from "react-native-user-avatar";

const halfOfWindows = Dimensions.get("window").width / 2;
const music_remove = require("../../assets/icons/music_remove.png");

class Contributors extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<View style={CommonStyle.add_track_component_container}>
					<View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.fontBold]}>{"Contributors"}</Text>
						<Text style={[CommonStyle.marginTop_8, CommonStyle.colorDefaultGray]}>{"Add contributors who worked on this song (Producer, Mixer)."}</Text>
						<View style={[CommonStyle.marginTop_5]}>
							<FlatList
								data={this.props.contributors}
								renderItem={({ item, index }) => (
									<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_5]} key={index.toString()}>
										{item.avatar != null && item.avatar != "" && <UserAvatar size={50} name={item.artistName} src={item.avatar} />}

										{(item.avatar == null || item.avatar == "") && <UserAvatar size={50} name={item.artistName} />}

										<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
											<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite, { fontWeight: "bold" }]}>{item.artistName}</Text>
											<Text style={[CommonStyle.marginTop_10, CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>
												{item.isProducer ? "Producer" : item.isMixer ? "Mixer" : "TopLiner"}
											</Text>
										</View>
										<TouchableOpacity
											onPress={() => {
												if (this.props.removeContributors) {
													this.props.removeContributors(index);
												}
											}}
											activeOpacity={0.95}
										>
											<Image source={music_remove} style={myStyles.arrow_right} />
										</TouchableOpacity>
									</View>
								)}
								keyExtractor={(item) => item.id}
							/>
						</View>
						<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
							<TouchableOpacity
								activeOpacity={0.95}
								style={myStyles.add_track_button}
								onPress={() => {
									if (this.props.clickAddContributor) {
										this.props.clickAddContributor();
									}
								}}
							>
								<Text style={[CommonStyle.fontSize_15, CommonStyle.colorDefault]}>{"+ Add Artists"}</Text>
							</TouchableOpacity>
						</View>
						<View style={CommonStyle.horizontalCenter}>
							<Text style={[CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{"(Optional)"}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	add_track_button: {
		width: halfOfWindows,
		backgroundColor: "black",
		height: 40,
		borderRadius: 3,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 7,
	},
	arrow_right: {
		width: 12,
		height: 30,
		resizeMode: "contain",
	},
});

export default Contributors;
