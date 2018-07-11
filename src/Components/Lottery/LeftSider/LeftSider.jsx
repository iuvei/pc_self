import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Menu, Modal} from 'antd';
const SubMenu = Menu.SubMenu;
import emitter from '../../../Utils/events';
import {hashHistory} from 'react-router';

import './LeftSider.scss'
import {stateVar} from '../../../State';
import common from '../../../CommonJs/common';
import lotteryTypeList from '../../../CommonJs/common.json';
const lotteryList = lotteryTypeList.lotteryType.filter((item) => item.hotLottery == 1);

import left_1 from './Img/left_1.png';

@observer
export default class LeftSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countDown: 0
        }
    }

    componentDidMount() {
        // 监听当前彩种未开放时 自动切换另一彩种菜单打开
        this.eventEmitterA = emitter.on('resetLottery', () => {
            emitter.emit('initContentTop');
        });
    };
    componentWillUnmount() {
        emitter.off(this.eventEmitterA);
    };

    handleClick(ekey) {
        if (!stateVar.openLotteryFlag) {
            return;
        }
        let tempId = ekey;
        let tempMethod = common.getStore(common.getStore('userId'));
        let thisUrl = window.location.href.indexOf('lottery') > -1 ? true : false;
        if (thisUrl) {
            if (tempMethod == undefined || stateVar.nowlottery.lotteryId == tempId) {
                return;
            } else {
                let tempFlag = true;
                if (tempId == 'mmc' && tempMethod['mmc'] == undefined) {
                    tempFlag = false;
                } else {
                    if (tempMethod[tempId] == undefined) {
                        tempFlag = false;
                    } else {
                        for (let val in tempMethod) {
                            if (val == tempId) {
                                if (tempMethod[val].msg == undefined) {
                                    tempFlag = false;
                                } else {
                                    const modal = Modal.error({
                                        title: '温馨提示',
                                        content: tempMethod[val].msg,
                                    });
                                    setTimeout(() => modal.destroy(), 3000);
                                    return;
                                }
                                break;
                            }
                        }
                    }
                }
                if (!tempFlag) {
                    this._ismount = false;
                    stateVar.todayAndTomorrow = [];
                    stateVar.tomorrowIssue = [];
                    stateVar.issueIndex = '?????';
                    stateVar.BetContent.lt_same_code = [];
                    stateVar.BetContent.totalDan = 0;
                    stateVar.BetContent.totalNum = 0;
                    stateVar.BetContent.totalMoney = 0;
                    stateVar.BetContent.lt_trace_base = 0;
                    stateVar.kjNumberList = [];
                    stateVar.mmCkjNumberList = [];
                    clearInterval(window.interval);
                    stateVar.checkLotteryId = false;
                    stateVar.nowlottery.lotteryId = tempId;
                    stateVar.BetContent = {
                        lt_same_code: [], totalDan: 0, totalNum: 0, totalMoney: 0, lt_trace_base: 0
                    };
                    emitter.emit('initData');
                    stateVar.isload = false;
                }
            }
        } else {
            stateVar.navIndex = 'lottery';
            stateVar.kjNumberList = [];
            if (tempId == 'mmc' && tempMethod != undefined && tempMethod['mmc'] == undefined) {
                stateVar.nowlottery.lotteryId = tempId;
                hashHistory.push('/lottery');
            } else {
                if (tempMethod != undefined) {
                    if (tempMethod[tempId] == undefined) {
                        stateVar.nowlottery.lotteryId = tempId;
                        hashHistory.push('/lottery');
                    } else {
                        for (let val in tempMethod) {
                            if (val == tempId) {
                                if (tempMethod[val].msg == undefined) {
                                    stateVar.nowlottery.lotteryId = tempId;
                                    hashHistory.push('/lottery');
                                } else {
                                    const modal = Modal.error({
                                        title: '温馨提示',
                                        content: tempMethod[val].msg,
                                    });
                                    setTimeout(() => modal.destroy(), 3000);
                                    stateVar.nowlottery.lotteryId = 'ssc';
                                    hashHistory.push('/lottery');
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    stateVar.nowlottery.lotteryId = tempId;
                    hashHistory.push('/lottery');
                }
            }
        }
    };

    render() {
        // const {lotteryType} = stateVar;

        return (
            <div className="left_sider" key="LeftSider">
            	<div className="new_lottery">
	            	<div className="left_title">
	            		<img className="icon_title_img" src={left_1}/>
	            	</div>
	            	<ul>
	            		{
	            			lotteryList.map(item => {
	                                return (
	                                    <li onClick={()=>{this.handleClick(item.nav)}} key={item.nav} className={item.nav == stateVar.nowlottery.lotteryId ? 'lottery_selected' : ''}>
	                                        <div className="count_down_bg">
	                                            <img className="icon_img" src={require('./Img/' + item.nav + '.png')}/>
	                                            {item.cnname}
	                                            {
	                                                item.imgSrc ?
	                                                    <img className="icon_new_lottery" src={require('../../../Images/' + item.imgSrc + '.png')}/>
	                                                    :
	                                                    null
	                                            }
	                                        </div>
	                                    </li>
	                                )
	                            })
	            		}
	            	</ul>
            	</div>
            </div>
        );
    }
}

