import {createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

/* MY STATE
this.state = {
    tasks: props.tasks,
    users: [],
    register: false,
    sessionToken: null,
    newTask: {title:"", description:"", completed: false, timespent:0, user_id:0},
    newUser: {email:"", password_hash:""},
    login_email: "",
    login_password: "",
};
*/

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

function register(state = false, action) {
    switch (action.type) {
    case 'NEW_USER':
        return action.data;
    default:
        return state;
    }
}

function sessionToken(state = null, action) {
    return state;
}

function newTask(state = {title:"", description:"", completed: false, timespent:0, user_id:0}, action) {
    return state;
}

function newUser(state = {email:"", password_hash:""}, action) {
    return state;
}

function login_email(state = "", action) {
    return state;
}

function login_password(state = "", action) {
    return state;
}


