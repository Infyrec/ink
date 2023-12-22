import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Avatar, ListItem } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { useCommonAgent } from './CommonAgent';
import { endpoints } from '../endpoints'
import axios from 'axios';
import * as FileSystem from 'expo-file-system'
import Realm from "realm";

let storage = endpoints.storage

export default function Home(){

    let { percentage, diskspace, fileList, readFiles, setAuthorization } = useCommonAgent()
    let [menu, openMenu] = useState(false)
    let [selected, setSelected] = useState(null)
    let [downloadProgress, setDownloadProgress] = useState(0)

    const startDownload = async () => {
        const fileURI = FileSystem.documentDirectory+selected.file;
        const fileURL = storage+'/download?file='+selected.uid+'.'+selected.file.split('.')[1]
        try{
            const downloadObject = FileSystem.createDownloadResumable(fileURL, fileURI, {}, (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                setDownloadProgress(progress.toFixed(2) * 100)
                console.log(`Download Progress: ${progress.toFixed(2) * 100}%`);
            });
            const { uri } = await downloadObject.downloadAsync();

            let permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

            if(permission.granted){
                let base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
                await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, selected.file, selected.type)
                .then(async(uri) => {
                    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 })
                    console.log('File stored successfully...!');
                    setDownloadProgress(0)
                    Alert.alert('Success', 'File downloaded successfully.', [
                        {
                          text: 'Ok',
                          onPress: () => console.log('Pressed ok'),
                        },
                    ]);
                })
                .catch((err) => {
                    console.log('Line no 36 : ' + err);
                })
            }
        }
        catch(err){
            Alert.alert('Error', 'Server error. Please try again.', [
                {
                  text: 'Ok',
                  onPress: () => console.log('Pressed ok'),
                },
            ]);
            console.log('Line no 52 : ' + err);
        }
    }

    const deleteFile = () => {
        if(selected != null){
            axios.post(`${storage}/delete`, selected)
            .then((res) => {
                console.log('File deleted successfully.');
                readFiles()
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    const logOut = async() => {
        try{
            const tokeSchema = await Realm.open({
                schema: [
                  {
                    name: 'Token',
                    properties: {
                      username: 'string',
                      email: 'string',  
                      token: 'string',
                    },
                  },
                ],
            })

            tokeSchema.write(() => {
                const token = tokeSchema.objects('Token')
                tokeSchema.delete(token)
                setAuthorization(false)
            })
        }
        catch(e){
            console.log('Failed to logout', e);
        }
    }

    return(
        <View style={_home.container}>
            <View style={_home.header}>
                <Avatar
                size={38}
                rounded
                source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
                />
                <TouchableOpacity style={_home.logoutBtn} onPress={logOut}>
                    <Icon name="log-out" type="ionicon" size={30} color="white"/>
                </TouchableOpacity>
            </View>
            <Text style={[_home.titleOne, {paddingHorizontal: 20}]}>Storage</Text>
            <View style={_home.chart}>
                <AnimatedCircularProgress
                    size={150}
                    width={10}
                    fill={parseInt(percentage)}
                    tintColor="#39c264"
                    backgroundColor="#3d5875"
                >
                    {()=>(<Text style={{ color: 'white', fontSize: 30 }}>{Math.round(percentage)}%</Text>)}
                </AnimatedCircularProgress>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'white', fontFamily: 'poppins-semibold', fontSize: 16, marginVertical: 4 }}>Available Size: {diskspace.free} GB</Text>
                    <Text style={{ color: 'white', fontFamily: 'poppins-semibold', fontSize: 16, marginVertical: 4 }}>Total Size: {diskspace.size} GB</Text>
                </View>
            </View>
            <View style={_home.listView}>
                <Text style={_home.titleOne}>All Files</Text>
                <View>
                    <FlatList
                        data={fileList}
                        renderItem={({item}) => (
                            <TouchableOpacity>
                                <ListItem bottomDivider containerStyle={{ backgroundColor: '#26282d' }}>
                                    <Avatar
                                        source={require('../assets/docs.png')}
                                        size={50}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ color: 'white', fontFamily: 'poppins' }}>
                                            {item.file}
                                        </ListItem.Title>
                                        <ListItem.Subtitle style={{ color: 'white', fontFamily: 'poppins', fontSize: 12 }}>
                                            {`Type: ${item.type} | Size: ${item.size}`}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                    <TouchableOpacity onPress={() => {
                                        setSelected(item)
                                        openMenu(true)
                                    }}>
                                        <Icon name="grid" type="ionicon" size={24} color="white" />
                                    </TouchableOpacity>
                                </ListItem>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.uid}
                    />
                </View>
                <View style={[downloadProgress == 0 ? {display: 'none'} : {display: 'flex'}, _home.download]}>
                    <AnimatedCircularProgress
                        size={60}
                        width={6}
                        fill={Math.round(downloadProgress)}
                        tintColor="#39c264"
                        backgroundColor="#3d5875"
                    >
                        {()=>(<Text style={{ color: 'white', fontSize: 10 }}>{Math.round(downloadProgress)}%</Text>)}
                    </AnimatedCircularProgress>
                </View>
            </View>
            <Modal visible={menu} transparent={true} animationType='slide'>
                <View style={_home.submenu} onTouchEnd={() => openMenu(false)}>
                    <View style={{ justifyContent: 'space-around', backgroundColor: 'white', paddingHorizontal: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={startDownload}>
                            <Icon name="cloud-download" type="ionicon" size={24} color="black" />
                            <Text style={{ fontFamily: 'poppins', fontSize: 18, marginHorizontal: 6, marginVertical: 10 }}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="pencil" type="ionicon" size={24} color="black" />
                            <Text style={{ fontFamily: 'poppins', fontSize: 18, marginHorizontal: 6, marginVertical: 10 }}>Rename</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={deleteFile}>
                            <Icon name="trash" type="ionicon" size={24} color="black" />
                            <Text style={{ fontFamily: 'poppins', fontSize: 18, marginHorizontal: 6, marginVertical: 10 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const _home = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#26282d'
    },
    chart: {
        flexDirection: 'row',
        marginVertical: 20,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 20
    },
    listView: {
        flexGrow: 1,
        paddingHorizontal: 20
    },
    titleOne: { 
        fontFamily: 'poppins',
        color: 'white', 
        marginTop: 20,
        fontSize: 20
    },
    submenu: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    download: {
        position: 'absolute',
        bottom: 24,
        right: 10
    }
})