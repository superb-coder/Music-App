import React from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, NativeModules, AsyncStorage } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import { getStatusBarHeight } from "react-native-status-bar-height";
import UserAvatar from "react-native-user-avatar";
import ActionSheet from "react-native-actionsheet";
import Dialog from "react-native-dialog";
import DropdownMenu from "../../widgets/DropDown";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import { CommonStyle, defaultGray } from "../_styles";
import ModalPickerImage from "../../widgets/ModalPickerImage";
import APIGatewayFetch from "../../APIGateway";
import uuid from "react-native-uuid";
import { S3_CREDENTIALS, S3URL } from "../../Constants";
import S3FileUploader from "../../widgets/FileUploader/S3";

const statusBarHeight = getStatusBarHeight();

const euroSign = require("../../../assets/icons/icon_euro_sign.png");
const settings = require("../../../assets/icons/icon_settings.png");
const avatar3 = require("../../../assets/images/avatar3.png");
const arrow_right = require("../../../assets/images/right_arrow.png");

var ImagePicker = NativeModules.ImageCropPicker;

const DROP_MENU = [["Andrei Kolokolov", "Ying"]];

const halfOfWindows = Dimensions.get("window").width / 2;
const avatarWidth = Dimensions.get("window").width * 0.25;

class ArtistTabScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			country: "",
			selfie: null,
			phoneNumber: "",
			phoneNumberPickerData: null,
			modalVisible: false,
			countryCode: "FR",
			isLoading: false,

			errorDialog: false,
			dialogTitle: "",
			dialogDescription: "",
			userInfo: null,
		};
	}

	componentDidMount() {
		// this.setState({
		//     pickerData: this.phone.getPickerData()
		// })
		this.props.navigation.addListener("didFocus", () => {
			this.loadInfo();
		});
	}

	loadInfo = () => {
		this.setState({ isLoading: true }, () => {
			AsyncStorage.getItem("@Auth:mail")
				.then((mail) => {
					if (mail) {
						const apiObj = new APIGatewayFetch();

						apiObj
							.findOne({
								model: "Entities",
								where: {
									mail: mail.toLowerCase(),
								},
							})
							.catch((e) => {})
							.then((userInfo) => {
								if (userInfo != null && userInfo != undefined) {
									this.setState({
										isLoading: false,
										firstName: userInfo.firstName,
										lastName: userInfo.lastName,
										country: userInfo.country,
										phoneNumber: userInfo.phone,
										selfie: userInfo.selfie,
										userInfo: userInfo,
									});
								} else {
									this.setState({ isLoading: false });
								}
							});
					} else {
						this.setState({ isLoading: false });
					}
				})
				.catch((error) => {
					this.setState({ isLoading: false });
				});
		});
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

	clickSave = () => {
		let { firstName, lastName, country, phoneNumber, selfie, userInfo } = this.state;

		if (userInfo == null) {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please try later" });

			return;
		}

		if (firstName == "") {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please input First name" });

			return;
		}

		if (lastName == "") {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please input Last name" });

			return;
		}

		if (country == "" || country == null) {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please select Country" });

			return;
		}

		if (phoneNumber == "" || phoneNumber == null) {
			this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please input Phone number" });

			return;
		}

		this.setState({ isLoading: true }, () => {
			const apiObj = new APIGatewayFetch();
			let clonedUserInfo = {};

			clonedUserInfo.firstName = firstName;
			clonedUserInfo.lastName = lastName;
			clonedUserInfo.country = country;
			clonedUserInfo.phone = phoneNumber;
			clonedUserInfo.selfie = selfie;
			clonedUserInfo.type = "artist";
			AsyncStorage.getItem("@Auth:id")
				.then((id) => {
					apiObj
						.update({
							model: "Entities",
							where: {
								id: id,
							},
							values: clonedUserInfo,
						})
						.then((data) => {
							this.loadInfo();
						})
						.catch((e) => {
							this.setState({ isLoading: false, errorDialog: true, dialogTitle: "Error", dialogDescription: "Please try later" });
						});
				})
				.catch((error) => {
					this.setState({ isLoading: false });
				});
		});
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
					this.setState({ selfie: filename }, () => {
						resolve(true);
					});
				}
			});
		});
	};

	onChangePhoneNumber = (phoneNumber) => {
		this.setState({ phoneNumber });
	};

	countrySelect = (item) => {
		if (item) {
			this.setState({ countryCode: item.cca2, country: item.name });
		}
	};

	clickLogOut = () => {
		Promise.all([
			AsyncStorage.removeItem("@Auth:firstName"),
			AsyncStorage.removeItem("@Auth:lastName"),
			AsyncStorage.removeItem("@Auth:username"),
			AsyncStorage.removeItem("@Auth:image"),
			AsyncStorage.removeItem("@Auth:paymentMode"),
			AsyncStorage.removeItem("@Auth:salesCountry"),
			AsyncStorage.removeItem("@Auth:profilePic"),
			AsyncStorage.removeItem("@Auth:mangoPayWalletAmount"),
			AsyncStorage.removeItem("@Auth:type"),
			AsyncStorage.removeItem("@Auth:hasManager"),
			AsyncStorage.removeItem("@Auth:managerPhoto"),
			AsyncStorage.removeItem("@Auth:id"),
			AsyncStorage.removeItem("@Auth:walletAmount"),
			AsyncStorage.removeItem("@Auth:cashOffice"),
			AsyncStorage.removeItem("@Auth:isLoggedIn"),
			AsyncStorage.removeItem("@Auth:user"),
			AsyncStorage.removeItem("@Auth:mail"),
		]).then((e) => {
			this.props.navigation.navigate("HomeScreen");
		});
	};

	clickPaymentScreen = () => {
		const apiObj = new APIGatewayFetch();

		this.setState({ isLoading: true }, () => {
			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findAll(
						{
							model: "Payments",
							orderBy: "updatedAt",
							orderWay: "desc",
							where: {
								entityId: "ety_gtNqq6evjkA",
							},
						},
						true
					)
					.then((payments) => {
						this.setState({ isLoading: false }, () => {
							if (Array.isArray(payments) && payments.length > 0) {
								payments.sort((a, b) => {
									return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
								});

								let isProcessing = false;

								if (payments[0].status == "waiting") {
									isProcessing = true;
								}

								isProcessing = true;

								this.props.navigation.navigate("PaymentScreen", { isFrom: "Artist", isProcessing: isProcessing });
							} else {
								this.props.navigation.navigate("WaitingPaymentScreen", { isFrom: "Artist" });
							}
						});
					});
			});
		});
	};

	render() {
		let { firstName, lastName, phoneNumber, countryCode, isLoading, selfie, errorDialog, dialogTitle, dialogDescription } = this.state;

		let userName = firstName + " " + lastName;

		return (
			<View style={CommonStyle.container}>
				<View style={[CommonStyle.orignalPadding, CommonStyle.backgroundBlack, { paddingTop: statusBarHeight, paddingBottom: 15, zIndex: 44 }]}>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentBetween, CommonStyle.backgroundBlack, CommonStyle.marginTop_15]}>
						<TouchableOpacity
							onPress={() => {
								// this.props.navigation.navigate("PaymentScreen", { isFrom: "Artist" });
								this.clickPaymentScreen();
							}}
						>
							<Image source={euroSign} style={CommonStyle.euroSignIcon} />
						</TouchableOpacity>

						<View style={{ width: 180, zIndex: 11 }}>
							{/* <DropdownMenu
                                bgColor={'#000000'}
                                tintColor={"#000000"}
                                activityTintColor={'green'}
                                titleStyle={[CommonStyle.colorWhite, CommonStyle.fontSize_20]}

                                handler={(selection, row) => {
                                    // console.log(selection, row);
                                    // this.setState({ selectedOption: DROP_MENU[selection][row], selectedIndex: row })
                                }}
                                data={DROP_MENU}
                            >

                            </DropdownMenu> */}
						</View>

						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("SupportScreen", { isFrom: "Artist" });
							}}
						>
							<Image source={settings} style={CommonStyle.settingIcon} />
						</TouchableOpacity>
					</View>
				</View>
				<ScrollView style={[CommonStyle.orignalPadding, CommonStyle.full, { backgroundColor: "#252525", zIndex: 1 }]}>
					<View style={[CommonStyle.alignItemsCenter, CommonStyle.justifyContentCenter, { paddingVertical: 25 }]}>
						<TouchableOpacity activeOpacity={0.95} style={myStyles.avatarContainer} onPress={this.showActionSheet}>
							{isLoading && <UserAvatar size={avatarWidth} name={""} />}
							{selfie && isLoading == false && <UserAvatar size={avatarWidth} name={``} src={`${S3URL}${selfie}`} />}

							{!selfie && isLoading == false && <UserAvatar size={avatarWidth} name={userName} />}
						</TouchableOpacity>

						<View style={[CommonStyle.justifyContentCenter, CommonStyle.flexDirectionRow, { paddingTop: 15 }]}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>
								{firstName} {lastName}
							</Text>
						</View>
						<View style={[CommonStyle.justifyContentCenter, CommonStyle.flexDirectionRow, { paddingTop: 5 }]}>
							<Text style={[CommonStyle.fontSize_14, CommonStyle.colorDefaultGray]}>{"Artist"}</Text>
						</View>
					</View>
					<View style={{ width: "100%", height: 2, backgroundColor: "#DA4400" }}></View>
					<View style={CommonStyle.marginTop_25}>
						<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_20]}>{"Informations"}</Text>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<FloatingLabel
							labelStyle={CommonStyle.labelInput}
							inputStyle={CommonStyle.input}
							style={CommonStyle.formInput}
							value={firstName}
							onChangeText={(text) => this.setState({ firstName: text })}
						>
							First name
						</FloatingLabel>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<FloatingLabel
							labelStyle={CommonStyle.labelInput}
							inputStyle={CommonStyle.input}
							style={CommonStyle.formInput}
							value={lastName}
							onChangeText={(text) => this.setState({ lastName: text })}
						>
							Last name
						</FloatingLabel>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<Text style={[CommonStyle.fontSize_12, CommonStyle.colorDefaultGray, { paddingBottom: 5 }]}>{"Country"}</Text>
						<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, { borderBottomColor: defaultGray, borderBottomWidth: 1 }]}>
							<View style={CommonStyle.full}>
								<CountryPicker
									withFlagButton={false}
									withFlag={true}
									countryCode={countryCode}
									withCountryNameButton={true}
									theme={{ primaryColor: "black", onBackgroundTextColor: "white", backgroundColor: "rgba(52, 52, 52, 0.8)", fontSize: 20 }}
									onSelect={this.countrySelect}
									containerButtonStyle={{
										paddingBottom: 2,
										paddingTop: 0,
										marginTop: 0,
										fontSize: 20,
									}}
								/>
							</View>
							<Image source={arrow_right} style={{ width: 12, height: 30, resizeMode: "contain" }} />
						</View>
					</View>
					<View style={[myStyles.phoneNumberContainer, { paddingBottom: 2 }]}>
						<Text style={[CommonStyle.fontSize_12, CommonStyle.colorDefaultGray, { paddingBottom: 5 }]}>{"Phone number"}</Text>
						<PhoneInput
							ref={(ref) => {
								this.phone = ref;
							}}
							onPressFlag={this.onPressFlag}
							textStyle={[myStyles.phone_input, myStyles.custom_phone_input]}
							textProps={{
								placeholder: "Telephone",
								placeholderTextColor: "#666",
								fontSize: 18,
							}}
							initialCountry='fr'
							value={phoneNumber}
							flagStyle={{
								marginTop: 0,
								marginBottom: -5,
								borderRadius: 0,
								borderWidth: 0,
								marginLeft: 5,
								marginRight: 5,
							}}
							allowZeroAfterCountryCode='false'
							onChangePhoneNumber={this.onChangePhoneNumber}
						/>

						<ModalPickerImage
							ref={(ref) => {
								this.myCountryPicker = ref;
							}}
							data={this.state.pickerData}
							onChange={(country) => {
								this.selectCountry(country);
							}}
							cancelText='Cancel'
						/>
					</View>
					<View style={[CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter, { paddingTop: 30, paddingBottom: 15 }]}>
						<TouchableOpacity
							style={[
								CommonStyle.justifyContentCenter,
								CommonStyle.alignItemsCenter,
								{
									width: halfOfWindows,
									height: 40,
									backgroundColor: "#DA4400",
									borderRadius: 40,
								},
							]}
							onPress={this.clickSave}
						>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{"Save"}</Text>
						</TouchableOpacity>
					</View>
					<View style={[CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter, { paddingVertical: 15 }]}>
						<TouchableOpacity
							style={[
								CommonStyle.justifyContentCenter,
								CommonStyle.alignItemsCenter,
								{
									width: halfOfWindows,
									height: 40,
									backgroundColor: "#DA4400",
									borderRadius: 40,
								},
							]}
							onPress={this.clickLogOut}
						>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{"Log out"}</Text>
						</TouchableOpacity>
						<Text style={[CommonStyle.marginTop_15, CommonStyle.fontSize_12, CommonStyle.colorDefaultGray]}>{"Version 1.0.1"}</Text>
					</View>
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
				{isLoading && <LoadingOverlay />}
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
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	scroll: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
	},
	phoneNumberContainer: {
		marginTop: 25,
		borderBottomColor: defaultGray,
		borderBottomWidth: 1,
	},
	phone_input: {
		backgroundColor: "white",
		marginBottom: 2,
		padding: 8,
		paddingLeft: 0,
		fontSize: 15,
		height: 32,
		paddingBottom: 0,
	},
	custom_phone_input: {
		color: "white",
		backgroundColor: "transparent",
		borderBottomColor: "transparent",
	},
});

export default ArtistTabScreen;
