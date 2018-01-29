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

import name_icon from './Img/name_icon.png';
import email_icon from './Img/email_icon.png';
import off_icon from './Img/off_icon.png';
import on_icon from './Img/on_icon.png';
import service_icon from './Img/service_icon.png';

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
        let speed = (((destination - this.state.noticePosition) * 1000) / (duration * 60)).toFixed(4);
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
                }else{

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
            if(this._ismount) {
                if (res.status == 200) {
                    stateVar.allBalance.cpbalance = res.repsoneContent;
                }
            }
        })
    };
    /*获取各平台余额*/
    getBalance(){
        Fetch.balance({method: 'POST'}).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {
                    let repsoneContent = res.repsoneContent,
                        allBalance = stateVar.allBalance;
                        allBalance.eabalance = repsoneContent.eabalance;
                        allBalance.ptbalance = repsoneContent.ptbalance;
                        allBalance.kgbalance = repsoneContent.kgbalance;
                        allBalance.bobingBalance = repsoneContent.bobingBalance;
                        allBalance.sbbalance = repsoneContent.sbbalance;
                        for(var key in allBalance){
                            if(typeof allBalance[key] == 'String'){
                                parseFloat(allBalance[key])
                            }
                            if(allBalance[key] < 0){
                                allBalance[key] = '0.00'
                            }
                        }
                    this.setState({
                        updateMLoading: false,
                    });
                }else{
                    // Modal.warning({
                    //     title: res.shortMessage,
                    // });
                }
            }
        })
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
            },
            onCancel() {
            },
        });

    }
    /*显示公告模态框*/
    showModal(item) {
        this.setState({
            noticeDetails: item,
            visible: true,
        },()=>clearInterval(this._clearInt));
    }
    /*隐藏公告模态框*/
    hideModal() {
        this.setState({
            visible: false,
        },()=>{
            // if(this._clearInt || this._animationFrame){
            //     clearInterval(this._clearInt);
            //     cancelAnimationFrame(this._animationFrame);
            //     this.getDestination()
            // }
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
    onOutModal() {
        if(!this.state.visible){
            // if(this._clearInt || this._animationFrame){
            //     clearInterval(this._clearInt);
            //     cancelAnimationFrame(this._animationFrame);
            //     this.getDestination()
            // }
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
    handleData(data){
    	var message = eval('('+ data +')');
    	if(message.status == 1){
    		let tempType = message.data.type;
    		if(tempType == 5){
    			this.getMenu();
    		}else if(tempType == 6){
    			this.getNotice();
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
        const { noticePosition } = this.state;
        return (
            <div className="nav_top">
           		<Websocket url='ws://10.63.15.242:9502' onMessage={this.handleData.bind(this)} onOpen={this.openWebsocket.bind(this)}
        			ref = {Websocket => {
                  	this.refWebSocket = Websocket;
                }}
        		/>
                <div className="nav_top_content">
                    <div className="n_t_lt left">
                        <div className="show-notice">
                            <ul className="notice-list left" style={{transform: 'translateY(-'+noticePosition+'px) translateZ(0px)'}}>
                                {
                                    this.state.noticeList.map((item)=>{
                                        return (
                                            <li key={item.id} onClick={()=>this.showModal(item)}
                                                onMouseOver={()=>{
                                                    clearInterval(this._clearInt);
                                                    cancelAnimationFrame(this._animationFrame)
                                                }}
                                                onMouseOut={()=>this.onOutModal()}>{item.subject}&nbsp;&nbsp;[点击查看]</li>
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
                    <ul className="n_t_list right">
                        <li className="n_t_cursor n_t_position">
                            <img src={name_icon} style={{verticalAlign: 'middle',marginRight: 5}}/>
                            { userInfo.sType == 'demo' ? '试玩用户' : userInfo.userName }
                            <Icon type="caret-down" style={{marginLeft: '5px'}}/>
                            <div className="n_t_controler">
                                <div className="n_t_drop_down">
                                    <ul className="n_t_down_list">
                                        <li>
                                            <span className="left">用户类型</span>
                                            <span className="right color_DFC674">{userInfo.userType == 0 ? '会员' : '代理'}</span>
                                        </li>
                                        <li>
                                            <span className="left">奖金组</span>
                                            <span className="right color_DFC674">{userInfo.accGroup}</span>
                                        </li>
                                        <li>
                                            <span className="left">上次登录地点</span>
                                            <span className="right color_DFC674">{userInfo.lastIp} {userInfo.address}</span>
                                        </li>
                                        <li>
                                            <span className="left">上次登录时间</span>
                                            <span className="right">{userInfo.lastTime}</span>
                                        </li>
                                        <li style={{textAlign: 'center'}}>
                                            <Button type="primary" icon="logout" onClick={()=>this.onLogout()}>
                                                退出登录
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className="n_t_message n_t_cursor">
                            <a href="javascript:void(0)" onClick={()=>this.onHashHistory('/account/message', 'account', 6)}>
                                <Badge count={stateVar.unread} overflowCount={99} showZero>
                                    <img src={email_icon} alt="站内信"/>
                                </Badge>
                            </a>
                        </li>
                        <li className="n_t_balance_p">
                            <span>余额：</span>
                            <span className="n_t_balance">
                                    <i>￥</i>
                                    <i>{this.state.hideBalance ? allBalance.cpbalance : '******'}</i>
                                    <img src={this.state.hideBalance ? on_icon : off_icon} onClick={()=>{this.setState({hideBalance: this.state.hideBalance ? false : true})}} className="n_t_hide_balance"/>
                                </span>
                            <div className="n_t_controler">
                                <div className="n_t_drop_down">
                                    <ul className="n_t_down_list">
                                        <li>
                                            <span className="left">彩票余额：</span>
                                            <span className="right color_DFC674">￥
                                                {allBalance.cpbalance}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">EA余额：</span>
                                            <span className="right color_DFC674">
                                                {allBalance.eabalance}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">PT余额：</span>
                                            <span className="right color_DFC674">
                                                {allBalance.ptbalance}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">GT余额：</span>
                                            <span className="right color_DFC674">
                                                {allBalance.kgbalance}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">博饼余额：</span>
                                            <span className="right color_DFC674">
                                                {allBalance.bobingBalance}
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">体育余额：</span>
                                            <span className="right color_DFC674">
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
                            </div>
                        </li>
                        <li className="n_t_cursor_color">
                            <a href="javascript:void(0)" onClick={()=>this.onHashHistory('/financial/recharge', 'financial', 0)}>
                                充值
                            </a>
                        </li>
                        <li className="n_t_cursor_color">
                            <a href="javascript:void(0)" onClick={()=>this.onHashHistory('/financial/withdraw', 'financial', 1)}>
                                提款
                            </a>
                        </li>
                        <li className="n_t_cursor_color">
                            <a href="javascript:void(0)" onClick={()=>this.onHashHistory('/financial/transfer', 'financial',3)}>
                                转账
                            </a>
                        </li>
                        <li>
                            <img src={service_icon} style={{verticalAlign: 'middle',marginRight: 5}}/>
                            <a href={stateVar.httpService} target="_blank">
                                在线客服
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

HeaderTop.defaultProps = {
    noticeList:[{subject: '暂无公告'}],
};
