import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import {connect} from 'react-redux';
import {getitems, deletemachine,getactiveusers,getavailmachines,edituser,getmachines,addmachine,editmachine} from '../../actions/itemaction';
import PropTypes from 'prop-types';
import Button from "components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
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

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class MachineTableList extends React.Component {
  state={
    users:[],
    active_users:[],
    delcount:[],
    editcount:[],
    modal: false,
    amodal:false,
    email:"",
    machineID:"",
    _id:"",
    available:false,
    user_id:"",
    loading:false,
    ip_address:""

  }

  componentDidMount(){
    this.setState({loading:true});
    this.props.getmachines();
    this.props.getavailmachines();
    setTimeout(()=>{
      var arr = [];
      console.log(this.props.item.machines);
      this.props.item.machines.forEach(element => {
        arr.push( [ element["_id"],element["ip_address"],element["avg_speed"],element["available"].toString(),<div><Button color="warning" round onClick={this.onedit.bind(this,element)}>
        Edit
      </Button><Button color="danger" round onClick={this.ondelete.bind(this,element["_id"],element["available"])}>
        Delete
      </Button></div>] );
      
        
      });
      console.log(this.state.delcount);
      
      this.setState({users:arr});
      console.log(this.state.users);
    
    var arr1 = [];
    this.props.item.avail_machines.forEach(element => {
      arr1.push( [ element["_id"],element["ip_address"],element["avg_speed"],<div><Button color="warning" round onClick={this.onedit.bind(this,element)}>
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
  ondelete = (id,available) => {
     if(available===true){
      console.log("item deleted",id)
      this.props.deletemachine(id);
      window.alert("Machine removed.");
      window.location.reload(true);
     }
     else{
      window.alert("Machine in use. cannot be removed.")
     }
     
     
    
  }
  toggle = () =>{
    this.setState({
        modal: !this.state.modal
    });
}
atoggle = () =>{
  this.setState({
      amodal: !this.state.amodal
  });
}
  onedit= (user) => {

    this.setState({machineID:user.machineID});
    this.setState({_id:user._id});
    this.setState({ip_address:user.ip_address});
    this.toggle();
    
   
 }
 onEditChange(value){
  this.setState({
       ip_address: value
  });
}
onMacChange(value){
  this.setState({
       machineID: value
  });
}
onadd = () => {
  this.atoggle();
}
Add = (e) => {
  e.preventDefault();
  for(var i=0; i<this.props.item.machines.length; i++){
    if(this.props.item.machines[i].ip_address==this.state.ip_address){
      window.alert("IP address must be unique.");
      return;
     }
  }
 

   const newItem = {
   ip_address: this.state.ip_address,
 }
 
 this.props.addmachine(newItem);
 window.alert("Machine Added.");
 window.location.reload(true);
}
onSubmit = (e) => {
  e.preventDefault();
  for(var i=0; i<this.props.item.machines.length; i++){
    if(this.props.item.machines[i].ip_address==this.state.ip_address){
      window.alert("IP address must be unique.");
      return;
     }
  }
   const newItem = {
   ip_address: this.state.ip_address,
   _id:this.state._id
 }
 
 console.log(newItem);
 this.props.editmachine(newItem);
 window.alert("Machne Updated.");
 window.location.reload(true);
}
  render(){
    const u = JSON.parse(localStorage.getItem('user'));
    if(u.isLoggedin===false){
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
      <Button color="danger" round onClick={this.onadd}>
      <Icon>add</Icon>
      Add Machine

    </Button>
    <Modal isOpen={this.state.amodal} toggle={this.atoggle}>
                <ModalHeader color="primary" toggle={this.atoggle}>ADD Machine</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.Add}>
                    <FormGroup>
                     <Label>Enter IP Address (Unique)</Label>
                     <Input
                       type="text"
                       name="ip"
                       id="ip"
                       value={this.state.ip_address}
                       style={{marginBottom:'0.5rem' }}
                       onChange={e => this.onEditChange(e.target.value)}
                     />
                 <Button color="primary" round onClick={this.Add} >
                      
                      Add Machine
                    </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader color="primary" toggle={this.toggle}>Edit Machine</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                    <Label>Machine ID</Label>
                     <Input
                       type="text"
                       name="email"
                       id="item"
                       value={this.state._id}
                       readonly
                       style={{marginBottom:'0.5rem' }}
                     />
                     <Label>Change IP Address</Label>
                     <Input
                       type="text"
                       name="ip"
                       id="ip"
                       value={this.state.ip_address}
                       style={{marginBottom:'0.5rem' }}
                       onChange={e => this.onEditChange(e.target.value)}
                     />
                 <Button color="primary" round onClick={this.onSubmit} >
                      
                      Update Machine
                    </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 >All Machines</h4>
            <p >
              List of all machines of Clean Roomby
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Machine id", "IP Address","Average Speed", "Available", "Actions"]}
              tableData={this.state.users}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 >
              Available Machines
            </h4>
            <p >
              Machines currently in use
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Machine id","IP Address", "Average Speed", "Actions"]}
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

MachineTableList.propTypes = {
  getitems: PropTypes.func.isRequired,
  deleteitems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
  item: state.item
});
export default connect(mapStateToProps, {getitems,editmachine, deletemachine,addmachine,getactiveusers,getavailmachines,edituser,getmachines
})(MachineTableList);
