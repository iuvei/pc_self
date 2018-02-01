import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Menu, Affix, Icon } from 'antd';
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
        this.state={
            openKeys: ['sub1'],
            current: 'ssc',
        }
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
                            this.setState({current: tempId});
						}else{
							alert(tempMethod[val].msg);
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
                        this.setState({current: tempId});
					}else{
						alert(tempMethod[val].msg);
						stateVar.nowlottery.lotteryId = 'ssc';
                        this.setState({current: 'ssc'});
						hashHistory.push('/lottery');
						return;
					}
				}
			}
    	}
    };

    render() {
        const { lotteryType } = stateVar;
        return (
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0], translateX: [0, -100] }
                           ]}>
                    <div className="left_sider" key="LeftSider">
                        <Menu
                            onClick={(e)=>this.handleClick(e)}
                            style={{ width: 120 }}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.current]}
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
                </QueueAnim>
        );
    }
}

