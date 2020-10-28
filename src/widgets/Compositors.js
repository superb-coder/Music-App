import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, FlatList } from "react-native";
import UserAvatar from "react-native-user-avatar";

import { CommonStyle, defaultGray } from "../screens/_styles";

const halfOfWindows = Dimensions.get("window").width / 2;
const music_remove = require("../../assets/icons/music_remove.png");

class Compositors extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<View style={CommonStyle.add_track_component_container}>
					<View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.fontBold]}>{"Compositor(s)"}</Text>
						<Text style={[CommonStyle.marginTop_8, CommonStyle.colorDefaultGray]}>{"Add compositors or beatmaker who worked on this song."}</Text>
						<View style={[CommonStyle.marginTop_5]}>
							<FlatList
								data={this.props.compositors}
								renderItem={({ item, index }) => (
									<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_5]} key={index.toString()}>
										<UserAvatar size={50} name={item.composerFirstName + " " + item.composerFamilyName} />
										<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
											<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite, { fontWeight: "bold" }]}>{item.composerFirstName + " " + item.composerFamilyName}</Text>
											<Text style={[CommonStyle.marginTop_10, CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{"Compositor"}</Text>
										</View>
										<TouchableOpacity
											onPress={() => {
												if (this.props.removeComposer) {
													this.props.removeComposer(index);
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
						<View style={CommonStyle.horizontalCenter}>
							<TouchableOpacity
								activeOpacity={0.95}
								style={myStyles.add_track_button}
								onPress={() => {
									if (this.props.onClick) {
										this.props.onClick();
									}
								}}
							>
								<Text style={[CommonStyle.fontSize_15, CommonStyle.colorDefault]}>{"+ Add Artists"}</Text>
							</TouchableOpacity>
						</View>
						<View style={CommonStyle.horizontalCenter}>
							<Text style={[CommonStyle.fontSize_13, { color: "#56CB82" }]}>{"Required/Obligatoire"}</Text>
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

export default Compositors;
