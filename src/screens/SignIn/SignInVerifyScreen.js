import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, Alert, AsyncStorage } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";

import AWSCognito from "../../Auth/AWSCongito";
import APIGatewayFetch from "../../APIGateway";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import { CommonStyle } from "../_styles";

const navigationBack = require("../../../assets/images/back_icon.png");
const nextButtonWidth = Dimensions.get("window").width / 2;

class SignInVerifyScreen extends React.Component {
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

		let email = this.props.navigation.getParam("email", "");

		this.state = {
			email: email,
			code: "",
			modalVisible: false,
			isLoading: false,
			dialogTitle: "",
			dialogDescription: "",
		};
	}

	UNSAFE_componentWillMount() {}

	clickSubmit = () => {
		let { email, code } = this.state;

		if (code == "") {
			this.setState({ dialogTitle: "Error", dialogDescription: "Please enter code(check your email)", modalVisible: true });

			return;
		}

		const awsCognito = new AWSCognito();

		this.setState({ isLoading: true }, () => {
			awsCognito.confirmSignUp(email, code).then((resSignIn) => {
				this.setState({ isLoading: false });

				if (resSignIn && resSignIn.code) {
					this.setState({ dialogTitle: "Error", dialogDescription: resSignIn.message, modalVisible: true });
				} else {
					const apiObj = new APIGatewayFetch();

					apiObj
						.findOne({
							model: "Entities",
							where: {
								mail: email,
							},
						})
						.catch((e) => {})
						.then((result) => {
							AsyncStorage.multiSet([
								["@Auth:firstName", result.firstName],
								["@Auth:lastName", result.lastName],
								["@Auth:username", result.name],
								["@Auth:image", result.image ? result.image : ""],
								["@Auth:paymentMode", result.paymentMode ? result.paymentMode : ""],
								["@Auth:salesCountry", result.salesCountry ? result.salesCountry : ""],
								["@Auth:profilePic", result.selfie ? result.selfie : ""],
								[
									"@Auth:mangoPayWalletAmount",
									result.mangoPayCredentials && result.mangoPayCredentials.hasOwnProperty("wallet") ? String(result.mangoPayCredentials.wallet.Balance.Amount) : "0",
								],
								["@Auth:type", result.type ? result.type : ""],
								["@Auth:hasManager", result.manager ? result.manager.toString() : ""],
								["@Auth:managerPhoto", result.managerPhoto ? result.managerPhoto : ""],
								["@Auth:id", result.id],
								["@Auth:walletAmount", result.walletAmount ? result.walletAmount : "0"],
								["@Auth:cashOffice", result.cashJaiyeOffice ? result.cashJaiyeOffice : ""],
								["@Auth:isLoggedIn", "Yes"],
								["@Auth:user", JSON.stringify(result)],
								["@Auth:mail", result.mail],
							])
								.catch((e) => {})
								.then(() => {
									this.props.navigation.navigate("MusicTabScreen");
								});
						});
				}
			});
		});

		// this.setState({ modalVisible: true })
	};

	resend = () => {
		let { email } = this.state;

		const awsCognito = new AWSCognito();

		this.setState({ isLoading: true }, () => {
			awsCognito
				.resendSignUp({
					username: email,
				})
				.then((resSignIn) => {
					this.setState({ isLoading: false });
				});
		});
	};

	render() {
		let { email, modalVisible, isLoading, code, dialogTitle, dialogDescription } = this.state;

		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View>
						<Text style={CommonStyle.commonTitle}>{"Confirm Sign In"}</Text>
					</View>
					<View style={CommonStyle.marginTop_15}>
						<Text style={CommonStyle.smallComment}>{"Please confirm your account"}</Text>
					</View>
					<View style={CommonStyle.marginTop_25}>
						<FloatingLabel
							labelStyle={CommonStyle.labelInput}
							inputStyle={CommonStyle.input}
							style={CommonStyle.formInput}
							value={code}
							onChangeText={(text) => {
								this.setState({ code: text });
							}}
						>
							Code
						</FloatingLabel>
					</View>

					<View style={[CommonStyle.marginTop_25, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
						<TouchableOpacity style={[CommonStyle.commonButtonContainer, myStyles.nextContainer]} onPress={this.clickSubmit}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_19]}>{"Verify"}</Text>
						</TouchableOpacity>
					</View>

					<View style={[CommonStyle.marginTop_15, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
						<TouchableOpacity style={[CommonStyle.commonButtonContainer, myStyles.nextContainer]} onPress={this.resend}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_19]}>{"Resend Code?"}</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				{modalVisible && <BlurView style={myStyles.blueView} blurType='dark' blurAmount={7} reducedTransparencyFallbackColor='#252525' />}
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
				{isLoading && <LoadingOverlay loading={isLoading} />}
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
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
	},
	nextContainer: {
		backgroundColor: "#da4400",
		width: nextButtonWidth,
		height: 40,
		borderRadius: 40,
	},
	blueView: {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
});

export default SignInVerifyScreen;
