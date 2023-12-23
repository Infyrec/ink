// LoginForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Card, Input, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { z } from "zod";
import { endpoints } from '../../endpoints';
import { callAuthorize, callUserdata } from '../redux/slize';
import { useDispatch } from 'react-redux';
import Realm from "realm";

const credSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

let endpoint = endpoints.authentication

export default function Login({ navigation }){
    let dispatch = useDispatch()
    let [cred, setCred] = useState({
        email: null,
        password: null
    })
    let [loader, setLoader] = useState(true)

    useEffect(() => {
        autoLogin()
    }, [])

    let storeCookie = async(props) => {
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

            await tokeSchema.write(() => {
                tokeSchema.create('Token', props);
            });

            const token = tokeSchema.objects('Token');
            dispatch(callUserdata(JSON.stringify(token[0])))
            dispatch(callAuthorize(true))
        } 
        catch(err) {
            setLoader(false)
            console.error('Error adding token to Realm:', err);
        }
    }

    let autoLogin = async() => {
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

            axios.post(`${endpoint}/app/verfiy`, token[0], {withCredentials: true})
            .then((res) => {
                let status = res.data.status
                if(status == 'success'){
                    dispatch(callUserdata(JSON.stringify(token[0])))
                    dispatch(callAuthorize(true))
                }
            })
            .catch((err) => {
                setLoader(false)
                console.log('Line 82 : ' + err);
            })
        } 
        catch(err) {
            console.error('Error querying token:', err);
        }
    }

    let processLogin = () => {
        try{
            setLoader(true)
            let result = credSchema.parse(cred)
            
            axios.post(`${endpoint}/app/login`, cred, {withCredentials: true})
              .then((res) => {
                    if(res.data.status == 'success'){
                        storeCookie(res.data.token)
                    }    
              })
              .catch((err) => {
                setLoader(false)
                Alert.alert('Login Failed', 'Wrong email and password.', [
                    {
                      text: 'Ok',
                      onPress: () => console.log('Pressed Ok'),
                    },
                ]);
              });
        }
        catch(e){
            setLoader(false)
            console.log('Error: ' + e);

            Alert.alert('Invalid', 'Invalid email or password', [
                {
                  text: 'Ok',
                  onPress: () => console.log('Pressed Ok'),
                },
            ]);
        }
    }
    
    if(!loader){
        return (
            <LinearGradient colors={['#26282D', '#26282D']} style={_login.container}>
                <Card containerStyle={_login.card}>
                    <Card.Title style={_login.cardTitle}>Welcome to Ink</Card.Title>
                    <View style={{ marginVertical: 8 }}>
                        <Input
                            placeholder="Email"
                            leftIcon={<Icon name="email" size={24} />}
                            onChangeText={(text) => setCred(prev => ({...prev, email: text}))}
                            value={cred.email}
                            style={{ fontFamily: 'poppins' }}
                        />
                        <Input
                            placeholder="Password"
                            secureTextEntry
                            leftIcon={<Icon name="lock" size={24} />}
                            onChangeText={(text) => setCred(prev => ({...prev, password: text}))}
                            value={cred.password}
                            style={{ fontFamily: 'poppins' }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={_login.btn} onPress={processLogin }>
                            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'poppins-semibold' }}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => navigation.navigate('Signup')}>
                            <Text style={{ textDecorationLine: 'underline', fontFamily: 'poppins' }}>New to Ink? Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </LinearGradient>
          )
    }
    else {
        return(
            <View style={_login.loader}>
                <Image source={require('../../assets/lottie/loader.gif')}
                    style={{
                        width: 300,
                        height: 300
                    }}
                />
            </View>
        )
    }
};

const _login = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#26282d'
    },
    card: {
        borderRadius: 12,
        backgroundColor: 'white', 
        borderColor: 'white',
        padding: 18,
        minWidth: 320
    },
    cardTitle: {
        fontSize: 28, 
        fontWeight: 'normal',
        fontFamily: 'poppins-semibold',
    },
    btn: {
        backgroundColor: '#3b78ff',
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        elevation: 4
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});