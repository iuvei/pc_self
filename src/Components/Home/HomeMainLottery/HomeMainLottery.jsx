import React, {Component} from 'react';
import {observer} from 'mobx-react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import './HomeMainLottery.scss'
import home_lottery01 from '../Img/chongqing.png';
import home_lottery02 from '../Img/beijingPK10.png';
import home_lottery03 from '../Img/taiguommc.png';

@observer
export default class HomeMainLottery extends Component {
    getChildrenToRender(item, i){
        return (
            <li key={i}>
                <div className="h_l_content">
                    <img src={item.img} width="100%" alt=""/>
                    <div className="home_m_lottery_type home_m_lottery_type_hover">
                        <a href="javascript:void(0)" className="home_m_gaming">{item.action}</a>
                    </div>
                </div>
            </li>
        )
    };
    render() {
        const dataArray = [
            { img: home_lottery01, action: '立即游戏' },
            { img: home_lottery02, action: '立即游戏' },
            { img: home_lottery03, action: '立即游戏' },
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
