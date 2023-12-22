// LoginForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Card, Input, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { z } from 'zod';
import axios from 'axios';
import { endpoints } from '../endpoints';

let endpoint = endpoints.authentication

const credSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
})

export default function Signup({ navigation }){
    let [cred, setCred] = useState({
        username: '',
        email: '',
        password: ''
    })
    let [indicate, setIndicate] = useState(false)
    let [loader, setLoader] = useState(false)

    useEffect(() => {
        if(cred.username.length != 0){
            let delay = setInterval(() => {
                clearInterval(delay)
                axios.post(`${endpoint}/uname`, {name: cred.username}, {withCredentials: true})
                .then((res) => {
                    if(res.data.status == 'available'){
                        setIndicate(true)
                    }
                    else{
                        setIndicate(false)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })   
            }, 2000)
        }
        else{
            setIndicate(null)
        }
    }, [cred.username])

    let processSignup = () => {
        try{
            setLoader(true)
            let result = credSchema.parse(cred)
            
            axios.post(`${endpoint}/signup`, cred, {withCredentials: true})
              .then((res) => {
                let status = res.data.status
                if(status == 'success'){
                    setLoader(false)
                    navigation.navigate('Login')
                }                
              })
              .catch((err) => {
                setLoader(false)
                console.log('Line no 66 : ' + err);
                Alert.alert('Network Error', 'Network error. Please try again.', [
                    {
                      text: 'Ok',
                      onPress: () => console.log('Pressed Ok'),
                    },
                ]);
              });
        }
        catch(err){
            console.log('Line no 77 : ' + err);
            setLoader(false)
            Alert.alert('Invalid Credentials', '1. Fields should not be empty\n2. Email should be unique\n3. Password 8 characters', [
                {
                  text: 'Ok',
                  onPress: () => console.log('Pressed Ok'),
                },
            ]);
        }
    }

  return (
    <LinearGradient colors={['#26282D', '#26282D']} style={_signup.container}>
        <Card containerStyle={_signup.card}>
            <Card.Title style={_signup.cardTitle}>Welcome to Ink</Card.Title>
            <View style={{ marginVertical: 8 }}>
                <Input
                    placeholder="Username"
                    leftIcon={<Icon name="account-box" size={24} />}
                    onChangeText={(text) => setCred(prev => ({...prev, username: text}))}
                    value={cred.username}
                    style={{ fontFamily: 'poppins', color: indicate ? '#00d1b2' : '#ff3860'}}
                />
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
                <TouchableOpacity style={_signup.btn} onPress={processSignup}>
                    <Text style={{ color: 'white', fontSize: 18, fontFamily: 'poppins-semibold' }}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 30 }} onPress={() => navigation.navigate('Login')}>
                    <Text style={{ textDecorationLine: 'underline', fontFamily: 'poppins' }}>Already having an account? Login</Text>
                </TouchableOpacity>
            </View>
        </Card>
        <Modal visible={loader}>
            <View style={_signup.loader}>
                <Image source={require('../assets/lottie/loader.gif')}
                    style={{
                        width: 300,
                        height: 300
                    }}
                />
            </View>
        </Modal>
    </LinearGradient>
  );
};

const _signup = StyleSheet.create({
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