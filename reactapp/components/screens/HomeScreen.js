import React from 'react';
import { StyleSheet, Text, View, Image,TextInput, TouchableOpacity,Modal, TouchableHighlight,PermissionsAndroid,ImageBackground} from 'react-native';

const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      
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

export default class HomeScreen extends React.Component {
  state={
    email:"",
    password:"",
    isFocused: true,
    
   
  }
  componentDidMount(){
   
    //console.log(this.props.route.params.user);
    global.machineid = this.props.route.params.user.user.machineID._id
    global.t = this.props.route.params.user.user.machineID.alarms
    requestPermission();
    requestPermissionread();
   
  }


  render(){
  return (
    <View>
    <Image source={require('./../../assets/home11small.png')}
style={{backgroundColor: '#FFFFFF', width:'100%', height: '50%'}}/>
   <View style={styles.midstyling}></View>
<View style = {styles.overlay}>
          
            </View>
  
      <View style={styles.midstyling}>
      <View style={styles.firsttwo}>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => this.props.navigation.navigate('Web', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/surveillence3.png')} style={styles.img}/>
        <Text style={styles.loginText}>Live Surviellence</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate('Manual', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/click1.png')} style={styles.img}/>
        <Text style={styles.loginText}>Manual Control</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.firsttwo}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate('Complete', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/bar-chart.png')} style={styles.img}/>
        <Text style={styles.loginText}>Cleaning Information </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => this.props.navigation.navigate('Alarm', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/time.png')} style={styles.img}/>
        <Text style={styles.loginText}>Set Cleaning Time</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.firsttwo}>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => this.props.navigation.navigate('Map', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/map-1.png')} style={styles.img}/>
        <Text style={styles.loginText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate('History', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/clean-history.png')} style={styles.img}/>
        <Text style={styles.loginText}>Cleaning History</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.firsttwo}>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => this.props.navigation.navigate('Settings', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/gear1.png')} style={styles.img}/>
        <Text style={styles.loginText}>Go to Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => this.props.navigation.navigate('Gallery', {user: this.props.route.params.user})}>
        <Image source={require('./../../assets/photoo.png')} style={styles.img}/>
         <Text style={styles.loginText}>Go to Gallery</Text>
        </TouchableOpacity>
        </View>
       </View>
       
       

 
      </View>
     
  );}
}
const styles = StyleSheet.create({
  overlay: {
    opacity: 1,
    backgroundColor: '#000000'
  },
  img: {
    width:60,
    height: 50,
    marginTop:10,
    //justifyContent: 'center',
    //alignContent: 'center',
    position: 'absolute'
  },
  midstyling:{
    top: 20,
  },
  firsttwo: {
    flexDirection: 'row',
   // marginTop:10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 160
  },
  loginBtn:{
    width:"47%",
    backgroundColor:"lightblue",
    borderRadius:25,
    height:90,
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"center",
    color:"white",
    fontSize:50,
    marginLeft: 8,
    marginRight:2,
    marginBottom:10
  },
  loginText:{
    color:"white",
    fontSize:15,
    marginTop:70,
    textShadowColor: "black",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1
    },
  },
  avatar: {
    width:60,
    height:60,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    marginBottom:-100,
   marginTop:-390,
    marginLeft: 320
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

