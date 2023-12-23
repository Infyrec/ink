import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Realm from "realm";
import { useSocket } from './Socket';
import { callStranger } from '../redux/slize';
import { useDispatch, useSelector } from 'react-redux';

import { Sender, Stranger } from './Templates';

const dimensions = Dimensions.get('screen');

export default function Messages({ route, navigation }){
  
  let { emitMessage, messages, setMessage, offer } = useSocket()
  let userdata = useSelector((state) => state.slize.userdata)
  let stranger = useSelector((state) => state.slize.stranger)
  let voip = useSelector((state) => state.slize.voip)
  let dispatch = useDispatch()

  let [written, setWritten] = useState(null)

  useEffect(() => {
    dispatch(callStranger(route.params))

    // navigation.addListener('beforeRemove', (e) => {
    //   e.preventDefault()
    //   console.log('Back button pressed');
    // })
  }, [])

  useEffect(() => {
    if(voip == 'Calls'){
      navigation.navigate('Calls')
    }
    else if(offer != undefined){
      navigation.navigate('Answers')
    }
  }, [voip, offer])

  function sendMessage(){
    console.log(userdata);
    if(written != null && written.length > 0){
      /* Sent to peer */
      let payload = {
        message: written,
        sendTo: stranger.email,
        username: JSON.parse(userdata).username
      }

      /* Added to list */
      let msgFormat = {
        type: 'post', 
        time: currentTime(), 
        name: JSON.parse(userdata).username, 
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