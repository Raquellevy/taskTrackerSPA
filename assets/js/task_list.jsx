import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import api from './api';

function TaskList(props) {
    let {root, tasks, users, newTask, session} = props;

    let newTitle = (ev) => {
      root.newtask_title(ev.target.value);
    };

    let newDesc = (ev) => {
      root.newtask_description(ev.target.value);
    };

    let newAssign = (ev) => {
      root.newtask_assignment(parseInt(ev.target.value));
    };  
  
    let userOption = (user) => {
        return user.id == session.user_id ? 
                <option key={user.id} value={user.id} defaultValue>{user.email}</option> :
                <option key={user.id} value={user.id}>{user.email}</option>;
    };
  
    let tasks1 = _.map(tasks, (t) => <Task key={t.id} task={t} users={users} session={session} root={root}/>);

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
                                        <input type="text" 
                                                className="form-control" 
                                                id="title" 
                                                value={newTask.title} 
                                                onChange={newTitle}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="desc">Description</label>
                                        <textarea className="form-control" 
                                                    id="desc" 
                                                    value={newTask.description} 
                                                    onChange={newDesc}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="assignto">Assign to</label>
                                        <select className="form-control" 
                                                id="assignto" 
                                                value={newTask.user_id}
                                                onChange={newAssign}>
                                            {users.map(userOption)}
                                        </select>
                                    </div>
                                </form>
                                <button className="btn btn-info" 
                                        onClick={() => root.create_task()}>
                                        Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {tasks1}
                </div>
            </div>);
}
  
function Task(props) {
    let {root, users, session, task} = props;
    let timechanged = (ev) => {
        root.logTime(task.id, ev.target.value);
    };
    let completechanged = (ev) => {
        root.togglecomplete(task.id);
    };
    let assignchanged = (ev) => {
        root.assign(task.id, ev.target.value);
    };  

    let userOption = (user) => {
        return user.id == session.user_id ? <option key={user.id} value={user.id} defaultValue>{user.email}</option> : <option key={user.id} value={user.id}>{user.email}</option>;
        };

    let minutesSpent = session.user_id == task.user_id ?
    <div className="form-group">
        <label htmlFor="logtime">Minutes spent</label>
        <input 
            type="number" 
            className="form-control" 
            id="logtime" 
            step={15} 
            value={task.timespent} 
            onChange={timechanged}/>
    </div>
    : null;

    return  <div className="col-md-12">
                <div className="card border-warning mb-3">
                    <h2 className="card-header bg-warning">{task.title}</h2>
                    <div className="card-body">
                        <p className="card-text">{task.description}</p>
                        <form>
                            {minutesSpent}
                            <div className="form-group">
                                <label htmlFor="assign">Assign to</label>
                                <select 
                                    className="form-control" 
                                    id="assign" 
                                    defaultValue={task.user_id} 
                                    onChange={assignchanged}>
                                    {users.map(userOption)}
                                </select>
                            </div>
                            <div className="form-check">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    checked={task.completed} 
                                    id="completed" 
                                    onChange={completechanged}/>
                                <label className="form-check-label" htmlFor="completed">Complete</label>
                            </div>
                        </form>
                        <div className="text-right">
                            <button 
                                className="btn btn-info" 
                                onClick={() => root.edit_task(task.id)}>
                                Save
                            </button>
                            <button 
                                className="btn btn-warning" 
                                onClick={() => root.delete_task(task.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>;
  }

  export default TaskList;