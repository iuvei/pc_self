import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { Link, hashHistory } from 'react-router';
import Fetch from '../../../Utils';
import { stateVar } from '../../../State';
import { Menu, Modal } from 'antd';
import HeaderTop from './HeaderTop'
import './headerNav.scss';

import logoSrc from '../../../Images/logo.png'

@observer
export default class HeaderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    componentDidMount() {
        this._ismount = true;
        stateVar.navIndex = 'lottery';
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this))
    };
    componentWillUnmount() {
        this._ismount = false;
        window.removeEventListener('resize', this.onWindowResize.bind(this))
    };
    handleClick = (e) => {
        stateVar.navIndex = e.key;
    };
    //窗口改变大小后，使导航栏时刻和窗口宽度保持一致
    onWindowResize(){
        this.lotteryNameType.style.width = document.body.clientWidth+'px'; // 给彩票游戏下拉框获取body宽度
        this.lotteryNameType.style.left=-this.refs.menusWrap.offsetLeft-96+'px'; //获取整个menus与浏览器左部的距离-彩票游戏与首页的相对距离并给子菜单left绝对距离
        this.lotteryNameType.style.paddingLeft=this.refs.menusWrap.offsetLeft-271+'px';//获取整个menus与浏览器左部的距离-标题中文字与首页的相对距离给使子菜单与标题文字对齐
    }
    /*点击游戏记录*/
    onGameRecord() {
        stateVar.afterDetails = false;
        hashHistory.push('/gameRecord');
    };
    /*是否有权限进入Ea*/
    onEa() {
        Fetch.eagame({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push('/ea');
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入pt*/
    onPt() {
        Fetch.ptindex({
            method: 'POST',
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push('/pt');
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入体育竞技*/
    onSport(){
        Fetch.sport({
            method: 'POST',
            body: JSON.stringify({"do":"login"})
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push('/sport');
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入GT娱乐*/
    onGt(){
        Fetch.gtLogin({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push('/gt');
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    /*是否有权限进入博饼*/
    onBobing() {
        Fetch.newGetprizepool({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    hashHistory.push('/bobing');
                }else{
                    Modal.warning({
                        title: res.data,
                    });
                }
            }
        })
    };
    render() {
        const SubMenu = Menu.SubMenu;

        return (
            <div className="header_main">
                <HeaderTop/>
                <nav className="nav">
                    <div className="nav-content">
                        <img className="logo" src={logoSrc} alt="logo"/>
                        <div className="menus" ref="menusWrap">
                            <Menu
                                onClick={this.handleClick}
                                selectedKeys={[stateVar.navIndex]}
                                mode="horizontal"
                            >
                                <Menu.Item key="home">
                                    <div className="nav-text">
                                        <Link to={`/home`}>
                                            <p>首页</p>
                                            <p>Home</p>
                                        </Link>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="lottery" className="lottery_name" >
                                    <div className="nav-text" >
                                        <Link to={`/lottery`}>
                                            <p>彩票游戏</p>
                                            <p>Lottery</p>
                                        </Link>
                                    </div>
                                    <div className="lottery_name_type" /*ref="lotteryNameType"*/ ref={(ref) => this.lotteryNameType = ref}>
                                        <div className="l_n_t_p clear">
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li className='l_list_h'>44556</li>
                                                <li>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li className='l_list_n'>44556</li>
                                                <li>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li className='l_list_opa'>44556</li>
                                                <li>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li className='l_list_opa'>44556</li>
                                                <li >44556</li>
                                                <li>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li>44556</li>
                                                <li >44556</li>
                                                <li className='l_list_opa'>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li>44556</li>
                                                <li className='l_list_h'>44556</li>
                                                <li className='l_list_h'>44556</li>
                                                <li className='l_list_h'>44556</li>
                                            </ul>
                                            <ul className="l_n_list">
                                                <li></li>
                                                <li>44556</li>
                                                <li className='l_list_opa'>44556</li>
                                                <li >44556</li>
                                                <li>44556</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Menu.Item>
                                <SubMenu
                                    title={
                                    <div className="nav-text">
                                        <a href="javascript:void(0)">
                                            <p>综合游戏</p>
                                            <p>Other Games</p>
                                        </a>
                                    </div>
                                }>
                                    <Menu.Item key="solution:1">
                                        <a href="javascript:void(0)" onClick={()=>this.onPt()}>PT游戏</a>
                                    </Menu.Item>
                                    <Menu.Item key="solution:2">
                                        <a href="javascript:void(0)" onClick={()=>this.onSport()}>体育竞技</a>
                                    </Menu.Item>
                                    <Menu.Item key="solution:3">
                                        <a href="javascript:void(0)" onClick={()=>this.onEa()}>EA娱乐城</a>
                                    </Menu.Item>
                                    <Menu.Item key="solution:4">
                                        <a href="javascript:void(0)" onClick={()=>this.onGt()}>GT娱乐</a>
                                    </Menu.Item>
                                    <Menu.Item key="solution:5">
                                        <a href="javascript:void(0)" onClick={()=>this.onBobing()}>博饼</a>
                                    </Menu.Item>
                                </SubMenu>
                                <Menu.Item key="activity">
                                    <div className="nav-text">
                                        <Link to={`/activity`}>
                                            <p>优惠活动</p>
                                            <p>Activity</p>
                                        </Link>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="gameRecord">
                                    <div className="nav-text">
                                        <a href="javascript:void(0)" onClick={()=>this.onGameRecord()}>
                                            <p>游戏记录</p>
                                            <p>Game Records</p>
                                        </a>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="financial">
                                    <div className="nav-text">
                                        <Link to={
                                            {
                                                pathname: '/financial/recharge',
                                                query: {navIndex: 0}
                                            }
                                        }>
                                            <p>财务中心</p>
                                            <p>Financial</p>
                                        </Link>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="report">
                                    <div className="nav-text">
                                        <Link to={`/report`}>
                                            <p>报表管理</p>
                                            <p>Report</p>
                                        </Link>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="account">
                                    <div className="nav-text">
                                        <Link to={`/account`}>
                                            <p>账户管理</p>
                                            <p>Account</p>
                                        </Link>
                                    </div>
                                </Menu.Item>
                            </Menu>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

