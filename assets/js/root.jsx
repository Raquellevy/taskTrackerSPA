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


  fetch_users() {
    $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let state1 = _.assign({}, this.state, { users: resp.data });
        this.setState(state1);
      },
    });
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

  create_user(email, pass) {
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({email: email, password_hash: pass}),
      success: (resp) => {
        let state1 = _.assign({}, this.state, { tasks: resp.data });
        this.setState(state1);
      }
    });
  }

  fetch_task(id) {
    let task = {};
    _map(this.state.tasks, (tt) => {
      if (tt.id == id ){
        task = tt;
      }
    })

    return task;
  }

  register() {
    let state1 = _.assign({}, this.state, { register: true });
    this.setState(state1);
  }

  render() {
    let login = this.state.register ?
    <div>
      <h1>Task Tracker</h1>
      <h2>Create Account</h2>
      <div className="form">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button className="btn btn-primary" onClick={() => this.create_user("example@blah.blah", "password")}>Register</button>
      </div>
    </div> :
    <div>
    <h1>Task Tracker</h1>
    <div className="form-inline my-2">
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <button className="btn btn-secondary" onClick={() => this.create_session("raquel@example.com", "pass1")}>Login</button>
    </div>
    <button className="btn btn-primary" onClick={this.register.bind(this)}>No account? Register</button>
  </div>
    ;

    let display = this.state.session ? 
    <div>
      <Router>
        <div>
          <Header root={this} />
          <Route path="/" exact={true} render={() =>
            <TaskList tasks={this.state.tasks} root={this}/>
          } />
          <Route path="/users" exact={true} render={() =>
             <UserList users={this.state.users} />
          } />
        </div>
      </Router>
    </div> 
    : 
    <Router>
      {login}
    </Router>;

    return display;
  }
}

/*
    <div className="col-md-2">
      <p><Link to={"/users"} onClick={props.root.fetch_users.bind(props.root)}>Users</Link></p>
    </div>*/
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

 function TaskList(props) {
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} />);
  return <div>
    <div className="row my-2">
      <div className="col-2">
        <button className="btn btn-primary" onClick={props.root.create_task.bind(props.root)}>New Task</button>
      </div>
    </div>

  <div className="row">
    {tasks}
  </div>
  </div>;
}
 function Task(props) {
  let {task} = props;
  if (task.edit) {
    return <div>New Task</div>
  } else {
    return <div className="card col-4">
      <div className="card-body">
        <h2 className="card-title"><Link to={"/tasks/" + task.id}>{task.title}</Link></h2>
        <p className="card-text">{task.description}</p>
        <p>Time logged: {task.timespent}min</p>
        {task.completed ? <p>Complete!</p> : <p>Incomplete</p>}
      </div>
    </div>;
  }
}

function TaskForm(props) {
  return 
  <div>

  </div>
  ;

}

function TaskPage(props) {
  console.log("rendering a task");
  let task = props.task;
  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
    </div>

  );
}

function UserList(props) {
  let rows = _.map(props.users, (uu) => <User key={uu.id} user={uu} />);
  return <div className="row">
    <div className="col-12">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  </div>;
}

function User(props) {
  let {user} = props;
  return <tr>
    <td>{user.email}</td>
  </tr>;
}