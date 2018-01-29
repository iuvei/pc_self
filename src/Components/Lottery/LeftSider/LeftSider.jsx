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

import Transform from '../../../CommonJs/transform.react.js';

import left_1 from './Img/left_1.png'
import left_2_active from './Img/left_2_active.png'
import left_3 from './Img/left_3.png'
import left_4 from './Img/left_4.png'
import left_5 from './Img/left_5.png'

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

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        return (
            <Affix offsetTop={120}>
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0], translateX: [0, -100] }
                           ]}>
                    <div className="left_sider" key="LeftSider">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 120 }}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.current]}
                            mode="inline"
                        >
                            <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>常玩彩种</span></span>}>
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>N Two</span></span>}>
                                <Menu.Item key="5">Option 5</Menu.Item>
                                <Menu.Item key="6">Option 6</Menu.Item>
                                <SubMenu key="sub3" title="Submenu">
                                    <Menu.Item key="7">Option 7</Menu.Item>
                                    <Menu.Item key="8">Option 8</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                            <SubMenu key="sub4" title={<span><Icon type="setting" /><span>NThree</span></span>}>
                                <Menu.Item key="9">Option 9</Menu.Item>
                                <Menu.Item key="10">Option 10</Menu.Item>
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                </QueueAnim>
            </Affix>
        );
    }
}

