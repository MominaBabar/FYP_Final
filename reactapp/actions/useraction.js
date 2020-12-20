import { GET_ITEMS, DELETE_ITEM, ADD_ITEM, FORGOT_PASSWORD, GET_ALARMS,PORT, ADD_HISTORY,MOVE_ROBOT,ITEMS_LOADING,GET_USER, ADD_ALARM, EDIT_ALARM, DELETE_ALARM, GET_HISTORY, EDIT_USER, GET_MEDIA, ADD_MEDIA, IP_ADDRESS, NOTIFY_CLEAN, NOTIFY_BATTERY, GET_CLEAN, GET_BATTERY } from "./types"
import axios from 'axios';
export const getuser = (user) => dispatch =>{
    axios.post(IP_ADDRESS+PORT+'/users/login', user).then(res=>
        dispatch({
                type: GET_USER,
                payload: res.data
            })).catch((error)=>{
                console.log("Network error");
                alert(error.message);
             });
}
export const forgotuser = (email) => dispatch =>{
    axios.post(IP_ADDRESS+PORT+'/users/forgot', email).then(res=>
        dispatch({
                type: FORGOT_PASSWORD,
                payload: res.data
            })).catch((error)=>{
                console.log("Network error");
                alert(error.message);
             });
}
export const moverobot = (id,dir) => dispatch =>{
    dispatch(itemloading());
    axios.post(IP_ADDRESS+PORT+'/users/move/'+id+'/dir/'+dir).then(res=>
        dispatch({
        type:MOVE_ROBOT,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const edituser = (user) => dispatch =>{
    dispatch(itemloading());
    axios.put(IP_ADDRESS+PORT+'/users/update/',user).then(res=>
        dispatch({
        type:EDIT_USER,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const getalarms = (machineid) => dispatch =>{
    dispatch(itemloading());
    axios.get(IP_ADDRESS+PORT+'/users/alarms/'+machineid).then(res=>
        dispatch({
        type:GET_ALARMS,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const gethistory = (machineid) => dispatch =>{
    dispatch(itemloading());
    axios.get(IP_ADDRESS+PORT+'/machine/history/'+machineid).then(res=>
        dispatch({
        type:GET_HISTORY,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const getmedia = (id) => dispatch =>{
    dispatch(itemloading());
    axios.get(IP_ADDRESS+PORT+'/users/getmedia/'+id).then(res=>
        dispatch({
        type:GET_MEDIA,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const getclean = (id) => dispatch =>{
    dispatch(itemloading());
    axios.get(IP_ADDRESS+PORT+'/users/settings/'+id+'/clean').then(res=>
        dispatch({
        type:GET_CLEAN,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const getbattery = (id) => dispatch =>{
    dispatch(itemloading());
    axios.get(IP_ADDRESS+PORT+'/users/settings/'+id+'/battery').then(res=>
        dispatch({
        type:GET_BATTERY,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const addmedia = (id,media) => dispatch =>{
    axios.post(IP_ADDRESS+PORT+'/users/media/'+id, media).then(res=>
        dispatch({
                type: ADD_MEDIA,
                payload: res.data
            })).catch((error)=>{
                console.log("Network error");
                alert(error.message);
             });
}
export const addalarm = (machineid,alarm) => dispatch =>{
    axios.post(IP_ADDRESS+PORT+'/users/addalarm/'+machineid, alarm ).then(res=>
        dispatch({
                type: ADD_ALARM,
                payload: res.data
            })).catch((error)=>{
                console.log("Network error");
                alert(error.message);
             });
}

export const addhistory = (machineid,history) => dispatch =>{
    axios.post(IP_ADDRESS+PORT+'/machine/addhistory/'+machineid, history ).then(res=>
        dispatch({
                type: ADD_HISTORY,
                payload: res.data
            })).catch((error)=>{
                console.log("Network error");
                alert("llllll");
             });
}

export const editalarm = (machineid,alarm) => dispatch =>{
    dispatch(itemloading());
    axios.put(IP_ADDRESS+PORT+'/users/editalarm/'+machineid+'/alarm/'+alarm._id,alarm).then(res=>
        dispatch({
        type:EDIT_ALARM,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const notifyclean = (userid) => dispatch =>{
    dispatch(itemloading());
    axios.put(IP_ADDRESS+PORT+'/users/settings/'+userid+'/clean').then(res=>
        dispatch({
        type:NOTIFY_CLEAN,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const notifybattery = (userid) => dispatch =>{
    dispatch(itemloading());
    axios.put(IP_ADDRESS+PORT+'/users/settings/'+userid+'/battery').then(res=>
        dispatch({
        type:NOTIFY_BATTERY,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const deletealarm = (machineid,id) => dispatch =>{
    axios.delete(IP_ADDRESS+PORT+'/users/deletealarm/'+machineid+'/alarm/'+id).then(res=>
        
        dispatch({
                type: DELETE_ALARM,
                payload: id
            })
            
            
                );
}
export const itemloading = () =>{
    return{
        type:ITEMS_LOADING,
    };
}