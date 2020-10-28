import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, Button, TouchableOpacity, Image } from "react-native";
import { CommonStyle } from "./_styles";

const backgroundImg = require("../../assets/images/home_background.png");
const homeLogoImg = require("../../assets/images/home_logo.png");
const backgroundHeight = Dimensions.get("window").height * 0.78;
const getButtonWidth = Dimensions.get("window").width * 0.5;
const logoImageWidth = Dimensions.get("window").width * 0.56177;
// import Auth from '../auth';
class HomeScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	UNSAFE_componentWillMount() {}

	clickCreateAccount = () => {
		this.props.navigation.navigate("CreateAccountScreen");
	};

	clickSignIn = () => {
		this.props.navigation.navigate("SignInScreen");
	};

	render() {
		return (
			<View style={myStyles.container}>
				<ImageBackground source={backgroundImg} style={myStyles.backgroundImage} resizeMode={"stretch"}>
					<Image source={homeLogoImg} style={{ width: logoImageWidth, resizeMode: "contain" }} />
				</ImageBackground>
				<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter]}>
					<TouchableOpacity
						activeOpacity={0.6}
						style={myStyles.createAccountButton}
						onPress={() => {
							this.clickCreateAccount();
						}}
					>
						<Text style={{ color: "white", fontFamily: "ProximaNova-Bold" }}>CREATE ACCOUNT</Text>
					</TouchableOpacity>
				</View>

				<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter, CommonStyle.marginTop_20]}>
					<TouchableOpacity
						activeOpacity={0.6}
						style={myStyles.signButton}
						onPress={() => {
							this.clickSignIn();
						}}
					>
						<Text style={[CommonStyle.colorDefault, { fontFamily: "ProximaNova-Bold" }]}>SIGN IN</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	container: {
		paddingBottom: 30,
		flex: 1,
	},
	backgroundImage: {
		height: backgroundHeight,
		width: "100%",
		resizeMode: "cover",
		flexDirection: "row",
		justifyContent: "center",
	},
	slide1: {
		flex: 1,
	},
	descriptionContainer: {
		flex: 1,
		paddingLeft: 25,
		justifyContent: "flex-end",
	},
	descriptionText: {
		color: "white",
		fontSize: 38,
		lineHeight: 41.7,
		fontWeight: "900",
		paddingBottom: 45,
	},
	createAccountButton: {
		width: getButtonWidth,
		backgroundColor: "#da4400",
		height: 50,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		marginTop: -25,
	},
	signButton: {
		width: getButtonWidth - 6,
		height: 50,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		borderWidth: 3,
		borderColor: "#da4400",
		backgroundColor: "white",
	},
});

export default HomeScreen;
