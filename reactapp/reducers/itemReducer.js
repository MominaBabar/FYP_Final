import { GET_ITEMS, DELETE_ITEM, ADD_ITEM, ITEMS_LOADING } from '../actions/types';
import {v1 as uuid} from "uuid"; 
const initialState = {
    items: [],
    loading: false
}

export default function(state=initialState, action){
    switch(action.type)
    {
        case GET_ITEMS:
            return {
                ...state,
                loading: false,
                items: action.payload
            };
        case DELETE_ITEM:
            return {
                    ...state,
                    items: state.items.filter(item => item._id !== action.payload)
            };
        case ADD_ITEM:
            return {
                    ...state,
                    items: [action.payload, ...state.items]
                };
        case ITEMS_LOADING:
            return {
                    ...state,
                    loading: true
            };
        default:
            return state;
            
    }
}
