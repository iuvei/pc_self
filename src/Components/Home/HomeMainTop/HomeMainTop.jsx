import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import { Carousel } from 'antd';
import top1 from '../Img/top1.png';
import top2 from '../Img/top2.png';

@observer
export default class HomeMainTop extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <Carousel autoplay>
                <div>
                    <a href="http://www.hc88zr.com" target="_blank">
                        <img style={{width: '100%'}} src={top2} alt="活动"/>
                    </a>
                </div>
                <div>
                    <a href="https://www.guqxa.com/index.html" target="_blank">
                        <img style={{width: '100%'}} src={top1} alt="活动"/>
                    </a>
                </div>
            </Carousel>
        )
    }
}
