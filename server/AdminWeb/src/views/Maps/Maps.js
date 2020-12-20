import React from "react";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from 'react-redux';

import { getadmin,getitems,dashboard} from '../../actions/itemaction';
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Maps extends React.Component {
  state = {
    email: '',
    password:'',
    loading:false,
}
  componentDidMount(){
    this.setState({ loading: true});
    const u = JSON.parse(localStorage.getItem('user'));
    u.isLoggedin = false;
    localStorage.setItem('user',JSON.stringify(u));
    //console.log(JSON.parse(localStorage.getItem('user')));
    setTimeout(()=>{
      this.setState({ loading: false});
      window.location.href = "/";
      }, 200);
    
    
   
  }
  render()
  {
    return (
      <div className="sweet-loading">
        <ClipLoader
          css={override}
          size={100}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    );
  }
  
}

const mapStateToProps = (state) => ({
  item: state.item
});

export default connect(mapStateToProps, { getadmin,getitems,dashboard})(Maps);
