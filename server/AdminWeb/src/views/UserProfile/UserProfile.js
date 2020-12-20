import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { Redirect } from 'react-router-dom'
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import {connect} from 'react-redux';
import {getitems, deleteitem,getactiveusers,editadmin,getpicture,getavailmachines,edituser,updateadmin,getadmins,deleteadmin} from '../../actions/itemaction';
import PropTypes from 'prop-types';
import momina from "assets/img/momina.png";
import tehmina from "assets/img/tehmina.jpg";
import avatar1 from "assets/img/avatar.png";
import {
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import avatar from "assets/img/faces/marc.jpg";
const pic = JSON.parse(localStorage.getItem('picture'));
const u = JSON.parse(localStorage.getItem('user'));
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  btnFile: {
    position: "relative",
    overflow: "hidden"
  },
  btnFileInput: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: '100px',
    textAlign: 'right',
    filter: 'alpha(opacity=0)',
    opacity: 0,
    outline: 'none',
    background: 'white',
    cursor: 'inherit',
    display: 'block',
}
};
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const useStyles = makeStyles(styles);

class UserProfile extends React.Component {

  constructor(props){
     super(props);
     this.state={
      email:"",
      password:"",
      confirm:"",
      _id:"",
      file:"",
      picture:"" ,
      filename:"",
      loading:false,
      pic:""
    }
  }
  componentDidMount(){
    console.log(u);
    this.setState({_id: u._id});
    this.setState({email: u.email});
    this.setState({password: u.password});
    // if(u.image!=undefined){
    //   console.log("here")
    //   this.setState({
    //     picture: u.image.data
    //    });
    //   }
     if(u.email==="mominababar97@gmail.com"){
        this.setState({
          picture: momina
         });
      }
    else if(u.email==="tehmina.javaid7@gmail.com"){
      this.setState({
        picture: tehmina
       });
    }
    else{
      this.setState({
        picture: avatar1
       });
    }
    // this.setState({
    //   picture: u.image.data
    //  });
    // if(u.email=="mominababar97@gmail.com"){
    //   this.setState({picture: momina});
    // }
    // else if(u.email=="tehmina.javaid@gmail.com"){
    //   this.setState({picture: tehmina});
    // }
    // else{
    //   this.setState({picture: avatar1});
    // }

  }
  onEditChange(value){
    this.setState({
         email: value
    });
  }
  onpChange(value){
    this.setState({
         password: value
    });
  }
  onpcChange(value){
    this.setState({
         confirm: value
    });
  }
//   onpicChange(value){
    
//     this.setState({
//          file: value.files[0]
//     });
//     this.setState({
//       filename: value.files[0].name
//  });
//   console.log(value.files[0])
//   }
  
  onSubmit = (e) => {
    e.preventDefault();
    
    if(this.state.password===this.state.confirm){
      const newItem = {
        _id: this.state._id,
        email: this.state.email,
        password: this.state.password
      }
      //console.log(newItem);
      this.props.editadmin(newItem);
      window.alert("Password updated!")

    }
    else{
      window.alert("Password and confirm password do not match!")
    }
     
  }
  // onpicSubmit = (e) => {
  //   this.setState({loading:true});
  //   e.preventDefault();
  //   var data = new FormData();
  //   data.append('file', this.state.file);
  //   //console.log(data);
  //   this.props.updateadmin(this.state._id,data);
  //   setTimeout(()=>{
  //     //console.log("lll",this.props.item.pic);
  //     this.setState({ picture: this.props.item.pic});
  //     u.image.data = this.props.item.pic;
  //     this.setState({loading:false});
  //     window.alert("Profile Picture updated!")
  //     //this.props.getpicture("b59c8dd4196a2337f0c8d85b93c06ed4.png");
  //   },40000);
  //   // setTimeout(()=>{
  //   //   this.setState({ pic: this.props.item.picture});
      
  //   // },40000);  
  // }
  render()
  {
    const u = JSON.parse(localStorage.getItem('user'));
    if(u.isLoggedin==false){
      return  <Redirect to="/" />
    }
    else{
  return (
    <div>
      <div className="sweet-loading">
      <ClipLoader
        css={override}
        size={70}
        color={"#123abc"}
        loading={this.state.loading}
      />
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 >Edit Profile</h4>
              <p >Complete your profile</p>
            </CardHeader>
            <CardBody>
            <Form  onSubmit={this.onSubmit}>
                    <FormGroup>
                      
                  <Label>Email</Label>
                  
                     <Input
                       type="text"
                       name="email"
                       id="item"
                       value={this.state.email}
                       placeholder="Enter Email"
                       onChange={e => this.onEditChange(e.target.value)}
                       style={{marginBottom:'0.5rem' }}
                     />
                    <Label>Password</Label>
                     <Input
                       type="password"
                       name="password"
                       id="pp"
                       value={this.state.password}
                       placeholder="Enter Password"
                       onChange={e => this.onpChange(e.target.value)}
                       style={{marginBottom:'0.5rem' }}
                     />
                      <Label>Confirm Password</Label>
                     <Input
                       type="password"
                       name="confirm"
                       id="cp"
                       value={this.state.confirm}
                       placeholder="Confirm Password"
                       onChange={e => this.onpcChange(e.target.value)}
                       style={{marginBottom:'0.5rem' }}
                     />
                 <Button color="primary" round onClick={this.onSubmit} >
                
                      
                      Update Profile
                    </Button>
                    </FormGroup>
                  </Form>
                
            </CardBody>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 >Edit Profile</h4>
              <p >Complete your profile</p>
            </CardHeader>
            <CardBody>
            <Form  onSubmit={this.onpicSubmit}>
                    <FormGroup>
                      
                  
                      <Label>Profile Picture</Label>
                     <Input
                       type="file"
                       name="picture"
                       id="pic"
                       //value={this.state.picture}
                       onChange={e => this.onpicChange(e.target)}
                       style={{marginBottom:'0.5rem' }}
                       accept="image/*"
                     />
                      <Button color="primary" round onClick={this.onpicSubmit} >
                
                      
                      Update Picture
                    </Button>
                    </FormGroup>
                  </Form>
                
            </CardBody>
          </Card>
        </GridItem> */}
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            {/* <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={this.state.pic} alt="..." />
               
              </a>
            </CardAvatar> */}
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                {/* <img src={`data:image/png;base64,${this.state.picture}`} alt="..." /> */}
                <img src={this.state.picture} alt="..." />
               
              </a>
            </CardAvatar>
            <CardBody profile>
                  <h6 style={{color:'black'}}>{u.email}</h6>
              <h4  style={{color:'black'}}>Admin</h4>
              <p  style={{color:'black'}}>
               {u.Aboutme}
              </p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      
    </div>
  );
                  }
                  }
}


UserProfile.propTypes = {
  getitems: PropTypes.func.isRequired,
  deleteitems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  item: state.item
});
export default connect(mapStateToProps, {getitems,editadmin,getpicture,deleteadmin,updateadmin, deleteitem,getactiveusers,getavailmachines,edituser,getadmins
})(UserProfile);
