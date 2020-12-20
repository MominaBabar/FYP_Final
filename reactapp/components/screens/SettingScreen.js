import React, {Component} from 'react';
import ReactNativeSettingsPage, {
SectionRow,
NavigateRow,
CheckRow,SwitchRow,SliderRow
} from 'react-native-settings-page';
import { View, TouchableOpacity, CheckBox,Text,Image, StyleSheet, TextInput, LayoutAnimation, Button,Platform, Switch,UIManager} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from 'react-native-image-picker'
import {connect} from 'react-redux';
import {notifyclean,notifybattery,getbattery,getclean} from '../../actions/useraction';
import PropTypes from 'prop-types';
class SettingScreen extends React.Component {
  // TODO: implement your navigationOptions
  state = {   
    expanded : false,
    helpexpand : false,
    contactexpand:false,
check: false,
switch: false,
    value: 40,
    enable:false,
    checked:false,
    email:"",
    password:"",
    isFocused: true,
    s:"kk"
   
}
  componentDidMount(){
    this.setState({s:"llll"})
    this.props.getbattery(this.props.route.params.user.user._id);
    this.props.getclean(this.props.route.params.user.user._id);
    setTimeout(()=>{
      this.setState({checked: this.props.user.battery})
      this.setState({enable: this.props.user.clean})
    }, 1000);
  }
constructor(props) {
       super(props);
       if (Platform.OS === 'android') {
           UIManager.setLayoutAnimationEnabledExperimental(true);
       }
   }

_navigateToScreen = ()=> {
const { navigation } = this.props
navigation.navigate('Profile');
}
toggleExpand=()=>{
   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
   this.setState({expanded : !this.state.expanded})
          }
    toggleHelp=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({helpexpand : !this.state.helpexpand})
    }  
    toggleContact=()=>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({contactexpand: !this.state.contactexpand})
        }      
    toggleSwitch = () => {

      this.setState({enable : !this.state.enable});
      const user =  this.props.route.params.user.user;
      console.log(this.props.route.params.user.user._id,!this.state.enable);
      this.props.notifyclean(this.props.route.params.user.user._id);
    }
    toggleCheck = () => {

      this.setState({ checked : !this.state.checked});
      console.log(this.props.route.params.user.user._id,!this.state.checked);
      const user =  this.props.route.params.user.user;
      this.props.notifybattery(user._id);
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

render() {
return (
<ReactNativeSettingsPage>
<SectionRow text='Account'>
       
<View style={{flexDirection:'row'}}>
                <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row}  onPress={() => this.props.navigation.navigate('Profile', {user: this.props.route.params.user})}>
                        <Icon name={'face'} size={25} style={styles.icon} />
                            <Text style={[styles.title ]}>View Profile</Text>
                            <Icon name={'keyboard-arrow-right'} size={25} style={styles.icon1}/>
                        </TouchableOpacity>
                   </View>
                   <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row}  onPress={() => this.props.navigation.navigate('Edit', {user: this.props.route.params.user})}>
                        <Icon name={'create'} size={25}  style={styles.icon}/>
                            <Text style={[styles.title ]}>Edit Profile</Text>
                            <Icon name={'keyboard-arrow-right'} size={25} style={styles.icon1} />
                        </TouchableOpacity>
                   </View>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row} onPress={() => this.props.navigation.navigate('Info', {user: this.props.route.params.user})}>
                        <Icon name={'create'} size={25} style={styles.icon} />
                            <Text style={[styles.title ]}>View Robot Info</Text>
                            <Icon name={'keyboard-arrow-right'} size={25} style={{marginLeft: 0}} />
                        </TouchableOpacity>
                   </View>
                    <View >

                        <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>{
                          this.props.route.params.user.token = null;
                          alert("Logging out...");
                          console.log(this.props.route.params.user)
                          this.props.navigation.navigate('Login')
                          }}>
                        <Icon name={'power-settings-new'} size={25}  style={styles.icon}/>
                        <Text style={{marginLeft:20, fontSize:15, color: 'black'}}>Logout</Text>
                        <Icon name={'keyboard-arrow-right'} size={25} style={{marginLeft:42}}/>
                        </TouchableOpacity>
                    </View>
                    </View>
           </SectionRow>
           <SectionRow>
<View style={{flexDirection:'row'}}>
                <View style={styles.border}>
                   </View>
                   <View style={styles.border}>
                   </View>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <View style={styles.border}>       
                   </View>
                    <View > 
                    </View>
                    </View>
           </SectionRow>
                <SectionRow text='App'>
                    <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row1} onPress={()=>this.toggleExpand()}>
                            <Icon name={'done'} size={25} />
                            <Text style={{color:'black', fontSize:15, marginLeft:20}} >Notify when cleaning done</Text>
                            <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={this.state.enable ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.toggleSwitch}
                            value={this.state.enable}
                            style={{marginLeft:60}}
                            />            
                        </TouchableOpacity>
           
           
                    </View>    
           <View>
                        <TouchableOpacity ref={this.accordian} style={styles.row1} onPress={()=>this.toggleExpand()}>
                            <Icon name={'done'} size={25} />
                            <Text style={{color:'black', fontSize:15, marginLeft:20}}>Notify when Battery is low</Text>
                            <CheckBox
                            value={this.state.checked}
                            onValueChange={this.toggleCheck}
                            style={{marginLeft:60}}
                            />
                        </TouchableOpacity>
           
           
                    </View>    

