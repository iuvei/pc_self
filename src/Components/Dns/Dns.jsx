/*防劫持教程*/
import React, {Component} from 'react';

import logo from '../../Images/logo.png';
import dns_top from './Img/dns_top.jpg';
import dns_content from './Img/dns_content.jpg';
import './Dns.scss';

export default class Dns extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div className="dns">
                <div className="dns_top">
                    <img src={logo} alt=""/>
                </div>
                <img className="dns_top_img" src={dns_top} alt=""/>
                <img src={dns_content} alt=""/>
            </div>
        )
    }
}
