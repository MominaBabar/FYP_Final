import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {getuser,forgotuser} from '../../actions/useraction';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import PushNotification from 'react-native-push-notification';
import Spinner from 'react-native-loading-spinner-overlay';

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

const requestPermissionread = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("permission granted");
    } else {
      console.log("permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.myemailInput = React.createRef();
    this.mypassInput = React.createRef();
    this.state={
      email:"",
      password:"",
      isFocused: true,
      spinner: false

      
    }
   

  }
  
  forget = () => {
    this.props.navigation.navigate('Forget');
    
  }
  onSubmit = () => {
    this.setState({spinner: true});
     const user = {
     email: this.state.email,
     password: this.state.password
   }

   this.props.getuser(user);
   //console.log(user);
   this.setState({email:""});
   this.setState({password:""});
   this.myemailInput.current.clear();
   this.mypassInput.current.clear();
  
   setTimeout(()=>{
    //console.log(this.props.user.user);
    if(this.props.user.user.success === true){
      this.setState({spinner:false});
      this.props.navigation.navigate('Home', {user:this.props.user.user })
     

  }
  else{ 
        this.setState({spinner:false});
        alert("Invalid Login or Network error!");
  }
 
 
  }, 8000);
   

 
   
   
 }
 
 
 
 render(){
 
  return (
    <View style={styles.container}>
       <Spinner
          visible={this.state.spinner}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
      <View style={styles.imagestyle}>
      <Image source={require('./../../assets/cleanroombyyy.png')}
style={{width:'100%', height: '64%', resizeMode:
'contain'}} />
      </View>
      <View style={styles.topstyling}>
      <Text style={styles.logo}>Login</Text>
      <View style={styles.midstyling}>
       
        <View style={styles.inputView1} >
          <TextInput  
            style={styles.inputText}
            placeholder="Enter Email"
            ref={this.myemailInput}
            onChangeText={text => this.setState({email:text})}
            />
        </View>
        <View style={styles.inputView2} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Enter Password"
            ref={this.mypassInput}
            onChangeText={text => this.setState({password:text})}
           
         />
         </View>
        </View>
        </View>
        <View style={styles.bottomstyling}>
        
        <TouchableOpacity style={styles.loginBtn}  onPress={this.onSubmit}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.forget}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        </View>
        </View>
       

 
     
  );}
}
const styles = StyleSheet.create({
  imagestyle: {
    top: -110,
      justifyContent: 'center',width: '100%',
      height: '25%',
      backgroundColor: 'lightblue'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topstyling: {
    backgroundColor: 'lightblue',
    width: '100%',
    height: '30%',
    top: -130
  },
  midstyling: {
    width: '80%',
    height: '130%',
    backgroundColor: 'white',
    marginLeft: 40,
    marginRight: 15,
    borderColor: "deepskyblue",
    borderWidth: 1.3,
    borderRadius: 20
  },
  bottomstyling:{
   
    width: '100%'
  },
  logo:{
    marginTop: 10,
    fontSize:40,
   
    color:"white",
    justifyContent: 'center',
    alignItems: 'center',
    left: 150,
    marginBottom:20
  },
  inputView1:{
    width:"80%",
    height: "60%",
    backgroundColor: 'white',
    borderRadius:25,
    height:50,
    marginLeft: 40,
    marginBottom:20,
   
    justifyContent:"center",
    padding:20,
    borderColor: "deepskyblue",
    borderWidth: 2
  },
  inputView2:{
    width:"80%",
    height: "60%",
    backgroundColor: 'white',
    borderRadius:25,
    height:50,
    marginLeft: 40,
    marginBottom:20,
    justifyContent:"center",
    padding:20,
    borderColor: "deepskyblue",
    borderWidth: 2
  },
  inputText:{
    height:50,
    color:"#20b2aa",
    fontSize: 16
  },
  forgot:{
    color:"black",
    fontSize:16,
    alignItems:"center",
    justifyContent:"center",
    marginLeft: 130
  },
  loginBtn:{
    width:"60%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:80,
    marginBottom:10,
    marginLeft: 80
  },
  loginText:{
    color:"white",
    fontSize: 18,
    fontWeight: 'bold'
  }
});

LoginScreen.propTypes = {
  getuser: PropTypes.func.isRequired,
  user: PropTypes.object
}
const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { getuser,forgotuser })(LoginScreen);

