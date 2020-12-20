import { GET_ITEMS, DELETE_ITEM, ADD_ITEM, ITEMS_LOADING } from "./types"
import axios from 'axios';
export const getitems = () => dispatch =>{
    dispatch(itemloading());
    axios.get('http://'+'192.168.10.4'+':5000/api/users/').then(res=>
        dispatch({
        type:GET_ITEMS,
        payload: res.data
    })).catch((error)=>{
        
        console.log("Network error");
        alert(error.message);
     });
}
export const deleteitem = (id) =>dispatch =>{
    axios.delete('http://192.168.10.4:5000/api/users/'+id).then(res=>
        dispatch(
            {
                type: DELETE_ITEM,
                payload: id
            }
        ))
}
export const additem = (item) => dispatch =>{
    axios.post('http://192.168.10.4:5000/api/users/', item).then(res=>
        dispatch({
                type: ADD_ITEM,
                payload: res.data
            }));
}

export const itemloading = () =>{
    return{
        type:ITEMS_LOADING,
    };
}