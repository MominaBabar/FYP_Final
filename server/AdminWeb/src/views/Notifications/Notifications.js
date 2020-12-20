/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { render } from "react-dom";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import {connect} from 'react-redux';
import {getitems, deleteitem,getactiveusers,editadmin,getnotifications,getavailmachines,edituser,getadmins,deleteadmin} from '../../actions/itemaction';
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

const useStyles = makeStyles(styles);
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Notifications extends React.Component{
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
    this.props.getnotifications();
   
    setTimeout(()=>{
     // console.log(this.props.item.notifications);
      this.setState({loading:false});
   
  }
      , 4000);


   
  }
  
  render(){
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
      <Card>
        <CardHeader color="primary">
          <h4 >Notifications</h4>
          
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h5>Notifications States</h5>
              <br />
              <SnackbarContent
                message={
                  'INFO - This is a regular notification made with color="info"'
                }
                close
                color="info"
              />
              <SnackbarContent
                message={
                  'SUCCESS - This is a regular notification made with color="success"'
                }
                close
                color="success"
              />
              <SnackbarContent
                message={
                  'WARNING - This is a regular notification made with color="warning"'
                }
                close
                color="warning"
              />
              <SnackbarContent
                message={
                  'DANGER - This is a regular notification made with color="danger"'
                }
                close
                color="danger"
              />
              <SnackbarContent
                message={
                  'PRIMARY - This is a regular notification made with color="primary"'
                }
                close
                color="primary"
              />
            </GridItem>
          </GridContainer>
          <br />
          <br />
        
        </CardBody>
      </Card>
      </div>
    );
  }
  
}

const mapStateToProps = (state) => ({
  item: state.item
});
export default connect(mapStateToProps, {getitems,editadmin,deleteadmin, getnotifications,deleteitem,getactiveusers,getavailmachines,edituser,getadmins
})(Notifications);