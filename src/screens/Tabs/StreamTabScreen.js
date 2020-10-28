import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, AsyncStorage } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import _ from "lodash";
import moment from "moment";
import APIGatewayFetch from "../../APIGateway";
import { CommonStyle, defaultGray } from "../_styles";
import TopSongComponent from "./StreamComponents/TopSongComponent";
import TopPlatformComponent from "./StreamComponents/TopPlatformComponent";
import TobCountryComponent from "./StreamComponents/TobCountryComponent";
import TopPlayListComponent from "./StreamComponents/TopPlayListComponent";
import DropdownMenu from "../../widgets/DropDown";
import { LineChart } from "react-native-chart-kit";
import LoadingOverlay from "../../widgets/LoadingOverlay";

const windowsWidth = Dimensions.get("window").width;

const onboard_empty = require("../../../assets/images/onboard_empty.png");
const whiteLogo = require("../../../assets/icons/white_logo.png");
const euroSign = require("../../../assets/icons/icon_euro_sign.png");
const settings = require("../../../assets/icons/icon_settings.png");
const arrow_up = require("../../../assets/icons/arrow_up.png");
const arrow_down = require("../../../assets/icons/arrow_down.png");
const ico_arrow = require("../../../assets/icons/ico_arrow.png");
const statusBarHeight = getStatusBarHeight();
const DROP_MENU = [["Week", "Month", "Trimester", "Year"]];

class StreamTabScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props) {
		super(props);

