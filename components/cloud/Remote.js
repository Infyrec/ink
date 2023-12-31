import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { callNewfile } from '../redux/slize';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { endpoints } from '../../endpoints';
import { fsize, hsize, wsize } from '../library/Scale';
import * as FileSystem from 'expo-file-system';
import LottieView from 'lottie-react-native';

let storage = endpoints.storage

export default function Remote(){

    return(
        <View style={_remote.container}>
            <LottieView
                    autoPlay={true}
                    source={require('../../assets/lottie/wip.json')}
                    style={{
                        width: 300,
                        height: 300
                    }}
            />
        </View>
    )
}

let _remote = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#26282d'
    }
})