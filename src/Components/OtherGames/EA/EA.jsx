import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Fetch from '../../../Utils';
import emitter from '../../../Utils/events';
import {Modal, Input, Button} from 'antd';
import {stateVar} from '../../../State';
import CM_transfer from '../CM_transfer/CM_transfer';
import { onValidate } from '../../../CommonJs/common';

import './EA.scss';

import ea from './Img/ea.png';

let LOGIN_FLAG = true;
@observer
export default class EA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinLoading: false,
            loginFlag: true,
            btnLoading: false,
            selfVisible: false,
            visible: false, //模态框默认关闭
            eaPostData: {
                userName: '',
                email: '',
                phone: '',
                navname: '', // 真人娱乐, 体彩中心
            },
            validate: {
                userName: 2,// 0: 对， 1：错
                email: 2,
                phone: 2,
            }
        };
        this.hideModal = this.hideModal.bind(this);
        this.onTransfer = this.onTransfer.bind(this);
    };

    componentDidMount() {
        this._ismount = true;
    };

    componentWillUnmount() {
        this._ismount = false;
    };

    /*转账*/
    onTransfer(type, intoMoney, outMoney) {
        this.setState({spinLoading: true});
        let postData = {};
        if (type == 'into') {
            postData = {
                tran_from: 's',
                tran_to: 2,
                money: intoMoney,
                doFunToEa: 'ok'
            };
            Fetch.eagame({
                method: 'POST',
                body: JSON.stringify(postData),
            }).then((res)=>{
                if(this._ismount) {
                    this.setState({spinLoading: false});
                    if (res.status == 200) {
                        Modal.success({
                            title: res.shortMessage,
                        });
                        this.setState({visible: false});
                        emitter.emit('changeMoney', 'ea');
                    } else {
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            })
        } else {
            postData = {
                tran_from: 2,
                tran_to: 's',
                money: outMoney,
                doFunToEa: 'ok'
            }
        }
        Fetch.eagame({
            method: 'POST',
            body: JSON.stringify(postData),
        }).then((res) => {
            if (this._ismount) {
                this.setState({spinLoading: false});
                if (res.status == 200) {
                    Modal.success({
                        title: res.shortMessage,
                    });
                    this.setState({visible: false});
                    emitter.emit('changeMoney', 'ea');
                } else {
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })

    };

    /*关闭模态框*/
    hideModal() {
        this.setState({visible: false})
    };

    /*是否有权限进入Ea*/
    onEa() {
        Fetch.eagame({
            method: 'POST'
        }).then((res)=>{
            if(this._ismount){
                if(res.status == 200){
                    this.onLogin()
                }else{
                    let {eaPostData} = this.state;
                    eaPostData.navname = '真人娱乐';
                    if(res.shortMessage == '请填个人写资料'){
                        this.setState({
                            selfVisible: true,
                            eaPostData
                        })
                    }else{
                        Modal.warning({
                            title: res.shortMessage,
                        });
                    }
                }
            }
        })
    };
    /*开始游戏*/
    onLogin() {
        if (LOGIN_FLAG) {
            LOGIN_FLAG = false;
            let tempwindow;
            if (!stateVar.isApp) {
                tempwindow = window.open();
            }
            Fetch.eagame({
                method: 'POST',
                body: JSON.stringify({do: 'login'})
            }).then((res) => {
                LOGIN_FLAG = true;
                if (this._ismount && res.status == 200) {
                    if (stateVar.isApp) {
                        window.open(res.repsoneContent[0])
                    } else {
                        tempwindow.location.href = res.repsoneContent[0];
                    }
                }
            })
        }
    };
    onCancel(){
        let {eaPostData, validate} = this.state;
        eaPostData.userName = '';
        eaPostData.phone = '';
        eaPostData.email = '';
        validate.userName = 2;
        validate.phone = 2;
        validate.email = 2;
        this.setState({
            selfVisible: false,
            eaPostData,
            validate
        });
    };
    getAddUserInfo() {
        let {validate} = this.state,
            _this = this;
        if(validate.userName != 0 || validate.email != 0 || validate.phone != 0){
            if(validate.userName != 0){
                validate.userName = 1
            }
            if(validate.email != 0){
                validate.email = 1
            }
            if(validate.phone != 0){
                validate.phone = 1
            }
            this.setState({validate});
            return
        }

        this.setState({btnLoading: true});
        Fetch.addUserInfo({
            method: 'POST',
            body: JSON.stringify(this.state.eaPostData)
        }).then((res)=> {
            if (this._ismount) {
                this.setState({btnLoading: false});
                if(res.status == 200){
                    Modal.success({
                        title: res.shortMessage,
                        okText: "进入游戏",
                        onOk() {
                            _this.onEa()
                        },
                    });
                    this.onCancel();
                }else{
                    Modal.warning({
                        title: res.shortMessage,
                    });
                }
            }
        })
    };
    onChangeUserName(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value.replace(/\s/g, '');
        eaPostData.userName = val;
        let reg = /^[\u4e00-\u9fa5]+$/,
            r = reg.test(val);
        if(!r){
            validate.userName = 1
        }else{
            validate.userName = 0
        }
        this.setState({eaPostData});
    };
    onChangeEmail(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value;
        eaPostData.email = val;
        let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        let r = reg.test(val);
        if (r) {
            validate.email = 0;
        } else {
            validate.email = 1;
        }
        this.setState({eaPostData});
    };
    onChangePhone(e){
        let {eaPostData, validate} = this.state,
            val = e.target.value;
        eaPostData.phone = val;
        let reg = /^[0-9]{7,13}$/;
        let r = reg.test(val);
        if (r) {
            validate.phone = 0;
        } else {
            validate.phone = 1;
        }
        this.setState({eaPostData});
    };

    render() {
        const {selfVisible, eaPostData} = this.state;
        return (
            <div className="ea">
                <div className="ea_content">
                    <img className="ea_img" src={ea} alt=""/>
                    <i className="ea_transfer" onClick={() => this.setState({visible: true})}></i>
                    <p className="ea_balance">账号余额：{stateVar.allBalance.eabalance}元</p>
                    <i className="ea_start" onClick={() => this.onEa()}></i>
                </div>
                <CM_transfer title="EA"
                             visible={this.state.visible}
                             spinLoading={this.state.spinLoading}
                             hideModal={this.hideModal}
                             onTransfer={this.onTransfer}
                />
                <Modal
                    title="完善个人资料"
                    width={480}
                    wrapClassName="vertical-center-modal ea_content"
                    visible={selfVisible}
                    onCancel={()=>this.onCancel()}
                    footer={null}
                    maskClosable={false}
                >
                    <ul className="info_list">
                        <li>
                            <span>会员姓名：</span>
                            <Input placeholder="请输入会员姓名"
                                   value={eaPostData.userName}
                                   onChange={(e)=>this.onChangeUserName(e)}
                                   size="large"
                                   className={onValidate('userName', this.state.validate)}
                            />
                            <p>（由汉字组成，例如：张三）</p>
                        </li>
                        <li>
                            <span>邮件地址：</span>
                            <Input placeholder="请输入您的邮箱"
                                   value={eaPostData.email}
                                   onChange={(e)=>this.onChangeEmail(e)}
                                   size="large"
                                   className={onValidate('email', this.state.validate)}
                            />
                            <p>（例如：example@example.com）</p>
                        </li>
                        <li>
                            <span>联系电话：</span>
                            <Input placeholder="请输入您的电话"
                                   value={eaPostData.phone}
                                   onChange={(e)=>this.onChangePhone(e)}
                                   size="large"
                                   className={onValidate('phone', this.state.validate)}
                            />
                            <p>（7-13位数字，例如：8613800000000）</p>
                        </li>
                    </ul>
                    <div className="btn">
                        <Button type="primary"
                                onClick={()=>this.getAddUserInfo()}
                                loading={this.state.btnLoading}
                        >
                            提交
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
}
