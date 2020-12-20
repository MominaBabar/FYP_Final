import './../../Login.css';
import { Card,  CardTitle, CardText, Row, Col } from 'reactstrap';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { getadmin,getitems} from '../../actions/itemaction';
import {useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Redirect} from "react-router";
// import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import CustomNavbar from './CustomNavbar';

// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
// `;

class Login extends Component{
    state = {
        email: '',
        password:'',
        loading:false
    }
    componentDidMount(){
      localStorage.clear()
      this.setState({ email:""});
      this.setState({ password:""});
    }
    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value});
    }
    onSubmit = (e) => {
       this.setState({ loading: true});
       e.preventDefault();
        const newItem = {
        email: this.state.name,
        password: this.state.password
      }
      this.props.getadmin(newItem);
      setTimeout(()=>{
      //console.log(this.props.item.admin);
      if(this.props.item.admin.success===true){
        this.setState({ loading: false});
        window.location.href = "/admin";
      }
      else if(this.props.item.admin.success===false){
        this.setState({ loading: false});
        window.alert("invalid login")
      }
      else{
        this.setState({ loading: false});
      }
      }, 1000);
      
    
      
    }
    render() {
        return (
          <div>
            <div className="sweet-loading">
        <ClipLoader
          // css={override}
          size={150}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
      <CustomNavbar/>
  <Row >
      
      <Col lg="6" >
        <Card body style={{ height:'auto' }}>
        <Form >
                   <FormGroup>
                   <CardTitle>ADMIN LOGIN</CardTitle>
                      
                     <Input
                        type="text"
                        name="name"
                        id="item"
                        placeholder="Enter Email"
                        onChange={this.onChange}
                        style={{ marginTop: '6rem', width:'500px',marginBottom:'2rem' }}
                      />
                      <Input
                        type="password"
                        name="password"
                        id="item"
                        placeholder="Enter Password"
                        onChange={this.onChange}
                        style={{ width:'500px', marginBottom:'2rem' }}
                      />
                      <Button color="dark"style={{ marginTop: '2rem', width:'200px', borderRadius:'20px',marginBottom:'2rem' }} block  onClick={this.onSubmit}>
                        Login
                      </Button>
                    </FormGroup>
                  </Form>
        </Card>
      </Col>
    </Row>
    
    </div>
          );
    }
}
  
const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, { getadmin,getitems})(Login);