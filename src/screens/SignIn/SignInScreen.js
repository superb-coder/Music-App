import React, { Component } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Dimensions, Button, TouchableOpacity, Image, ScrollView, AsyncStorage, Platform } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import ModalWrapper from "react-native-modal-wrapper";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";
import { CommonStyle, defaultGray } from "../_styles";
import AWSCognito from "../../Auth/AWSCongito";
import APIGatewayFetch from "../../APIGateway";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import CustomLoading from "../../widgets/CustomLoading";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "react-native-google-signin";
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;

const navigationBack = require("../../../assets/images/back_icon.png");
const success_icon = require("../../../assets/images/success_icon.png");
const success_icon_size = (Dimensions.get("window").width * 214) / 1125;

var _this = null;

class SignInScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: () => null,
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			modalVisible: false,
			userInfo: null,
			gettingLoginStatus: true,
			dialogTitle: "",
			dialogDescription: "",
			isLoading: false,
			errorDialog: false,
			loadingDialogTitle: "",
			loadingDialogStatus: 0,
			loadingDialogShow: false,
		};

		_this = this;
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		GoogleSignin.configure({
			//It is mandatory to call this method before attempting to call signIn()
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
			// Repleace with your webClientId generated from Firebase console
			webClientId: "56950942698-oq1porueuk4tu22glgp9ca2iljcu5hbo.apps.googleusercontent.com",
			iosClientId: "56950942698-oq1porueuk4tu22glgp9ca2iljcu5hbo.apps.googleusercontent.com",
		});
	}

	clickCreateAccount = () => {};

	clickForgot = () => {
		this.props.navigation.navigate("ForgotPasswordScreen");
	};

	_getCurrentUserInfo = () => {
		const { gettingLoginStatus, isLoading } = this.state;

		if (isLoading) return;

		this.setState({ isLoading: true }, () => {
			GoogleSignin.signInSilently()
				.then((userInfo) => {
					this.setState({ isLoading: false });
					const apiObj = new APIGatewayFetch();
					const convertedEmail = userInfo.user.email.toLowerCase();
					apiObj
						.findOne({
							model: "Entities",
							where: {
								mail: convertedEmail,
							},
						})
						.catch((e) => {})
						.then((userInfo) => {
							if (userInfo != null && userInfo != undefined) {
								AsyncStorage.multiSet([
									["@Auth:firstName", userInfo.firstName],
									["@Auth:lastName", userInfo.lastName],
									["@Auth:username", userInfo.name],
									["@Auth:image", userInfo.image ? userInfo.image : ""],
									["@Auth:paymentMode", userInfo.paymentMode ? userInfo.paymentMode : ""],
									["@Auth:salesCountry", userInfo.salesCountry ? userInfo.salesCountry : ""],
									["@Auth:profilePic", userInfo.selfie ? userInfo.selfie : ""],
									[
										"@Auth:mangoPayWalletAmount",
										userInfo.mangoPayCredentials && userInfo.mangoPayCredentials.hasOwnProperty("wallet") ? String(userInfo.mangoPayCredentials.wallet.Balance.Amount) : "0",
									],
									["@Auth:type", userInfo.type ? userInfo.type : ""],
									["@Auth:hasManager", userInfo.manager ? userInfo.manager.toString() : ""],
									["@Auth:managerPhoto", userInfo.managerPhoto ? userInfo.managerPhoto : ""],
									["@Auth:id", userInfo.id],
									["@Auth:walletAmount", userInfo.walletAmount ? userInfo.walletAmount : "0"],
									["@Auth:cashOffice", userInfo.cashJaiyeOffice ? userInfo.cashJaiyeOffice : ""],
									["@Auth:isLoggedIn", "Yes"],
									["@Auth:user", JSON.stringify(result)],
									["@Auth:mail", userInfo.mail],
								])
									.catch((e) => {})
									.then(() => {
										this.props.navigation.navigate("MusicTabScreen");
									});
							} else {
								// this.setState({ dialogTitle: 'Error', dialogDescription: "User does not exist", errorDialog: true });
								this.props.navigation.navigate("SignupInfoProcessScreen", {
									firstName: userInfo.user.givenName,
									lastName: userInfo.user.familyName,
									email: userInfo.user.email,
									googleID: userInfo.user.id,
								});
							}
						});
				})
				.catch((error) => {
					this.setState({ isLoading: false });
					if (error.code === statusCodes.SIGN_IN_REQUIRED) {
						this._signIn();
					} else {
						// alert("Something went wrong. Unable to get user's info");
						console.log("Something went wrong. Unable to get user's info");
					}
				});
		});
	};

	_isSignedIn = () => {
		GoogleSignin.isSignedIn().then((isSignedIn) => {
			if (isSignedIn) {
				this._getCurrentUserInfo();
			} else {
				this._signIn();
			}

			this.setState({ gettingLoginStatus: false });
		});
	};

	_signIn = () => {
		//Prompts a modal to let the user sign in into your application.

		GoogleSignin.hasPlayServices({
			//Check if device has Google Play Services installed.
			//Always resolves to true on iOS.
			showPlayServicesUpdateDialog: true,
		})
			.then(() => {
				GoogleSignin.signIn()
					.then((userInfo) => {
						const apiObj = new APIGatewayFetch();
						const convertedEmail = userInfo.user.email.toLowerCase();

						apiObj
							.findOne({
								model: "Entities",
								where: {
									mail: convertedEmail,
								},
							})
							.catch((e) => {
								console.log("Error", e);
							})
							.then((userInfo) => {
								if (userInfo != null && userInfo != undefined) {
									AsyncStorage.multiSet([
										["@Auth:firstName", userInfo.firstName],
										["@Auth:lastName", userInfo.lastName],
										["@Auth:username", userInfo.name],
										["@Auth:image", userInfo.image ? userInfo.image : ""],
										["@Auth:paymentMode", userInfo.paymentMode ? userInfo.paymentMode : ""],
										["@Auth:salesCountry", userInfo.salesCountry ? userInfo.salesCountry : ""],
										["@Auth:profilePic", userInfo.selfie ? userInfo.selfie : ""],
										[
											"@Auth:mangoPayWalletAmount",
											userInfo.mangoPayCredentials && userInfo.mangoPayCredentials.hasOwnProperty("wallet") ? String(userInfo.mangoPayCredentials.wallet.Balance.Amount) : "0",
										],
										["@Auth:type", userInfo.type ? userInfo.type : ""],
										["@Auth:hasManager", userInfo.manager ? userInfo.manager.toString() : ""],
										["@Auth:managerPhoto", userInfo.managerPhoto ? userInfo.managerPhoto : ""],
										["@Auth:id", userInfo.id],
										["@Auth:walletAmount", userInfo.walletAmount ? userInfo.walletAmount : "0"],
										["@Auth:cashOffice", userInfo.cashJaiyeOffice ? userInfo.cashJaiyeOffice : ""],
										["@Auth:isLoggedIn", "Yes"],
										["@Auth:user", JSON.stringify(result)],
										["@Auth:mail", userInfo.mail],
									])
										.catch((e) => {})
										.then(() => {
											this.props.navigation.navigate("MusicTabScreen");
										});
								} else {
									// this.setState({ dialogTitle: 'Error', dialogDescription: "User does not exist", errorDialog: true });
									this.props.navigation.navigate("SignupInfoProcessScreen", {
										firstName: userInfo.user.givenName,
										lastName: userInfo.user.familyName,
										email: userInfo.user.email,
										googleID: userInfo.user.id,
									});
								}
							});
						// this.props.navigation.navigate("DashboardScreen");
					})
					.catch((error) => {
						console.log("Message", error.message);
						if (error.code === statusCodes.SIGN_IN_CANCELLED) {
							console.log("User Cancelled the Login Flow");
						} else if (error.code === statusCodes.IN_PROGRESS) {
							console.log("Signing In");
						} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
							console.log("Play Services Not Available or Outdated");
						} else {
							console.log("Some Other Error Happened");
						}
					});
			})
			.catch((error) => {
				console.log("Message", error.message);
				if (error.code === statusCodes.SIGN_IN_CANCELLED) {
					console.log("User Cancelled the Login Flow");
				} else if (error.code === statusCodes.IN_PROGRESS) {
					console.log("Signing In");
				} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
					console.log("Play Services Not Available or Outdated");
				} else {
					console.log("Some Other Error Happened");
				}
			});
	};

	signWithGoogle = () => {
		this._isSignedIn();
	};

	signInWithFacebook = () => {
		LoginManager.logInWithPermissions(["public_profile", "email"]).then(
			(result) => {
				if (result.isCancelled) {
					// alert('Login was cancelled');
				} else {
					AccessToken.getCurrentAccessToken().then((data) => {
						let accessToken = data.accessToken;

						const infoRequest = new GraphRequest(
							"/me",
							{
								accessToken: accessToken,
								parameters: {
									fields: {
										string: "email,first_name,last_name",
									},
								},
							},
							this._facebookResponseInfoCallback
						);

						// Start the graph request.
						new GraphRequestManager().addRequest(infoRequest).start();
					});
				}
			},
			(error) => {
				// alert('Login failed with error: ' + error);
			}
		);
	};

	_facebookResponseInfoCallback = (error, result) => {
		if (error) {
			console.log("Error fetching data: " + error.toString());
		} else {
			let { first_name, last_name, id, name, email } = result;

			const apiObj = new APIGatewayFetch();
			const convertedEmail = email.toLowerCase();

			apiObj
				.findOne({
					model: "Entities",
					where: {
						mail: convertedEmail,
					},
				})
				.catch((e) => {})
				.then((userInfo) => {
					if (userInfo != null && userInfo != undefined) {
						AsyncStorage.multiSet([
							["@Auth:firstName", userInfo.firstName],
							["@Auth:lastName", userInfo.lastName],
							["@Auth:username", userInfo.name],
							["@Auth:image", userInfo.image ? userInfo.image : ""],
							["@Auth:paymentMode", userInfo.paymentMode ? userInfo.paymentMode : ""],
							["@Auth:salesCountry", userInfo.salesCountry ? userInfo.salesCountry : ""],
							["@Auth:profilePic", userInfo.selfie ? userInfo.selfie : ""],
							[
								"@Auth:mangoPayWalletAmount",
								userInfo.mangoPayCredentials && userInfo.mangoPayCredentials.hasOwnProperty("wallet") ? String(userInfo.mangoPayCredentials.wallet.Balance.Amount) : "0",
							],
							["@Auth:type", userInfo.type ? userInfo.type : ""],
							["@Auth:hasManager", userInfo.manager ? userInfo.manager.toString() : ""],
							["@Auth:managerPhoto", userInfo.managerPhoto ? userInfo.managerPhoto : ""],
							["@Auth:id", userInfo.id],
							["@Auth:walletAmount", userInfo.walletAmount ? userInfo.walletAmount : "0"],
							["@Auth:cashOffice", userInfo.cashJaiyeOffice ? userInfo.cashJaiyeOffice : ""],
							["@Auth:isLoggedIn", "Yes"],
							["@Auth:user", JSON.stringify(result)],
							["@Auth:mail", userInfo.mail],
						])
							.catch((e) => {})
							.then(() => {
								this.props.navigation.navigate("MusicTabScreen");
							});
					} else {
						// this.setState({ dialogTitle: 'Error', dialogDescription: "User does not exist", errorDialog: true });

						this.props.navigation.navigate("SignupInfoProcessScreen", { firstName: first_name, lastName: last_name, email: email, facebookID: id });
					}
				});
		}
	};

	clickSignIn = () => {
		// this.props.navigation.navigate("DashboardScreen");
		let { email, password, errorDialog, isLoading } = this.state;

		const convertedEmail = email.toLowerCase();

		if (convertedEmail == "") {
			this.setState({ dialogTitle: "Error", dialogDescription: "Please enter email", errorDialog: true });

			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			this.setState({ dialogTitle: "Error", dialogDescription: "Please input correct Email", errorDialog: true });

			return;
		}

		if (password == "") {
			this.setState({ dialogTitle: "Error", dialogDescription: "Please enter password", errorDialog: true });

			return;
		}

		const awsCognito = new AWSCognito();

		this.setState(
			{
				loadingDialogShow: true,
				loadingDialogStatus: 0,
				loadingDialogTitle: "Sign In, Please wait.",
			},
			() => {
				awsCognito.signIn(convertedEmail, password).then((result) => {
					if (result) {
						if (result.challengeName === "SMS_MFA" || result.challengeName === "SOFTWARE_TOKEN_MFA" || result.code == "UserNotConfirmedException") {
							this.setState(
								{
									loadingDialogStatus: 0,
									loadingDialogTitle: "Verification required.",
								},
								() => {
									awsCognito.resendSignUp({ username: convertedEmail }).then((result) => {
										this.setState(
											{
												loadingDialogStatus: 2,
												loadingDialogTitle: "Verification code sent",
											},
											() => {
												setTimeout(() => {
													this.setState({ loadingDialogShow: false }, () => {
														this.props.navigation.navigate("SignInVerifyScreen", { email: convertedEmail });
													});
												}, 3000);
											}
										);
									});
								}
							);
							// awsCognito.resendSignUp({ username: convertedEmail }).then((result) => {
							//     this.props.navigation.navigate("SignInVerifyScreen", { email: convertedEmail });
							// });
						} else if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
							this.setState(
								{
									loadingDialogStatus: 2,
									loadingDialogTitle: "New password required.",
								},
								() => {
									setTimeout(() => {
										this.setState({ loadingDialogShow: false }, () => {
											this.props.navigation.navigate("SignInSetupPasswordScreen", { email: convertedEmail });
										});
									}, 3000);
								}
							);
						} else if (result.code) {
							this.setState(
								{
									loadingDialogStatus: 1,
									loadingDialogTitle: result.message,
								},
								() => {
									setTimeout(() => {
										this.setState({ loadingDialogShow: false });
									}, 3000);
								}
							);
						} else {
							const apiObj = new APIGatewayFetch();

							apiObj
								.findOne({
									model: "Entities",
									where: {
										mail: convertedEmail,
									},
								})
								.catch((e) => {})
								.then((userInfo) => {
									if (userInfo != null && userInfo != undefined) {
										this.setState(
											{
												loadingDialogStatus: 2,
												loadingDialogTitle: "Success",
											},
											() => {
												setTimeout(() => {
													this.setState({ loadingDialogShow: false }, () => {
														AsyncStorage.multiSet([
															["@Auth:firstName", userInfo.firstName],
															["@Auth:lastName", userInfo.lastName],
															["@Auth:username", userInfo.name],
															["@Auth:image", userInfo.image ? userInfo.image : ""],
															["@Auth:paymentMode", userInfo.paymentMode ? userInfo.paymentMode : ""],
															["@Auth:salesCountry", userInfo.salesCountry ? userInfo.salesCountry : ""],
															["@Auth:profilePic", userInfo.selfie ? userInfo.selfie : ""],
															[
																"@Auth:mangoPayWalletAmount",
																userInfo.mangoPayCredentials && userInfo.mangoPayCredentials.hasOwnProperty("wallet")
																	? String(userInfo.mangoPayCredentials.wallet.Balance.Amount)
																	: "0",
															],
															["@Auth:type", userInfo.type ? userInfo.type : ""],
															["@Auth:hasManager", userInfo.manager ? userInfo.manager.toString() : ""],
															["@Auth:managerPhoto", userInfo.managerPhoto ? userInfo.managerPhoto : ""],
															["@Auth:id", userInfo.id],
															["@Auth:walletAmount", userInfo.walletAmount ? userInfo.walletAmount : "0"],
															["@Auth:cashOffice", userInfo.cashJaiyeOffice ? userInfo.cashJaiyeOffice : ""],
															["@Auth:isLoggedIn", "Yes"],
															["@Auth:user", JSON.stringify(result)],
															["@Auth:mail", userInfo.mail],
														])
															.catch((e) => {})
															.then(() => {
																this.props.navigation.navigate("MusicTabScreen");
															});
													});
												}, 3000);
											}
										);
									} else {
										this.setState(
											{
												loadingDialogStatus: 1,
												loadingDialogTitle: "Email or password is wrong.",
											},
											() => {
												setTimeout(() => {
													this.setState({ loadingDialogShow: false });
												}, 3000);
											}
										);
									}
								});
						}
					}
				});
			}
		);
	};

	render() {
		let { email, password, modalVisible, isLoading, dialogTitle, dialogDescription, errorDialog, loadingDialogShow, loadingDialogTitle, loadingDialogStatus } = this.state;

		return (
			<View style={CommonStyle.container}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
					<ScrollView style={myStyles.scroll}>
						<View>
							<Text style={CommonStyle.commonTitle}>{"Welcome"}</Text>
						</View>
						<View style={[CommonStyle.marginTop_25]}>
							<TouchableOpacity
								style={[
									CommonStyle.commonButtonContainer,
									{
										backgroundColor: "#4646C2",
									},
								]}
								onPress={this.signInWithFacebook}
							>
								<Text style={CommonStyle.commonButtonText}>{"Sign In With Facebook"}</Text>
							</TouchableOpacity>
						</View>
						<View style={[CommonStyle.marginTop_15]}>
							<TouchableOpacity
								style={[
									CommonStyle.commonButtonContainer,
									{
										backgroundColor: "#BB4F4B",
									},
								]}
								onPress={this.signWithGoogle}
							>
								<Text style={CommonStyle.commonButtonText}>{"Sign In With Google"}</Text>
							</TouchableOpacity>
						</View>
						<View style={[CommonStyle.marginTop_45]}>
							<FloatingLabel
								labelStyle={CommonStyle.labelInput}
								inputStyle={CommonStyle.input}
								style={CommonStyle.formInput}
								value={email}
								onChangeText={(text) => {
									this.setState({ email: text });
								}}
							>
								Email address
							</FloatingLabel>
						</View>

						<View style={[CommonStyle.marginTop_15]}>
							<FloatingLabel
								labelStyle={CommonStyle.labelInput}
								inputStyle={CommonStyle.input}
								style={CommonStyle.formInput}
								value={password}
								onChangeText={(text) => {
									this.setState({ password: text });
								}}
								password
							>
								Password
							</FloatingLabel>
						</View>
						<View style={[CommonStyle.marginTop_15]}>
							<TouchableOpacity
								style={[
									CommonStyle.commonButtonContainer,
									{
										backgroundColor: "#DA4400",
									},
								]}
								onPress={this.clickSignIn}
							>
								<Text style={CommonStyle.commonButtonText}>{"Sign In With Email"}</Text>
							</TouchableOpacity>
						</View>

						<View style={[CommonStyle.marginTop_25]}>
							<TouchableOpacity style={[CommonStyle.commonButtonContainer]} onPress={this.clickForgot}>
								<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_16]}>{"Forgot Password?"}</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>

				{modalVisible && <BlurView style={myStyles.blur_container} blurType='light' blurAmount={4} reducedTransparencyFallbackColor='white' />}

				{loadingDialogShow && <CustomLoading status={loadingDialogStatus} messageText={loadingDialogTitle} />}

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

				<ModalWrapper
					visible={modalVisible}
					showOverlay={true}
					containerStyle={CommonStyle.full}
					shouldAnimateOnRequestClose={true}
					shouldCloseOnOverlayPress={true}
					isNative={true}
					style={myStyles.modalWrapper}
					overlayStyle={{ opacity: 0.8 }}
					position={"right"}
				>
					<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
						<Image
							style={{
								width: success_icon_size,
								height: success_icon_size,
								resizeMode: "contain",
							}}
							source={success_icon}
						/>
						<Text style={[CommonStyle.marginTop_15, CommonStyle.fontSize_15, { color: "#45995D" }]}>{"Success!"}</Text>
					</View>
				</ModalWrapper>
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
	},
	blur_container: {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	modalWrapper: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
	},
});

export default SignInScreen;
