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
      users: [],
      register: false,
      session: null,
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
    let newTask = {title:"Title", description:"Description", completed:false, timespent:0, user_id:null}
    $.ajax("/api/v1/tasks", {
      method: "post",
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

  render() {
    let login = this.state.register ?
    // If registration is true, the app is in "registration mode" and we show a registraton form
    <div>
      <h1>Task Tracker</h1>
      <h2>Create Account</h2>
      <div className="form">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button className="btn btn-primary" onClick={() => this.register("example@blah.blah", "password")}>Register</button>
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
      <button className="btn btn-primary" onClick={this.register.bind(this)}>No account? Register</button>
    </div>;

    let display = this.state.session ? 
    // if the session is not null, it means a user is currently logged in, so we display the tasks
    <div>
      <Router>
        <div>
          <Header root={this} />
          <Route path="/" exact={true} render={() =>
            <TaskList tasks={this.state.tasks} root={this}/>
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
      <h1><Link to={"/"}>Task Tracker</Link></h1>
    </div>

    <div className="col-md-2">
      <button className="btn btn-secondary">Log out</button>
    </div>
  </div>;
}

// Component to render a lists of tasks
 function TaskList(props) {
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} />);
  // Displays form to create a task and the list of tasks below it
  return (<div>
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8">
                <h3>New task</h3>
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea className="form-control" id="desc" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="assignto">Assign to</label>
                        <select className="form-control" id="assignto">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">Create Task</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <p>____________________________________________________________________________________________________________________________________</p>
            <h3>Tasks</h3>
            <div className="row">
              {tasks}
            </div>
         </div>);
}

// Component to render a single task, with a title, description, timespent, complete flag and user assigned to
 function Task(props) {
  let {task} = props;
  return <div className="card col-12">
          <div className="card-body">
            <h2 className="card-title">{task.title}</h2>
            <p className="card-text">{task.description}</p>
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Timespent</label>
                <input type="number" className="form-control" id="exampleInputPassword1" value={task.timespent}/>
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Assign to</label>
                <select className="form-control" id="exampleFormControlSelect1">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" checked={task.completed} id="exampleCheck1"/>
                <label className="form-check-label" htmlFor="exampleCheck1">Complete</label>
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
            </form>
          </div>
       </div>;
}