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

let storage = endpoints.storage

export default function Upload(){

    let dispatch = useDispatch()
    let [uploadPercentage, setUploadPercentage] = useState(0)

    let handleUpload = async() => {
        try{
            const selectedFile = await DocumentPicker.getDocumentAsync({type: "*/*",});

            let metadata = {
                uid: new Date().getTime(),
                file: selectedFile.assets[0].name,
                size: parseInt(selectedFile.assets[0].size / 1024**2) + ' MB',
                type: selectedFile.assets[0].mimeType,
                date: new Date().getDate().toString() + '/' + parseInt(new Date().getMonth()+1).toString() + '/' + new Date().getFullYear(),
                location: '/',
                meta: {data: null}
            }

            const formData = new FormData();

            const fileData = {
                name: selectedFile.assets[0].name,
                uri: selectedFile.assets[0].uri,
                type: selectedFile.assets[0].mimeType,
                size: selectedFile.assets[0].size,
            };

            formData.append('file', fileData);

            if(selectedFile.assets != null){
                const response = await axios.post(`${storage}/upload`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                      setUploadPercentage(percentCompleted)
                      console.log(`Upload progress: ${percentCompleted}%`);
                    }
                })

                if(response.data.status == 'success'){
                    axios.post(`${storage}/registerUpload`, metadata)
                    .then((res) => {
                        dispatch(callNewfile())
                        setUploadPercentage(0)
                        Alert.alert('Success', 'File uploaded successfully.', [
                            {
                              text: 'Ok',
                              onPress: () => console.log('Pressed Ok'),
                            },
                        ]);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            }
        }
        catch(e){
            console.log('Error : ' + e);
        }
    }

    return(
        <View style={_upload.container}>
            <View style={_upload.hint}>
                <Text style={{ fontFamily: 'poppins', color: 'white', fontSize: fsize(20) }}>{
                    uploadPercentage == 0 ? 'Choose file to upload' : uploadPercentage < 100 ? 'Upload in progress' : 'Processing'
                }</Text>
            </View>
            <AnimatedCircularProgress
                size={wsize(180)}
                width={wsize(10)}
                fill={uploadPercentage}
                tintColor="#39c264"
                backgroundColor="#3d5875"
            >
                {()=>(<Text style={{ color: 'white', fontSize: fsize(30) }}>{uploadPercentage}%</Text>)}
            </AnimatedCircularProgress>
            <TouchableOpacity style={_upload.btn} onPress={handleUpload}>
                <Text style={{ color: 'white', fontFamily: 'poppins', fontSize: fsize(14) }}>
                    Choose File
                </Text>
                <Icon name='document' type='ionicon' color='white' size={fsize(18)} style={{ marginLeft: 10 }}/>
            </TouchableOpacity>
        </View>
    )
}

let _upload = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#26282d'
    },
    hint: {
        marginVertical: hsize(50)
    },
    btn: {
        flexDirection: 'row',
        marginTop: hsize(80),
        paddingVertical: hsize(10),
        paddingHorizontal: wsize(20),
        backgroundColor: '#3b78ff',
        elevation: 4
    }
})