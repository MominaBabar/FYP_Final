import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import Additemmodal from "components/Login/Additemmodal.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {connect} from 'react-redux';
import {getitems, deleteitem,getactiveusers,getavailmachines,edituser} from '../../actions/itemaction';
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
class UserTableList extends React.Component {
  state={
    users:[],
    active_users:[],
    delcount:[],
    editcount:[],
    modal: false,
    email:"",
    machineID:"",
    _id:"",
    loading:false

  }
  componentDidMount(){
    this.setState({loading:true});
    this.props.getitems();
    this.props.getactiveusers();
    setTimeout(()=>{
      var arr = [];
      
      this.props.item.items.forEach(element => {
        arr.push( [ element["_id"],element["email"],element["dateCreated"],<div><Button color="warning" round onClick={this.onedit.bind(this,element)}>
        Edit
      </Button><Button color="danger" round onClick={this.ondelete.bind(this,element["_id"])}>
        Delete
      </Button></div>] );
      
        
      });
     
      
      this.setState({users:arr});
      console.log(this.state.users);
    
    var arr1 = [];
    this.props.item.active_users.forEach(element => {
      arr1.push( [ element["_id"],element["email"],element["dateCreated"],<div><Button color="warning" round onClick={this.onedit.bind(this,element)}>
      Edit
    </Button><Button color="danger" round onClick={this.ondelete.bind(this,element["_id"])}>
      Delete

    </Button></div>] );
        
    });
    this.setState({active_users:arr1});
  
    console.log(this.state.active_users);
    this.setState({loading:false});
  }
      , 4000);

     
   
  }
  ondelete = (id) => {
     
      this.props.deleteitem(id);
      console.log("item deleted",id);
      window.alert("User removed.")
      window.location.reload(true);
    
  }
  toggle = () =>{
    this.setState({
        modal: !this.state.modal
    });
}
  onedit= (user) => {
    console.log("item edit",user);
    
    this.setState({email:user.email});
    this.setState({_id:user._id});
    console.log(user.machineID);
    this.setState({machineID:user.machineID});
    this.props.getavailmachines();
    setTimeout(()=>{
      var m = [];
    m.push(<option value={this.state.machineID}>{this.state.machineID}</option>)
      this.props.item.avail_machines.forEach(element => {
       m.push(<option value={element["_id"]}>{element["_id"]}</option>)
     });
     
     this.setState({
      machines: m
  });
    }
      , 5000);
    
    
    this.toggle(); 
    
 }
 onEditChange(value){
  this.setState({
       email: value
  });
}
onMacChange(value){
  this.setState({
       machineID: value
  });
}
onSubmit = (e) => {
  e.preventDefault();
   const newItem = {
   _id: this.state._id,
   email: this.state.email,
   machineID: this.state.machineID
 }
 console.log(newItem);
 this.props.edituser(newItem);
 this.toggle();
 window.alert("User updated.")
 window.location.reload(true);
}
  render(){
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
      
      <GridItem xs={12} sm={12} md={12}>
    <Additemmodal/>
    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader color="primary" toggle={this.toggle}>Edit User</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                  <Label>User Email</Label>
                     <Input
                       type="text"
                       name="email"
                       id="item"
                       value={this.state.email}
                       placeholder="Enter Email"
                       onChange={e => this.onEditChange(e.target.value)}
                       style={{marginBottom:'0.5rem' }}
                     />
                     <Label>Available Machines</Label>
                  <Input type="select" name="machineID" id="select" value={this.state.machineID} onChange={e => this.onMacChange(e.target.value)} style={{  marginBottom:'0.5rem' }}>
                  {this.state.machines}
                </Input>      
             
                      
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
            <h4 >Registered Users</h4>
            <p >
              List of all users using Clean Roomby
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["User id", "Email", "Date Created", "Actions"]}
              tableData={this.state.users}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 >
              Online Users
            </h4>
            <p >
              Users currently logged in
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["User id", "Email", "Date Created", "Actions"]}
              tableData={this.state.active_users}
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

UserTableList.propTypes = {
  getitems: PropTypes.func.isRequired,
  deleteitems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  item: state.item
});
export default connect(mapStateToProps, {getitems, deleteitem,getactiveusers,getavailmachines,edituser
})(UserTableList);
