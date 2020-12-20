import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import Addadminmodal from "components/Login/Addadminmodal.js";

import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {connect} from 'react-redux';
import {getitems, deleteitem,getactiveusers,editadmin,getavailmachines,edituser,getadmins,deleteadmin} from '../../actions/itemaction';
import PropTypes from 'prop-types';
import Button from "components/CustomButtons/Button.js";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { Redirect } from 'react-router-dom'

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class AdminTableList extends React.Component {
  state={
    users:[],
    active_users:[],
    delcount:[],
    editcount:[],
    modal: false,
    email:"",
    password:"",
    confirm:"",
    _id:"",
    loading:false

  }
  componentDidMount(){
    this.setState({loading:true});
    this.props.getadmins();
    setTimeout(()=>{
      var arr = [];
      
      this.props.item.admins.forEach(element => {
        arr.push( [ element["_id"],element["email"],<div><Button color="warning" round onClick={this.onedit.bind(this,element)}>
        Edit
      </Button><Button color="danger" round onClick={this.ondelete.bind(this,element["_id"])}>
        Delete
      </Button></div>] );
      
        
      });
      
      this.setState({users:arr});
      //console.log(this.state.users);
      this.setState({loading:false});
   
  
  }
      , 4000);


   
  }
  ondelete = (id) => {
     //console.log("admin deleted",id)
      this.props.deleteadmin(id);
      window.alert("Admin removed.")
      window.location.reload(true);
     
    
  }
  toggle = () =>{
    this.setState({
        modal: !this.state.modal
    });
}
  onedit= (user) => {
   // console.log("item edit",user);
    this.setState({email:user.email});
    this.setState({_id:user._id});
    this.toggle();
    
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
onSubmit = (e) => {
  e.preventDefault();
  if(this.state.password===this.state.confirm){
    const newItem = {
      _id: this.state._id,
      email: this.state.email,
      password: this.state.password
    }
    console.log(newItem);
    this.props.editadmin(newItem);
    this.toggle();

  }
  else{
    window.alert("Password and confirm password do not match!")
  }
   
}
  render(){
    const u = JSON.parse(localStorage.getItem('user'));
    if(u.isLoggedin==false)
    {
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
      <GridItem xs={12} sm={12} md={12}>
    <Addadminmodal/>
    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader color="primary" toggle={this.toggle}>Edit Admin</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.onSubmit}>
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
                      
                      Update User
                    </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 >All Admins</h4>
            <p >
              List of all admins of Clean Roomby
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["User id", "Email", "Actions"]}
              tableData={this.state.users}
            />
          </CardBody>
        </Card>
      </GridItem>
      
    </GridContainer>
    </div>
    
  );
    }
  }
  
}

AdminTableList.propTypes = {
  getitems: PropTypes.func.isRequired,
  deleteitems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  item: state.item
});
export default connect(mapStateToProps, {getitems,editadmin,deleteadmin, deleteitem,getactiveusers,getavailmachines,edituser,getadmins
})(AdminTableList);
