import React from 'react';
import {Text, View,StyleSheet,TouchableOpacity,Image, Animated, Button} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import {connect} from 'react-redux';
import {addmedia,moverobot} from '../../actions/useraction';
import PropTypes from 'prop-types';
import {captureScreen} from "react-native-view-shot";
import { WebView } from 'react-native-webview';
import socketIO from "socket.io-client";
import {ROBOT} from './../../actions/types'


class WebScreen extends React.Component {
  constructor(props){
    super(props);
    this.socket = socketIO('ws://'+ROBOT+':5090', {      
      transports: ['websocket'], jsonp: false,pingTimeout:500000,pingInteval:60000 });   
      this.socket.connect(); 
      
      this.socket.on('connect', () => { 
        console.log('connected to socket server'); 
      }); 
    
    this.state={
      granted:false,
      photo:{}
    }
  }
  onSubmit = () => {
        console.log("clicked")
        captureScreen({
          format: "jpg",
          quality: 0.8,
         
        }).then( 
          
          uri => {console.log("Image saved to", uri);
          CameraRoll.save(uri ).then((img) =>{   
            console.log("Image saved to",img);   
            console.log('Picture Saved.');
            
            var n = uri.lastIndexOf("cache/")+6;
            var r = uri.substring(n);
            var j = {filename: r}
            console.log(j)
            this.props.addmedia(this.props.route.params.user.user._id,j); 
            })
            .catch(err => console.log(err)); },
          error => console.error("Oops, snapshot failed", error)
           
         
        );
      }
  componentDidMount() { 
   
  }
  
  onmove(dir){
    //this.setState({move:dir});
    //setTimeout(()=>{
        //console.log(this.props.route.params.user.user.machineID._id,this.state.move);
       // this.props.moverobot(this.props.route.params.user.user.machineID._id,this.state.move);
       //this.socket.emit('forward_con'); 
     if(dir=='w'){
      this.socket.emit('forward_con'); 
      //this.socket.emit("stop_con"); 
     }
     if(dir=='d'){
      this.socket.emit('right_con'); 
      //this.socket.emit("stop_con");  
    }
    if(dir=='a'){
      this.socket.emit('left_con'); 
      //this.socket.emit("stop_con");  
    }
    if(dir=='f'){
      this.socket.emit('back_con'); 
      //this.socket.emit("stop_con"); 
     
    }
    if(dir=='x'){
     this.socket.emit("stop_con"); 
     this.socket.emit("stop_con"); 

     this.socket.emit("stop_con"); 

    }   
    if(dir=='c'){
      this.socket.emit("start_cleaning"); 
      alert("Cleaning Started");
     }   
        
      //}, 100);
    
  }
      
      
      render(){
      return (
        <View style={styles.container}>
       
     
        <WebView
  source={{
    uri: 'http://192.168.1.13:8000'
  }}
  
/> 

<View style={{marginTop:5}}>

<View style={styles.btnstyle}>
     <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={() => this.onmove('w')}>
        <Image source={require('./../../assets/up-arrow.png')}  style={styles.img}/>
    </TouchableOpacity>
    </View>
  
    <View style={{}}>
     <TouchableOpacity style={{top: 110, flexDirection: 'row', left: 100}} activeOpacity={0.5} onPress={() => this.onmove('a')}>
        <Image source={require('./../../assets/back.png')}  style={{width:60,
  height: 70,
  }}/>
    </TouchableOpacity>
    </View>
    <View style={{}}>
     <TouchableOpacity style={{top: 50, flexDirection: 'row', left: 180}} activeOpacity={0.5} onPress={() => this.onmove('x')}>
        <Image source={require('./../../assets/st.png')}  style={{width:60,
  height: 60,
  }}/>
    </TouchableOpacity>
        </View>
        <View style={{}}>
     <TouchableOpacity style={{top: -20, flexDirection: 'row', left: 252}} activeOpacity={0.5} onPress={() => this.onmove('d')}>
        <Image source={require('./../../assets/right-arrow.png')}  style={styles.playimg}/>
    </TouchableOpacity>
    </View>
    <View style={{}}>
     <TouchableOpacity style={{top:5,left:175}} activeOpacity={0.5} onPress={() => this.onmove('f')}>
        <Image source={require('./../../assets/down-arrow.png')}  style={styles.img}/>
    </TouchableOpacity>
    </View>
    <View style={{}}>
     <TouchableOpacity style={{top: 40, flexDirection: 'row', left: 100,backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15, width:80,alignContent:'center', paddingHorizontal: 20,
    }} activeOpacity={0.5} onPress={() => this.onmove('a')} onPress={() => this.props.navigation.navigate('Gallery', {user: this.props.route.params.user})}>
     <Image style={styles.image} source={require('./../../assets/photo.png')} />
    </TouchableOpacity>
    </View>
    <View style={{}}>
     <TouchableOpacity style={{top: -30, flexDirection: 'row', left: 252,backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20, width:80,alignContent:'center',
    }} activeOpacity={0.5} onPress={() => this.onmove('d')} onPress={this.onSubmit}>
        <Image style={styles.image} source={require('../../assets/ar-camera.png')} />
    </TouchableOpacity>
    </View>
        </View>
      </View>

        
    );
      }
 
}
WebScreen.propTypes = {
  addmedia: PropTypes.func.isRequired,
  moverobot: PropTypes.func.isRequired,
   
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, {addmedia,moverobot})(WebScreen);
const styles = StyleSheet.create({
  autobtn:{
    backgroundColor: 'red',
    top:-900,
    width: '60%',
    height:200
  },
  btnstyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
btn:{
   top: 60,
   height: 60,
   width: 60
},
img: {
  width:60,
  height: 60,
  
},
playimg: {
  width:70,
  height: 70
},
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'black',
      padding: 8,
      overflow:'hidden',
      height:90
    },
    percentText: {
      fontSize: 30,
      top: 200,
       flex:1,
      alignItems: 'center',
     
    },
    progressBar: {
      height: 30,
      width: '90%',
      flexDirection:'row',
      backgroundColor: '#FFFFFF',
      borderColor: '#000',
      borderWidth: 2,
      borderRadius: 5,
      top: 175,
      left: 20,
    },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  image:{
    height:40,
    width:40
  },
    capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  image:{
    height:40,
    width:40,
    //marginLeft:40
  },
});




