import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, FlatList, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { CommonStyle, defaultGray } from "../_styles";

const whiteLogo = require("../../../assets/icons/white_logo.png");
const icon_list_check = require("../../../assets/icons/icon_waiting_payment.png");

const logoWidth = Dimensions.get("window").width * 0.75;
const statusBarHeight = getStatusBarHeight();

class WaitingPaymentScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props) {
		super(props);

		let isFrom = this.props.navigation.getParam("isFrom", "MusicTabScreen");

		this.state = {
			isFrom: isFrom,
		};
	}

	render() {
		let { isFrom } = this.state;
		return (
			<View style={[CommonStyle.full, CommonStyle.positionRelative]}>
				<View style={[CommonStyle.backgroundBlack, { paddingTop: statusBarHeight }]}>
					<View style={[CommonStyle.backgroundBlack, CommonStyle.paddingHorizontal_15, { height: 60 }]}>
						<View style={CommonStyle.flexDirectionRow}>
							<View style={CommonStyle.full}></View>

							<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
								<Image source={whiteLogo} style={CommonStyle.whiteLogo} />
							</View>

							<View style={[CommonStyle.full, CommonStyle.justifyContentEnd, CommonStyle.alignItemsEnd]}>
								<TouchableOpacity
									style={{ zIndex: 20 }}
									onPress={() => {
										this.props.navigation.navigate(isFrom);
									}}
								>
									<Text style={[CommonStyle.navigationBackText, CommonStyle.marginLeft_0]}>{"Done"}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				<View style={[CommonStyle.full, CommonStyle.paddingHorizontal_15, { backgroundColor: "#252525" }]}>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.justifyContentCenter, { width: "100%", marginTop: -20 }]}>
						<Image source={icon_list_check} style={myStyles.icon_list_check} />
					</View>
					<Text style={[CommonStyle.colorWhite, CommonStyle.fontBold, CommonStyle.fontSize_25]}>{"Waiting for you payment"}</Text>
					<Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_15, CommonStyle.fontSize_15]}>
						{"Platforms pay out between 6 weeks and 6 months after your music is streamed or downloaded."}
					</Text>
					<Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_20, CommonStyle.fontSize_15]}>{"As soon we get the payments from platforms, you will see your royalties here."}</Text>
					<Text style={[CommonStyle.colorWhite, CommonStyle.marginTop_20, CommonStyle.fontSize_15]}>{"Please see our FAQ for information about payments."}</Text>
				</View>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	icon_list_check: {
		width: logoWidth,
		height: logoWidth,
		resizeMode: "contain",
	},
});

export default WaitingPaymentScreen;
