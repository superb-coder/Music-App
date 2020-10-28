import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground, Dimensions, FlatList, TouchableOpacity, Image, ScrollView, AsyncStorage } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import DropdownMenu from "../../widgets/DropDown";
import RBSheet from "react-native-raw-bottom-sheet";
import APIGatewayFetch from "../../APIGateway";
import { CommonStyle, defaultGray } from "../_styles";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import _ from "lodash";
const whiteLogo = require("../../../assets/icons/white_logo.png");
const icon_balance = require("../../../assets/icons/icon_balance.png");
const icon_filter = require("../../../assets/icons/icon_filter.png");
const icon_list_check = require("../../../assets/icons/icon_list_check.png");
const halfOfWindows = Dimensions.get("window").width / 2;
const statusBarHeight = getStatusBarHeight();
const DROP_MENU = [["Platforms", "Songs", "Territory", "Statement Period"]];

class PaymentScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props) {
		super(props);

		let isFrom = this.props.navigation.getParam("isFrom", "MusicTabScreen");
		let isProcessing = this.props.navigation.getParam("isProcessing", false);
		this.state = {
			selectedOption: "Platforms",
			selectedIndex: 0,
			menuFilterList: [
				{
					icon: "photo-camera",
					label: "All-time",
				},
				{
					icon: "photo",
					label: "May 2020",
				},
				{
					icon: "brush",
					label: "April 2020",
				},
				{
					icon: "mic",
					label: "March 2020",
				},
				{
					icon: "mic1",
					label: "February 2020",
				},
				{
					icon: "mic2",
					label: "January 2020",
				},
			],
			selectedFilter: "",
			isFrom: isFrom,
			groupedPayments: [],
			balance: "0.00",
			isProcessing: isProcessing,
		};
	}

	componentDidMount() {
		const apiObj = new APIGatewayFetch();

		this.getBalance();

		this.getPayments();
	}

	getBalance = () => {
		const apiObj = new APIGatewayFetch();
		const id = "ety_NB9m_QVW0";

		AsyncStorage.getItem("@Auth:id").then((authId) => {
			apiObj
				.findUser({
					model: "Entities",
					where: {
						id: id,
					},
				})
				.then((user) => {
					// Number(this.paymentMode === 'Paypal' ? this.lastRoyaltiesBalance : this.paymentMode === 'MangoPay' ? this.user['walletAmount'] : this.paymentMode === 'Jaiye' ? this.walletAmount : 0).toFixed(2);

					if (user) {
						if (user.paymentMode == "Paypal") {
							apiObj
								.findAll(
									{
										model: "cashbalances",
										orderBy: "number",
										limit: 1,
										orderWay: "desc",
										where: {
											entityId: id,
										},
									},
									true
								)
								.then((data) => {
									if (Array.isArray(data) && data.length > 0) {
										this.setState({ balance: Number(data[0].royaltiesBalance).toFixed(2) });
									}
								});
						} else if (user.paymentMode == "MangoPay") {
							if (
								user["mangoPayCredentials"] &&
								user["mangoPayCredentials"]["wallet"] &&
								user["mangoPayCredentials"]["wallet"]["Balance"] &&
								user["mangoPayCredentials"]["wallet"]["Balance"]["Amount"]
							) {
								this.setState({ balance: Number(user["mangoPayCredentials"]["wallet"]["Balance"]["Amount"]).toFixed(2) });
							} else {
								this.setState({ balance: "0.00" });
							}
						} else if (user.paymentMode == "Jaiye") {
							this.setState({ balance: Number(user.walletAmount).toFixed(2) });
						} else {
							this.setState({ balance: "0.00" });
						}
					} else {
						this.setState({ balance: "0.00" });
					}
				});
		});
	};

	clickPayment = () => {
		this.props.navigation.navigate("PaymentProgressingScreen");
	};

	changeMenu = (selection, row) => {
		this.setState({ selectedOption: DROP_MENU[selection][row], selectedIndex: row }, () => {
			this.getPayments();
		});
	};

	getPayments = () => {
		const apiObj = new APIGatewayFetch();

		this.setState({ isLoading: true }, () => {
			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findPayments({
						model: "findAllPaymentsStats",
						artistId: artistId,
						where: {
							entityId: authId,
						},
						groupBy: this.state.selectedOption,
					})
					.then((groupedPayments) => {
						// "#Atmstp ": {"donwloads": 0, "name": "#Atmstp ", "revenues": 0.000049200544, "streams": 2}
						let wholeArray = Object.keys(groupedPayments).map((key) => groupedPayments[key]);
						let groupedData = _.filter(_.map(_.orderBy(wholeArray, ["streams"], ["desc"])), (r) => r.name != null);
						this.setState({ groupedPayments: groupedData, isLoading: false });
					});
			});
		});
	};

	render() {
		let { selectedOption, selectedIndex, menuFilterList, selectedFilter, isFrom, groupedPayments, isLoading, balance, isProcessing } = this.state;
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
									onPress={() => {
										this.props.navigation.navigate(isFrom);
									}}
								>
									<Text style={[CommonStyle.navigationBackText, CommonStyle.marginLeft_0, { fontFamily: "ProximaNova-Semibold" }]}>Done</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				<View style={myStyles.top_balance_area}>
					<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
						<Image source={icon_balance} style={myStyles.top_balance_logo} />
						<Text style={myStyles.top_balance_text}>{"BALANCE"}</Text>
					</View>
					<View style={myStyles.balance_value_container}>
						<Text style={myStyles.balance_value}>{balance} €</Text>

						<TouchableOpacity style={isProcessing == true ? myStyles.progressing_payment_button : myStyles.payment_button} activeOpacity={0.8}>
							<Text style={myStyles.payment_button_text}>{isProcessing == true ? "Payment in progress" : "Payment"}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[CommonStyle.positionRelative, { height: 40, zIndex: 100 }]}>
					<View style={[myStyles.list_full_container, CommonStyle.positionAbsolute, { width: "100%", zIndex: 10 }]}>
						<View style={[CommonStyle.backgroundBlack, CommonStyle.flexDirectionRow, { height: 40, width: "100%" }]}>
							<View style={{ width: 160 }}>
								<DropdownMenu
									bgColor={"#000000"}
									tintColor={"#000000"}
									activityTintColor={"green"}
									titleStyle={CommonStyle.colorWhite}
									handler={(selection, row) => {
										this.changeMenu(selection, row);
									}}
									data={DROP_MENU}
								></DropdownMenu>
							</View>
							<TouchableOpacity
								style={[
									CommonStyle.flexDirectionRow,
									CommonStyle.alignItemsCenter,
									CommonStyle.flexDirectionRow,
									CommonStyle.full,
									CommonStyle.justifyContentEnd,
									{
										marginRight: 15,
									},
								]}
								onPress={() => {
									this.filterMenu.open();
								}}
							>
								<Image source={icon_filter} style={{ width: 20, height: 20, resizeMode: "contain" }} />
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={[CommonStyle.flexDirectionRow, CommonStyle.marginTop_40, { padding: 15, zIndex: 1 }]}>
					<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
						<Text style={[CommonStyle.colorDefaultGray, CommonStyle.fontSize_14]} numberOfLines={1}>
							{selectedOption != "Statement Period" ? "PLATFORMS" : "PERIOD"}
						</Text>
					</View>
					<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
						<Text style={[CommonStyle.colorDefaultGray, CommonStyle.fontSize_14]} numberOfLines={1}>
							{"STREAMS"}
						</Text>
					</View>
					<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
						<Text style={[CommonStyle.colorDefaultGray, CommonStyle.fontSize_14]} numberOfLines={1}>
							{"DOWNLOADS"}
						</Text>
					</View>
					<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
						<Text style={[CommonStyle.colorDefaultGray, CommonStyle.fontSize_14]} numberOfLines={1}>
							{"REVENUE"}
						</Text>
					</View>
				</View>
				<ScrollView style={[CommonStyle.full, { zIndex: 5 }]}>
					{groupedPayments.map((item) => {
						return (
							<View
								style={[
									CommonStyle.flexDirectionRow,
									{
										paddingHorizontal: 20,
										paddingVertical: 15,
									},
								]}
							>
								<View style={[CommonStyle.full, CommonStyle.justifyContentStart, CommonStyle.alignItemsCenter]}>
									<Text numberOfLines={1}>{item.name}</Text>
								</View>
								<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
									<Text numberOfLines={1}>{item.streams}</Text>
								</View>
								<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
									<Text numberOfLines={1}>{item.donwloads}</Text>
								</View>
								<View style={[CommonStyle.full, CommonStyle.justifyContentCenter, CommonStyle.alignItemsCenter]}>
									<Text numberOfLines={1}>{item.revenues.toFixed(2)}€</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
				{isLoading && <LoadingOverlay loading={isLoading} />}
				<RBSheet
					ref={(ref) => {
						this.filterMenu = ref;
					}}
					height={330}
				>
					<View style={myStyles.listContainer}>
						<Text style={myStyles.listTitle}>Choose time period...</Text>
						{menuFilterList.map((list) => (
							<TouchableOpacity
								key={list.icon}
								style={myStyles.listButton}
								onPress={() => {
									this.setState({ selectedFilter: list.label }, () => {
										this.filterMenu.close();
									});
								}}
							>
								{list.label == selectedFilter && <Image source={icon_list_check} style={myStyles.listCheckImage} />}

								{list.label != selectedFilter && <View style={myStyles.listEmptyImage} />}

								{list.label == selectedFilter && <Text style={[myStyles.listLabel, CommonStyle.colorDefault]}>{list.label}</Text>}

								{list.label != selectedFilter && <Text style={myStyles.listLabel}>{list.label}</Text>}
							</TouchableOpacity>
						))}
					</View>
				</RBSheet>
			</View>
		);
	}
}

export const myStyles = StyleSheet.create({
	top_balance_text: {
		color: "white",
		fontSize: 14,
		marginLeft: 13,
		fontWeight: "600",
	},
	top_balance_logo: {
		width: 20,
		height: 20,
		resizeMode: "contain",
	},
	balance_value_container: {
		paddingVertical: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	top_balance_area: {
		padding: 15,
		backgroundColor: "#161616",
		position: "relative",
	},
	balance_value: {
		color: "white",
		fontSize: 24,
	},
	payment_button: {
		height: 40,
		backgroundColor: "#DA4400",
		width: halfOfWindows,
		marginTop: 25,
		borderRadius: 40,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	progressing_payment_button: {
		height: 40,
		backgroundColor: "#56CB82",
		width: halfOfWindows,
		marginTop: 25,
		borderRadius: 40,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	payment_button_text: {
		color: "white",
		fontSize: 15,
		fontWeight: "bold",
	},
	list_full_container: {
		paddingHorizontal: 15,
		paddingTop: 35,
	},
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
	textTitle: {
		fontSize: 20,
		marginTop: 120,
	},
	buttonContainer: {
		alignItems: "center",
		marginTop: 50,
	},
	button: {
		width: 150,
		backgroundColor: "#4EB151",
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 3,
		margin: 10,
	},
	buttonTitle: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	listContainer: {
		flex: 1,
		padding: 25,
	},
	listTitle: {
		fontSize: 16,
		marginBottom: 20,
		color: "black",
	},
	listButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
	},
	listIcon: {
		fontSize: 26,
		color: "#666",
		width: 60,
	},
	listLabel: {
		fontSize: 16,
		paddingLeft: 15,
	},
	gridContainer: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 10,
		marginBottom: 20,
	},
	gridButtonContainer: {
		flexBasis: "25%",
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	gridButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	gridIcon: {
		fontSize: 30,
		color: "white",
	},
	gridLabel: {
		fontSize: 14,
		paddingTop: 10,
		color: "#333",
	},
	dateHeaderContainer: {
		height: 45,
		borderBottomWidth: 1,
		borderColor: "#ccc",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	dateHeaderButton: {
		height: "100%",
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	dateHeaderButtonCancel: {
		fontSize: 18,
		color: "#666",
		fontWeight: "400",
	},
	dateHeaderButtonDone: {
		fontSize: 18,
		color: "#006BFF",
		fontWeight: "500",
	},
	inputContainer: {
		borderTopWidth: 1.5,
		borderTopColor: "#ccc",
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	inputIcon: {
		fontSize: 24,
		color: "#666",
		marginHorizontal: 5,
	},
	inputIconSend: {
		color: "#006BFF",
	},
	input: {
		flex: 1,
		height: 36,
		borderRadius: 36,
		paddingHorizontal: 10,
		backgroundColor: "#f1f1f1",
		marginHorizontal: 10,
	},
	messageContainer: {
		flex: 1,
		padding: 25,
	},
	messageTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#222",
	},
	message: {
		fontSize: 17,
		lineHeight: 24,
		marginVertical: 20,
	},
	messageButtonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	messageButton: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderWidth: 2,
		borderRadius: 2,
		borderColor: "#3385ff",
		marginLeft: 10,
	},
	messageButtonText: {
		color: "#3385ff",
		fontSize: 16,
		fontWeight: "bold",
	},
	messageButtonRight: {
		backgroundColor: "#3385ff",
	},
	messageButtonTextRight: {
		color: "#fff",
	},
	listCheckImage: {
		width: 15,
		height: 15,
		resizeMode: "contain",
	},
	listEmptyImage: {
		width: 15,
		height: 15,
	},
});

export default PaymentScreen;
