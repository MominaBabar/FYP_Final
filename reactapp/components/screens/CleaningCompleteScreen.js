import React from 'react';
import {Text, View,StyleSheet,ScrollView, Image, Animated} from 'react-native';
import {connect} from 'react-redux';
import {gethistory} from '../../actions/useraction';
import PropTypes from 'prop-types';
import {ROBOT} from './../../actions/types'
import socketIO from "socket.io-client";

class CleaningCompleteScreen extends React.Component {
  componentDidMount(){
    this.socket = socketIO('ws://'+ROBOT+':5091', {      
      transports: ['websocket'], jsonp: false });   
      this.socket.connect(); 
      
      this.socket.on('connect', () => { 
        console.log('connected to socket server'); 
      }); 
      
    this.socket.emit('get_info');
    this.socket.on("cleaning_info", message => {
      //this.setState({'socketData': message.temperature})
      console.log("response Message", message)
      this.setState({last:message});

  }) 
  }
  state={
  last:{area:0,time:0,distance:0,percent:"0%"}
}
   
    
  
  render(){
    
    return (
      <View style={{ backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
      <Image source={require('./../../assets/cleaninginfo.png')}
style={{width:340, height:250}} />
     </View>
     <View  style={{top:200, left:30, fontSize: 30}}>
     {this.state.last.percent=="100%" &&
     <Text style={{fontSize: 17}}>Cleaning Completed</Text>}
     {this.state.last.percent!="100%" &&
     <Text style={{fontSize: 17}}>Cleaning....</Text>}
     </View>
     <View style={styles.progressBar}>
       <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#87cefa", width:this.state.last.percent}}/>
       </View>
     <View style={styles.percentText}>
       <Text style={{fontSize: 17}}>{this.state.last.percent}</Text>
     </View>
     <View style={styles.info}>
       {/* <View style={styles.itemssamerow}>
       <Text style={styles.textboxheading}>Percent</Text>
       <View style={styles.textDecor}>
    <Text style={styles.textboxdecor}>{this.state.last.percent}%</Text>
       </View>
       </View> */}
       <View style={styles.itemssamerow}>
       <Text style={styles.textboxheading}>Distance</Text>
       <View style={styles.textDecor}>
       <Text style={styles.textboxdecor}>{this.state.last.distance}</Text>
       </View>
       </View>
       <View style={styles.itemssamerow}>
       <Text style={styles.textboxheading}>Time</Text>
       <View style={styles.textDecor}>
       <Text style={styles.textboxdecor}>{this.state.last.time}</Text>
       </View>
       </View>
     </View>
     {/* <View style={{top:475, left:40}}>
       <Text style={{fontSize: 17}}>Cleaning Time: </Text>
     </View>
     <View style={{top:490, left:40}}>
       <Text style={{color: '#1e90ff', fontSize: 16.5, fontWeight: 'bold'}}>{this.state.last.time}</Text>
       </View> */}
     </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      fontSize: 30,
      justifyContent: "center",
      backgroundColor: '#FFFFFF',
    },
    itemssamerow: {
      flex: 1,
       paddingLeft: 10
    },
    textboxheading: {
      fontSize: 17, 
      color: '#483d8b'
    },
    textboxdecor:
    {
      fontSize: 17 , 
      fontWeight:'bold',
      color: '#1e90ff'
    },
    textDecor: {
      top:17,
      width: '78%',
      height: '90%',
      justifyContent:'center',
      padding: 20, 
      borderWidth: 0.6,
      left: -20, 
      alignItems:"center"
    },
    percentText: {
      fontSize: 30,
      top: 260,
       flex:1,
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    info: {
      top: 330,
      left: 30,
      flex: 1,
     flexDirection: 'row',
      justifyContent: 'space-between'
    },
    progressBar: {
      flexDirection:'row',
      height: 30,
      width: '90%',
      backgroundColor: '#FFFFFF',
      borderColor: '#000',
      borderWidth: 2,
      borderRadius: 5,
      top: 250,
      left: 20,
    }
  });
  

 CleaningCompleteScreen.propTypes = {
    gethistory: PropTypes.func,
    history: PropTypes.object
  }
  
  const mapStateToProps = (state) => ({
    user: state.user
  });
  export default connect(mapStateToProps, {gethistory})(CleaningCompleteScreen);