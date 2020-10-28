import React from 'react';
import { Image, YellowBox, View, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import UserAvatar from 'react-native-user-avatar';

import AppTabBar from './AppTabBar';

import InitialScreen from '../screens/InitialScreen';
import GetStartScreen from '../screens/GetStartScreen';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignIn/SignInScreen';
import SignInVerifyScreen from '../screens/SignIn/SignInVerifyScreen';
import SignInSetupPasswordScreen from '../screens/SignIn/SignInSetupPasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword/ForgotPasswordScreen';
import ForgotPasswordConfirmScreen from '../screens/ForgotPassword/ForgotPasswordConfirmScreen';
import CreateAccountScreen from '../screens/Register/CreateAccountScreen';
import SignupInfoProcessScreen from '../screens/Register/SignupInfoProcessScreen';
import SignupArtistSelectScreen from '../screens/Register/SignupArtistSelectScreen';
import SignupProcessConfirmScreen from '../screens/Register/SignupProcessConfirmScreen';
import SignupVerifyScreen from '../screens/Register/SignupVerifyScreen';

import ArtistTabScreen from '../screens/Tabs/ArtistTabScreen';
import MusicTabScreen from '../screens/Tabs/MusicTabScreen';
import StreamTabScreen from '../screens/Tabs/StreamTabScreen';

//Add Track

import AddTrackScreen from '../screens/AddTrack/AddTrackScreen';
import SelectLanguageScreen from '../screens/AddTrack/SelectLanguageScreen';
import SelectGenreScreen from '../screens/AddTrack/SelectGenreScreen';
import TrackDetailScreen from '../screens/AddTrack/TrackDetailScreen';
import SelectFeatCollabArtistScreen from '../screens/AddTrack/SelectFeatCollabArtistScreen';
import SelectContributorScreen from '../screens/AddTrack/SelectContributorScreen';
import SelectAuthorScreen from '../screens/AddTrack/SelectAuthorScreen';
import SelectCompositorScreen from '../screens/AddTrack/SelectCompositorScreen';
import ReleaseSettingScreen from '../screens/AddTrack/ReleaseSettingScreen';
import SelectTrackOriginScreen from '../screens/AddTrack/SelectTrackOriginScreen';
import ReleaseCompleteScreen from '../screens/AddTrack/ReleaseCompleteScreen';
import TrackStatusScreen from '../screens/Tabs/MusicTab/TrackStatusScreen';

import AlbumScreen from '../screens/AddAlbum/AlbumScreen';
import AlbumTrackDetailScreen from '../screens/AddAlbum/AlbumTrackDetailScreen';
import AlbumSelectFeatCollabArtistScreen from '../screens/AddAlbum/AlbumSelectFeatCollabArtistScreen';
import AlbumSelectContributorScreen from '../screens/AddAlbum/AlbumSelectContributorScreen';
import AlbumSelectAuthorScreen from '../screens/AddAlbum/AlbumSelectAuthorScreen';
import AlbumSelectCompositorScreen from '../screens/AddAlbum/AlbumSelectCompositorScreen';
import AlbumReleaseSettingScreen from '../screens/AddAlbum/AlbumReleaseSettingScreen';
import AlbumReleaseCompleteScreen from '../screens/AddAlbum/AlbumReleaseCompleteScreen';

import PaymentScreen from '../screens/Payments/PaymentScreen';
import WaitingPaymentScreen from '../screens/Payments/WaitingPaymentScreen';
import PaymentProgressingScreen from '../screens/Payments/PaymentProgressingScreen';

import SupportScreen from '../screens/Support/SupportScreen';

import SongListScreen from '../screens/StreamTab/SongListScreen';
import StreamSongDetailScreen from '../screens/StreamTab/StreamSongDetailScreen';
import TopCountriesScreen from '../screens/StreamTab/TopCountriesScreen';
import TopPlatformScreen from '../screens/StreamTab/TopPlatformScreen';
import TopPlayListScreen from '../screens/StreamTab/TopPlayListScreen';

const tabIcon1 = require('../../assets/images/musicTabIcon.png');
const tabIcon2 = require('../../assets/images/streamTabIcon.png');
const tabIcon3 = require('../../assets/images/artistTabIcon.png');

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader',
]);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);


