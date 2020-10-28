import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, AsyncStorage } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import ModalWrapper from "react-native-modal-wrapper";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import APIGatewayFetch from "../../APIGateway";
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;
import { GoogleSignin, GoogleSigninButton, statusCodes } from "react-native-google-signin";

import { CommonStyle, defaultGray } from "../_styles";

const navigationBack = require("../../../assets/images/back_icon.png");
const success_icon = require("../../../assets/images/success_icon.png");
const success_icon_size = (Dimensions.get("window").width * 214) / 1125;

class CreateAccountScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}> Back </Text>
				</TouchableOpacity>
			),
			headerRight: () => null,
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			gettingLoginStatus: false,
			isLoading: false,
			modalVisible: false,
			dialogTitle: "",
			dialogDescription: "",
		};
	}

	UNSAFE_componentWillMount() {}

	clickSignUpWithFacebook = () => {
		let { isLoading } = this.state;

		if (isLoading) return;

		this.setState({ isLoading: true }, () => {
			LoginManager.logInWithPermissions(["public_profile", "email"]).then(
				(result) => {
					if (result.isCancelled) {
						console.log("Login was cancelled");
					} else {
						console.log("Login was successful with permissions: " + result.grantedPermissions.toString());

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
					this.setState({ isLoading: false });
				}
			);
		});
	};

	_facebookResponseInfoCallback = (error, result) => {
		this.setState({ isLoading: false });
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
				.then((data) => {
					this.setState({ isLoading: false }, () => {
						if (data != null && data != undefined) {
							this.setState({ modalVisible: true, dialogTitle: "Error", dialogDescription: "An account with the given email already exists." });
						} else {
							this.props.navigation.navigate("SignupInfoProcessScreen", { firstName: first_name, lastName: last_name, email: email, facebookID: id });
						}
					});
				})
				.catch((error) => {
					this.setState({ isLoading: false, dialogTitle: "Error", dialogDescription: "Please try later." });
				});
		}
	};

	clickSignUpWithGoogle = () => {
		this._isSignedIn();
	};

	componentDidMount() {
		GoogleSignin.configure({
			//It is mandatory to call this method before attempting to call signIn()
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
			// Repleace with your webClientId generated from Firebase console
			webClientId: "56950942698-oq1porueuk4tu22glgp9ca2iljcu5hbo.apps.googleusercontent.com",
			iosClientId: "56950942698-oq1porueuk4tu22glgp9ca2iljcu5hbo.apps.googleusercontent.com",
		});
	}

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
						.then((data) => {
							this.setState({ isLoading: false }, () => {
								if (data != null && data != undefined) {
									this.setState({ modalVisible: true, dialogTitle: "Error", dialogDescription: "An account with the given email already exists." });
								} else {
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
							this.setState({ isLoading: false, dialogTitle: "Error", dialogDescription: "Please try later." });
						});
				})
				.catch((error) => {
					this.setState({ isLoading: false });
					if (error.code === statusCodes.SIGN_IN_REQUIRED) {
						this._signIn();
					} else {
						// alert("Something went wrong. Unable to get user's info");
						this.setState({ isLoading: false });
						console.log("Something went wrong. Unable to get user's info");
					}
				});
		});
	};

	_isSignedIn = () => {
		const { gettingLoginStatus, isLoading } = this.state;

		if (isLoading) return;

		this.setState({ isLoading: true }, () => {
			GoogleSignin.isSignedIn().then((isSignedIn) => {
				if (isSignedIn) {
					this._getCurrentUserInfo();
				} else {
					this._signIn();
				}
			});
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
				GoogleSignin.signIn().then(
					(userInfo) => {
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
							.then((data) => {
								this.setState({ isLoading: false }, () => {
									if (data != null && data != undefined) {
										this.setState({ modalVisible: true, dialogTitle: "Error", dialogDescription: "An account with the given email already exists." });
									} else {
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
								this.setState({ isLoading: false, dialogTitle: "Error", dialogDescription: "Please try later." });
							});
						// this.props.navigation.navigate("SignupInfoProcessScreen", { firstName: userInfo.user.givenName, lastName: userInfo.user.familyName, email: userInfo.user.email });
					},
					(error) => {
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
					}
				);
			})
			.catch((error) => {
				console.log("Message", error.message);
				this.setState({ isLoading: false });
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

	clickSignUpWithEmail = () => {
		this.props.navigation.navigate("SignupInfoProcessScreen");
	};

	render() {
		let { isLoading, modalVisible, dialogTitle, dialogDescription } = this.state;

		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View>
						<Text style={[CommonStyle.commonTitle, { fontFamily: "ProximaNova-Bold" }]}>{"Welcome"}</Text>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<Text style={CommonStyle.smallComment}> {"Create your account using Facebook, Google, or your email"} </Text>
					</View>
					<View style={CommonStyle.marginTop_25}>
						<TouchableOpacity
							style={[
								CommonStyle.commonButtonContainer,
								{
									backgroundColor: "#4646C2",
								},
							]}
							onPress={this.clickSignUpWithFacebook}
						>
							<Text style={CommonStyle.commonButtonText}>{"Sign Up With Facebook"}</Text>
						</TouchableOpacity>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<TouchableOpacity
							style={[
								CommonStyle.commonButtonContainer,
								{
									backgroundColor: "#BB4F4B",
								},
							]}
							onPress={this.clickSignUpWithGoogle}
						>
							<Text style={CommonStyle.commonButtonText}>{"Sign Up With Google"}</Text>
						</TouchableOpacity>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<TouchableOpacity
							style={[
								CommonStyle.commonButtonContainer,
								{
									backgroundColor: "#DA4400",
								},
							]}
							onPress={this.clickSignUpWithEmail}
						>
							<Text style={CommonStyle.commonButtonText}>{"Sign Up With Email"}</Text>
						</TouchableOpacity>
					</View>
					<View style={CommonStyle.marginTop_25}>
						<Text style={[CommonStyle.smallComment]}>{"By creating an account, I agree to the Terms & Conditions, Privacy Policy, and Distribution Agreement."} </Text>
					</View>
				</ScrollView>
				{isLoading && <LoadingOverlay loading={isLoading} />}
				<Dialog.Container blurStyle={{ backgroundColor: "#454545" }} contentStyle={{ backgroundColor: "#454545" }} visible={modalVisible}>
					<Dialog.Title style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{dialogTitle}</Dialog.Title>
					<Dialog.Description style={[CommonStyle.colorWhite, CommonStyle.fontSize_13, { fontWeight: "600" }]}>{dialogDescription}</Dialog.Description>
					<Dialog.Button
						label='OK'
						color={"#4696FF"}
						onPress={() => {
							this.setState({ modalVisible: false });
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
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
	},
});

export default CreateAccountScreen;
