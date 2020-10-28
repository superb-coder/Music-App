import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import uuid from "react-native-uuid";
import CustomLoading from "../../widgets/CustomLoading";
import { CommonStyle, defaultGray } from "../_styles";
import APIGatewayFetch from "../../APIGateway";
const navigationBack = require("../../../assets/images/back_icon.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const halfOfWindows = Dimensions.get("window").width / 2;
const windowsWidth = Dimensions.get("window").width;

class AlbumReleaseCompleteScreen extends React.Component {
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
		let labelId = this.props.navigation.getParam("labelId", "");
		let firstName = this.props.navigation.getParam("firstName", "");
		let lastName = this.props.navigation.getParam("lastName", "");
		let cover = this.props.navigation.getParam("cover", "");
		let username = this.props.navigation.getParam("username", "");
		let mail = this.props.navigation.getParam("mail", "");
		let trackType = this.props.navigation.getParam("trackType", "");
		let type = this.props.navigation.getParam("type", "artist");
		let tracks = this.props.navigation.getParam("tracks", []);

		this.state = {
			trackAvatar: trackAvatar,
			releaseTitle: releaseTitle,
			isMixTap: isMixTap,
			lyricsLanguage,
			primaryGenre,
			physicalReleaseDate,
			tracks,
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
		let { releaseTitle, lyricsLanguage, primaryGenre, physicalReleaseDate, labelId, firstName, lastName, cover, username, mail, trackType, type, tracks } = this.state;

		let promiseList = [];
		const uuidv4 = uuid.v4();

		for (let i = 0; i < tracks.length; i++) {
			const values = {
				releaseTitle,
				lyricsLanguage,
				primaryGenre,
				physicalReleaseDate,
				artistsAsFeaturing: JSON.stringify(tracks[i].artistsAsFeaturing),
				authors: JSON.stringify(tracks[i].authors),
				compositors: JSON.stringify(tracks[i].compositors),
				contributors: JSON.stringify(tracks[i].contributors),
				audio: tracks[i].audioFileName,
				trackTitle: tracks[i].trackTitle,
				artistId: type == "artist" ? labelId : null,
				labelId: type == "label" ? labelId : null,
				firstName,
				lastName,
				cover,
				primaryArtist: username,
				contactMail: mail,
				trackType,
				origin: "mobile",
				typeReleasesubmitted: "album",
				groupReleaseSubmitted: uuidv4,
			};

			promiseList.push(this.uploadTrack(values));
		}

		this.setState(
			{
				loadingDialogShow: true,
				loadingDialogStatus: 0,
				loadingDialogTitle: "Uploading, Please wait.",
			},
			() => {
				Promise.all(promiseList)
					.then((data) => {
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
					})
					.catch((error) => {
						this.setState(
							{
								loadingDialogStatus: 1,
								loadingDialogTitle: "Failed",
							},
							() => {
								setTimeout(() => {
									this.setState({ loadingDialogShow: false });
								}, 3000);
							}
						);
					});
			}
		);
	};

	uploadTrack = (track) => {
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			apiObj
				.create({
					model: "ReleaseSubmitted",
					values: track,
				})
				.catch((e) => {
					resolve(false);
				})
				.then((newReleaseSubmitted) => {
					resolve(newReleaseSubmitted);
				});
		});
	};

	render() {
		let { trackAvatar, releaseTitle, isMixTap, loadingDialogTitle, loadingDialogStatus, loadingDialogShow } = this.state;
		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View style={myStyles.fullTitleContainer}>
						<View style={myStyles.avatarContainer}>
							{trackAvatar && <Image style={myStyles.avatarImage} source={trackAvatar ? trackAvatar : null} />}

							<Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_15, CommonStyle.fontSize_15]}>{releaseTitle}</Text>
							<Text style={[CommonStyle.marginTop_5, CommonStyle.fontSize_15, CommonStyle.colorDefaultGray]}>{"Kolokolo ft. Jackson R."}</Text>
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

export default AlbumReleaseCompleteScreen;
