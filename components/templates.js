import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Icon } from '@rneui/themed';

/* Sender Message UI */
export function Sender({ name, time, message }){
  return(
      <View style={_sender.layout}>
        <View style={_sender.lineOne}>
          <Avatar
            size={32}
            rounded
            source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
          />
          <Text style={{ marginHorizontal: 6, fontFamily: 'poppins' }}>{name}</Text>
          <Text style={{ marginHorizontal: 6, fontFamily: 'poppins', color: '#b3b3b3' }}>{time}</Text>
        </View>
        <View style={_sender.lineTwo}>
          <Text style={{ color: 'white', fontFamily: 'poppins' }}>{message}</Text>
        </View>
      </View>
  )
}

let _sender = StyleSheet.create({
  layout: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: 5
  },
  lineOne: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 3
  },
  lineTwo: {
    maxWidth: '80%',
    backgroundColor: '#296eff',
    marginVertical: 3,
    padding: 10,
    marginRight: 25,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  }
})


/* Stranger message UI */
export function Stranger({ name, time, message }){
    return(
        <View style={_stranger.layout}>
          <View style={_stranger.lineOne}>
            <Avatar
              size={32}
              rounded
              source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
            />
            <Text style={{ marginHorizontal: 6, fontFamily: 'poppins' }}>{name}</Text>
            <Text style={{ marginHorizontal: 6, fontFamily: 'poppins', color: '#b3b3b3' }}>{time}</Text>
          </View>
          <View style={_stranger.lineTwo}>
            <Text style={{ color: 'white', fontFamily: 'poppins' }}>{message}</Text>
          </View>
        </View>
    )
}

let _stranger = StyleSheet.create({
    layout: {
      width: '100%',
      alignItems: 'flex-start',
      marginVertical: 5
    },
    lineOne: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 3
    },
    lineTwo: {
      maxWidth: '80%',
      backgroundColor: '#296eff',
      marginVertical: 3,
      padding: 10,
      marginLeft: 25,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderTopRightRadius: 10
    }
})