import React from "react";
// @material-ui/core components

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {

  Input
} from 'reactstrap';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from 'react-redux';
import { getadmin,getitems,dashboard,getpicture} from '../../actions/itemaction';
// const styles = {
//   cardCategoryWhite: {
//     color: "rgba(255,255,255,.62)",
//     margin: "0",
//     fontSize: "14px",
//     marginTop: "0",
//     marginBottom: "0"
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none"
//   }
// };
// const useStyles = makeStyles(styles);
// const classes = useStyles()
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Login extends React.Component {
    state = {
        email: '',
        password:'',
        loading:false,
        image:''
    }
    componentDidMount(){
      this.setState({ email:""});
      this.setState({ password:""});
      //localStorage.clear();
    }
    onChange = (e) =>{
        //console.log(e)
        this.setState({ [e.target.name]: e.target.value});
    }
    onSubmit = (e) => {
       this.setState({ loading: true});
       e.preventDefault();
        const newItem = {
        email: this.state.email,
        password: this.state.password
      }
     // console.log(newItem);
      this.props.getadmin(newItem);
      setTimeout(()=>{
      if(this.props.item.token.success===true){
       
        this.props.dashboard(this.props.item.token.token);
        //console.log(this.props.item.admin);
        setTimeout(()=>{
          //console.log(this.props.item.admin);
          //this.props.getpicture(this.props.item.admin.profile_picture.filename);
          localStorage.setItem('user',JSON.stringify(this.props.item.admin));
          setTimeout(()=>{
            
           
            this.setState({ loading: false});
            window.location.href = "/admin";
            }, 3000);
          }, 4000);
         
      }
      else if(this.props.item.admin.success===false){
        this.setState({ loading: false});
        window.alert("Invalid Login")
      }
      else{
        this.setState({ loading: false});
        window.alert("Invalid Login")
      }
      }, 3000);
      
    }

  render(){
  return (
     
    <div >

   
        <div className="sweet-loading">
        <ClipLoader
          css={override}
          size={100}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
      <GridContainer>
      <GridItem xs={3} sm={3} md={3}>
          </GridItem>
        <GridItem xs={6} sm={6} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 >Login</h4>
              <p >Admin Web Portal</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
               
                <GridItem xs={12} sm={12} md={12}>
                <Input
                        type="text"
                        name="email"
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
          
                </GridItem>
              </GridContainer>  
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={this.onSubmit}>Login to Account</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={3} sm={3} md={3}>
          </GridItem>
      </GridContainer>
    </div>
  
  );
  }
  
}

const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, { getadmin,getitems,dashboard,getpicture})(Login);