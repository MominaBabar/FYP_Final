import { GET_ITEMS, DELETE_ITEM, ADD_ITEM, ITEMS_LOADING,COUNT,UPDATE_ADMIN,GET_ADMINS,ADD_ADMIN, ADD_MACHINE,EDIT_USER,GET_ACTIVE_USERS,ADD_USER, GET_AVAIL_MACHINES, GET_MACHINES, DELETE_MACHINE, EDIT_MACHINE, DELETE_ADMIN, EDIT_ADMIN, GET_NOTIFICATIONS, DASHBOARD, PICTURE } from "./types"
import axios from 'axios';
import { GET_ADMIN } from "./types";

export const getitems = () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewusers').then(res=>
        dispatch({
        type:GET_ITEMS,
        payload: res.data
    })
    
    );
}
export const getmachines= () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewmachines').then(res=>
        dispatch({
        type:GET_MACHINES,
        payload: res.data
    })
    
    );
}
export const getadmins= () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewadmin').then(res=>
        dispatch({
        type:GET_ADMINS,
        payload: res.data
    })
    
    );
}
export const dashboard= (token) => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/dashboard', { headers: {"Authorization" : `Bearer ${token}`} }).then(res=>
        dispatch({
        type:DASHBOARD,
        payload: res.data
    })
    
    );
}
export const getnotifications= () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewnotifications').then(res=>
        dispatch({
        type:GET_NOTIFICATIONS,
        payload: res.data
    })
    
    );
}
export const getcount= () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/list').then(res=>
        dispatch({
        type:COUNT,
        payload: res.data
    })
    
    );
}
// export const getpicture= (filename) => dispatch =>{
//     dispatch(itemloading());
//     axios.get('/admin/images/'+filename).then(res=>
//         dispatch({
//         type:PICTURE,
//         payload: res.data
//     })
    
//     );
// }

export const getpicture= (id) => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/images/'+id).then(res=>
        dispatch({
        type:PICTURE,
        payload: res.data
    })
    
    );
}
export const getavailmachines= () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewavailmachines').then(res=>
        dispatch({
        type:GET_AVAIL_MACHINES,
        payload: res.data
    })
    
    );
}
export const getactiveusers = () => dispatch =>{
    dispatch(itemloading());
    axios.get('/admin/viewlogusers').then(res=>
        dispatch({
        type:GET_ACTIVE_USERS,
        payload: res.data
    })
    
    );
}
// axios.post("/yourApiEnd", {
//                     accounts: this.accounts
//                 })
//                 .then(function(response) {
//                     const status = response.status;
//                     //redirect logic
//                     if (response.status == 200) {
//                             window.location = "/script" 
//                     }
//                 })
//                 .catch(e => {
//     console.error(e);
//   });
      
export const deletemachine = (id) =>dispatch =>{
    axios.delete('/admin/delete/machine/'+id).then(res=>
        dispatch(
            {
                type: DELETE_MACHINE,
                payload: id
            }
        ))
}

export const deleteitem = (id) =>dispatch =>{
    axios.delete('/admin/delete/user/'+id).then(res=>
        dispatch(
            {
                type: DELETE_ITEM,
                payload: id
            }
        ))
}
export const deleteadmin = (id) =>dispatch =>{
    axios.delete('/admin/delete/admin/'+id).then(res=>
        dispatch(
            {
                type: DELETE_ADMIN,
                payload: id
            }
        ))
}
export const edituser = (user) => dispatch =>{
    dispatch(itemloading());
    axios.put('/admin/user/update/',user).then(res=>
        dispatch({
        type:EDIT_USER,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const editadmin = (user) => dispatch =>{
    dispatch(itemloading());
    axios.put('/admin/update/admin/'+user._id,user).then(res=>
        dispatch({
        type:EDIT_ADMIN,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const updateadmin = (id,formData) => dispatch =>{
    dispatch(itemloading());
    console.log(id);
    axios.post('/admin/updated/admin/'+id, formData, {
        headers: {
            "content-type": "application/json"
        }
      }).then(res=>
        dispatch({
            type:UPDATE_ADMIN,
            payload: res.data
        })).catch((error)=>{
        console.log("Network error",error);
        alert(error);
     });
}
export const editmachine = (user) => dispatch =>{
    dispatch(itemloading());
    axios.put('/admin/update/machine',user).then(res=>
        dispatch({
        type:EDIT_MACHINE,
        payload: res.data
    })).catch((error)=>{
        console.log("Network error");
        alert(error.message);
     });
}
export const additem = (item) => dispatch =>{
    axios.post('/api/users', item).then(res=>
        dispatch({
                type: ADD_ITEM,
                payload: res.data
            }));
}
export const adduser = (user) => dispatch =>{
    axios.post('/admin/adduser', user).then(res=>
        dispatch({
                type: ADD_USER,
                payload: res.data
            }));
}
export const addadmin = (user) => dispatch =>{
    axios.post('/admin/addadmin', user).then(res=>
        dispatch({
                type: ADD_ADMIN,
                payload: res.data
            }));
}
export const addmachine = (user) => dispatch =>{
    axios.post('/admin/addmachine', user).then(res=>
        dispatch({
                type: ADD_MACHINE,
                payload: res.data
            }));
}
export const getadmin = (item) => dispatch =>{
    axios.post('/admin/login', item).then(res=>
        dispatch({
                type: GET_ADMIN,
                payload: res.data
            }));
}


export const itemloading = () =>{
    return{
        type:ITEMS_LOADING,
    };
}