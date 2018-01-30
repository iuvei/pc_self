import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Menu, Affix, Icon } from 'antd';
import emitter from '../../../Utils/events';
import QueueAnim from 'rc-queue-anim';
import { hashHistory } from 'react-router';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import './LeftSider.scss'
import { stateVar } from '../../../State'
import common from '../../../CommonJs/common';

import left_1 from './Img/left_1.png'
import left_2 from './Img/left_2.png'
import left_3 from './Img/left_3.png'
import left_4 from './Img/left_4.png'
import left_5 from './Img/left_5.png'
import left_6 from './Img/left_6.png'
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

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
@observer
export default class LeftSider extends Component {
    constructor(props) {
        super(props);
        this.state={
            openKeys: ['sub1'],
        }
    }
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
					}else{
						alert(tempMethod[val].msg);
						stateVar.nowlottery.lotteryId = 'ssc'
						hashHistory.push('/lottery');
						return;
					}
				}
			}
    	}
    };

    render() {
        return (
            <Affix offsetTop={120}>
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
                                <Menu.Item key="ssc" className="spe_lottery"><img className="icon_img" src={ssc}/>重庆时时彩</Menu.Item>
                                <Menu.Item key="mmc"><img className="icon_img" src={ssc}/>泰国秒秒彩</Menu.Item>
                                <Menu.Item key="ffc" className="new_lottery">
                                    <img className="icon_img" src={ssc}/>泰国60秒
                                    <img className="icon_new_lottery" src={new_lottery} alt=""/>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><img className="icon_img" src={left_2}/><span>24小时彩</span></span>}>
                                <Menu.Item key="mmc"><img className="icon_img" src={ssc}/>泰国秒秒彩</Menu.Item>
                                <Menu.Item key="24xsc"><img className="icon_img" src={ssc}/>泰国300秒</Menu.Item>
                                <Menu.Item key="ffc"><img className="icon_img" src={ssc}/>泰国60秒</Menu.Item>
                                <Menu.Item key="TG11-5"><img className="icon_img" src={ssc}/>泰国11选5</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" title={<span><img className="icon_img" src={left_3}/><span>时时彩</span></span>}>
                                <Menu.Item key="ssc"><img className="icon_img" src={ssc}/>重庆时时彩</Menu.Item>
                                <Menu.Item key="XJSSC"><img className="icon_img" src={ssc}/>新疆时时彩</Menu.Item>
                                <Menu.Item key="TJSSC"><img className="icon_img" src={ssc}/>天津时时彩</Menu.Item>
                                <Menu.Item key="txffc"><img className="icon_img" src={ssc}/>腾讯分分彩</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" title={<span><img className="icon_img" src={left_4}/><span>11选5</span></span>}>
                                <Menu.Item key="JX11-5"><img className="icon_img" src={ssc}/>江西11选5</Menu.Item>
                                <Menu.Item key="SD11Y"><img className="icon_img" src={ssc}/>山东11选5</Menu.Item>
                                <Menu.Item key="GD11-5"><img className="icon_img" src={ssc}/>广东11选5</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub5" title={<span><img className="icon_img" src={left_5}/><span>低频</span></span>}>
                                <Menu.Item key="ticaip3"><img className="icon_img" src={ssc}/>排列三</Menu.Item>
                                <Menu.Item key="fucaip3"><img className="icon_img" src={ssc}/>福彩3D</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub6" title={<span><img className="icon_img" src={left_6}/><span>高频</span></span>}>
                                <Menu.Item key="pk10"><img className="icon_img" src={ssc}/>北京PK10</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="1">
                                <Icon type="double-left" />
                                隐藏彩种
                            </Menu.Item>
                        </Menu>
                    </div>
                </QueueAnim>
            </Affix>
        );
    }
}

