import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callVoip } from '../redux/slize';
import { useSocket } from './Socket';
import {
	RTCPeerConnection,
	RTCView,
	mediaDevices,

} from 'react-native-webrtc';

let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        },
        {
            url: 'turn:relay1.expressturn.com:3478?transport=udp',
            credential: 'efQ8LDAMIE1NZNCTVG',
            username: 'gfFppa3Ell0Do25S'
        }
    ]
}

let ice = null

export default function Answers({ navigation }){

    let peer = useRef(new RTCPeerConnection(servers))
    let dispatch = useDispatch()
    let userdata = useSelector((state) => state.slize.userdata)
    let voip = useSelector((state) => state.slize.voip)
    let stranger = useSelector((state) => state.slize.stranger)
    //let ice = useSelector((state) => state.slize.ice)
    let { emitMessage, offer, answer } = useSocket()
    let [localStream, setLocalStream] = useState(null)

    useEffect(() => {
        if(offer != undefined){
            /* To answer the call */
            mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) => {       
                stream.getTracks().forEach((track) => {
                    peer.current.addTrack(track, stream)
                })

                peer.current.setRemoteDescription(JSON.parse(offer))
        
                peer.current.ondatachannel = (e) => {
                    let channel = e.channel
        
                    channel.onopen = (e) => {
                        console.log('Connection Opened !');
                        channel.onmessage = (e) => {
                            console.log(e.data);
                        }
                    }
                }
        
                return peer.current.createAnswer()
            })
            .then((answer) => peer.current.setLocalDescription(answer))
            .catch((err) => {
                console.log(err);
            })
    
            peer.current.onicecandidate = (e) => {
                if(e.candidate){
                    ice = peer.current.localDescription
                }
                else if(e.candidate == null){
                    let meta = {...stranger, peer: JSON.stringify(ice)}
                    emitMessage('accept-call', meta)
                }
            }

            peer.current.ontrack = (e) => {
                console.log('Answers stream');
                setLocalStream(e.streams[0])
            }
        }
    }, [offer])
    
    useEffect(() => {
        if(voip == 'Messages'){
            navigation.navigate('Messages')
        }
    }, [voip])

    return(
        <View style={_calls.container}>
            {
                localStream != null ?
                <RTCView
                    mirror={true}
                    objectFit={'cover'}
                    streamURL={localStream.toURL()}
                    zOrder={0}
                    style={{ width: '100%', height: '100%' }}
                />:
                <Text>WebRTC Check</Text>
            }
            <View style={_calls.buttons}>
                <TouchableOpacity style={_calls.design}>
                    <Icon name='camera-reverse' type='ionicon' color='white'/>
                </TouchableOpacity>
                <TouchableOpacity style={_calls.design}>
                    <Icon name='mic' type='ionicon' color='white'/>
                </TouchableOpacity>
                <TouchableOpacity style={_calls.design}>
                    <Icon name='videocam' type='ionicon' color='white'/>
                </TouchableOpacity>
                <TouchableOpacity style={[_calls.design, {backgroundColor: '#ff3860'}]}
                onPress={() => dispatch(callVoip('Messages'))}>
                    <Icon name='call' type='ionicon' color='white'/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const _calls = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, 
    design: { 
        backgroundColor: '#26282D', 
        padding: 16, 
        borderRadius: 50, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
})