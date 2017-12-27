import React, {Component} from 'react';
import {observer} from 'mobx-react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';

import './HomeMainLottery.scss'

import home_lottery01 from '../Img/home_lottery01.jpg';
import home_lottery02 from '../Img/home_lottery02.jpg';
import home_lottery03 from '../Img/home_lottery03.jpg';

@observer
export default class HomeMainLottery extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    };
    getChildrenToRender(item, i){
        return (
            <li key={i}>
                <img src={item.img} width="100%" alt=""/>
                <div className="home_m_lottery_type home_m_lottery_type_hover">
                    <h3>{item.name}</h3>
                    <h4>{item.describe}</h4>
                    <a href="javascript:void(0)" className="home_m_gaming">{item.action}</a>
                </div>
            </li>
        )
    };
    render() {
        const dataArray = [
            { img: home_lottery01, name: '重庆时时彩', describe: '重庆市福利彩票发行中心承销的福彩快开彩票', action: '立即游戏' },
            { img: home_lottery02, name: '腾讯分分彩', describe: '重庆市福利彩票发行中心承销的福彩快开彩票', action: '立即游戏' },
            { img: home_lottery03, name: '泰国300秒', describe: '重庆市福利彩票发行中心承销的福彩快开彩票', action: '立即游戏' },
        ];
        const childrenToRender = dataArray.map(this.getChildrenToRender);
        return (
            <OverPack playScale={0.2}>
                <QueueAnim type="bottom"
                           component="ul"
                           className="home_m_lottery clear"
                           key="ul"
                           leaveReverse
                >
                    {childrenToRender}
                </QueueAnim>
            </OverPack>
        )
    }
}
