import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Websocket from 'react-websocket';
import Fetch from '../../../Utils';
import { Icon, Badge, Modal, Button } from 'antd';
const confirm = Modal.confirm;
import { stateVar } from '../../../State';
import emitter from '../../../Utils/events';
import './headerTop.scss'
import common from '../../../CommonJs/common';
import { removeStore,delCookie } from '../../../CommonJs/common';
import Notice from '../Notice/Notice';

import logoSrc from '../../../Images/logo.png';
import name_icon from './Img/name_icon.png';
import email_icon from './Img/email_icon.png';
import off_icon from './Img/off_icon.png';
import on_icon from './Img/on_icon.png';
import service_icon from './Img/service_icon.png';
import notice_icon from './Img/notice_icon.png';

@observer
export default class HeaderTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideBalance : true,
            visible: false,
            noticeList: [], // 公告列表
            noticeDetails: {}, // 点击查看公告
            noticePosition: 0, // 列表位置
            updateMLoading: false, //刷新余额
            iconArrowsName: false,
            iconArrowsMoney: false,
        };
        this.onNoticeDetails = this.onNoticeDetails.bind(this);
        this.onNoticeList = this.onNoticeList.bind(this);
        this.hideModal = this.hideModal.bind(this);
    };
    componentDidMount(){
        this._ismount = true;

        // 组件装载完成以后声明一个自定义事件
        this.eventEmitter = emitter.on('changeMoney', () => {
            this.getMenu();
            this.getBalance();
        });
        this.getMenu();
        this.getBalance();
        this.getNotice();
        this.onUnread();
        this.getress();
        this.getAccGroup();
    };
    componentWillUnmount() {
        this._ismount = false;
        // 清除定时器与暂停动画
        clearInterval(this._clearInt);
        cancelAnimationFrame(this._animationFrame);
        emitter.off(this.eventEmitter);
    };
    getDestination() {
        let destination = 40,
            noticeListFlag = JSON.parse(JSON.stringify(this.state.noticeList));
        this._clearInt = setInterval(() => {
            if (destination / 40 < noticeListFlag.length) {
                this.move(destination, 500);
                destination += 40;
            } else { // 列表到底
                this.setState({noticePosition: 0});// 设置列表为开始位置
                destination = 40;
                this.move(destination, 500);
                destination += 40;
            }
        }, 6000)

    };
    move (destination, duration) { // 实现滚动动画
        let speed = (((destination - this.state.noticePosition) * 1000) / (duration * 60));
        let count = 0;
        let step = () => {
            this.setState({noticePosition: this.state.noticePosition + speed});
            count++;
            this._animationFrame = requestAnimationFrame(() => {
                if (this.state.noticePosition < destination) {
                    step()
                } else {
                    this.setState({noticePosition: destination});
                }
            })
        };
        step()
    };
    getress(){
        let userInfo = stateVar.userInfo;
        Fetch.ipaddress({
            method: 'POST',
            body: JSON.stringify({ip: userInfo.lastIp, userid: userInfo.userId})
        }).then((res)=>{
            if(this._ismount && res.status == 200){
                userInfo.address = res.repsoneContent;
            }
        })
    };
    /*获取公告*/
    getNotice() {
        Fetch.noticeList({
            method: 'POST',
            pagesize: 40,
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {
                    this.setState({
                        noticeList: res.repsoneContent.results,
                    },()=>this.getDestination());
                }
            }
        })
    };
    /*获取本平台余额*/
    getMenu() {
        Fetch.menu({
            method: 'POST',
            body: JSON.stringify({"flag":"getmoney"})
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                if(res.repsoneContent < 0){
                    res.repsoneContent = 0.00
                }
                stateVar.allBalance.cpbalance = res.repsoneContent;
            }
        })
    };
    /*获取各平台余额*/
    getBalance(){
        let allBalance = stateVar.allBalance;
        //ea余额
        Fetch.balance({
            method: 'POST',
            body: JSON.stringify({type: 'ea'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({updateMLoading: false});
                if(res.status == 200){
                    if(res.repsoneContent <= 0){
                        res.repsoneContent = 0.00
                    }
                    allBalance.eabalance = res.repsoneContent;
                }
            }
        });
        //pt余额
        Fetch.balance({
            method: 'POST',
            body: JSON.stringify({type: 'pt'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({updateMLoading: false});
                if(res.status == 200){
                    if(res.repsoneContent <= 0){
                        res.repsoneContent = 0.00
                    }
                    allBalance.ptbalance = res.repsoneContent;
                }
            }
        });
        //gt余额
        Fetch.balance({
            method: 'POST',
            body: JSON.stringify({type: 'gt'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({updateMLoading: false});
                if(res.status == 200){
                    if(res.repsoneContent <= 0){
                        res.repsoneContent = 0.00
                    }
                    allBalance.kgbalance = res.repsoneContent;
                }
            }
        });
        //体育余额
        Fetch.balance({
            method: 'POST',
            body: JSON.stringify({type: 'sb'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({updateMLoading: false});
                if(res.status == 200){
                    if(res.repsoneContent <= 0){
                        res.repsoneContent = 0.00
                    }
                    allBalance.sbbalance = res.repsoneContent;
                }
            }
        });
        //博饼余额
        Fetch.balance({
            method: 'POST',
            body: JSON.stringify({type: 'bb'})
        }).then((res)=>{
            if(this._ismount){
                this.setState({updateMLoading: false});
                if(res.status == 200){
                    if(res.repsoneContent <= 0){
                        res.repsoneContent = 0.00
                    }
                    allBalance.bobingBalance = res.repsoneContent;
                }
            }
        });
    };
    /*退出登录*/
    onLogout() {
        let _this = this;
        confirm({
            title: '确定要退出吗?',
            onOk() {
                Fetch.logout({
                    method: 'POST',
                    body: JSON.stringify({sType: stateVar.userInfo.sType})
                }).then((res)=>{
                    if(_this._ismount){
                        if(res.status == 200){
                            delCookie('sess');
                            removeStore('session');
                            setTimeout(()=>{
                            	hashHistory.push('/login');
                            },500);
                        }else{
                            Modal.warning({
                                title: res.shortMessage,
                            });
                        }
                    }
                })
            }
        });

    }
    /*显示公告模态框*/
    showModal(item) {
        this.setState({
            noticeDetails: item,
            visible: true,
        });
    }
    /*隐藏公告模态框*/
    hideModal() {
        this.setState({
            visible: false,
        });
    };
    onNoticeDetails(item) {
        this.setState({noticeDetails: item});
    };
    onNoticeList(item) {
      let noticeList = this.state.noticeList;
      for(let i = 0; i < noticeList.length;i++) {
          if(noticeList[i].id === item.id){
              noticeList[i].unread_id = 0;
              this.setState({noticeList: noticeList});
              break;
          }
      }
    };
    /*站内信未读条数*/
    onUnread() {
        Fetch.messages({
            method: 'POST',
            body: JSON.stringify({tag: 'unreadcount'})
        }).then((res)=>{
            if(this._ismount && res.status == 200) {
                stateVar.unread = res.repsoneContent;
            }
        })
    };

    /*跳站内信, 充值，提款，转账*/
    onHashHistory(router, nav, childNav) {
        if(stateVar.userInfo.sType == 'demo'){
            Modal.warning({
                title: '试玩用户，没有访问权限',
            });
            return
        }

        hashHistory.push({
            pathname: router,
            query: {navIndex: childNav}
        });
        stateVar.navIndex = nav;
    };
    /*刷新余额*/
    onUpdateMondy(){
        this.setState({updateMLoading: true});
        this.getMenu();
        this.getBalance();
    };
    //获取奖金组
    getAccGroup() {
        //登录
        Fetch.login({
            method: "POST",
            body: JSON.stringify({
                "sType": 'message',
            })
        }).then((data)=>{
            if(this._ismount){
                let result = data.repsoneContent;
                if(data.status==200){
                    stateVar.auth=true;
                    stateVar.userInfo.accGroup = result.accGroup;
                    common.setStore("accGroup",result.accGroup);
                }
            }
        })
    };
    handleData(data){
    	let message = eval('('+ data +')');
    	if(message.status == 1){
    		let tempType = message.data.type;
    		if(tempType == 5){
    			this.getMenu();
    		}else if(tempType == 6){
    			this.getNotice();
    		}else if(tempType == 8){
    			this.getAccGroup();
    		}else if(tempType == 10){
    			this.onUnread();
    		}
    	}
    }
    openWebsocket(){
    	var msg = {"method":"join","uid":common.getStore('userId'),"hobby":1};
    	this.refWebSocket.state.ws.send(JSON.stringify(msg))
    }
    render() {
        const { allBalance, userInfo } = stateVar;
        const { iconArrowsName, iconArrowsMoney } = this.state;
        return (
            <div className="nav_top">
           		<Websocket url={'ws://'+common.getStore("pushDomain")+''} onMessage={this.handleData.bind(this)} onOpen={this.openWebsocket.bind(this)}
        			ref = {Websocket => {
                  	this.refWebSocket = Websocket;
                }}
        		/>
                <div className="nav_top_content clear">
                    <img className="logo" src={logoSrc} alt="logo"/>
                    <div className="right">
                        <div className="n_t_lt">
                            <div className="show-notice">
                                <ul className="notice-list left" style={{transform: 'translateY(-'+this.state.noticePosition+'px) translateZ(0px)'}}>
                                    {
                                        this.state.noticeList.map((item)=>{
                                            return (
                                                <li key={item.id}
                                                    onClick={()=>this.showModal(item)}>
                                                    <img src={notice_icon}/>
                                                    {item.subject}&nbsp;&nbsp;[点击查看]
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <Notice
                                visible={this.state.visible}
                                noticeList={this.state.noticeList}
                                noticeDetails={this.state.noticeDetails}
                                onNoticeDetails={this.onNoticeDetails}
                                onNoticeList={this.onNoticeList}
                                hideModal={this.hideModal}
                            />
                        </div>
                        <ul className="n_t_list">
                            <li className={iconArrowsName ? 'n_t_cursor n_t_position icon_arrows_bg' : 'n_t_cursor n_t_position'}
                                onMouseOver={()=>this.setState({iconArrowsName: true})}
                                onMouseOut={()=>this.setState({iconArrowsName: false})}
                            >
                                <img src={name_icon} style={{verticalAlign: 'middle',marginRight: 5}}/>
                                { userInfo.sType == 'demo' ? '试玩用户' : userInfo.userName }
                                <Icon type="caret-down" style={{marginLeft: '5px'}}/>
                                <div className="n_t_controler">
                                    <ul className="n_t_down_list">
                                        <li>
                                            <span className="left">用户类型</span>
                                            <span className="right color_CF2027">{userInfo.userType == 0 ? '会员' : '代理'}</span>
                                        </li>
                                        <li>
                                            <span className="left">奖金组</span>
                                            <span className="right color_CF2027">{userInfo.accGroup}</span>
                                        </li>
                                        <li>
                                            <span className="left">上次登录地点</span>
                                            <span className="right color_CF2027">{userInfo.lastIp} {userInfo.address}</span>
                                        </li>
                                        <li>
                                            <span className="left">上次登录时间</span>
                                            <span className="right">{userInfo.lastTime}</span>
                                        </li>
                                        <li className="out_logo_btn">
                                            <Button type="primary" icon="logout" onClick={()=>this.onLogout()}>
                                                退出登录
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="n_t_message n_t_cursor">
                            <span onClick={()=>this.onHashHistory('/selfInfo/message', 'selfInfo', 3)}>
                                <Badge count={stateVar.unread} overflowCount={99} showZero>
                                    <img src={email_icon} alt="站内信"/>
                                </Badge>
                            </span>
                            </li>
                            <li className={iconArrowsMoney ? 'n_t_cursor n_t_balance_p icon_arrows_bg' : 'n_t_cursor n_t_balance_p'}
                                onMouseOver={()=>this.setState({iconArrowsMoney: true})}
                                onMouseOut={()=>this.setState({iconArrowsMoney: false})}
                            >
                                <span className="color_CF2027">余额：</span>
                                <span className="color_CF2027">
                                    <i>￥</i>
                                    <i className="cpbalance ellipsis">{this.state.hideBalance ? allBalance.cpbalance : '******'}</i>
                                    <img src={this.state.hideBalance ? on_icon : off_icon} onClick={()=>{this.setState({hideBalance: this.state.hideBalance ? false : true})}} className="n_t_hide_balance"/>
                                </span>
                                <div className="n_t_controler">
                                    <ul className="n_t_down_list">
                                        <li>
                                            <span className="left">彩票余额：</span>
                                            <span className="right">￥
                                                {allBalance.cpbalance}
                                        </span>
                                        </li>
                                        <li>
                                            <span className="left">EA余额：</span>
                                            <span className="right">￥
                                            {allBalance.eabalance}
                                        </span>
                                        </li>
                                        <li>
                                            <span className="left">PT余额：</span>
                                            <span className="right">￥
                                            {allBalance.ptbalance}
                                        </span>
                                        </li>
                                        <li>
                                            <span className="left">GT余额：</span>
                                            <span className="right">￥
                                            {allBalance.kgbalance}
                                        </span>
                                        </li>
                                        <li>
                                            <span className="left">博饼余额：</span>
                                            <span className="right">￥
                                            {allBalance.bobingBalance}
                                        </span>
                                        </li>
                                        <li>
                                            <span className="left">体育余额：</span>
                                            <span className="right">￥
                                            {allBalance.sbbalance}
                                        </span>
                                        </li>
                                        <li style={{textAlign: 'center'}}>
                                            <Button type="primary" icon="sync" loading={this.state.updateMLoading} onClick={()=>this.onUpdateMondy()}>
                                                刷新余额
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="n_t_cursor_color color_CF2027">
                            <span onClick={()=>this.onHashHistory('/financial/recharge', 'financial', 0)}>
                                充值
                            </span>
                            </li>
                            <li className="n_t_cursor_color">
                            <span onClick={()=>this.onHashHistory('/financial/withdraw', 'financial', 1)}>
                                提款
                            </span>
                            </li>
                            <li className="n_t_cursor_color">
                            <span onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>
                                转账
                            </span>
                            </li>
                            <li>
                                <img src={service_icon} style={{verticalAlign: 'middle',marginRight: 5}}/>
                                <a href={stateVar.httpService} style={{display: 'inline-block'}} target="_blank">
                                    在线客服
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

HeaderTop.defaultProps = {
    noticeList:[{subject: '暂无公告'}],
};
