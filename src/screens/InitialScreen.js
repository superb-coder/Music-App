import React from 'react';
import { Image, StatusBar, View, Platform, Animated, Easing, AsyncStorage, Text } from 'react-native';
// import Auth from '../auth';
import CustomLoading from '../widgets/CustomLoading';

export default class InitialScreen extends React.Component {
	static navigationOptions = {
		header: false,
	};

	constructor(props) {
		super(props);

		// this.state = {
		// 	status: 0, 
		// 	messageText: "Please wait..."
		// }
	}

	UNSAFE_componentWillMount() {
		// Auth.isMember().then(isMember => {
		// 	Auth.isStaff().then((isStaff) => {
		// 		if (isMember) {
		// 			this.props.navigation.navigate('CustomerTabScreen');

		// 			return;
		// 		}

		// 		if (isStaff) {
		// 			this.props.navigation.navigate('TherapistTabScreen');

		// 			return;
		// 		}

		// 		this.props.navigation.navigate('HomeScreen');
		// 	})
		// })
		// this.props.navigation.navigate('SignInScreen');

		// this.props.navigation.navigate('GetStartScreen');

		// return;

		AsyncStorage.getItem("@Auth:id").then((data) => {
			if (data) {
				this.props.navigation.navigate('DashboardScreen');
			} else {
				this.props.navigation.navigate('GetStartScreen');
			}
		}).catch((error) => {
			this.props.navigation.navigate('GetStartScreen');
		})

		
		// this.props.navigation.navigate('AddTrackScreen');
		// this.props.navigation.navigate('CreateAccountScreen');
		// // this.props.navigation.navigate('ForgotPasswordScreen');
	}

	componentDidMount() {
		// setTimeout(() => {
		// 	this.setState({status: 1, messageText: "Email or password is wrong"})
		// }, 10000)
	}

	render() {
		// let { status, messageText } = this.state;

		// return (
		// 	<View style={styles.container}>
		// 		<CustomLoading status={status} messageText={messageText}/>
		// 	</View>
		// );

		return null;
	}
}

const styles = {
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		width: '100%',
		height: '100%',
		zIndex: 999999999,
	},

	row: {
		flex: 1,
		flexDirection: 'row',
	},

	reverse: {
		transform: [{
			rotate: '180deg',
		}],
	},

	flex: {
		flex: 1,
	},
};
