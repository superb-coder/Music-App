import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from "react-native";
import { CommonStyle, defaultGray } from "../_styles";

const halfOfWindows = Dimensions.get("window").width / 2;
const thirdOfWindows = Dimensions.get("window").width * 0.3;
const arrow_right = require("../../../assets/images/right_arrow.png");
const navigationBack = require("../../../assets/images/back_icon.png");

class TopCountriesScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: null,
			headerStyle: CommonStyle.headerStyle,
		};
	};
	constructor(props) {
		super(props);

		let topCountries = this.props.navigation.getParam("topCountries", []);

		this.state = {
			topCountries: topCountries,
			trackTitle: "",
		};
	}

	render() {
		let { trackTitle, topCountries } = this.state;
		return (
			<View style={CommonStyle.full}>
				<View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 15 }]}>
					{trackTitle != "" && <Text style={myStyles.titleText}>{"Before You Wake Up"}</Text>}

					<Text style={myStyles.your_top_songs_text}>{"Top countries"}</Text>

					<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentBetween, CommonStyle.marginTop_10]}>
						<Text style={myStyles.period_sub_title}>{"LAST 28 DAYS"}</Text>
						<Text style={myStyles.period_sub_title}>{"STREAMS"}</Text>
					</View>
				</View>

				<ScrollView style={[CommonStyle.full, CommonStyle.marginTop_10, CommonStyle.paddingHorizontal_15]}>
					{topCountries.map((item, index) => {
						return (
							<View
								style={[
									CommonStyle.flexDirectionRow,
									CommonStyle.justifyContentBetween,
									CommonStyle.alignItemsCenter,
									{
										paddingVertical: 15,
									},
								]}
							>
								<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
									<Text>{index + 1}</Text>
									<Text style={CommonStyle.marginLeft_10}>{item.name}</Text>
								</View>
								<Text>{item.streams}</Text>
							</View>
						);
					})}
				</ScrollView>
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
	your_top_songs_text: {
		fontSize: 28,
		color: "black",
		fontWeight: "bold",
		marginTop: 10,
		fontFamily: "ProximaNova-Bold",
	},
	period_sub_title: {
		color: "#999999",
		fontSize: 12,
		marginTop: 5,
	},
	titleText: {
		fontSize: 14,
		color: "black",
	},
});

export default TopCountriesScreen;
