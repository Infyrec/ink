import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';

export default function Calls(){

    let [localStream, setLocalStream] = useState(null)

    useEffect(() => {
        mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            setLocalStream(stream)

            let peer = new RTCPeerConnection()

            stream.getTracks().forEach((track) => {
                peer.addTrack(track, stream)
            })

            let channel = peer.createDataChannel('ink')
    
            channel.onopen = (e) => {
                console.log('Channel Created !');
            }
    
            channel.onmessage = (e) => {
                console.log('Msg Received : ' + e.data);
            }
    
            peer.createOffer()
            .then((offer) => {
                peer.setLocalDescription(offer)
            })
            .catch((err) => {
                console.log(err);
            })
    
            peer.onicecandidate = (e) => {
                console.log(JSON.stringify(peer.localDescription));
            }
        })
    }, [])

    return(
        <View style={_calls.container}>
            {
                localStream != null ?
                <RTCView
                    mirror={true}
                    objectFit={'contain'}
                    streamURL={localStream.toURL()}
                    zOrder={0}
                    style={{ width: '100%', height: '100%' }}
                />:
                <Text>WebRTC Check</Text>
            }
            
        </View>
    )
}

const _calls = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})