import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text } from '@rneui/themed';
import { callAuthorize } from '../redux/slize';
import { useSelector } from 'react-redux';

import Login from '../authentication/Login';
import Signup from '../authentication/Signup';
import Home from '../cloud/Home';
import Upload from '../cloud/Upload';
import Chat from '../chat/Chat';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthScreen(){
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
    )
}

function MainScreen(){
    return(
        <Tab.Navigator screenOptions={{ 
                headerShown: false, 
                tabBarShowLabel: false, 
                tabBarActiveTintColor: '#3b78ff'
            }}>
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ color }) => (
                    <Icon name="file-tray-stacked" type="ionicon" size={24} color={color} />
                )
            }}/>
            <Tab.Screen name="Upload" component={Upload} options={{
                tabBarIcon: ({ color }) => (
                    <Icon name="cloud-upload" type="ionicon" size={24} color={color} />
                )
            }}/>
            <Tab.Screen name="Chat" component={Chat} options={{
                tabBarIcon: ({ color }) => (
                    <Icon name="chatbox-ellipses" type="ionicon" size={24} color={color} />
                ),
                tabBarStyle: {
                    display: 'none'
                }
            }}/>
        </Tab.Navigator>
    )
}

export default function Router() {

    let authorized = useSelector((state) => state.slize.authorized)

    return (
        <NavigationContainer>
            {
                authorized ?
                <MainScreen />:
                <AuthScreen />
            }
        </NavigationContainer>
    );
}