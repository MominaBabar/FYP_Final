import { GET_ITEMS, DELETE_ITEM, ADD_ITEM,FORGOT_PASSWORD, GET_ALARMS, ADD_ALARM, EDIT_ALARM, DELETE_ALARM, ITEMS_LOADING,GET_USER, GET_HISTORY, EDIT_USER, ADD_MEDIA, GET_MEDIA, MOVE_ROBOT, NOTIFY_CLEAN, NOTIFY_BATTERY, GET_CLEAN, GET_BATTERY, ADD_HISTORY } from '../actions/types';
const initialState = {
    user: {},
    items: [],
    loading: false,
    alarms:[],
    history:[],
    media:[],
    move:"",
    clean:false,
    battery:false,
    forgot:{}
}

export default function(state=initialState, action){
    switch(action.type)
    {
        case GET_ALARMS:
        return {
            ...state,
            loading: false,
            alarms: action.payload
        };
        case FORGOT_PASSWORD:
        return {
            ...state,
            loading: false,
            forgot: action.payload
        };
        case MOVE_ROBOT:
        return {
            ...state,
            loading: false,
            move: action.payload
        };
        case GET_MEDIA:
        return {
            ...state,
            loading: false,
            media: action.payload
        };
        case GET_CLEAN:
        return {
            ...state,
            loading: false,
            clean: action.payload
        };
        case GET_BATTERY:
        return {
            ...state,
            loading: false,
            battery: action.payload
        };
        case EDIT_USER:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case NOTIFY_CLEAN:
            return {
                ...state,
                loading: false,
                clean: action.payload
            }; 
        case NOTIFY_BATTERY:
            return {
                ...state,
                loading: false,
                battery: action.payload
            };       
        case EDIT_ALARM:
            return {
                ...state,
                loading: false,
                alarms: action.payload
            };    
        case GET_HISTORY:
        return {
            ...state,
            loading: false,
           history: action.payload
        };
        case GET_USER:
            return {
                ...state,
                loading: false,
                user: action.payload
            };
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
        case DELETE_ALARM:
            return {
                    ...state,
                    alarms: state.alarms.filter(item => item._id !== action.payload)
            };    
        case ADD_ALARM:
            return {
                    ...state,
                    alarms: [action.payload, ...state.alarms]
                };
        case ADD_HISTORY:
            return {
                    ...state,
                    history: [action.payload, ...state.history]
                };
        case ADD_MEDIA:
            return {
                    ...state,
                   media: [action.payload, ...state.alarms]
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
