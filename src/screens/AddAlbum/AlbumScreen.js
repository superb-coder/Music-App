import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from "react-native";
import ActionSheet from "react-native-actionsheet";
import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";
import _ from "lodash";

import { CommonStyle, defaultGray } from "../_styles";
import AlbumItemComponent from "../../widgets/AlbumItemComponent";

var ImagePicker = NativeModules.ImageCropPicker;

const navigationBack = require("../../../assets/images/back_icon.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const halfOfWindows = Dimensions.get("window").width / 2;

class AlbumScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => <Text style={CommonStyle.headerText}>{"Release"}</Text>,
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						let releaseTitle = navigation.getParam("releaseTitle", "");
						let lyricsLanguage = navigation.getParam("lyricsLanguage", "");
						let primaryGenre = navigation.getParam("primaryGenre", "");
						let mixTape = navigation.getParam("mixTape", false);
						let imageData = navigation.getParam("avatar", null);
						let cover = navigation.getParam("cover", "");

						navigation.navigate("AddTrackScreen", {
							releaseTitle,
							lyricsLanguage,
							primaryGenre,
							mixTape,
							imageData,
							cover,
						});
					}}
					style={CommonStyle.navigationBackContainer}
				>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: () => null,
			headerStyle: CommonStyle.headerStyle,
			tabBarVisible: false,
		};
	};

	constructor(props) {
		super(props);

		let releaseTitle = this.props.navigation.getParam("releaseTitle", "");
		let lyricsLanguage = this.props.navigation.getParam("lyricsLanguage", "");
		let primaryGenre = this.props.navigation.getParam("primaryGenre", "");
		let mixTape = this.props.navigation.getParam("mixTape", false);
		let imageData = this.props.navigation.getParam("avatar", null);
		let labelId = this.props.navigation.getParam("labelId", "");
		let cover = this.props.navigation.getParam("cover", "");
		let username = this.props.navigation.getParam("username", "");
		let mail = this.props.navigation.getParam("mail", "");
		let firstName = this.props.navigation.getParam("firstName", "");
		let lastName = this.props.navigation.getParam("lastName", "");
		let type = this.props.navigation.getParam("type", "artist");

		this.state = {
			releaseTitle: releaseTitle,
			lyricsLanguage: lyricsLanguage,
			primaryGenre: primaryGenre,
			mixTape: mixTape,
			imageData: imageData,
			labelId: labelId,
			cover: cover,
			username: username,
			mail: mail,
			firstName: firstName,
			lastName: lastName,
			type: type,
			tracks: [],
			errorDialog: false,
			dialogTitle: "",
			dialogDescription: "",
		};
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		global.refreshEmitter.addListener("REMOVE_TRACK", (data) => {
			if (data) {
				let { tracks } = this.state;

				const index = _.findIndex(tracks, (r) => r.uuid == data);

				if (index != -1) {
					tracks.splice(index, 1);

					this.setState({ tracks: tracks });
				}
			}
		});

		global.refreshEmitter.addListener("UPDATE_TRACK", (data) => {
			if (data) {
				let { tracks } = this.state;

				const index = _.findIndex(tracks, (r) => r.uuid == data.uuid);

				if (index != -1) {
					let selectedTrack = Object.assign({}, tracks[index]);

					selectedTrack.audioExplicitContent = data.audioExplicitContent;
					selectedTrack.isAuthor = data.isAuthor;
					selectedTrack.artistsAsFeaturing = data.artistsAsFeaturing;
					selectedTrack.authors = data.authors;
					selectedTrack.compositors = data.compositors;
					selectedTrack.contributors = data.contributors;
					selectedTrack.audioFileName = data.audioFileName;
					selectedTrack.trackTitle = data.trackTitle;

					let clonedTracks = tracks.slice(0);

					clonedTracks[index] = selectedTrack;

					this.setState({ tracks: clonedTracks });
				}
			}
		});
	}

	showActionSheet = () => {
		this.ActionSheet.show();
	};

	selectImage = (index) => {
		if (index == 0) {
			ImagePicker.openCamera({
				width: 500,
				height: 500,
				cropping: true,
				waitAnimationEnd: false,
				includeExif: true,
				forceJpg: true,
			}).then((i) => {
				this.setState({
					imageData: { uri: i.path, width: i.width, height: i.height, mime: i.mime },
				});
			});
			return;
		}

		if (index == 1) {
			ImagePicker.openPicker({
				width: 500,
				height: 500,
				cropping: true,
				waitAnimationEnd: false,
				includeExif: true,
				forceJpg: true,
			}).then((i) => {
				this.setState({
					imageData: { uri: i.path, width: i.width, height: i.height, mime: i.mime },
				});
			});
			return;
		}
	};

	clickNext = () => {
		let { releaseTitle, lyricsLanguage, primaryGenre, mixTape, imageData, labelId, cover, username, mail, firstName, lastName, type, tracks } = this.state;

		if (tracks.length == 0) {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please add tracks" });

			return;
		}

		this.props.navigation.navigate("AlbumReleaseSettingScreen", {
			releaseTitle,
			lyricsLanguage,
			primaryGenre,
			isMixTap: mixTape,
			trackAvatar: imageData,
			labelId,
			cover,
			username,
			mail,
			firstName,
			lastName,
			type,
			tracks,
		});
	};

	clickTrack = (uuid) => {
		let { tracks } = this.state;

		const found = _.find(tracks, (r) => r.uuid == uuid);

		if (found) {
			let { releaseTitle, lyricsLanguage, primaryGenre, mixTape, imageData, labelId, cover, username, mail, firstName, lastName, type } = this.state;

			this.props.navigation.navigate("AlbumTrackDetailScreen", {
				albumTitle: releaseTitle,
				lyricsLanguage,
				primaryGenre,
				mixTape,
				avatar: imageData,
				labelId: labelId,
				cover: cover,
				username: username,
				mail: mail,
				firstName: firstName,
				lastName: lastName,
				type: type,
				audioExplicitContent: found.audioExplicitContent ? found.audioExplicitContent : false,
				isAuthor: found.isAuthor ? found.isAuthor : false,
				artistsAsFeaturing: found.artistsAsFeaturing ? found.artistsAsFeaturing : [],
				authors: found.authors ? found.authors : [],
				compositors: found.compositors ? found.compositors : [],
				contributors: found.contributors ? found.contributors : [],
				audioFileName: found.audioFileName ? found.audioFileName : "",
				releaseTitle: found.trackTitle ? found.trackTitle : "",
				uuid: found.uuid,
			});
		}
	};

	removeAudio = (uuid) => {
		let { tracks } = this.state;

		const index = _.findIndex(tracks, (r) => r.uuid == uuid);

		if (index != -1) {
			let selectedTrack = Object.assign({}, tracks[index]);

			selectedTrack.audioFileName = "";

			let clonedTracks = tracks.slice(0);

			clonedTracks[index] = selectedTrack;

			this.setState({ tracks: clonedTracks });
		}
	};

	explicitContentChanged = (index, explicit) => {
		let { tracks } = this.state;

		let clonedTracks = tracks.slice(0);

		clonedTracks[index].audioExplicitContent = explicit;

		this.setState({ tracks: clonedTracks });
	};

	addTrack = () => {
		let { tracks, releaseTitle, lyricsLanguage, primaryGenre, mixTape, imageData, labelId, cover, username, mail, firstName, lastName, type } = this.state;

		let clonedTracks = tracks.slice(0);

		const item = {
			releaseTitle,
			trackTitle: "",
			lyricsLanguage,
			primaryGenre,
			mixTape,
			imageData,
			labelId,
			cover,
			username,
			mail,
			firstName,
			lastName,
			type,
			audioFileName: "",
			audioExplicitContent: false,
			uuid: uuid.v4(),
		};
		clonedTracks.push(item);

		this.setState({ tracks: clonedTracks });
	};

	render() {
		let { releaseTitle, imageData, tracks, errorDialog, dialogTitle, dialogDescription, firstName, lastName } = this.state;

		return (
			<View style={CommonStyle.container}>
				<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.backgroundBlack, CommonStyle.commonPadding]}>
					<Image source={imageData} style={myStyles.avatar} />
					<View style={[CommonStyle.full, { paddingLeft: 15 }]}>
						<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite]}>{releaseTitle}</Text>
						<Text style={[CommonStyle.fontSize_14, CommonStyle.colorDefaultGray]}>
							{firstName} {lastName}
						</Text>
					</View>
				</View>
				<ScrollView style={myStyles.scroll}>
					<View style={CommonStyle.marginTop_10}>
						{Array.isArray(tracks) &&
							tracks.map((item, index) => {
								return (
									<AlbumItemComponent
										index={index}
										data={item}
										releaseTitle={item.trackTitle}
										explicitContent={item.audioExplicitContent}
										audioFileName={item.audioFileName}
										explicitContentChanged={this.explicitContentChanged}
										clickTrack={this.clickTrack}
									/>
								);
							})}
					</View>

					<ActionSheet
						ref={(o) => (this.ActionSheet = o)}
						title={"Select Image"}
						options={["Camera", "Gallery", "cancel"]}
						cancelButtonIndex={2}
						destructiveButtonIndex={1}
						onPress={(index) => {
							if (index == 0 || index == 1) {
								this.selectImage(index);
							}
						}}
					/>
				</ScrollView>
				<View style={{ flexDirection: "column", marginBottom: 10 }}>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
						<TouchableOpacity activeOpacity={0.95} style={myStyles.add_track_button} onPress={this.addTrack}>
							<Text style={[CommonStyle.fontSize_15, CommonStyle.colorDefault]}>{"+ Add Track"}</Text>
						</TouchableOpacity>
					</View>
					<View style={myStyles.nextButtonContainer}>
						<TouchableOpacity
							style={[
								CommonStyle.commonButton,
								{
									width: halfOfWindows,
									backgroundColor: "#DA4400",
								},
							]}
							onPress={this.clickNext}
						>
							<Text style={CommonStyle.commonButtonText}>{"Next"}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Dialog.Container blurStyle={{ backgroundColor: "#454545" }} contentStyle={{ backgroundColor: "#454545" }} visible={errorDialog}>
					<Dialog.Title style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{dialogTitle}</Dialog.Title>
					<Dialog.Description style={[CommonStyle.colorWhite, CommonStyle.fontSize_13, { fontWeight: "600" }]}>{dialogDescription}</Dialog.Description>
					<Dialog.Button
						label='OK'
						color={"#4696FF"}
						onPress={() => {
							this.setState({ errorDialog: false });
						}}
					/>
				</Dialog.Container>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#252525",
	},
	scroll: {
		flex: 1,
		paddingBottom: 15,
	},
	avatarContainer: {
		width: halfOfWindows,
		height: halfOfWindows,
		backgroundColor: "black",
		borderRadius: 3,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: "white",
		justifyContent: "center",
		alignItems: "center",
	},
	avatarParentContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	arrow_right: {
		width: 12,
		height: 30,
		resizeMode: "contain",
	},
	album_text: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
	},
	switch_container: {
		borderColor: "#e6e6e6",
		width: 39,
		borderWidth: 1,
		borderRadius: 15,
		paddingLeft: 3,
		paddingRight: 3,
		paddingTop: 3,
		paddingBottom: 3,
	},
	album_switch_container: {
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
		marginTop: 25,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 6,
		backgroundColor: "#da4400",
	},
	emptyAvatar: {
		width: halfOfWindows / 3,
		height: halfOfWindows / 4,
		resizeMode: "contain",
	},
	trackAvatar: {
		width: halfOfWindows,
		height: halfOfWindows,
		resizeMode: "contain",
	},
	emptyAvatarContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	coverArt: {
		color: "white",
		fontSize: 17,
		fontWeight: "bold",
		marginTop: 10,
	},
	nextHitText: {
		color: "white",
		fontSize: 15,
		marginTop: 8,
	},
	itemContainer: {
		marginTop: 25,
		flexDirection: "row",
		borderBottomColor: defaultGray,
		borderBottomWidth: 1,
		alignItems: "center",
	},
	nextButtonContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		paddingBottom: 30,
	},
	avatar: {
		width: 65,
		height: 65,
		resizeMode: "contain",
	},
	add_track_button: {
		width: halfOfWindows,
		backgroundColor: "black",
		height: 40,
		borderRadius: 3,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
});

export default AlbumScreen;
