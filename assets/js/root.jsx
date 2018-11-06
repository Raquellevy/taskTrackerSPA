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
      session: null,
    };
    this.fetch_tasks();
    this.fetch_users();
    this.create_session("raquel@example.com", "pass1");
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

  fetch_task(id) {
    let task = {};
    _map(this.state.tasks, (tt) => {
      if (tt.id == id ){
        task = tt;
      }
    })

    return task;
  }

  render() {
    return <div>
      <Router>
        <div>
          <Header root={this} />
          <button className="btn btn-primary">New Task</button>
          <Route path="/" exact={true} render={() =>
            <TaskList tasks={this.state.tasks} />
          } />
          <Route path="/users" exact={true} render={() =>
             <UserList users={this.state.users} />
          } />

        </div>
      </Router>
    </div>;
  }
}

function Header(props) {
  return <div className="row my-2">
    <div className="col-4">
      <h1><Link to={"/"}>Task Tracker</Link></h1>
    </div>
    <div className="col-2">
      <p><Link to={"/users"} onClick={props.root.fetch_users.bind(props.root)}>Users</Link></p>
    </div>
    <div className="col-6">
      <div className="form-inline my-2">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button className="btn btn-secondary">Login</button>
      </div>
    </div>
  </div>;
}

 function TaskList(props) {
  let tasks = _.map(props.tasks, (t) => <Task key={t.id} task={t} />);
  return <div className="row">
    {tasks}
  </div>;
}
 function Task(props) {
  let {task} = props;
  console.log(task)
  return <div className="card col-4">
    <div className="card-body">
      <h2 className="card-title"><Link to={"/tasks/" + task.id}>{task.title}</Link></h2>
      <p className="card-text">{task.description}</p>
      <p>Time logged: {task.timespent}min</p>
      {task.completed ? <p>Complete!</p> : <p>Incomplete</p>}
    </div>
  </div>;
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