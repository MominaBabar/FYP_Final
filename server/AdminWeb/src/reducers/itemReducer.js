import { GET_ITEMS, DELETE_ITEM, DASHBOARD, PICTURE,COUNT,UPDATE_ADMIN,EDIT_USER,ITEMS_LOADING,ADD_MACHINE, GET_ADMINS, EDIT_MACHINE,DELETE_MACHINE, GET_ACTIVE_USERS,ADD_USER, GET_MACHINES, GET_AVAIL_MACHINES, ADD_ADMIN, DELETE_ADMIN, EDIT_ADMIN, GET_NOTIFICATIONS } from '../actions/types';
import { GET_ADMIN } from '../actions/types';

const initialState = {
    items: [],
    loading: false,
    admin:'',
    active_users:[],
    machines:[],
    avail_machines:[],
    user:{},
    admins:[],
    a:{},
    notifications:[],
    count:[],
    token:'',
    picture:'',
    pic:''
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
        case GET_NOTIFICATIONS:
            return {
                ...state,
                loading: false,
                notifications: action.payload
            };
        case GET_ADMINS:
            return {
                ...state,
                loading: false,
                admins: action.payload
            };
        case EDIT_USER:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case EDIT_ADMIN:
            return {
                ...state,
                loading: false,
                a: action.payload
            };
        case UPDATE_ADMIN:
            return {
                ...state,
                loading: false,
                pic: action.payload
            };
        case EDIT_MACHINE:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case GET_MACHINES:
            return {
                ...state,
                loading: false,
                machines: action.payload
            };
        case GET_AVAIL_MACHINES:
            return {
                ...state,
                loading: false,
                avail_machines: action.payload
            };
        case GET_ACTIVE_USERS:
            return {
                ...state,
                loading: false,
                active_users: action.payload
            };
        case GET_ADMIN:
            return {
                ...state,
                loading: false,
                token: action.payload
            };
        case COUNT:
            return {
                ...state,
                loading: false,
                count: action.payload
            };
        case PICTURE:
            return {
                ...state,
                loading: false,
                picture: action.payload
            };
        case DASHBOARD:
            return {
                ...state,
                loading: false,
                admin: action.payload
            };
        case DELETE_ITEM:
            return {
                    ...state,
                    items: state.items.filter(item => item.results._id !== action.payload.results)
            };
        case DELETE_MACHINE:
            return {
                    ...state,
                    machine: state.machines.filter(item => item._id !== action.payload)
            };
        case DELETE_ADMIN:
            return {
                    ...state,
                    admins: state.admins.filter(item => item._id !== action.payload)
            };
        case ADD_USER:
            return {
                    ...state,
                    items: [action.payload, ...state.items]
                };
        case ADD_MACHINE:
            return {
                    ...state,
                   machines: [action.payload, ...state.machines]
                };
        case ADD_ADMIN:
            return {
                    ...state,
                    admins: [action.payload, ...state.admins]
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
