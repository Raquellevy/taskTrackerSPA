import {createStore, combineReducers } from 'redux';
import _ from 'lodash';

function tasks(state = [], action) {
    switch (action.type) {
    case 'TASK_LIST':
        return action.data;
    default:
        return state;
    }
}

function users(state = [], action) {
    switch (action.type) {
    case 'USER_LIST':
        return action.data;
    default:
        return state;
    }
}

function session(state = null, action) {
    switch (action.type) {
    case 'NEW_SESSION':
        return action.data;
    case 'END_SESSION':
        return action.data;
    default:
        return state;
    }
}

function register(state = false, action) {
    switch (action.type) {
    case 'REGISTRATION_MODE':
        return action.data;
    default:
        return state;
    }
}

function newTask(state = {title:"", description:"", completed: false, timespent:0, user_id:0}, action) {
    switch (action.type) {
    case 'NEW_TASK_FORM':
        return action.data;
    default:
        return state;
    }
}

function root_reducer(state0, action) {
    let reducer = combineReducers({tasks, users, register, session, newTask});
    let state1 = reducer(state0, action);
    return state1;
  }

let store = createStore(root_reducer);
export default store;