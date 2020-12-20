import {Text, View,StyleSheet,ScrollView,TouchableOpacity,Button,Image,FlatList,SafeAreaView} from 'react-native';
import React from 'react';
import CameraRoll from "@react-native-community/cameraroll";
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

export default class ImageScreen extends React.Component{
  shareimage = () =>{
    const image = this.props.route.params.item.node.image.uri;
    //console.log(image);
   
    RNFetchBlob.fs.readFile(image, 'base64')
    .then((data) => {
      let shareOptions = {
        title: "Share Photo",
        url: image,
        subject: ""
      }
      console.log(shareOptions.url)
      Share.open(shareOptions)
        .then((res) => console.log('res:', res))
        .catch(err => console.log('err', err))
    })
    
  }
  deleteimage = () =>{
    CameraRoll.deletePhotos([this.props.route.params.item.node.image.uri])
    alert("Deleted Image");
    this.props.navigation.navigate('Home', {user: this.props.route.params.user})
  }
  render(){
  return (
    <SafeAreaView>
      <Image
      
      style={styles.img}
      source={{ uri: this.props.route.params.item.node.image.uri }}
     />
     <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
     <TouchableOpacity  onPress={()=>this.shareimage()} style={styles.capture}>
            <Image style={styles.image} source={require('./../../assets/share.png')} />
     </TouchableOpacity>
     <TouchableOpacity onPress={()=>this.deleteimage()}
          style={styles.capture}>
            <Image style={styles.image} source={require('./../../assets/delete.png')} />
     </TouchableOpacity>
     
     </View>
         
     

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
      
       height: 560,
       width: 400,
       marginLeft:5,
       marginRight:5,
       marginTop:5,
       
    },
    image:{
      height:50,
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
  });
  