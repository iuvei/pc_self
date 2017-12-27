import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Affix } from 'antd';
import QueueAnim from 'rc-queue-anim';
import Transform from '../../../CommonJs/transform.react.js';

import './RightSider.scss'
import Fetch from '../../../Utils'
import { stateVar } from '../../../State'
import commone from '../commone.js'

@observer
export default class RightSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	el1: {rotateZ: 0},
        	historyIssue:[]
        };
    }
    getRecentIssue(){
    	let tempId = commone.getLotteryId(stateVar.nowlottery.lotteryId);
    	Fetch.aboutBet({
    		method:"POST",
    		body:JSON.stringify({flag:'gethistoryten',lotteryid:tempId,issuecount:10})
    		}).then((data)=>{
    			if(data.status == 200){
    				let tempData = data.repsoneContent;
    				/*this.setState({historyIssue:tempData})*/
    			}
    		})
    };
    updateMoney() {
        this.setState({
            el1: {rotateZ: this.state.el1.rotateZ + 25}
        });
        if(this.state.el1.rotateZ<1080){
            window.requestAnimationFrame(this.updateMoney.bind(this));
        } else {
            this.setState({
                el1: {rotateZ: 0}
            })
        }
    };
    componentDidMount(){
    	this.getRecentIssue();
    }
    render() {
        return (
            <Affix offsetTop={120}>
                <QueueAnim duration={0}
                    animConfig={[
                    { opacity: [1, 0], translateX: [0, 80] }
                    ]}>
                    <div className="right_sider" key="RightSider">
                        <div className="user_info">
                            <ul className="user_info_list">
                                <li>您好！supervip01</li>
                                <li>彩票余额</li>
                                <li className="user_money">
                                    <span className="left">￥8888.88</span>
                                    <Transform className="update_money"
                                               rotateZ={this.state.el1.rotateZ}
                                               originX={0}
                                               originY={0}
                                               onClick={()=>{this.updateMoney()}}>
                                    </Transform>
                                </li>
                                <li>
                                    <div className="user_recharge">充值</div>
                                    <div className="user_withdrawal_transfer">
                                        <span className="withdrawal">提款</span>
                                        <span className="transfer">转账</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="history_period">
                            <ul className="thead_title">
                                <li>奖期</li>
                                <li>号码</li>
                                <li>直选和值</li>
                            </ul>
                            {
                            	this.state.historyIssue.map((value,index)=>{
                            		return(
                            			<ul className="tbody_title" key={index}>
			                                <li>{
			                                	(value.issue.split('-').length == 2 ? value.issue.split('-')[1] : value.issue.split('-')[0]) +'期'
			                                }</li>
			                                <li><ul className="right_ball_number clear">{
			                                	value.code.split('').map((val,idx)=>{
			                                		return (
					                                    <li key={idx}>{val}</li>
			                                		)
			                                	})
			                                }
			                                </ul></li>
			                                <li>组六</li>
			                            </ul>
                            		)
                            	})
                            }
                            <div className="r_sider_more">显示更多10期>></div>
                        </div>
                    </div>
                </QueueAnim>
            </Affix>
        );
    }
}
