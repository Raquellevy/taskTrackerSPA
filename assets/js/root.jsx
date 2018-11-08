
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import _ from 'lodash';

import TaskList from './task_list';
import Header from './header';
import api from './api';

 export default function root_init(node, store) {
  let action = {
    type: 'TASK_LIST',
    data: window.tasks,
  };
  store.dispatch(action);

  api.fetch_tasks();
  api.fetch_users();

  let ConnectedRoot = connect(mapStateToProps)(Root)

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRoot />
    </Provider>, node);
}

 class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: {email:"", password:""},
      login_email: "",
      login_password: "",
    };

  }

  render() {
    let {session, register} = this.props;
    let newUserEmail = (ev) => {
      let user = this.state.newUser;
      user.email = ev.target.value;
      let state1 = _.assign({}, this.state, { newUser: user });
      this.setState(state1);
    }
    let newUserPassword = (ev) => {
      let user = this.state.newUser;
      user.password = ev.target.value;
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

    let login = register ?

    <div>
      <h1>Task Tracker</h1>
      <h2>Create Account</h2>
      <div className="form">
        <input  type="email" placeholder="email" onChange={newUserEmail}/>
        <input  type="password" placeholder="password" onChange={newUserPassword}/>
        <button className="btn btn-info" onClick={() => api.register({email: this.state.newUser.email, password: this.state.newUser.password})}>Register</button>
      </div>
      <button className="btn btn-secondary" onClick={api.cancel_registration}>Cancel</button>
    </div> 
    :
    <div>
      <h1>Task Tracker</h1>
      <div className="form-inline my-2">
        <input type="email" placeholder="email" onChange={loginEmail}/>
        <input type="password" placeholder="password" onChange={loginPassword}/>

        <button className="btn btn-secondary" onClick={() => api.create_session(this.state.login_email, this.state.login_password)}>Login</button>
      </div>
      <button className="btn btn-info" onClick={api.registration_mode}>No account? Register</button>
    </div>;

    let display = session ? 
    <div>
      <Header />
      <TaskList />
    </div>
    : 
    <div>
      {login}
    </div>;

    return display;
  }
}

function mapStateToProps(state) {
  return {
    session: state.session,
    register: state.register
  }
}

