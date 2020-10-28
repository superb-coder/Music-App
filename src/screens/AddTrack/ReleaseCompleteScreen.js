import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import CustomLoading from "../../widgets/CustomLoading";
import { CommonStyle, defaultGray } from "../_styles";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import APIGatewayFetch from "../../APIGateway";
const navigationBack = require("../../../assets/images/back_icon.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const halfOfWindows = Dimensions.get("window").width / 2;
const windowsWidth = Dimensions.get("window").width;

class ReleaseCompleteScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => <Text style={CommonStyle.headerText}>{"Release"}</Text>,
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

		let trackAvatar = this.props.navigation.getParam("trackAvatar", null);
		let releaseTitle = this.props.navigation.getParam("releaseTitle", "");
		let isMixTap = this.props.navigation.getParam("isMixTap", false);
		let lyricsLanguage = this.props.navigation.getParam("lyricsLanguage", "");
		let primaryGenre = this.props.navigation.getParam("primaryGenre", "");
		let physicalReleaseDate = this.props.navigation.getParam("physicalReleaseDate", "");
		let artistsAsFeaturing = this.props.navigation.getParam("artistsAsFeaturing", "");
		let authors = this.props.navigation.getParam("authors", "");
		let compositors = this.props.navigation.getParam("compositors", "");
		let contributors = this.props.navigation.getParam("contributors", "");
		let audio = this.props.navigation.getParam("audio", "");
		let labelId = this.props.navigation.getParam("labelId", "");
		let firstName = this.props.navigation.getParam("firstName", "");
		let lastName = this.props.navigation.getParam("lastName", "");
		let cover = this.props.navigation.getParam("cover", "");
		let username = this.props.navigation.getParam("username", "");
		let mail = this.props.navigation.getParam("mail", "");
		let trackType = this.props.navigation.getParam("trackType", "");
		let type = this.props.navigation.getParam("type", "artist");
		this.state = {
			trackAvatar: trackAvatar,
			releaseTitle: releaseTitle,
			isMixTap: isMixTap,
			lyricsLanguage,
			primaryGenre,
			physicalReleaseDate,
			artistsAsFeaturing,
			authors,
			compositors,
			contributors,
			audio,
			labelId,
			firstName,
			lastName,
			cover,
			username,
			mail,
			trackType,
			type,
			isLoading: false,
			loadingDialogTitle: "",
			loadingDialogStatus: 0,
			loadingDialogShow: false,
		};
	}

	componentDidMount() {}

	clickNext = () => {
		let {
			releaseTitle,
			lyricsLanguage,
			primaryGenre,
			physicalReleaseDate,
			artistsAsFeaturing,
			authors,
			compositors,
			contributors,
			audio,
			labelId,
			firstName,
			lastName,
			cover,
			username,
			mail,
			trackType,
			type,
		} = this.state;

		const values = {
			releaseTitle,
			lyricsLanguage,
			primaryGenre,
			physicalReleaseDate,
			artistsAsFeaturing: JSON.stringify(artistsAsFeaturing),
			authors: JSON.stringify(authors),
			compositors: JSON.stringify(compositors),
			contributors: JSON.stringify(contributors),
			audio,
			artistId: type == "artist" ? labelId : null,
			labelId: type == "label" ? labelId : null,
			firstName,
			lastName,
			cover,
			primaryArtist: username,
			contactMail: mail,
			trackType,
			origin: "mobile",
			typeReleasesubmitted: "single",
			groupReleaseSubmitted: null,
		};

		this.setState(
			{
				loadingDialogShow: true,
				loadingDialogStatus: 0,
				loadingDialogTitle: "Uploading, Please wait.",
			},
			() => {
				const apiObj = new APIGatewayFetch();

				apiObj
					.create({
						model: "ReleaseSubmitted",
						values: values,
					})
					.catch((e) => {
						this.setState(
							{
								loadingDialogStatus: 1,
								loadingDialogTitle: "Failed",
							},
							() => {
								setTimeout(() => {
									this.setState({ loadingDialogShow: false }, () => {
										// this.props.navigation.navigate("DashboardScreen")
									});
								}, 3000);
							}
						);
					})
					.then((newReleaseSubmitted) => {
						this.setState(
							{
								loadingDialogStatus: 2,
								loadingDialogTitle: "Success",
							},
							() => {
								setTimeout(() => {
									this.setState({ loadingDialogShow: false }, () => {
										global.refreshEmitter.emit("REFRESH_MUSIC_TAB", {});
										this.props.navigation.navigate("MusicTabScreen");
									});
								}, 3000);
							}
						);
					});
			}
		);
	};

	render() {
		let { trackAvatar, releaseTitle, isMixTap, loadingDialogTitle, loadingDialogStatus, loadingDialogShow, firstName, lastName } = this.state;
		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View style={myStyles.fullTitleContainer}>
						<View style={myStyles.avatarContainer}>
							{trackAvatar && <Image style={myStyles.avatarImage} source={trackAvatar ? trackAvatar : null} />}

							<Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_15, CommonStyle.fontSize_15]}>{releaseTitle}</Text>
							<Text style={[CommonStyle.marginTop_5, CommonStyle.fontSize_15, CommonStyle.colorDefaultGray]}>
								{firstName} {lastName}
							</Text>
							<Text style={[CommonStyle.marginTop_5, CommonStyle.fontSize_15, CommonStyle.colorDefaultGray]}>{isMixTap ? "ALBUM/EP/MIXTAPE" : "SINGLE"}</Text>
						</View>
					</View>
					<View style={CommonStyle.paddingHorizontal_15}>
						<View style={CommonStyle.marginTop_25}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_25]}>{"Ready to distribute your Release?"}</Text>
						</View>

						<View style={CommonStyle.marginTop_25}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_16]}>
								{"We will start reviewing your submitted release and get back to you by email in the next few business days if we find something to fix."}
							</Text>
						</View>
						<View style={CommonStyle.marginTop_15}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_15]}>{"If the release is approved, we'll be in touch to confirm your release date."}</Text>
						</View>
					</View>
				</ScrollView>
				<View style={myStyles.submitButtonContainer}>
					<TouchableOpacity style={myStyles.submitButton} activeOpacity={0.95} onPress={this.clickNext}>
						<Text style={myStyles.submitText}>{"Submit"}</Text>
					</TouchableOpacity>
				</View>
				{loadingDialogShow && <CustomLoading status={loadingDialogStatus} messageText={loadingDialogTitle} />}
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
	avatarImage: {
		width: halfOfWindows,
		height: halfOfWindows,
		resizeMode: "contain",
		borderRadius: 3,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: "white",
	},
	avatarContainer: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: windowsWidth,
	},
	fullTitleContainer: {
		width: windowsWidth,
		padding: 15,
		backgroundColor: "black",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	submitButtonContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,

		position: "absolute",
		width: "100%",
		bottom: 60,
	},
	submitButton: {
		width: halfOfWindows,
		height: 40,
		backgroundColor: "#DA4400",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 40,
	},
	submitText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default ReleaseCompleteScreen;
