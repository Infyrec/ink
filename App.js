import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import { CommonAgent } from "./components/CommonAgent";

import Router from "./components/Router";

export default function App() {

  const [fontsLoaded] = useFonts({
    'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'poppins-semibold': require('./assets/fonts/Poppins-SemiBold.ttf')
  });

  if(fontsLoaded){
    return (
      <CommonAgent>
        <Router />
        <StatusBar style="light"/>
      </CommonAgent>
    );
  }
}