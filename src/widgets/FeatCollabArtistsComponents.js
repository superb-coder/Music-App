import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules, FlatList } from "react-native";
import { CommonStyle, defaultGray } from "../screens/_styles";
import UserAvatar from "react-native-user-avatar";
const music_remove = require("../../assets/icons/music_remove.png");
const halfOfWindows = Dimensions.get("window").width / 2;

class FeatCollabArtistsComponents extends React.Component {
	render() {
		return (
			<View style={CommonStyle.marginTop_10}>
				<View style={CommonStyle.add_track_component_container}>
					<View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.fontBold]}>{"Feat/Collab Artists"}</Text>
						<Text style={[CommonStyle.marginTop_8, CommonStyle.colorDefaultGray]}>{"Are there any artists in collab or feat ? / Y'a t'il des artistes en collab ou en feat ?"}</Text>
						<View style={[CommonStyle.marginTop_5]}>
							<FlatList
								data={this.props.featCollabList}
								renderItem={({ item, index }) => (
									<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_5]} key={index.toString()}>
										{item.avatar != null && item.avatar != "" && <UserAvatar size={50} name={item.artistName} src={item.avatar} />}

										{(item.avatar == null || item.avatar == "") && <UserAvatar size={50} name={item.artistName} />}

										<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
											<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite, { fontWeight: "bold" }]}>{item.artistName}</Text>
											<Text style={[CommonStyle.marginTop_10, CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{item.isFeaturing ? "Featuring Artist" : "Collaboration Artist"}</Text>
										</View>
										<TouchableOpacity
											onPress={() => {
												if (this.props.removeFeatCollab) {
													this.props.removeFeatCollab(index);
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
							<Text style={[CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{"(Optional)"}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#707070",
	},
	scroll: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
	},
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

export default FeatCollabArtistsComponents;