		this.state = {
			graphData: [],
			selectedOption: "Week",
			selectedIndex: 0,
			countOfStreams: 0,
			progressUp: 0,
			topPlatforms: [],
			topCountries: [],
			topSongs: [],
			isLoading: false,
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true }, () => {
			Promise.all([this.getGraphData(), this.getTopPlatforms(), this.getTopCountry(), this.getTopSongs()]).then((exe) => {
				this.setState({ isLoading: false });
			});
		});
	}

	getGraphData = () => {
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			let { selectedOption } = this.state;

			AsyncStorage.getItem("@Auth:id").then((authId) => {
				console.log("Auth@Id", authId);
				apiObj
					.findAllGraph(
						{
							model: "findAllGraph",
							where: {
								artistId: authId,
							},
							per: selectedOption.toLowerCase(),
						},
						true
					)
					.then((graphData) => {
						if (Array.isArray(graphData)) {
							let clonedGraphData = graphData.slice(0);

							clonedGraphData.sort((a, b) => {
								let clonedA = moment(new Date(a.index));
								let isAfter = clonedA.isAfter(new Date(b.index));

								if (isAfter) {
									return 1;
								} else {
									return -1;
								}
							});

							for (let i = 0; i < clonedGraphData.length; i++) {
								if (clonedGraphData[i].index) {
									if (selectedOption.toLowerCase() == "week") {
										clonedGraphData[i].index = moment(new Date(clonedGraphData[i].index)).format("D MMM");
									} else if (selectedOption.toLowerCase() == "month") {
										clonedGraphData[i].index = moment(new Date(clonedGraphData[i].index)).format("MMM");
									} else if (selectedOption.toLowerCase() == "year") {
										clonedGraphData[i].index = clonedGraphData[i].index;
									} else {
										clonedGraphData[i].index = moment(new Date(clonedGraphData[i].index)).format("D MMM");
									}
								}
							}

							let diffPro = clonedGraphData[clonedGraphData.length - 1].quantity - clonedGraphData[0].quantity;

							if (diffPro != 0) {
								diffPro = this.getIncresePro(clonedGraphData[0].quantity, clonedGraphData[clonedGraphData.length - 1].quantity);
							}

							this.setState({ graphData: clonedGraphData, countOfStreams: clonedGraphData.length > 0 ? clonedGraphData[clonedGraphData.length - 1].quantity : 0, progressUp: diffPro });
						}
					})
					.finally(() => {
						resolve(true);
					});
			});
		});
	};

	getTopPlatforms = () => {
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findTopPlatforms({
						model: "findAllStatsList",
						where: {
							artistId: authId,
						},
						topBy: "Platform",
					})
					.then((topPlatforms) => {
						if (topPlatforms) {
							let wholeArray = Object.keys(topPlatforms).map((key) => topPlatforms[key]);
							let platformData = _.filter(_.map(_.orderBy(wholeArray, ["streams"], ["desc"])), (r) => r.name != null);
							this.setState({ topPlatforms: platformData });
						}
					})
					.finally(() => {
						resolve(true);
					});
			});
		});
	};

	getTopCountry = () => {
		const apiObj = new APIGatewayFetch();
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findTopPlatforms({
						model: "findAllStatsList",
						where: {
							artistId: authId,
						},
						topBy: "Country",
					})
					.then((topCountries) => {
						if (topCountries) {
							let wholeArray = Object.keys(topCountries).map((key) => topCountries[key]);
							let countryData = _.filter(_.map(_.orderBy(wholeArray, ["streams"], ["desc"])), (r) => r.name != null);

							this.setState({ topCountries: countryData });
						}
					})
					.finally(() => {
						resolve(true);
					});
			});
		});
	};

	getTopSongs = () => {
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findTopPlatforms({
						model: "findAllStatsList",
						where: {
							artistId: authId,
						},
						topBy: "Songs",
					})
					.then((topSongs) => {
						if (topSongs) {
							let wholeArray = Object.keys(topSongs).map((key) => topSongs[key]);
							let platformData = _.filter(_.map(_.orderBy(wholeArray, ["streams"], ["desc"])), (r) => r.name != null);

							console.log(platformData);
							this.setState({ topSongs: platformData });
						}
					})
					.finally(() => {
						resolve(true);
					});
			});
		});
	};

	getIncresePro = (oldNumber, newNumber) => {
		let percent = 0;
		if (oldNumber != 0 && newNumber != 0) {
			percent = (1 - oldNumber / newNumber) * 100;

			if (percent > 0) {
				percent += 100;
			}
		} else {
			if (newNumber == 0) {
				return -100;
			} else {
				return 100;
			}
		}

		return percent;
	};

	gotoPaymentScreen = () => {
		const apiObj = new APIGatewayFetch();

		this.setState({ isLoading: true }, () => {
			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findAll(
						{
							model: "Payments",
							orderBy: "updatedAt",
							orderWay: "desc",
							where: {
								entityId: "ety_gtNqq6evjkA",
							},
						},
						true
					)
					.then((payments) => {
						this.setState({ isLoading: false }, () => {
							if (Array.isArray(payments) && payments.length > 0) {
								payments.sort((a, b) => {
									return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
								});

								let isProcessing = false;

								if (payments[0].status == "waiting") {
									isProcessing = true;
								}

								isProcessing = true;

								this.props.navigation.navigate("PaymentScreen", { isFrom: "StreamTabScreen", isProcessing: isProcessing });
							} else {
								this.props.navigation.navigate("WaitingPaymentScreen", { isFrom: "StreamTabScreen" });
							}
						});
					});
			});
		});
	};

	render() {
		const { graphData, countOfStreams, progressUp, topPlatforms, topCountries, topSongs, isLoading } = this.state;

		let items = _.map(graphData, (r) => parseInt(r.quantity + ""));

		return (
			<View style={[CommonStyle.full, CommonStyle.positionRelative]}>
				<View style={[CommonStyle.justifyContentEnd, { height: Dimensions.get("window").height * 0.57 + 10 }]}>
					<Image
						source={onboard_empty}
						style={[
							CommonStyle.positionAbsolute,
							{
								width: Dimensions.get("window").width,
								height: Dimensions.get("window").height * 0.57,
								resizeMode: "stretch",
								top: -1,
							},
						]}
					/>

					<View>
						<View
							style={[
								CommonStyle.flexDirectionRow,
								CommonStyle.positionAbsolute,
								CommonStyle.alignItemsCenter,
								CommonStyle.justifyContentCenter,
								{
									zIndex: 10,
									marginHorizontal: 15,
									backgroundColor: "#252525",
								},
							]}
						>
							<View style={CommonStyle.full}>
								<Text style={[CommonStyle.colorWhite, { fontSize: 10, paddingTop: 10, paddingLeft: 10 }]}>Stream of your songs</Text>
								<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsEnd, { paddingTop: 5, paddingLeft: 10 }]}>
									<Text style={[CommonStyle.colorWhite, { fontSize: 20 }]}>{countOfStreams}</Text>
									<Text
										style={[
											CommonStyle.colorWhite,
											CommonStyle.marginLeft_10,
											progressUp > 0 && { fontSize: 12, color: "#56CB82" },
											progressUp < 0 && { fontSize: 12, color: "#DA4400" },
											progressUp == 0 && { fontSize: 12 },
										]}
									>
										{progressUp}%
									</Text>
									{progressUp > 0 && <Image source={arrow_up} style={{ width: 14, height: 14, resizeMode: "contain" }} />}
									{progressUp < 0 && <Image source={arrow_down} style={{ width: 14, height: 14, resizeMode: "contain" }} />}
								</View>
							</View>
							<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter, { width: 120, zIndex: 6, paddingTop: 5, paddingRight: 15 }]}>
								<DropdownMenu
									bgColor={"#000000"}
									tintColor={"#000000"}
									activityTintColor={"green"}
									titleStyle={CommonStyle.colorWhite}
									iconBorderAvailable='false'
									handler={(selection, row) => {
										this.setState({ selectedOption: DROP_MENU[selection][row], selectedIndex: row }, () => {
											this.getGraphData();
										});
									}}
									arrowImg={ico_arrow}
									data={DROP_MENU}
								></DropdownMenu>
							</View>
						</View>
						<View style={[CommonStyle.marginTop_30, { zIndex: 5 }]}>
							<View
								style={[
									CommonStyle.flexDirectionRow,
									CommonStyle.positionRelative,
									{ height: 0.32 * Dimensions.get("window").height, zIndex: 5, paddingTop: 20, marginHorizontal: 15, backgroundColor: "#252525" },
								]}
							>
								<View style={CommonStyle.flexDirectionRow}>
									{Array.isArray(items) && items.length > 0 && (
										<LineChart
											data={{
												labels: _.map(graphData, (r) => r.index),
												datasets: [
													{
														data: items,
													},
												],
											}}
											width={windowsWidth - 30} // from react-native
											height={220}
											yAxisLabel=''
											yAxisSuffix='k'
											yAxisInterval={1} // optional, defaults to 1
											chartConfig={{
												backgroundColor: "transparent",
												backgroundGradientFrom: "transparent",
												backgroundGradientTo: "transparent",
												decimalPlaces: 0,
												color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
												labelColor: (opacity = 0.3) => `rgba(255, 255, 255, ${opacity})`,
												style: {
													borderRadius: 16,
												},
												propsForDots: {
													r: "6",
													strokeWidth: "2",
													stroke: "#ffa726",
												},
												backgroundGradientFromOpacity: 0,
												backgroundGradientToOpacity: 0,
											}}
											bezier
											style={{
												marginVertical: 0,
												borderRadius: 0,
												backgroundColor: "transparent",
												paddingLeft: 0,
												justifyContent: "flex-start",
												marginTop: 10,
												marginLeft: -15,
											}}
										/>
									)}
								</View>
							</View>
						</View>
					</View>
				</View>

				<View style={[CommonStyle.positionAbsolute, CommonStyle.paddingHorizontal_15, { paddingTop: statusBarHeight, paddingBottom: 15, marginTop: 15, width: "100%" }]}>
					<View style={[CommonStyle.full, CommonStyle.flexDirectionRow, CommonStyle.justifyContentBetween]}>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.gotoPaymentScreen();
							}}
						>
							<Image source={euroSign} style={CommonStyle.euroSignIcon} />
						</TouchableOpacity>

						<Image source={whiteLogo} style={CommonStyle.whiteLogo} />
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => {
								this.props.navigation.navigate("SupportScreen", { isFrom: "StreamTabScreen" });
							}}
						>
							<Image source={settings} style={CommonStyle.settingIcon} />
						</TouchableOpacity>
					</View>
				</View>

				<ScrollView style={[CommonStyle.full, CommonStyle.paddingHorizontal_15, { marginTop: 15 }]}>
					<TopSongComponent
						clickSong={(index) => {
							this.props.navigation.navigate("StreamSongDetailScreen", { releaseId: topSongs[index].releaseId, data: topSongs[index] });
						}}
						topSongs={topSongs}
						clickSeeAll={() => {
							this.props.navigation.navigate("SongListScreen", { topSongs: topSongs });
						}}
					/>
					<TopPlatformComponent
						topPlatforms={topPlatforms}
						clickSeeAll={() => {
							this.props.navigation.navigate("TopPlatformScreen", { topPlatforms: topPlatforms });
						}}
					/>
					<TobCountryComponent
						topCountries={topCountries}
						clickSeeAll={() => {
							this.props.navigation.navigate("TopCountriesScreen", { topCountries: topCountries });
						}}
					/>
					{/* <TopPlayListComponent
						clickSeeAll={() => {
							this.props.navigation.navigate("TopPlayListScreen");
						}}
					/> */}
				</ScrollView>
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
	},
});

export default StreamTabScreen;
