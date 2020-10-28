import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView, AsyncStorage, Linking } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import { CommonStyle, defaultGray } from "../_styles";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import APIGatewayFetch from "../../APIGateway";
import UserAvatar from "react-native-user-avatar";
import ModalWrapper from "react-native-modal-wrapper";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";
import qs from "qs";
import { S3URL } from "../../Constants";
const avatar1 = require("../../../assets/images/avatar1.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const success_icon = require("../../../assets/images/success_icon.png");
const success_icon_size = (Dimensions.get("window").width * 214) / 1125;
const nextButtonWidth = Dimensions.get("window").width / 2;
const avatarWidth = 50;
class SupportScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => null,
			headerLeft: () => null,
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						const isFrom = navigation.getParam("isFrom", "MusicTabScreen");
						navigation.navigate(isFrom);
					}}
					style={CommonStyle.navigationBackContainer}
				>
					<Text style={[CommonStyle.navigationBackText, CommonStyle.marginLeft_0, { marginRight: 15 }]}>Done</Text>
				</TouchableOpacity>
			),
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);

		let isFrom = this.props.navigation.getParam("isFrom", "MusicTabScreen");

		this.state = {
			isFrom: isFrom,
			isLoading: false,
			firstName: "",
			lastName: "",
			country: "",
			selfie: null,
			userInfo: null,
			modalVisible: false,
			errorDialog: false,
			dialogTitle: "",
			dialogDescription: "",
			loadingDialogShow: false,
		};
	}

	componentDidMount() {
		this.loadInfo();
	}

	loadInfo = () => {
		console.log("LoadInfo");
		this.setState({ isLoading: true }, () => {
			AsyncStorage.getItem("@Auth:mail")
				.then((mail) => {
					if (mail) {
						console.log(mail);
						const apiObj = new APIGatewayFetch();

						apiObj
							.findOne({
								model: "Entities",
								where: {
									mail: mail.toLowerCase(),
								},
							})
							.catch((e) => {
								console.log(e);
							})
							.then((userInfo) => {
								console.log("userInfo", userInfo);
								if (userInfo != null && userInfo != undefined) {
									this.setState({
										isLoading: false,
										firstName: userInfo.firstName,
										lastName: userInfo.lastName,
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
					console.log(error);
					this.setState({ isLoading: false });
				});
		});
	};

	clickLogout = () => {
		AsyncStorage.removeItem("@Auth:id").then(() => {
			this.props.navigation.navigate("HomeScreen");
		});
	};

	clickHelpCenter = () => {
		let to = "Alicia@jaiye.com";
		let url = `mailto:${to}`;

		// Create email link query
		const query = qs.stringify({
			subject: "Help Center",
		});

		if (query.length) {
			url += `?${query}`;
		}

		// check if we can use this link
		Linking.canOpenURL(url).then((canOpen) => {
			if (!canOpen) {
				this.setState({ errorDialog: true, dialogTitle: "Error", dialogDescription: "Please install mail App" });

				return;
			}

			return Linking.openURL(url);
		});
	};

	render() {
		let { isFrom, isLoading, firstName, lastName, selfie, modalVisible, errorDialog, dialogTitle, dialogDescription } = this.state;
		let userName = firstName + " " + lastName;
		return (
			<View style={CommonStyle.container}>
				<View style={myStyles.scroll}>
					<View style={[CommonStyle.orignalPadding, myStyles.paddingVetical25, CommonStyle.flexDirectionRow, { backgroundColor: "#161616" }]}>
						{isLoading && <UserAvatar size={avatarWidth} name={""} />}
						{selfie && isLoading == false && <UserAvatar size={avatarWidth} name={``} src={`${S3URL}${selfie}`} />}

						{!selfie && isLoading == false && <UserAvatar size={avatarWidth} name={userName} />}
						<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_18]}>
								{firstName} {lastName}
							</Text>
							<Text style={myStyles.subTitle}>{"Artist"}</Text>
						</View>
					</View>
					<View style={[CommonStyle.orignalPadding, CommonStyle.full]}>
						<View style={{ paddingTop: 25 }}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{"Customer support"}</Text>
						</View>
						<View style={myStyles.help_center_button_container}>
							<TouchableOpacity style={myStyles.help_center_button} activeOpacity={0.8} onPress={this.clickHelpCenter}>
								<Text style={[CommonStyle.fontBold, CommonStyle.colorDefault]}>{"Help Center"}</Text>
							</TouchableOpacity>
						</View>
						<View style={{ paddingTop: 25 }}>
							<Text style={[CommonStyle.fontBold, CommonStyle.colorWhite, CommonStyle.fontSize_18]}>{"Legal"}</Text>
						</View>
						<View style={myStyles.custom_button_container}>
							<Text style={[CommonStyle.fontBold, CommonStyle.colorWhite, CommonStyle.fontSize_15]}>{"Terms of use"}</Text>
							<Image source={arrow_right} style={myStyles.custom_button_icon} />
						</View>
						<View style={myStyles.custom_button_container}>
							<Text style={[CommonStyle.fontBold, CommonStyle.colorWhite, CommonStyle.fontSize_15]}>{"Privacy Policy"}</Text>
							<Image source={arrow_right} style={myStyles.custom_button_icon} />
						</View>
						<View style={myStyles.custom_button_container}>
							<Text style={[CommonStyle.fontBold, CommonStyle.colorWhite, CommonStyle.fontSize_15]}>{"Distributin Deal"}</Text>
							<Image source={arrow_right} style={myStyles.custom_button_icon} />
						</View>
						<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
							<View style={[CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
								<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
									<TouchableOpacity style={[myStyles.help_center_button, CommonStyle.backgroundDefault, { borderRadius: 40 }]} activeOpacity={0.8} onPress={this.clickLogout}>
										<Text style={[CommonStyle.fontBold, CommonStyle.colorWhite]}>{"Log out"}</Text>
									</TouchableOpacity>
								</View>
								<Text style={myStyles.versionText}>{"Version 1.0.1"}</Text>
							</View>
						</View>
					</View>
				</View>
				{isLoading && <LoadingOverlay />}

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
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	scroll: {
		flex: 1,
		paddingBottom: 15,
		flexDirection: "column",
	},
	help_center_button: {
		backgroundColor: "black",
		width: nextButtonWidth,
		height: 40,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 3,
	},
	help_center_button_container: {
		paddingTop: 20,
		flexDirection: "row",
		justifyContent: "center",
	},
	custom_button_icon: {
		width: 12,
		height: 14,
		resizeMode: "contain",
	},
	custom_button_container: {
		paddingTop: 25,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 7,
		borderBottomColor: defaultGray,
		borderBottomWidth: 1,
	},
	avatarImg: {
		width: 50,
		height: 50,
		resizeMode: "contain",
	},
	subTitle: {
		color: defaultGray,
		fontSize: 14,
		marginTop: 7,
	},
	versionText: {
		marginTop: 15,
		fontSize: 12,
		color: "white",
	},
	paddingVetical25: {
		paddingTop: 25,
		paddingBottom: 25,
	},
	modalWrapper: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	},
});

export default SupportScreen;
