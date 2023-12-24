import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { useSocket } from './Socket';
import Realm from "realm";
import axios from 'axios';
import { endpoints } from '../../endpoints';
import { fsize, hsize, wsize } from '../library/Scale';

let connection = endpoints.connection

export default function Contacts({ navigation }){

    let { socketConnection, activeUsers } = useSocket()

    useEffect(() => {
        socketConnection()
    }, [])

    return(
        <View style={_contact.container}>
            <FlatList
                data={activeUsers}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Messages', item)}>
                        <ListItem bottomDivider>
                            <Avatar
                                rounded
                                source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                                size={wsize(55)}
                            />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontFamily: 'poppins' }}>{item.username}</ListItem.Title>
                                <ListItem.Subtitle style={{ fontFamily: 'poppins' }}>{item.email}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.sockid}
            />
        </View>
    )
}

const _contact = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebeef5'
    }
})