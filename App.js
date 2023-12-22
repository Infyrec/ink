import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import store from "./components/redux/store";
import { Provider } from "react-redux";

import Router from "./components/router/Router";

export default function App() {

  const [fontsLoaded] = useFonts({
    'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'poppins-semibold': require('./assets/fonts/Poppins-SemiBold.ttf')
  });

  if(fontsLoaded){
    return (
      <Provider store={store}>
        <Router />
        <StatusBar style="light"/>
      </Provider>
    );
  }
}