const SignNavigator = createAppContainer(
	createStackNavigator({
		HomeScreen,
		SignInScreen,
		CreateAccountScreen,
		SignupInfoProcessScreen,
		SignupArtistSelectScreen,
		SignupProcessConfirmScreen,
		ForgotPasswordScreen,
		ForgotPasswordConfirmScreen,
		SignInVerifyScreen,
		SignupVerifyScreen,
		SignInSetupPasswordScreen
	},
		{
			headerMode: 'screen',
			initialRouteName: 'HomeScreen',
			defaultNavigationOptions: {
				gestureEnabled: false,
				swipeEnabled: false
			}
		}),
);



const PaymentNavigator = createAppContainer(
	createStackNavigator({
		PaymentScreen,
		WaitingPaymentScreen,
		PaymentProgressingScreen
	},
		{
			headerMode: 'screen',
			initialRouteName: 'PaymentScreen',
			defaultNavigationOptions: {
				gestureEnabled: false,
				swipeEnabled: false,
				header: false
			}
		}),
);

const AddTrackNavigator = createAppContainer(
	createStackNavigator({
		MusicTabScreen,
		AddTrackScreen,
		SelectLanguageScreen,
		SelectGenreScreen,
		TrackDetailScreen,
		SelectFeatCollabArtistScreen,
		SelectContributorScreen,
		SelectAuthorScreen,
		SelectCompositorScreen,
		ReleaseSettingScreen,
		SelectTrackOriginScreen,
		ReleaseCompleteScreen,
		TrackStatusScreen,
		SupportScreen,
		
		
	},
		{
			headerMode: 'screen',
			initialRouteName: 'MusicTabScreen',
			defaultNavigationOptions: {
				gestureEnabled: false,
				swipeEnabled: false
			}
		}),
);

AddTrackNavigator.navigationOptions = ({ navigation }) => {
	let tabBarVisible;
	if (navigation.state.routes.length > 1) {
		navigation.state.routes.map(route => {
			if (
				route.routeName === "AddTrackScreen" || 
				route.routeName === "SelectLanguageScreen" || 
				route.routeName === "SelectGenreScreen" || 
				route.routeName == "TrackStatusScreen"  || 
				route.routeName == "ReleaseSettingScreen"  || 
				route.routeName == "ReleaseCompleteScreen"  || 
				route.routeName == "TrackDetailScreen"  || 
				route.routeName == "WaitingPaymentScreen"  || 
				route.routeName == "PaymentProgressingScreen"  || 
				route.routeName == "SelectCompositorScreen"  || 
				route.routeName == "SelectContributorScreen"  || 
				route.routeName == "SelectTrackOriginScreen"  || 
				route.routeName == "SelectFeatCollabArtistScreen"  || 
				route.routeName == "SelectAuthorScreen"  || 
				
				route.routeName == "PaymentScreen"
			) {
				tabBarVisible = false;
			} else {
				
				if (route.routeName == "MusicTabScreen") {
					global.refreshEmitter.emit("Music_Refresh");
				}

				tabBarVisible = true;
			}
		});
	}

	return {
		tabBarVisible
	};
};

const AddAlbumNavigator = createAppContainer(
	createStackNavigator(
		{
			AlbumScreen,
			AlbumTrackDetailScreen,
			AlbumSelectFeatCollabArtistScreen,
			AlbumSelectContributorScreen,
			AlbumSelectAuthorScreen,
			AlbumSelectCompositorScreen,
			AlbumReleaseSettingScreen,
			AlbumReleaseCompleteScreen
		},
		{
			headerMode: 'screen',
			initialRouteName: 'AlbumScreen',
			defaultNavigationOptions: {
				gestureEnabled: false,
				swipeEnabled: false
			}
		}
	)
);

const StreamNavigator = createAppContainer(
	createStackNavigator({
		StreamTabScreen,
		SongListScreen,
		StreamSongDetailScreen,
		TopCountriesScreen,
		TopPlatformScreen,
		TopPlayListScreen
	},
	{
		headerMode: 'screen',
		initialRouteName: 'StreamTabScreen',
		defaultNavigationOptions: {
			gestureEnabled: false,
			swipeEnabled: false
		}
	}),
);

