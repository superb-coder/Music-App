import React from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, FlatList, Image } from "react-native";
import { CommonStyle } from "../screens/_styles";
import UserAvatar from "react-native-user-avatar";

const halfOfWindows = Dimensions.get("window").width / 2;
const music_remove = require("../../assets/icons/music_remove.png");

class AuthorsComponent extends React.Component {
	render() {
		return (
			<View style={CommonStyle.add_track_component_container}>
				<View>
					<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.fontBold]}>{"Author(s)"}</Text>
					<Text style={[CommonStyle.marginTop_8, CommonStyle.colorDefaultGray]}>{"Add the real name of authors who wrote the song for ou."}</Text>
					<View style={[CommonStyle.marginTop_5]}>
						<FlatList
							data={this.props.authors}
							renderItem={({ item, index }) => (
								<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_5]} key={index.toString()}>
									<UserAvatar size={50} name={item.authorFirstName + " " + item.authorLastName} />
									<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
										<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite, { fontWeight: "bold" }]}>{item.authorFirstName + " " + item.authorLastName}</Text>
										<Text style={[CommonStyle.marginTop_10, CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{"Author"}</Text>
									</View>
									<TouchableOpacity
										onPress={() => {
											if (this.props.removeAuthor) {
												this.props.removeAuthor(index);
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

export default AuthorsComponent;
