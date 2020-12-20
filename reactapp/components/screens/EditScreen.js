import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,FlatList,SafeAreaView, TextInput, Button,LayoutAnimation,ScrollView
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import {connect} from 'react-redux';
import {edituser} from '../../actions/useraction';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';

class EditScreen extends React.Component {
 constructor(props){
  super(props);
  this.mycInput = React.createRef();
  this.mypassInput = React.createRef();
  this.state={
    email:this.props.route.params.user.user.email,
    password:"",
    cpassword:"",
    isFocused: true,
 
  photo:{uri:"./../../assets/girlpng.png"}
}
 }
  
  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
          console.log(response)
        this.setState({ photo: response })

      }
    })
  } 
  onSubmit = () => {
    if( this.state.password=== this.state.cpassword)
    {
      const user =  this.props.route.params.user
      user.user.password = this.state.password
      
      this.props.edituser(user);
      console.log("user Updated")
      this.mycInput.current.clear();
      this.mypassInput.current.clear();
      alert("Updated password");
    }
    else{
      alert("Password and Confirm password do not match");
      this.mycInput.current.clear();
      this.mypassInput.current.clear();
    }
  }  
  
  toggle=(index)=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    var newArray = [...this.state.listKeys ];
    var newitem = newArray[index] ;
    newitem.expand = !newitem.expand;
    newArray[index] = newitem
   
    this.setState({listKeys:newArray});
    } 
 listItem = ({item, index}) => (
   
  <View style={styles.border}>
  <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggle(index)}>
      <Icon name={'history'} size={25} />
 <Text style={[styles.title, styles.font]}>Date/Time: {item.date}</Text>
      <Icon name={item.expand ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} />
  </TouchableOpacity>
  {
     item.expand &&
      <View style={styles.child}>
          <Text>Details: {item.reason_of_failure}</Text>   
           
      </View>
  }
  
  
</View>)


 render()
 {
 
    return (
      
     
        
     
            
                
                
                <View style={styles.container}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: this.props.route.params.user})}>
               <Image style={styles.avatar} source={require('./../../assets/girlpng.png')}/>
                    <Text style={styles.description}>{this.state.email}</Text>
            </TouchableOpacity>
            <View style={styles.vgap} ></View> 
        <Text style={styles.logo}>Edit Profile</Text>
       
        <View style={styles.gap} ></View>
        <View style={styles.inputView} >
          <TextInput
             secureTextEntry 
            style={styles.inputText}
            placeholder="Enter Password" 
            ref={this.mycInput}
            onChangeText={text => this.setState({cpassword:text})}
            />
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            ref={this.mypassInput}
            style={styles.inputText}
            placeholder="Confirm Password" 
            
            onChangeText={text => this.setState({password:text})}
            
         />
        </View>
        <TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={this.onSubmit}>
          <Text style={styles.loginText}>Update</Text>
        </TouchableOpacity>
        

  
      </View>
             
     
    );
                }
  
}

const styles = StyleSheet.create({
  description:{
    
    color: "#696969",
    marginTop:10,
    fontSize:18,
    alignSelf:'center',
  },
  container: {
    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
    
    
   },
   avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    marginTop:20
    
  },

   row:{
    flexDirection: 'row',
    justifyContent:'space-between',
    height:56,
    paddingLeft:25,
    paddingRight:18,
    alignItems:'center',
    backgroundColor: "white",
},
   child:{
    backgroundColor:"white",
    padding:16,
},
border:{
    
    borderTopColor:"#731065",
    borderTopWidth:1,
    marginLeft:10,
},
bottom:{
    borderTopColor:"#731065",
    borderTopWidth:1,
    borderBottomColor:"#731065",
    borderBottomWidth:1.5
},
   
  header:{
    
    height:200,
    width: 500
  },
  gap:{
    
    height:20,
  },
  vgap:{
    
    height:60,
  },

  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600",
    alignSelf:'center',

  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    
    color: "#696969",
    marginTop:10,
    fontSize:18,
    textAlign: 'justify'
  },
  buttonContainer: {
    width:"60%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:80,
    
    marginBottom:20,
    color: "white"
  },
  
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"lightblue",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"white",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20,
    borderColor: "deepskyblue",
    borderWidth: 1
  },
  inputText:{
    width:240,
    height:70,
    color:"deepskyblue"
  },
  lBtn:{
    width:"110%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
   
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});

EditScreen.propTypes = {
  edituser: PropTypes.func,
   
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user
});
export default connect(mapStateToProps, {edituser})(EditScreen);