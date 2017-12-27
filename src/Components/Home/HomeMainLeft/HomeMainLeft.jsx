import React, {Component} from 'react';
import {observer} from 'mobx-react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';

import { stateVar } from '../../../State/Index';
import './HomeMainLeft.scss'

import active_close from'../Img/active_close.png'

@observer
export default class HomeMainLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showActive: stateVar.homeMainLeftActive,
        }
    };
    handclick() {
        stateVar.homeMainLeftActive = false;
        this.setState({showActive: false});
    };
    getChildrenToRender(item, index) {
        return (
            <li key={index}>
                <span>{item.text}</span>
                <i className="ellipsis">{index}</i>
                <span className="home_m_lottery_name ellipsis">{item.lotteryName}</span>
                <span>{item.status}</span>
                <em>{item.money}</em>
            </li>
        )
    };
    render() {
        const infoList = [
            {
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            },{
                text: '恭喜',
                name: 'vips45646',
                lotteryName: '重庆时时彩',
                status: '中奖',
                money: '5000元',
            }
        ];
        const childrenToRender = infoList.map(this.getChildrenToRender);
        return (
            <QueueAnim type={['left', 'left']} delay={200}>
                { this.state.showActive ?
                    <div className="home_main_left" key="home_left">
                        <img className="home_m_close" onClick={()=>{this.handclick()}} src={active_close} alt=""/>
                        <div className="home_m_info_controler">
                            <TweenOne
                                animation={{ y: '-=60', repeat: -1, duration: 8000, ease: 'linear' }}
                                key="ul"
                                component="ul"
                                className="home_m_info_list"
                            >
                                { childrenToRender }
                            </TweenOne>
                        </div>
                    </div> : null
                }

            </QueueAnim>
        )
    }
}
