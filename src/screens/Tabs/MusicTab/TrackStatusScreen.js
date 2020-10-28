import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import moment from "moment";
import UserAvatar from "react-native-user-avatar";
import { CommonStyle, defaultGray } from "../../_styles";
import { S3_CREDENTIALS, S3URL } from "../../../Constants";
import APIGatewayFetch from "../../../APIGateway";
import LoadingOverlay from "../../../widgets/LoadingOverlay";

const navigationBack = require("../../../../assets/images/back_icon.png");
const arrow_right = require("../../../../assets/images/right_arrow.png");
const halfOfWindows = Dimensions.get("window").width / 2;
const windowsWidth = Dimensions.get("window").width;
const sample_track_icon = require("../../../../assets/icons/icon_sample_track.png");

class TrackStatusScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		let item = navigation.getParam("item", {});
		let releaseTitle = item.releaseTitle;

		return {
			headerTitle: () => <Text style={CommonStyle.headerText}>{releaseTitle}</Text>,
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

		let item = this.props.navigation.getParam("item", {});

		this.state = {
			item: item,
			isLoading: false,
		};
	}

	componentDidMount() {}

	clickDelete = () => {
		// let {trackAvatar, releaseTitle, isMixTap} = this.state;

		// this.props.navigation.navigate("ReleaseCompleteScreen", {
		//     trackAvatar, releaseTitle, isMixTap
		// });
		let { item } = this.state;

		const apiObj = new APIGatewayFetch();

		this.setState({ isLoading: true }, () => {
			if (item.typeReleasesubmitted == "album") {
				apiObj
					.delete({
						model: "ReleaseSubmitted",
						where: {
							groupReleaseSubmitted: item.groupReleaseSubmitted,
						},
					})
					.then(() => {
						global.refreshEmitter.emit("REFRESH_MUSIC_TAB", {});
						this.setState({ isLoading: false }, () => {
							this.props.navigation.goBack();
						});
					})
					.catch((e) => {
						this.setState({ isLoading: false }, () => {
							this.props.navigation.goBack();
						});
					});
			} else {
				apiObj
					.delete({
						model: "ReleaseSubmitted",
						where: {
							id: item.id,
						},
					})
					.then(() => {
						global.refreshEmitter.emit("REFRESH_MUSIC_TAB", {});

						this.setState({ isLoading: false }, () => {
							this.props.navigation.goBack();
						});
					})
					.catch((e) => {
						this.setState({ isLoading: false }, () => {
							this.props.navigation.goBack();
						});
					});
			}
		});
	};

	render() {
		// let { trackAvatar, releaseDate, trackOrigin, releaseTitle, isMixTap, showDatePicker } = this.state;
		let { item, isLoading } = this.state;

		return (
			<View style={CommonStyle.container}>
				<View style={myStyles.scroll}>
					<View
						style={[
							CommonStyle.backgroundBlack,
							CommonStyle.flexDirectionRow,
							CommonStyle.alignItemsCenter,
							CommonStyle.justifyContentCenter,
							CommonStyle.commonPadding,
							{
								width: windowsWidth,
							},
						]}
					>
						<View style={[CommonStyle.alignItemsCenter, CommonStyle.justifyContentCenter, { width: windowsWidth }]}>
							{
								<UserAvatar
									src={item.cover ? `${S3URL}${item.cover}` : "https://img.icons8.com/material-rounded/344/stack-of-photos.png"}
									borderRadius={0}
									size={halfOfWindows}
									imageStyle={{ borderRadius: 0 }}
									style={[{ resizeMode: "contain", borderRadius: 0 }]}
								/>
							}

							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15, CommonStyle.marginTop_15]}>{item.releaseTitle}</Text>
							<Text style={[CommonStyle.fontSize_15, CommonStyle.marginTop_5, CommonStyle.colorDefaultGray]}>
								{item.firstName} {item.lastName}
							</Text>
							<Text style={[CommonStyle.fontSize_15, CommonStyle.marginTop_5, CommonStyle.colorDefaultGray]}>
								{item.typeReleasesubmitted == null && "RELEASE - SINGLE"}
								{item.typeReleasesubmitted == "single" && "RELEASE - SINGLE"}
								{item.typeReleasesubmitted == "album" && "ALBUM/EP/MIXTAPE"}
							</Text>
						</View>
					</View>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentEnd, CommonStyle.alignItemsCenter, CommonStyle.marginTop_15, CommonStyle.paddingHorizontal_15]}>
						<View
							style={[
								CommonStyle.backgroundDefault,
								{ width: 6, height: 6, borderRadius: 6 },
								(item.status == 102 || item.status == 103) && { backgroundColor: "#56CB82" },
								item.status == 100 && { backgroundColor: "#BB4F4B" },
								item.status == 105 && { backgroundColor: defaultGray },
							]}
						></View>
						<Text
							style={[
								CommonStyle.fontSize_14,
								CommonStyle.colorBlack,
								{
									marginLeft: 5,
								},
								(item.status == 102 || item.status == 103) && { color: "#56CB82" },
								item.status == 101 && CommonStyle.colorDefault,
								item.status == 100 && { color: "#BB4F4B" },
								item.status == 105 && CommonStyle.colorDefaultGray,
								item.status == 106 && { color: "red" },
							]}
						>
							{(item.status == 102 || item.status == 103) && "Delivered"}
							{item.status == 101 && "In review"}
							{item.status == 100 && "To correct"}
							{item.status == 105 && "Takedown"}
							{item.status == 106 && "Errors"}
						</Text>
					</View>
					<View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 25 }]}>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_20, CommonStyle.fontBold]}>{"Release Date"}</Text>
						<View style={[CommonStyle.flexDirectionRow, { borderBottomColor: defaultGray, borderBottomWidth: 1 }]}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.marginTop_10, { paddingBottom: 2 }]}>{moment(item.physicalReleaseDate).format("DD/MM/YYYY")}</Text>
						</View>
					</View>

					<View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 20 }]}>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_20, CommonStyle.fontBold]}>{"ISRC"}</Text>
						<View style={[CommonStyle.flexDirectionRow, { borderBottomColor: defaultGray, borderBottomWidth: 1 }]}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.marginTop_10, { paddingBottom: 2 }]}>{item.isrc}</Text>
						</View>
					</View>
					<View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 20 }]}>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_20, CommonStyle.fontBold]}>{"UPC"}</Text>
						<View style={[CommonStyle.flexDirectionRow, { borderBottomColor: defaultGray, borderBottomWidth: 1 }]}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18, CommonStyle.marginTop_10, { paddingBottom: 2 }]}>{item.upc}</Text>
						</View>
					</View>

					{(item.status == 101 || item.status == 100) && (
						<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
							<TouchableOpacity
								style={[
									CommonStyle.justifyContentCenter,
									CommonStyle.alignItemsCenter,
									{
										width: halfOfWindows,
										height: 40,
										borderRadius: 40,
									},
								]}
								activeOpacity={0.95}
								onPress={this.clickDelete}
							>
								<Text style={[CommonStyle.fontSize_18, CommonStyle.fontBold, { color: "#BB4F4B" }]}>{"Delete the release"}</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
				{isLoading && <LoadingOverlay />}
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	scroll: {
		flex: 1,
		paddingBottom: 15,
	},
	checkBoxIconContainer: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
	},
	unCheckedIcon: {
		borderWidth: 2,
		borderColor: "#BC3B00",
		width: 25,
		height: 25,
		borderRadius: 25,
	},
});

export default TrackStatusScreen;
