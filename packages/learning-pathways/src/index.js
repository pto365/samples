import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LearningPath from './LearningPath';
import * as serviceWorker from './serviceWorker';

import {login} from "./authenticate" // autonom library - will force signin
//import "./helpers/OfficeGraph"
//login()
ReactDOM.render(<LearningPath />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
