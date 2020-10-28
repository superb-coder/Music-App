import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { CommonStyle, defaultGray } from "../_styles";

const avatarWidth = Dimensions.get("window").width * 0.1173;

const navigationBack = require("../../../assets/images/back_icon.png");
const icon_sample_track = require("../../../assets/icons/icon_sample_track.png");
const icon_filter = require("../../../assets/icons/icon_filter.png");
const icon_list_check = require("../../../assets/icons/icon_list_check.png");
const icon_sample_platform = require("../../../assets/icons/icon_sample_platform.png");
class SongListScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		var clickRight = () => {};

		let params = navigation.state.params;

		if (params && params.clickRight) {
			clickRight = params.clickRight;
		}

		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<TouchableOpacity activeOpacity={0.8} style={myStyles.navigationRightContainer} onPress={clickRight}>
					<Image source={icon_filter} style={myStyles.filterIcon} />
				</TouchableOpacity>
			),
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);

		let topSongs = this.props.navigation.getParam("topSongs", []);

		this.state = {
			selectedFilter: "Last 28 days",
			topSongs: topSongs,
			menuFilterList: [
				{
					icon: "photo-camera",
					label: "Last 24 hours",
				},
				{
					icon: "photo",
					label: "Last 7 days",
				},
				{
					icon: "brush",
					label: "Last 28 days",
				},
				{
					icon: "mic",
					label: "Last trimester",
				},
				{
					icon: "mic1",
					label: "Last year",
				},
				{
					icon: "mic2",
					label: "All-time",
				},
			],
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			clickRight: this.clickNextButton,
		});
	}

	clickNextButton = () => {
		this.filterMenu.open();
	};

	clickItem = (selectedIndex) => {
		let { topSongs } = this.state;

		this.props.navigation.navigate("StreamSongDetailScreen", { releaseId: topSongs[selectedIndex].releaseId, data: topSongs[selectedIndex] });
	};

	render() {
		let { selectedFilter, menuFilterList, topSongs } = this.state;
		return (
			<View style={[CommonStyle.container, CommonStyle.backgroundWhite]}>
				<View style={CommonStyle.commonPadding}>
					<View>
						<Text style={[CommonStyle.commonTitle, CommonStyle.fontSize_20, CommonStyle.colorBlack]}>{"Songs"}</Text>
					</View>

					<View
						style={[
							CommonStyle.flexDirectionRow,
							CommonStyle.justifyContentBetween,
							CommonStyle.alignItemsCenter,
							{
								paddingTop: 20,
							},
						]}
					>
						<Text style={myStyles.selectedFilterText}>{selectedFilter}</Text>
						<Text style={myStyles.streamText}>{"STREAMS"}</Text>
					</View>
				</View>
				<ScrollView style={[CommonStyle.full, CommonStyle.paddingHorizontal_15]}>
					{topSongs.map((item, index) => {
						return (
							<TouchableOpacity
								activeOpacity={0.8}
								style={[
									CommonStyle.flexDirectionRow,
									CommonStyle.alignItemsCenter,
									{
										paddingVertical: 10,
									},
								]}
								onPress={() => {
									this.clickItem(index);
								}}
							>
								<Image source={item.cover ? `${S3URL}${item.cover}` : icon_sample_platform} style={myStyles.itemAvatar} />
								<Text style={[CommonStyle.full, myStyles.itemTitle]}>{item.name}</Text>
								<Text style={myStyles.itemStreamText}>{this.formatCash(item.streams)}</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
				<RBSheet
					ref={(ref) => {
						this.filterMenu = ref;
					}}
					height={330}
				>
					<View style={myStyles.listContainer}>
						<Text style={myStyles.listTitle}>Choose time period...</Text>
						{menuFilterList.map((list) => (
							<TouchableOpacity
								key={list.icon}
								style={myStyles.listButton}
								onPress={() => {
									this.setState({ selectedFilter: list.label }, () => {
										this.filterMenu.close();
									});
								}}
							>
								{list.label == selectedFilter && <Image source={icon_list_check} style={myStyles.listCheckedIcon} />}

								{list.label != selectedFilter && <View style={myStyles.listEmptyIcon} />}

								{list.label == selectedFilter && <Text style={[myStyles.listLabel, CommonStyle.colorDefault]}>{list.label}</Text>}

								{list.label != selectedFilter && <Text style={myStyles.listLabel}>{list.label}</Text>}
							</TouchableOpacity>
						))}
					</View>
				</RBSheet>
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
	scroll: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
	},
	checkBoxIconContainer: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	listTitle: {
		fontSize: 16,
		marginBottom: 20,
		color: "black",
	},
	listButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
	},
	listLabel: {
		fontSize: 16,
		paddingLeft: 15,
	},
	navigationRightContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		flex: 1,
		marginRight: 15,
	},
	filterIcon: {
		width: 20,
		height: 20,
		resizeMode: "contain",
	},
	selectedFilterText: {
		fontSize: 12,
		color: "#999999",
		textTransform: "uppercase",
	},
	streamText: {
		fontSize: 12,
		color: "#999999",
	},
	itemStreamText: {
		width: 50,
		color: "black",
		textAlign: "right",
	},
	itemTitle: {
		marginLeft: 10,
		color: "black",
	},
	itemAvatar: {
		width: avatarWidth,
		height: avatarWidth,
		resizeMode: "contain",
	},
	listCheckedIcon: {
		width: 15,
		height: 15,
		resizeMode: "contain",
	},
	listEmptyIcon: {
		width: 15,
		height: 15,
	},
});

export default SongListScreen;
