import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Menu, Affix } from 'antd';
import QueueAnim from 'rc-queue-anim';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import './LeftSider.scss'
import { stateVar } from '../../../State'

import Transform from '../../../CommonJs/transform.react.js';

import left_1 from './Img/left_1.png'
import left_2_active from './Img/left_2_active.png'
import left_3 from './Img/left_3.png'
import left_4 from './Img/left_4.png'
import left_5 from './Img/left_5.png'
import triangle_right from './Img/triangle_right.png'

@observer
export default class LeftSider extends Component {
    handleClick(e) {
    	stateVar.nowlottery.lotteryId = e.key
    }
    render() {
        return (
            <Affix offsetTop={120}>
                <QueueAnim duration={1000}
                           animConfig={[
                               { opacity: [1, 0], translateX: [0, -100] }
                           ]}>
                    <div className="left_sider" key="LeftSider">
                        <Menu onClick={(e)=>{this.handleClick(e)}}
                              mode="vertical"
                              theme="dark"
                        >
                            <SubMenu key="sub1"  title={<span className="l_s_bg_01"></span>}>
                                <MenuItemGroup title="24小时">
                                    <Menu.Item key="mmc">泰国秒秒彩</Menu.Item>
                                    <Menu.Item key="24xsc">泰国300秒</Menu.Item>
                                    <Menu.Item key="ffc">泰国60秒</Menu.Item>
                                    <Menu.Item key="TG11-5">泰国11选5</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span className="l_s_bg_02"></span>}>
                                <MenuItemGroup title="时时彩系列">
                                    <Menu.Item key="ssc">重庆时时彩</Menu.Item>
                                    <Menu.Item key="XJSSC">新疆时时彩</Menu.Item>
                                    <Menu.Item key="TJSSC">天津时时彩</Menu.Item>
                                    <Menu.Item key="txffc">腾讯分分彩</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu key="sub3" title={<span className="l_s_bg_03"></span>}>
                                <MenuItemGroup title="11选5系列">
                                    <Menu.Item key="JX11-5">江西11选5</Menu.Item>
                                    <Menu.Item key="SD11Y">山东11选5</Menu.Item>
                                    <Menu.Item key="GD11-5">广东11选5</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu key="sub5" title={<span className="l_s_bg_05"></span>}>
                                <MenuItemGroup title="其他系列">
                                    <Menu.Item key="ticaip3">排列三</Menu.Item>
                                    <Menu.Item key="fucaip3">福彩3D</Menu.Item>
                                    <Menu.Item key="pk10">北京PK10</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                        </Menu>
                    </div>
                </QueueAnim>
            </Affix>
        );
    }
}

