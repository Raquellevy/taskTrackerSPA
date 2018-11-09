import store from './store';

class TheServer {
    fetch_path(path, callback, failcallback) {
        $.ajax(path, {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: callback,
            error: failcallback,
        });
    }

    send_post(path, data, callback, failcallback) {
        $.ajax(path, {
          method: "post",
          dataType: "json",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(data),
          success: callback,
          error: failcallback,
        });
    }

    send_put(path, data, token, callback, failcallback) {
        data.token = token
        $.ajax(path, {
          method: "put",
          dataType: "json",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(data),
          success: callback,
          error: failcallback,
        });
    } 
    
    delete(path, token, callback, failcallback) {
        $.ajax(path, {
            method: "delete",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({token: token}),
            success: callback,
            error: failcallback,
          });
    }

    fetch_tasks() {
        this.fetch_path(
            "/api/v1/tasks",
            (resp) => {
                store.dispatch({
                    type: 'TASK_LIST',
                    data: resp.data,
                });
            },
            (er) => {alert("invalid")},
        )
    }

    create_task(newTask, token) {
        this.send_post(
            "/api/v1/tasks",
            {task: newTask, token: token},
            (resp) => {this.fetch_tasks()},
            (er) => {alert("Fill in all fields to create a task")});
    }
    
    edit_task(id, newTask, token) {
        this.send_put(
            "/api/v1/tasks/" + id,
            {id: id, task: newTask},
            token,
            (resp) => {this.fetch_tasks()},
            (er) => {alert("invalid")},
        );
    }

    delete_task(id, token) {
        this.delete(
            "/api/v1/tasks/" + id,
            token,
            () => {this.fetch_tasks()},
            (er) => {alert("invalid")},
        );
    }
    
    fetch_users() {
        this.fetch_path(
            "/api/v1/users",
            (resp) => {
                store.dispatch({
                    type: 'USER_LIST',
                    data: resp.data,
                });
            }
        );
    }
    
    register(newUser) {
        this.send_post(
            "/api/v1/users",
            {user: newUser},
            (resp) => {
                store.dispatch({
                    type: 'REGISTRATION_MODE',
                    data: false
                });
            },
            (er) => {alert("Invalid email address")},
        );
    }
    
    create_session(email, password) {
        this.send_post(
            "/api/v1/sessions",
            {email, password},
            (resp) => {
                store.dispatch({
                    type: 'NEW_SESSION',
                    data: resp.data,
                });
            },
            (er) => {
                console.log("Request failed");
                alert("Invalid email/password")},
        );
    }

    endSession() {
        let action = {
          type: "END_SESSION",
          data: null
        }
        store.dispatch(action);
    }
    
    registration_mode() {
        let action = {
          type: 'REGISTRATION_MODE',
          data: true
        }
        store.dispatch(action);
    }
    
    cancel_registration() {
        let action = {
          type: 'REGISTRATION_MODE',
          data: false
        }
        store.dispatch(action);
    }

   
}

export default new TheServer();