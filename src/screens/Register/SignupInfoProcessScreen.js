import React, { Component } from "react";
import { StyleSheet, View, Text, Platform, TouchableOpacity, Image, ScrollView, Alert, KeyboardAvoidingView, Keyboard } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import PhoneInput from "react-native-phone-input";
import ModalPickerImage from "../../widgets/ModalPickerImage";
import CountryPicker from "react-native-country-picker-modal";
import { CommonStyle, defaultGray } from "../_styles";

const navigationBack = require("../../../assets/images/back_icon.png");
const arrow_right = require("../../../assets/images/right_arrow.png");

class SignupInfoProcessScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		var clickRight = () => {};

		let params = navigation.state.params;

		if (params && params.clickRight) {
			clickRight = params.clickRight;
		}

		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<TouchableOpacity onPress={clickRight} style={CommonStyle.navigationBackContainer}>
					<Text style={[CommonStyle.navigationBackText, { marginRight: 8 }]}>Next</Text>
				</TouchableOpacity>
			),
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);
		let firstName = this.props.navigation.getParam("firstName", "");
		let lastName = this.props.navigation.getParam("lastName", "");
		let email = this.props.navigation.getParam("email", "");
		let googleID = this.props.navigation.getParam("googleID", "");
		let facebookID = this.props.navigation.getParam("facebookID", "");

		this.state = {
			firstName: firstName,
			lastName: lastName,
			country: "France",
			phoneNumber: "",
			phoneNumberPickerData: null,
			modalVisible: false,
			countryCode: "FR",
			confirmOverAge: false,
			email: email,
			password: "",
			confirmPassword: "",
			googleID: googleID,
			facebookID: facebookID,
			countryVisible: false,
		};
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		this.props.navigation.setParams({
			clickRight: this.clickNextButton,
		});

		this.setState({
			pickerData: this.phone.getPickerData(),
		});
	}

	clickNextButton = () => {
		let { firstName, lastName, countryCode, phoneNumber, country, confirmOverAge, email, password, confirmPassword, googleID, facebookID } = this.state;

		Keyboard.dismiss();

		if (email == "") {
			Alert.alert("Error", "Please input Email");

			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			Alert.alert("Error", "Please input correct Email");

			return;
		}

		if (firstName == "") {
			Alert.alert("Error", "Please input First name");

			return;
		}

		if (lastName == "") {
			Alert.alert("Error", "Please input Last name");

			return;
		}

		if (country == "") {
			Alert.alert("Error", "Please select Country");

			return;
		}

		if (phoneNumber == "") {
			Alert.alert("Error", "Please input Phone number");

			return;
		}

		if (password == "") {
			Alert.alert("Error", "Please input Password");

			return;
		}

		if (password.length < 8) {
			Alert.alert("Error", "Your password must be at least 8 characters.");

			return;
		}

		if (password != confirmPassword) {
			Alert.alert("Error", "Passowrd does not match");

			return;
		}

		if (!this.phone.isValidNumber(phoneNumber)) {
			Alert.alert("Error", "Please input correct Phone number");

			return;
		}

		if (!confirmOverAge) {
			Alert.alert("Error", "Please confirm that you are over the age of 18");

			return;
		}

		let cPhoneNumber = "";

		if (phoneNumber.length > 0) {
			if (phoneNumber.indexOf("+") != -1) {
				cPhoneNumber = phoneNumber;
			} else {
				cPhoneNumber = `${this.phone.getDialCode()}${phoneNumber}`;
			}
		}

		this.props.navigation.navigate("SignupArtistSelectScreen", {
			firstName,
			lastName,
			countryCode,
			phoneNumber: cPhoneNumber,
			country,
			email,
			password,
			googleID,
			facebookID,
		});
	};

	onChangePhoneNumber = (phoneNumber) => {
		this.setState({ phoneNumber: phoneNumber });
	};

	onPressFlag = () => {
		this.myCountryPicker.open();
	};

	selectCountry = (country) => {
		this.phone.selectCountry(country.iso2);
	};

	countrySelect = (item) => {
		if (item) {
			this.setState({ countryCode: item.cca2, country: item.name, countryVisible: false });
		}
	};

	confirmOverAge = () => {
		let { confirmOverAge } = this.state;

		this.setState({ confirmOverAge: !confirmOverAge });
	};

	render() {
		let { firstName, lastName, phoneNumber, countryCode, confirmOverAge, email, password, confirmPassword, countryVisible } = this.state;

		return (
			<View style={CommonStyle.container}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
					<ScrollView style={myStyles.scroll}>
						<View>
							<Text style={CommonStyle.commonTitle}>{"Hello"}</Text>
						</View>

						<View style={CommonStyle.marginTop_15}>
							<Text style={CommonStyle.smallComment}>{"We should introduce ourselves!"}</Text>
						</View>
						<View style={CommonStyle.marginTop_25}>
							<FloatingLabel
								labelStyle={CommonStyle.labelInput}
								inputStyle={CommonStyle.input}
								style={CommonStyle.formInput}
								value={email}
								onChangeText={(text) => this.setState({ email: text })}
							>
								Email
							</FloatingLabel>
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
							<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, { borderBottomColor: defaultGray, borderBottomWidth: 1 }]}>
								<View style={CommonStyle.full}>
									<CountryPicker
										ref={(ref) => {
											this.country = ref;
										}}
										withFlagButton={false}
										withFlag={true}
										countryCode={countryCode}
										withCountryNameButton={true}
										theme={{ primaryColor: "black", onBackgroundTextColor: "white", backgroundColor: "rgba(52, 52, 52, 0.8)", fontSize: 18 }}
										onSelect={this.countrySelect}
										containerButtonStyle={{
											paddingBottom: 0,
											paddingTop: 0,
											marginTop: 0,
											fontSize: 18,
										}}
										onClose={() => {
											this.setState({ countryVisible: false });
										}}
										visible={countryVisible}
									/>
								</View>
								<TouchableOpacity
									onPress={() => {
										this.setState({ countryVisible: true });
									}}
								>
									<Image source={arrow_right} style={myStyles.arrowRight} />
								</TouchableOpacity>
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
						<View style={CommonStyle.marginTop_15}>
							<FloatingLabel
								labelStyle={CommonStyle.labelInput}
								inputStyle={CommonStyle.input}
								style={CommonStyle.formInput}
								value={password}
								password={true}
								onChangeText={(text) => this.setState({ password: text })}
							>
								Password
							</FloatingLabel>
						</View>
						<View style={CommonStyle.marginTop_15}>
							<FloatingLabel
								labelStyle={CommonStyle.labelInput}
								inputStyle={CommonStyle.input}
								style={CommonStyle.formInput}
								value={confirmPassword}
								password={true}
								onChangeText={(text) => this.setState({ confirmPassword: text })}
							>
								Confirm password
							</FloatingLabel>
						</View>
						<TouchableOpacity
							style={[
								CommonStyle.marginTop_30,
								CommonStyle.flexDirectionRow,
								CommonStyle.alignItemsCenter,
								{
									paddingBottom: 20,
								},
							]}
							onPress={this.confirmOverAge}
							activeOpacity={0.95}
						>
							{confirmOverAge && <View style={myStyles.checkedIcon}></View>}
							{!confirmOverAge && <View style={myStyles.unCheckedIcon}></View>}
							<Text style={myStyles.confirmText}>I confirm that I'm over the age of 18</Text>
						</TouchableOpacity>
					</ScrollView>
				</KeyboardAvoidingView>
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
	},
	phoneNumberContainer: {
		flex: 1,
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
	arrowRight: {
		width: 12,
		height: 30,
		resizeMode: "contain",
	},
	confirmText: {
		fontSize: 13,
		color: "white",
		marginLeft: 10,
	},
	checkedIcon: {
		borderWidth: 2,
		borderColor: "#da4400",
		width: 20,
		height: 20,
		backgroundColor: "#BC3B00",
	},
	unCheckedIcon: {
		borderWidth: 2,
		borderColor: "#da4400",
		width: 20,
		height: 20,
	},
});

export default SignupInfoProcessScreen;
