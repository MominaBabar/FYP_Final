import {
  whiteColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";

const cardStyle = {
  card: {
    border: "40px",
    bordercolor:"red",
    marginBottom: "30px",
    marginTop: "30px",
    borderRadius: "6px",
    color: "rgba(" + hexToRgb("#9c27b0") + ", 0.12)",
    background: whiteColor,
    width: "100%",
    boxShadow: "0 1px 400px 0 rgba(" + hexToRgb("#9c27b0") + ", 0.40)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    wordWrap: "break-word",
    fontSize: ".875rem"
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "10px"
  },
  cardProfile: {
    marginTop: "30px",
    textAlign: "center"
  },
  cardChart: {
    "& p": {
      marginTop: "0px",
      paddingTop: "0px"
    }
  }
};

export default cardStyle;
