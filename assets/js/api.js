import store from './store';

class TheServer {
    fetch_path(path, callback) {
        $.ajax(path, {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: callback,
        });
    }

    send_post(path, data, callback) {
        $.ajax(path, {
          method: "post",
          dataType: "json",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(data),
          success: callback,
        });
    }

    send_put(path, data, callback) {
        $.ajax(path, {
          method: "put",
          dataType: "json",
          contentType: "application/json; charset=UTF-8",
          data: JSON.stringify(data),
          success: callback,
        });
    } 
    
    delete(path, callback) {
        $.ajax(path, {
            method: "delete",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: callback,
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
            }
        )
    }

    create_task() {
        this.send_post(
            "/api/v1/tasks",
            {task: this.state.newTask},
            (resp) => {this.fetch_tasks()});
    }
    
    edit_task(id) {
        this.send_put(
            "/api/v1/tasks/" + id,
            {id: id, task: newTask},
            (resp) => {this.fetch_tasks()}
        );
    }

    delete_task(id) {
        this.delete(
            "/api/v1/tasks/" + id,
            {task: this.state.newTask},
            () => {this.fetch_tasks()}
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
    
    register() {
        this.send_post(
            "/api/v1/users",
            {user: this.state.newUser},
            (resp) => {this.fetch_users()}
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
            }
        );
    }

}

export default new TheServer();