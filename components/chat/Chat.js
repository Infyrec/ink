import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity } from 'react-native';
import { Avatar, Text, Icon } from '@rneui/themed';
import { SocketHook } from './Socket';
import { callVoip } from '../redux/slize';
import { useSelector, useDispatch } from 'react-redux';
import { fsize, hsize, wsize } from '../library/Scale';

import Contacts from './Contacts';
import Messages from './Messages';
import Calls from './Calls';
import Answers from './Answers';

let Stack = createNativeStackNavigator()

export default function Chat({ navigation }){

    let dispatch = useDispatch()
    let stranger = useSelector((state) => state.slize.stranger)
    let voip = useSelector((state) => state.slize.voip)

    function Title(){
        return(            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    size={wsize(40)}
                    rounded
                    source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: fsize(15), fontFamily: 'poppins' }}>
                        {
                            stranger != null ? stranger.username : 'Unknown'
                        }
                    </Text>
                    {/* <Text style={{ fontSize: 10, fontFamily: 'poppins' }}>Typing...</Text> */}
                </View>
            </View>
        )
    }

    function RightContent(){
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => dispatch(callVoip('Calls'))}>
                    <Icon name='videocam-outline' type='ionicon' color='#6d6d6d' style={{ marginHorizontal: 8 }}/>
                </TouchableOpacity>
                <Icon name='call-outline' type='ionicon' color='#6d6d6d' style={{ marginHorizontal: 8 }}/>
                <Icon name='ellipsis-horizontal-circle-outline' type='ionicon' color='#6d6d6d' style={{ marginHorizontal: 8 }}/>
            </View>
        )
    }

    return(
        <SocketHook>
            <Stack.Navigator screenOptions={{ headerShown: true }}>
                <Stack.Screen name="Contacts" component={Contacts} options={{ 
                    headerTitle: 'Postie',
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginRight: 24 }} onPress={() => navigation.navigate('Home')}>
                            <Icon name='arrow-back' type='ionicon'/>
                        </TouchableOpacity>
                    )
                }}/>
                <Stack.Screen name="Messages" component={Messages} options={{
                    headerTitle:  () => <Title />,
                    headerRight: () => <RightContent />
                }}/>
                <Stack.Screen name="Calls" component={Calls} options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="Answers" component={Answers} options={{
                    headerShown: false
                }}/>
            </Stack.Navigator>
        </SocketHook>
    )
}