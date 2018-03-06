import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Menu, Affix, Icon,Modal } from 'antd';
import emitter from '../../../Utils/events';
import QueueAnim from 'rc-queue-anim';
import { hashHistory } from 'react-router';
const SubMenu = Menu.SubMenu;

import './LeftSider.scss'
import { stateVar } from '../../../State'
import common from '../../../CommonJs/common';

import left_1 from './Img/left_1.png';
import ssc from './Img/ssc.png';
import xsc_24 from './Img/24xsc.png';
import ffc from './Img/ffc.png';
import fuciap3 from './Img/fucaip3.png';
import GD11_5 from './Img/GD11-5.png';
import mmc from './Img/mmc.png';
import pk10 from './Img/pk10.png';
import SD11Y from './Img/SD11Y.png';
import TG11_5 from './Img/TG11-5.png';
import ticaip3 from './Img/ticaip3.png';
import TJSSC from './Img/TJSSC.png';
import txffc from './Img/txffc.png';
import new_lottery from './Img/new_lottery.png';

@observer
export default class LeftSider extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        this.eventEmitter = emitter.on('changeLottery', (e) => {
            this.handleClick(e);
        });
    };
    componentWillUnmount() {
        emitter.off(this.eventEmitter);
    };
    handleClick(e) {
    	if(!stateVar.openLotteryFlag){
    		return;
    	}
    	let tempId = e.key;
    	let tempMethod = common.getStore(common.getStore('userId'));
    	let thisUrl = window.location.href.indexOf('lottery') > -1 ? true : false;
    	if(thisUrl){
    		if(tempMethod == undefined || stateVar.nowlottery.lotteryId == tempId){
	    		return;
	    	}else{
	    		for(let val in tempMethod){
					if(val == tempId){
						if(tempMethod[val].msg == undefined){
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
							clearInterval(window.interval);
							stateVar.checkLotteryId= false;
							stateVar.nowlottery.lotteryId = e.key;
							stateVar.BetContent = {
						        lt_same_code:[],totalDan:0,totalNum:0,totalMoney:0,lt_trace_base:0
						    };
						    emitter.emit('initData');
							stateVar.isload = false;
						}else{
							const modal = Modal.error({
							    title: '温馨提示',
							    content: tempMethod[val].msg,
							});
							setTimeout(() => modal.destroy(), 3000);
							return;
						}
					}
				}
	    	}
    	}else{
    		stateVar.navIndex = 'lottery';
    		stateVar.kjNumberList = [];
    		for(let val in tempMethod){
				if(val == tempId){
					if(tempMethod[val].msg == undefined){
						stateVar.nowlottery.lotteryId = e.key;
						hashHistory.push('/lottery');
					}else{
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
    };
	openKey(){
		let tempOpen = stateVar.nowlottery.lotteryId;
		if(tempOpen == 'mmc' || tempOpen == 'ffc'){
			return ['sub1','24小时'];
		}
		if(tempOpen == 'ssc'){
			return ['sub1','时时彩'];
		}
		if(tempOpen == 'mmc' || tempOpen == '24xsc' || tempOpen == 'ffc' || tempOpen == 'TG11-5' || tempOpen == 'txffc'){
			return ['24小时'];
		}
		if(tempOpen == 'ssc' || tempOpen == 'XJSSC' || tempOpen == 'TJSSC' || tempOpen == 'pk10' || tempOpen == 'HN481'){
			return ['时时彩'];
		}
		if(tempOpen == 'SD11Y' || tempOpen == 'GD11-5' || tempOpen == 'JX11-5' || tempOpen == 'CQ11-5' || tempOpen == 'SH11-5'){
			return ['11选5'];
		}
		if(tempOpen == 'fucaip3' || tempOpen == 'ticaip3'){
			return ['低频'];
		}
		if(tempOpen == 'BJKL8' || tempOpen == 'JSK3' || tempOpen == 'hnffc'){
			return ['高频'];
		}
	};
    render() {
        const { lotteryType } = stateVar;
        return (
                    <div className="left_sider" key="LeftSider">
                        <Menu
                            onClick={(e)=>this.handleClick(e)}
                            style={{ width: 120 }}
                            defaultOpenKeys={this.openKey()}
                            selectedKeys={[stateVar.nowlottery.lotteryId]}
                            mode="inline"
                        >
                            <SubMenu key="sub1" title={<span><img className="icon_img" src={left_1}/><span>常玩彩种</span></span>}>
                                <Menu.Item key="ssc" className="spe_lottery">
                                    <img className="icon_img" src={ssc}/>
                                    重庆时时彩
                                </Menu.Item>
                                <Menu.Item key="mmc">
                                    <img className="icon_img" src={mmc}/>
                                    泰国秒秒彩
                                </Menu.Item>
                                <Menu.Item key="ffc" className="new_lottery">
                                    <img className="icon_img" src={ffc}/>
                                    泰国60秒
                                    <img className="icon_new_lottery" src={new_lottery} alt=""/>
                                </Menu.Item>
                            </SubMenu>
                            {
                                lotteryType.map((items, i)=>{
                                    return (
                                        <SubMenu key={items.typeName}
                                                 title={
                                                     <span>
                                                         <img className="icon_img" src={require('./Img/left_'+ (i+2) +'.png')}/>
                                                         <span>{items.typeName}</span>
                                                     </span>
                                                 }
                                        >
                                            {
                                                items.lotteryList.map((item)=>{
                                                    return (
                                                        <Menu.Item key={item.nav}
                                                                   className="new_lottery"
                                                                   disabled={item.disabled}
                                                        >
                                                            <img className="icon_img" src={require('./Img/'+ item.nav +'.png')}/>
                                                            {item.cnname}
                                                            {
                                                                item.imgSrc == 'nav_n' ?
                                                                    <img className="icon_new_lottery" src={new_lottery}/> :
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

