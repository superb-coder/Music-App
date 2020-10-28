import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, NativeModules, AsyncStorage } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import { CommonStyle, defaultGray } from "../_styles";
import { Switch } from "react-native-switch";
import ActionSheet from "react-native-actionsheet";
import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";

import LoadingOverlay from "../../widgets/LoadingOverlay";
import { S3_CREDENTIALS, S3URL } from "../../Constants";
import S3FileUploader from "../../widgets/FileUploader/S3";

var ImagePicker = NativeModules.ImageCropPicker;

const trashIcon = require("../../../assets/icons/trash.png");
const downloadIcon = require("../../../assets/icons/icon_cloud_download.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const halfOfWindows = Dimensions.get("window").width / 2;

class AddTrackScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => <Text style={CommonStyle.headerText}>{"Release"}</Text>,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={trashIcon} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
				</TouchableOpacity>
			),
			headerRight: () => null,
			headerStyle: CommonStyle.customHeaderStyle,
			tabBarVisible: false,
		};
	};

	constructor(props) {
		super(props);

		let releaseTitle = this.props.navigation.getParam("releaseTitle", "");
		let lyricsLanguage = this.props.navigation.getParam("lyricsLanguage", "English");
		let primaryGenre = this.props.navigation.getParam("primaryGenre", "HIPHOP");
		let mixTape = this.props.navigation.getParam("mixTape", true);
		let imageData = this.props.navigation.getParam("imageData", null);
		let cover = this.props.navigation.getParam("cover", "");

		this.state = {
			releaseTitle: releaseTitle,
			lyricsLanguage: lyricsLanguage,
			primaryGenre: primaryGenre,
			mixTape: mixTape,
			imageData: imageData,
			cover: cover,
			isLoading: false,
			username: "",
			profilePic: "",
			type: "",
			mail: "",
			labelId: "",
			firstName: "",
			lastName: "",
			errorDialog: false,
			dialogDescription: "",
			dialogTitle: "",
		};
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		AsyncStorage.multiGet(["@Auth:firstName", "@Auth:lastName", "@Auth:profilePic", "@Auth:type", "@Auth:mail", "@Auth:id"], (err, values) => {
			const username = values[0][1] + " " + values[1][1];
			const imageURL = S3URL + values[2][1];
			this.setState({
				firstName: values[0][1],
				lastName: values[1][1],
				username: username,
				profilePic: imageURL,
				type: values[3][1],
				mail: values[4][1],
				labelId: values[5][1],
			});
		});
		global.refreshEmitter.addListener("SELECTLANGUAGE", (data) => {
			if (data && data.data) {
				this.setState({ lyricsLanguage: data.data });
			}
		});

		global.refreshEmitter.addListener("SELECTGENRE", (data) => {
			if (data && data.data) {
				this.setState({ primaryGenre: data.data });
			}
		});
	}

	selectTitle = () => {
		let { lyricsLanguage } = this.state;
		this.props.navigation.navigate("SelectLanguageScreen", { selectedLanguage: lyricsLanguage });
	};

	selectGenre = () => {
		let { primaryGenre } = this.state;
		this.props.navigation.navigate("SelectGenreScreen", { genre: primaryGenre });
	};

	showActionSheet = () => {
		this.actionSheet.show();
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
				this.setState(
					{
						imageData: { uri: i.path, width: i.width, height: i.height, mime: i.mime },
						isLoading: true,
					},
					() => {
						this.uploadImage(i.path).then((updated) => {
							this.setState({ isLoading: false });
						});
					}
				);
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
				this.setState(
					{
						imageData: { uri: i.path, width: i.width, height: i.height, mime: i.mime },
						isLoading: true,
					},
					() => {
						this.uploadImage(i.path).then((updated) => {
							this.setState({ isLoading: false });
						});
					}
				);
			});
		}
	};

	uploadImage = (imageUri) => {
		return new Promise((resolve, reject) => {
			let filename = imageUri.split("/");
			filename = filename[filename.length - 1];
			const extractFileType = filename.split(".");
			const fileType = "image/" + extractFileType[1];
			const uuidv4 = uuid.v4();

			filename = `${uuidv4.toLocaleUpperCase()}.${extractFileType[1]}`;
			const imagefile = {
				uri: imageUri,
				name: filename,
				type: fileType,
			};
			const s3FileUploader = new S3FileUploader();
			s3FileUploader.put(imagefile, S3_CREDENTIALS).then((response) => {
				if (response.status !== 201) {
					resolve(false);
				} else {
					this.setState({ cover: filename }, () => {
						resolve(true);
					});
				}
			});
		});
	};

	clickNext = () => {
		let { releaseTitle, lyricsLanguage, primaryGenre, imageData, mixTape, labelId, cover, mail, firstName, lastName, type } = this.state;

		if (!imageData) {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please select Image." });

			return;
		}

		if (releaseTitle == "") {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please input Title." });

			return;
		}

		if (lyricsLanguage == "") {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please select Release Title Language." });

			return;
		}

		if (primaryGenre == "") {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please select Genre." });

			return;
		}

		if (mixTape == true) {
			this.props.navigation.navigate("AlbumScreen", {
				releaseTitle,
				lyricsLanguage,
				primaryGenre,
				avatar: imageData,
				mixTape,
				labelId,
				cover,
				mail,
				firstName,
				lastName,
				type,
			});
		} else {
			this.props.navigation.navigate("TrackDetailScreen", {
				releaseTitle,
				lyricsLanguage,
				primaryGenre,
				avatar: imageData,
				mixTape,
				labelId,
				cover,
				mail,
				firstName,
				lastName,
				type,
			});
		}
	};

	render() {
		let { releaseTitle, lyricsLanguage, primaryGenre, mixTape, imageData, isLoading, errorDialog, dialogDescription, dialogTitle } = this.state;
		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View style={myStyles.avatarParentContainer}>
						<TouchableOpacity activeOpacity={0.95} style={myStyles.avatarContainer} onPress={this.showActionSheet}>
							{imageData && <Image source={imageData} style={myStyles.trackAvatar} />}

							{!imageData && (
								<View style={myStyles.emptyAvatarContainer}>
									<Image source={downloadIcon} style={myStyles.emptyAvatar} />
									<Text style={myStyles.coverArt}>{"Cover Art"}</Text>
								</View>
							)}
						</TouchableOpacity>
					</View>
					<View style={CommonStyle.horizontalCenter}>
						<Text style={myStyles.nextHitText}>{"Drop the next hit!"}</Text>
					</View>
					<View style={CommonStyle.marginTop_35}>
						<FloatingLabel
							labelStyle={CommonStyle.labelInput}
							inputStyle={CommonStyle.input}
							style={CommonStyle.formInput}
							value={releaseTitle}
							onChangeText={(text) => {
								this.setState({ releaseTitle: text });
							}}
						></FloatingLabel>
					</View>
					<View style={[CommonStyle.marginTop_5, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
						<View style={[CommonStyle.dot, CommonStyle.backgroundDefault]}></View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_14, CommonStyle.marginLeft_5]}>{"What is your release called? / Letitre de I'oeuvre"}</Text>
					</View>

					<View style={myStyles.itemContainer}>
						<TouchableOpacity activeOpacity={0.95} style={CommonStyle.horizontalContainer} onPress={this.selectTitle}>
							{lyricsLanguage == "" && <Text style={[CommonStyle.fontSize_18, CommonStyle.colorDefaultGray]}>{"Release Title Language"}</Text>}
							{lyricsLanguage != "" && <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18]}>{lyricsLanguage}</Text>}
						</TouchableOpacity>
						<Image source={arrow_right} style={myStyles.arrow_right} />
					</View>
					<View style={[CommonStyle.marginTop_5, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
						<View style={myStyles.dot}></View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_14, CommonStyle.marginLeft_5]}>{"The language of your release / La langue de I'oeuvre"}</Text>
					</View>

					<View style={myStyles.itemContainer}>
						<TouchableOpacity activeOpacity={0.95} style={CommonStyle.horizontalContainer} onPress={this.selectGenre}>
							{primaryGenre == "" && <Text style={[CommonStyle.fontSize_18, CommonStyle.colorDefaultGray]}>{"Genre"}</Text>}
							{primaryGenre != "" && <Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18]}>{primaryGenre}</Text>}
						</TouchableOpacity>
						<Image source={arrow_right} style={myStyles.arrow_right} />
					</View>
					<View style={[CommonStyle.marginTop_5, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
						<View style={[CommonStyle.dot, CommonStyle.backgroundDefault]}></View>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_14, CommonStyle.marginLeft_5]}>{"Musical genre"}</Text>
					</View>
					<View style={myStyles.album_switch_container}>
						<TouchableOpacity
							activeOpacity={0.95}
							style={CommonStyle.full}
							onPress={() => {
								this.setState({ mixTape: !mixTape });
							}}
						>
							<Text style={myStyles.album_text}>{"Album, EP, Mixtape?"}</Text>
						</TouchableOpacity>
						<View style={[myStyles.switch_container, mixTape && CommonStyle.backgroundDefault]}>
							<Switch
								value={mixTape}
								onValueChange={(val) => this.setState({ mixTape: val })}
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
								innerCircleStyle={[CommonStyle.alignItemsCenter, CommonStyle.justifyContentCenter]} // style for inner animated circle for what you (may) be rendering inside the circle
								outerCircleStyle={{}} // style for outer animated circle
								renderActiveText={false}
								renderInActiveText={false}
								switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
								switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
								switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
								switchBorderRadius={15} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
								use
							/>
						</View>
					</View>
					<View style={myStyles.nextButtonContainer}>
						<TouchableOpacity
							style={[
								CommonStyle.commonButton,
								CommonStyle.backgroundDefault,
								{
									width: halfOfWindows,
								},
							]}
							onPress={this.clickNext}
						>
							<Text style={CommonStyle.commonButtonText}>{"Next"}</Text>
						</TouchableOpacity>
					</View>
					<ActionSheet
						ref={(o) => (this.actionSheet = o)}
						title={"Select Image"}
						options={["Camera", "Gallery", "Cancel"]}
						cancelButtonIndex={2}
						// tintColor={'#454545'}
						destructiveButtonIndex={-1}
						onPress={(index) => {
							if (index == 0 || index == 1) {
								this.selectImage(index);
							}
						}}
						// styles={styles}
					/>
				</ScrollView>
				<Dialog.Container blurStyle={{ backgroundColor: "#454545" }} contentStyle={{ backgroundColor: "#454545" }} visible={errorDialog}>
					<Dialog.Title style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{dialogTitle}</Dialog.Title>
					<Dialog.Description style={[CommonStyle.colorWhite, CommonStyle.fontSize_13, { fontWeight: "600" }]}>{dialogDescription}</Dialog.Description>
					<Dialog.Button
						label='OK'
						color={"#4696FF"}
						onPress={() => {
							let { dialogTitle, email } = this.state;

							this.setState({ errorDialog: false });
						}}
					/>
				</Dialog.Container>
				{isLoading && <LoadingOverlay loading={isLoading} />}
			</View>
		);
	}
}

const styles = {
	overlay: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 50,
		left: 0,
		opacity: 0.4,
		backgroundColor: "transparent",
	},
	wrapper: {
		flex: 1,
		flexDirection: "row",
		paddingBottom: 30,
	},
	body: {
		flex: 1,
		alignSelf: "flex-end",
		backgroundColor: "transparent",
		paddingHorizontal: 5,
	},
	titleBox: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#454545",
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	titleText: {
		color: "#757575",
		fontSize: 14,
	},
	messageBox: {
		height: 30,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#454545",
	},
	messageText: {
		color: "white",
		fontSize: 12,
	},
	buttonBox: {
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#454545",
	},
	buttonText: {
		fontSize: 18,
		color: "white",
	},
	cancelButtonBox: {
		height: 55,
		marginTop: 6,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#454545",
		borderRadius: 15,
		color: "white",
	},
};

export const myStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#252525",
	},
	scroll: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
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
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
		marginVertical: 30,
		justifyContent: "center",
	},
});

export default AddTrackScreen;
