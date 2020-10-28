import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, ScrollView, AsyncStorage } from "react-native";
import moment from "moment";
import _ from "lodash";
import LinearGradient from "react-native-linear-gradient";
import APIGatewayFetch from "../../APIGateway";
import { CommonStyle, defaultGray } from "../_styles";
import { S3URL } from "../../Constants";
import TopSongComponent from "../Tabs/StreamComponents/TopSongComponent";
import TopPlatformComponent from "../Tabs/StreamComponents/TopPlatformComponent";
import TobCountryComponent from "../Tabs/StreamComponents/TobCountryComponent";
import TopPlayListComponent from "../Tabs/StreamComponents/TopPlayListComponent";
import LoadingOverlay from "../../widgets/LoadingOverlay";
import { LineChart } from "react-native-chart-kit";
const icon_sample_platform = require("../../../assets/icons/icon_sample_platform.png");
const navigationBack = require("../../../assets/images/back_icon.png");
const arrow_right = require("../../../assets/images/right_arrow.png");
const icon_sample_track = require("../../../assets/icons/icon_sample_track.png");
const caret_up = require("../../../assets/icons/caret_up.png");

const halfOfWindows = Dimensions.get("window").width / 2;
const thirdOfWindows = Dimensions.get("window").width / 3;
const windowsWidth = Dimensions.get("window").width;

class StreamSongDetailScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: () => null,
			headerLeft: () => (
				<TouchableOpacity onPress={() => navigation.goBack()} style={CommonStyle.navigationBackContainer}>
					<Image source={navigationBack} style={CommonStyle.navigationBackIcon} resizeMode='contain' />
					<Text style={CommonStyle.navigationBackText}>Back</Text>
				</TouchableOpacity>
			),
			headerRight: null,
			headerStyle: CommonStyle.headerStyle,
		};
	};

	constructor(props) {
		super(props);

		let releaseId = this.props.navigation.getParam("releaseId", "");
		let data = this.props.navigation.getParam("data", {});

		this.state = {
			releaseId: releaseId,
			data: data,
			topPlatforms: [],
			topCountries: [],
			progressUp: 0,
			countOfStreams: 0,
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true }, () => {
			Promise.all([this.getTopPlatforms(), this.getTopCountry(), this.getGraphData()]).then((done) => {
				this.setState({ isLoading: false });
			});
		});
	}

	getTopPlatforms = () => {
		let { releaseId } = this.state;
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findTopPlatforms({
						model: "findAllStatsList",
						where: {
							artistId: authId,
							trackId: releaseId,
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
		let { releaseId } = this.state;
		const apiObj = new APIGatewayFetch();
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findTopPlatforms({
						model: "findAllStatsList",
						where: {
							artistId: authId,
							trackId: releaseId,
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

	getGraphData = () => {
		return new Promise((resolve, reject) => {
			const apiObj = new APIGatewayFetch();

			let { releaseId } = this.state;

			AsyncStorage.getItem("@Auth:id").then((authId) => {
				apiObj
					.findAllGraph(
						{
							model: "findAllGraph",
							where: {
								artistId: authId,
								trackId: releaseId,
							},
							per: "week",
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
									clonedGraphData[i].index = moment(new Date(clonedGraphData[i].index)).format("D MMM");
								}
							}

							let diffPro = clonedGraphData[clonedGraphData.length - 1].quantity - clonedGraphData[0].quantity;

							if (diffPro != 0) {
								diffPro = this.getIncresePro(clonedGraphData[0].quantity, clonedGraphData[clonedGraphData.length - 1].quantity);
							}

							this.setState({ graphData: clonedGraphData, progressUp: diffPro, countOfStreams: clonedGraphData.length > 0 ? clonedGraphData[clonedGraphData.length - 1].quantity : 0 });
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

	render() {
		let { releaseId, data, topPlatforms, topCountries, isLoading, graphData, countOfStreams, progressUp } = this.state;
		console.log(data);
		let items = _.map(graphData, (r) => parseInt(r.quantity + ""));
		return (
			<View style={[CommonStyle.container, CommonStyle.backgroundWhite]}>
				<View style={[CommonStyle.paddingHorizontal_15, { paddingTop: 0 }]}>
					<View
						style={[
							CommonStyle.flexDirectionRow,
							CommonStyle.alignItemsCenter,
							CommonStyle.justifyContentCenter,
							CommonStyle.backgroundWhite,
							{
								paddingBottom: 20,
							},
						]}
					>
						<View
							style={[
								CommonStyle.alignItemsCenter,
								CommonStyle.justifyContentCenter,
								{
									width: windowsWidth,
								},
							]}
						>
							<View style={{ width: "100%" }}>
								<LinearGradient
									start={{ x: 0, y: 1 }}
									end={{ x: 0, y: 0 }}
									colors={["#FFFFFF", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC", "#F9EFEC"]}
									style={[myStyles.linearGradient, CommonStyle.alignItemsCenter, CommonStyle.justifyContentCenter]}
								>
									<Image style={myStyles.avatarImage} source={data.cover ? `${S3URL}${item.cover}` : icon_sample_platform} />
								</LinearGradient>
							</View>

							<Text style={myStyles.trackTitle}>{data ? data.name : ""}</Text>
							<Text style={myStyles.streamText}>{this.formatCash(data ? data.streams : 0)} streams</Text>
							<Text style={myStyles.timeText}>{"ALL-TIME"}</Text>
						</View>
					</View>
				</View>
				<ScrollView style={[CommonStyle.full, CommonStyle.paddingHorizontal_15]}>
					<Text style={CommonStyle.fontSize_20}>Streams</Text>

					<View style={[CommonStyle.flexDirectionRow, CommonStyle.positionRelative, { height: 220, zIndex: 5 }]}>
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
									backgroundColor: "white",
									backgroundGradientFrom: "white",
									backgroundGradientTo: "white",
									decimalPlaces: 0, // optional, defaults to 2dp
									color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
									labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
									style: {
										borderRadius: 0,
									},
									propsForDots: {
										r: "6",
										strokeWidth: "2",
										stroke: "#ffa726",
									},
								}}
								bezier
								style={{
									marginVertical: 8,
									borderRadius: 0,
								}}
							/>
						)}
					</View>
					<View
						style={[
							CommonStyle.flexDirectionRow,
							CommonStyle.justifyContentBetween,
							CommonStyle.alignItemsCenter,
							{
								paddingTop: 20,
							},
						]}
					>
						<Text style={[CommonStyle.fontSize_12, { color: "#999999", textTransform: "uppercase" }]}>{"LAST 28 DAYS"}</Text>
						<Text style={[CommonStyle.fontSize_12, { color: "#999999" }]}>{"THIS PERIOD"}</Text>
					</View>
					<View
						style={[
							CommonStyle.flexDirectionRow,
							CommonStyle.justifyContentBetween,
							CommonStyle.alignItemsCenter,
							{
								paddingTop: 20,
							},
						]}
					>
						<Text style={[CommonStyle.fontSize_14, CommonStyle.colorBlack]}>{"Worldwide"}</Text>
						<View style={[CommonStyle.flexDirectionRow, CommonStyle.alignItemsCenter]}>
							<Text style={[CommonStyle.fontSize_14, CommonStyle.colorBlack]}>{this.formatCash(countOfStreams)}</Text>
							{progressUp != 0 && (
								<>
									<Image source={caret_up} style={[myStyles.caretUp, progressUp < 0 && { transform: [{ rotate: "180deg" }], tintColor: "#DA4400" }]} />
								</>
							)}

							<Text style={myStyles.caretUpText}>{progressUp + "%"}</Text>
						</View>
					</View>
					<View style={CommonStyle.marginTop_10}>
						<TopPlatformComponent
							topPlatforms={topPlatforms}
							clickSeeAll={() => {
								this.props.navigation.navigate("TopPlatformScreen", { topPlatforms: topPlatforms });
							}}
						/>
					</View>
					<View style={CommonStyle.marginTop_10}>
						<TobCountryComponent
							topCountries={topCountries}
							clickSeeAll={() => {
								this.props.navigation.navigate("TopCountriesScreen", { topCountries: topCountries });
							}}
						/>
					</View>
				</ScrollView>
				{isLoading && <LoadingOverlay loading={isLoading} />}
			</View>
		);
	}

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
}

export const myStyles = StyleSheet.create({
	scroll: {
		flex: 1,
		paddingBottom: 15,
	},
	checkBoxIconContainer: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
	},
	avatarImage: {
		width: thirdOfWindows,
		height: thirdOfWindows,
		resizeMode: "contain",
		borderRadius: 3,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: "white",
	},
	trackTitle: {
		color: "black",
		fontSize: 20,
		marginTop: 5,
	},
	streamText: {
		color: "black",
		fontSize: 14,
		marginTop: 10,
		fontWeight: "bold",
	},
	timeText: {
		color: defaultGray,
		fontSize: 14,
		marginTop: 5,
	},
	caretUp: {
		width: 15,
		height: 7,
		resizeMode: "contain",
		marginLeft: 50,
	},
	caretUpText: {
		fontSize: 14,
		color: "black",
		marginLeft: 15,
	},
	linearGradient: {
		paddingTop: 20,
		width: "100%",
		paddingBottom: 10,
	},
});

export default StreamSongDetailScreen;
