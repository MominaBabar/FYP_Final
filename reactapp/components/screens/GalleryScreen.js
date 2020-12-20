import {Text, View,StyleSheet,ScrollView,TouchableOpacity,Button,Image,FlatList,SafeAreaView} from 'react-native';
import React from 'react';
import CameraRoll from "@react-native-community/cameraroll";
import {connect} from 'react-redux';
import {getmedia} from '../../actions/useraction';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';

class GalleryScreen extends React.Component{
  state={
    photos: [],
    t:[],
    list:[],
    d:"",
    spinner: false
  }
  componentDidMount(){
    this.setState({photos:[]});
    this.setState({spinner:true});
  
    this.props.getmedia(this.props.route.params.user.user._id);
    
    

    this.setState({d: "ll"});
    
    setTimeout(()=>{
      this.setState({list: this.props.user.media});
      this._handleButtonPress();
    }, 700);
     
    
    
   }
   
   _handleButtonPress = () => {
    console.log("Getting media....")
    var temp = [];
    setTimeout(()=>{
      console.log(this.state.list)
      CameraRoll.getPhotos({
          first: 20,
          assetType: 'Photos',
        })
        .then(r => {
          setTimeout(()=>{
            this.setState({t: r.edges });
            
            this.state.t.map((uri,i) =>{
             
            var n = uri.node.image.uri.lastIndexOf("/")+1;
            var r = uri.node.image.uri.substring(n);
            this.state.list.forEach(element => {
             
               if(element.filename===r){
                console.log(element.filename,r);
                 temp.push(uri)
                
              }
              
            });
            
          })
          }, 2000);




         
          
          
        
        })
        .catch((err) => {
           //Error Loading Images
        });
        CameraRoll.getPhotos({
          first: 20,
          assetType: 'Videos',
        })
        .then(r => {
          setTimeout(()=>{
            this.setState({t: r.edges });
           
           
            this.state.t.map((uri,i) =>{
             
            var n = uri.node.image.uri.lastIndexOf("DCIM/")+5;
           
            var r = uri.node.image.uri.substring(n);
            
            this.state.list.forEach(element => {
               if(element.filename===r){
                 temp.push(uri)
                
              }
              
            });
             
          })
          }, 2000);
          
         
          setTimeout(()=>{
            console.log(";;;;",temp)
            this.setState({ photos: temp });
            this.setState({spinner:false});
          }, 5000);
          
        })
        .catch((err) => {
           //Error Loading Images
        });
    }, 4000);





    
    }
   
    listItem = ({item,index}) => (
      
      <TouchableOpacity  onPress={() => this.props.navigation.navigate('Image', {item: item})}>
         
          {item.node.type==="image/jpeg" &&
          <TouchableOpacity  onPress={() => this.props.navigation.navigate('Image', {item: item,user: this.props.route.params.user})}>  
          <Image
      
          style={styles.img}
          source={{ uri: item.node.image.uri }}
         />
         </TouchableOpacity>
        
          }
          {item.node.type==="video/mp4" &&
          <TouchableOpacity  onPress={() => this.props.navigation.navigate('Vid', {item: item,user: this.props.route.params.user})}>
           <Image
      
           style={styles.img}
           source={require('./../../assets/play.png')}
          />
          </TouchableOpacity>
          }
      
      
    </TouchableOpacity>
    
  
  
    );  
  render(){
  return (
    <SafeAreaView>
       <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
     <Button title="Go to Camera"  onPress={() => this.props.navigation.navigate('Camera', {user: this.props.route.params.user})} />
     <FlatList style={styles.FlatlistStyles} data={this.state.photos}
  numColumns={2}
  renderItem={this.listItem}
  keyExtractor={(item, index) => item.node.image.uri}
 />
   </SafeAreaView>
  );
  }
} 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    img:{
      
       height: 195,
       width: 195,
       marginLeft:5,
       marginRight:5,
       marginTop:5,
       
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
  });
  
  GalleryScreen.propTypes = {
    getmedia: PropTypes.func.isRequired,
     
  }
  
  
  const mapStateToProps = (state) => ({
    user: state.user
  });
  export default connect(mapStateToProps, {getmedia})(GalleryScreen);