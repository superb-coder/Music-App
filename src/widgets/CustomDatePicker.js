import React from 'react';
import { StyleSheet, TouchableOpacity, Platform, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { CommonStyle, defaultGray } from '../screens/_styles';

export default class CustomDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(this.props.date),
        };
    }

    render() {
        const { onClose, onChange } = this.props;
        const { date } = this.state;
        return (
            <TouchableOpacity
                style={myStyles.container}
                onPress={() => { onClose(date) }}
            >
                {
                    <View
                        style={myStyles.done_button_container}
                    >
                        <TouchableOpacity onPress={() => onClose(date)}>
                            <Text style={CommonStyle.colorWhite}>Done</Text>
                        </TouchableOpacity>
                    </View>

                }
                <View style={ myStyles.date_picker_container }>
                    < DatePicker
                        value={date}
                        mode="date"
                        textColor="#FFFFFE"
                        onDateChange={(e) => {
                            this.setState({ date: e });
                            onChange(e);
                        }}
                        style={CommonStyle.backgroundBlack}
                    />
                </View>

            </TouchableOpacity >
        );
    }
}

export const myStyles = StyleSheet.create({
    container: {
        backgroundColor: Platform.OS === 'ios' ? '#00000066' : 'transparent',
        position: 'absolute',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%'
    },
    done_button_container: {
        width: '100%',
        padding: 16,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'black',
        borderBottomWidth: 1,
        borderColor: '#999999'
    },
    date_picker_container: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'black'
    },
});