import React from 'react';
import { render } from 'react-dom';

import { Router, hashHistory } from 'react-router';
// import Perf from 'react-addons-perf';
// window.Perf = Perf; // 挂载到全局变量方便使用

import Routes from './Router/Index';

import './Style/base.scss';
// hashHistory, browserHistory
render(
    <Router history={hashHistory} routes={Routes.routes()} />,
    document.getElementById('app'),
);
