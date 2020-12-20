import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,FlatList,SafeAreaView, LayoutAnimation,ScrollView
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import {connect} from 'react-redux';
import {gethistory} from '../../actions/useraction';
import PropTypes from 'prop-types';

class HistoryScreen extends React.Component {

  componentDidMount(){
    this.setState({d:"ggg"});
    this.setState({d:"999"});
    this.props.gethistory(this.props.route.params.user.user.machineID._id);
    console.log(this.props.user);
    setTimeout(()=>{
      this.setState({listKeys:this.props.user.history});
    }, 900);
     
  }
  state={
  d: "",
  listKeys :[
   
  ]
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
           <Text>Status: {item.status}</Text>  
          <Text>Details: {item.reason_of_failure}</Text>   
           
      </View>
  }
  
  
</View>)
 render(){
 
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView>
              <View style={styles.header}>
                  <Image style={styles.header} source={require('./../../assets/robot.jpg')}/>

              </View>
              <View style={styles.bodyContent}>
                   <Text style={styles.logo}>Cleaning History</Text>
                    
                    </View> 
               <View style={styles.gap}></View>
            <View style={styles.gap}></View>
            <FlatList
                data={this.state.listKeys}
                renderItem={this.listItem}
              />
          </ScrollView>
   </SafeAreaView>
    
    );
                }
  
}

const styles = StyleSheet.create({
  container: {
    flex:1,
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
    width: 400
  },
  gap:{
    
    height:30,
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
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'bold',
    marginTop:80
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
    fontSize:40,
    color:"lightblue",
   
  },

});

HistoryScreen.propTypes = {
  gethistory: PropTypes.func.isRequired,
   
  history: PropTypes.object
}

const mapStateToProps = (state) => ({
  user: state.user
});
export default connect(mapStateToProps, {gethistory})(HistoryScreen);