</SectionRow>
<SectionRow>
<View style={{flexDirection:'row'}}>
                <View style={styles.border}>
                   </View>
                   <View style={styles.border}>
                   </View>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <View style={styles.border}>       
                   </View>
                    <View > 
                    </View>
                    </View>
           </SectionRow>

<SectionRow text='Help and Support'>
                    <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row1} onPress={()=>this.toggleHelp()}>
                            <Icon name={'help'} size={25} />
                            <Text style={{color:'black', fontSize:15, marginLeft:122}}>FAQS</Text>
                            <Icon name={this.state.helpexpand ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} style={{marginLeft:120}} />
                        </TouchableOpacity>
                       
                        {
                            this.state.helpexpand &&
                            <View style={{color:'black', marginLeft:-410, marginTop:60, padding:18}}>
                                <Text>Q. Can more than one account connect to the same machine?</Text>  
                                <Text>Yes multiple accounts can connect to the same machine.</Text>
                                <Text> For first time connect, you need to provide machine ID,</Text>
                                <Text>  after that it will connect automatically.</Text>  
                                <Text>Q. Will the media saved using live surviellence be shared to the </Text>
                                  <Text>organization</Text>  
                                <Text>No, it will be saved in your phone and can only be accesed by you.</Text>  
                                <Text>Are there any other additinal charges after buying machine?</Text>  
                                <Text >No, only one time charge when you buy it.</Text>    
                                
                            </View>
                        }
                       
                    </View>
                    <View>
                        <TouchableOpacity ref={this.accordian} style={styles.row1} onPress={()=>this.toggleContact()}>
                            <Icon name={'email'} size={25} />
                            <Text style={{color:'black', fontSize:15, marginLeft:100}}>Contact info</Text>
                            <Icon name={this.state.contactexpand ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} style={{marginLeft:95}} />
                        </TouchableOpacity>
                        {
                            this.state.contactexpand &&
                            <View style={styles.child}>
                                <Text>Email: cleanroomby@gmail.com</Text>  
                                <Text>Contact no.: +923353722626</Text>  
                            </View>
                        }
                       
                       
                    </View>
       
</SectionRow>
</ReactNativeSettingsPage>
)
}
}


const styles = StyleSheet.create({
    headingstyle: {
      marginLeft:150
    },
    icon:{
        marginLeft: -13
    },
    icon1:{
        marginLeft:20
  },
    title:{
        fontSize: 15,
        marginLeft: 10,
        alignItems:'center',
        justifyContent:'center',
        color: "black"
    },
    row:{
        flexDirection: 'row',
        marginLeft: 15,
        marginBottom:20,
        height:56,
        width:184,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: "lightblue",
        borderRadius:15
    },
    row1:{
      flexDirection: 'row',
      height:56,
      marginBottom:10,
      marginLeft: 15,
     width:380,
      paddingLeft:25,
      paddingRight:20,
      alignItems:'center',
      backgroundColor: "lightblue",
      borderRadius:15
  },
    child:{
        
        padding:16,
        color:'black'
      
    },
    border:{
        flexDirection:'row',
    },
    bottom:{
        borderTopColor:"#731065",
        borderTopWidth:1,
        borderBottomColor:"#731065",
        borderBottomWidth:1.5
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#731065",
        marginBottom:40
      },
      inputView:{
        width:"60%",
        backgroundColor:"white",
       
        height:20,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
        borderColor: "#731065",
        borderWidth: 1
      },
      inputText:{
        height:50,
        color:"white"
      },
      forgot:{
        color:"white",
        fontSize:11
      },
      loginBtn:{
        width:"30%",
        backgroundColor:"#A53896",
        borderRadius:25,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10
      },
      loginText:{
        color:"white"
      },
      avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:130
      },
   
});

SettingScreen.propTypes = {
  notifyclean: PropTypes.func,
  notifybattery: PropTypes.func,
   
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user
});
export default connect(mapStateToProps, { notifybattery,notifyclean,getbattery,getclean })(SettingScreen);

{/* <CheckRow
text='Check Row'
iconName='your-icon-name'
_color='#000'
_value={this.state.check}
_onValueChange={() => { this.setState({ check: !this.state.check }) }} />
<SliderRow
text='Slider Row'
iconName='your-icon-name'
_color='#000'
_min={0}
_max={100}
_value={this.state.value}
            _onValueChange={value => { this.setState({ value }) }} /> */}
{/* <View style={styles.border}>
                        <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=> this.setState({expanded : !this.state.expanded})}>
                        <Icon name={'create'} size={25} />
                            <Text style={[styles.title ]}>Edit Profile</Text>
                            <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} />
                        </TouchableOpacity>
                       
                        {
                            this.state.expanded &&
                            <View style={styles.child}>
                                <View >
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image style={styles.avatar}
            source={{ uri: this.state.photo.uri }}
           
          />
       
        <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
      </View>
       
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Enter Email"
            placeholderTextColor="#731065"
            onChangeText={text => setState({email:text})}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Enter Password"
            placeholderTextColor="#731065"
            onChangeText={text => setState({password:text})}
           
         />
        </View>
       
        <TouchableOpacity style={styles.loginBtn}  onPress={() => navigation.navigate('Home')}>
          <Text style={styles.loginText}>Update</Text>
        </TouchableOpacity>
       

 
      </View>  
                            </View>
                        }
           
                    </View> */}

