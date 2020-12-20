import React from 'react';
import {Text, View,StyleSheet,TouchableOpacity,Image, Animated, Button} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import {connect} from 'react-redux';
import {addmedia,moverobot,addhistory} from '../../actions/useraction';
import PropTypes from 'prop-types';
import {captureScreen} from "react-native-view-shot";
import { WebView } from 'react-native-webview';
import socketIO from "socket.io-client";
import {ROBOT} from './../../actions/types'
import PushNotification from 'react-native-push-notification';


class MapScreen extends React.Component {
  constructor(props){
    super(props);
    this.socket = socketIO('ws://'+ROBOT+':5091', {      
      transports: ['websocket'], jsonp: false,pingTimeout:500000,pingInteval:60000});   
      this.socket.connect(); 
      
      this.socket.on('connect', () => { 
        console.log('connected to socket server'); 
      }); 
      this.socket.emit('get_info');
    this.socket.on("cleaning_info", message => {
      //this.setState({'socketData': message.temperature})
      console.log("response Message", message)
      this.setState({map_formed:message["map"]})
      this.reloadpage()

    }) 
    
    this.state={
      granted:false,
      photo:{},
      map_formed:false,
      is_start:false,
      webviewref: null,
      key:0,
      reset:false,
      uri:'http://'+ROBOT+':8001'
    }

  }
  toggle = () =>{
    this.setState({is_start:!this.state.is_start})
    
  }

  onClick = () => {
        this.toggle();
        if(this.state.is_start==true){
          this.socket.emit("saving_map")
          alert("Map Saved.")
        }
        else{
          this.socket.emit("making_map")
          this.reloadpage()

        }

  }

  reset = () => {
    console.log("reset map")
    alert("Map Reset!")
    this.socket.emit("reset")
    this.setState({is_start:false})
    this.socket.emit('get_info');
    this.socket.on("cleaning_info", message => {
      console.log("response Message", message)
      this.setState({map_formed:message["map"]})
      this.reloadpage()
    })
  }
  componentDidMount() { 
     //this.reloadpage()
  //   this.socket.on("made", message => {
  //     this.toggle()
  //     alert("Map Completed!")
    
  //  }) 
  }

  reloadpage = () =>{
    //this.state.webviewref && this.state.webviewref.reload()
    //this.setState({key:this.state.key+1})
    this.setState({uri:''})
    this.setState({uri:'http://'+ROBOT+':8001'})
  }
  
  onmove(dir){
    if(this.state.is_start==true){
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

    }
    else{
      alert("Press Start to start making map.")
    }
      
    this.socket.on("made", message => {
      console.log(message)
      alert("Map Completed!")
      this.toggle()
      this.reloadpage()
      this.reloadpage()
 
   }) 
   this.socket.emit('get_info');
    this.socket.on("cleaning_info", message => {
      console.log("response Message", message)
      if(this.state.map_formed==false && message["map"]==true){
         alert("Map made and saved.")
         this.reloadpage()
        
      }
      this.setState({map_formed:message["map"]})
    })
    
    
  }

  startCleaning = () =>{
    if(this.state.map_formed==true){
      this.socket.emit("start_cleaning"); 
    PushNotification.localNotification({
      channelId: "channel-id",
      title: "Cleaning Started", // (optional)
      message: "Cleaning Started", // (required)
      });

      setTimeout(()=>{
        console.log("checking for completeness...")
        this.socket.emit('finish_cleaning');
        this.socket.on("finish_response", message => {
           console.log("response Message", message)
            if(message=="true"){
              alert("Map Completed.")
              this.reloadpage()
              PushNotification.localNotification({
                channelId: "channel-id",
                title: "Cleaning Completed", // (optional)
                message: "Cleaning has been completed.", // (required)
                });
                this.socket.emit('get_info');
                this.socket.on("cleaning_info", message => {
                  console.log("response Message", message)
                  var h = {
                  date: new Date(),
                  status:"success",
                  reason_of_failure:"none",
                  distance:message.distance,
                  time:message.time,
                }
                this.props.addhistory(this.props.route.params.user.user.machineID._id,h)
                })
             
           }
        })
      }, 800);
      
    }
    else{
      alert("No map found. First make map.")
    }
  }
       
      render(){
        let webviewref;
      return (
        <View style={styles.container}>
        <WebView
        style={{width:1900}}
        //ref={WEBVIEW_REF => (this.setState({webviewref: WEBVIEW_REF}))}
        source={{
          uri: this.state.uri
        }}
        key={this.state.key}
        
         /> 

        
        
     
<View style={{marginTop: 10, marginBottom:-32, width:190, marginLeft:110}}>
<Button  onPress={() => this.startCleaning()}
  title="Start Cleaning"
  color="lightblue"
  style={styles.autobtn}
  
/>
</View>

<View style={{marginTop:7}}>

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
    }} activeOpacity={0.5} onPress={() => this.reset()}>
     <Image style={styles.image} source={require('./../../assets/reset.png')} />
    </TouchableOpacity>
    </View>
    {this.state.is_start &&
       <View style={{}}>
       <TouchableOpacity style={{top: -30, flexDirection: 'row', left: 252,backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20, width:80,alignContent:'center',
      }} activeOpacity={0.5} onPress={() => this.onClick()}>
          <Image style={styles.image} source={require('../../assets/save-button.png')} />
      </TouchableOpacity>
      </View>
    }
    {!this.state.is_start &&
       <View style={{}}>
       <TouchableOpacity style={{top: -30, flexDirection: 'row', left: 252,backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20, width:80,alignContent:'center',
      }} activeOpacity={0.5} onPress={() => this.onClick()}>
          <Image style={styles.image} source={require('../../assets/start-up.png')} />
      </TouchableOpacity>
      </View>
    }
    
        </View>
      </View>

        
    );
      }
 
}
MapScreen.propTypes = {
  addmedia: PropTypes.func.isRequired,
  moverobot: PropTypes.func.isRequired,
  addhistory: PropTypes.func.isRequired,
   
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, {addmedia,moverobot,addhistory})(MapScreen);
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




