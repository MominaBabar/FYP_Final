import { NavigationContainer } from '@react-navigation/native';
import store from './store'
import LoginScreen from './components/screens/LoginScreen'
import HomeScreen from './components/screens/HomeScreen'
import WebScreen from './components/screens/WebScreen';
import PropertiesScreen from './components/screens/PropertiesScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import GalleryScreen from './components/screens/GalleryScreen';
import MapScreen from './components/screens/MapScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import CleaningInfoScreen from './components/screens/CleaningInfoScreen';
import CleaningCompleteScreen from './components/screens/CleaningCompleteScreen';
import TimeScreen from './components/screens/TimeScreen';
import SettingScreen from './components/screens/SettingScreen'
import SplashScreen from './components/screens/SplashScreen';
import EditScreen from './components/screens/EditScreen';
import ImageScreen from './components/screens/ImageScreen';
import ManualScreen from './components/screens/ManualControl';
import ForgetScreen from './components/screens/ForgetScreen';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Text, View,StyleSheet,TouchableOpacity,Button,Image} from 'react-native';

import 'react-native-gesture-handler';
import { navigationRef } from './components/screens/RootNavigation';
import {Provider} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import socketIO from "socket.io-client";
import PushNotification from 'react-native-push-notification'
import {deletealarm} from './actions/useraction';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ROBOT} from './actions/types'

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});

  
export default class App extends React.Component {
  constructor(props){
    super(props);
  
        
  }
  componentDidMount(){
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  
  render()
  {
    return (
      <Provider store={store}>
        <MyStack/>
      </Provider>
    );
  }
 
}

const Stack = createStackNavigator();
function MyStack() {
  console.disableYellowBox= true;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
      <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        /> 
      <Stack.Screen
         
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
         
         name="Forget"
         component={ForgetScreen}
         options={{ headerShown: false }}
       />
        
         <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
         
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Manual"
          component={ManualScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Web"
          component={WebScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Info"
          component={PropertiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{ headerShown: false }}
        />
       
        <Stack.Screen
          name="Alarm"
          component={TimeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cleaning"
          component={CleaningInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Complete"
          component={CleaningCompleteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Image"
          component={ImageScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatar: {
    width: 60,
    height:60,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: "white",
    marginBottom:18,
    marginRight:20,
    marginTop:6
    
  },
});
