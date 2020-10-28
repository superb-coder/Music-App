// import React from 'react';
// import {
// 	StyleSheet,
// 	View,
// 	Text,
// 	Dimensions,
// 	ActivityIndicator,
// } from 'react-native';

// // eslint-disable-next-line no-undef
// export default (LoadingOverlay = props => {
// 	const { loading, message } = props;

// 	return loading ? (
// 		<View style={styles.loading}>
// 			<ActivityIndicator size={'large'} color="#FFFFFF" />
// 			{message && <Text style={styles.message}>{message}</Text>}
// 		</View>
// 	) : null;
// });

// const styles = StyleSheet.create({
// 	loading: {
// 		position: 'absolute',
// 		left: 0,
// 		right: 0,
// 		top: 0,
// 		bottom: 0,
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		backgroundColor: 'rgba(0, 0, 0, 0.5)',
// 		width: '100%',
// 		height: '100%',
// 		zIndex: 999999999,
// 		marginTop: 0
// 	},
// 	message: {
// 		color: 'white',
// 		fontSize: 16,
// 		marginTop: 10,
// 	},
// });

import React, { Component } from 'react';
import {
    Image, View, Animated, Easing, Text
} from 'react-native';
import { BlurView, VibrancyView } from "@react-native-community/blur";

const loadingIcon = require('../../assets/icons/loading.png');
const completeIcon = require("../../assets/icons/complete.png");
const failedIcon = require("../../assets/icons/failed.png");

// eslint-disable-next-line no-undef
class LoadingOverlay extends Component {
    constructor(props) {
        super(props);

        this.spinValue = new Animated.Value(0)
	}

	componentDidMount() {
        Animated.loop(
            Animated.timing(
                this.spinValue,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true  // To make use of native driver for performance
                }
            )
        ).start()
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        // let { messageText, status } = this.state;

        return (
            <View style={styles.container}>
                <View>
					<Animated.Image
						style={{ transform: [{ rotate: spin }], width: 80, height: 80, tintColor: '#ffff35' }}
						source={loadingIcon}
					/>
				</View>

                <Text style={{ color: '#ffff35', marginTop: 20 }}>
                    {this.props.messageText ? this.props.messageText : "Please wait."}
                </Text>
            </View>
        );
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
    blur_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
};

export default LoadingOverlay;