import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import api from './api';

function Header(props) {
    return <div className="row my-2">
            <div className="col-md-10">
              <h1>Task Tracker</h1>
            </div>
  
            <div className="col-md-2">
              <button className="btn btn-secondary" 
                      onClick={api.endSession}>
                      Log out
              </button>
            </div>
          </div>;
  }

  export default Header;