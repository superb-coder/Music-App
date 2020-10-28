import React, { useEffect } from "react";
import { createSwitchNavigator } from "react-navigation";
import { createNavigationReducer, createReactNavigationReduxMiddleware, createReduxContainer } from "react-navigation-redux-helpers";
import { connect, Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import Reactotron from "../ReactotronConfig";
import Routes from "./navigation/Routes";
// import BookReducer from './reducers/BookReducer';
// import MemberReducer from './reducers/MemberReducer';
import thunk from "redux-thunk";
// import OneSignal from 'react-native-onesignal';
// import Auth from './auth';
import SplashScreen from "react-native-splash-screen";
import { styles } from "./screens/_styles";
import { NavigationActions, addNavigationHelpers } from "react-navigation";
import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";
// import EventEmitter from 'EventEmitter';

Amplify.configure(awsconfig);

const EventEmitter = require("../node_modules/react-native/Libraries/vendor/emitter/EventEmitter");

const AppNavigator = createSwitchNavigator(Routes, {
	// initialRouteName: 'TabScreen',
	initialRouteName: "InitialScreen",
});

const navReducer = createNavigationReducer(AppNavigator);
const appReducer = combineReducers({
	nav: navReducer,
	// BookReducer,
	// MemberReducer,
});

// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
const middleware = createReactNavigationReduxMiddleware((state) => state.nav);

const App = createReduxContainer(AppNavigator);
const mapStateToProps = (state) => ({
	state: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

// const store = createStore(appReducer, applyMiddleware(middleware));
const store = createStore(appReducer, composeWithDevTools(applyMiddleware(middleware, thunk), Reactotron.createEnhancer()));

export default class Root extends React.Component {
	constructor(properties) {
		super(properties);

		this.navigator = null;

		// OneSignal.setLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);
		// OneSignal.init("86fa928b-cf00-43dd-836f-c0b0d8ff3e53");
		// OneSignal.inFocusDisplaying(2);
		// OneSignal.addEventListener('ids', this.onIds);
		// OneSignal.addEventListener('received', this.onReceived);
		// OneSignal.addEventListener('opened', this.onOpened);

		// setTimeout(() => {
		// 	SplashScreen.hide();
		// }, 3000)

		setTimeout(() => {
			SplashScreen.hide();
		}, 1000);

		// OneSignal.addEventListener('ids', this.onIds);
	}

	componentDidMount() {
		global.eventEmitter = new EventEmitter();
		global.refreshEmitter = new EventEmitter();
		global.bShowedWarning == false;
	}

	onReceived(notification) {
		console.log("Notification received: ", notification);
	}

	onOpened(openResult) {
		// console.log('Message: ', openResult.notification.payload.body);
		// console.log('Data: ', JSON.stringify(openResult.notification.payload.additionalData.type));
		// console.log('isActive: ', openResult.notification.isAppInFocus);
		// console.log('openResult: ', openResult);

		const type = openResult.notification.payload.additionalData.type ? openResult.notification.payload.additionalData.type : "booking";

		const isStaff = Auth.isStaff().then((isStaff) => {
			Auth.getUserID().then((userID) => {
				if (isStaff == true && userID != 0) {
					global.eventEmitter.emit("NOTIFICATION_OPENED", { type: type });
				}
			});
		});
	}

	onIds(device) {
		if (device && device.pushToken && device.userId) {
			Auth._storeTokenData(device);
		}
	}

	render() {
		return (
			<Provider store={store}>
				<AppWithNavigationState screenProps={this.eventEmitter} />
			</Provider>
		);
	}
}
