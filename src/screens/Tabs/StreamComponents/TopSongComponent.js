import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from "react-native";
import { CommonStyle, defaultGray } from "../../_styles";
import { S3URL } from "../../../Constants";
const halfOfWindows = Dimensions.get("window").width / 2;
const thirdOfWindows = Dimensions.get("window").width * 0.3;
const icon_sample_platform = require("../../../../assets/icons/icon_sample_platform.png");
const arrow_right = require("../../../../assets/images/right_arrow.png");

class TopSongComponent extends React.Component {
	render() {
		return (
			<View style={myStyles.container}>
				<Text style={myStyles.your_top_songs_text}>{"Your top songs"}</Text>
				<Text style={myStyles.period_sub_title}>{"LAST 7 DAYS"}</Text>

				{this.props.topSongs &&
					this.props.topSongs.map((item, index) => {
						if (index > 4) {
							return null;
						}
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								style={myStyles.itemContainer}
								onPress={() => {
									if (this.props.clickSong) {
										this.props.clickSong(index);
									}
								}}
							>
								{index == 0 && (
									<>
										<Image
											source={item.cover ? `${S3URL}${item.cover}` : icon_sample_platform}
											style={{
												width: thirdOfWindows,
												height: thirdOfWindows,
												resizeMode: "contain",
											}}
										/>
									</>
								)}
								{index != 0 && (
									<Image
										source={item.cover ? `${S3URL}${item.cover}` : icon_sample_platform}
										style={{
											width: Dimensions.get("window").width * 0.23,
											height: Dimensions.get("window").width * 0.23,
											resizeMode: "contain",
										}}
									/>
								)}
								<View style={[CommonStyle.full, { paddingLeft: 15 }]}>
									<Text>{index > 10 ? index + 1 : `0${index + 1}`}</Text>
									<Text style={CommonStyle.marginTop_5}>{item.name}</Text>
									<Text style={[CommonStyle.marginTop_5, { color: "#999999" }]}>
										{this.formatCash(item.streams)} {"streams"}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})}

				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						CommonStyle.flexDirectionRow,
						CommonStyle.justifyContentBetween,
						CommonStyle.alignItemsCenter,
						{
							paddingVertical: 15,
						},
					]}
					onPress={() => {
						if (this.props.clickSeeAll) {
							this.props.clickSeeAll();
						}
					}}
				>
					<Text>See all</Text>
					<Image source={arrow_right} style={{ width: 12, height: 14, resizeMode: "contain" }} />
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
	itemContainer: {
		marginTop: 15,
		flexDirection: "row",
	},
});

export default TopSongComponent;
