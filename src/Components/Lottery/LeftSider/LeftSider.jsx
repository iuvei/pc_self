import React, {Component} from 'react';
import {observer} from 'mobx-react';
import TweenOne from 'rc-tween-one';
import {Menu, Modal, Progress} from 'antd';
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
            openKeys: [],
            countDown: 0
        }
    }

    componentDidMount() {
        this.eventEmitter = emitter.on('changeLottery', (e) => {
            this.handleClick(e);
        });
        // 监听当前彩种未开放时 自动切换另一彩种菜单打开
        this.eventEmitter1 = emitter.on('resetLottery', () => {
            emitter.emit('initContentTop');
            this.handTitleClick('', this.openKey());
        });
        this.handTitleClick('', this.openKey());
        // this.clearIntCount = setInterval(()=>{
        //     if(this.state.countDown >= 100){
        //         this.setState({countDown: 0})
        //     }else{
        //         this.setState({countDown: ++this.state.countDown})
        //     }
        // }, 1000)
    };

    componentWillUnmount() {
        // if(this.clearIntCount){
        //     window.clearInterval(this.clearIntCount)
        // }
        emitter.off(this.eventEmitter);
        emitter.off(this.eventEmitter1);
    };

    handleClick(e) {
        if (!stateVar.openLotteryFlag) {
            return;
        }
        let tempId = e.key;
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

    handTitleClick(e, defaultKey) {
        let {openKeys} = this.state;
        if (defaultKey) {
            this.setState({
                openKeys: defaultKey
            })
        } else {
            if (openKeys.indexOf(e.key) > -1) {
                openKeys.splice(openKeys.indexOf(e.key), 1)
            } else {
                this.setState({
                    openKeys: [...openKeys, e.key]
                })
            }
        }

    };

    openKey() {
        let tempOpen = stateVar.nowlottery.lotteryId;
        if (tempOpen == 'mmc' || tempOpen == 'ffc') {
            return ['sub1', '24小时'];
        }
        if (tempOpen == 'ssc') {
            return ['sub1', '时时彩'];
        }
        if (tempOpen == 'mmc' || tempOpen == '24xsc' || tempOpen == 'ffc' || tempOpen == 'TG11-5' || tempOpen == 'txffc') {
            return ['24小时'];
        }
        if (tempOpen == 'ssc' || tempOpen == 'XJSSC' || tempOpen == 'TJSSC' || tempOpen == 'pk10' || tempOpen == 'HN481') {
            return ['时时彩'];
        }
        if (tempOpen == 'SD11Y' || tempOpen == 'GD11-5' || tempOpen == 'JX11-5' || tempOpen == 'CQ11-5' || tempOpen == 'SH11-5') {
            return ['11选5'];
        }
        if (tempOpen == 'fucaip3' || tempOpen == 'ticaip3') {
            return ['低频'];
        }
        if (tempOpen == 'BJKL8' || tempOpen == 'JSK3' || tempOpen == 'hnffc') {
            return ['高频'];
        }
    };

    render() {
        const {lotteryType} = stateVar;

        return (
            <div className="left_sider" key="LeftSider">
                <Menu
                    onClick={(e) => this.handleClick(e)}
                    style={{width: 120}}
                    defaultOpenKeys={this.openKey()}
                    openKeys={this.state.openKeys}
                    selectedKeys={[stateVar.nowlottery.lotteryId]}
                    className="new_lottery"
                    mode="inline"
                >
                    <SubMenu onTitleClick={(e) => {
                        this.handTitleClick(e)
                    }} key="sub1"
                             title={<span><img className="icon_img" src={left_1}/><span>热门彩种</span></span>}>
                        {
                            lotteryList.map(item => {
                                return (
                                    <Menu.Item key={item.nav} className="spe_lottery">
                                        <div className="count_down_bg" style={{width: this.state.countDown + '%'}}>
                                            <img className="icon_img" src={require('./Img/' + item.nav + '.png')}/>
                                            {item.cnname}
                                            {
                                                item.imgSrc ?
                                                    <img className="icon_new_lottery" src={require('../../../Images/' + item.imgSrc + '.png')}/>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </Menu.Item>
                                )
                            })
                        }
                    </SubMenu>
                    {
                        lotteryType.map((items, i) => {
                            return (
                                <SubMenu key={items.typeName} onTitleClick={(e) => {
                                    this.handTitleClick(e)
                                }}
                                         title={
                                             <span>
                                                 <img className="icon_img"
                                                      src={require('./Img/left_' + (i + 2) + '.png')}/>
                                                 <span>{items.typeName}</span>
                                             </span>
                                         }
                                >
                                    {
                                        items.lotteryList.map((item) => {
                                            return (
                                                <Menu.Item key={item.nav}
                                                           className="new_lottery"
                                                           disabled={item.disabled}
                                                >
                                                    <img className="icon_img"
                                                         src={require('./Img/' + item.nav + '.png')}/>
                                                    {item.cnname}
                                                    {
                                                        item.imgSrc ?
                                                            <img className="icon_new_lottery" src={require('../../../Images/' + item.imgSrc + '.png')}/>:
                                                            null
                                                    }
                                                </Menu.Item>
                                            )
                                        })
                                    }
                                </SubMenu>
                            )
                        })
                    }
                </Menu>
            </div>
        );
    }
}

