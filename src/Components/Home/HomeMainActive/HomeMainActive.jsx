import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../../State';
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
    onHashHistorys() {
        hashHistory.push('/activity');
        stateVar.navIndex = 'activity';
    };
    render() {
        const oneAnim = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
        const dataArray = [
            { img: home_active01, content: '每日签到' },
            { img: home_active02, content: '千金一掷好运到' },
            { img: home_active03, content: '好彩旺旺来' },
            { img: home_active04, content: '欢乐「泰」平年' },
        ];
        return (
                <div className="home_main_active">
                    <div className="home_m_active" key="home_active_op">
                        <OverPack playScale={0.3}>
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
                            <QueueAnim
                                    type="bottom"
                                    component="ul"
                                    className="home_m_active_list clear"
                                    key="ul"
                                    leaveReverse
                            >
                                {
                                    dataArray.map((item, i)=>{
                                        return (
                                            <li key={i} onClick={()=>this.onHashHistorys()}>
                                                <img src={item.img} alt=""/>
                                                <p className="home_m_active_type">{item.content}</p>
                                            </li>
                                        )
                                    })
                                }
                            </QueueAnim>
                        </OverPack>
                    </div>
                </div>
        )
    }
}
