import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text } from '@rneui/themed';
import { useCommonAgent } from './CommonAgent';

import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Upload from './Upload';
import Chat from './Chat';

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

    let { authorized, setAuthorization } = useCommonAgent()

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