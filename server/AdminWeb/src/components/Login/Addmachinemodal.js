import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { adduser,getavailmachines,getmachines} from '../../actions/itemaction';
import Button from "components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

class Additemmodal extends Component{
    state = {
        modal: false,
        email:'',
        password:'',
        machineID:'',
        machines:[]
    }
    componentDidMount(){
     this.props.getavailmachines();
    setTimeout(()=>{
      var m = [];
      m.push(<option value="">Select Machine</option>)
      this.props.item.avail_machines.forEach(element => {
       m.push(<option value={element["_id"]}>{element["_id"]}</option>)
     });
     
     this.setState({
      machines: m
  });
    }
      , 5000);
    
    }
    toggle = () =>{
        this.setState({
            modal: !this.state.modal
        });
    }
    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value});
    }
    onSubmit = (e) => {
       e.preventDefault();
        const newItem = {
        email: this.state.email,
        password: this.state.password,
        machineID: this.state.machineID
      }
      console.log(newItem);
      this.props.adduser(newItem);
      this.toggle();
    }
    render() {
        return (
            <div>
                
                <Button color="primary" round onClick={this.toggle} >
      <Icon>add</Icon>
      Add New User
    </Button>
          
              <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader color="primary" toggle={this.toggle}>Add New Machine</ModalHeader>
                <ModalBody>
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                  <Label>User Email</Label> 
               <Input
                       type="text"
                       name="email"
                       id="item"
                       placeholder="Enter Email"
                       onChange={this.onChange}
                       style={{marginBottom:'0.5rem' }}
                     />
                     <Label>User Password</Label>
               <Input
                       type="password"
                       name="password"
                       id="item"
                       placeholder="Enter Password"
                       onChange={this.onChange}
                       style={{  marginBottom:'0.5rem' }}
                     />
                     <Label>Available Machines</Label>
                <Input type="select" name="machineID" id="select" onChange={this.onChange} style={{  marginBottom:'0.5rem' }}>
                  {this.state.machines}
                </Input>      
             
                      
                      <Button color="primary" round onClick={this.onSubmit} >
                      
                      Add User
                    </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
            </div>
          );
    }
}
  
const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, {adduser,getavailmachines,getmachines})(Additemmodal);