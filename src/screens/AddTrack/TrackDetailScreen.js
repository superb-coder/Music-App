import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, NativeModules } from "react-native";
import { CommonStyle, defaultGray } from "../_styles";
import { Switch } from "react-native-switch";
import DocumentPicker from "react-native-document-picker";
import _ from "lodash";
import uuid from "react-native-uuid";
import Dialog from "react-native-dialog";
import FeatCollabArtistsComponents from "../../widgets/FeatCollabArtistsComponents";
import AudioFileContainerComponents from "../../widgets/AudioFileContainerComponents";
import Contributors from "../../widgets/Contributors";
import Compositors from "../../widgets/Compositors";
import AuthorsComponent from "../../widgets/AuthorsComponent";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import { S3_CREDENTIALS, S3URL } from "../../Constants";
import S3FileUploader from "../../widgets/FileUploader/S3";

const navigationBack = require("../../../assets/images/back_icon.png");
const halfOfWindows = Dimensions.get("window").width / 2;

class TrackDetailScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => <Text style={CommonStyle.headerText}>{"Release"}</Text>,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
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
			audioExplicitContent: false,
			isAuthor: true,
			artistsAsFeaturing: [],
			authors: [],
			compositors: [],
			contributors: [],
			audioFileName: "",
			isLoading: false,
			labelId: labelId,
			cover: cover,
			username: username,
			mail: mail,
			firstName: firstName,
			lastName: lastName,
			errorDialog: false,
			dialogTitle: "",
			dialogDescription: "",
			type: type,
		};
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		let { artistsAsFeaturing, authors, compositors, contributors } = this.state;
		global.refreshEmitter.addListener("ADD_FEAT_COLLAB", (data) => {
			if (data && data.data) {
				const found = _.find(artistsAsFeaturing, (r) => ((r.spotifyArtistId == data.data.spotifyArtistId) == r.artistName) == data.data.artistName && r.isFeaturing == data.data.isFeaturing);

				if (found == undefined) {
					artistsAsFeaturing.push(data.data);

					this.setState({ artistsAsFeaturing: artistsAsFeaturing });
				}
			}
		});

		global.refreshEmitter.addListener("ADD_AUTHOR", (data) => {
			if (data && data.data) {
				authors.push(data.data);

				this.setState({ authors: authors });
			}
		});

		global.refreshEmitter.addListener("ADD_COMPOSER", (data) => {
			if (data && data.data) {
				compositors.push(data.data);

				this.setState({ compositors: compositors });
			}
		});

		global.refreshEmitter.addListener("ADD_CONTRIBUTORS", (data) => {
			if (data && data.data) {
				const found = _.find(contributors, (r) => r.spotifyArtistId == data.data.spotifyArtistId && r.artistName == data.data.artistName);

				if (found == undefined) {
					contributors.push(data.data);

					this.setState({ contributors: contributors });
				}
			}
		});
	}

	removeFeatCollab = (index) => {
		let { artistsAsFeaturing } = this.state;

		if (index < artistsAsFeaturing.length) {
			artistsAsFeaturing.splice(index, 1);
			this.setState({ artistsAsFeaturing: artistsAsFeaturing });
		}
	};

	removeContributors = (index) => {
		let { contributors } = this.state;

		if (index < contributors.length) {
			contributors.splice(index, 1);
			this.setState({ contributors: contributors });
		}
	};

	removeAuthor = (index) => {
		let { authors } = this.state;

		if (index < authors.length) {
			authors.splice(index, 1);
			this.setState({ authors: authors });
		}
	};

	removeComposer = (index) => {
		let { compositors } = this.state;

		if (index < compositors.length) {
			authors.splice(index, 1);
			this.setState({ compositors: compositors });
		}
	};

	clickNext = () => {
		let {
			releaseTitle,
			mixTape,
			imageData,
			lyricsLanguage,
			primaryGenre,
			artistsAsFeaturing,
			isAuthor,
			authors,
			compositors,
			contributors,
			audioFileName,
			labelId,
			cover,
			username,
			mail,
			firstName,
			lastName,
			type,
		} = this.state;

		let author = [];

		if (audioFileName == "" || audioFileName == undefined) {
			this.setState({
				errorDialog: true,
				dialogTitle: "Error",
				dialogDescription: "Please select audio.",
			});

			return;
		}

		if (isAuthor) {
			let data = {};

			data["authorFirstName"] = firstName;
			data["authorLastName"] = lastName;

			author.push(data);
		} else {
			if (Array.isArray(authors)) {
				author = authors.slice(0);
			}
		}

		this.props.navigation.navigate("ReleaseSettingScreen", {
			isMixTape: mixTape,
			releaseTitle,
			trackAvatar: imageData,
			lyricsLanguage,
			primaryGenre,
			artistsAsFeaturing,
			authors: author,
			compositors,
			contributors,
			audio: audioFileName,
			labelId,
			firstName,
			lastName,
			cover,
			username,
			mail,
			type,
		});
	};

	audioExplicitContentChanged = (value) => {
		this.setState({ audioExplicitContent: value });
	};

	clickAddFeatCollab = () => {
		this.props.navigation.navigate("SelectFeatCollabArtistScreen");
	};

	clickAddContributor = () => {
		this.props.navigation.navigate("SelectContributorScreen");
	};

	clickAddAuthor = () => {
		this.props.navigation.navigate("SelectAuthorScreen");
	};

	clickAddCompositor = () => {
		this.props.navigation.navigate("SelectCompositorScreen");
	};

	addAudioFile = () => {
		DocumentPicker.pick({
			type: [DocumentPicker.types.audio],
		})
			.then((res) => {
				this.setState({ isLoading: true }, () => {
					this.uploadAudio(res.uri).then((upload) => {
						this.setState({ isLoading: false });
					});
				});
			})
			.catch((error) => {
				if (DocumentPicker.isCancel(error)) {
					// User cancelled the picker, exit any dialogs or menus and move on
					console.log("Canceled");
				} else {
				}
			});
	};

	uploadAudio = (audio) => {
		return new Promise((resolve, reject) => {
			let filename = audio.split("/");
			filename = filename[filename.length - 1];
			const extractFileType = filename.split(".");
			const fileType = "audio/" + extractFileType[1];

			const uuidv4 = uuid.v4();

			filename = `${uuidv4.toLocaleUpperCase()}.${extractFileType[1]}`;
			const audiofile = {
				uri: audio,
				name: filename,
				type: fileType,
			};
			const s3FileUploader = new S3FileUploader();
			s3FileUploader.put(audiofile, S3_CREDENTIALS).then((response) => {
				if (response.status !== 201) {
					resolve(false);
				} else {
					this.setState({ audioFileName: filename }, () => {
						resolve(true);
					});
				}
			});
		});
	};

	removeAudio = () => {
		this.setState({ audioFileName: "" });
	};

	render() {
		let {
			releaseTitle,
			imageData,
			audioExplicitContent,
			isAuthor,
			artistsAsFeaturing,
			contributors,
			authors,
			compositors,
			isLoading,
			audioFileName,
			errorDialog,
			dialogTitle,
			dialogDescription,
			firstName,
			lastName,
		} = this.state;
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
					<FeatCollabArtistsComponents onClick={this.clickAddFeatCollab} featCollabList={artistsAsFeaturing} removeFeatCollab={this.removeFeatCollab} />
					<View style={{ height: 30 }}></View>
					<AudioFileContainerComponents
						addTrack={this.addAudioFile}
						removeAudio={this.removeAudio}
						audioFileName={audioFileName}
						explicitContent={audioExplicitContent}
						explicitContentChanged={this.audioExplicitContentChanged}
					/>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.justifyContentCenter, CommonStyle.paddingHorizontal_15, { height: 70 }]}>
						<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
							<TouchableOpacity
								activeOpacity={0.95}
								style={CommonStyle.full}
								onPress={() => {
									this.setState({ isAuthor: !isAuthor });
								}}
							>
								<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_15]}>{"Are you the author of the song"}</Text>
							</TouchableOpacity>
							<View style={[myStyles.checkBox, isAuthor && CommonStyle.backgroundDefault]}>
								<Switch
									value={isAuthor ? true : false}
									onValueChange={(val) => this.setState({ isAuthor: val })}
									disabled={false}
									circleSize={15}
									circleBorderWidth={1}
									backgroundActive={"rgba(255, 255, 255, 0)"}
									backgroundInactive={"#252525"}
									circleActiveBorderColor={"#373737"}
									circleInactiveBorderColor={"#373737"}
									circleActiveColor={"#FFFFFF"}
									circleInActiveColor={"#FFFFFF"}
									changeValueImmediately={true}
									// renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
									changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
									innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
									outerCircleStyle={{}} // style for outer animated circle
									renderActiveText={false}
									renderInActiveText={false}
									switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
									switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
									switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
									switchBorderRadius={15} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
								/>
							</View>
						</View>
					</View>
					{!isAuthor && <AuthorsComponent onClick={this.clickAddAuthor} authors={authors} removeAuthor={this.removeAuthor} />}
					{!isAuthor && <View style={{ height: 30 }}></View>}
					<Compositors onClick={this.clickAddCompositor} compositors={compositors} removeComposer={this.removeComposer} />
					<View style={{ height: 30 }}></View>
					<Contributors clickAddContributor={this.clickAddContributor} contributors={contributors} removeContributors={this.removeContributors} />

					<View
						style={[
							CommonStyle.flexDirectionRow,
							CommonStyle.alignItemsCenter,
							CommonStyle.justifyContentCenter,
							CommonStyle.paddingHorizontal_15,
							{
								height: 100,
							},
						]}
					>
						<TouchableOpacity style={myStyles.nextButton} onPress={this.clickNext}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.defaultFontSize, CommonStyle.fontBold]}>{"Next"}</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				{isLoading && <LoadingOverlay />}
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
	nextButton: {
		width: halfOfWindows,
		height: 40,
		backgroundColor: "#DA4400",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 40,
	},
	checkBox: {
		borderColor: "#e6e6e6",
		width: 39,
		borderWidth: 1,
		borderRadius: 15,
		padding: 3,
	},
	avatar: {
		width: 65,
		height: 65,
		resizeMode: "contain",
	},
});

export default TrackDetailScreen;
