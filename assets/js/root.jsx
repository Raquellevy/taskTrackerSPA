import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

 export default function root_init(node) {
  let tasks = window.tasks;
  ReactDOM.render(<Root tasks={tasks} />, node);
}

 class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: props.tasks,
      register: false,
      session: null,
      newTask: {title:"", description:"", completed: false, timespent:0, user_id:0}
    };
    this.fetch_tasks();
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

  create_session(email, password) {
    $.ajax("/api/v1/sessions", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({email, password}),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { session: resp.data });
        this.setState(state1);
      }
    });
  }

  register(email, pass) {
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({email: email, password_hash: pass}),
      success: (resp) => {
        this.create_session(email, pass);
      }
    });
  }

  create_task() {
    $.ajax("/api/v1/tasks", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.newTask),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
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
      data: JSON.stringify(newTask),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
        this.setState(state1);
      }
    });
  }

  register() {
    let state1 = _.assign({}, this.state, { register: true });
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
    task.user_id = userid;
    this.updateTask(taskid, task);
  }

  newtask_title(title) {
    let task = this.state.newTask;
    task.title = title;
    console.log(title);
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  newtask_description(description) {
    let task = this.state.newTask;
    task.description = description;
    console.log(description);
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  newtask_assignment(uid) {
    let task = this.state.newTask;
    task.user_id = uid;
    console.log(task)
    let state1 = _.assign({}, this.state, { newTask: task });
    this.setState(state1);
  }

  render() {
    let login = this.state.register ?
    // If registration is true, the app is in "registration mode" and we show a registraton form
    <div>
      <h1>Task Tracker</h1>
      <h2>Create Account</h2>
      <div className="form">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button className="btn btn-info" onClick={() => this.register("example@blah.blah", "password")}>Register</button>
      </div>
    </div> 
    :
    // If registration is false, the app is not in "registration mode" and we show a login form
    <div>
      <h1>Task Tracker</h1>
      <div className="form-inline my-2">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button className="btn btn-secondary" onClick={() => this.create_session("raquel@example.com", "pass1")}>Login</button>
      </div>
      <button className="btn btn-info" onClick={this.register.bind(this)}>No account? Register</button>
    </div>;

    let display = this.state.session ? 
    // if the session is not null, it means a user is currently logged in, so we display the tasks
    <div>
      <Router>
        <div>
          <Header root={this} />
          <Route path="/" exact={true} render={() =>
            <TaskList newTask={this.state.newTask} tasks={this.state.tasks} root={this}/>
          } />
        </div>
      </Router>
    </div> 
    : 
    // if the session is null it means the user is not logged in so we show the login page
    <Router>
      {login}
    </Router>;

    return display;
  }
}

// Header nav for when a user is logged in, has main link to Task Tracker and log out button
function Header(props) {
  return <div className="row my-2">
    <div className="col-md-10">
      <h1>Task Tracker</h1>
    </div>

    <div className="col-md-2">
      <button className="btn btn-secondary">Log out</button>
    </div>
  </div>;
}

// Component to render a lists of tasks
 function TaskList(props) {
  let newTask = props.newTask;
  let newTitle = (ev) => {
    props.root.newtask_title(ev.target.value);
  };
  let newDesc = (ev) => {
    props.root.newtask_description(ev.target.value);
  };
  let newAssign = (ev) => {
    props.root.newtask_assignment(ev.target.value);
  };  
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} root={props.root}/>);
  // Displays form to create a task and the list of tasks below it
  return (<div>
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8">
                <div className="card bg-light border-info mb-3">
                  <h2 className="card-header">New Task</h2>
                  <div className="card-body text-info">
                    <form>
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title" value={newTask.title} onChange={newTitle}/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea className="form-control" id="desc" value={newTask.description} onChange={newDesc}/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="assignto">Assign to</label>
                        <select className="form-control" id="assignto" value={newTask.user_id} onChange={newAssign}>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                    </form>
                    <button className="btn btn-info" onClick={() => props.root.create_task()}>Create Task</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {tasks}
            </div>
         </div>);
}

// Component to render a single task, with a title, description, timespent, complete flag and user assigned to
 function Task(props) {
  let {root, task} = props;
  let timechanged = (ev) => {
    root.logTime(task.id, ev.target.value);
  };
  let completechanged = (ev) => {
    root.togglecomplete(task.id);
  };
  let assignchanged = (ev) => {
    root.assign(task.id, ev.target.value);
  };  
  return <div className="card text-white bg-secondary mb-3 col-12">
          <h2 className="card-header">{task.title}</h2>
          <div className="card-body">
            <p className="card-text">{task.description}</p>
            <form>
              <div className="form-group">
                <label htmlFor="logtime">Timespent</label>
                <input type="number" className="form-control" id="logtime" step={15} value={task.timespent} onChange={timechanged}/>
              </div>
              <div className="form-group">
                <label htmlFor="assign">Assign to</label>
                <select className="form-control" id="assign" onChange={assignchanged}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" checked={task.completed} id="completed" onChange={completechanged}/>
                <label className="form-check-label" htmlFor="completed">Complete</label>
              </div>
            </form>
            <button className="btn btn-info" onClick={() => root.edit_task(task.id)}>Save</button>
          </div>
       </div>;
}