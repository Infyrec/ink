import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Realm from "realm";
import { useSocket } from './Socket';

import { Sender, Stranger } from './Templates';

const dimensions = Dimensions.get('screen');

export default function Messages({ route, navigation }){
  let { emitMessage, messages, setMessage } = useSocket()
  let [userData, setUserData] = useState(null)
  let [written, setWritten] = useState(null)
  let [stranger, setStranger] = useState(null)

  useEffect(() => {
    setStranger(route.params)
    getUserData()

    // navigation.addListener('beforeRemove', (e) => {
    //   e.preventDefault()
    //   console.log('Back button pressed');
    // })
  }, [])

  async function getUserData(){
    try {
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

      const token = tokeSchema.objects('Token');
      setUserData(token[0])
      } 
      catch(err) {
          console.error('Error querying token:', err);
      }
  }

  function sendMessage(){
    console.log(userData);
    if(written != null && written.length > 0){
      /* Sent to peer */
      let payload = {
        message: written,
        sendTo: stranger.email,
        username: userData.username
      }

      /* Added to list */
      let msgFormat = {
        type: 'post', 
        time: currentTime(), 
        name: userData.username, 
        message: written
      }

      setMessage(prev => [msgFormat, ...prev])
      emitMessage('send-msg', payload)
      setWritten('')
    }
  }

  // To get the current time in 12hrs format
  function currentTime(){
    const d = new Date()
    const time = d.getHours()

    if(time > 12){
        let temp = time - 12
        if(d.getMinutes().toString().length === 1){
            let current_time = temp.toString()+':'+'0'+d.getMinutes().toString()+' PM'
            return current_time
        }
        else {
            let current_time = temp.toString()+':'+d.getMinutes().toString()+' PM'
            return current_time
        }
    }
    else if(d.getHours() == 0){
        if(d.getMinutes().toString().length == 1){
            let current_time = '12:'+'0'+d.getMinutes().toString()+' AM'
            return current_time
        }
        else {
            let current_time = '12'+':'+d.getMinutes().toString()+' AM'
            return current_time
        }
    }
    else if(d.getHours() == 12){
        if(d.getMinutes().toString().length == 1){
            let current_time = '12:'+'0'+d.getMinutes().toString()+' PM'
            return current_time
        }
        else {
            let current_time = '12'+':'+d.getMinutes().toString()+' PM'
            return current_time
        }
    }
    else{
        if(d.getMinutes().toString().length == 1){
            let current_time = d.getHours().toString()+':'+'0'+d.getMinutes().toString()+' AM'
            return current_time
        }
        else{
            let current_time = d.getHours().toString()+':'+d.getMinutes().toString()+' AM'
            return current_time
        }
    }
  }

  return(
    <SafeAreaView style={_chatpage.container}>
        <View style={_chatpage.msgArea}>
          <FlatList 
            data={messages}
            inverted={true}
            renderItem={({item}) => (
              item.type == 'post' ? 
              <Sender name={item.name} time={item.time} message={item.message}/>:
              item.type == 'get' ? 
              <Stranger name={item.name} time={item.time} message={item.message}/>:
              null
            )}
          />
        </View>
        <View style={_chatpage.inputBox}>
            <View style={_chatpage.infiled}>
                <TextInput placeholder='Type a message' multiline style={{ width: dimensions.width-60, fontFamily: 'poppins', paddingHorizontal: 8 }}
                value={written} onChangeText={(text) => setWritten(text)}/>
                <TouchableOpacity style={{ backgroundColor: '#296eff', padding: 10, justifyContent: 'center', alignItems: 'center' }} onPress={sendMessage}>
                  <Icon name='send-outline' type='ionicon' color='white'/>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

let _chatpage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  msgArea: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 6,
    marginVertical: 4,
    backgroundColor: '#ebeef5'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4
  },
  infiled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebeef5'
  }
})