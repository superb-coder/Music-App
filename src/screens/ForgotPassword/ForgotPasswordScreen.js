import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import Dialog from "react-native-dialog";

import AWSCognito from "../../Auth/AWSCongito";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import { CommonStyle } from "../_styles";

const navigationBack = require("../../../assets/images/back_icon.png");
const nextButtonWidth = Dimensions.get("window").width / 2;

class ForgotPasswordScreen extends React.Component {
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
			modalVisible: false,
			isLoading: false,
			dialogTitle: "",
			dialogDescription: "",
		};
	}

	UNSAFE_componentWillMount() {}

	clickNextButton = () => {
		let { email } = this.state;

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			this.setState({ dialogTitle: "Error", dialogDescription: "Please input correct Email", modalVisible: true });

			return;
		}

		const awsCognito = new AWSCognito();

		this.setState({ isLoading: true }, () => {
			awsCognito
				.forgotPassword({
					username: email,
				})
				.then((resSignIn) => {
					this.setState({ isLoading: false });

					if (resSignIn && resSignIn.code) {
						// if (resSignIn.code == "UserNotFoundException") {
						//     awsCognito.resendSignUp({username: email}).then((result) => {
						//         console.log(result);
						//     })
						// } else {
						//     this.setState({dialogTitle: 'Error', dialogDescription: resSignIn.message, modalVisible: true});
						// }
						this.setState({ dialogTitle: "Error", dialogDescription: resSignIn.message, modalVisible: true });
					} else {
						this.setState({
							dialogTitle: "Instruction sent",
							dialogDescription: "Please check your email. Follow the instructions in the email we sent you to select a new password.",
							modalVisible: true,
						});
					}
				});
		});

		// this.setState({ modalVisible: true })
	};

	render() {
		let { email, modalVisible, isLoading, dialogTitle, dialogDescription } = this.state;

		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View>
						<Text style={CommonStyle.commonTitle}>
							{"Forgot your"}
							{"\n"}
							{"password?"}
						</Text>
					</View>

					<View style={CommonStyle.marginTop_15}>
						<Text style={CommonStyle.smallComment}>{"Enter your email address below and we will send instructions on how to create a new one"}</Text>
					</View>
					<View style={CommonStyle.marginTop_25}>
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

					<View style={[CommonStyle.marginTop_25, CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
						<TouchableOpacity style={[CommonStyle.commonButtonContainer, myStyles.nextContainer]} onPress={this.clickNextButton}>
							<Text style={[CommonStyle.colorWhite, CommonStyle.fontSize_19]}>{"Next"}</Text>
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
							let { dialogTitle, email } = this.state;

							if (dialogTitle == "Instruction sent") {
								this.setState({ modalVisible: false }, () => {
									this.props.navigation.navigate("ForgotPasswordConfirmScreen", { email: email });
								});
							} else {
								this.setState({ modalVisible: false });
							}
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

export default ForgotPasswordScreen;
