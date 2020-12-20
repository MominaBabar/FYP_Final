import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {getuser,forgotuser} from '../../actions/useraction';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';

class ForgetScreen extends React.Component {
  constructor(props){
    super(props);
    this.myemailInput = React.createRef();
    this.state={
      email:"",
      isFocused: true,
      spinner: false

      
    }
   

  }
  
  onSubmit = () => {
    this.setState({email:""});
    this.myemailInput.current.clear();
    this.props.navigation.navigate('Login');

  }
  forget = () => {
    this.setState({spinner: true});
     const user = {
     email: this.state.email
   }
   console.log(user);
   this.props.forgotuser(user);
   this.setState({email:""});
   this.myemailInput.current.clear();

   setTimeout(()=>{
    //console.log(this.props.user.user);
    console.log(this.props.user.forgot);
    if(this.props.user.forgot.success === true){
      this.setState({spinner:false});
      alert("Password Reset! Check mail.");
      this.props.navigation.navigate('Login');
    }
  else{ 
        this.setState({spinner:false});
        alert("Invalid Email or Network error!");
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
      <Text style={styles.logo}>Forget Password</Text>
      <View style={styles.midstyling}>
       
        <View style={styles.inputView1} >
          <TextInput  
            style={styles.inputText}
            placeholder="Enter Email"
            ref={this.myemailInput}
            onChangeText={text => this.setState({email:text})}
            />
        </View>
        </View>
        </View>
        <View style={styles.bottomstyling}>
       
        <TouchableOpacity style={styles.loginBtn}  onPress={this.forget}>
          <Text style={styles.loginText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onSubmit}>
          <Text style={styles.forgot}>Login Now?</Text>
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
    height: '100%',
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
    left: 50,
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
    marginLeft: 160
  },
  loginBtn:{
    width:"60%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:50,
    marginBottom:10,
    marginLeft: 80
  },
  loginText:{
    color:"white",
    fontSize: 18,
    fontWeight: 'bold'
  }
});

ForgetScreen.propTypes = {
  getuser: PropTypes.func.isRequired,
  user: PropTypes.object
}
const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { getuser,forgotuser })(ForgetScreen);

