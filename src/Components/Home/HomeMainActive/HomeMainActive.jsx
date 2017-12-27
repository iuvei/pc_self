import React, {Component} from 'react';
import {observer} from 'mobx-react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

import './HomeMainActive.scss'

import home_active01 from '../Img/home_active01.png'
import home_active02 from '../Img/home_active02.png'
import home_active03 from '../Img/home_active03.png'
import home_active04 from '../Img/home_active04.png'

@observer
export default class HomeMainActive extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };
    getChildrenToRender(item, i) {
        return (
            <li key={i}>
                <a href="#">
                    <img src={item.img} alt=""/>
                    <p className="home_m_active_type">{item.content}</p>
                </a>
            </li>
        );
    };
    render() {
        const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
        const dataArray = [
            { img: home_active01, content: '每日签到' },
            { img: home_active02, content: '周反水' },
            { img: home_active03, content: '天天领红包' },
            { img: home_active04, content: '投注有礼' },
        ];
        const childrenToRender = dataArray.map(this.getChildrenToRender);
        return (
                <div className="home_main_active">
                    <div className="home_m_active" key="home_active_op">
                        <OverPack playScale={0.3}>
                            <TweenOne
                                key="icon"
                                animation={oneAnim}
                                className="home_favourable_active"
                                reverseDelay={300} //开始倒放时的延时
                            >
                            </TweenOne>
                            <TweenOne
                                key="p"
                                animation={oneAnim}
                                component="p"
                                reverseDelay={200}
                            >
                                <i style={{color:'#BC0000'}}>优惠</i>活动
                            </TweenOne>
                            <TweenOne
                                animation={{ ...oneAnim, delay: 100 }}
                                component="h5"
                                key="h5"
                            >
                                FAVOURABLE ACTIVITY
                            </TweenOne>
                            <QueueAnim type="bottom"
                                       component="ul"
                                       className="home_m_active_list clear"
                                       key="ul"
                                       leaveReverse
                            >
                                {childrenToRender}
                            </QueueAnim>
                        </OverPack>
                    </div>
                </div>
        )
    }
}
