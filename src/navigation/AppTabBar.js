import React from "react";
import { View, Image, StyleSheet, Text, AsyncStorage, TouchableOpacity } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { S3_CREDENTIALS, S3URL } from "../Constants";
import S3FileUploader from "../widgets/FileUploader/S3";
const tabIcon1 = require("../../assets/images/musicTabIcon.png");
const tabIcon2 = require("../../assets/images/streamTabIcon.png");
const tabIcon3 = require("../../assets/images/artistTabIcon.png");

class AppTabBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userName: "",
			selfie: null,
		};
	}

	componentDidMount() {
		this._retrieveData();
	}

	_retrieveData = () => {
		AsyncStorage.multiGet(["@Auth:firstName", "@Auth:lastName", "@Auth:profilePic"], (err, values) => {
			const username = values[0][1] + " " + values[1][1];

			this.setState({
				userName: username,
				selfie: values[2][1],
			});
		});
	};

	render() {
		const { navigation, appState } = this.props;
		// const routes = navigation.state.routes;
		const { index, routes } = navigation.state;
		let { userName, selfie } = this.state;

		return (
			<View style={myStyles.container}>
				{routes.map((route, idx) => {
					const isFocus = index == idx;

					if (route.routeName == "Music" || route.routeName == "Streams") {
						return (
							<TouchableOpacity
								style={{ flexDirection: "column", alignItems: "center", paddingTop: 10 }}
								onPress={() => {
									if (route.routeName == "Music") {
										navigation.navigate("MusicTabScreen");
									} else {
										navigation.navigate("StreamTabScreen");
									}
								}}
							>
								<Image source={route.routeName == "Music" ? tabIcon1 : tabIcon2} style={[{ width: 25, height: 25 }, isFocus && { tintColor: "#da4400" }]} />
								<Text style={{ color: "white" }}>{route.routeName}</Text>
							</TouchableOpacity>
						);
					} else {
						return (
							<TouchableOpacity
								style={{ flexDirection: "column", alignItems: "center", paddingTop: 10 }}
								onPress={() => {
									navigation.navigate("Artist");
								}}
							>
								{userName != "" && (selfie == "" || selfie == undefined || selfie == null) && <UserAvatar name={userName} size={25} />}

								{userName == "" && (selfie == "" || selfie == undefined || selfie == null) && <UserAvatar name={""} size={25} />}

								{userName == "" && !!selfie && <UserAvatar src={`${S3URL}${selfie}`} size={25} />}

								{userName != "" && !!selfie && <UserAvatar name={userName} size={25} src={`${S3URL}${selfie}`} />}
								<Text style={{ color: "white" }}>{route.routeName}</Text>
							</TouchableOpacity>
						);
					}
				})}
			</View>
		);
	}

	navigationHandler = (name) => {
		const { navigation } = this.props;
		navigation.navigate(name);
	};
}

export const myStyles = StyleSheet.create({
	container: {
		height: 85,
		backgroundColor: "black",
		flexDirection: "row",
		justifyContent: "space-around",
	},
});

export default AppTabBar;
