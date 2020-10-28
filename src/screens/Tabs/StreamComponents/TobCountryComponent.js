import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from "react-native";
import { CommonStyle, defaultGray } from "../../_styles";

const halfOfWindows = Dimensions.get("window").width / 2;
const thirdOfWindows = Dimensions.get("window").width * 0.3;
const arrow_right = require("../../../../assets/images/right_arrow.png");
const data = [
	{
		title: "France",
		streams: "20k",
	},
	{
		title: "United States",
		streams: "15k",
	},
	{
		title: "Canada",
		streams: "10k",
	},
	{
		title: "China",
		streams: "9k",
	},
	{
		title: "India",
		streams: "5k",
	},
];

class TobCountryComponent extends React.Component {
	render() {
		return (
			<View style={myStyles.container}>
				<Text style={myStyles.your_top_songs_text}>{"Top countries"}</Text>

				<View style={myStyles.subContainer}>
					<Text style={myStyles.period_sub_title}>{"LAST 28 DAYS"}</Text>
					<Text style={myStyles.period_sub_title}>{"STREAMS"}</Text>
				</View>
				{this.props.topCountries &&
					this.props.topCountries.map((item, index) => {
						if (index > 5) {
							return null;
						}
						return (
							<View style={myStyles.itemContainer}>
								<View style={myStyles.itemSubContainer}>
									<Text>{index + 1}</Text>
									<Text style={CommonStyle.marginLeft_10}>{item.name}</Text>
								</View>
								<Text>{this.formatCash(item.streams)}</Text>
							</View>
						);
					})}

				<TouchableOpacity
					activeOpacity={0.8}
					style={myStyles.seeAllButton}
					onPress={() => {
						if (this.props.clickSeeAll) {
							this.props.clickSeeAll();
						}
					}}
				>
					<Text>See all</Text>
					<Image source={arrow_right} style={myStyles.arrowRightImage} />
				</TouchableOpacity>
			</View>
		);
	}

	formatCash = (n) => {
		let result = "";
		if (n < 1e3) {
			result += n;
		}

		if (n >= 1e3 && n < 1e6) {
			result += +(n / 1e3).toFixed(1) + "K";
		}

		if (n >= 1e6 && n < 1e9) {
			result += +(n / 1e6).toFixed(1) + "M";
		}

		if (n >= 1e9 && n < 1e12) {
			result += +(n / 1e9).toFixed(1) + "B";
		}

		if (n >= 1e12) {
			result += +(n / 1e12).toFixed(1) + "T";
		}

		result = result.replace(".", ",");

		return result;
	};
}

export const myStyles = StyleSheet.create({
	container: {
		marginTop: 10,
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
		fontSize: 18,
		color: "black",
		fontWeight: "bold",
	},
	period_sub_title: {
		color: "#999999",
		fontSize: 12,
		marginTop: 5,
	},
	subContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	itemContainer: {
		paddingVertical: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemSubContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	seeAllButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
	},
	arrowRightImage: {
		width: 12,
		height: 14,
		resizeMode: "contain",
	},
});

export default TobCountryComponent;
