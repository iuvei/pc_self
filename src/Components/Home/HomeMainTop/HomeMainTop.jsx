import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react';
import top from '../Img/top.png';
import './HomeMainTop.scss'

@observer
export default class HomeMainTop extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div className="home_m_top">
                <a href="https://www.guqxa.com/index.html" target="_blank">
                    <img className="img_bg" src={top} alt=""/>
                </a>
            </div>
        )
    }
}
