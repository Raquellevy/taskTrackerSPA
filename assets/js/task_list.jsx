import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import api from './api';

class TaskList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newTask: {title:"", description:"", completed: false, timespent:0, user_id:1}
      };
  
    }

    render () {
    let {tasks, users, session} = this.props;

    let newtask_title = (title) => {
        let task = this.state.newTask;
        task.title = title;
        let state1 = _.assign({}, this.state, { newTask: task });
        this.setState(state1);
    }
    
    let newtask_description = (description) => {
        let task = this.state.newTask;
        task.description = description;
        let state1 = _.assign({}, this.state, { newTask: task });
        this.setState(state1);
    }
    
    let newtask_assignment = (uid) => {
        let task = this.state.newTask;
        task.user_id = uid;
        let state1 = _.assign({}, this.state, { newTask: task });
        this.setState(state1);
    }

    let newTitle = (ev) => {
      newtask_title(ev.target.value);
    };

    let newDesc = (ev) => {
      newtask_description(ev.target.value);
    };

    let newAssign = (ev) => {
      newtask_assignment(parseInt(ev.target.value));
    };  
  
    let userOption = (user) => {
        return user.id == session.user_id ? 
                <option key={user.id} value={user.id} defaultValue>{user.email}</option> :
                <option key={user.id} value={user.id}>{user.email}</option>;
    };

    let createTask = () => {
        let state1 = _.assign({}, this.state.newTask, {title:"", description:"", completed: false, timespent:0, user_id:1});
        this.setState({newTask: state1});
        api.create_task(this.state.newTask, session.token)
    }
  
    let tasks1 = _.map(tasks, (t) => <Task key={t.id} task={t} users={users} session={session}/>);

    return (<div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card border-warning mb-3">
                            <h2 className="card-header bg-warning">New Task</h2>
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="title">Title*</label>
                                        <input type="text" className="form-control" id="title" value={this.state.newTask.title} onChange={newTitle}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="desc">Description*</label>
                                        <textarea className="form-control" id="desc" value={this.state.newTask.description} onChange={newDesc}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="assignto">Assign to*</label>
                                        <select className="form-control" id="assignto" value={this.state.newTask.user_id} onChange={newAssign}>{users.map(userOption)}</select>
                                    </div>
                                </form>
                                <button className="btn btn-info" onClick={createTask}>Create Task</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">{tasks1}</div>
            </div>);
    }
}
  
class Task extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        timespent: this.props.task.timespent,
        completed: this.props.task.completed,
        user_id: this.props.task.user_id
      };
    }

    updateTask(id) {
        let task1 = _.clone(this.props.task);
        task1.timespent = this.state.timespent;
        task1.completed = this.state.completed;
        task1.user_id = this.state.user_id;

        api.edit_task(id, task1, this.props.session.token);
    }
    
    logTime(time) {
        let state1 = _.assign({}, this.state, { timespent: time });
        this.setState(state1);
    }
    
    togglecomplete() {
        let state1 = _.assign({}, this.state, { completed: !this.state.completed });
        this.setState(state1);
    }
    
    assign(userid) {
        let state1 = _.assign({}, this.state, { user_id: userid });
        this.setState(state1);
    }

    render() {
        let {users, session, task} = this.props;

        let timechanged = (ev) => {
            this.logTime(ev.target.value);
        };
        let assignchanged = (ev) => {
            this.assign(ev.target.value);
        };  
        let completechanged = (ev) => {
            this.togglecomplete();
        };

        let userOption = (user) => {
            return user.id == session.user_id ? <option key={user.id} value={user.id} defaultValue>{user.email}</option> : <option key={user.id} value={user.id}>{user.email}</option>;
        };

        let minutesSpent = session.user_id == task.user_id ?
        <div className="form-group">
            <label htmlFor="logtime">Minutes spent</label>
            <input type="number" className="form-control" id="logtime" step={15} value={this.state.timespent} onChange={timechanged}/>
        </div>
        : <div className="form-group">Minutes spent: {task.timespent}</div>;

        return  <div className="col-md-4">
                    <div className="card border-infor mb-3 h-100">
                        <h2 className="card-header bg-light">{task.title}</h2>
                        <div className="card-body">
                            <p className="card-text">{task.description}</p>
                            <form>
                                {minutesSpent}
                                <div className="form-group">
                                    <label htmlFor="assign">Assign to</label>
                                    <select className="form-control" id="assign" defaultValue={task.user_id} onChange={assignchanged}>
                                        {users.map(userOption)}
                                    </select>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" checked={this.state.completed} id="completed" onChange={completechanged}/>
                                    <label className="form-check-label" htmlFor="completed">Complete</label>
                                </div>
                            </form>
                            <div className="text-right align-bottom">
                                <button className="btn btn-info" onClick={() => this.updateTask(task.id)}>Save</button>
                                <button className="btn btn-warning" onClick={() => api.delete_task(task.id, session.token)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>;
        }
  }

  function mapStateToProps(state) {
      return {
        tasks: state.tasks,
        users: state.users,
        session: state.session
      }
  }

  export default connect(mapStateToProps)(TaskList);