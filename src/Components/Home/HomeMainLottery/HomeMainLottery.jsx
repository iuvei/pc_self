import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import { stateVar } from '../../../State';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import './HomeMainLottery.scss'
import home_lottery01 from '../Img/chongqing.png';
import home_lottery02 from '../Img/beijingPK10.png';
import home_lottery03 from '../Img/taiguommc.png';

@observer
export default class HomeMainLottery extends Component {
    constructor(props){
        super(props);
        this.state={};
    };
    /*立即游戏*/
    onLotterys(nav) {
        hashHistory.push('/lottery');
        window.scrollTo(0,0);
        stateVar.nowlottery.lotteryId = nav;
        stateVar.navIndex = 'lottery';
    };
    render() {
        const dataArray = [
            { img: home_lottery01, action: '立即游戏', nav: 'ssc', cnname: '重庆时时彩' },
            { img: home_lottery02, action: '立即游戏', nav: 'pk10', cnname: '北京pk10' },
            { img: home_lottery03, action: '立即游戏', nav: 'mmc', cnname: '泰国秒秒彩' },
        ];
        return (
            <OverPack playScale={0.3}>
                <QueueAnim type="bottom"
                           component="ul"
                           className="home_m_lottery clear"
                           key="ul"
                           leaveReverse
                >
                    {
                        dataArray.map((item)=>{
                            return (
                                <li key={item.nav}>
                                    <img src={item.img} width="100%" alt=""/>
                                    <div className="home_m_lottery_type home_m_lottery_type_hover" onClick={()=>this.onLotterys(item.nav)}>
                                        {item.action}
                                    </div>
                                </li>
                            )
                        })
                    }
                </QueueAnim>
            </OverPack>
        )
    }
}
