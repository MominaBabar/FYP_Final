import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Platform, TouchableOpacity, Image, View, Text, Alert
} from 'react-native';
export default class SplashScreen extends Component
{
constructor(){ super(); this.state={ isVisible : true,
}
}
componentDidMount(){ var that = this;
setTimeout(()=>this.props.navigation.navigate('Login'), 5000);
   
}

render()
{
let Splash_Screen = (
<View style={styles.SplashScreen_RootView}>
<Image source={require('./../../assets/cleanroombyy.png')}
style={{width:'100%', height: '100%', resizeMode:
'contain'}} />
</View>
 )
return(
<View style = { styles.MainContainer }>
{
(this.state.isVisible === true) ? Splash_Screen : null
}
</View>
);
}
}
const styles = StyleSheet.create(
{
MainContainer:
{
    backgroundColor:'lightblue',
flex: 1,
justifyContent: 'center', alignItems: 'center',
paddingTop: ( Platform.OS === 'android' ) ? 10 : 0
},
SplashScreen_RootView:
{
justifyContent: 'center', flex:1,
margin: 20,
position: 'absolute', width: '100%',
height: '100%',
},

});