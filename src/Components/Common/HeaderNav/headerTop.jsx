import React, {Component} from 'react';
import {observer} from 'mobx-react';
import { hashHistory } from 'react-router';
import Fetch from '../../../Utils';
import { Icon, Badge, Modal, Button } from 'antd';
const confirm = Modal.confirm;
import { stateVar } from '../../../State';
import './headerTop.scss'
import { removeStore,delCookie } from '../../../CommonJs/common';
import Notice from '../Notice/Notice'

import name_icon from './Img/name_icon.png';
import email_icon from './Img/email_icon.png';
import off_icon from './Img/off_icon.png';
import on_icon from './Img/on_icon.png';

const allBalance = {};
@observer
export default class HeaderTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideBalance : true,
            visible: false,
            allBalance: {
                cpbalance: 0, // 恒彩主账户
                eabalance: 0, // EA真人娱乐
                ptbalance: 0, // PT娱乐
                kgbalance: 0, // GT娱乐城
                bobingBalance: 0, // 博饼账户
                sbbalance: 0, // 体育
            },
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

    }
    move (destination, duration) { // 实现滚动动画
        let speed = ((destination - this.state.noticePosition) * 1000) / (duration * 60);
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
    }
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
                    Modal.warning({
                        title: res.shortMessage,
                    });
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
                    allBalance.cpbalance = res.repsoneContent;
                    stateVar.allBalance = allBalance;
                    this.setState({allBalance: allBalance});
                }
            }
        })
    };
    /*获取各平台余额*/
    getBalance(){
        Fetch.balance({method: 'POST'}).then((res)=>{
            if(this._ismount){
                if(res.status == 200) {
                    let repsoneContent = res.repsoneContent;
                        allBalance.eabalance = repsoneContent.eabalance;
                        allBalance.ptbalance = repsoneContent.ptbalance;
                        allBalance.kgbalance = repsoneContent.kgbalance;
                        allBalance.bobingBalance = repsoneContent.bobingBalance;
                        allBalance.sbbalance = repsoneContent.sbbalance;
                    stateVar.allBalance = allBalance;
                    this.setState({
                        updateMLoading: false,
                        allBalance: allBalance
                    });
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
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
                            removeStore('userName');
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
        },()=>this.getDestination());
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
            this.getDestination()
        }
    }
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
    }
    /*站内信*/
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
    render() {
        const { allBalance } = this.state;
        const userInfo = stateVar.userInfo;

        return (
            <div className="nav_top">
                <div className="nav_top_content">
                    <div className="n_t_lt left">
                        <div className="show-notice">
                            <ul className="notice-list left" style={{transform: 'translateY(-'+this.state.noticePosition+'px) translateZ(0px)'}}>
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
                                            <span className="right color_DFC674">{userInfo.userType === 0 ? '会员' : '代理'}</span>
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
                                                {
                                                    allBalance.cpbalance == undefined || allBalance.cpbalance<0? '0.00' : allBalance.cpbalance
                                                }
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">EA余额：</span>
                                            <span className="right color_DFC674">
                                                {
                                                    allBalance.eabalance == undefined || allBalance.eabalance<0 ? <Icon type="loading"> 加载中...</Icon> : '￥' + allBalance.eabalance
                                                }
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">PT余额：</span>
                                            <span className="right color_DFC674">
                                                {
                                                    allBalance.ptbalance == undefined || allBalance.ptbalance<0 ? <Icon type="loading"> 加载中...</Icon> : '￥' + allBalance.ptbalance
                                                }
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">GT余额：</span>
                                            <span className="right color_DFC674">
                                                {
                                                    allBalance.kgbalance == undefined || allBalance.kgbalance<0 ? <Icon type="loading"> 加载中...</Icon> :  '￥' + allBalance.kgbalance
                                                }
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">博饼余额：</span>
                                            <span className="right color_DFC674">
                                                {
                                                    allBalance.bobingBalance == undefined || allBalance.bobingBalance<0 ? <Icon type="loading"> 加载中...</Icon> :  '￥' + allBalance.bobingBalance
                                                }
                                            </span>
                                        </li>
                                        <li>
                                            <span className="left">体育余额：</span>
                                            <span className="right color_DFC674">
                                                {
                                                    allBalance.sbbalance == undefined || allBalance.sbbalance<0 ? <Icon type="loading"> 加载中...</Icon> :  '￥' + allBalance.sbbalance
                                                }
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
                    </ul>
                </div>
            </div>
        )
    }
}

HeaderTop.defaultProps = {
    noticeList:[{subject: '暂无公告'}],
};
