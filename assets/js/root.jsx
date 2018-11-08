import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

import TaskList from './task_list';
import Header from './header';
import api from './api';

 export default function root_init(node) {
  let tasks = window.tasks;
  ReactDOM.render(<Root tasks={tasks} />, node);
}

 class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
      users: [],
      register: false,
      sessionToken: null,
      newTask: {title:"", description:"", completed: false, timespent:0, user_id:1},
      newUser: {email:"", password_hash:""},
      login_email: "",
      login_password: "",
    };
    this.fetch_tasks();
    this.fetch_users();
  }

  fetch_tasks() {
    $.ajax("/api/v1/tasks", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
        this.setState(state1);
      },
    });
  }
  create_task() {
    $.ajax("/api/v1/tasks", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({task: this.state.newTask}),
      success: (resp) => {
        console.log(resp.data)
        let newTask1 = {title:"", description:"", completed: false, timespent:0, user_id:1};
        let tasks1 = _.concat(this.state.tasks, [resp.data]);
        let state1 = _.assign({}, this.state, { tasks: tasks1, newTask: newTask1 });
        this.setState(state1);
      }
    });
  }

  edit_task(id) {
    let newTask = this.getTask(id);
    $.ajax("/api/v1/tasks/" + id, {
      method: "put",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({id: id, task: newTask}),
      success: (resp) => {
        console.log(resp.data);
        let tasks = this.state.tasks;
        _.map(tasks, (tt) => {
          return tt.id == resp.data.id ? resp.data : tt;
        })
        let state1 = _.assign({}, this.state, { tasks: tasks });
        this.setState(state1);
      }
    });
  }
  delete_task(id) {
    $.ajax("/api/v1/tasks/" + id, {
      method: "delete",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({task: this.state.newTask}),
      success: () => {
        let tasks1 = _.filter(this.state.tasks, (tt) => tt.id != id);
        let state1 = _.assign({}, this.state, { tasks: tasks1 });
        this.setState(state1);

      }
    });
  }

  fetch_users() {
    $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { users: resp.data });
        this.setState(state1);
      }
    });
  }

  register() {
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({user: this.state.newUser}),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { register: false });
        this.setState(state1);
      }
    });
  }

  create_session(email, password) {
    $.ajax("/api/v1/sessions", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({email, password}),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { sessionToken: resp.data });
        this.setState(state1);
      }
    });
  }

  endSession() {
    let action ={
      type: "EDIT_SESSION",
      data: null
    }
    let state1 = _.assign({}, this.state, { sessionToken: null });
    this.setState(state1);
  }

  registration_mode() {
    let state1 = _.assign({}, this.state, { register: true });
    this.setState(state1);
  }

  cancel_registration() {
    let state1 = _.assign({}, this.state, { register: false });
    this.setState(state1);
  }

  getTask(id) {
    let tasks = this.state.tasks;
    let task = null;
    _.map(tasks, (tt) => {
      if (tt.id == id) {
        task = tt;
      }
    });
    return task;
  }

  updateTask(id, newTask) {
    let tasks = this.state.tasks;
    let new_tasks = _.map(tasks, (tt) => {
      return tt.id == id ? newTask : tt;
    })

    let state1 = _.assign({}, this.state, { tasks: new_tasks });
    this.setState(state1);
  }

  logTime(taskid, time) {
    let task = this.getTask(taskid);
    task.timespent = parseInt(time);
    this.updateTask(taskid, task);
  }

  togglecomplete(taskid) {
    let task = this.getTask(taskid);
    task.completed = !task.completed;
    this.updateTask(taskid, task);
  }

  assign(taskid, userid) {
    let task = this.getTask(taskid);
    task.user_id = parseInt(userid);
    this.updateTask(taskid, task);
  }

  newtask_title(title) {
    let task = this.state.newTask;
    task.title = title;
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  newtask_description(description) {
    let task = this.state.newTask;
    task.description = description;
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  newtask_assignment(uid) {
    let task = this.state.newTask;
    task.user_id = uid;
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  render() {
    let newUserEmail = (ev) => {
      let user = this.state.newUser;
      user.email = ev.target.value;
      let state1 = _.assign({}, this.state, { newUser: user });
      this.setState(state1);
    }
    let newUserPassword = (ev) => {
      let user = this.state.newUser;
      user.password_hash = ev.target.value;
      let state1 = _.assign({}, this.state, { newUser: user });
      this.setState(state1);
    }
    let loginEmail = (ev) => {
      let email = ev.target.value;
      let state1 = _.assign({}, this.state, { login_email: email });
      this.setState(state1);
    }
    let loginPassword = (ev) => {
      let password = ev.target.value;
      let state1 = _.assign({}, this.state, { login_password: password });
      this.setState(state1);
    }

    let login = this.state.register ?

    <div>
      <h1>Task Tracker</h1>
      <h2>Create Account</h2>
      <div className="form">
        <input  type="email" 
                placeholder="email" 
                onChange={newUserEmail}/>

        <input  type="password" 
                placeholder="password" 
                onChange={newUserPassword}/>

        <button className="btn btn-info" 
                onClick={() => this.register(this.state.newUser.email, this.state.newUser.password)}>
                Register
        </button>
      </div>
      <button className="btn btn-secondary" 
              onClick={() => this.cancel_registration()}>
              Cancel
      </button>
    </div> 
    :
    <div>
      <h1>Task Tracker</h1>
      <div className="form-inline my-2">
        <input  type="email" 
                placeholder="email" 
                onChange={loginEmail}/>

        <input  type="password" 
                placeholder="password" 
                onChange={loginPassword}/>

        <button className="btn btn-secondary" 
                onClick={() => this.create_session(this.state.login_email, this.state.login_password)}>
                Login
        </button>
      </div>
      <button className="btn btn-info" 
              onClick={this.registration_mode.bind(this)}>
              No account? Register
      </button>
    </div>;

    let display = this.state.sessionToken ? 
    <div>
      <Header root={this} />
      <TaskList newTask={this.state.newTask} 
                tasks={this.state.tasks} 
                session={this.state.sessionToken} 
                users={this.state.users} 
                root={this}/>
    </div>
    : 
    <div>
      {login}
    </div>;

    return display;
  }
}