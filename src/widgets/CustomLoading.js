import React, { Component } from 'react';
import {
    Image, View, Animated, Easing, Text
} from 'react-native';
import { BlurView, VibrancyView } from "@react-native-community/blur";

const loadingIcon = require('../../assets/icons/loading.png');
const completeIcon = require("../../assets/icons/complete.png");
const failedIcon = require("../../assets/icons/failed.png");

// eslint-disable-next-line no-undef
class CustomLoading extends Component {
    constructor(props, context) {
        super(props, context);

        let messageText = this.props.messageText;
        let status = this.props.status;

        this.spinValue = new Animated.Value(0)

        // status: 0 loading, 1 failed, 2 success
        this.state = {
            messageText: messageText,
            status: status,
        }
    }

    componentWillReceiveProps(props) {
        let {messageText, status} = props;
        
        this.setState({
            messageText: messageText,
            status: status
        })
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

        let { messageText, status } = this.state;

        return (
            <View style={styles.container}>
                {
                    status != 0 && (
                        <BlurView
                            style={styles.blur_container}
                            blurType="light"
                            blurAmount={4}
                            reducedTransparencyFallbackColor="white"
                        />
                    )
                }
                
                {
                    status == 0 && (
                        <View>
                            <Animated.Image
                                style={{ transform: [{ rotate: spin }], width: 80, height: 80, tintColor: '#ffff35' }}
                                source={loadingIcon}
                            />
                        </View>
                    )
                }

                {
                    status == 2 && (
                        <View>
                            <Image
                                style={{ width: 80, height: 80, tintColor: '#ffff35' }}
                                source={completeIcon}
                            />
                        </View>
                    )
                }

                {
                    status == 1 && (
                        <View>
                            <Image
                                style={{ width: 80, height: 80, tintColor: '#ffff35' }}
                                source={failedIcon}
                            />
                        </View>

                    )
                }

                <Text style={{ color: '#ffff35', marginTop: 20 }}>
                    {messageText}
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

export default CustomLoading;