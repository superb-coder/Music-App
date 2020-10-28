import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert, AsyncStorage } from "react-native";
import Dialog from "react-native-dialog";
import { CommonStyle, defaultGray } from "../_styles";
import AWSCognito from "../../Auth/AWSCongito";
import APIGatewayFetch from "../../APIGateway";

import LoadingOverlay from "../../widgets/LoadingOverlay";

const navigationBack = require("../../../assets/images/back_icon.png");
const nextButtonWidth = Dimensions.get("window").width / 2;

class SignupProcessConfirmScreen extends React.Component {
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
		// { firstName, lastName, phoneNumber, country, artistName: selectedArtistName, email, password }

		let firstName = this.props.navigation.getParam("firstName", "");
		let lastName = this.props.navigation.getParam("lastName", "");
		let country = this.props.navigation.getParam("country", "");
		let phoneNumber = this.props.navigation.getParam("phoneNumber", "");
		let artistName = this.props.navigation.getParam("artistName", "");
		let email = this.props.navigation.getParam("email", "");
		let password = this.props.navigation.getParam("password", "");
		let googleID = this.props.navigation.getParam("googleID", "");
		let facebookID = this.props.navigation.getParam("facebookID", "");
		let spotifyArtistID = this.props.navigation.getParam("spotifyArtistID", "");

		this.state = {
			firstName: firstName,
			lastName: lastName,
			artistName: artistName,
			email: email.toLowerCase(),
			country: country,
			phoneNumber: phoneNumber,
			password: password,
			googleID: googleID,
			facebookID: facebookID,
			spotifyArtistID: spotifyArtistID,
			isLoading: false,
			dialogTitle: "",
			dialogDescription: "",
			modalVisible: false,
			awsSignUpResponse: "",
		};
	}

	componentDidMount() {}

	clickCreateAccount = () => {
		let { firstName, lastName, artistName, email, country, phoneNumber, password, googleID, facebookID, spotifyArtistID } = this.state;

		const awsCongito = new AWSCognito();

		this.setState({ isLoading: true }, () => {
			awsCongito
				.signUp(email, password)
				.then((data) => {
					if (data && data.code) {
						this.setState({ isLoading: false, dialogTitle: "Error", dialogDescription: data.message, modalVisible: true });

						return;
					}

					const item = {
						country: country,
						mail: email.toLowerCase(),
						firstName: firstName,
						lastName: lastName,
						name: artistName,
						type: "artist",
						phone: phoneNumber,
						googleId: googleID,
						facebookId: facebookID,
						spotifyArtistId: spotifyArtistID,
					};

					const apiObj = new APIGatewayFetch();

					apiObj
						.create({
							model: "Entities",
							values: item,
						})
						.then((data) => {
							this.props.navigation.navigate("SignupVerifyScreen", { email: email.toLowerCase() });

							this.setState({ awsSignUpResponse: JSON.stringify(data), isLoading: false });
						})
						.catch((error) => {
							this.setState({ isLoading: false });
						});

					//Verify Mode
				})
				.catch((error) => {
					this.setState({ isLoading: false });
				});
		});
	};

	resendCode = () => {
		this.setState({ isLoading: true }, () => {
			if (this.state.awsSignUpResponse.length > 0) {
				const awsCognito = new AWSCognito();
				let userRes = JSON.parse(this.state.awsSignUpResponse);

				awsCognito
					.resendSignUp({ username: userRes.user.username })
					.then(() => {
						this.setState({ isLoading: false });
					})
					.catch((error) => {
						this.setState({ isLoading: false });
					});
			}
		});
	};

	render() {
		let { firstName, lastName, artistName, email, country, phoneNumber, isLoading, dialogTitle, dialogDescription, modalVisible } = this.state;
		return (
			<View style={CommonStyle.container}>
				<View style={myStyles.scroll}>
					<View>
						<Text style={CommonStyle.commonTitle}>{"Summary"}</Text>
					</View>

					<View style={myStyles.input_container}>
						<View style={CommonStyle.full}>
							<Text style={myStyles.label}>{"Name"}</Text>
						</View>
						<View style={myStyles.input_text_container}>
							<Text style={myStyles.text} numberOfLines={1}>
								{firstName} {lastName}
							</Text>
						</View>
					</View>

					<View style={myStyles.input_container}>
						<View style={CommonStyle.full}>
							<Text style={myStyles.label}>{"Artist Name"}</Text>
						</View>
						<View style={myStyles.input_text_container}>
							<Text style={myStyles.text} numberOfLines={1}>
								{artistName}
							</Text>
						</View>
					</View>

					<View style={myStyles.input_container}>
						<View style={CommonStyle.full}>
							<Text style={myStyles.label}>{"Email address"}</Text>
						</View>
						<View style={myStyles.input_text_container}>
							<Text style={myStyles.text} numberOfLines={1}>
								{email}
							</Text>
						</View>
					</View>

					<View style={myStyles.input_container}>
						<View style={CommonStyle.full}>
							<Text style={myStyles.label}>{"Country"}</Text>
						</View>
						<View style={myStyles.input_text_container}>
							<Text style={myStyles.text} numberOfLines={1}>
								{country}
							</Text>
						</View>
					</View>

					<View style={myStyles.input_container}>
						<View style={CommonStyle.full}>
							<Text style={myStyles.label}>{"Phone number"}</Text>
						</View>
						<View style={myStyles.input_text_container}>
							<Text style={myStyles.text} numberOfLines={1}>
								{phoneNumber}
							</Text>
						</View>
					</View>
				</View>

				<View style={myStyles.button_container}>
					<TouchableOpacity activeOpacity={0.8} style={[CommonStyle.commonButton, myStyles.create_account_button]} onPress={this.clickCreateAccount}>
						<Text style={CommonStyle.commonButtonText}>{"Create account"}</Text>
					</TouchableOpacity>
				</View>
				<Dialog.Container blurStyle={{ backgroundColor: "#454545" }} contentStyle={{ backgroundColor: "#454545" }} visible={modalVisible}>
					<Dialog.Title style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_18]}>{dialogTitle}</Dialog.Title>
					<Dialog.Description style={[CommonStyle.colorWhite, CommonStyle.fontSize_13, { fontWeight: "600" }]}>{dialogDescription}</Dialog.Description>
					<Dialog.Button
						label='OK'
						color={"#4696FF"}
						onPress={() => {
							// let {dialogTitle} = this.state;

							// if (dialogTitle == 'Success') {
							//     this.setState({ modalVisible: false }, () => {
							//         this.props.navigation.navigate("SignInScreen")
							//     });
							// } else {
							//     this.setState({ modalVisible: false });
							// }

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
	scroll: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 15,
		flexDirection: "column",
	},
	label: {
		fontSize: 18,
		color: "white",
	},
	text: {
		fontSize: 18,
		color: defaultGray,
		textAlign: "right",
	},
	input_container: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
	},
	input_text_container: {
		flex: 1,
		justifyContent: "flex-end",
	},
	button_container: {
		height: 100,
		justifyContent: "center",
		flexDirection: "row",
	},
	create_account_button: {
		width: nextButtonWidth,
		backgroundColor: "#DA4400",
	},
});

export default SignupProcessConfirmScreen;