const DashboardScreen = createBottomTabNavigator(
	{
		Music: {
			screen: AddTrackNavigator,
		},
		Streams: {
			screen: StreamNavigator,
		},
		Artist: {
			screen: ArtistTabScreen,
		},
	},
	{
		lazy: false,
		initialRouteName: 'Streams',
		tabBarComponent: AppTabBar,
	},
);

// const DashboardScreen = createBottomTabNavigator(
// 	{
// 		Music: {
// 			screen: AddTrackNavigator,
// 			navigationOptions: {
// 				tabBarLabel: 'Music',
// 				tabBarIcon: ({ focused }) => (
// 					<Image
// 						style={[
// 							{
// 								marginTop: 2,
// 								width: 25,
// 								height: 25,
// 								resizeMode: 'contain'
// 							},
// 							focused && {
// 								tintColor: '#da4400',
// 							}]}
// 						source={tabIcon1}
// 					/>
// 				),
// 				tabBarOnPress: ({ navigation, defaultHandler }) => {
// 					navigation.navigate('MusicTabScreen')
// 					defaultHandler();
// 				},
// 			},
// 			gestureEnabled: false
// 		},
// 		Stream: {
// 			screen: StreamNavigator,
// 			navigationOptions: {
// 				tabBarLabel: 'Streams',
// 				tabBarIcon: ({ focused }) => (
// 					<Image
// 						style={[{
// 							marginTop: 2,
// 							width: 25,
// 							height: 25,
// 							resizeMode: 'contain'
// 						},
// 						focused && {
// 							tintColor: '#da4400',
// 						}]}
// 						source={tabIcon2}
// 					/>
// 				),
// 			},
// 		},
// 		Artist: {
// 			screen: ArtistTabScreen,
// 			navigationOptions: {
// 				tabBarLabel: 'Artist',
// 				tabBarIcon: ({ focused }) => {
// 					AsyncStorage.multiGet([
// 						'@Auth:firstName',
// 						'@Auth:lastName',
// 						'@Auth:profilePic',
// 					], (err, values) => {
// 						const username = values[0][1] + " " + values[1][1];

// 						if (values[2][1]) {
// 							return <UserAvatar name={username} size={25} src={values[2][1]}/>
// 						} else {
// 							return <UserAvatar name={username} size={25}/>
// 						}
// 					});
// 					// AsyncStorage.multiGet([
// 					// 	'@Auth:firstName',
// 					// 	'@Auth:lastName',
// 					// 	'@Auth:profilePic',
// 					// ]).catch(e => {

// 					// }).then((values) => {
// 					// 	const username = values[0][1] + " " + values[1][1]
// 					// });
					
// 					// <Image
// 					// 	style={[{
// 					// 		marginTop: 2,
// 					// 		width: 25,
// 					// 		height: 25,
// 					// 		resizeMode: 'contain'
// 					// 	},
// 					// 	]}
// 					// 	source={tabIcon3}
// 					// />
// 				},
// 				tabBarOnPress: ({ navigation, defaultHandler }) => {
// 					defaultHandler();
// 				}
// 			}
// 		},
// 	},
// 	{
// 		lazy: false,
// 		initialRouteName: 'Music',
// 		tabBarOptions: {
// 			activeTintColor: '#FFFFFF',
// 			style: {
// 				backgroundColor: 'black',
// 				borderTopColor: 'black',
// 				color: 'white',
// 				justifyContent: 'space-between',
// 				marginRight: -2,
// 			},

// 			activeBackgroundColor: 'black',
// 			inactiveBackgroundColor: 'black',
// 			tabStyle: {
// 				borderRightWidth: 2,
// 				borderRightColor: 'black',

// 			},
// 		}
// 	},
// );

const Routes = {
	InitialScreen,
	GetStartScreen,
	HomeScreen,
	SignScreen: {
		screen: SignNavigator,
		navigationOptions: {
			headerShown: false
		}
	},
	DashboardScreen,
	AddAlbumNavigator,
	PaymentNavigator
};

export default Routes;