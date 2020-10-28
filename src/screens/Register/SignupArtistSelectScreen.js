import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions, Button, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import FloatingLabel from "react-native-floating-labels";
import UserAvatar from "react-native-user-avatar";
import SpotifyApi from "../../SpotifyAPI/SpotifyApi";

import { CommonStyle, defaultGray } from "../_styles";

const navigationBack = require("../../../assets/images/back_icon.png");
const avatar1 = require("../../../assets/images/avatar1.png");
const avatar2 = require("../../../assets/images/avatar2.png");
const avatar3 = require("../../../assets/images/avatar3.png");

var spotifyWebApi = null;
class SignupArtistSelectScreen extends React.Component {
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
		let country = this.props.navigation.getParam("country", "");
		let email = this.props.navigation.getParam("email", "");
		let password = this.props.navigation.getParam("password", "");
		let googleID = this.props.navigation.getParam("googleID", "");
		let facebookID = this.props.navigation.getParam("facebookID", "");
		let phoneNumber = this.props.navigation.state.params.phoneNumber;

		this.state = {
			artistName: "",
			artistID: "",
			firstName: firstName,
			lastName: lastName,
			country: country,
			phoneNumber: phoneNumber,
			haveMusicLive: false,
			artistList: [],
			email: email,
			password: password,
			googleID: googleID,
			facebookID: facebookID,
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			clickRight: this.clickNextButton,
		});
	}

	clickNextButton = () => {
		let { firstName, lastName, phoneNumber, country, artistName, email, password, haveMusicLive, artistList, facebookID, googleID } = this.state;

		let selectedArtistName = "";
		let selectedArtistID = "";

		if (artistName == "") {
			Alert.alert("Error", "Please input Artist name");

			return;
		}

		if (!haveMusicLive) {
			selectedArtistName = artistName;
		} else {
			if (artistList.length > 0) {
				for (let i = 0; i < artistList.length; i++) {
					if (artistList[i].selected == true) {
						selectedArtistName = artistList[i].name;
						selectedArtistID = artistList[i].id;
						break;
					}
				}

				if (selectedArtistName == "") {
					Alert.alert("Error", "Please select Artist");

					return;
				}
			} else {
				Alert.alert("Error", "Please select Artist");

				return;
			}
		}

		this.props.navigation.navigate("SignupProcessConfirmScreen", {
			firstName,
			lastName,
			phoneNumber,
			country,
			artistName: selectedArtistName,
			email,
			password,
			facebookID,
			googleID,
			spotifyArtistID: selectedArtistID,
		});
	};

	clickItem = (selectedIndex) => {
		let { artistList } = this.state;

		let clonedArtistList = artistList.slice();

		clonedArtistList = clonedArtistList.map((item, index) => {
			item.selected = false;

			if (index == selectedIndex) {
				item.selected = true;
			}

			return item;
		});

		this.setState({ artistList: clonedArtistList });
	};

	formatCash = (n) => {
		let result = "";
		if (n < 1e3) {
			result += n;
		}

		if (n >= 1e3 && n < 1e6) {
			result += +(n / 1e3).toFixed(1) + "K";
		}

		if (n >= 1e6 && n < 1e9) {
			result += +(n / 1e6).toFixed(1) + "M";
		}

		if (n >= 1e9 && n < 1e12) {
			result += +(n / 1e9).toFixed(1) + "B";
		}

		if (n >= 1e12) {
			result += +(n / 1e12).toFixed(1) + "T";
		}

		result = result.replace(".", ",");

		return result;
	};

	changeArtistName = (text) => {
		this.setState({ artistName: text }, () => {
			SpotifyApi.getSimilarArtist(text).then((artists) => {
				let artistList = [];
				if (Array.isArray(artists)) {
					for (let i = 0; i < artists.length; i++) {
						let artist = {};

						artist["name"] = artists[i].name;
						artist["selected"] = false;
						artist["id"] = artists[i].id;
						artist["followers"] = artists[i].followers.total;
						if (Array.isArray(artists[i].images) && artists[i].images.length > 0) {
							artist["avatar"] = artists[i].images[0].url;
						}

						artistList.push(artist);
					}

					this.setState({ artistList: artistList });
				}
			});
		});
	};

	render() {
		let { artistName, haveMusicLive, artistList } = this.state;

		return (
			<View style={CommonStyle.container}>
				<ScrollView style={myStyles.scroll}>
					<View>
						<Text style={CommonStyle.commonTitle}>{"Artist"}</Text>
					</View>

					<View style={[CommonStyle.marginTop_15]}>
						<Text style={CommonStyle.smallComment}>{"What artist name do you use for your music?"}</Text>
					</View>

					<View style={[CommonStyle.marginTop_25]}>
						<FloatingLabel
							labelStyle={CommonStyle.labelInput}
							inputStyle={CommonStyle.input}
							style={CommonStyle.formInput}
							value={artistName}
							onChangeText={(text) => this.changeArtistName(text)}
						>
							Artist name
						</FloatingLabel>
						<Text style={[CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>{"There is one artist on Spotify with a similar name."}</Text>
					</View>
					<View style={[CommonStyle.marginTop_25]}>
						<Text style={[CommonStyle.fontSize_14, CommonStyle.colorDefaultGray]}>{"Does this artist have music live on Spotify?"}</Text>

						<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.marginTop_20]}>
							<TouchableOpacity
								activeOpacity={0.95}
								onPress={() => {
									this.setState({ haveMusicLive: true });
								}}
								style={myStyles.checkBoxIconContainer}
							>
								{haveMusicLive && <View style={CommonStyle.checkedIcon}></View>}
								{!haveMusicLive && <View style={CommonStyle.unCheckedIcon}></View>}
								<Text style={CommonStyle.checkBoxText}>Yes</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.95}
								onPress={() => {
									this.setState({ haveMusicLive: false });
								}}
								style={myStyles.checkBoxIconContainer}
							>
								{!haveMusicLive && <View style={CommonStyle.checkedIcon}></View>}
								{haveMusicLive && <View style={CommonStyle.unCheckedIcon}></View>}
								<Text style={CommonStyle.checkBoxText}>No</Text>
							</TouchableOpacity>
						</View>
						{haveMusicLive && (
							<View style={[CommonStyle.marginTop_20]}>
								<FlatList
									data={artistList}
									renderItem={({ item, index }) => (
										<TouchableOpacity
											activeOpacity={0.95}
											style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, CommonStyle.marginTop_25]}
											onPress={() => {
												this.clickItem(index);
											}}
											key={index.toString()}
										>
											{item.avatar && <UserAvatar size={60} name={item.name} src={item.avatar} />}

											{!item.avatar && <UserAvatar size={60} name={item.name} />}

											<Image source={item.avatar} />
											<View style={[CommonStyle.full, CommonStyle.marginLeft_15]}>
												<Text style={[CommonStyle.defaultFontSize, CommonStyle.colorWhite]}>{item.name}</Text>
												<Text style={[CommonStyle.marginTop_10, CommonStyle.fontSize_13, CommonStyle.colorDefaultGray]}>
													{this.formatCash(item.followers)} {"followers"}
												</Text>
											</View>
											{item.selected && <View style={CommonStyle.checkedIcon}></View>}

											{!item.selected && <View style={CommonStyle.unCheckedIcon}></View>}
										</TouchableOpacity>
									)}
									keyExtractor={(item) => item.id}
								/>
								<View style={{ height: 50 }}></View>
							</View>
						)}
					</View>
				</ScrollView>
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
	checkBoxIconContainer: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
	},
	avatar: {
		width: 60,
		height: 60,
		resizeMode: "cover",
	},
});

export default SignupArtistSelectScreen;
