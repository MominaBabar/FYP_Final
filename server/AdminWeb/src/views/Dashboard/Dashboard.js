import React from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons

import Update from "@material-ui/icons/Update";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import { Redirect } from 'react-router-dom'

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from 'react-redux';
import { getadmin,dashboard,getcount} from '../../actions/itemaction';
import {getitems, deleteitem,getactiveusers,getavailmachines,edituser} from '../../actions/itemaction';

const useStyles = makeStyles(styles);
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Dashboard extends React.Component {
  state = {
    count:[],
    loading:false,
    
}


componentDidMount(){
  //console.log(this.props.item);
  this.setState({ loading:true});
  this.props.getcount();
  this.props.getitems();
  this.props.getactiveusers();
    setTimeout(()=>{
      var arr = [];
      
      this.props.item.items.forEach(element => {
      });
    
      var arr1 = [];
      this.props.item.active_users.forEach(element => {
      
      });
      
    },4000);
   
  setTimeout(()=>{
      
      this.setState({ count:this.props.item.count});
      console.log(this.state.count);
      console.log( JSON.parse(localStorage.getItem('user')));
      this.setState({ loading:false});
    },5000);
}
  render(){
    const c = this.state.count;
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
          size={100}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} >
            <Card   
            >
              <CardHeader color="primary" stats icon
          >
                <CardIcon color="primary">
                  <Icon>supervised_user_circle</Icon>
                </CardIcon>
                <p  style={{ color: 'black' }}>Total Registered Users</p>
                <h3 style={{ color: 'black'}}>
                { c.usercount}
                </h3>
              </CardHeader>
              <hr/>
              <CardFooter stats>
              <div style={{ color: 'black' }}>
                  <Update style={{ color: 'black'}} />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
         
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Icon>scanner</Icon>
                </CardIcon>
                <p style={{ color: 'black'}}>Total Machines</p>
                <h3 style={{ color: 'black'}}>
                { c.machinecount}
                </h3>
              </CardHeader>
              <CardFooter stats>
              <div style={{ color: 'black'}}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Icon>pending</Icon>
                </CardIcon>
                <p style={{ color: 'black'}}>Available Machines</p>
                <h3 style={{ color: 'black'}} >{ c.availmachines}</h3>
              </CardHeader>
              <CardFooter stats>
              <div style={{ color: 'black'}}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                <Icon>info_outline</Icon>
                </CardIcon>
                <p style={{ color: 'black'}}>Active Users</p>
                <h3 style={{ color: 'black'}}>{ c.activeuser}</h3>
              </CardHeader>
              <CardFooter stats>
                <div style={{ color: 'black'}}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
    }
  }
 
}
const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, { getadmin,getitems,dashboard,getcount,deleteitem,getactiveusers,getavailmachines})(Dashboard);