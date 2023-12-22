import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity } from 'react-native';
import { Avatar, Text, Icon } from '@rneui/themed';
import { SocketHook } from './Socket';
import Contacts from './Contacts';
import Messages from './Messages';
import Calls from './Calls';

let Stack = createNativeStackNavigator()

export default function Chat({ navigation }){

    function Title(){
        return(            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar
                    size={40}
                    rounded
                    source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'poppins' }}>Ragul</Text>
                    {/* <Text style={{ fontSize: 10, fontFamily: 'poppins' }}>Typing...</Text> */}
                </View>
            </View>
        )
    }

    function RightContent(){
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='videocam-outline' type='ionicon' color='#6d6d6d' style={{ marginHorizontal: 8 }}/>
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
                <Stack.Screen name="calls" component={Calls}/>
            </Stack.Navigator>
        </SocketHook>
    )
}